import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlaskConical } from "lucide-react";
import "../../Lab.css";
import "../../SortingLab.css";
import RecursionOverview from "./RecursionOverview";
import RecursionSimulation from "./RecursionSimulation";
import RecursionQuiz from "./RecursionQuiz";
import RecursionCoding from "./RecursionCoding";

const factorialQuizQuestions = [
  {
    question: "What is the base case of factorial(n)?",
    options: ["n === 2", "n === 1 or n === 0", "n < 0", "n === 10"],
    correct: 1
  },
  {
    question: "What happens if recursion has no base case?",
    options: [
      "It becomes faster",
      "It stops automatically",
      "It may cause stack overflow",
      "It turns into iteration"
    ],
    correct: 2
  },
  {
    question: "What is factorial(4)?",
    options: ["24", "16", "10", "8"],
    correct: 0
  },
  {
    question: "Factorial recursion usually makes how many recursive calls per level?",
    options: ["Zero", "One", "Two", "Three"],
    correct: 1
  },
  {
    question: "What is factorial(0)?",
    options: ["0", "1", "Undefined", "10"],
    correct: 1
  }
];

const fibonacciQuizQuestions = [
  {
    question: "What are the base cases of fibonacci(n)?",
    options: [
      "fib(0)=0 and fib(1)=1",
      "fib(1)=1 and fib(2)=2",
      "fib(0)=1 and fib(1)=1",
      "fib(2)=2 only"
    ],
    correct: 0
  },
  {
    question: "Fibonacci recursion usually makes:",
    options: ["One recursive call", "Two recursive calls", "No recursive calls", "Three recursive calls"],
    correct: 1
  },
  {
    question: "What is fibonacci(5)?",
    options: ["3", "5", "8", "13"],
    correct: 1
  },
  {
    question: "Why is naive recursive Fibonacci expensive?",
    options: [
      "It uses loops",
      "It repeats many subproblems",
      "It sorts arrays first",
      "It uses binary search"
    ],
    correct: 1
  },
  {
    question: "What is fibonacci(0)?",
    options: ["0", "1", "2", "-1"],
    correct: 0
  }
];

const factorialProblemBank = [
  {
    id: 1,
    title: "Implement factorial(n)",
    description: "Write a recursive function factorial(n) that returns n! using recursion.",
    functionName: "factorial",
    tests: [
      { input: [5], expected: 120 },
      { input: [0], expected: 1 },
      { input: [3], expected: 6 }
    ]
  },
  {
    id: 2,
    title: "Implement factorialSum(n)",
    description:
      "Write a recursive function factorialSum(n) that returns 1! + 2! + ... + n! for n >= 1.",
    functionName: "factorialSum",
    tests: [
      { input: [3], expected: 9 },
      { input: [1], expected: 1 },
      { input: [4], expected: 33 }
    ]
  },
  {
    id: 3,
    title: "Count factorial call depth",
    description:
      "Write a recursive function factorialDepth(n) that returns how many recursive levels are used to compute factorial(n), including the base call.",
    functionName: "factorialDepth",
    tests: [
      { input: [1], expected: 1 },
      { input: [4], expected: 4 },
      { input: [6], expected: 6 }
    ]
  },
  {
    id: 4,
    title: "Check if factorial base case is reached",
    description:
      "Write a recursive function factorialBaseReached(n) that returns true once recursion reaches the factorial base case.",
    functionName: "factorialBaseReached",
    tests: [
      { input: [0], expected: true },
      { input: [1], expected: true },
      { input: [5], expected: true }
    ]
  },
  {
    id: 5,
    title: "Recursive multiplication using repeated addition",
    description:
      "Write a recursive function multiply(a, b) that returns a × b using recursion and repeated addition.",
    functionName: "multiply",
    tests: [
      { input: [3, 4], expected: 12 },
      { input: [5, 0], expected: 0 },
      { input: [2, 6], expected: 12 }
    ]
  }
];

