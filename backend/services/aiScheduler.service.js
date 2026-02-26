import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateSchedule = async (messages) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
You are an intelligent academic schedule generator.

Rules:
1. Ask questions if information is missing.
2. Generate structured weekly study plan.
3. Respond ONLY in valid JSON.
4. No markdown or extra explanation.

Format:
{
  "questions": [],
  "schedule": {
    "Monday": [],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": [],
    "Sunday": []
  }
}
`
      },
      ...messages,
    ],
    temperature: 0.4,
  });

  const response = completion.choices[0].message.content;
  return JSON.parse(response);
};