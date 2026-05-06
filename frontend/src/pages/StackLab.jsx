/* eslint-disable no-new-func */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu
} from "lucide-react";
import "./SortingLab.css";
import "./Lab.css";

import MarkCompleteButton from "../components/MarkCompleteButton";
import { saveQuizResult, saveCodingSubmission } from "../API/progressApi";

import StackOverview from "./labs/stack/StackOverview.jsx";
import StackSimulation from "./labs/stack/StackSimulation.jsx";
import StackQuiz from "./labs/stack/StackQuiz.jsx";
import StackCoding from "./labs/stack/StackCoding.jsx";

const stackQuizQuestions = [
  {
    question: "Which principle does a stack follow?",
    options: ["FIFO", "LIFO", "Round Robin", "Priority"],
    correct: 1
  },
  {
    question: "Which stack operation removes the top element?",
    options: ["Push", "Peek", "Pop", "Insert"],
    correct: 2
  },
  {
    question: "What is the time complexity of push in a stack?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correct: 0
  },
  {
    question: "Which operation is used to view the top element without removing it?",
    options: ["Pop", "Peek", "Push", "Traverse"],
    correct: 1
  },
  {
    question: "What happens when you try to push into a full stack?",
    options: ["Underflow", "Overflow", "Peek", "Shift"],
    correct: 1
  },
  {
    question: "Which of the following is a common application of a stack?",
    options: ["Printer queue", "CPU scheduling", "Undo operation", "Round robin processing"],
    correct: 2
  }
];

const problemBank = [
  {
    id: 1,
    title: "Implement push(stack, value)",
    description:
      "Write a function push(stack, value) that inserts value at the top of the stack and returns the updated stack.",
    functionName: "push",
    tests: [
      { input: [[10, 20], 30], expected: [10, 20, 30] },
      { input: [[], 5], expected: [5] },
      { input: [[1, 2, 3], 9], expected: [1, 2, 3, 9] }
    ]
  },
  {
    id: 2,
    title: "Implement popElement(stack)",
    description:
      "Write a function popElement(stack) that removes the top element from the stack and returns the updated stack. If the stack is empty, return the empty stack.",
    functionName: "popElement",
    tests: [
      { input: [[10, 20, 30]], expected: [10, 20] },
      { input: [[5]], expected: [] },
      { input: [[]], expected: [] }
    ]
  },
  {
    id: 3,
    title: "Implement peek(stack)",
    description:
      "Write a function peek(stack) that returns the top element of the stack. If the stack is empty, return null.",
    functionName: "peek",
    tests: [
      { input: [[10, 20, 30]], expected: 30 },
      { input: [[5]], expected: 5 },
      { input: [[]], expected: null }
    ]
  },
  {
    id: 4,
    title: "Implement isEmpty(stack)",
    description:
      "Write a function isEmpty(stack) that returns true if the stack has no elements, otherwise false.",
    functionName: "isEmpty",
    tests: [
      { input: [[]], expected: true },
      { input: [[1]], expected: false },
      { input: [[10, 20]], expected: false }
    ]
  },
  {
    id: 5,
    title: "Implement size(stack)",
    description:
      "Write a function size(stack) that returns the number of elements currently present in the stack.",
    functionName: "size",
    tests: [
      { input: [[]], expected: 0 },
      { input: [[1]], expected: 1 },
      { input: [[10, 20, 30]], expected: 3 }
    ]
  },
  {
    id: 6,
    title: "Implement pushTwice(stack, a, b)",
    description:
      "Write a function pushTwice(stack, a, b) that pushes a and then b onto the stack and returns the updated stack.",
    functionName: "pushTwice",
    tests: [
      { input: [[1], 2, 3], expected: [1, 2, 3] },
      { input: [[], 5, 6], expected: [5, 6] },
      { input: [[10], 20, 30], expected: [10, 20, 30] }
    ]
  }
];

function getStarterCode(problem, language) {
  const fn = problem.functionName;

  if (language !== "javascript") {
    return `// ${language.toUpperCase()} execution will be enabled later with Judge0.
// For now, JavaScript runs directly in the browser.`;
  }

  if (fn === "push") {
    return `function push(stack, value) {
  stack.push(value);
  return stack;
}
`;
  }

  if (fn === "popElement") {
    return `function popElement(stack) {
  if (stack.length === 0) return stack;
  stack.pop();
  return stack;
}
`;
  }

  if (fn === "peek") {
    return `function peek(stack) {
  if (stack.length === 0) return null;
  return stack[stack.length - 1];
}
`;
  }

  if (fn === "isEmpty") {
    return `function isEmpty(stack) {
  return stack.length === 0;
}
`;
  }

  if (fn === "size") {
    return `function size(stack) {
  return stack.length;
}
`;
  }

  if (fn === "pushTwice") {
    return `function pushTwice(stack, a, b) {
  stack.push(a);
  stack.push(b);
  return stack;
}
`;
  }

  return `function solve() {
  // Write your solution here
}
`;
}

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

