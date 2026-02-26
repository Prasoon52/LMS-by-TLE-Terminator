import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomCode: null,
  isHost: false,
  playersCount: 0,
  currentQuestion: null,
  quizStatus: "idle", // idle, waiting, active, results
  liveStats: [0, 0, 0, 0],
  leaderboard: [],
  myScore: 0,
};

const liveQuizSlice = createSlice({
  name: "liveQuiz",
  initialState,
  reducers: {
    setRoomCode: (state, action) => {
      state.roomCode = action.payload;
    },
    setHost: (state) => {
      state.isHost = true;
    },
    updatePlayerCount: (state, action) => {
      state.playersCount = action.payload;
    },
    setQuestion: (state, action) => {
      state.currentQuestion = action.payload;
      state.quizStatus = "active";
    },
    setResults: (state, action) => {
        state.quizStatus = "results";
        state.liveStats = action.payload.stats;
        state.leaderboard = action.payload.leaderboard;
    },
    resetQuizState: () => initialState,
  },
});

export const { setRoomCode, setHost, updatePlayerCount, setQuestion, setResults, resetQuizState } = liveQuizSlice.actions;
export default liveQuizSlice.reducer;