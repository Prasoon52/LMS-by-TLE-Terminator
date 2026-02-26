import { generateSchedule } from "../services/aiScheduler.service.js";

export const aiSchedulerController = async (req, res) => {
  try {
    const { messages } = req.body;

    const result = await generateSchedule(messages);

    res.status(200).json(result);
  } catch (error) {
    console.error("Scheduler Error:", error);
    res.status(500).json({ error: "Failed to generate schedule" });
  }
};