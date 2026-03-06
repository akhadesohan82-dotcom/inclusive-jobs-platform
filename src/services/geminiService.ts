import { GoogleGenAI, Type } from "@google/genai";
import { Job, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getJobRecommendations(userProfile: UserProfile, allJobs: Job[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze the following user profile and list of jobs. 
        Recommend the top 3 jobs that best match both the user's skills AND their accessibility needs.
        
        User Profile:
        ${JSON.stringify(userProfile)}
        
        Available Jobs:
        ${JSON.stringify(allJobs)}
        
        Return the result as a JSON array of job IDs only.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const recommendedIds = JSON.parse(response.text || "[]");
    return allJobs.filter(job => recommendedIds.includes(job.id));
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return allJobs.slice(0, 3); // Fallback
  }
}

export async function generateJobDescription(title: string, company: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a professional and inclusive job description for a ${title} position at ${company}. Focus on being welcoming to people with disabilities and highlighting potential accommodations.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating job description:", error);
    return "Join our inclusive team...";
  }
}
