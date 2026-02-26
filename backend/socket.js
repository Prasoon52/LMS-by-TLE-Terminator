import { Server } from "socket.io";
import CourseChat from "./models/CourseChat.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// IN-MEMORY STATE FOR LIVE QUIZZES
const liveQuizzes = new Map(); 
// Structure: { roomId: { hostSocket, players: { socketId: { name, score, currentAnswer } }, currentQuestion: { ...startTime }, active: bool } }

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "https://lms-by-tle-terminator.vercel.app" 
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // ================= EXISTING CHAT LOGIC =================
    socket.on("join_course", ({ courseId }) => {
      socket.join(`course_${courseId}`);
    });

    socket.on("send_message", async ({ courseId, userId, message }) => {
        if (!message?.trim()) return;
        const chat = await CourseChat.create({
          courseId, sender: userId, message, upvotes: 0, voters: [],
        });
        const populated = await chat.populate("sender", "name");
        io.to(`course_${courseId}`).emit("receive_message", {
          _id: populated._id, courseId, sender: populated.sender, message: populated.message,
          upvotes: populated.upvotes, voters: populated.voters, createdAt: populated.createdAt,
        });
    });

    socket.on("upvote_message", async ({ messageId, courseId, userId }) => {
        if (!mongoose.Types.ObjectId.isValid(messageId)) return;
        const chat = await CourseChat.findById(messageId);
        if (!chat) return;
        const hasUpvoted = chat.voters.some((id) => id.toString() === userId);
        if (hasUpvoted) {
          chat.voters = chat.voters.filter((id) => id.toString() !== userId);
          chat.upvotes = Math.max(0, chat.upvotes - 1);
        } else {
          chat.voters.push(userId);
          chat.upvotes += 1;
        }
        await chat.save();
        io.to(`course_${courseId}`).emit("message_upvoted", {
          messageId, upvotes: chat.upvotes, voters: chat.voters,
        });
    });

    // ================= 🚀 LIVE QUIZ ARENA LOGIC =================

    // 1. TEACHER CREATES ROOM (🔥 Now with Callback!)
    socket.on("host_create_quiz", ({ roomCode }, callback) => {
        liveQuizzes.set(roomCode, {
            hostSocket: socket.id,
            players: {},
            currentQuestion: null,
            active: true
        });
        socket.join(roomCode);
        console.log(`🎓 Quiz Room Created: ${roomCode}`);
        
        // This is what turns the Red button into the Room Code!
        if (typeof callback === "function") {
            callback({ status: "success" });
        }
    });

    // 2. STUDENT JOINS ROOM (🔥 Now with strict Error Catching!)
    socket.on("student_join_quiz", ({ roomCode, name }, callback) => {
        const room = liveQuizzes.get(roomCode);
        if (room && room.active) {
            socket.join(roomCode);
            room.players[socket.id] = { name, score: 0, answers: [] };
            
            // Notify Teacher
            io.to(room.hostSocket).emit("player_joined", { 
                count: Object.keys(room.players).length,
                name 
            });
            
            // Confirm to Student
            socket.emit("join_success", { roomCode });
            if (typeof callback === "function") callback({ status: "success" });
        } else {
            // Room doesn't exist
            socket.emit("error_msg", { message: "Room not found or inactive" });
            if (typeof callback === "function") {
                callback({ status: "error", message: "Room not found. Ensure the Teacher's room is active." });
            }
        }
    });

    // 3. TEACHER LAUNCHES QUESTION
    socket.on("host_push_question", ({ roomCode, questionData }) => {
        const room = liveQuizzes.get(roomCode);
        if (room) {
            room.currentQuestion = { ...questionData, startTime: Date.now() };
            // Clear previous answers for this round
            Object.values(room.players).forEach(p => p.currentAnswer = null);
            
            // Send to Students
            socket.to(roomCode).emit("receive_question", {
                question: questionData.question,
                options: questionData.options,
                timeLimit: questionData.timeLimit
            });
        }
    });

    // 4. STUDENT SUBMITS ANSWER
    socket.on("student_submit_answer", ({ roomCode, answerIndex }) => {
        const room = liveQuizzes.get(roomCode);
        if (room && room.currentQuestion) {
            const player = room.players[socket.id];
            if (player && (player.currentAnswer === undefined || player.currentAnswer === null)) { 
                player.currentAnswer = answerIndex;
                
                // Calculate Score (Speed Bonus)
                const isCorrect = answerIndex === room.currentQuestion.correctIndex;
                if (isCorrect) {
                    const timeTaken = (Date.now() - room.currentQuestion.startTime) / 1000;
                    const points = Math.max(10, 100 - (timeTaken * 2)); 
                    player.score += Math.round(points);
                }

                // Send immediate feedback to teacher
                io.to(room.hostSocket).emit("live_answer_update", {
                    totalAnswers: Object.values(room.players).filter(p => p.currentAnswer !== undefined && p.currentAnswer !== null).length
                });
            }
        }
    });

    // 5. TEACHER ENDS QUESTION (SHOW RESULTS)
    socket.on("host_show_results", ({ roomCode }) => {
        const room = liveQuizzes.get(roomCode);
        if (room) {
            const stats = [0, 0, 0, 0]; 
            const leaderboard = [];

            Object.values(room.players).forEach(p => {
                if (p.currentAnswer !== undefined && p.currentAnswer !== null) {
                    stats[p.currentAnswer]++;
                }
                leaderboard.push({ name: p.name, score: p.score });
            });

            // Sort Leaderboard
            leaderboard.sort((a, b) => b.score - a.score);
            const top5 = leaderboard.slice(0, 5);

            // Send Results to Everyone
            io.to(roomCode).emit("question_results", {
                correctIndex: room.currentQuestion.correctIndex,
                stats,
                leaderboard: top5
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
        // Optional: Could add logic here to clean up empty rooms
    });
  });
};