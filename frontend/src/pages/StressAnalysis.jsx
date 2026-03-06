import { useState, useEffect } from "react";
import axios from "axios";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Sparkles,
  Moon,
  Dumbbell,
  Clock,
  Coffee,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  Zap,
  Brain,
  Activity,
  CheckCircle2,
  Scan,
  BrainCircuit,
  Cpu,
  BarChart3,
  TrendingUp,
  LayoutDashboard,
  HeartPulse,
} from "lucide-react";
import { serverUrl } from "../App";

export default function StressAnalysis() {
  const [form, setForm] = useState({
    sleepHours: "",
    exerciseDays: "",
    assignmentPressure: "medium",
    mood: "neutral",
    breakHabit: "sometimes",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);

  // --- SMOOTH ADAPTIVE CURSOR ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { damping: 35, stiffness: 450 });
  const cursorY = useSpring(mouseY, { damping: 35, stiffness: 450 });

  useEffect(() => {
    const interval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsBooting(false), 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 120);

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [mouseX, mouseY]);

  const analyze = async () => {
    if (!form.sleepHours || !form.exerciseDays) return;
    try {
      setLoading(true);
      setResult(null);
      const res = await axios.post(`${serverUrl}/api/stress/analyze`, form, {
        withCredentials: true,
      });
      setTimeout(() => {
        setResult(res.data);
        setLoading(false);
      }, 2000);
    } catch (err) {
      setLoading(false);
    }
  };

  const analysis = result?.analysis
    ? typeof result.analysis === "string"
      ? JSON.parse(result.analysis)
      : result.analysis
    : null;

  const inputStyle =
    "w-full bg-white/70 border border-sky-100 rounded-xl p-3 text-slate-900 outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-300 font-bold shadow-sm text-sm backdrop-blur-md";

  return (
    <div className="min-h-screen bg-[#F0F6FF] text-slate-900 py-10 px-4 relative overflow-x-hidden font-sans cursor-none selection:bg-amber-500/30 flex flex-col items-center">
      {/* --- STEP 1: INITIAL BOOT LOADER --- */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            key="bootloader"
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="fixed inset-0 z-[10000] bg-[#0A192F] flex flex-col items-center justify-center text-amber-400"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mb-6"
            >
              <Cpu
                size={64}
                className="drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              />
            </motion.div>
            <div className="w-56 h-1 bg-slate-800 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bootProgress}%` }}
                className="h-full bg-amber-500 shadow-[0_0_10px_#fbbf24]"
              />
            </div>
            <p className="font-mono text-[9px] tracking-[0.5em] animate-pulse">
              BOOTING_TLE_NEURAL_TERMINAL
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CUSTOM SMOOTH CROSSHAIR --- */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{ rotate: isHovering ? 90 : 0, scale: isHovering ? 1.4 : 1 }}
          className="relative w-8 h-8 flex items-center justify-center"
        >
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-500" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-500" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-500" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-500" />
          <div className="w-1 h-1 bg-sky-500 rounded-full shadow-[0_0_10px_#38bdf8]" />
        </motion.div>
      </motion.div>

      {/* --- BACKGROUND AMBIANCE --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-sky-200/50 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-100/40 blur-[100px] rounded-full"
        />
      </div>

      <div className="max-w-5xl w-full mx-auto relative z-10">
        {/* --- BRANDING HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={!isBooting ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            className="inline-flex items-center justify-center p-3 mb-4 bg-white border border-sky-100 rounded-2xl shadow-xl text-sky-500"
          >
            <BrainCircuit size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0A192F] tracking-tighter uppercase italic leading-none">
            TLE <span className="text-sky-500">Terminators</span>
          </h1>
          <p className="text-slate-500 mt-3 text-sm font-bold tracking-tight max-w-lg mx-auto">
            Leverage neural analysis to balance your academic life and mental
            well-being.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 items-stretch mb-10">
          {/* --- FORM PANEL --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={!isBooting ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 bg-white/90 backdrop-blur-xl border border-sky-100 shadow-2xl rounded-[2.5rem] p-8 relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Sparkles className="text-amber-500" size={16} /> Daily Metrics
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Moon size={12} className="text-indigo-400" /> Sleep
                    (Hrs/Day)
                  </label>
                  <input
                    type="number"
                    className={inputStyle}
                    placeholder="7"
                    value={form.sleepHours}
                    onChange={(e) =>
                      setForm({ ...form, sleepHours: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Dumbbell size={12} className="text-emerald-500" /> Exercise
                    (Days/Wk)
                  </label>
                  <input
                    type="number"
                    className={inputStyle}
                    placeholder="3"
                    value={form.exerciseDays}
                    onChange={(e) =>
                      setForm({ ...form, exerciseDays: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Clock size={12} className="text-rose-400" /> Assignment
                  Pressure
                </label>
                <div className="flex bg-slate-50 p-1 rounded-xl border border-sky-50">
                  {["low", "medium", "high"].map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        setForm({ ...form, assignmentPressure: level })
                      }
                      className={`flex-1 py-2.5 rounded-lg capitalize text-[10px] font-black transition-all duration-300 ${form.assignmentPressure === level ? "bg-white text-sky-500 shadow-md ring-1 ring-sky-50 scale-[1.02] font-black" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Current Mood
                  </label>
                  <select
                    className={inputStyle}
                    value={form.mood}
                    onChange={(e) => setForm({ ...form, mood: e.target.value })}
                  >
                    <option value="good">😊 Good</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="tired">🥱 Tired</option>
                    <option value="stressed">😫 Stressed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Coffee size={12} className="text-amber-500" /> Break Habit
                  </label>
                  <select
                    className={inputStyle}
                    value={form.breakHabit}
                    onChange={(e) =>
                      setForm({ ...form, breakHabit: e.target.value })
                    }
                  >
                    <option value="often">Often</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="rarely">Rarely</option>
                  </select>
                </div>
              </div>

              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 20px rgba(99, 102, 241, 0.15)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={analyze}
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] mt-4 shadow-lg"
              >
                {loading ? (
                  <Activity className="animate-spin" size={16} />
                ) : (
                  <>
                    Generate Analysis <ChevronRight size={16} />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* --- RESULTS PANEL --- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={!isBooting ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 h-full"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center bg-white border-2 border-dashed border-sky-200 rounded-[2.5rem] p-10 text-center min-h-[400px] shadow-sm"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "linear",
                    }}
                    className="relative mb-6"
                  >
                    <Scan size={80} className="text-sky-400 opacity-20" />
                    <motion.div
                      animate={{ y: [-30, 30, -30], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute top-1/2 left-0 w-full h-1 bg-amber-400 shadow-[0_0_15px_#fbbf24]"
                    />
                  </motion.div>
                  <p className="font-black text-sky-600 text-[10px] tracking-widest animate-pulse uppercase">
                    Syncing Neural Data...
                  </p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95, rotateY: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  className="bg-white border-2 border-amber-400 shadow-2xl rounded-[2.5rem] p-8 h-full flex flex-col relative overflow-hidden"
                >
                  <div className="mb-6 relative z-10 border-l-4 border-amber-500 pl-4">
                    <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.3em]">
                      Report #SYNX-DIAX
                    </p>
                    <h2 className="text-2xl font-black mt-1 text-slate-900 italic uppercase">
                      Diagnostics
                    </h2>
                  </div>

                  <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 mb-6 text-center shadow-inner">
                    <p className="text-sky-600 text-[9px] font-black uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                      <Brain size={12} /> Study Capacity
                    </p>
                    <div className="text-5xl font-black text-slate-900 italic">
                      {result.studyHoursLastWeek}
                      <span className="text-lg text-sky-500 ml-1 uppercase">
                        hrs
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 flex-grow">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 ${analysis?.stressLevel === "High" ? "border-rose-500 text-rose-500 bg-rose-50" : "border-emerald-500 text-emerald-600 bg-emerald-50"}`}
                    >
                      {analysis?.stressLevel === "High" ? (
                        <AlertCircle size={14} />
                      ) : (
                        <ShieldCheck size={14} />
                      )}
                      Stress Level: {analysis?.stressLevel}
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed font-bold italic border-l-4 border-slate-200 pl-4 py-1">
                      "{analysis?.explanation}"
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-6 relative z-10">
                    <h4 className="text-[9px] font-black text-sky-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                      {" "}
                      <Zap
                        size={14}
                        fill="currentColor"
                        className="text-amber-400"
                      />{" "}
                      Optimization Plan
                    </h4>
                    <div className="space-y-2">
                      {analysis?.suggestions?.map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: 10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1 + 0.1 * i }}
                          className="flex items-center gap-3 text-[10px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-sky-50 font-bold uppercase hover:border-amber-400"
                        >
                          <CheckCircle2
                            size={16}
                            className="text-amber-500 shrink-0"
                          />{" "}
                          {s}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center bg-white border-2 border-dashed border-sky-200 rounded-[2.5rem] p-10 text-center min-h-[400px] shadow-inner"
                >
                  <div className="bg-slate-50 p-5 rounded-full mb-4">
                    <HeartPulse size={50} className="text-sky-300 opacity-40" />
                  </div>
                  <p className="font-black text-slate-800 uppercase tracking-[0.2em] text-xs">
                    No analysis generated yet.
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 tracking-widest max-w-[200px] mx-auto leading-relaxed opacity-60">
                    Complete the form to see your stress report.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* --- SYSTEM ADVANTAGES SECTION --- */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: ShieldCheck,
              color: "text-sky-500",
              title: "Burnout Prevention",
              desc: "Identifies fatigue levels before they impact performance.",
            },
            {
              icon: TrendingUp,
              color: "text-amber-500",
              title: "Neural Optimization",
              desc: "Action plans to sync energy with your current neural load.",
            },
            {
              icon: BarChart3,
              color: "text-indigo-500",
              title: "Data Integrity",
              desc: "Builds a comprehensive map of your weekly cognitive state.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/50 border border-sky-100 p-6 rounded-[2rem] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all"
            >
              <item.icon className={`${item.color} mb-3`} size={24} />
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-2">
                {item.title}
              </h4>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </motion.section>
      </div>

      <style>{`
        body { cursor: none; background: #F8FAFC; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2338bdf8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 0.8rem; }
      `}</style>
    </div>
  );
}