export default function StackLab() {
  const [stack, setStack] = useState([]);
  const [input, setInput] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [message, setMessage] = useState("Stack initialized. Ready to begin.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [maxSize, setMaxSize] = useState(5);
  const [lastOperation, setLastOperation] = useState("Not started");
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const quizQuestions = useMemo(() => stackQuizQuestions, []);
  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const [currentProblems, setCurrentProblems] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState({});
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});
  const [codingSaveStatus, setCodingSaveStatus] = useState({});
  const [codingAttempted, setCodingAttempted] = useState(false);

  const inputRef = useRef(null);

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 52
      : activeSection === "quiz"
      ? 78
      : 95;

  useEffect(() => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizSaveStatus("");
  }, [quizQuestions.length]);

  const persistRun = () => {
    setExperimentRun(true);
  };

  const pushElement = () => {
    const value = input.trim();

    if (!value) {
      setMessage("Please enter a value before pushing.");
      setHighlightedIndex(null);
      return;
    }

    if (stack.length >= maxSize) {
      setMessage(`Stack Overflow! Maximum size is ${maxSize}.`);
      setLastOperation("Overflow");
      setHighlightedIndex(stack.length - 1);
      persistRun();
      return;
    }

    const newStack = [...stack, value];
    setStack(newStack);
    setMessage(`Pushed ${value} onto the stack.`);
    setLastOperation(`Push(${value})`);
    setHighlightedIndex(newStack.length - 1);
    setInput("");
    persistRun();
    inputRef.current?.focus();
  };

  const popElement = () => {
    if (stack.length === 0) {
      setMessage("Stack Underflow! The stack is empty.");
      setLastOperation("Underflow");
      setHighlightedIndex(null);
      persistRun();
      return;
    }

    const removed = stack[stack.length - 1];
    const newStack = stack.slice(0, -1);

    setStack(newStack);
    setMessage(`Popped ${removed} from the stack.`);
    setLastOperation(`Pop() → ${removed}`);
    setHighlightedIndex(newStack.length - 1 >= 0 ? newStack.length - 1 : null);
    persistRun();
  };

  const peekElement = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty. No top element is available.");
      setLastOperation("Peek on empty stack");
      setHighlightedIndex(null);
      persistRun();
      return;
    }

    const top = stack[stack.length - 1];
    setMessage(`Top element is ${top}.`);
    setLastOperation(`Peek() → ${top}`);
    setHighlightedIndex(stack.length - 1);
    persistRun();
  };

  const checkIsEmpty = () => {
    const empty = stack.length === 0;
    setMessage(empty ? "Stack is empty." : "Stack is not empty.");
    setLastOperation("isEmpty()");
    setHighlightedIndex(stack.length > 0 ? stack.length - 1 : null);
    persistRun();
  };

  const showSize = () => {
    setMessage(`Current stack size is ${stack.length}.`);
    setLastOperation("size()");
    setHighlightedIndex(stack.length > 0 ? stack.length - 1 : null);
    persistRun();
  };

  const reset = () => {
    setStack([]);
    setInput("");
    setMessage("Stack reset. All elements cleared.");
    setExperimentRun(false);
    setLastOperation("Reset");
    setHighlightedIndex(null);
  };

  const handleQuizAnswer = (index, answer) => {
    const updated = [...quizAnswers];
    updated[index] = answer;
    setQuizAnswers(updated);
  };

  const submitQuiz = async () => {
    let score = 0;

    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });

    setQuizScore(score);
    setQuizSubmitted(true);
    setQuizSaveStatus("Saving quiz result...");

    try {
      await saveQuizResult({
        labSlug: "dsa",
        experimentSlug: "stack",
        correctAnswers: score,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("Stack quiz save failed:", error);
      setQuizSaveStatus("Quiz submitted, but backend save failed.");
    }
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizSaveStatus("");
  };

  const generateProblems = () => {
    const shuffled = [...problemBank].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    const initialLanguages = {};
    const initialCodes = {};

    selected.forEach((problem) => {
      initialLanguages[problem.id] = "javascript";
      initialCodes[`${problem.id}_javascript`] = getStarterCode(problem, "javascript");
    });

    setCurrentProblems(selected);
    setSelectedLanguages(initialLanguages);
    setCodes(initialCodes);
    setResults({});
    setCodingSaveStatus({});
  };

  const handleLanguageChange = (problemId, language, problem) => {
    const key = `${problemId}_${language}`;

    setSelectedLanguages((prev) => ({
      ...prev,
      [problemId]: language
    }));

    setCodes((prev) => {
      if (prev[key]) return prev;
      return {
        ...prev,
        [key]: getStarterCode(problem, language)
      };
    });
  };

  const handleCodeChange = (problemId, language, value) => {
    const key = `${problemId}_${language}`;
    setCodes((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const saveStackCoding = async ({ problem, language, code, result }) => {
    await saveCodingSubmission({
      labSlug: "dsa",
      experimentSlug: "stack",
      problemTitle: problem?.title || "Stack Problem",
      language,
      code,
      result
    });
  };

  const runCode = async (problemId, language) => {
    const problem = currentProblems.find((p) => p.id === problemId);
    const codeKey = `${problemId}_${language}`;
    const code = codes[codeKey];

    setCodingAttempted(true);

    if (!problem || !code) {
      setResults((prev) => ({
        ...prev,
        [problemId]: "Please enter code."
      }));
      return;
    }

    if (language !== "javascript") {
      setResults((prev) => ({
        ...prev,
        [problemId]: `Execution for ${language.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      }));

      try {
        setCodingSaveStatus((prev) => ({
          ...prev,
          [problemId]: "Saving coding attempt..."
        }));

        await saveStackCoding({
          problem,
          language,
          code,
          result: "attempted"
        });

        setCodingSaveStatus((prev) => ({
          ...prev,
          [problemId]: "Coding attempt saved to dashboard."
        }));
      } catch (error) {
        console.error("Stack coding save failed:", error);
        setCodingSaveStatus((prev) => ({
          ...prev,
          [problemId]: "Coding attempted, but backend save failed."
        }));
      }

      return;
    }

    try {
      let allCorrect = true;
      const outputs = [];

      for (const test of problem.tests) {
        const args = test.input.map((item) => (Array.isArray(item) ? [...item] : item));

        const fn = new Function(
          ...Array.from({ length: args.length }, (_, i) => `arg${i}`),
          `${code}; return ${problem.functionName}(${args
            .map((_, i) => `arg${i}`)
            .join(", ")});`
        );

        const result = fn(...args);
        outputs.push(result);

        if (JSON.stringify(result) !== JSON.stringify(test.expected)) {
          allCorrect = false;
          break;
        }
      }

      setResults((prev) => ({
        ...prev,
        [problemId]: allCorrect
          ? `Correct! Your outputs: ${outputs.map((o) => JSON.stringify(o)).join(", ")}`
          : "Incorrect Output"
      }));

      setCodingSaveStatus((prev) => ({
        ...prev,
        [problemId]: "Saving coding submission..."
      }));

      await saveStackCoding({
        problem,
        language,
        code,
        result: allCorrect ? "passed" : "failed"
      });

      setCodingSaveStatus((prev) => ({
        ...prev,
        [problemId]: allCorrect
          ? "Coding submission saved to dashboard."
          : "Failed coding submission saved to dashboard."
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [problemId]: `Error: ${error.message}`
      }));

      try {
        setCodingSaveStatus((prev) => ({
          ...prev,
          [problemId]: "Saving failed coding submission..."
        }));

        await saveStackCoding({
          problem,
          language,
          code,
          result: "failed"
        });

        setCodingSaveStatus((prev) => ({
          ...prev,
          [problemId]: "Failed coding submission saved to dashboard."
        }));
      } catch (saveError) {
        console.error("Stack coding save failed:", saveError);
        setCodingSaveStatus((prev) => ({
          ...prev,
          [problemId]: "Coding failed, and backend save also failed."
        }));
      }
    }
  };

  const analyzeCode = (problemId, language) => {
    const codeKey = `${problemId}_${language}`;
    const code = codes[codeKey];

    if (!code) {
      alert("Please enter code to analyze.");
      return;
    }

    localStorage.setItem(
      "vlab_code_analysis",
      JSON.stringify({
        code,
        problemId,
        topic: "stack",
        language
      })
    );

    alert("Code analysis request sent to AI Assistant. Check the AI chat for feedback!");
  };

  const correctCode = (problemId, language) => {
    const codeKey = `${problemId}_${language}`;
    const code = codes[codeKey];

    if (!code) {
      alert("Please enter code to correct.");
      return;
    }

    localStorage.setItem(
      "vlab_code_correction",
      JSON.stringify({
        code,
        problemId,
        topic: "stack",
        language,
        action: "correct"
      })
    );

    alert("Code correction request sent to AI Assistant. Check the AI chat for the corrected code!");
  };

  return (
    <div className="er-shell">
      <aside className={`er-left-rail ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="er-brand">
          <div className="er-brand-logo">
            <img
              src={simulabLogo}
              alt="SimuLab"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {!sidebarCollapsed && (
            <div>
              <div className="er-brand-title">SimuLab</div>
              <div className="er-brand-subtitle">DSA Lab</div>
            </div>
          )}
        </div>

        <div className="er-collapse-wrap">
          <button
            type="button"
            className={`er-collapse-btn ${sidebarCollapsed ? "collapsed" : ""}`}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
          >
            <ChevronsLeft size={18} />
          </button>
        </div>

        <div className="er-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                className={`er-nav-item ${activeSection === item.key ? "active" : ""}`}
                onClick={() => setActiveSection(item.key)}
                title={item.label}
              >
                <Icon size={18} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {!sidebarCollapsed && (
          <div className="er-progress-card">
            <div className="er-progress-title">Your Progress</div>
            <div className="er-progress-ring">
              <div
                className="er-progress-circle"
                style={{
                  background: `conic-gradient(#4da8ff ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}% 100%)`
                }}
              >
                <div className="er-progress-inner">
                  <div className="er-progress-value">{progressPercent}%</div>
                  <div className="er-progress-text">Complete</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">Stack</h1>
            <p className="er-page-subtitle">
              Learn stack operations visually through push, pop, peek, size checks, quiz practice, and coding exercises.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Stack Configuration</h2>
              <p>Set stack capacity and observe LIFO behavior during operations.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>LIFO Stack</strong>
                <span>
                  Current size: {stack.length}/{maxSize}. Top index:{" "}
                  {stack.length ? stack.length - 1 : "NULL"}.
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Maximum Stack Size</label>
              <input
                type="number"
                min="1"
                value={maxSize}
                onChange={(e) => setMaxSize(Math.max(1, Number(e.target.value) || 1))}
                className="sorting-input"
              />
            </div>

            <div>
              <label className="sorting-label">Current Status</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                {stack.length === 0
                  ? "Empty Stack"
                  : stack.length >= maxSize
                  ? "Stack Full"
                  : `${stack.length} item(s) active`}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">Principle = LIFO</button>
            <button className="er-chip active">Size = {stack.length}/{maxSize}</button>
            <button className="er-chip active">
              Top = {stack.length ? stack[stack.length - 1] : "NULL"}
            </button>
            <button className="er-chip active">Push/Pop = O(1)</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Experiment Run" : "Not Started"}
            </button>
          </div>

          {experimentRun && quizSubmitted && codingAttempted && (
            <div style={{ marginTop: 18 }}>
              <MarkCompleteButton
                labSlug="dsa"
                experimentSlug="stack"
                points={10}
              />
            </div>
          )}
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <StackOverview />}

            {activeSection === "simulation" && (
              <StackSimulation
                stack={stack}
                input={input}
                setInput={setInput}
                pushElement={pushElement}
                popElement={popElement}
                peekElement={peekElement}
                checkIsEmpty={checkIsEmpty}
                showSize={showSize}
                reset={reset}
                message={message}
                inputRef={inputRef}
                maxSize={maxSize}
                highlightedIndex={highlightedIndex}
                lastOperation={lastOperation}
              />
            )}

            {activeSection === "quiz" && (
              <StackQuiz
                quizQuestions={quizQuestions}
                quizAnswers={quizAnswers}
                quizSubmitted={quizSubmitted}
                quizScore={quizScore}
                quizSaveStatus={quizSaveStatus}
                experimentRun={experimentRun}
                handleQuizAnswer={handleQuizAnswer}
                submitQuiz={submitQuiz}
                redoQuiz={redoQuiz}
              />
            )}

            {activeSection === "coding" && (
              <StackCoding
                currentProblems={currentProblems}
                selectedLanguages={selectedLanguages}
                codes={codes}
                results={results}
                codingSaveStatus={codingSaveStatus}
                generateProblems={generateProblems}
                handleLanguageChange={handleLanguageChange}
                handleCodeChange={handleCodeChange}
                runCode={runCode}
                analyzeCode={analyzeCode}
                correctCode={correctCode}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}