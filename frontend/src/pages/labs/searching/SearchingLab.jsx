import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu
} from "lucide-react";
import "../../Lab.css";
import "../../SortingLab.css";
import SearchingOverview from "./SearchingOverview";
import SearchingSimulation from "./SearchingSimulation";
import SearchingQuiz from "./SearchingQuiz";
import SearchingCoding from "./SearchingCoding";

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

const linearQuizQuestions = [
  {
    question: "What is the worst-case time complexity of Linear Search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct: 2
  },
  {
    question: "Does Linear Search require the array to be sorted?",
    options: ["Yes", "No", "Only for unique values", "Only for integers"],
    correct: 1
  },
  {
    question: "Linear Search checks elements:",
    options: ["Randomly", "One by one", "Using mid only", "From last to first only"],
    correct: 1
  },
  {
    question: "When is Linear Search especially useful?",
    options: [
      "When the array is huge and sorted",
      "When the data is unsorted or very small",
      "Only for stacks",
      "Only for linked lists"
    ],
    correct: 1
  },
  {
    question: "What does Linear Search compare at each step?",
    options: [
      "The target with every element one by one",
      "The target with only the first element",
      "The target with the average value",
      "The target with the last element only"
    ],
    correct: 0
  }
];

const binaryQuizQuestions = [
  {
    question: "What is the worst-case time complexity of Binary Search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct: 1
  },
  {
    question: "Binary Search works correctly only on:",
    options: ["Unsorted arrays", "Sorted arrays", "Linked lists only", "Stacks only"],
    correct: 1
  },
  {
    question: "Binary Search compares the target with:",
    options: ["The first element", "The last element", "The middle element", "A random element"],
    correct: 2
  },
  {
    question: "What happens to the search space in Binary Search after each step?",
    options: ["It doubles", "It remains unchanged", "It is reduced by half", "It becomes random"],
    correct: 2
  },
  {
    question: "Which statement is true for Binary Search?",
    options: [
      "It works on any array without sorting",
      "It is slower than Linear Search in all cases",
      "It repeatedly narrows the valid search range",
      "It always starts from the last element"
    ],
    correct: 2
  }
];

const linearProblemBank = [
  {
    id: 1,
    title: "Implement linearSearch(arr, target)",
    description:
      "Write a function linearSearch(arr, target) that returns the index of target if found, otherwise returns -1.",
    functionName: "linearSearch",
    tests: [
      { input: [[7, 14, 21, 28], 21], expected: 2 },
      { input: [[5, 10, 15], 9], expected: -1 },
      { input: [[1], 1], expected: 0 }
    ]
  },
  {
    id: 2,
    title: "Count comparisons in Linear Search",
    description:
      "Write a function countLinearComparisons(arr, target) that returns how many comparisons are made before the target is found or the array ends.",
    functionName: "countLinearComparisons",
    tests: [
      { input: [[7, 14, 21, 28], 21], expected: 3 },
      { input: [[5, 10, 15], 9], expected: 3 },
      { input: [[1], 1], expected: 1 }
    ]
  },
  {
    id: 3,
    title: "Find first occurrence using Linear Search",
    description:
      "Write a function firstOccurrence(arr, target) that returns the first index of target in the array, or -1 if not found.",
    functionName: "firstOccurrence",
    tests: [
      { input: [[4, 2, 4, 9], 4], expected: 0 },
      { input: [[1, 2, 3], 5], expected: -1 },
      { input: [[8, 8, 8], 8], expected: 0 }
    ]
  },
  {
    id: 4,
    title: "Check existence using Linear Search",
    description:
      "Write a function existsLinear(arr, target) that returns true if target exists in the array, otherwise false.",
    functionName: "existsLinear",
    tests: [
      { input: [[4, 8, 12], 8], expected: true },
      { input: [[1, 2, 3], 5], expected: false },
      { input: [[], 9], expected: false }
    ]
  },
  {
    id: 5,
    title: "Find last occurrence using Linear Search",
    description:
      "Write a function lastOccurrence(arr, target) that returns the last index of target in the array, or -1 if not found.",
    functionName: "lastOccurrence",
    tests: [
      { input: [[4, 2, 4, 9], 4], expected: 2 },
      { input: [[1, 2, 3], 5], expected: -1 },
      { input: [[8, 8, 8], 8], expected: 2 }
    ]
  }
];

