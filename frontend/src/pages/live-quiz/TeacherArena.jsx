import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { serverUrl } from '../../App';
import { setRoomCode, updatePlayerCount, setResults } from '../../redux/liveQuizSlice';

let socket;

const TeacherArena = () => {
  const dispatch = useDispatch();
  const { roomCode, playersCount, liveStats, leaderboard } = useSelector(state => state.liveQuiz);
  
  // Question Form State
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
   socket = io(serverUrl, {
    transports: ["websocket", "polling"], // Forces websockets first
    withCredentials: true
});
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    dispatch(setRoomCode(code));

    socket.emit("host_create_quiz", { roomCode: code });

    socket.on("player_joined", (data) => {
      dispatch(updatePlayerCount(data.count));
    });

    socket.on("live_answer_update", (data) => {
       // Optional: Show how many answered in real-time
    });

    return () => socket.disconnect();
  }, []);

  const launchQuestion = () => {
    if(!question) return alert("Enter a question!");
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-400">🎮 Live Class Arena (Host)</h1>
        <div className="bg-purple-800 px-6 py-2 rounded-lg text-xl">
          Room Code: <span className="font-mono font-bold text-yellow-300">{roomCode}</span>
        </div>
        <div className="text-xl">👥 Students: {playersCount}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT: Controls */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">📝 Create Question</h2>
          <textarea 
            className="w-full bg-gray-700 p-3 rounded mb-4" 
            placeholder="Type question here..." 
            value={question} onChange={e => setQuestion(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2 mb-4">
            {options.map((opt, i) => (
                <input 
                    key={i}
                    className={`bg-gray-700 p-2 rounded border-l-4 ${i === correctIndex ? 'border-green-500' : 'border-gray-500'}`}
                    placeholder={`Option ${i+1}`}
                    value={opt} onChange={e => {
                        const newOpts = [...options]; newOpts[i] = e.target.value; setOptions(newOpts);
                    }}
                />
            ))}
          </div>
          <div className="flex gap-4 items-center mb-6">
             <label>Correct Answer:</label>
             <select className="bg-gray-700 p-2 rounded" onChange={e => setCorrectIndex(Number(e.target.value))}>
                 <option value={0}>Option 1</option>
                 <option value={1}>Option 2</option>
                 <option value={2}>Option 3</option>
                 <option value={3}>Option 4</option>
             </select>
             <button onClick={launchQuestion} disabled={isLive} className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded font-bold ml-auto">
                 {isLive ? "Live Now..." : "🚀 Launch Question"}
             </button>
             {isLive && (
                 <button onClick={endQuestion} className="bg-red-600 px-6 py-2 rounded font-bold">
                     🛑 Stop & Show Results
                 </button>
             )}
          </div>
        </div>

        {/* RIGHT: Live Stats & Graph */}
        <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl mb-4">📊 Live Results</h2>
            
            {/* Simple CSS Bar Graph */}
            <div className="flex items-end h-64 gap-4 mb-6 border-b border-gray-600 pb-2">
                {liveStats.map((count, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                            className="w-full bg-blue-500 rounded-t transition-all duration-500" 
                            style={{ height: `${Math.max(count * 10, 5)}%` }} // Scale height
                        ></div>
                        <span className="mt-2 font-bold">{count}</span>
                        <span className="text-sm text-gray-400">Opt {i+1}</span>
                    </div>
                ))}
            </div>

            <h3 className="text-lg font-bold text-yellow-400 mb-2">🏆 Top 5 Leaderboard</h3>
            <ul>
                {leaderboard.map((p, i) => (
                    <li key={i} className="flex justify-between border-b border-gray-700 py-2">
                        <span>#{i+1} {p.name}</span>
                        <span className="font-mono text-green-400">{p.score} XP</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherArena;