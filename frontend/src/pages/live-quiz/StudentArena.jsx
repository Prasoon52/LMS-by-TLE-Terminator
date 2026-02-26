import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { serverUrl } from '../../App';
import { setQuestion, setResults } from '../../redux/liveQuizSlice';

let socket;

const StudentArena = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const [joined, setJoined] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [msg, setMsg] = useState("");
  
  // Game State
  const [activeQ, setActiveQ] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    socket = io(serverUrl);

    socket.on("join_success", () => setJoined(true));
    
    socket.on("receive_question", (data) => {
        setActiveQ(data);
        setSubmitted(false);
        setResultData(null);
    });

    socket.on("question_results", (data) => {
        setResultData(data);
        setActiveQ(null);
    });

    return () => socket.disconnect();
  }, []);

  const joinRoom = () => {
      socket.emit("student_join_quiz", { roomCode: inputCode, name: userData?.name || "Guest" });
  };

  const submitAnswer = (index) => {
      if(submitted) return;
      socket.emit("student_submit_answer", { roomCode: inputCode, answerIndex: index });
      setSubmitted(true);
  };

  if (!joined) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl text-center">
          <h1 className="text-2xl text-white font-bold mb-4">Enter Live Arena</h1>
          <input 
            className="w-full p-3 rounded bg-gray-700 text-white mb-4 text-center text-xl tracking-widest"
            placeholder="1234"
            value={inputCode} onChange={e => setInputCode(e.target.value)}
          />
          <button onClick={joinRoom} className="w-full bg-purple-600 py-3 rounded text-white font-bold hover:bg-purple-500">
            Join Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      {activeQ ? (
        <div className="w-full max-w-md mt-10">
          <div className="mb-8 text-center">
             <h2 className="text-2xl font-bold mb-2">{activeQ.question}</h2>
             <div className="text-yellow-400 text-sm">⏳ Time Limit: {activeQ.timeLimit}s</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             {activeQ.options.map((opt, i) => (
                 <button 
                    key={i}
                    onClick={() => submitAnswer(i)}
                    disabled={submitted}
                    className={`h-32 rounded-xl text-xl font-bold transition-all transform hover:scale-105
                        ${submitted ? 'bg-gray-600 cursor-not-allowed' : 
                          i === 0 ? 'bg-red-500' : 
                          i === 1 ? 'bg-blue-500' : 
                          i === 2 ? 'bg-yellow-500' : 'bg-green-500'
                        }
                    `}
                 >
                    {opt || `Option ${i+1}`}
                 </button>
             ))}
          </div>
          {submitted && <p className="text-center mt-4 text-green-400 animate-pulse">Answer Submitted! Waiting for results...</p>}
        </div>
      ) : resultData ? (
        <div className="text-center mt-20">
           <h1 className="text-4xl mb-4">📊 Round Over</h1>
           <div className="bg-gray-800 p-6 rounded-xl">
               <p className="text-xl">Correct Answer was: <span className="text-green-400 font-bold">Option {resultData.correctIndex + 1}</span></p>
           </div>
           <p className="mt-8 text-gray-400">Waiting for next question...</p>
        </div>
      ) : (
        <div className="text-center mt-20">
           <div className="animate-spin text-4xl mb-4">⏳</div>
           <h2 className="text-xl">You are in!</h2>
           <p className="text-gray-400">Waiting for teacher to launch...</p>
        </div>
      )}
    </div>
  );
};

export default StudentArena;