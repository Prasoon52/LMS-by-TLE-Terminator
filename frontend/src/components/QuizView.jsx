import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaRedo,
  FaClipboardList,
  FaHistory,
  FaChartPie,
  FaPlayCircle,
  FaLightbulb,
} from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import QuizTimer from "./QuizTimer";
import { motion } from "framer-motion";

function QuizView({ quiz, userId }) {
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingHistory, setCheckingHistory] = useState(true);

  const submittingRef = useRef(false);

  // --- 1. INITIAL FETCH ---
  useEffect(() => {
    if (!quiz?._id) return;
    setResponses({});
    setResult(null);
    submittingRef.current = false;
    checkPreviousAttempt();
  }, [quiz?._id]);

  const checkPreviousAttempt = async () => {
    if (!userId || !quiz?._id) {
      setCheckingHistory(false);
      return;
    }
    setCheckingHistory(true);
    try {
      const { data } = await axios.get(
        `${serverUrl}/api/quiz/${quiz._id}/attempt`,
        { withCredentials: true },
      );

      if (data.success && data.attempt) {
        setResult(data.attempt);
        const historyResponses = {};
        if (data.attempt.responses) {
          data.attempt.responses.forEach((r) => {
            historyResponses[r.questionId] = r.selectedOption;
          });
        }
        setResponses(historyResponses);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("History check failed", error);
      }
    } finally {
      setCheckingHistory(false);
    }
  };

  // --- 2. HANDLERS ---
  const handleOptionSelect = (questionId, optionIndex) => {
    if (result) return;
    setResponses((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async (force = false) => {
    if (submittingRef.current) return;
    const questionCount = quiz.questions?.length || 0;

    if (!force && Object.keys(responses).length < questionCount) {
      toast.warn("Please answer all questions before submitting.");
      return;
    }

    setLoading(true);
    submittingRef.current = true;
    try {
      const formattedResponses = (quiz.questions || []).map((q) => ({
        questionId: q._id,
        selectedOption:
          responses.hasOwnProperty(q._id) && responses[q._id] !== undefined
            ? responses[q._id]
            : null,
      }));

      const { data } = await axios.post(
        `${serverUrl}/api/quiz/${quiz._id}/submit`,
        { responses: formattedResponses },
        { withCredentials: true },
      );

      if (data.success) {
        setResult({
          ...data.data,
          responses: formattedResponses,
        });
        toast.success("Quiz Submitted Successfully!");
        window.scrollTo(0, 0);
      } else {
        toast.error(data.message || "Submission failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Submission failed");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  // --- RENDER STATES ---

  // A. No Quiz Selected
  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
        <FaClipboardList className="text-6xl mb-4 opacity-30" />
        <h3 className="text-lg font-bold uppercase tracking-widest">
          Select a Quiz to Begin
        </h3>
      </div>
    );
  }

  // B. Loading
  if (checkingHistory) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl shadow-sm border border-slate-100">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">
          Loading Assessment...
        </p>
      </div>
    );
  }

  // C. RESULTS DASHBOARD
  if (result) {
    const scorePercent = Math.round(
      ((result.score || 0) / (result.totalQuestions || 1)) * 100,
    );
    const pieData = [
      { name: "Correct", value: result.score || 0 },
      {
        name: "Incorrect",
        value: (result.totalQuestions || 0) - (result.score || 0),
      },
    ];
    const COLORS = ["#10B981", "#EF4444"]; // Emerald, Red

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-8 font-sans text-slate-800">
        {/* Banner */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 relative z-10">
            {/* Chart */}
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">
                  {scorePercent}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Score
                </span>
              </div>
            </div>

            {/* Text Stats */}
            <div className="text-center md:text-left space-y-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900">
                  Quiz Completed
                </h2>
                <p className="text-slate-500 font-medium">
                  You answered {result.score} out of {result.totalQuestions}{" "}
                  correctly.
                </p>
              </div>

              <div className="flex justify-center md:justify-start gap-3">
                <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 font-bold text-sm">
                  {result.score} Correct
                </div>
                <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-600 font-bold text-sm">
                  {result.totalQuestions - result.score} Incorrect
                </div>
              </div>

              <button
                onClick={() => {
                  setResult(null);
                  setResponses({});
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-indigo-600 transition-all text-sm shadow-md">
                <FaRedo /> Retry Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 px-2">
            Answer Key
          </h3>

          {(quiz.questions || []).map((q, index) => {
            const userAns = result.responses?.find(
              (r) => r.questionId === q._id,
            )?.selectedOption;
            const isCorrect = userAns === q.correctOption;

            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={q._id}
                className={`p-6 rounded-2xl border-2 transition-all bg-white ${
                  isCorrect
                    ? "border-green-100 shadow-sm"
                    : "border-red-100 shadow-sm"
                }`}>
                <div className="flex gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm text-white ${isCorrect ? "bg-green-500" : "bg-red-500"}`}>
                    {index + 1}
                  </div>

                  <div className="flex-1 space-y-4">
                    <p className="font-bold text-lg text-slate-800">
                      {q.questionText}
                    </p>

                    <div className="flex flex-col gap-3">
                      {q.options?.map((opt, i) => {
                        let cardClass =
                          "p-4 rounded-xl border flex justify-between items-center transition-all text-sm font-medium ";

                        if (i === q.correctOption) {
                          cardClass +=
                            "bg-green-50 border-green-500 text-green-800";
                        } else if (i === userAns && !isCorrect) {
                          cardClass += "bg-red-50 border-red-500 text-red-800";
                        } else {
                          cardClass +=
                            "bg-white border-slate-200 text-slate-500";
                        }

                        return (
                          <div key={i} className={cardClass}>
                            <span>{opt}</span>
                            {i === q.correctOption && (
                              <FaCheckCircle className="text-green-600" />
                            )}
                            {i === userAns && !isCorrect && (
                              <FaTimesCircle className="text-red-500" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="mt-2 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl text-indigo-900 text-sm flex gap-3">
                        <FaLightbulb className="text-indigo-600 text-lg shrink-0" />
                        <div>
                          <span className="font-bold block text-indigo-700 mb-1">
                            Explanation:
                          </span>
                          {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // D. QUIZ TAKING VIEW (The "Taking" State)
  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 p-6 md:p-10 font-sans relative">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-100 gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {quiz.quizTitle}
          </h2>
          <div className="flex items-center gap-4 text-slate-500 mt-2 text-xs font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700">
              <FaClipboardList className="text-indigo-500" />{" "}
              {quiz.questions?.length || 0} Questions
            </span>
          </div>
        </div>

        {/* --- Timer Widget (High Visibility) --- */}
        <div className="bg-amber-100 border-2 border-amber-300 text-amber-900 rounded-2xl px-6 py-3 shadow-lg flex items-center gap-3 animate-pulse-slow">
          <FaClock className="text-xl text-amber-700" />
          <div className="font-mono font-bold text-lg">
            <QuizTimer
              durationMinutes={quiz.duration || 0}
              onExpire={() => {
                toast.info("Time is up! Submitting automatically.");
                handleSubmit(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* --- Question List (Vertical Stack) --- */}
      <div className="space-y-12">
        {(quiz.questions || []).length > 0 ? (
          (quiz.questions || []).map((q, index) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={q._id}
              className="group">
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-slate-900 text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm shadow-md">
                  {index + 1}
                </span>
                <p className="font-bold text-xl text-slate-800 leading-snug">
                  {q.questionText}
                </p>
              </div>

              {/* VERTICAL OPTIONS STACK */}
              <div className="flex flex-col gap-3 pl-2">
                {q.options?.map((option, i) => {
                  const isSelected = responses[q._id] === i;
                  return (
                    <label
                      key={i}
                      onClick={() => handleOptionSelect(q._id, i)}
                      className={`relative flex items-center p-5 rounded-xl cursor-pointer transition-all duration-200 border-2 group
                        ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-600 shadow-md transform scale-[1.01]"
                            : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                        }`}>
                      {/* Custom Radio Circle */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all shrink-0 ${isSelected ? "border-indigo-600" : "border-slate-300"}`}>
                        {isSelected && (
                          <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                        )}
                      </div>

                      <span
                        className={`text-base font-medium ${isSelected ? "text-indigo-900 font-bold" : "text-slate-600"}`}>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-400 font-medium">
            Select a quiz to begin.
          </div>
        )}
      </div>

      {/* --- Footer Action --- */}
      <div className="mt-16 pt-8 border-t border-slate-100 flex justify-end sticky bottom-0 bg-white/95 backdrop-blur-md pb-6 z-20">
        <button
          onClick={() => handleSubmit(false)}
          disabled={loading || (quiz.questions || []).length === 0}
          className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0">
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
              Processing...
            </>
          ) : (
            <>
              Submit Answers <FaPlayCircle />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default QuizView;
