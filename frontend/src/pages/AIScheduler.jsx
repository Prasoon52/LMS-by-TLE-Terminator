// import React, { useState } from "react";
// import axios from "axios";
// import { jsPDF } from "jspdf";
// import { serverUrl } from "../App";
// import {
//   Calendar, Clock, Download, Trash2, Sparkles,
//   BookOpen, XCircle, Plus, X, Hash, AlertCircle, Edit3
// } from "lucide-react";

// const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// const AIScheduler = () => {
//   const [subjectInput, setSubjectInput] = useState("");
//   const [subjects, setSubjects] = useState([]);
//   const [weakInput, setWeakInput] = useState("");
//   const [weakSubjects, setWeakSubjects] = useState([]);
//   const [offDays, setOffDays] = useState([]);
//   const [schedule, setSchedule] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [freeTimeSlots, setFreeTimeSlots] = useState(
//     daysOfWeek.reduce((acc, d) => ({ ...acc, [d]: [] }), {})
//   );

//   // -- LIVE EDIT LOGIC FOR GENERATED SCHEDULE --
//   const handleEditSchedule = (day, index, field, value) => {
//     const updatedSchedule = { ...schedule };
//     updatedSchedule[day][index][field] = value;
//     setSchedule(updatedSchedule);
//   };

//   const removeTaskFromSchedule = (day, index) => {
//     const updatedSchedule = { ...schedule };
//     updatedSchedule[day].splice(index, 1);
//     setSchedule(updatedSchedule);
//   };

//   // -- PDF EXPORT --
//   const downloadPDF = () => {
//     if (!schedule) return;
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     let y = 20;

//     // --- HEADER SECTION ---
//     doc.setFillColor(15, 23, 42); // Dark Slate Background (same as UI)
//     doc.rect(0, 0, pageWidth, 40, "F");

//     doc.setTextColor(34, 211, 238); // Cyan Color
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(24);
//     doc.text("STUDY_BY_TLE", 14, 25);

//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");
//     doc.text("PERSONALIZED ACADEMIC BLUEPRINT | TLE TERMINATOR", 14, 32);

//     y = 50;

//     Object.entries(schedule).forEach(([day, tasks]) => {
//       if (!tasks || tasks.length === 0) return;

//       // --- DAY HEADER ---
//       doc.setFillColor(241, 245, 249); // Light Gray
//       doc.rect(14, y - 5, pageWidth - 28, 10, "F");
//       doc.setTextColor(79, 70, 229); // Indigo
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(14);
//       doc.text(day.toUpperCase(), 18, y);
//       y += 12;

//       tasks.forEach((task) => {
//         // --- TASK CARD LOGIC ---
//         const isWeak = weakSubjects.includes(task.subject);
//         const isBreak = task.type === "break" || task.subject.toLowerCase().includes("break");

//         // Subtle Border for Task
//         doc.setDrawColor(226, 232, 240);
//         doc.line(18, y - 4, pageWidth - 18, y - 4);

//         // Time Section
//         doc.setTextColor(100, 116, 139);
//         doc.setFontSize(9);
//         doc.setFont("helvetica", "bold");
//         doc.text(`${task.start} - ${task.end}`, 20, y);

//         // Subject Section
//         if (isBreak) {
//           doc.setTextColor(234, 179, 8); // Yellow for Break
//         } else if (isWeak) {
//           doc.setTextColor(217, 70, 239); // Fuchsia for Weak
//         } else {
//           doc.setTextColor(15, 23, 42); // Dark Slate
//         }

//         doc.setFontSize(11);
//         doc.text(task.subject + (isWeak ? " [PRIORITY]" : ""), 55, y);

//         // Activity Section
//         doc.setTextColor(71, 85, 105);
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(10);

//         // Wrap text for long activities
//         const activityText = doc.splitTextToSize(task.activity, pageWidth - 100);
//         doc.text(activityText, 95, y);

//         // Dynamic spacing based on text length
//         y += (activityText.length * 5) + 5;

