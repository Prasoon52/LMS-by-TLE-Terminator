import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";

const AIScheduler = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/ai-scheduler/generate`,
        { messages: updatedMessages }
      );

      if (res.data.questions?.length > 0) {
        setMessages([
          ...updatedMessages,
          { role: "assistant", content: res.data.questions.join(" ") },
        ]);
      }

      if (res.data.schedule) {
        setSchedule(res.data.schedule);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chat Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🤖 AI Study Planner
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3 mb-4 border rounded-xl p-4 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-gray-400 text-sm">
                Example: Exam in 20 days. Subjects: DSA, OS. 5 hours daily. Sunday off.
              </p>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl max-w-[80%] text-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell AI your study details..."
              className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            📅 Generated Schedule
          </h3>

          {!schedule && (
            <p className="text-gray-400 text-sm">
              Your generated schedule will appear here.
            </p>
          )}

          {schedule && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(schedule).map((day) => (
                <div
                  key={day}
                  className="border rounded-xl p-4 bg-gray-50 shadow-sm"
                >
                  <h4 className="font-semibold text-blue-600 mb-3">
                    {day}
                  </h4>

                  <ul className="space-y-2 text-sm text-gray-700">
                    {schedule[day].map((task, i) => (
                      <li
                        key={i}
                        className="bg-white p-3 rounded-lg border hover:shadow-md transition"
                      >
                        {typeof task === "object" ? (
                          <div className="flex flex-col">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-sm text-blue-700">
                                {task.duration 
                                  ? task.duration 
                                  : task.time 
                                    ? task.time 
                                    : "Duration not specified"}
                              </span>
                              {task.subject && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                  {task.subject}
                                </span>
                              )}
                            </div>

                            <span className="text-gray-700 mt-1">
                              {task.activity}
                            </span>
                          </div>
                        ) : (
                          task
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AIScheduler;