import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateSchedule = async (structuredData) => {
  const { subjects, weakSubjects, freeTimeSlots, offDays } = structuredData;

  const prompt = `
    Act as an Advanced Study Architect. Create a high-performance study schedule.
    
    DATA:
    - Master Subjects: ${subjects.join(", ")}
    - Weak Subjects (Higher Fatigue): ${weakSubjects.join(", ")}
    - Available Slots: ${JSON.stringify(freeTimeSlots)}
    - Global Off Days: ${offDays.join(", ")}

    INTELLIGENT BREAK LOGIC:
    1. Weak Subjects: Allot 45-60 min blocks followed by a 15 min "Neural Recovery" break.
    2. Strong Subjects: Allot 90 min deep-work blocks followed by a 10 min break.
    3. If a slot is > 2 hours, split it into multiple sessions with a mandatory "Power Break".
    4. NO study sessions on Off Days.

    OUTPUT FORMAT (STRICT JSON ONLY):
    {
      "Monday": [{"start": "HH:MM", "end": "HH:MM", "subject": "Name", "activity": "Specific task", "type": "study" | "break"}],
      ...repeat for all days
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a JSON-only API that returns optimized study schedules." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile", // Latest Groq model
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("Groq AI Error:", error);
    throw new Error("Groq failed to architect the schedule.");
  }
};