//         // Page break check
//         if (y > 275) {
//           doc.addPage();
//           y = 20;
//         }
//       });

//       y += 10; // Space between days
//     });

//     // --- FOOTER ---
//     const pageCount = doc.internal.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(8);
//       doc.setTextColor(148, 163, 184);
//       doc.text(`Page ${i} of ${pageCount} | Master Blueprint System`, pageWidth / 2, 290, { align: "center" });
//     }

//     doc.save(`Architect_Blueprint_${new Date().toLocaleDateString()}.pdf`);
//   };
//   // -- TAG SYSTEMS --
//   const handleKeyDown = (e, type) => {
//     if (e.key === 'Enter' && (type === 'sub' ? subjectInput : weakInput).trim()) {
//       e.preventDefault();
//       const val = (type === 'sub' ? subjectInput : weakInput).trim();
//       if (type === 'sub') {
//         if (!subjects.includes(val)) setSubjects([...subjects, val]);
//         setSubjectInput("");
//       } else {
//         if (!weakSubjects.includes(val)) setWeakSubjects([...weakSubjects, val]);
//         setWeakInput("");
//       }
//     }
//   };

//   const removeTag = (val, type) => {
//     if (type === 'sub') setSubjects(subjects.filter(s => s !== val));
//     else setWeakSubjects(weakSubjects.filter(s => s !== val));
//   };

//   // -- TIME SLOTS --
//   const addFreeSlot = (day) => {
//     setFreeTimeSlots({
//       ...freeTimeSlots,
//       [day]: [...freeTimeSlots[day], { start: "09:00", end: "11:00" }]
//     });
//   };

//   const removeFreeSlot = (day, index) => {
//     const updated = [...freeTimeSlots[day]];
//     updated.splice(index, 1);
//     setFreeTimeSlots({ ...freeTimeSlots, [day]: updated });
//   };

//   const toggleOffDay = (day) => {
//     setOffDays((p) => p.includes(day) ? p.filter((d) => d !== day) : [...p, day]);
//   };

//   const generate = async () => {
//     if (subjects.length === 0) {
//       alert("Add at least one subject.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         structuredData: {
//           subjects,
//           weakSubjects,
//           freeTimeSlots,
//           offDays,
//         },
//         previousSchedule: schedule ? schedule : null,
//       };

//       const res = await axios.post(
//         `${serverUrl}/api/ai-scheduler/generate`,
//         payload
//       );

//       if (res.data && res.data.schedule) {
//         setSchedule(res.data.schedule);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Schedule regeneration failed.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
//       <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
//         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
//         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[120px] rounded-full"></div>
//       </div>

//       <div className="max-w-7xl mx-auto">
//         <header className="text-center mb-12">
//           <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent mb-2 tracking-tighter">
//             TLE-SCHEDULE GENERATOR
//           </h1>
//           <p className="text-slate-500 font-bold tracking-[0.4em] uppercase text-[10px]">
//             AI POWERED • Perfect SCHEDULE{" "}
//           </p>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           {/* LEFT: INPUTS */}
//           <div className="lg:col-span-5 space-y-6">
//             <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
//               <h2 className="text-xl font-black mb-8 flex items-center gap-3 italic tracking-tighter border-b border-slate-800 pb-4 text-cyan-400">
//                 <Sparkles size={22} /> PLAN-OUT-PANEL
//               </h2>

