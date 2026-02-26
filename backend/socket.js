import { Server } from "socket.io";
import CourseChat from "./models/CourseChat.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// IN-MEMORY STATE FOR LIVE QUIZZES (No Database needed for temporary live state)
const liveQuizzes = new Map(); 
// Structure: { roomId: { hostSocket, players: { socketId: { name, score, answers } }, currentQuestion: {}, active: bool } }

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // ================= EXISTING CHAT LOGIC (Keep this) =================
    socket.on("join_course", ({ courseId }) => {
      socket.join(`course_${courseId}`);
    });

    socket.on("send_message", async ({ courseId, userId, userName, message }) => {
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

    // ================= 🚀 NEW LIVE QUIZ ARENA LOGIC =================

    // 1. TEACHER CREATES ROOM
    socket.on("host_create_quiz", ({ roomCode }) => {
        liveQuizzes.set(roomCode, {
            hostSocket: socket.id,
            players: {},
            currentQuestion: null,
            active: true
        });
        socket.join(roomCode);
        console.log(`🎓 Quiz Room Created: ${roomCode}`);
    });

    // 2. STUDENT JOINS ROOM
    socket.on("student_join_quiz", ({ roomCode, name }) => {
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
        } else {
            socket.emit("error_msg", { message: "Room not found or inactive" });
        }
    });

    // 3. TEACHER LAUNCHES QUESTION
    socket.on("host_push_question", ({ roomCode, questionData }) => {
        // questionData = { question, options: [], timeLimit, correctIndex }
        const room = liveQuizzes.get(roomCode);
        if (room) {
            room.currentQuestion = { ...questionData, startTime: Date.now() };
            // Clear previous answers for this round
            Object.values(room.players).forEach(p => p.currentAnswer = null);
            
            // Send to Students (Hide correct answer!)
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
            if (player && player.currentAnswer === undefined) { // Prevent double submit
                player.currentAnswer = answerIndex;
                
                // Calculate Score (Speed Bonus)
                const isCorrect = answerIndex === room.currentQuestion.correctIndex;
                if (isCorrect) {
                    const timeTaken = (Date.now() - room.currentQuestion.startTime) / 1000;
                    const points = Math.max(10, 100 - (timeTaken * 2)); // Simple alg
                    player.score += Math.round(points);
                }

                // Send immediate feedback to teacher (for live counter)
                io.to(room.hostSocket).emit("live_answer_update", {
                    totalAnswers: Object.values(room.players).filter(p => p.currentAnswer !== undefined).length
                });
            }
        }
    });

    // 5. TEACHER ENDS QUESTION (SHOW RESULTS)
    socket.on("host_show_results", ({ roomCode }) => {
        const room = liveQuizzes.get(roomCode);
        if (room) {
            // Calculate Histogram
            const stats = [0, 0, 0, 0]; // Counts for Option 0, 1, 2, 3
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
        // Cleanup logic if needed
        console.log("🔴 User disconnected:", socket.id);
    });
  });
};