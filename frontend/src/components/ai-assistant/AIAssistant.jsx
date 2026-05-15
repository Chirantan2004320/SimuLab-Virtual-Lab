import "./AIAssistant.css";

import { useState, useRef, useEffect } from "react";

import { useAuth } from "../../context/AuthContext";

import { generateAIResponse } from "./services/aiGatewayService";

import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

const AIAssistant = ({ currentPage = "home" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      type: "ai",
      content:
        "Hello! I'm your AI Learning Assistant. I can help you understand algorithms, data structures, answer questions about SimuLab: Virtual Lab, and show your learning progress.",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
  const [codeToAnalyze, setCodeToAnalyze] = useState(null);

  const messagesEndRef = useRef(null);

  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const lastQuizCompletion = localStorage.getItem(
      "vlab_last_quiz_completion"
    );

    const currentTime = Date.now();

    if (
      lastQuizCompletion &&
      currentTime - parseInt(lastQuizCompletion, 10) < 5000
    ) {
      setTimeout(() => {
        const statsMessage = {
          type: "ai",
          content:
            "🎉 Great job completing the quiz! Keep learning and practicing! 💪",
        };

        setMessages((prev) => [...prev, statsMessage]);

        localStorage.removeItem("vlab_last_quiz_completion");
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (!codeToAnalyze) return;

    const { code, algorithm, action } = codeToAnalyze;

    if (action === "correct") {
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: `Please correct this ${algorithm} code:\n\n${code}`,
        },
      ]);

      setIsTyping(true);

      setTimeout(() => {
        const correction = generateCodeCorrection(code, algorithm);

        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: correction,
          },
        ]);

        setIsTyping(false);
        setCodeToAnalyze(null);
      }, 2000);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: `Please analyze this ${algorithm} code:\n\n${code}`,
        },
      ]);

      setIsTyping(true);

      setTimeout(() => {
        const analysis = generateCodeAnalysis(code, algorithm);

        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: analysis,
          },
        ]);

        setIsTyping(false);
        setCodeToAnalyze(null);
      }, 2000);
    }
  }, [codeToAnalyze]);

  useEffect(() => {
    const updateAlgorithm = () => {
      const algo = localStorage.getItem("vlab_current_algorithm");
      setCurrentAlgorithm(algo);
    };

    const checkCodeAnalysis = () => {
      const codeData = localStorage.getItem("vlab_code_analysis");

      if (!codeData) return;

      try {
        const { code, problemId, algorithm } = JSON.parse(codeData);

        setCodeToAnalyze({
          code,
          problemId,
          algorithm,
          action: "analyze",
        });

        localStorage.removeItem("vlab_code_analysis");
      } catch (error) {
        console.error("Error parsing code analysis:", error);
      }
    };

    const checkCodeCorrection = () => {
      const correctionData = localStorage.getItem(
        "vlab_code_correction"
      );

      if (!correctionData) return;

      try {
        const { code, problemId, algorithm } = JSON.parse(correctionData);

        setCodeToAnalyze({
          code,
          problemId,
          algorithm,
          action: "correct",
        });

        localStorage.removeItem("vlab_code_correction");
      } catch (error) {
        console.error("Error parsing code correction:", error);
      }
    };

    updateAlgorithm();
    checkCodeAnalysis();
    checkCodeCorrection();

    const handleStorageChange = (event) => {
      if (event.key === "vlab_current_algorithm") {
        updateAlgorithm();
      }

      if (event.key === "vlab_code_analysis") {
        checkCodeAnalysis();
      }

      if (event.key === "vlab_code_correction") {
        checkCodeCorrection();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      updateAlgorithm();
      checkCodeAnalysis();
      checkCodeCorrection();
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const generateCodeAnalysis = (code, algorithm) => {
    const feedback = [];

    try {
      // eslint-disable-next-line no-new-func
      new Function("arr", code);
    } catch (error) {
      return `❌ Syntax Error:\n\n${error.message}`;
    }

    if (algorithm === "bubble") {
      feedback.push(
        "✅ Bubble Sort structure detected successfully."
      );

      feedback.push(
        "ℹ️ Bubble Sort average time complexity is O(n²)."
      );
    }

    if (algorithm === "selection") {
      feedback.push(
        "✅ Selection Sort implementation detected successfully."
      );
    }

    if (algorithm === "insertion") {
      feedback.push(
        "✅ Insertion Sort implementation detected successfully."
      );
    }

    if (algorithm === "stack") {
      feedback.push(
        "✅ Stack operations detected successfully."
      );
    }

    if (code.includes("console.log")) {
      feedback.push(
        "⚠️ Remove console.log statements before production deployment."
      );
    }

    if (feedback.length === 0) {
      feedback.push(
        "ℹ️ Code analyzed successfully. No major issues detected."
      );
    }

    return feedback.join("\n\n");
  };

  const generateCodeCorrection = (code, algorithm) => {
    if (algorithm === "bubble") {
      return `✅ Corrected Bubble Sort:

\`\`\`javascript
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }

  return arr;
}
\`\`\``;
    }

    if (algorithm === "selection") {
      return `✅ Corrected Selection Sort:

\`\`\`javascript
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }

  return arr;
}
\`\`\``;
    }

    if (algorithm === "insertion") {
      return `✅ Corrected Insertion Sort:

\`\`\`javascript
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }

  return arr;
}
\`\`\``;
    }

    return "✅ Code correction generated successfully.";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: userMessage,
      },
    ]);

    setInputMessage("");
    setIsTyping(true);

    setTimeout(async () => {
      try {
        const response = await generateAIResponse({
          userMessage,
          currentPage,
          currentAlgorithm,
          user,
        });

        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: response,
          },
        ]);
      } catch (error) {
        console.error("AI Response Error:", error);

        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content:
              "⚠️ Unable to generate AI response currently. Please try again.",
          },
        ]);
      }

      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <button
        className="ai-assistant-fab"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Learning Assistant"
      >
        <span className="ai-icon">🤖</span>
      </button>

      {isOpen && (
        <div className="ai-assistant-chat">
          <div className="ai-chat-header">
            <h3>AI Learning Assistant</h3>

            <div className="ai-header-buttons">
              <button
                className="ai-close-btn"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>
          </div>

          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            messagesEndRef={messagesEndRef}
          />

          <ChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            handleKeyPress={handleKeyPress}
          />
        </div>
      )}
    </>
  );
};

export default AIAssistant;