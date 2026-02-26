import mongoose from 'mongoose';

const liveQuizResultSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, index: true },
  question: { type: String, required: true },
  options: [{ type: String }],
  correctIndex: { type: Number, required: true },
  timeLimit: Number,
  startedAt: Date,
  endedAt: Date,
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    answerIndex: Number,
    isCorrect: Boolean,
    score: Number,
    responseTime: Number, // milliseconds
  }],
  stats: {
    totalPlayers: Number,
    answeredCount: Number,
    optionCounts: [Number],
  }
}, { timestamps: true });

export default mongoose.model('LiveQuizResult', liveQuizResultSchema);