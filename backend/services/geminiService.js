import OpenAI from "openai";

console.log(
  "OpenRouter Key:",
  process.env.OPENROUTER_API_KEY
);

const openai = new OpenAI({

  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const askGemini = async ({
  message,
  currentPage,
  currentAlgorithm,
}) => {
  try {
    const completion =
      await openai.chat.completions.create({
        model:
          "openrouter/free",

        messages: [
          {
            role: "system",
            content: `
You are SimuLab AI Assistant,
an intelligent educational assistant integrated into SimuLab Virtual Labs.

About SimuLab:
- SimuLab is an interactive virtual lab platform
- It helps engineering students learn through simulations and experiments
- Subjects include DSA, DBMS, DTSP, and VLSI
- Focus on practical learning and visualization

Your behavior:
- Be friendly and student-focused
- Give concise answers
- Keep responses conversational
- Avoid robotic introductions
- Do not say "Welcome to SimuLab" repeatedly
- Answer directly and naturally
- Prefer answers under 80 words
- Use bullet points when useful
- Explain concepts simply

If user asks about SimuLab:
Explain its educational benefits naturally.

Current Page:
${currentPage}

Current Algorithm:
${currentAlgorithm || "None"}


Rules:
- Keep answers SHORT and concise
- Maximum 5-6 lines unless user asks for detailed explanation
- Explain in simple student-friendly language
- Focus only on the core concept
- Use bullet points when possible
- Avoid unnecessary theory
- Give direct educational answers
- If asked for code, provide short code examples
- Prefer answers under 80 words
`,
          },

          {
            role: "user",
            content: message,
          },
        ],
      });

    return (
      completion.choices[0]?.message
        ?.content ||
      "⚠️ No AI response generated."
    );
  } catch (error) {
    console.error(
      "OpenRouter Error:",
      error
    );

    return "⚠️ AI service is temporarily unavailable.";
  }
};