const binaryProblemBank = [
  {
    id: 101,
    title: "Implement binarySearch(arr, target)",
    description:
      "Write a function binarySearch(arr, target) for a sorted array. It should return the index of target if found, otherwise return -1.",
    functionName: "binarySearch",
    tests: [
      { input: [[5, 10, 15, 20, 25], 20], expected: 3 },
      { input: [[2, 4, 6, 8], 5], expected: -1 },
      { input: [[1], 1], expected: 0 }
    ]
  },
  {
    id: 102,
    title: "Count iterations in Binary Search",
    description:
      "Write a function countBinarySteps(arr, target) that returns how many loop iterations Binary Search takes before finding the target or concluding it is absent.",
    functionName: "countBinarySteps",
    tests: [
      { input: [[5, 10, 15, 20, 25], 20], expected: 2 },
      { input: [[2, 4, 6, 8], 5], expected: 2 },
      { input: [[1], 1], expected: 1 }
    ]
  },
  {
    id: 103,
    title: "Check existence using Binary Search",
    description:
      "Write a function existsBinary(arr, target) that returns true if target exists in the sorted array, otherwise false.",
    functionName: "existsBinary",
    tests: [
      { input: [[5, 10, 15, 20, 25], 15], expected: true },
      { input: [[2, 4, 6, 8], 5], expected: false },
      { input: [[], 1], expected: false }
    ]
  },
  {
    id: 104,
    title: "Return insertion position",
    description:
      "Write a function insertionPosition(arr, target) that returns the index where target should be inserted in a sorted array to keep it sorted.",
    functionName: "insertionPosition",
    tests: [
      { input: [[5, 10, 15, 20], 12], expected: 2 },
      { input: [[5, 10, 15, 20], 25], expected: 4 },
      { input: [[5, 10, 15, 20], 1], expected: 0 }
    ]
  },
  {
    id: 105,
    title: "Find lower bound",
    description:
      "Write a function lowerBound(arr, target) that returns the first index at which target can appear in sorted order.",
    functionName: "lowerBound",
    tests: [
      { input: [[1, 2, 2, 2, 5], 2], expected: 1 },
      { input: [[1, 3, 5], 4], expected: 2 },
      { input: [[], 7], expected: 0 }
    ]
  }
];

