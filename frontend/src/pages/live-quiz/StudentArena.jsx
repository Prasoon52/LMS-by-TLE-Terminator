import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { serverUrl } from '../../App';

let socket;

const StudentArena = () => {
  const { userData } = useSelector((state) => state.user);
  const [joined, setJoined] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [activeQ, setActiveQ] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      setConnectionStatus('Connected 🟢');
    });

    socket.on('connect_error', (err) => {
      setConnectionStatus(`Disconnected 🔴 (${err.message})`);
    });

    socket.on('join_success', () => {
      setJoined(true);
      setJoinError('');
    });

    socket.on('error_msg', (data) => {
      setJoinError(data.message);
    });

    socket.on('receive_question', (data) => {
      setActiveQ(data);
      setSubmitted(false);
      setSelectedOption(null);
      setResultData(null);
    });

    socket.on('question_results', (data) => {
      setResultData(data);
      setActiveQ(null);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (!inputCode.trim()) return alert('Please enter a room code.');
    const cleanCode = inputCode.trim();

    if (!socket || !socket.connected) {
      alert(`Server not connected. Status: ${connectionStatus}`);
      return;
    }

    // Set a timeout in case the server never responds
    const timeoutId = setTimeout(() => {
      setJoinError('Server did not respond. Please try again.');
    }, 5000);

    socket.emit(
      'student_join_quiz',
      {
        roomCode: cleanCode,
        name: userData?.name || 'Guest',
        userId: userData?._id || null,
      },
      (response) => {
        clearTimeout(timeoutId);
        if (response && response.status === 'error') {
          setJoinError(response.message);
        } else if (response && response.status === 'success') {
          // join_success will also fire, but we set joined anyway
          setJoined(true);
          setJoinError('');
        } else {
          setJoinError('No response from server. Check your connection.');
        }
      }
    );
  };

  const submitAnswer = (index) => {
    if (submitted) return;
    
    // 👇 GHOST BUG FIX: Added userId and name so the server never loses the student
    socket.emit('student_submit_answer', { 
        roomCode: inputCode.trim(), 
        answerIndex: index,
        userId: userData?._id || null,
        name: userData?.name || 'Guest'
    });
    
    setSelectedOption(index);
    setSubmitted(true);
  };

  if (!joined) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="absolute top-8 bg-slate-800 px-4 py-2 rounded-full text-xs font-mono text-slate-300">
          Server: {serverUrl} | Status:{' '}
          <span className={connectionStatus.includes('🟢') ? 'text-green-400' : 'text-rose-400'}>
            {connectionStatus}
          </span>
        </div>
        <div className="bg-slate-800 p-8 rounded-3xl text-center w-full max-w-md border border-slate-700 shadow-2xl mt-12">
          <h1 className="text-3xl text-white font-black mb-2">Join Battle</h1>
          <p className="text-slate-400 mb-6">Enter the code on the screen</p>
          <input
            className="w-full p-4 rounded-xl bg-slate-900 text-white mb-6 text-center text-3xl font-mono tracking-[0.5em] border border-slate-600 focus:border-green-500 focus:outline-none uppercase"
            placeholder="1234"
            maxLength={4}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          {joinError && (
            <div className="mb-4 text-rose-400 text-sm bg-rose-900/20 p-2 rounded-lg border border-rose-800">
              ⚠️ {joinError}
            </div>
          )}
          <button
            onClick={joinRoom}
            className="w-full py-4 rounded-xl text-white font-bold text-lg bg-green-600 hover:bg-green-500 hover:scale-[1.02] shadow-lg shadow-green-600/30"
          >
            Enter Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
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
                  ${!submitted
                    ? i === 0
                      ? 'bg-rose-500 shadow-[0_8px_0_rgb(159,18,57)] hover:bg-rose-400 hover:-translate-y-1'
                      : i === 1
                      ? 'bg-emerald-500 shadow-[0_8px_0_rgb(6,95,70)] hover:bg-emerald-400 hover:-translate-y-1'
                      : i === 2
                      ? 'bg-blue-500 shadow-[0_8px_0_rgb(30,58,138)] hover:bg-blue-400 hover:-translate-y-1'
                      : 'bg-amber-500 shadow-[0_8px_0_rgb(146,64,14)] hover:bg-amber-400 hover:-translate-y-1'
                    : 'shadow-none translate-y-2'}
                `}
              >
                {opt || `Option ${i + 1}`}
              </button>
            ))}
          </div>
          {submitted && (
            <p className="text-center mt-8 text-slate-400 font-bold animate-pulse">
              Answer locked! Waiting for others...
            </p>
          )}
        </div>
      ) : resultData ? (
        <div className="w-full max-w-md mt-12 animate-fade-in">
          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl text-center mb-8">
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
              <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">
                Correct Answer Was
              </p>
              <p className="text-xl font-bold text-white">Option {resultData.correctIndex + 1}</p>
            </div>
          </div>
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
            <h3 className="text-lg font-bold text-amber-400 mb-4 text-center">🏆 Live Leaderboard</h3>
            <ul className="space-y-3">
              {resultData.leaderboard.map((p, i) => (
                <li
                  key={i}
                  className={`flex justify-between items-center p-3 rounded-xl ${
                    p.name === (userData?.name || 'Guest')
                      ? 'bg-slate-700 border border-slate-500'
                      : 'bg-slate-900 border border-slate-700/50'
                  }`}
                >
                  <span className="font-bold text-slate-200">
                    <span className="text-slate-500 mr-2">#{i + 1}</span>
                    {p.name} {p.name === (userData?.name || 'Guest') && '(You)'}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{p.score} XP</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center mt-32">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-green-500 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">You are in!</h2>
          <p className="text-slate-400">Waiting for the host to launch the question...</p>
        </div>
      )}
    </div>
  );
};

export default StudentArena;