//               <div className="space-y-6">
//                 <div>
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
//                     Master Subjects
//                   </label>
//                   <div className="flex flex-wrap gap-2 mb-3">
//                     {subjects.map((sub) => (
//                       <span
//                         key={sub}
//                         className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-300 animate-in zoom-in">
//                         {sub}{" "}
//                         <X
//                           size={14}
//                           className="cursor-pointer hover:text-white"
//                           onClick={() => removeTag(sub, "sub")}
//                         />
//                       </span>
//                     ))}
//                   </div>
//                   <div className="relative">
//                     <Hash
//                       className="absolute left-4 top-3.5 text-slate-600"
//                       size={16}
//                     />
//                     <input
//                       className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-10 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
//                       placeholder="Add subject..."
//                       value={subjectInput}
//                       onChange={(e) => setSubjectInput(e.target.value)}
//                       onKeyDown={(e) => handleKeyDown(e, "sub")}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest ml-1 mb-2 block">
//                     Focus Areas (Weak)
//                   </label>
//                   <div className="flex flex-wrap gap-2 mb-3">
//                     {weakSubjects.map((sub) => (
//                       <span
//                         key={sub}
//                         className="flex items-center gap-1.5 bg-fuchsia-500/10 border border-fuchsia-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-fuchsia-300">
//                         <AlertCircle size={12} /> {sub}{" "}
//                         <X
//                           size={14}
//                           className="cursor-pointer hover:text-white"
//                           onClick={() => removeTag(sub, "weak")}
//                         />
//                       </span>
//                     ))}
//                   </div>
//                   <div className="relative">
//                     <Plus
//                       className="absolute left-4 top-3.5 text-slate-600"
//                       size={16}
//                     />
//                     <input
//                       className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-10 pr-4 py-3.5 focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all text-sm"
//                       placeholder="Define weak..."
//                       value={weakInput}
//                       onChange={(e) => setWeakInput(e.target.value)}
//                       onKeyDown={(e) => handleKeyDown(e, "weak")}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
//                     Blackout Days
//                   </label>
//                   <div className="grid grid-cols-4 gap-2">
//                     {daysOfWeek.map((day) => (
//                       <button
//                         key={day}
//                         onClick={() => toggleOffDay(day)}
//                         className={`py-2 rounded-xl text-[9px] font-black transition-all border ${offDays.includes(day) ? "bg-red-500/20 border-red-500 text-red-400" : "bg-slate-950/50 border-slate-800 text-slate-600"}`}>
//                         {day.substring(0, 3).toUpperCase()}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl max-h-[350px] overflow-y-auto">
//               <h2 className="text-sm font-black mb-4 flex items-center gap-2 text-slate-400">
//                 <Clock size={16} /> SCHEDULLING_WINDOWS
//               </h2>
//               {daysOfWeek.map(
//                 (day) =>
//                   !offDays.includes(day) && (
//                     <div
//                       key={day}
//                       className="mb-3 p-4 bg-slate-950/30 rounded-2xl border border-slate-800/50">
//                       <div className="flex justify-between items-center mb-3 text-xs font-black text-slate-400 tracking-widest uppercase">
//                         {day}{" "}
//                         <button
//                           onClick={() => addFreeSlot(day)}
//                           className="p-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
//                           <Plus size={12} />
//                         </button>
//                       </div>
//                       {freeTimeSlots[day].map((slot, i) => (
//                         <div
//                           key={i}
//                           className="flex items-center gap-2 mb-2 animate-in slide-in-from-left-4">
//                           <input
//                             type="time"
//                             value={slot.start}
//                             className="bg-slate-900/80 border border-slate-800 rounded-lg text-[10px] p-2 text-cyan-400"
//                             onChange={(e) => {
//                               const updated = [...freeTimeSlots[day]];
//                               updated[i].start = e.target.value;
//                               setFreeTimeSlots({
//                                 ...freeTimeSlots,
//                                 [day]: updated,
//                               });
//                             }}
//                           />
//                           <input
//                             type="time"
//                             value={slot.end}
//                             className="bg-slate-900/80 border border-slate-800 rounded-lg text-[10px] p-2 text-cyan-400"
//                             onChange={(e) => {
//                               const updated = [...freeTimeSlots[day]];
//                               updated[i].end = e.target.value;
//                               setFreeTimeSlots({
//                                 ...freeTimeSlots,
//                                 [day]: updated,
//                               });
//                             }}
//                           />
//                           <button
//                             onClick={() => removeFreeSlot(day, i)}
//                             className="text-slate-700 hover:text-red-500 ml-1">
//                             <X size={14} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   ),
//               )}
//             </div>

