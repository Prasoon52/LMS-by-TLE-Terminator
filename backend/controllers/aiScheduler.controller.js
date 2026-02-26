import { generateSchedule } from "../services/aiScheduler.service.js";

export const aiSchedulerController = async (req, res) => {
  try {
    const { structuredData } = req.body;

    if (!structuredData?.subjects?.length) {
      return res.status(400).json({ error: "At least one subject is required" });
    }

    const schedule = await generateSchedule(structuredData);
    return res.status(200).json({ schedule });
  } catch (error) {
    console.error("Scheduler Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};