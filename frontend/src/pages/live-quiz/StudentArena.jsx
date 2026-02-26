import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { serverUrl } from '../../App';

let socket;

const StudentArena = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  
  const [joined, setJoined] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [socketError, setSocketError] = useState(""); // 🚨 NEW: Track CORS/Connection errors
  
  // Game State
  const [activeQ, setActiveQ] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    // 🛠 STRICT WEBSOCKET CONNECTION (Bypasses some CORS HTTP polling issues)
    socket = io(serverUrl, {
        transports: ["websocket"], // Force websockets only to avoid polling CORS
        withCredentials: true,
        reconnectionAttempts: 5
    });

    // 🚨 NEW: Catch and display connection/CORS errors on the screen
    socket.on("connect_error", (err) => {
        console.error("Socket Connection Error:", err.message);
        setSocketError(`Connection Failed: ${err.message}. (Check Backend CORS)`);
    });

    socket.on("connect", () => {
        setSocketError(""); // Clear errors on successful connect
    });

    socket.on("join_success", () => setJoined(true));
    
    socket.on("receive_question", (data) => {
        setActiveQ(data);
        setSubmitted(false);
        setSelectedOption(null);
        setResultData(null);
    });

    socket.on("question_results", (data) => {
        setResultData(data);
        setActiveQ(null);
    });

    // Cleanup on unmount
    return () => {
        if (socket) socket.disconnect();
    };
  }, []);

  const joinRoom = () => {
      if(!inputCode) return;
      socket.emit("student_join_quiz", { roomCode: inputCode, name: userData?.name || "Guest" });
  };

  const submitAnswer = (index) => {
      if(submitted) return;
      socket.emit("student_submit_answer", { roomCode: inputCode, answerIndex: index });
      setSelectedOption(index);
      setSubmitted(true);
  };

  // ================= JOIN SCREEN =================
  if (!joined) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="absolute top-8 font-bold text-slate-400 tracking-widest text-sm flex items-center gap-2">
             <div className="w-3 h-3 bg-green-500 rounded-sm rotate-45"></div>
             LiveArena Student
        </div>
        
        <div className="bg-slate-800 p-8 rounded-3xl text-center w-full max-w-md border border-slate-700 shadow-2xl">
          <h1 className="text-3xl text-white font-black mb-2">Join Battle</h1>
          <p className="text-slate-400 mb-6">Enter the code on the screen</p>
          
          {/* 🚨 ERROR BANNER UI 🚨 */}
          {socketError && (
              <div className="bg-rose-500/10 border border-rose-500 text-rose-400 p-3 rounded-xl mb-6 text-sm font-bold">
                  {socketError}
              </div>
          )}

          <input 
            className="w-full p-4 rounded-xl bg-slate-900 text-white mb-6 text-center text-3xl font-mono tracking-[0.5em] border border-slate-600 focus:border-green-500 focus:outline-none uppercase"
            placeholder="1234"
            maxLength={4}
            value={inputCode} 
            onChange={e => setInputCode(e.target.value)}
          />
          <button 
            onClick={joinRoom} 
            disabled={!!socketError} // Disable button if socket is broken
            className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg 
                ${socketError ? 'bg-slate-600 cursor-not-allowed opacity-50' : 'bg-green-600 hover:bg-green-500 hover:scale-[1.02] shadow-green-600/30'}
            `}>
            {socketError ? "Reconnecting..." : "Enter Room"}
          </button>
        </div>
      </div>
    );
  }

  // ================= GAME SCREEN =================
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
      
      {/* 1. ACTIVE QUESTION VIEW */}
      {activeQ ? (
        <div className="w-full max-w-2xl mt-12">
          <div className="mb-10 text-center">
             <h2 className="text-3xl font-bold mb-4 text-slate-100">{activeQ.question}</h2>
             <div className="inline-block px-4 py-2 bg-slate-800 rounded-full text-amber-400 font-bold text-sm border border-slate-700">
               ⏳ Quick, choose an option!
             </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {activeQ.options.map((opt, i) => (
                 <button 
                    key={i}
                    onClick={() => submitAnswer(i)}
                    disabled={submitted}
                    className={`p-6 rounded-2xl text-xl font-bold transition-all transform 
                        ${submitted && selectedOption === i ? 'bg-slate-700 border-4 border-slate-400 opacity-100 scale-95' : ''}
                        ${submitted && selectedOption !== i ? 'bg-slate-800 opacity-40 cursor-not-allowed' : ''}
                        ${!submitted ? (
                          i === 0 ? 'bg-rose-500 hover:bg-rose-400 hover:-translate-y-1 shadow-[0_8px_0_rgb(159,18,57)]' : 
                          i === 1 ? 'bg-emerald-500 hover:bg-emerald-400 hover:-translate-y-1 shadow-[0_8px_0_rgb(6,95,70)]' : 
                          i === 2 ? 'bg-blue-500 hover:bg-blue-400 hover:-translate-y-1 shadow-[0_8px_0_rgb(30,58,138)]' : 
                                    'bg-amber-500 hover:bg-amber-400 hover:-translate-y-1 shadow-[0_8px_0_rgb(146,64,14)]'
                        ) : 'shadow-none translate-y-2'}
                    `}
                 >
                    {opt || `Option ${i+1}`}
                 </button>
             ))}
          </div>
          {submitted && <p className="text-center mt-8 text-slate-400 font-bold animate-pulse">Answer locked! Waiting for others...</p>}
        </div>

      ) : resultData ? (
        
        // 2. RESULTS VIEW
        <div className="w-full max-w-md mt-12 animate-fade-in">
           <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl text-center mb-8">
               
               {/* Feedback Logic */}
               {selectedOption === null ? (
                   <div>
                       <div className="text-6xl mb-4">⏳</div>
                       <h1 className="text-3xl font-black text-slate-400 mb-2">You Missed!</h1>
                       <p className="text-slate-500">You ran out of time.</p>
                   </div>
               ) : selectedOption === resultData.correctIndex ? (
                   <div>
                       <div className="text-6xl mb-4">🎉</div>
                       <h1 className="text-3xl font-black text-emerald-400 mb-2">Correct!</h1>
                       <p className="text-slate-400">Awesome job!</p>
                   </div>
               ) : (
                   <div>
                       <div className="text-6xl mb-4">❌</div>
                       <h1 className="text-3xl font-black text-rose-500 mb-2">Wrong!</h1>
                       <p className="text-slate-400">Better luck next time.</p>
                   </div>
               )}

               <div className="mt-8 pt-6 border-t border-slate-700">
                   <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">Correct Answer Was</p>
                   <p className="text-xl font-bold text-white">Option {resultData.correctIndex + 1}</p>
               </div>
           </div>

           {/* STUDENT LEADERBOARD */}
           <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
               <h3 className="text-lg font-bold text-amber-400 mb-4 text-center">🏆 Live Leaderboard</h3>
               <ul className="space-y-3">
                 {resultData.leaderboard.map((p, i) => (
                   <li key={i} className={`flex justify-between items-center p-3 rounded-xl ${p.name === (userData?.name || "Guest") ? 'bg-slate-700 border border-slate-500' : 'bg-slate-900 border border-slate-700/50'}`}>
                     <span className="font-bold text-slate-200">
                       <span className="text-slate-500 mr-2">#{i + 1}</span>
                       {p.name} {p.name === (userData?.name || "Guest") && "(You)"}
                     </span>
                     <span className="font-mono font-bold text-emerald-400">{p.score} XP</span>
                   </li>
                 ))}
               </ul>
           </div>
        </div>

      ) : (

        // 3. WAITING VIEW
        <div className="text-center mt-32">
           <div className="w-16 h-16 border-4 border-slate-700 border-t-green-500 rounded-full animate-spin mx-auto mb-6"></div>
           <h2 className="text-2xl font-bold text-white mb-2">You are in!</h2>
           <p className="text-slate-400">Look at the screen. Waiting for the host to launch the question...</p>
        </div>
      )}
    </div>
  );
};

export default StudentArena;