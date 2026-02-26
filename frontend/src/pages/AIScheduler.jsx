import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { serverUrl } from "../App";
import { 
  Calendar, Clock, Download, Trash2, Sparkles, 
  BookOpen, XCircle, Plus, X, Hash, AlertCircle
} from "lucide-react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AIScheduler = () => {
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [weakInput, setWeakInput] = useState("");
  const [weakSubjects, setWeakSubjects] = useState([]);
  const [offDays, setOffDays] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [freeTimeSlots, setFreeTimeSlots] = useState(
    daysOfWeek.reduce((acc, d) => ({ ...acc, [d]: [] }), {})
  );

  // -- TAG SYSTEM LOGIC (General & Weak) --
  const handleKeyDown = (e, type) => {
    if (e.key === 'Enter' && (type === 'sub' ? subjectInput : weakInput).trim()) {
      e.preventDefault();
      const val = (type === 'sub' ? subjectInput : weakInput).trim();
      
      if (type === 'sub') {
        if (!subjects.includes(val)) setSubjects([...subjects, val]);
        setSubjectInput("");
      } else {
        if (!weakSubjects.includes(val)) setWeakSubjects([...weakSubjects, val]);
        setWeakInput("");
      }
    }
  };

  const removeTag = (val, type) => {
    if (type === 'sub') setSubjects(subjects.filter(s => s !== val));
    else setWeakSubjects(weakSubjects.filter(s => s !== val));
  };

  // -- TIME SLOT ACTIONS --
  const addFreeSlot = (day) => {
    setFreeTimeSlots({
      ...freeTimeSlots,
      [day]: [...freeTimeSlots[day], { start: "09:00", end: "11:00" }]
    });
  };

  const removeFreeSlot = (day, index) => {
    const updatedSlots = [...freeTimeSlots[day]];
    updatedSlots.splice(index, 1);
    setFreeTimeSlots({ ...freeTimeSlots, [day]: updatedSlots });
  };

  const toggleOffDay = (day) => {
    setOffDays((p) => p.includes(day) ? p.filter((d) => d !== day) : [...p, day]);
  };

  const generate = async () => {
    if (subjects.length === 0) return alert("Bhai, subjects toh daal pehle!");
    setLoading(true);
    try {
      const payload = {
        structuredData: {
          subjects,
          weakSubjects,
          freeTimeSlots,
          offDays,
        }
      };
      const res = await axios.post(`${serverUrl}/api/ai-scheduler/generate`, payload);
      setSchedule(res.data.schedule);
    } catch (err) {
      alert("Blueprint generation failed!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
      {/* Dynamic Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent mb-2 tracking-tighter">
            STUDY_ARCHITECT.v2
          </h1>
          <p className="text-slate-500 font-bold tracking-[0.4em] uppercase text-[10px]">Precision Logic Engineering</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: INPUTS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 italic tracking-tighter border-b border-slate-800 pb-4">
                <Sparkles className="text-cyan-400" size={22} /> SYSTEM_CONFIG
              </h2>
              
              <div className="space-y-8">
                {/* Master Subjects */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-3 block">Subject Inventory</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {subjects.map(sub => (
                      <span key={sub} className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-300 animate-in fade-in scale-95">
                        {sub} <X size={14} className="cursor-pointer hover:text-white" onClick={() => removeTag(sub, 'sub')}/>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <Hash className="absolute left-4 top-3.5 text-slate-600" size={16}/>
                    <input 
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-10 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm placeholder:text-slate-700"
                      placeholder="Add master subject..."
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'sub')}
                    />
                  </div>
                </div>

                {/* Weak Subjects Tag System */}
                <div>
                  <label className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest ml-1 mb-3 block">High Priority (Weak Subjects)</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {weakSubjects.map(sub => (
                      <span key={sub} className="flex items-center gap-1.5 bg-fuchsia-500/10 border border-fuchsia-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-fuchsia-300 animate-in fade-in scale-95">
                        <AlertCircle size={12}/> {sub} <X size={14} className="cursor-pointer hover:text-white" onClick={() => removeTag(sub, 'weak')}/>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <Plus className="absolute left-4 top-3.5 text-slate-600" size={16}/>
                    <input 
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-10 pr-4 py-3.5 focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all text-sm placeholder:text-slate-700"
                      placeholder="Define weak subject..."
                      value={weakInput}
                      onChange={(e) => setWeakInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'weak')}
                    />
                  </div>
                </div>

                {/* Blackout Days */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-3 block">Blackout Schedule</label>
                  <div className="grid grid-cols-4 gap-2">
                    {daysOfWeek.map(day => (
                      <button key={day} onClick={() => toggleOffDay(day)}
                        className={`py-2 rounded-xl text-[9px] font-black transition-all border ${
                          offDays.includes(day) ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "bg-slate-950/50 border-slate-800 text-slate-600"
                        }`}>
                        {day.substring(0, 3).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl max-h-[350px] overflow-y-auto custom-scrollbar">
              <h2 className="text-sm font-black mb-4 flex items-center gap-2 text-slate-400">
                <Clock size={16} /> OPERATIONAL_WINDOWS
              </h2>
              {daysOfWeek.map(day => !offDays.includes(day) && (
                <div key={day} className="mb-3 p-4 bg-slate-950/30 rounded-2xl border border-slate-800/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-slate-400 tracking-widest">{day.toUpperCase()}</span>
                    <button onClick={() => addFreeSlot(day)} className="p-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-all">
                      <Plus size={12}/>
                    </button>
                  </div>
                  {freeTimeSlots[day].map((slot, i) => (
                    <div key={i} className="flex items-center gap-3 mb-2 animate-in slide-in-from-left-4">
                      <input type="time" value={slot.start} className="bg-slate-900/80 border border-slate-800 rounded-lg text-[10px] p-2 text-cyan-400 outline-none" 
                        onChange={e => {
                          const updated = [...freeTimeSlots[day]]; updated[i].start = e.target.value;
                          setFreeTimeSlots({...freeTimeSlots, [day]: updated});
                        }} />
                      <input type="time" value={slot.end} className="bg-slate-900/80 border border-slate-800 rounded-lg text-[10px] p-2 text-cyan-400 outline-none" 
                        onChange={e => {
                          const updated = [...freeTimeSlots[day]]; updated[i].end = e.target.value;
                          setFreeTimeSlots({...freeTimeSlots, [day]: updated});
                        }} />
                      <button onClick={() => removeFreeSlot(day, i)} className="text-slate-700 hover:text-red-500 transition-colors">
                        <X size={16}/>
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <button 
              onClick={generate}
              disabled={loading}
              className="w-full bg-gradient-to-br from-indigo-600 to-fuchsia-700 hover:from-indigo-500 hover:to-fuchsia-600 text-white py-5 rounded-[2rem] font-black tracking-[0.2em] text-xs shadow-2xl shadow-indigo-500/20 transition-all transform active:scale-95"
            >
              {loading ? "COMPILE_IN_PROGRESS..." : "INITIALIZE_BLUEPRINT"}
            </button>
          </div>

          {/* RIGHT: OUTPUT DISPLAY */}
          <div className="lg:col-span-7">
            {schedule ? (
              <div className="space-y-6 animate-in fade-in duration-700">
                <div className="flex justify-between items-center bg-slate-900/40 backdrop-blur-3xl p-6 rounded-[2rem] border border-slate-800">
                  <div className="flex flex-col">
                    <h2 className="text-xl font-black italic tracking-tighter text-cyan-400">OUTPUT_MATRIX</h2>
                    <span className="text-[8px] text-slate-500 font-bold uppercase">Dynamic Schedule V2.0.4</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-slate-800 px-5 py-2.5 rounded-2xl text-[10px] font-black hover:bg-slate-700 transition-all border border-slate-700 shadow-xl"><Download size={14}/> PDF</button>
                    <button onClick={() => setSchedule(null)} className="p-2.5 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 border border-red-500/20 transition-all"><Trash2 size={18}/></button>
                  </div>
                </div>

                <div className="grid gap-6">
                  {Object.entries(schedule).map(([day, tasks]) => tasks.length > 0 && (
                    <div key={day} className="bg-slate-900/20 border border-slate-800/60 p-8 rounded-[2.5rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl select-none uppercase tracking-tighter">{day.substring(0,3)}</div>
                      <h3 className="text-xs font-black text-slate-400 mb-6 flex items-center gap-3 uppercase tracking-[0.3em]">
                        <Calendar size={14} className="text-indigo-500"/> {day}
                      </h3>
                      <div className="grid gap-4">
                        {tasks.map((task, i) => (
                          <div key={i} className={`p-5 rounded-[1.5rem] border transition-all relative ${
                            task.subject === "Break" ? "bg-yellow-500/5 border-yellow-500/20" : "bg-slate-950/80 border-slate-800 hover:border-cyan-500/30"
                          }`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-bold text-cyan-500/70 tracking-widest flex items-center gap-1">
                                <Clock size={12}/> {task.start} — {task.end}
                              </span>
                              {weakSubjects.includes(task.subject) && (
                                <span className="text-[8px] bg-fuchsia-500/20 text-fuchsia-400 px-2 py-0.5 rounded-full font-black border border-fuchsia-500/20">PRIORITY</span>
                              )}
                            </div>
                            <input className="w-full bg-transparent font-black text-slate-100 outline-none mb-1 focus:text-cyan-400 text-sm tracking-tight" value={task.subject} />
                            <textarea className="w-full bg-transparent text-xs text-slate-500 outline-none resize-none h-6 focus:text-slate-300" value={task.activity} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-slate-900/10 border-2 border-dashed border-slate-800 rounded-[3rem] text-slate-800 group transition-all hover:border-slate-700">
                <BookOpen size={80} className="mb-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700" />
                <div className="text-center space-y-2">
                  <p className="font-black uppercase tracking-[0.5em] text-xs opacity-20">Standby Mode</p>
                  <p className="text-[10px] font-bold opacity-10 uppercase tracking-widest">Awaiting System Configuration</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIScheduler;