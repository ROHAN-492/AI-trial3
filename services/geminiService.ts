
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_API_MODEL, EMOTION_ANALYSIS_PROMPT } from '../constants';

// IMPORTANT: API_KEY is expected to be available in the environment.
// process.env.API_KEY is a placeholder for how it would typically be accessed.
// In a browser environment without a build process that handles .env files, 
// this would need to be set globally (e.g. window.GEMINI_API_KEY) or passed differently.
// For this exercise, we assume 'process.env.API_KEY' is resolvable.
// If this were a Node.js backend, `process.env.API_KEY` would be standard.
// For a pure frontend app deployed statically, the key management strategy would differ
// (e.g., proxied through a backend, or direct (less secure for client-side)).

// Fallback for browser-like environments where process.env might not be defined.
// In a real app, this key should be securely managed and not hardcoded or easily accessible client-side.
const apiKeyFromEnv = (typeof process !== 'undefined' && process.env && process.env.API_KEY) 
                      ? process.env.API_KEY 
                      : undefined; // Or a fallback / error if not found

if (!apiKeyFromEnv) {
  console.error(
    "Gemini API Key is not found. Please ensure the API_KEY environment variable is set."
  );
  // In a real application, you might throw an error here or disable API-dependent features.
}

// Initialize with a check for the API key to prevent runtime errors if not set.
const ai = apiKeyFromEnv ? new GoogleGenAI({ apiKey: apiKeyFromEnv }) : null;

export async function analyzeImageEmotion(base64ImageData: string, mimeType: string): Promise<string> {
  if (!ai) {
    throw new Error("Gemini API client is not initialized. Check API Key configuration.");
  }
  if (!apiKeyFromEnv) { // Redundant check, but good for safety
    throw new Error("Gemini API Key is not configured.");
  }

  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageData,
      },
    };
    const textPart = {
      text: EMOTION_ANALYSIS_PROMPT,
    };

    // The Gemini API model name is already in GEMINI_API_MODEL constant.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_API_MODEL,
      contents: { parts: [imagePart, textPart] },
      // Not using thinkingConfig or other specific configs for this general use case to keep it simple.
      // Default should be fine.
    });

    const emotionText = response.text; // Direct access to text as per guidelines
    
    if (!emotionText || emotionText.trim() === "") {
        // This could happen if the model returns an empty response.
        return "AI could not determine an emotion. The response was empty.";
    }
    return emotionText.trim();

  } catch (error: unknown) {
    console.error("Error analyzing image emotion with Gemini API:", error);
    let errorMessage = "Failed to analyze emotion due to an unknown API error.";
    if (error instanceof Error) {
        // Check for common API key issues or other specific errors if known
        if (error.message.toLowerCase().includes("api key not valid") || error.message.toLowerCase().includes("permission denied")) {
             errorMessage = "Invalid or missing Gemini API Key. Please check your configuration.";
        } else if (error.message.toLowerCase().includes("quota") || error.message.toLowerCase().includes("rate limit")) {
            errorMessage = "API request limit reached. Please try again later.";
        } else if (error.message.toLowerCase().includes("deadline exceeded") || error.message.toLowerCase().includes("timeout")) {
            errorMessage = "The request to the AI timed out. Please try again.";
        }
        else {
            errorMessage = `API Error: ${error.message}`;
        }
    }
    throw new Error(errorMessage);
  }
}