const parseArrayInput = (input) =>
  input
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "")
    .map(Number)
    .filter((num) => !Number.isNaN(num));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getStarterCode(problem, language) {
  const fn = problem.functionName;

  if (language === "python") {
    const map = {
      linearSearch: `def linearSearch(arr, target):
    # Write your solution here
    return -1
`,
      countLinearComparisons: `def countLinearComparisons(arr, target):
    # Write your solution here
    return 0
`,
      firstOccurrence: `def firstOccurrence(arr, target):
    # Write your solution here
    return -1
`,
      existsLinear: `def existsLinear(arr, target):
    # Write your solution here
    return False
`,
      lastOccurrence: `def lastOccurrence(arr, target):
    # Write your solution here
    return -1
`,
      binarySearch: `def binarySearch(arr, target):
    # Write your solution here
    return -1
`,
      countBinarySteps: `def countBinarySteps(arr, target):
    # Write your solution here
    return 0
`,
      existsBinary: `def existsBinary(arr, target):
    # Write your solution here
    return False
`,
      insertionPosition: `def insertionPosition(arr, target):
    # Write your solution here
    return 0
`,
      lowerBound: `def lowerBound(arr, target):
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
    linearSearch: `function linearSearch(arr, target) {
  // Write your solution here
  return -1;
}
`,
    countLinearComparisons: `function countLinearComparisons(arr, target) {
  // Write your solution here
  return 0;
}
`,
    firstOccurrence: `function firstOccurrence(arr, target) {
  // Write your solution here
  return -1;
}
`,
    existsLinear: `function existsLinear(arr, target) {
  // Write your solution here
  return false;
}
`,
    lastOccurrence: `function lastOccurrence(arr, target) {
  // Write your solution here
  return -1;
}
`,
    binarySearch: `function binarySearch(arr, target) {
  // Write your solution here
  return -1;
}
`,
    countBinarySteps: `function countBinarySteps(arr, target) {
  // Write your solution here
  return 0;
}
`,
    existsBinary: `function existsBinary(arr, target) {
  // Write your solution here
  return false;
}
`,
    insertionPosition: `function insertionPosition(arr, target) {
  // Write your solution here
  return 0;
}
`,
    lowerBound: `function lowerBound(arr, target) {
  // Write your solution here
  return 0;
}
`
  };

  return map[fn] || `function solve() {\n  // Write your solution here\n}\n`;
}

export default function SearchingLab() {
  const [searchType, setSearchType] = useState("linear");
  const [arrayInput, setArrayInput] = useState("10, 20, 30, 40, 50");
  const [target, setTarget] = useState("");
  const [array, setArray] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Searching lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [stepHistory, setStepHistory] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [lowIndex, setLowIndex] = useState(null);
  const [highIndex, setHighIndex] = useState(null);
  const [midIndex, setMidIndex] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const stopRequestedRef = useRef(false);
  const targetRef = useRef(null);

  const quizQuestions = useMemo(
    () => (searchType === "binary" ? binaryQuizQuestions : linearQuizQuestions),
    [searchType]
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
    setArray([]);
    setTarget("");
    setMessage("Searching lab initialized.");
    setExperimentRun(false);
    setIsRunning(false);
    setStepHistory([]);
    setCurrentIndex(null);
    setFoundIndex(null);
    setLowIndex(null);
    setHighIndex(null);
    setMidIndex(null);
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCurrentProblems([]);
    setSelectedLanguages({});
    setCodes({});
    setResults({});
  }, [searchType, quizQuestions.length]);

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const loadSample = () => {
    if (isRunning) return;

    if (searchType === "linear") {
      setArrayInput("15, 8, 23, 4, 42, 16, 9");
      setTarget("42");
      setMessage("Loaded sample array for Linear Search.");
      setStepHistory(["Sample loaded for Linear Search."]);
    } else {
      setArrayInput("5, 10, 15, 20, 25, 30, 35");
      setTarget("25");
      setMessage("Loaded sample array for Binary Search.");
      setStepHistory(["Sample loaded for Binary Search."]);
    }

    setArray([]);
    setCurrentIndex(null);
    setFoundIndex(null);
    setLowIndex(null);
    setHighIndex(null);
    setMidIndex(null);
  };

  const stopSearch = () => {
    stopRequestedRef.current = true;
    setMessage("Stopping search...");
    addStep("Stop requested by user.");
  };

  const runSearch = async () => {
    if (isRunning) return;

    const parsed = parseArrayInput(arrayInput);

    if (parsed.length === 0) {
      setMessage("Please enter a valid array.");
      return;
    }

    if (target.trim() === "" || Number.isNaN(Number(target))) {
      setMessage("Please enter a valid target value.");
      return;
    }

    const targetValue = Number(target);

    stopRequestedRef.current = false;
    setCurrentIndex(null);
    setFoundIndex(null);
    setLowIndex(null);
    setHighIndex(null);
    setMidIndex(null);
    setStepHistory([]);
    setIsRunning(true);
    setExperimentRun(true);

    try {
      if (searchType === "linear") {
        setArray(parsed);
        setMessage(`Starting Linear Search for ${targetValue}...`);
        addStep(`Starting Linear Search for target ${targetValue}.`);
        await sleep(animationSpeed);

        let found = -1;

        for (let i = 0; i < parsed.length; i++) {
          if (stopRequestedRef.current) {
            setCurrentIndex(null);
            setMessage("Linear Search stopped.");
            addStep("Linear Search stopped before completion.");
            return;
          }

          setCurrentIndex(i);
          setMessage(`Checking index ${i} (value = ${parsed[i]})...`);
          addStep(`Step ${i + 1}: Checking index ${i}, value = ${parsed[i]}.`);
          await sleep(animationSpeed);

          if (parsed[i] === targetValue) {
            found = i;
            setFoundIndex(i);
            setMessage(`Linear Search: Found ${targetValue} at index ${i}.`);
            addStep(`Found target ${targetValue} at index ${i}.`);
            break;
          }
        }

        if (found === -1 && !stopRequestedRef.current) {
          setCurrentIndex(null);
          setMessage(`Linear Search: ${targetValue} not found in the array.`);
          addStep(`Target ${targetValue} was not found after checking all elements.`);
        }
      } else {
        const sorted = [...parsed].sort((a, b) => a - b);
        setArray(sorted);
        setMessage(`Starting Binary Search for ${targetValue}... Array sorted automatically.`);
        addStep(`Starting Binary Search for target ${targetValue}.`);
        addStep(`Input array sorted automatically: [${sorted.join(", ")}].`);
        await sleep(animationSpeed);

        let low = 0;
        let high = sorted.length - 1;
        let found = -1;
        let stepCount = 1;

        while (low <= high) {
          if (stopRequestedRef.current) {
            setLowIndex(null);
            setHighIndex(null);
            setMidIndex(null);
            setMessage("Binary Search stopped.");
            addStep("Binary Search stopped before completion.");
            return;
          }

          const mid = Math.floor((low + high) / 2);

          setLowIndex(low);
          setHighIndex(high);
          setMidIndex(mid);

          setMessage(
            `Checking mid index ${mid} (value = ${sorted[mid]}) with low = ${low}, high = ${high}.`
          );
          addStep(
            `Step ${stepCount}: low = ${low}, high = ${high}, mid = ${mid}, value = ${sorted[mid]}.`
          );
          await sleep(animationSpeed + 150);

          if (sorted[mid] === targetValue) {
            found = mid;
            setFoundIndex(mid);
            setMessage(`Binary Search: Found ${targetValue} at index ${mid}.`);
            addStep(`Found target ${targetValue} at index ${mid}.`);
            break;
          }

          if (sorted[mid] < targetValue) {
            setMessage(
              `${sorted[mid]} is less than ${targetValue}. Searching in the right half.`
            );
            addStep(
              `${sorted[mid]} < ${targetValue}, so move right: new low becomes ${mid + 1}.`
            );
            await sleep(animationSpeed);
            low = mid + 1;
          } else {
            setMessage(
              `${sorted[mid]} is greater than ${targetValue}. Searching in the left half.`
            );
            addStep(
              `${sorted[mid]} > ${targetValue}, so move left: new high becomes ${mid - 1}.`
            );
            await sleep(animationSpeed);
            high = mid - 1;
          }

          stepCount++;
        }

        if (found === -1 && !stopRequestedRef.current) {
          setLowIndex(null);
          setHighIndex(null);
          setMidIndex(null);
          setMessage(`Binary Search: ${targetValue} not found.`);
          addStep(`Target ${targetValue} was not found in the sorted array.`);
        }
      }

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: `${searchType}-search`, time: Date.now() })
      );
    } finally {
      setIsRunning(false);
      stopRequestedRef.current = false;
    }
  };

  const reset = () => {
    if (isRunning) return;

    stopRequestedRef.current = false;
    setArray([]);
    setArrayInput("");
    setTarget("");
    setCurrentIndex(null);
    setFoundIndex(null);
    setLowIndex(null);
    setHighIndex(null);
    setMidIndex(null);
    setStepHistory([]);
    setMessage("Searching lab reset.");
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
      experiment: searchType === "binary" ? "binary-search" : "linear-search",
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
    const bank = searchType === "binary" ? binaryProblemBank : linearProblemBank;
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

        // eslint-disable-next-line no-new-func
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
      topic: "searching",
      searchType,
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
      topic: "searching",
      searchType,
      language,
      action: "correct"
    };

    localStorage.setItem("vlab_code_correction", JSON.stringify(correctionData));
    alert("Code correction request sent to AI Assistant. Check the AI chat for the corrected code!");
  };

  const progressPercent =
  activeSection === "overview"
    ? 20
    : activeSection === "simulation"
    ? 52
    : activeSection === "quiz"
    ? 78
    : 95;

const searchModeLabel =
  searchType === "binary" ? "Binary Search" : "Linear Search";

const complexityLabel =
  searchType === "binary" ? "O(log n)" : "O(n)";

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
          <h1 className="er-page-title">{searchModeLabel}</h1>
          <p className="er-page-subtitle">
            Explore searching algorithms through animated visualization, quiz practice, and coding challenges.
          </p>
        </div>
      </div>

      <section className="er-config-card">
        <div className="er-config-top">
          <div>
            <h2>Search Configuration</h2>
            <p>Select search type, animation speed, and observe how the target is found.</p>
          </div>

          <div className="er-mode-pill">
            <div className="er-mode-pill-icon">
              <Cpu size={18} />
            </div>
            <div>
              <strong>{searchModeLabel}</strong>
              <span>
                Current complexity: {complexityLabel}. Array size: {array.length || "Not loaded"}.
              </span>
            </div>
          </div>
        </div>

        <div className="er-config-grid">
          <div>
            <label className="sorting-label">Search Type</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="sorting-select"
              disabled={isRunning}
            >
              <option value="linear">Linear Search</option>
              <option value="binary">Binary Search</option>
            </select>
          </div>

          <div>
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

        <div className="er-chip-row">
          <button className="er-chip active">Mode = {searchModeLabel}</button>
          <button className="er-chip active">Complexity = {complexityLabel}</button>
          <button className="er-chip active">
            Target = {target.trim() ? target : "Not Set"}
          </button>
          <button className="er-chip active">
            Steps = {stepHistory.length}
          </button>
          <button className={`er-chip ${experimentRun ? "active" : ""}`}>
            {experimentRun ? "Experiment Run" : "Not Started"}
          </button>
        </div>
      </section>

      <div className="er-content-layout">
        <section className="er-content-card">
          {activeSection === "overview" && (
            <SearchingOverview searchType={searchType} />
          )}

          {activeSection === "simulation" && (
            <SearchingSimulation
              searchType={searchType}
              arrayInput={arrayInput}
              setArrayInput={setArrayInput}
              target={target}
              setTarget={setTarget}
              runSearch={runSearch}
              stopSearch={stopSearch}
              reset={reset}
              loadSample={loadSample}
              message={message}
              array={array}
              currentIndex={currentIndex}
              foundIndex={foundIndex}
              lowIndex={lowIndex}
              highIndex={highIndex}
              midIndex={midIndex}
              targetRef={targetRef}
              isRunning={isRunning}
              stepHistory={stepHistory}
            />
          )}

          {activeSection === "quiz" && (
            <SearchingQuiz
              searchType={searchType}
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
            <SearchingCoding
              searchType={searchType}
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
        </section>
      </div>
    </main>
  </div>
);
}