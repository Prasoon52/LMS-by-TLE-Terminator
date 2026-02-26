import { Server } from "socket.io";
import CourseChat from "./models/CourseChat.js";
import LiveQuizResult from "./models/LiveQuizResult.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// In-memory store for active quizzes
const liveQuizzes = new Map(); 
// Structure: {
//   roomCode: {
//     hostSocket: socketId,
//     players: { socketId: { userId, name, score, answers: [] } },
//     currentQuestion: { question, options, correctIndex, timeLimit, startTime },
//     active: boolean
//   }
// }

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
    transports: ["websocket", "polling"], // important for deployment
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

    // 1. TEACHER CREATES ROOM (with callback for confirmation)
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

    // 2. STUDENT JOINS ROOM (with callback for error handling)
    socket.on("student_join_quiz", ({ roomCode, name, userId }, callback) => {
      const room = liveQuizzes.get(roomCode);
      if (room && room.active) {
        socket.join(roomCode);
        room.players[socket.id] = { userId, name, score: 0, answers: [] };
        
        io.to(room.hostSocket).emit("player_joined", { 
          count: Object.keys(room.players).length,
          name 
        });
        
        socket.emit("join_success", { roomCode });
        if (typeof callback === "function") callback({ status: "success" });
      } else {
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
        
        io.to(roomCode).emit("receive_question", {
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
          const timeTaken = Date.now() - room.currentQuestion.startTime;
          player.currentAnswer = answerIndex;
          player.responseTime = timeTaken;
          
          const isCorrect = answerIndex === room.currentQuestion.correctIndex;
          let points = 0;
          if (isCorrect) {
            // speed bonus: more points for faster answers
            const maxPoints = 100;
            const decay = Math.min(timeTaken / 1000, room.currentQuestion.timeLimit) / room.currentQuestion.timeLimit;
            points = Math.round(maxPoints * (1 - decay * 0.5)); // at least 50 points if correct
            player.score += points;
          }
          player.answers.push({
            questionIndex: 0, // could track multiple questions if needed
            answerIndex,
            isCorrect,
            points,
            timeTaken
          });

          io.to(room.hostSocket).emit("live_answer_update", {
            totalAnswers: Object.values(room.players).filter(p => p.currentAnswer !== undefined).length
          });
        }
      }
    });

    // 5. TEACHER ENDS QUESTION (SHOW RESULTS & SAVE TO DB)
    socket.on("host_show_results", async ({ roomCode }) => {
      const room = liveQuizzes.get(roomCode);
      if (!room) return;

      const stats = [0, 0, 0, 0];
      const leaderboard = [];
      const participantsData = [];

      Object.entries(room.players).forEach(([socketId, p]) => {
        if (p.currentAnswer !== undefined) {
          stats[p.currentAnswer]++;
        }
        leaderboard.push({ name: p.name, score: p.score });
        // Prepare participant data for DB
        participantsData.push({
          userId: p.userId,
          name: p.name,
          answerIndex: p.currentAnswer,
          isCorrect: p.currentAnswer === room.currentQuestion.correctIndex,
          score: p.answers.length ? p.answers[p.answers.length-1].points : 0,
          responseTime: p.responseTime
        });
      });

      leaderboard.sort((a, b) => b.score - a.score);
      const top5 = leaderboard.slice(0, 5);

      // Save round results to database
      try {
        const result = new LiveQuizResult({
          roomCode,
          question: room.currentQuestion.question,
          options: room.currentQuestion.options,
          correctIndex: room.currentQuestion.correctIndex,
          timeLimit: room.currentQuestion.timeLimit,
          startedAt: new Date(room.currentQuestion.startTime),
          endedAt: new Date(),
          participants: participantsData,
          stats: {
            totalPlayers: Object.keys(room.players).length,
            answeredCount: participantsData.length,
            optionCounts: stats
          }
        });
        await result.save();
        console.log(`📊 Quiz result saved for room ${roomCode}`);
      } catch (error) {
        console.error("Failed to save quiz result:", error);
      }

      io.to(roomCode).emit("question_results", {
        correctIndex: room.currentQuestion.correctIndex,
        stats,
        leaderboard: top5
      });
    });

    // 6. DISCONNECT – optional cleanup
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
      // Clean up rooms if host disconnects? Could be handled separately.
    });
  });
};