const fibonacciProblemBank = [
  {
    id: 101,
    title: "Implement fibonacci(n)",
    description:
      "Write a recursive function fibonacci(n) that returns the nth Fibonacci number.",
    functionName: "fibonacci",
    tests: [
      { input: [5], expected: 5 },
      { input: [0], expected: 0 },
      { input: [6], expected: 8 }
    ]
  },
  {
    id: 102,
    title: "Implement fibonacciSum(n)",
    description:
      "Write a recursive function fibonacciSum(n) that returns fib(0) + fib(1) + ... + fib(n).",
    functionName: "fibonacciSum",
    tests: [
      { input: [3], expected: 4 },
      { input: [5], expected: 12 },
      { input: [0], expected: 0 }
    ]
  },
  {
    id: 103,
    title: "Check if number is Fibonacci",
    description:
      "Write a function isFibonacciValue(n) that returns true if n appears in the Fibonacci sequence up to fib(10), otherwise false.",
    functionName: "isFibonacciValue",
    tests: [
      { input: [8], expected: true },
      { input: [7], expected: false },
      { input: [0], expected: true }
    ]
  },
  {
    id: 104,
    title: "Count fibonacci recursive levels",
    description:
      "Write a recursive function fibonacciDepth(n) that returns the maximum depth of recursion needed to compute fibonacci(n).",
    functionName: "fibonacciDepth",
    tests: [
      { input: [0], expected: 1 },
      { input: [1], expected: 1 },
      { input: [4], expected: 4 }
    ]
  },
  {
    id: 105,
    title: "Return nth Tribonacci-like value",
    description:
      "Write a recursive function tribonacci(n) where tribonacci(0)=0, tribonacci(1)=1, tribonacci(2)=1 and tribonacci(n)=tribonacci(n-1)+tribonacci(n-2)+tribonacci(n-3).",
    functionName: "tribonacci",
    tests: [
      { input: [3], expected: 2 },
      { input: [4], expected: 4 },
      { input: [5], expected: 7 }
    ]
  }
];

