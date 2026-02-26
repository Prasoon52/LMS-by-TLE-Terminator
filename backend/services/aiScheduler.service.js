const timeToMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

export const generateSchedule = async (structuredData) => {
  if (!structuredData || !structuredData.subjects) {
    throw new Error("Invalid structuredData provided");
  }

  const { subjects, weakSubjects = [], freeTimeSlots, offDays = [] } = structuredData;
  const schedule = {
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  };

  if (!subjects.length) return schedule;

  // Weight subjects
  const weightedSubjects = [];
  subjects.forEach(sub => {
    weightedSubjects.push(sub);
    if (weakSubjects.includes(sub)) weightedSubjects.push(sub);
  });

  let subjectPointer = 0;

  for (const day of Object.keys(schedule)) {
    if (offDays.includes(day)) continue;

    const slots = freeTimeSlots[day] || [];
    for (const slot of slots) {
      let start = timeToMinutes(slot.start);
      let end = timeToMinutes(slot.end);
      let duration = end - start;

      // Logic: If slot > 120 mins (2h), split with a 15 min break
      if (duration > 120) {
        const studyChunk = Math.floor(duration / 2) - 7; 
        
        // Session 1
        const sub1 = weightedSubjects[subjectPointer++ % weightedSubjects.length];
        schedule[day].push({
          start: minutesToTime(start),
          end: minutesToTime(start + studyChunk),
          subject: sub1,
          activity: `Deep dive into ${sub1}`,
          type: "study"
        });

        // Break
        schedule[day].push({
          start: minutesToTime(start + studyChunk),
          end: minutesToTime(start + studyChunk + 15),
          subject: "Break",
          activity: "Stretch and hydrate",
          type: "break"
        });

        // Session 2
        const sub2 = weightedSubjects[subjectPointer++ % weightedSubjects.length];
        schedule[day].push({
          start: minutesToTime(start + studyChunk + 15),
          end: minutesToTime(end),
          subject: sub2,
          activity: `Practice ${sub2} problems`,
          type: "study"
        });
      } else {
        // Single session for shorter slots
        const sub = weightedSubjects[subjectPointer++ % weightedSubjects.length];
        schedule[day].push({
          start: minutesToTime(start),
          end: minutesToTime(end),
          subject: sub,
          activity: `Study ${sub}`,
          type: "study"
        });
      }
    }
  }
  return schedule;
};