import dotenv from "dotenv";
import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import { generateAI } from "../configs/ai.js";

dotenv.config();

export const searchWithAi = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const prompt = `
You are an intelligent assistant for an LMS platform.

Return ONE keyword from this list:
App Development
AI/ML
AI Tools
Data Science
Data Analytics
Ethical Hacking
UI UX Designing
Web Development
Others
Physics
Chemistry
Beginner
Intermediate
Advanced

Query: ${input}

Only reply with one keyword.
`;

    const keyword = (await generateAI(prompt)).trim();

    const courses = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: input, $options: "i" } },
        { subTitle: { $regex: input, $options: "i" } },
        { description: { $regex: input, $options: "i" } },
        { category: { $regex: input, $options: "i" } },
        { level: { $regex: input, $options: "i" } },
      ],
    });

    if (courses.length > 0) {
      return res.status(200).json(courses);
    }

    const aiCourses = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { subTitle: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { level: { $regex: keyword, $options: "i" } },
      ],
    });

    return res.status(200).json(aiCourses);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "AI search failed" });
  }
};

export const getCareerGuidance = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);

    const userSkills = user.skills?.length
      ? user.skills.join(", ")
      : "Not specified yet";
    const userInterests = user.interests?.length
      ? user.interests.join(", ")
      : "Not specified yet";
    const userFields = user.preferredFields?.length
      ? user.preferredFields.join(", ")
      : "Not specified yet";

    const prompt = `
You are an expert Career Counselor.

USER PROFILE:
Name: ${user.name}
Bio: ${user.description}
Role: ${user.role}
Skills: ${userSkills}
Interests: ${userInterests}
Preferred Fields: ${userFields}

FORMAT RULES:
- Bullet points only
- Max 3-4 bullets per section
- Markdown headers
- Use emojis

SECTIONS:
🎯 Recommended Career Paths
🏫 Top Certifications
🛠️ Skill Gap Analysis
🗺️ 6-Month Roadmap
`;

    const guidance = await generateAI(prompt);

    return res.status(200).json({ guidance });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error generating career guidance" });
  }
};

export const getFollowUpGuidance = async (req, res) => {
  try {
    let { previousGuidance, question } = req.body;

    const user = await User.findById(req.userId);

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    if (!previousGuidance) {
      previousGuidance = "No previous guidance provided.";
    }

    const userSkills = user.skills?.length
      ? user.skills.join(", ")
      : "Not specified yet";
    const userInterests = user.interests?.length
      ? user.interests.join(", ")
      : "Not specified yet";

    const chatPrompt = `
You are a Career Counselor.

Previous guidance:
${previousGuidance}

User question:
${question}

User skills: ${userSkills}
User interests: ${userInterests}

Answer in short bullet points.
`;

    const answer = await generateAI(chatPrompt);

    return res.status(200).json({ answer });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error answering question" });
  }
};
