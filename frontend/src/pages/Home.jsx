import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Nav from "../components/Nav";
import Card from "../components/Card";
import Leaderboard from "../components/Leaderboard";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaLayerGroup,
  FaArrowRight,
  FaCrown,
  FaRocket,
  FaGamepad, // Added for Game icon
} from "react-icons/fa";
import { RiSecurePaymentFill, RiRobot2Fill, RiSwordFill } from "react-icons/ri"; // Added Sword icon
import { SiViaplay } from "react-icons/si";

import home from "../assets/home1.jpg";
import ai from "../assets/ai.png";

function Home() {
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  const stem_url = import.meta.env.VITE_STEM_URL || "http://localhost:3000";

  const featuredCourses = courseData?.slice(0, 3) || [];

  /* ---------------- XP LOGIC ---------------- */
  const getNextRankInfo = (xp = 0) => {
    if (xp >= 1500) return { next: "MAXED", percent: 100 };
    if (xp >= 1000) return { next: "Terminator", percent: (xp / 1500) * 100 };
    if (xp >= 500) return { next: "Master", percent: (xp / 1000) * 100 };
    if (xp >= 200) return { next: "Expert", percent: (xp / 500) * 100 };
    return { next: "Apprentice", percent: (xp / 200) * 100 };
  };

  const progress = getNextRankInfo(userData?.xp);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="bg-[#f8fafc] overflow-x-hidden font-sans">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-screen md:h-screen flex flex-col">
        <Nav />

        {/* Background Image & Gradient */}
        <div className="absolute inset-0 z-0">
          <img src={home} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-900/40" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl">
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                Next-Gen Learning Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 drop-shadow-lg">
              Learn. Compete. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                Dominate.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              Ascend the ranks from Novice to Terminator. Master new skills with
              our gamified, AI-powered ecosystem designed for modern achievers.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row flex-wrap gap-4">
              {/* Existing Button 1 */}
              <button
                onClick={() => navigate("/allcourses")}
                className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10 group">
                <SiViaplay className="text-blue-600 group-hover:scale-110 transition-transform" />
                Explore Courses
              </button>

              {/* Existing Button 2 */}
              <button
                onClick={() => (window.location.href = stem_url)}
                className="px-8 py-4 rounded-2xl bg-yellow-400 text-slate-900 font-bold text-lg hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/20 group">
                <SiViaplay className="text-red-900 group-hover:scale-110 transition-transform" />
                STEM Challenges
              </button>

              {/* 🚀 NEW LIVE QUIZ BUTTONS ADDED HERE */}
              {userData ? (
                userData.role === "educator" ? (
                  <button
                    onClick={() => navigate("/live-arena/host")}
                    className="px-8 py-4 rounded-2xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-purple-500/30 group border border-purple-400"
                  >
                    <FaGamepad className="text-white group-hover:scale-110 transition-transform" />
                    Host Live Quiz
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/live-arena/join")}
                    className="px-8 py-4 rounded-2xl bg-green-600 text-white font-bold text-lg hover:bg-green-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-500/30 group border border-green-400"
                  >
                    <RiSwordFill className="text-white group-hover:scale-110 transition-transform" />
                    Join Live Battle
                  </button>
                )
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 rounded-2xl bg-slate-700 text-white font-bold text-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  Login to Compete
                </button>
              )}
              {/* END NEW BUTTONS */}

              {/* Existing Button 3 */}
              <button
                onClick={() => navigate("/searchwithai")}
                className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3 group">
                <img
                  src={ai}
                  alt="AI"
                  className="w-6 h-6 group-hover:rotate-12 transition-transform"
                />
                <span>Ask AI Tutor</span>
                <FaArrowRight className="text-xs opacity-50 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/ai-scheduler")}
                className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/30 group border border-indigo-400"
              >
                <RiRobot2Fill className="group-hover:scale-110 transition-transform" />
                <span>AI Scheduler</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= USER PROGRESS (Floating Card) ================= */}
      {userData && (
        <section className="relative mt-8 md:-mt-24 z-20 px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-white flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Rank Info */}
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white text-3xl">
                <FaCrown />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">
                  Current Rank
                </p>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                  {userData.rank || "Novice"}
                </h2>
                <p className="text-sm font-bold text-blue-600">
                  {userData.xp || 0} XP Earned
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full md:flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-500">
                  Progress to{" "}
                  <span className="text-slate-900">{progress.next}</span>
                </span>
                <span className="text-2xl font-black text-slate-900">
                  {Math.round(progress.percent)}%
                </span>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress.percent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                />
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ================= LEADERBOARD SECTION ================= */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Text */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
              <div>
                <span className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-2 block">
                  Competition
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-tight">
                  Hall of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                    Fame
                  </span>
                </h2>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed">
                See who's dominating the charts this week. Earn XP by completing
                lectures and quizzes to claim your spot at the top.
              </p>

              <div className="p-6 bg-blue-900 text-white rounded-3xl relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[50px] -mr-10 -mt-10" />
                <h3 className="text-xl font-bold relative z-10 mb-2">
                  Ready to compete?
                </h3>
                <p className="text-blue-200 text-sm relative z-10 mb-6">
                  Join thousands of students pushing their limits.
                </p>
                <button
                  onClick={() => navigate("/allcourses")}
                  className="w-full py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors relative z-10">
                  Start Learning Now
                </button>
              </div>
            </div>

            {/* Right Leaderboard */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-2 overflow-hidden">
                <Leaderboard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED COURSES ================= */}
      <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Featured <span className="text-blue-400">Courses</span>
              </h2>
              <p className="text-slate-400 max-w-lg">
                Hand-picked courses to get you started on your journey to
                mastery.
              </p>
            </div>
            <button
              onClick={() => navigate("/allcourses")}
              className="px-6 py-3 rounded-full border border-slate-700 text-white hover:bg-white hover:text-slate-900 transition-all font-bold text-sm">
              View Full Catalog
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}>
                <Card
                  id={course._id}
                  title={course.title}
                  category={course.category}
                  price={course.price}
                  thumbnail={course.thumbnail}
                  reviews={course.reviews}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY US (Feature Grid) ================= */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-2 block">
            The Advantage
          </span>
          <h2 className="text-4xl font-black text-slate-900">
            Why TLE Terminators?
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<FaLayerGroup />}
            title="Gamified"
            desc="Earn XP, unlock ranks, and compete on global leaderboards."
            color="text-blue-500"
            bg="bg-blue-50"
          />
          <FeatureCard
            icon={<RiRobot2Fill />}
            title="AI Powered"
            desc="Smart search and recommendations tailored to your goals."
            color="text-purple-500"
            bg="bg-purple-50"
          />
          <FeatureCard
            icon={<FaChalkboardTeacher />}
            title="Expert Tutors"
            desc="Learn from industry professionals with real-world experience."
            color="text-emerald-500"
            bg="bg-emerald-50"
          />
          <FeatureCard
            icon={<FaRocket />}
            title="Career Boost"
            desc="Projects and certificates designed to get you hired."
            color="text-amber-500"
            bg="bg-amber-50"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Sub-component for features
const FeatureCard = ({ icon, title, desc, color, bg }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 bg-white flex flex-col items-center text-center"
  >
    <div
      className={`w-16 h-16 rounded-2xl ${bg} ${color} flex items-center justify-center text-3xl mb-6`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

export default Home;