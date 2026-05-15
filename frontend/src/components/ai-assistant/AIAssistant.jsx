import "./AIAssistant.css";

import { useState, useRef, useEffect } from "react";



import { useAuth } from "../../context/AuthContext";

import {
  getStudentStats,
} from "./services/studentStatsService";

import {
  generateAssignmentHelp,
} from "./services/assignmentService";

import {
  analyzeCode,
} from "./services/codeAnalysisService";

import {
  correctCode,
} from "./services/codeCorrectionService";

import {
  generateLocalResponse,
} from "./services/localResponseService";

import {
  generateAIResponse,
} from "./services/aiGatewayService";

import formatMessageContent from "./utils/formatMessageContent";

import ChatMessages from "./components/ChatMessages";

import ChatInput from "./components/ChatInput";



const AIAssistant = ({ currentPage = "home", instituteMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "ai",
      content: "Hello! I'm your AI Learning Assistant. I can help you understand algorithms, data structures, answer questions about SimuLab: Virtual Lab, and show your learning progress. Try asking 'show my stats' after completing experiments!"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
  const [codeToAnalyze, setCodeToAnalyze] = useState(null);
  
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const getStudentStats = () => {
    // Per-user progress key if user is logged in
    const progressKey = user ? `vlab_progress_${user.id}` : null;
    let progress = null;
    if (progressKey) {
      try {
        progress = JSON.parse(localStorage.getItem(progressKey) || 'null');
      } catch (e) {
        progress = null;
      }
    }

    const quizScores = progress?.quizzes || JSON.parse(localStorage.getItem('vlab_scores') || '[]');
    const completedExperiments = progress?.experiments || JSON.parse(localStorage.getItem('vlab_completed_experiments') || '[]');
    const codingPractice = progress?.practice || JSON.parse(localStorage.getItem('vlab_practice') || '{}');

    let stats = "📊 Your Learning Statistics:\n\n";

    if (quizScores.length > 0) {
      const latestScore = quizScores[quizScores.length - 1];
      const percentage = Math.round((latestScore.correct / latestScore.total) * 100);
      stats += `🎯 Latest Quiz Score: ${latestScore.correct}/${latestScore.total} (${percentage}%)\n`;
    }

    if (completedExperiments.length > 0) {
      stats += `🧪 Experiments Completed: ${completedExperiments.length}\n`;
    }

    if (Object.keys(codingPractice).length > 0) {
      const totalAttempts = Object.values(codingPractice).reduce((sum, attempts) => sum + attempts, 0);
      stats += `💻 Coding Practice Attempts: ${totalAttempts}\n`;
    }

    if (quizScores.length === 0 && completedExperiments.length === 0) {
      stats += "You haven't completed any experiments yet. Start with the labs to see your progress here!\n";
    }

    stats += "\nKeep learning! 💪";
    return stats;
  };

  // Assignment and deadline helpers
  const getAssignmentsForUser = (user) => {
    try {
      if (user && user.id) {
        return JSON.parse(localStorage.getItem(`vlab_assignments_${user.id}`) || '[]');
      }
    } catch (e) { }
    // Fallback to global assignments
    try { return JSON.parse(localStorage.getItem('vlab_assignments') || '[]'); } catch (e) { return []; }
  };

  const saveAssignmentForUser = (user, assignment) => {
    try {
      if (user && user.id) {
        const key = `vlab_assignments_${user.id}`;
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.push(assignment);
        localStorage.setItem(key, JSON.stringify(list));
        return true;
      }
    } catch (e) {
      console.error('Error saving user assignment', e);
    }
    try {
      const list = JSON.parse(localStorage.getItem('vlab_assignments') || '[]');
      list.push(assignment);
      localStorage.setItem('vlab_assignments', JSON.stringify(list));
      return true;
    } catch (e) { return false; }
  };

  const computeAssignmentProgress = (user) => {
    const assignments = getAssignmentsForUser(user);
    if (!assignments || assignments.length === 0) return { total: 0, submitted: 0, remaining: 0, nextDue: null, details: [] };
    const now = Date.now();
    const details = assignments.map(a => {
      const due = a.due ? new Date(a.due).getTime() : null;
      const submitted = !!a.submitted;
      const daysLeft = due ? Math.ceil((due - now) / (1000 * 60 * 60 * 24)) : null;
      return { ...a, dueTimestamp: due, submitted, daysLeft };
    });
    const total = details.length;
    const submitted = details.filter(d => d.submitted).length;
    const remaining = total - submitted;
    const upcoming = details.filter(d => !d.submitted && d.dueTimestamp).sort((x, y) => x.dueTimestamp - y.dueTimestamp)[0] || null;
    return { total, submitted, remaining, nextDue: upcoming, details };
  };



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check for new quiz completion
    const lastQuizCompletion = localStorage.getItem('vlab_last_quiz_completion');
    const currentTime = Date.now();

    if (lastQuizCompletion && (currentTime - parseInt(lastQuizCompletion)) < 5000) { // Within 5 seconds
      // Auto-show stats after quiz completion
      setTimeout(() => {
        const statsMessage = {
          type: "ai",
          content: "🎉 Great job completing the quiz! Here's your updated performance summary:\n\n"
        };
        setMessages(prev => [...prev, statsMessage]);
        localStorage.removeItem('vlab_last_quiz_completion'); // Clear the flag
      }, 1000);
    }
  }, []);

  // Handle code analysis and correction requests
  useEffect(() => {
    if (codeToAnalyze) {
      const { code, problemId, algorithm, action } = codeToAnalyze;

      if (action === 'correct') {
        // Add user message about code correction
        setMessages(prev => [...prev, {
          type: "user",
          content: `Please correct this ${algorithm} code:\n\n${code}`
        }]);

        setIsTyping(true);

        // Simulate correction time
        setTimeout(() => {
          const correction = correctCode(code, algorithm, problemId);
          setMessages(prev => [...prev, { type: "ai", content: correction }]);
          setIsTyping(false);
          setCodeToAnalyze(null);
        }, 2500);
      } else {
        // Handle analysis
        setMessages(prev => [...prev, {
          type: "user",
          content: `Please analyze this ${algorithm} code:\n\n${code}`
        }]);

        setIsTyping(true);

        // Simulate analysis time
        setTimeout(() => {
          const analysis = analyzeCode(code, algorithm, problemId);
          setMessages(prev => [...prev, { type: "ai", content: analysis }]);
          setIsTyping(false);
          setCodeToAnalyze(null);
        }, 2000);
      }
    }
  }, [codeToAnalyze]);

  // Listen for algorithm changes and code analysis/correction requests
  useEffect(() => {
    const updateAlgorithm = () => {
      const algo = localStorage.getItem('vlab_current_algorithm');
      setCurrentAlgorithm(algo);
    };

    const checkCodeAnalysis = () => {
      const codeData = localStorage.getItem('vlab_code_analysis');
      if (codeData) {
        try {
          const { code, problemId, algorithm } = JSON.parse(codeData);
          setCodeToAnalyze({ code, problemId, algorithm, action: 'analyze' });
          // Clear the request
          localStorage.removeItem('vlab_code_analysis');
        } catch (e) {
          console.error('Error parsing code analysis data:', e);
        }
      }
    };

    const checkCodeCorrection = () => {
      const correctionData = localStorage.getItem('vlab_code_correction');
      if (correctionData) {
        try {
          const { code, problemId, algorithm } = JSON.parse(correctionData);
          setCodeToAnalyze({ code, problemId, algorithm, action: 'correct' });
          // Clear the request
          localStorage.removeItem('vlab_code_correction');
        } catch (e) {
          console.error('Error parsing code correction data:', e);
        }
      }
    };

    // Initial load
    updateAlgorithm();
    checkCodeAnalysis();
    checkCodeCorrection();

    // Listen for storage changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'vlab_current_algorithm') {
        updateAlgorithm();
      } else if (e.key === 'vlab_code_analysis') {
        checkCodeAnalysis();
      } else if (e.key === 'vlab_code_correction') {
        checkCodeCorrection();
      }
    });

    // Also check periodically for local changes
    const interval = setInterval(() => {
      updateAlgorithm();
      checkCodeAnalysis();
      checkCodeCorrection();
    }, 1000);

    return () => {
      window.removeEventListener('storage', updateAlgorithm);
      clearInterval(interval);
    };
  }, []);

  const getContextualHelp = (page) => {
    const algo = currentAlgorithm;
    const contextMap = {
      home: "Welcome to SimuLab: Virtual Lab! I can help you navigate through different data structures and algorithms. You can explore sorting algorithms, stacks, and more.",
      "labs/dsa": algo === "bubble"
        ? "You're exploring Bubble Sort! This algorithm works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. Each pass moves the largest element to the end."
        : algo === "selection"
          ? "You're exploring Selection Sort! This algorithm divides the input into sorted and unsorted regions, repeatedly finding the minimum element from the unsorted region and putting it at the beginning."
          : "You're in the Data Structures and Algorithms lab. I can help you understand sorting algorithms, their time/space complexity, and implementation details.",
      "labs/stack": "You're exploring Stack data structures! A stack follows LIFO (Last In, First Out) principle. I can help you understand push, pop operations, and stack applications."
    };
    return contextMap[page] || "I'm here to help you learn about computer science concepts and algorithms!";
  };

  const analyzeCode = (code, algorithm, problemId) => {
    // Load custom configurations
    let customConfigs = {};
    try {
      const saved = localStorage.getItem('vlab_ai_configs');
      if (saved) {
        customConfigs = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading AI configs:', e);
    }

    // Default configurations
    const defaultConfigs = {
      bubble: {
        correctStructure: "✅ **Correct Structure**: Your code has the basic bubble sort structure with nested loops and comparisons.",
        structureIssue: "⚠️ **Structure Issue**: Bubble sort typically uses nested loops with adjacent element comparisons.",
        outerLoop: "✅ **Outer Loop**: Correct outer loop condition to avoid unnecessary passes.",
        innerLoop: "✅ **Inner Loop**: Correct inner loop optimization to reduce comparisons.",
        swapping: "✅ **Swapping**: Good swapping implementation.",
        timeComplexity: "ℹ️ **Time Complexity**: This bubble sort has O(n²) time complexity."
      },
      selection: {
        selectionLogic: "✅ **Selection Logic**: Your code identifies minimum elements correctly.",
        loopStructure: "✅ **Loop Structure**: Correct nested loop structure for selection sort.",
        timeComplexity: "ℹ️ **Time Complexity**: This selection sort has O(n²) time complexity."
      },
      insertion: {
        insertionLogic: "✅ **Insertion Logic**: Good implementation of insertion sort with key shifting.",
        timeComplexity: "ℹ️ **Time Complexity**: This insertion sort has O(n²) time complexity."
      },
      stack: {
        operations: "✅ **Stack Operations**: Your code includes basic stack operations.",
        topAccess: "✅ **Top Access**: Good implementation of accessing the top element.",
        arrayMethods: "✅ **Array Methods**: Appropriate use of array methods for stack operations.",
        boundaryChecks: "✅ **Boundary Checks**: Good handling of empty stack conditions.",
        timeComplexity: "ℹ️ **Time Complexity**: Stack operations (push/pop) are O(1)."
      },
      general: {
        syntaxError: "❌ **Syntax Error**: {error}\n\nPlease fix the syntax errors before analyzing further.",
        debugCode: "⚠️ **Debug Code**: Consider removing console.log statements in production code.",
        codeLengthShort: "ℹ️ **Code Length**: Your implementation is concise, which is good!",
        codeLengthLong: "⚠️ **Code Length**: Consider simplifying your implementation for better readability.",
        variableDeclaration: "✅ **Variable Declaration**: Good use of variable declarations.",
        defaultAnalysis: "ℹ️ **Analysis**: Your code looks reasonable, but I couldn't identify specific patterns. Try running it to check correctness."
      }
    };

    // Merge custom configs with defaults
    const configs = { ...defaultConfigs, ...customConfigs };
    for (const algo in defaultConfigs) {
      if (customConfigs[algo]) {
        configs[algo] = { ...defaultConfigs[algo], ...customConfigs[algo] };
      }
    }

    // Basic code analysis for sorting algorithms and stack operations
    let feedback = [];

    // Check for basic syntax
    try {
      //eslint-disable-next-line no-new-func
      new Function('arr', code);
    } catch (e) {
      try {
        //eslint-disable-next-line no-new-func
        new Function('stack', 'value', code);
      } catch (e2) {
        return configs.general.syntaxError.replace('{error}', e.message);
      }
    }

    // Algorithm-specific analysis
    if (algorithm === 'bubble') {
      if (code.includes('for') && code.includes('if') && code.includes('>') && code.includes('j+1')) {
        feedback.push(configs.bubble.correctStructure);
      } else {
        feedback.push(configs.bubble.structureIssue);
      }

      if (code.includes('i < a.length - 1') || code.includes('i < arr.length - 1')) {
        feedback.push(configs.bubble.outerLoop);
      }

      if (code.includes('j < a.length - i - 1') || code.includes('j < arr.length - i - 1')) {
        feedback.push(configs.bubble.innerLoop);
      }

      if (code.includes('temp') || code.includes('[a[j], a[j+1]] = [a[j+1], a[j]]')) {
        feedback.push(configs.bubble.swapping);
      }

    } else if (algorithm === 'selection') {
      if (code.includes('min') && code.includes('for') && code.includes('<')) {
        feedback.push(configs.selection.selectionLogic);
      }

      if (code.includes('i < a.length') && code.includes('j = i + 1')) {
        feedback.push(configs.selection.loopStructure);
      }

    } else if (algorithm === 'insertion') {
      if (code.includes('key') && code.includes('while') && code.includes('j >= 0')) {
        feedback.push(configs.insertion.insertionLogic);
      }
    } else if (algorithm === 'stack') {
      if (code.includes('push') || code.includes('pop') || code.includes('length')) {
        feedback.push(configs.stack.operations);
      }

      if (code.includes('length - 1') || code.includes('top')) {
        feedback.push(configs.stack.topAccess);
      }

      if (code.includes('splice') || code.includes('pop()') || code.includes('push(')) {
        feedback.push(configs.stack.arrayMethods);
      }

      if (code.includes('if') && code.includes('length === 0')) {
        feedback.push(configs.stack.boundaryChecks);
      }
    }

    // General code quality checks
    if (code.includes('console.log')) {
      feedback.push(configs.general.debugCode);
    }

    if (code.length < 50) {
      feedback.push(configs.general.codeLengthShort);
    } else if (code.length > 300) {
      feedback.push(configs.general.codeLengthLong);
    }

    // Variable naming
    if (code.includes('let ') || code.includes('const ') || code.includes('var ')) {
      feedback.push(configs.general.variableDeclaration);
    }

    // Time complexity hint
    if (algorithm === 'bubble') {
      feedback.push(configs.bubble.timeComplexity);
    } else if (algorithm === 'selection') {
      feedback.push(configs.selection.timeComplexity);
    } else if (algorithm === 'insertion') {
      feedback.push(configs.insertion.timeComplexity);
    } else if (algorithm === 'stack') {
      feedback.push(configs.stack.timeComplexity);
    }

    if (feedback.length === 0) {
      feedback.push(configs.general.defaultAnalysis);
    }

    return feedback.join('\n\n');
  };

  const correctCode = (code, algorithm, problemId) => {
    // Load custom configurations
    let customConfigs = {};
    try {
      const saved = localStorage.getItem('vlab_ai_configs');
      if (saved) {
        customConfigs = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading AI configs:', e);
    }

    // Default correction templates
    const defaultCorrections = {
      bubble: {
        template: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
        explanation: "Here's the corrected Bubble Sort implementation with proper nested loops and element swapping."
      },
      selection: {
        template: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    // Swap the found minimum element with the first element
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  return arr;
}`,
        explanation: "Here's the corrected Selection Sort implementation with proper minimum element finding and swapping."
      },
      insertion: {
        template: `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
        explanation: "Here's the corrected Insertion Sort implementation with proper key shifting and insertion."
      },
      stack: {
        push: `function push(stack, value) {
  stack.push(value);
  return stack;
}`,
        pop: `function pop(stack) {
  if (stack.length === 0) {
    throw new Error("Stack is empty");
  }
  return stack.pop();
}`,
        peek: `function peek(stack) {
  if (stack.length === 0) {
    throw new Error("Stack is empty");
  }
  return stack[stack.length - 1];
}`,
        isEmpty: `function isEmpty(stack) {
  return stack.length === 0;
}`,
        explanation: "Here are the corrected stack operations with proper error handling and implementation."
      }
    };

    // Merge custom configs with defaults
    const corrections = { ...defaultCorrections, ...customConfigs };
    for (const algo in defaultCorrections) {
      if (customConfigs[algo]) {
        corrections[algo] = { ...defaultCorrections[algo], ...customConfigs[algo] };
      }
    }

    let correctedCode = "";
    let explanation = "";

    if (algorithm === 'bubble') {
      correctedCode = corrections.bubble.template;
      explanation = corrections.bubble.explanation;
    } else if (algorithm === 'selection') {
      correctedCode = corrections.selection.template;
      explanation = corrections.selection.explanation;
    } else if (algorithm === 'insertion') {
      correctedCode = corrections.insertion.template;
      explanation = corrections.insertion.explanation;
    } else if (algorithm === 'stack') {
      // For stack, provide all operations
      correctedCode = `${corrections.stack.push}\n\n${corrections.stack.pop}\n\n${corrections.stack.peek}\n\n${corrections.stack.isEmpty}`;
      explanation = corrections.stack.explanation;
    }

    return `${explanation}\n\n**Corrected Code:**\n\`\`\`javascript\n${correctedCode}\n\`\`\`\n\nYou can copy this corrected code and use it as a reference for your implementation.`;
  };

  
  const handleSendMessage = async () => {
    console.log(
      "handleSendMessage triggered"
    );

    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { type: "user", content: userMessage }]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    // Simulate AI thinking time
    setTimeout(async () => {

      const response =
        await generateAIResponse({
          userMessage,
          currentPage,
          currentAlgorithm,
          user,
        });

      setMessages(prev => [
        ...prev,
        {
          type: "ai",
          content: response,
        },
      ]);

      setIsTyping(false);

    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="ai-assistant-fab"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Learning Assistant"
      >
        <span className="ai-icon">🤖</span>
      </button>

      {/* Chat Window */}
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
          />
        </div>
      )}

      
    </>
  );
};

export default AIAssistant;