const recursionCodeTemplates = {
  factorial: {
    javascript: `function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}`,
    python: `def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)`,
    cpp: `int factorial(int n) {
    if (n == 0 || n == 1) return 1;
    return n * factorial(n - 1);
}`,
    c: `int factorial(int n) {
    if (n == 0 || n == 1) return 1;
    return n * factorial(n - 1);
}`,
    java: `static int factorial(int n) {
    if (n == 0 || n == 1) return 1;
    return n * factorial(n - 1);
}`
  },
  fibonacci: {
    javascript: `function fibonacci(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    python: `def fibonacci(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)`,
    cpp: `int fibonacci(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    c: `int fibonacci(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    java: `static int fibonacci(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getStarterCode(problem, language) {
  const fn = problem.functionName;

  if (language === "python") {
    const map = {
      factorial: `def factorial(n):
    # Write your solution here
    return 1
`,
      factorialSum: `def factorialSum(n):
    # Write your solution here
    return 0
`,
      factorialDepth: `def factorialDepth(n):
    # Write your solution here
    return 0
`,
      factorialBaseReached: `def factorialBaseReached(n):
    # Write your solution here
    return True
`,
      multiply: `def multiply(a, b):
    # Write your solution here
    return 0
`,
      fibonacci: `def fibonacci(n):
    # Write your solution here
    return 0
`,
      fibonacciSum: `def fibonacciSum(n):
    # Write your solution here
    return 0
`,
      isFibonacciValue: `def isFibonacciValue(n):
    # Write your solution here
    return False
`,
      fibonacciDepth: `def fibonacciDepth(n):
    # Write your solution here
    return 0
`,
      tribonacci: `def tribonacci(n):
    # Write your solution here
    return 0
`
    };
    return map[fn] || `def solve():
    pass
`;
  }

  if (language === "cpp") {
    return `#include <bits/stdc++.h>
using namespace std;

// Write your solution here
`;
  }

  if (language === "c") {
    return `/* C execution template only. Browser execution is available for JavaScript for now. */`;
  }

  if (language === "java") {
    return `import java.util.*;

public class Main {
    // Write your solution here
}
`;
  }

  const map = {
    factorial: `function factorial(n) {
  // Write your solution here
  return 1;
}
`,
    factorialSum: `function factorialSum(n) {
  // Write your solution here
  return 0;
}
`,
    factorialDepth: `function factorialDepth(n) {
  // Write your solution here
  return 0;
}
`,
    factorialBaseReached: `function factorialBaseReached(n) {
  // Write your solution here
  return true;
}
`,
    multiply: `function multiply(a, b) {
  // Write your solution here
  return 0;
}
`,
    fibonacci: `function fibonacci(n) {
  // Write your solution here
  return 0;
}
`,
    fibonacciSum: `function fibonacciSum(n) {
  // Write your solution here
  return 0;
}
`,
    isFibonacciValue: `function isFibonacciValue(n) {
  // Write your solution here
  return false;
}
`,
    fibonacciDepth: `function fibonacciDepth(n) {
  // Write your solution here
  return 0;
}
`,
    tribonacci: `function tribonacci(n) {
  // Write your solution here
  return 0;
}
`
  };

  return map[fn] || `function solve() {\n  // Write your solution here\n}\n`;
}

export default function RecursionLab() {
  const [recursionType, setRecursionType] = useState("factorial");
  const [inputValue, setInputValue] = useState("4");
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Recursion visualizer initialized.");
  const [experimentRun, setExperimentRun] = useState(false);

  const [steps, setSteps] = useState([]);
  const [activeStepIndex, setActiveStepIndex] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [callFrames, setCallFrames] = useState([]);

  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);

  const stopRequestedRef = useRef(false);
  const inputRef = useRef(null);

  const quizQuestions = useMemo(
    () => (recursionType === "fibonacci" ? fibonacciQuizQuestions : factorialQuizQuestions),
    [recursionType]
  );

  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [currentProblems, setCurrentProblems] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState({});
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});

  useEffect(() => {
    stopRequestedRef.current = false;
    setInputValue(recursionType === "factorial" ? "4" : "5");
    setMessage("Recursion visualizer initialized.");
    setExperimentRun(false);
    setSteps([]);
    setActiveStepIndex(null);
    setFinalResult(null);
    setCallFrames([]);
    setIsRunning(false);
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCurrentProblems([]);
    setSelectedLanguages({});
    setCodes({});
    setResults({});
  }, [recursionType, quizQuestions.length]);

  const addStep = (text, level = 0) => {
    setSteps((prev) => [...prev, { text, level }]);
  };

  const addCallFrame = (label, level) => {
    const frameId = Date.now() + Math.random();
    setCallFrames((prev) => [
      ...prev,
      { id: frameId, label, level, status: "active", returnValue: null }
    ]);
    return frameId;
  };

  const completeCallFrame = (id, returnValue) => {
    setCallFrames((prev) =>
      prev.map((frame) =>
        frame.id === id
          ? { ...frame, status: "returned", returnValue }
          : frame
      )
    );
  };

  const validateInput = () => {
    const n = Number(inputValue);

    if (inputValue.trim() === "" || Number.isNaN(n) || !Number.isInteger(n) || n < 0) {
      setMessage("Please enter a valid non-negative integer.");
      return null;
    }

    if (recursionType === "factorial" && n > 10) {
      setMessage("For visualization, please use factorial input up to 10.");
      return null;
    }

    if (recursionType === "fibonacci" && n > 8) {
      setMessage("For visualization, please use fibonacci input up to 8.");
      return null;
    }

    return n;
  };

  const loadSample = () => {
    if (isRunning) return;

    if (recursionType === "factorial") {
      setInputValue("4");
      setMessage("Loaded sample input for Factorial.");
      setSteps([{ text: "Sample loaded for Factorial visualization.", level: 0 }]);
    } else {
      setInputValue("5");
      setMessage("Loaded sample input for Fibonacci.");
      setSteps([{ text: "Sample loaded for Fibonacci visualization.", level: 0 }]);
    }

    setActiveStepIndex(null);
    setFinalResult(null);
    setCallFrames([]);
  };

  const stopVisualization = () => {
    stopRequestedRef.current = true;
    setMessage("Stopping visualization...");
    addStep("Stop requested by user.", 0);
  };

  const runVisualization = async () => {
    if (isRunning) return;

    const n = validateInput();
    if (n === null) return;

    stopRequestedRef.current = false;
    setSteps([]);
    setActiveStepIndex(null);
    setFinalResult(null);
    setCallFrames([]);
    setIsRunning(true);
    setExperimentRun(true);

    try {
      if (recursionType === "factorial") {
        setMessage(`Starting factorial(${n}) visualization...`);
        addStep(`Starting factorial(${n}) visualization.`, 0);
        await sleep(animationSpeed);

        let stepCounter = 0;

        const factorialTrace = async (value, level = 0) => {
          if (stopRequestedRef.current) return null;

          const frameId = addCallFrame(`factorial(${value})`, level);

          const callStepIndex = stepCounter;
          addStep(`Call factorial(${value})`, level);
          setActiveStepIndex(callStepIndex);
          stepCounter++;
          await sleep(animationSpeed);

          if (value === 0 || value === 1) {
            if (stopRequestedRef.current) return null;

            const baseStepIndex = stepCounter;
            addStep(`Base case reached: factorial(${value}) = 1`, level);
            setActiveStepIndex(baseStepIndex);
            stepCounter++;
            await sleep(animationSpeed);

            completeCallFrame(frameId, 1);
            return 1;
          }

          const child = await factorialTrace(value - 1, level + 1);
          if (child === null || stopRequestedRef.current) return null;

          const result = value * child;

          const returnStepIndex = stepCounter;
          addStep(`Return factorial(${value}) = ${value} × ${child} = ${result}`, level);
          setActiveStepIndex(returnStepIndex);
          stepCounter++;
          await sleep(animationSpeed);

          completeCallFrame(frameId, result);
          return result;
        };

        const result = await factorialTrace(n, 0);

        if (stopRequestedRef.current) {
          setMessage("Factorial visualization stopped.");
          return;
        }

        setFinalResult(result);
        setMessage(`Final Result: factorial(${n}) = ${result}`);
      } else {
        setMessage(`Starting fibonacci(${n}) visualization...`);
        addStep(`Starting fibonacci(${n}) visualization.`, 0);
        await sleep(animationSpeed);

        let stepCounter = 0;

        const fibonacciTrace = async (value, level = 0) => {
          if (stopRequestedRef.current) return null;

          const frameId = addCallFrame(`fibonacci(${value})`, level);

          const callStepIndex = stepCounter;
          addStep(`Call fibonacci(${value})`, level);
          setActiveStepIndex(callStepIndex);
          stepCounter++;
          await sleep(animationSpeed);

          if (value === 0) {
            if (stopRequestedRef.current) return null;

            const baseStepIndex = stepCounter;
            addStep(`Base case reached: fibonacci(0) = 0`, level);
            setActiveStepIndex(baseStepIndex);
            stepCounter++;
            await sleep(animationSpeed);

            completeCallFrame(frameId, 0);
            return 0;
          }

          if (value === 1) {
            if (stopRequestedRef.current) return null;

            const baseStepIndex = stepCounter;
            addStep(`Base case reached: fibonacci(1) = 1`, level);
            setActiveStepIndex(baseStepIndex);
            stepCounter++;
            await sleep(animationSpeed);

            completeCallFrame(frameId, 1);
            return 1;
          }

          const left = await fibonacciTrace(value - 1, level + 1);
          if (left === null || stopRequestedRef.current) return null;

          const right = await fibonacciTrace(value - 2, level + 1);
          if (right === null || stopRequestedRef.current) return null;

          const result = left + right;

          const returnStepIndex = stepCounter;
          addStep(
            `Return fibonacci(${value}) = fibonacci(${value - 1}) + fibonacci(${value - 2}) = ${left} + ${right} = ${result}`,
            level
          );
          setActiveStepIndex(returnStepIndex);
          stepCounter++;
          await sleep(animationSpeed);

          completeCallFrame(frameId, result);
          return result;
        };

        const result = await fibonacciTrace(n, 0);

        if (stopRequestedRef.current) {
          setMessage("Fibonacci visualization stopped.");
          return;
        }

        setFinalResult(result);
        setMessage(`Final Result: fibonacci(${n}) = ${result}`);
      }

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: `${recursionType}-recursion`, time: Date.now() })
      );
    } finally {
      setIsRunning(false);
      stopRequestedRef.current = false;
    }
  };

  const reset = () => {
    if (isRunning) return;

    stopRequestedRef.current = false;
    setInputValue("");
    setSteps([]);
    setActiveStepIndex(null);
    setFinalResult(null);
    setCallFrames([]);
    setMessage("Recursion visualizer reset.");
    setExperimentRun(false);
  };

  const handleQuizAnswer = (i, v) => {
    const updated = [...quizAnswers];
    updated[i] = v;
    setQuizAnswers(updated);
  };

  const submitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    const scores = JSON.parse(localStorage.getItem("vlab_scores") || "[]");
    scores.push({
      subject: "DSA",
      experiment: recursionType === "fibonacci" ? "fibonacci-recursion" : "factorial-recursion",
      correct: score,
      total: quizQuestions.length,
      time: Date.now()
    });
    localStorage.setItem("vlab_scores", JSON.stringify(scores));
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const generateProblems = () => {
    const bank = recursionType === "fibonacci" ? fibonacciProblemBank : factorialProblemBank;
    const shuffled = [...bank].sort(() => 0.5 - Math.random());
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

  const runCode = (problemId, language) => {
    const problem = currentProblems.find((p) => p.id === problemId);
    const codeKey = `${problemId}_${language}`;
    const code = codes[codeKey];

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
        [problemId]:
          `Execution for ${language.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      }));
      return;
    }

    try {
      let allCorrect = true;
      const outputs = [];

      for (const test of problem.tests) {
        const args = test.input.map((item) => (Array.isArray(item) ? [...item] : item));

        const fn = new Function(
          ...Array.from({ length: args.length }, (_, i) => `arg${i}`),
          `${code}; return ${problem.functionName}(${args.map((_, i) => `arg${i}`).join(", ")});`
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
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [problemId]: `Error: ${error.message}`
      }));
    }
  };

  const analyzeCode = (problemId, language) => {
    const codeKey = `${problemId}_${language}`;
    const code = codes[codeKey];

    if (!code) {
      alert("Please enter code to analyze.");
      return;
    }

    const analysisData = {
      code,
      problemId,
      topic: "recursion",
      recursionType,
      language
    };

    localStorage.setItem("vlab_code_analysis", JSON.stringify(analysisData));
    alert("Code analysis request sent to AI Assistant. Check the AI chat for feedback!");
  };

  const correctCode = (problemId, language) => {
    const codeKey = `${problemId}_${language}`;
    const code = codes[codeKey];

    if (!code) {
      alert("Please enter code to correct.");
      return;
    }

    const correctionData = {
      code,
      problemId,
      topic: "recursion",
      recursionType,
      language,
      action: "correct"
    };

    localStorage.setItem("vlab_code_correction", JSON.stringify(correctionData));
    alert("Code correction request sent to AI Assistant. Check the AI chat for the corrected code!");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-[-220px] left-[-120px] w-[620px] h-[620px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-220px] right-[-120px] w-[520px] h-[520px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 pt-24 pb-16 relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glow-border mb-5">
            <FlaskConical className="w-4 h-4 text-primary" />
            <span className="text-sm font-display text-primary tracking-wide">
              Interactive Recursion Experiment
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            {recursionType === "fibonacci" ? "Fibonacci Recursion" : "Factorial Recursion"}
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
            Visualize recursive calls, base cases, call stack growth, and return flow step by step.
          </p>
        </div>

        <section className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Recursion Configuration</h2>

          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", alignItems: "end" }}>
            <div style={{ minWidth: "240px" }}>
              <label className="sorting-label">Recursion Type</label>
              <select
                value={recursionType}
                onChange={(e) => setRecursionType(e.target.value)}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value="factorial">Factorial</option>
                <option value="fibonacci">Fibonacci</option>
              </select>
            </div>

            <div style={{ minWidth: "220px" }}>
              <label className="sorting-label">Animation Speed</label>
              <select
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value={1100}>Slow</option>
                <option value={700}>Normal</option>
                <option value={350}>Fast</option>
              </select>
            </div>
          </div>
        </section>

        <div className="sorting-lab-layout">
          <aside className="sorting-sidebar glass">
            <button
              className={`sorting-sidebar-item ${activeSection === "overview" ? "active" : ""}`}
              onClick={() => setActiveSection("overview")}
            >
              Overview
            </button>

            <button
              className={`sorting-sidebar-item ${activeSection === "simulation" ? "active" : ""}`}
              onClick={() => setActiveSection("simulation")}
            >
              Simulation
            </button>

            <button
              className={`sorting-sidebar-item ${activeSection === "quiz" ? "active" : ""}`}
              onClick={() => setActiveSection("quiz")}
            >
              Quiz
            </button>

            <button
              className={`sorting-sidebar-item ${activeSection === "coding" ? "active" : ""}`}
              onClick={() => setActiveSection("coding")}
            >
              Coding
            </button>
          </aside>

          <main className="sorting-content">
            <div className="glass rounded-3xl p-5 sm:p-6">
              {activeSection === "overview" && <RecursionOverview recursionType={recursionType} />}

              {activeSection === "simulation" && (
                <RecursionSimulation
                  recursionType={recursionType}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  runVisualization={runVisualization}
                  stopVisualization={stopVisualization}
                  reset={reset}
                  loadSample={loadSample}
                  message={message}
                  steps={steps}
                  activeStepIndex={activeStepIndex}
                  finalResult={finalResult}
                  inputRef={inputRef}
                  isRunning={isRunning}
                  callFrames={callFrames}
                />
              )}

              {activeSection === "quiz" && (
                <RecursionQuiz
                  recursionType={recursionType}
                  quizQuestions={quizQuestions}
                  quizAnswers={quizAnswers}
                  quizSubmitted={quizSubmitted}
                  quizScore={quizScore}
                  experimentRun={experimentRun}
                  handleQuizAnswer={handleQuizAnswer}
                  submitQuiz={submitQuiz}
                  redoQuiz={redoQuiz}
                />
              )}

              {activeSection === "coding" && (
                <RecursionCoding
                  recursionType={recursionType}
                  currentProblems={currentProblems}
                  selectedLanguages={selectedLanguages}
                  codes={codes}
                  results={results}
                  generateProblems={generateProblems}
                  handleLanguageChange={handleLanguageChange}
                  handleCodeChange={handleCodeChange}
                  runCode={runCode}
                  analyzeCode={analyzeCode}
                  correctCode={correctCode}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}