import { askGemini } from "../services/geminiService.js";

export const chatWithAI = async (req, res) => {
  try {
    const {
      message,
      currentPage,
      currentAlgorithm,
    } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const reply = await askGemini({
      message,
      currentPage,
      currentAlgorithm,
    });

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "AI server error",
    });
  }
};