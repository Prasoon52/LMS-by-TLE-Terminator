// frontend/src/pages/live-quiz/TeacherArena.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { serverUrl } from '../../App';
import { setRoomCode, updatePlayerCount, setResults } from '../../redux/liveQuizSlice';

let socket;

const TeacherArena = () => {
  const dispatch = useDispatch();
  const { roomCode, playersCount, liveStats, leaderboard } = useSelector((state) => state.liveQuiz);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isLive, setIsLive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  const barColors = ["bg-rose-500", "bg-emerald-500", "bg-blue-500", "bg-amber-500"];
  const maxVotes = Math.max(...liveStats, 1);

  useEffect(() => {
    socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true
    });

    socket.on("connect", () => {
      setConnectionStatus("Connected 🟢");
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      dispatch(setRoomCode(code));
      socket.emit("host_create_quiz", { roomCode: code }, (res) => {
        if (res?.status === "success") console.log("Room created");
      });
    });

    socket.on("connect_error", (err) => {
      setConnectionStatus(`Disconnected 🔴 (${err.message})`);
    });

    socket.on("player_joined", (data) => {
      dispatch(updatePlayerCount(data.count));
    });

    socket.on("live_answer_update", (data) => {
      // optional: show a counter
    });

    return () => socket.disconnect();
  }, [dispatch]);

  const launchQuestion = () => {
    if (!question) return alert("Enter a question!");
    setIsLive(true);
    socket.emit("host_push_question", {
      roomCode,
      questionData: { question, options, timeLimit: timer, correctIndex }
    });
  };

  const endQuestion = () => {
    setIsLive(false);
    socket.emit("host_show_results", { roomCode });
    socket.on("question_results", (data) => {
      dispatch(setResults(data));
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Live Class Arena
            </h1>
            <p className="text-slate-400">Host Dashboard</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-slate-800 px-6 py-2 rounded-2xl border border-slate-700">
              <span className="text-xs text-slate-400 uppercase">Room</span>
              <span className="ml-2 font-mono text-3xl font-black text-amber-400">{roomCode}</span>
            </div>
            <div className="bg-slate-800 px-6 py-2 rounded-2xl border border-slate-700">
              <span className="text-xs text-slate-400 uppercase">Players</span>
              <span className="ml-2 text-3xl font-black text-white">{playersCount}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-800 p-6 rounded-[2rem] border border-slate-700">
              <h2 className="text-xl font-bold mb-4">📝 Create Question</h2>
              <textarea
                className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl mb-4 text-white resize-none h-28"
                placeholder="What is your question?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <div className="space-y-3 mb-6">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center relative">
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg ${barColors[i]}`} />
                    <input
                      className={`w-full bg-slate-900 border ${i === correctIndex ? 'border-green-500' : 'border-slate-700'} p-3 pl-6 rounded-lg text-white`}
                      placeholder={`Option ${i+1}`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[i] = e.target.value;
                        setOptions(newOpts);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-700">
                  <label className="text-sm font-bold text-slate-400 uppercase">Correct Option</label>
                  <select
                    className="bg-slate-800 text-white p-2 rounded-lg border border-slate-600"
                    value={correctIndex}
                    onChange={(e) => setCorrectIndex(Number(e.target.value))}
                  >
                    <option value={0}>Option 1</option>
                    <option value={1}>Option 2</option>
                    <option value={2}>Option 3</option>
                    <option value={3}>Option 4</option>
                  </select>
                </div>
                {!isLive ? (
                  <button
                    onClick={launchQuestion}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-xl font-black text-lg shadow-lg hover:scale-[1.02] transition"
                  >
                    🚀 Launch Question
                  </button>
                ) : (
                  <button
                    onClick={endQuestion}
                    className="w-full bg-rose-600 py-4 rounded-xl font-black text-lg shadow-lg animate-pulse hover:scale-[1.02] transition"
                  >
                    🛑 Stop & Show Results
                  </button>
                )}
              </div>
            </div>

            {/* Leaderboard Widget */}
            {leaderboard.length > 0 && (
              <div className="bg-slate-800 p-6 rounded-[2rem] border border-slate-700">
                <h3 className="text-lg font-bold text-amber-400 mb-4">🏆 Top Performers</h3>
                <ul className="space-y-3">
                  {leaderboard.map((p, i) => (
                    <li key={i} className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-700/50">
                      <span><span className="text-slate-500 mr-2">#{i+1}</span>{p.name}</span>
                      <span className="font-mono text-emerald-400">{p.score} XP</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Graph */}
          <div className="lg:col-span-8 bg-[#FDFDFC] text-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl min-h-[500px] flex flex-col">
            <div className="absolute top-6 right-8 font-bold text-slate-300 tracking-widest text-sm flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-sm rotate-45"></div>
              LiveArena
            </div>
            <h2 className="text-3xl md:text-5xl font-medium text-center mt-8 mb-16 text-slate-800 leading-tight">
              {question || "Waiting to launch..."}
            </h2>
            <div className="flex-1 flex items-end justify-center gap-4 sm:gap-12 md:gap-20 border-b-2 border-slate-200 pb-0 relative">
              {liveStats.map((count, i) => {
                const heightPercent = count === 0 ? 0 : (count / maxVotes) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-[350px] group relative">
                    <span className={`text-4xl font-medium mb-3 transition-all duration-1000 ${count > 0 ? 'text-slate-700' : 'text-slate-300'}`}>
                      {count}
                    </span>
                    <div
                      className={`w-full max-w-[100px] rounded-t-lg transition-all duration-1000 ease-out ${barColors[i]} opacity-90 group-hover:opacity-100`}
                      style={{ height: `${heightPercent}%`, minHeight: count > 0 ? '12px' : '0px' }}
                    />
                    <div className={`w-[120%] h-[4px] absolute bottom-0 translate-y-[2px] rounded-full ${barColors[i]}`} />
                    <div className="absolute top-full mt-4 w-[150%] text-center px-2">
                      <span className="text-lg font-medium text-slate-600 line-clamp-2">
                        {options[i] || `Option ${i+1}`}
                      </span>
                      {!isLive && i === correctIndex && (
                        <div className="mt-2 text-emerald-500 font-bold flex items-center justify-center gap-1">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Correct
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="h-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherArena;