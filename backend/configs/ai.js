import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

dotenv.config();

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const generateAI = async (prompt) => {
  try {
    const command = new ConverseCommand({
      modelId: "mistral.mistral-large-2402-v1:0",

      messages: [
        {
          role: "user",
          content: [{ text: prompt }],
        },
      ],

      inferenceConfig: {
        maxTokens: 800,
        temperature: 0.3,
        topP: 0.9,
      },
    });

    const response = await client.send(command);

    return response.output.message.content[0].text || "";
  } catch (error) {
    console.error("Bedrock Error:", error);
    throw new Error("AI generation failed");
  }
};