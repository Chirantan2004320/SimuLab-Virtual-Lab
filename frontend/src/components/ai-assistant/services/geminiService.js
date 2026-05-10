import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

export const askGeminiAI = async ({
  message,
  currentPage,
  currentAlgorithm,
}) => {
  try {
    console.log(
      "Sending request to backend..."
    );

    const response = await axios.post(
      `${API_BASE_URL}/api/ai/chat`,
      {
        message,
        currentPage,
        currentAlgorithm,
      }
    );

    console.log(
      "Backend Response:",
      response.data
    );

    return response.data.reply;
  } catch (error) {
    console.error(
      "Frontend Gemini Error:",
      error
    );

    // IMPORTANT
    if (error.response) {
      console.error(
        "Backend Error Response:",
        error.response.data
      );
    }

    if (error.request) {
      console.error(
        "No response received from backend"
      );
    }

    return "⚠️ AI service is currently unavailable.";
  }
};