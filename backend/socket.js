import { Server } from "socket.io";
import CourseChat from "./models/CourseChat.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const liveQuizzes = new Map(); 

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

    // ================= CHAT LOGIC =================
    socket.on("join_course", ({ courseId }) => socket.join(`course_${courseId}`));

    socket.on("send_message", async ({ courseId, userId, message }) => {
        if (!message?.trim()) return;
        const chat = await CourseChat.create({ courseId, sender: userId, message, upvotes: 0, voters: [] });
        const populated = await chat.populate("sender", "name");
        io.to(`course_${courseId}`).emit("receive_message", populated);
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
        io.to(`course_${courseId}`).emit("message_upvoted", { messageId, upvotes: chat.upvotes, voters: chat.voters });
    });

    // ================= 🚀 LIVE QUIZ LOGIC =================

    // 1. TEACHER CREATES ROOM
    socket.on("host_create_quiz", ({ roomCode }, callback) => {
        liveQuizzes.set(roomCode, {
            hostSocket: socket.id,
            players: {},
            currentQuestion: null,
            active: true
        });
        socket.join(roomCode);
        console.log(`🎓 Quiz Room Created: ${roomCode}`);
        if (typeof callback === "function") callback({ status: "success" });
    });

    // 2. STUDENT JOINS ROOM (🔥 Updated with strict callbacks)
    socket.on("student_join_quiz", ({ roomCode, name }, callback) => {
        console.log(`Student ${name} attempting to join ${roomCode}`);
        const room = liveQuizzes.get(roomCode);
        
        if (room && room.active) {
            socket.join(roomCode);
            room.players[socket.id] = { name, score: 0, answers: [] };
            
            // Notify Teacher
            io.to(room.hostSocket).emit("player_joined", { 
                count: Object.keys(room.players).length,
                name 
            });
            
            // Confirm to Student via Callback
            socket.emit("join_success", { roomCode });
            if (typeof callback === "function") callback({ status: "success" });
        } else {
            console.log(`Failed: Room ${roomCode} not found.`);
            socket.emit("error_msg", { message: "Room not found or inactive" });
            if (typeof callback === "function") callback({ status: "error", message: "Room not found. Make sure the teacher's room is active." });
        }
    });

    // 3. TEACHER LAUNCHES QUESTION
    socket.on("host_push_question", ({ roomCode, questionData }) => {
        const room = liveQuizzes.get(roomCode);
        if (room) {
            room.currentQuestion = { ...questionData, startTime: Date.now() };
            Object.values(room.players).forEach(p => p.currentAnswer = null);
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
            if (player && player.currentAnswer === undefined) { 
                player.currentAnswer = answerIndex;
                const isCorrect = answerIndex === room.currentQuestion.correctIndex;
                if (isCorrect) {
                    const timeTaken = (Date.now() - room.currentQuestion.startTime) / 1000;
                    const points = Math.max(10, 100 - (timeTaken * 2)); 
                    player.score += Math.round(points);
                }
                io.to(room.hostSocket).emit("live_answer_update", {
                    totalAnswers: Object.values(room.players).filter(p => p.currentAnswer !== undefined).length
                });
            }
        }
    });

    // 5. TEACHER ENDS QUESTION
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
            leaderboard.sort((a, b) => b.score - a.score);
            const top5 = leaderboard.slice(0, 5);

            io.to(roomCode).emit("question_results", {
                correctIndex: room.currentQuestion.correctIndex,
                stats,
                leaderboard: top5
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
  });
};