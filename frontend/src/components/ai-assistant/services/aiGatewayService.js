import {
  generateLocalResponse,
} from "./localResponseService";

import {
  askGeminiAI,
} from "./geminiService";

export const generateAIResponse =
  async ({
    userMessage,
    currentPage,
    currentAlgorithm,
    user,
  }) => {
    // STEP 1:
    // Try local educational intelligence first

    const localResponse =
      generateLocalResponse({
        userMessage,
        currentPage,
        currentAlgorithm,
        user,
      });

    // If local system answered confidently
    if (localResponse) {
      return localResponse;
    }

    // STEP 2:
    // Fallback to Gemini AI

    const aiResponse =
      await askGeminiAI({
        message: userMessage,
        currentPage,
        currentAlgorithm,
      });

    return aiResponse;
  };