//             <button
//               onClick={generate}
//               disabled={loading}
//               className="w-full bg-gradient-to-br from-indigo-600 to-fuchsia-700 hover:from-indigo-500 hover:to-fuchsia-600 text-white py-5 rounded-[2rem] font-black tracking-[0.2em] text-xs shadow-2xl transition-all transform active:scale-95">
//               {loading ? "GENERATING_SCHEDULE..." : "GENERATE"}
//             </button>
//           </div>

//           {/* RIGHT: OUTPUT MATRIX */}
//           <div className="lg:col-span-7">
//             {schedule ? (
//               <div className="space-y-6 animate-in fade-in duration-700">
//                 <div className="flex justify-between items-center bg-slate-900/40 backdrop-blur-3xl p-6 rounded-[2rem] border border-slate-800">
//                   <div className="flex flex-col">
//                     <h2 className="text-xl font-black italic tracking-tighter text-cyan-400 flex items-center gap-2">
//                       TIMETABLE_MATRIX{" "}
//                     </h2>
//                     <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">
//                       Live Editing Enabled
//                     </span>
//                   </div>
//                   <div className="flex gap-3">
//                     <button
//                       onClick={generate}
//                       disabled={loading}
//                       className="flex items-center gap-2 bg-indigo-600 px-5 py-2.5 rounded-2xl text-[10px] font-black hover:bg-indigo-500 transition-all border border-indigo-500/30">
//                       {loading ? "REGENERATING..." : "REGENERATE"}
//                     </button>
//                     <button
//                       onClick={downloadPDF}
//                       className="flex items-center gap-2 bg-slate-800 px-5 py-2.5 rounded-2xl text-[10px] font-black hover:bg-slate-700 transition-all border border-slate-700">
//                       <Download size={14} /> PDF
//                     </button>
//                     <button
//                       onClick={() => setSchedule(null)}
//                       className="p-2.5 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 border border-red-500/20 transition-all">
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                   {Object.entries(schedule).map(
//                     ([day, tasks]) =>
//                       tasks.length > 0 && (
//                         <div
//                           key={day}
//                           className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 p-6 rounded-[2rem] flex flex-col h-[500px]">
//                           {/* DAY HEADER */}
//                           <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
//                               <Calendar size={14} className="text-indigo-500" />
//                               {day}
//                             </h3>
//                             <span className="text-[9px] text-slate-600 font-bold">
//                               {tasks.length} TASKS
//                             </span>
//                           </div>

//                           {/* TASK CONTAINER WITH SCROLL */}
//                           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
//                             {tasks.map((task, i) => (
//                               <div
//                                 key={i}
//                                 className={`p-4 rounded-2xl border transition-all relative ${
//                                   task.type === "break"
//                                     ? "bg-yellow-500/5 border-yellow-500/20"
//                                     : "bg-slate-950/80 border-slate-800 hover:border-cyan-500/40"
//                                 }`}>
//                                 {/* TIME ROW */}
//                                 <div className="flex justify-between items-center mb-2">
//                                   <span className="text-[10px] font-bold text-cyan-500/70 flex items-center gap-1 uppercase tracking-tight">
//                                     <Clock size={12} /> {task.start} —{" "}
//                                     {task.end}
//                                   </span>

//                                   <div className="flex items-center gap-2">
//                                     {weakSubjects.includes(task.subject) && (
//                                       <span className="text-[8px] bg-fuchsia-500/20 text-fuchsia-400 px-2 py-0.5 rounded-full font-black border border-fuchsia-500/20">
//                                         WEAK
//                                       </span>
//                                     )}
//                                     <button
//                                       onClick={() =>
//                                         removeTaskFromSchedule(day, i)
//                                       }
//                                       className="text-slate-600 hover:text-red-500 transition-all">
//                                       <XCircle size={14} />
//                                     </button>
//                                   </div>
//                                 </div>

//                                 {/* SUBJECT EDIT */}
//                                 <input
//                                   className="w-full bg-transparent font-black text-slate-100 outline-none mb-1 focus:text-cyan-400 text-sm tracking-tight border-b border-transparent focus:border-cyan-900/50"
//                                   value={task.subject}
//                                   onChange={(e) =>
//                                     handleEditSchedule(
//                                       day,
//                                       i,
//                                       "subject",
//                                       e.target.value,
//                                     )
//                                   }
//                                 />

//                                 {/* ACTIVITY EDIT */}
//                                 <textarea
//                                   className="w-full bg-transparent text-xs text-slate-500 outline-none resize-none focus:text-slate-300 border-none"
//                                   rows="2"
//                                   value={task.activity}
//                                   onChange={(e) =>
//                                     handleEditSchedule(
//                                       day,
//                                       i,
//                                       "activity",
//                                       e.target.value,
//                                     )
//                                   }
//                                 />
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       ),
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-slate-900/10 border-2 border-dashed border-slate-800 rounded-[3rem] text-slate-800 group hover:border-slate-700 transition-all duration-1000">
//                 <BookOpen
//                   size={80}
//                   className="mb-6 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700"
//                 />
//                 <div className="text-center space-y-2">
//                   <p className="font-black uppercase tracking-[0.5em] text-xs opacity-20">
//                     Awaiting_Neural_Sync
//                   </p>
//                   <p className="text-[10px] font-bold opacity-10 uppercase tracking-widest">
//                     Configure parameters to begin synthesis
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIScheduler;

import React, { useState, useRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { serverUrl } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Download,
  Trash2,
  Sparkles,
  X,
  Hash,
  AlertCircle,
  ArrowLeft,
  Target,
  BrainCircuit,
  ShieldCheck,
  Plus,
  XCircle,
  BookOpen,
  Zap,
  Info,
  CheckCircle2,
  ListChecks,
  Coffee,
  Rocket,
  RefreshCcw,
  Layout,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AIScheduler = () => {
  const navigate = useNavigate();
  const [targetGoal, setTargetGoal] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [weakInput, setWeakInput] = useState("");
  const [weakSubjects, setWeakSubjects] = useState([]);
  const [offDays, setOffDays] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("config");
  const [freeTimeSlots, setFreeTimeSlots] = useState(
    daysOfWeek.reduce((acc, d) => ({ ...acc, [d]: [] }), {}),
  );

  const handleEditSchedule = (day, index, field, value) => {
    if (!schedule) return;
    const updatedSchedule = { ...schedule };
    updatedSchedule[day][index][field] = value;
    setSchedule(updatedSchedule);
  };

  const removeTaskFromSchedule = (day, index) => {
    if (!schedule) return;
    const updatedSchedule = { ...schedule };
    updatedSchedule[day].splice(index, 1);
    setSchedule(updatedSchedule);
    toast.info("Item removed");
  };

  const addFreeSlot = (day) => {
    setFreeTimeSlots((prev) => ({
      ...prev,
      [day]: [...prev[day], { start: "09:00", end: "11:00" }],
    }));
  };

  const toggleOffDay = (day) => {
    setOffDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const generate = async () => {
    if (subjects.length === 0)
      return toast.error("Subjects Required", {
        description: "Please add subjects to proceed.",
      });
    setLoading(true);
    const loadId = toast.loading("Synthesizing your blueprint...");
    try {
      const payload = {
        structuredData: {
          targetGoal,
          subjects,
          weakSubjects,
          freeTimeSlots,
          offDays,
        },
      };
      const res = await axios.post(
        `${serverUrl}/api/ai-scheduler/generate`,
        payload,
      );
      if (res.data?.schedule) {
        setSchedule(res.data.schedule);
        setViewMode("synthesis");
        toast.success("Synthesis Successful", { id: loadId });
      }
    } catch (err) {
      toast.error("Neural Sync Error", { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(10, 17, 32);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 193, 7);
    doc.setFontSize(22);
    doc.text("TLE TERMINATOR | BLUEPRINT", 14, 22);
    let y = 55;
    Object.entries(schedule).forEach(([day, tasks]) => {
      if (tasks && tasks.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0, 150, 255);
        doc.text(day.toUpperCase(), 14, y);
        y += 10;
        tasks.forEach((t) => {
          doc.setFontSize(10);
          doc.setTextColor(50, 50, 50);
          doc.text(`${t.start}-${t.end}: ${t.subject}`, 14, y);
          y += 7;
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
        });
        y += 5;
      }
    });
    doc.save("StudyPlan.pdf");
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-slate-200 pb-20 font-sans relative overflow-x-hidden">
      <Toaster richColors position="top-right" theme="dark" />

      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-sky-500/10 blur-[150px] rounded-full opacity-60" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full opacity-40" />
      </div>

      {/* Header */}
      <nav className="relative z-20 border-b border-white/5 bg-[#050B18]/80 backdrop-blur-xl px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl shadow-lg">
              <Rocket size={32} className="text-[#050B18]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight italic uppercase">
                TLE <span className="text-amber-400">TERMINATOR</span>
              </h1>
              <p className="text-[10px] font-bold text-sky-400/60 tracking-[0.4em] uppercase">
                AI-POWERED SCHEDULER
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:text-white transition-all uppercase"
          >
            <ArrowLeft size={16} className="inline mr-2" /> BACK
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: FORM OPTIONS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0D1525]/80 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
              <label className="flex items-center gap-2 text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4">
                <Target size={14} /> Mission_Target
              </label>
              <input
                className="w-full bg-[#050B18] border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-amber-500/50 outline-none text-sm font-bold text-white shadow-inner mb-6"
                placeholder="E.G. JEE_MAINS_2026"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
              />

              <label className="flex items-center gap-2 text-[10px] font-black text-sky-400 uppercase tracking-widest mb-4">
                <BookOpen size={14} /> Main Subjects
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {subjects.map((sub) => (
                  <span
                    key={sub}
                    className="flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-xl text-[10px] font-black text-sky-300 uppercase"
                  >
                    {sub}{" "}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() =>
                        setSubjects(subjects.filter((s) => s !== sub))
                      }
                    />
                  </span>
                ))}
              </div>
              <input
                className="w-full bg-[#050B18] border border-white/5 rounded-2xl px-5 py-4 outline-none text-sm font-bold text-white mb-6"
                placeholder="TYPE SUBJECT & PRESS ENTER"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && subjectInput) {
                    setSubjects([...subjects, subjectInput]);
                    setSubjectInput("");
                    toast.success("Added");
                  }
                }}
              />

              <label className="flex items-center gap-2 text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4">
                <AlertCircle size={14} /> Focus Areas (Weak Subjects)
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {weakSubjects.map((sub) => (
                  <span
                    key={sub}
                    className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl text-[10px] font-black text-rose-300"
                  >
                    {sub}{" "}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() =>
                        setWeakSubjects(weakSubjects.filter((s) => s !== sub))
                      }
                    />
                  </span>
                ))}
              </div>
              <input
                className="w-full bg-[#050B18] border border-white/5 rounded-2xl px-5 py-4 outline-none text-sm font-bold text-white mb-6"
                placeholder="ADD WEAK SUBJECTS..."
                value={weakInput}
                onChange={(e) => setWeakInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && weakInput) {
                    setWeakSubjects([...weakSubjects, weakInput]);
                    setWeakInput("");
                  }
                }}
              />

              <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 block">
                Rest Days
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                  (day) => (
                    <button
                      key={day}
                      onClick={() => {
                        const fullDay = daysOfWeek.find((d) =>
                          d.toUpperCase().startsWith(day),
                        );
                        toggleOffDay(fullDay);
                      }}
                      className={`py-3 rounded-xl text-[9px] font-black border transition-all ${offDays.includes(daysOfWeek.find((d) => d.toUpperCase().startsWith(day))) ? "bg-rose-500/20 border-rose-500 text-rose-400" : "bg-[#050B18] border-white/5 text-slate-500"}`}
                    >
                      {day}
                    </button>
                  ),
                )}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-[#050B18] py-6 rounded-3xl font-black tracking-[0.4em] text-xs shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCcw className="animate-spin inline mr-2" />
              ) : (
                <ShieldCheck className="inline mr-2" />
              )}{" "}
              GENERATE BLUEPRINT
            </button>
          </div>

          {/* RIGHT: DYNAMIC VIEWS */}
          <div className="lg:col-span-7 h-full min-h-[500px]">
            <AnimatePresence mode="wait">
              {viewMode === "config" && (
                <motion.div
                  key="config"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#0D1525]/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 shadow-2xl h-full flex flex-col"
                >
                  <h2 className="text-sm font-black text-sky-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                    <Clock size={20} /> SCHEDULLING_WINDOWS
                  </h2>
                  <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
                    {daysOfWeek.map(
                      (day) =>
                        !offDays.includes(day) && (
                          <div
                            key={day}
                            className="bg-[#050B18]/60 border border-white/5 p-6 rounded-[2.5rem] hover:border-sky-500/30 transition-all shadow-lg"
                          >
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-xs font-black text-slate-100 uppercase tracking-widest">
                                {day}
                              </span>
                              <button
                                onClick={() => addFreeSlot(day)}
                                className="p-2 bg-sky-500/10 text-sky-400 rounded-full hover:bg-sky-500 hover:text-white transition-all"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            {freeTimeSlots[day]?.map((slot, i) => (
                              <div key={i} className="flex gap-3 mb-2">
                                <input
                                  type="time"
                                  value={slot.start}
                                  onChange={(e) => {
                                    const upd = [...freeTimeSlots[day]];
                                    upd[i].start = e.target.value;
                                    setFreeTimeSlots({
                                      ...freeTimeSlots,
                                      [day]: upd,
                                    });
                                  }}
                                  className="bg-slate-900 border border-white/5 rounded-xl p-2 text-xs text-amber-400 font-bold flex-1 outline-none"
                                />
                                <input
                                  type="time"
                                  value={slot.end}
                                  onChange={(e) => {
                                    const upd = [...freeTimeSlots[day]];
                                    upd[i].end = e.target.value;
                                    setFreeTimeSlots({
                                      ...freeTimeSlots,
                                      [day]: upd,
                                    });
                                  }}
                                  className="bg-slate-900 border border-white/5 rounded-xl p-2 text-xs text-amber-400 font-bold flex-1 outline-none"
                                />
                                <button
                                  onClick={() => {
                                    const upd = [...freeTimeSlots[day]];
                                    upd.splice(i, 1);
                                    setFreeTimeSlots({
                                      ...freeTimeSlots,
                                      [day]: upd,
                                    });
                                  }}
                                  className="text-slate-600 hover:text-rose-500"
                                >
                                  <XCircle size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ),
                    )}
                  </div>
                </motion.div>
              )}

              {viewMode === "synthesis" && (
                <motion.div
                  key="synthesis"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#0D1525] border border-amber-500/20 p-12 rounded-[3rem] shadow-2xl text-center relative overflow-hidden h-full flex flex-col justify-center"
                >
                  <Sparkles className="mx-auto text-amber-400 mb-6" size={64} />
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-widest leading-tight">
                    SYNTHESIS COMPLETE
                  </h3>
                  <p className="text-slate-500 text-xs font-bold uppercase mt-4 mb-10 tracking-widest leading-relaxed">
                    Your roadmap is ready.
                  </p>
                  <button
                    onClick={() => setViewMode("matrix")}
                    className="px-10 py-5 bg-amber-500 text-[#050B18] rounded-2xl mx-auto hover:bg-amber-400 transition-all font-black text-sm uppercase tracking-[0.2em] shadow-xl italic"
                  >
                    ACCESS MISSION LOG
                  </button>
                </motion.div>
              )}

              {viewMode === "matrix" && schedule && (
                <motion.div
                  key="matrix"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8 h-full flex flex-col min-h-[600px]"
                >
                  <div className="bg-[#0D1525]/80 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center shadow-2xl gap-4">
                    <h2 className="text-2xl font-black text-cyan-400 uppercase italic tracking-tighter leading-none">
                      TIMETABLE_MATRIX
                    </h2>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setViewMode("config")}
                        className="px-5 py-3 bg-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest"
                      >
                        REGENERATE
                      </button>
                      <button
                        onClick={downloadPDF}
                        className="px-5 py-3 bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border border-white/10"
                      >
                        <Download size={14} /> PDF
                      </button>
                      <button
                        onClick={() => {
                          setSchedule(null);
                          setViewMode("config");
                        }}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    {Object.entries(schedule).map(
                      ([day, tasks]) =>
                        tasks &&
                        tasks.length > 0 && (
                          <div
                            key={day}
                            className="bg-[#0D1525] border border-white/5 p-6 rounded-[2.5rem] shadow-xl flex flex-col min-h-[400px]"
                          >
                            <h3 className="text-sm font-black text-white uppercase mb-6 border-b border-white/5 pb-4 italic tracking-widest">
                              {day}
                            </h3>
                            <div className="space-y-4">
                              {tasks.map((task, i) => (
                                <div
                                  key={i}
                                  className="bg-[#050B18] border border-white/5 p-5 rounded-2xl relative group hover:border-cyan-500/30 transition-all shadow-inner"
                                >
                                  <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-black text-cyan-500 flex items-center gap-2 uppercase tracking-widest uppercase">
                                      <Clock size={12} /> {task.start} —{" "}
                                      {task.end}
                                    </span>
                                    <button
                                      onClick={() =>
                                        removeTaskFromSchedule(day, i)
                                      }
                                      className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                      <XCircle size={14} />
                                    </button>
                                  </div>
                                  <input
                                    className="w-full bg-transparent font-black text-white text-base outline-none focus:text-amber-400 mb-1"
                                    value={task.subject}
                                    onChange={(e) =>
                                      handleEditSchedule(
                                        day,
                                        i,
                                        "subject",
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <textarea
                                    className="w-full bg-transparent text-[11px] text-slate-500 font-bold outline-none resize-none border-none h-12 leading-relaxed"
                                    value={task.activity}
                                    onChange={(e) =>
                                      handleEditSchedule(
                                        day,
                                        i,
                                        "activity",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Manual */}
      <section className="max-w-7xl mx-auto px-6 mt-20 relative z-10">
        <div className="bg-[#111C30]/40 border border-white/5 rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="text-center md:text-left border-b border-white/5 pb-8 mb-10 relative">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3 justify-center md:justify-start leading-none">
              <Info className="text-amber-400" /> OPERATIONAL{" "}
              <span className="text-amber-400">MANUAL</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: Target,
                title: "Mission Target",
                desc: "Define your ultimate exam goal. AI calibrates pace based on this milestone.",
              },
              {
                icon: BookOpen,
                title: "Knowledge Hub",
                desc: "Register main subjects. These form the base layer of your weekly matrix.",
              },
              {
                icon: Zap,
                title: "Priority Repair",
                desc: "List weak subjects. AI assigns 'FOCUS' tags and extra slots automatically.",
              },
              {
                icon: Coffee,
                title: "Recovery Mode",
                desc: "Set rest days. The engine clears these dates entirely to prevent burnout.",
              },
              {
                icon: Layout,
                title: "Active Windows",
                desc: "Define availability. Tasks are strictly confined within these boundaries.",
              },
              {
                icon: CheckCircle2,
                title: "Finalization",
                desc: "Review and live-edit tasks before exporting as professional PDF.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 group hover:border-white/20 transition-all"
              >
                <item.icon
                  className="text-sky-400 mb-4 group-hover:scale-110 transition-transform"
                  size={24}
                />
                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2 italic">
                  0{i + 1}. {item.title}
                </h4>
                <p className="text-slate-500 text-[10px] leading-relaxed uppercase font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default AIScheduler;