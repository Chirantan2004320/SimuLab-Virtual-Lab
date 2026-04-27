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
import HeapOverview from "./HeapOverview";
import HeapSimulation from "./HeapSimulation";
import HeapQuiz from "./HeapQuiz";
import HeapCoding from "./HeapCoding";

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

const maxHeapQuizQuestions = [
  {
    question: "In a Max Heap, the root contains:",
    options: ["Smallest value", "Largest value", "Middle value", "Random value"],
    correct: 1
  },
  {
    question: "Which property is true for a Max Heap?",
    options: [
      "Parent is always smaller than children",
      "Parent is always greater than or equal to children",
      "Heap must be a BST",
      "Children are always sorted"
    ],
    correct: 1
  },
  {
    question: "Extract Max removes:",
    options: ["Leaf node", "Root node", "Left child", "Right child"],
    correct: 1
  },
  {
    question: "What happens after inserting into a heap?",
    options: [
      "Heapify down",
      "Heapify up",
      "Binary search",
      "Traversal only"
    ],
    correct: 1
  },
  {
    question: "What kind of tree structure is used by a heap?",
    options: ["Complete binary tree", "Skew tree", "AVL tree", "General tree"],
    correct: 0
  }
];

const minHeapQuizQuestions = [
  {
    question: "In a Min Heap, the root contains:",
    options: ["Largest value", "Smallest value", "Middle value", "Random value"],
    correct: 1
  },
  {
    question: "Which property is true for a Min Heap?",
    options: [
      "Parent is always smaller than or equal to children",
      "Parent is always greater than children",
      "Heap must be balanced by value",
      "Children are always sorted"
    ],
    correct: 0
  },
  {
    question: "Extract Min removes:",
    options: ["Leaf node", "Root node", "Left child", "Right child"],
    correct: 1
  },
  {
    question: "What happens after removing the root from a heap?",
    options: [
      "Heapify up only",
      "Heapify down",
      "The heap becomes sorted",
      "Nothing changes"
    ],
    correct: 1
  },
  {
    question: "Which array relation gives the left child index?",
    options: ["i + 1", "2i + 1", "2i + 2", "i / 2"],
    correct: 1
  }
];

const binaryProblemBankMax = [
  {
    id: 1,
    title: "Implement insertHeap(heap, value, isMinHeap)",
    description:
      "Write a function insertHeap(heap, value, isMinHeap) that inserts a value into a heap and restores the heap property.",
    functionName: "insertHeap",
    tests: [
      { input: [[90, 70, 80, 30], 35, false], expected: [90, 70, 80, 30, 35] },
      { input: [[50, 40, 30], 100, false], expected: [100, 50, 30, 40] }
    ]
  },
  {
    id: 2,
    title: "Implement peekHeap(heap)",
    description:
      "Write a function peekHeap(heap) that returns the root value of the heap, or null if the heap is empty.",
    functionName: "peekHeap",
    tests: [
      { input: [[90, 70, 80, 30]], expected: 90 },
      { input: [[]], expected: null }
    ]
  },
  {
    id: 3,
    title: "Count heap nodes",
    description:
      "Write a function countHeapNodes(heap) that returns the total number of nodes in the heap array.",
    functionName: "countHeapNodes",
    tests: [
      { input: [[90, 70, 80, 30]], expected: 4 },
      { input: [[]], expected: 0 }
    ]
  },
  {
    id: 4,
    title: "Check if heap is empty",
    description:
      "Write a function isHeapEmpty(heap) that returns true if the heap is empty, otherwise false.",
    functionName: "isHeapEmpty",
    tests: [
      { input: [[]], expected: true },
      { input: [[1]], expected: false }
    ]
  },
  {
    id: 5,
    title: "Get parent index",
    description:
      "Write a function parentIndex(i) that returns the parent index for a heap node.",
    functionName: "parentIndex",
    tests: [
      { input: [1], expected: 0 },
      { input: [4], expected: 1 },
      { input: [6], expected: 2 }
    ]
  }
];

const binaryProblemBankMin = [
  {
    id: 101,
    title: "Implement insertHeap(heap, value, isMinHeap)",
    description:
      "Write a function insertHeap(heap, value, isMinHeap) that inserts a value into a heap and restores the heap property.",
    functionName: "insertHeap",
    tests: [
      { input: [[10, 20, 15, 40], 35, true], expected: [10, 20, 15, 40, 35] },
      { input: [[20, 30, 25], 5, true], expected: [5, 20, 25, 30] }
    ]
  },
  {
    id: 102,
    title: "Implement peekHeap(heap)",
    description:
      "Write a function peekHeap(heap) that returns the root value of the heap, or null if the heap is empty.",
    functionName: "peekHeap",
    tests: [
      { input: [[10, 20, 15, 40]], expected: 10 },
      { input: [[]], expected: null }
    ]
  },
  {
    id: 103,
    title: "Count heap nodes",
    description:
      "Write a function countHeapNodes(heap) that returns the total number of nodes in the heap array.",
    functionName: "countHeapNodes",
    tests: [
      { input: [[10, 20, 15, 40]], expected: 4 },
      { input: [[]], expected: 0 }
    ]
  },
  {
    id: 104,
    title: "Check if heap is empty",
    description:
      "Write a function isHeapEmpty(heap) that returns true if the heap is empty, otherwise false.",
    functionName: "isHeapEmpty",
    tests: [
      { input: [[]], expected: true },
      { input: [[1]], expected: false }
    ]
  },
  {
    id: 105,
    title: "Get left child index",
    description:
      "Write a function leftChildIndex(i) that returns the left child index for a heap node.",
    functionName: "leftChildIndex",
    tests: [
      { input: [0], expected: 1 },
      { input: [2], expected: 5 },
      { input: [4], expected: 9 }
    ]
  }
];

const heapCodeTemplates = {
  javascript: `function insertHeap(heap, value, isMinHeap = false) {
  heap.push(value);

  let index = heap.length - 1;

  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    const shouldSwap = isMinHeap
      ? heap[parent] > heap[index]
      : heap[parent] < heap[index];

    if (!shouldSwap) break;

    [heap[parent], heap[index]] = [heap[index], heap[parent]];
    index = parent;
  }

  return heap;
}`,
  python: `def insert_heap(heap, value, is_min_heap=False):
    heap.append(value)
    index = len(heap) - 1

    while index > 0:
        parent = (index - 1) // 2
        should_swap = heap[parent] > heap[index] if is_min_heap else heap[parent] < heap[index]

        if not should_swap:
            break

        heap[parent], heap[index] = heap[index], heap[parent]
        index = parent

    return heap`,
  cpp: `vector<int> insertHeap(vector<int> heap, int value, bool isMinHeap = false) {
    heap.push_back(value);
    int index = heap.size() - 1;

    while (index > 0) {
        int parent = (index - 1) / 2;
        bool shouldSwap = isMinHeap ? heap[parent] > heap[index] : heap[parent] < heap[index];

        if (!shouldSwap) break;

        swap(heap[parent], heap[index]);
        index = parent;
    }

    return heap;
}`,
  c: `void insertHeap(int heap[], int* size, int value, int isMinHeap) {
    heap[*size] = value;
    int index = *size;
    (*size)++;

    while (index > 0) {
        int parent = (index - 1) / 2;
        int shouldSwap = isMinHeap ? heap[parent] > heap[index] : heap[parent] < heap[index];

        if (!shouldSwap) break;

        int temp = heap[parent];
        heap[parent] = heap[index];
        heap[index] = temp;
        index = parent;
    }
}`,
  java: `static List<Integer> insertHeap(List<Integer> heap, int value, boolean isMinHeap) {
    heap.add(value);
    int index = heap.size() - 1;

    while (index > 0) {
      int parent = (index - 1) / 2;
      boolean shouldSwap = isMinHeap
          ? heap.get(parent) > heap.get(index)
          : heap.get(parent) < heap.get(index);

      if (!shouldSwap) break;

      int temp = heap.get(parent);
      heap.set(parent, heap.get(index));
      heap.set(index, temp);
      index = parent;
    }

    return heap;
}`
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getStarterCode(problem, language) {
  const fn = problem.functionName;

  if (language === "python") {
    const map = {
      insertHeap: `def insertHeap(heap, value, isMinHeap=False):
    # Write your solution here
    return heap
`,
      peekHeap: `def peekHeap(heap):
    # Write your solution here
    return None
`,
      countHeapNodes: `def countHeapNodes(heap):
    # Write your solution here
    return 0
`,
      isHeapEmpty: `def isHeapEmpty(heap):
    # Write your solution here
    return False
`,
      parentIndex: `def parentIndex(i):
    # Write your solution here
    return 0
`,
      leftChildIndex: `def leftChildIndex(i):
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
    insertHeap: `function insertHeap(heap, value, isMinHeap = false) {
  // Write your solution here
  return heap;
}
`,
    peekHeap: `function peekHeap(heap) {
  // Write your solution here
  return null;
}
`,
    countHeapNodes: `function countHeapNodes(heap) {
  // Write your solution here
  return 0;
}
`,
    isHeapEmpty: `function isHeapEmpty(heap) {
  // Write your solution here
  return false;
}
`,
    parentIndex: `function parentIndex(i) {
  // Write your solution here
  return 0;
}
`,
    leftChildIndex: `function leftChildIndex(i) {
  // Write your solution here
  return 0;
}
`
  };

  return map[fn] || `function solve() {\n  // Write your solution here\n}\n`;
}

export default function HeapLab() {
  const [heapType, setHeapType] = useState("max");
  const [heap, setHeap] = useState([]);
  const [input, setInput] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Heap initialized.");
  const [experimentRun, setExperimentRun] = useState(false);

  const [activeIndices, setActiveIndices] = useState([]);
  const [swappedIndices, setSwappedIndices] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [stepHistory, setStepHistory] = useState([]);

  const stopRequestedRef = useRef(false);
  const inputRef = useRef(null);

  const quizQuestions = useMemo(
    () => (heapType === "min" ? minHeapQuizQuestions : maxHeapQuizQuestions),
    [heapType]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [currentProblems, setCurrentProblems] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState({});
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setHeap([]);
    setInput("");
    setMessage(heapType === "min" ? "Min Heap initialized." : "Max Heap initialized.");
    setExperimentRun(false);
    setActiveIndices([]);
    setSwappedIndices([]);
    setStepHistory([]);
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCurrentProblems([]);
    setSelectedLanguages({});
    setCodes({});
    setResults({});
  }, [heapType, quizQuestions.length]);

  const clearHighlights = () => {
    setActiveIndices([]);
    setSwappedIndices([]);
  };

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const isCorrectOrder = (parent, child) =>
    heapType === "min" ? parent <= child : parent >= child;

  const betterChild = (arr, a, b) => {
    if (b >= arr.length) return a;
    return heapType === "min"
      ? arr[a] <= arr[b]
        ? a
        : b
      : arr[a] >= arr[b]
      ? a
      : b;
  };

  const stopAnimation = () => {
    stopRequestedRef.current = true;
    setMessage("Stopping heap operation...");
    addStep("Stop requested by user.");
  };

  const animateInsert = async () => {
    if (isRunning) return;

    if (!input.trim() || Number.isNaN(Number(input.trim()))) {
      setMessage("Please enter a valid number.");
      return;
    }

    const value = Number(input.trim());
    const newHeap = [...heap, value];

    setHeap(newHeap);
    setInput("");
    setExperimentRun(true);
    setIsRunning(true);
    stopRequestedRef.current = false;
    clearHighlights();
    setStepHistory([]);
    inputRef.current?.focus();

    try {
      let index = newHeap.length - 1;

      setMessage(
        `Inserted ${value} at index ${index}. Starting heapify-up for ${heapType} heap...`
      );
      addStep(`Inserted ${value} at index ${index}.`);
      await sleep(animationSpeed);

      while (index > 0) {
        if (stopRequestedRef.current) {
          setMessage("Insert animation stopped.");
          addStep("Insert animation stopped before completion.");
          return;
        }

        const parent = Math.floor((index - 1) / 2);

        setActiveIndices([index, parent]);
        setMessage(
          `Comparing child ${newHeap[index]} (index ${index}) with parent ${newHeap[parent]} (index ${parent})...`
        );
        addStep(
          `Compare child ${newHeap[index]} at index ${index} with parent ${newHeap[parent]} at index ${parent}.`
        );
        await sleep(animationSpeed);

        if (isCorrectOrder(newHeap[parent], newHeap[index])) {
          setMessage("Heap property satisfied. Insert complete.");
          addStep("Heap property satisfied. Heapify-up complete.");
          break;
        }

        const parentVal = newHeap[parent];
        const childVal = newHeap[index];

        [newHeap[parent], newHeap[index]] = [newHeap[index], newHeap[parent]];
        setHeap([...newHeap]);
        setSwappedIndices([parent, index]);
        setMessage(`Swapped ${parentVal} and ${childVal}.`);
        addStep(`Swap ${parentVal} with ${childVal}.`);
        await sleep(Math.max(200, animationSpeed / 1.5));

        index = parent;
        setSwappedIndices([]);
      }

      clearHighlights();
      setMessage(`Heap after insert: [${newHeap.join(", ")}]`);
      addStep(`Final heap after insert: [${newHeap.join(", ")}].`);
      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: `${heapType}-heap`, time: Date.now() })
      );
    } finally {
      setIsRunning(false);
      stopRequestedRef.current = false;
    }
  };

  const animateExtractRoot = async () => {
    if (isRunning) return;

    if (heap.length === 0) {
      setMessage("Heap is empty.");
      return;
    }

    setExperimentRun(true);
    setIsRunning(true);
    stopRequestedRef.current = false;
    clearHighlights();
    setStepHistory([]);

    try {
      const newHeap = [...heap];
      const rootValue = newHeap[0];
      const extractLabel = heapType === "min" ? "min" : "max";

      if (newHeap.length === 1) {
        setHeap([]);
        setMessage(`Extracted ${extractLabel} ${rootValue}. Heap is now empty.`);
        addStep(`Extracted ${extractLabel} value ${rootValue}. Heap is now empty.`);
        return;
      }

      const movedValue = newHeap[newHeap.length - 1];
      newHeap[0] = movedValue;
      newHeap.pop();
      setHeap([...newHeap]);

      setActiveIndices([0]);
      setMessage(
        `Extracted ${extractLabel} ${rootValue}. Moved last element to root. Starting heapify-down...`
      );
      addStep(`Extracted ${extractLabel} value ${rootValue}.`);
      addStep(`Moved ${movedValue} to root and started heapify-down.`);
      await sleep(animationSpeed);

      let index = 0;

      while (true) {
        if (stopRequestedRef.current) {
          setMessage("Extract animation stopped.");
          addStep("Extract animation stopped before completion.");
          return;
        }

        const left = 2 * index + 1;
        const right = 2 * index + 2;

        if (left >= newHeap.length) {
          setMessage("Heap property restored after extract.");
          addStep("No children left to compare. Heapify-down complete.");
          break;
        }

        const chosenChild = betterChild(newHeap, left, right);

        setActiveIndices(
          [index, left, right].filter((i) => i >= 0 && i < newHeap.length)
        );

        addStep(
          `Compare root candidate ${newHeap[index]} at index ${index} with child ${newHeap[chosenChild]} at index ${chosenChild}.`
        );

        if (isCorrectOrder(newHeap[index], newHeap[chosenChild])) {
          setMessage("Heap property restored after extract.");
          addStep("Heap property satisfied. Heapify-down complete.");
          break;
        }

        setMessage(
          `Swapping ${newHeap[index]} with child ${newHeap[chosenChild]} to restore heap.`
        );
        await sleep(animationSpeed);

        const currentVal = newHeap[index];
        const childVal = newHeap[chosenChild];

        [newHeap[index], newHeap[chosenChild]] = [newHeap[chosenChild], newHeap[index]];
        setHeap([...newHeap]);
        setSwappedIndices([index, chosenChild]);
        addStep(`Swap ${currentVal} with ${childVal}.`);
        await sleep(Math.max(200, animationSpeed / 1.5));

        setSwappedIndices([]);
        index = chosenChild;
      }

      clearHighlights();
      setMessage(`Heap after extract: [${newHeap.join(", ")}]`);
      addStep(`Final heap after extract: [${newHeap.join(", ")}].`);
    } finally {
      setIsRunning(false);
      stopRequestedRef.current = false;
    }
  };

  const peekRoot = () => {
    if (isRunning) return;

    if (heap.length === 0) {
      setMessage("Heap is empty.");
      return;
    }

    clearHighlights();
    setActiveIndices([0]);
    setMessage(
      `${heapType === "min" ? "Minimum" : "Maximum"} value is ${heap[0]}.`
    );
    setStepHistory([
      `${heapType === "min" ? "Minimum" : "Maximum"} value at root is ${heap[0]}.`
    ]);
    setExperimentRun(true);
  };

  const loadSampleHeap = () => {
    if (isRunning) return;

    const sample =
      heapType === "min"
        ? [10, 20, 15, 40, 50, 30, 25]
        : [90, 70, 80, 30, 40, 50, 60];

    setHeap(sample);
    clearHighlights();
    setStepHistory([`Loaded sample ${heapType === "min" ? "Min" : "Max"} Heap.`]);
    setMessage(`Loaded sample ${heapType === "min" ? "Min" : "Max"} Heap.`);
    setExperimentRun(true);
  };

  const reset = () => {
    if (isRunning) return;

    setHeap([]);
    setInput("");
    clearHighlights();
    setStepHistory([]);
    setMessage(`${heapType === "min" ? "Min" : "Max"} Heap reset.`);
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
      experiment: `${heapType}-heap`,
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
    const bank = heapType === "min" ? binaryProblemBankMin : binaryProblemBankMax;
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
      topic: "heap",
      heapType,
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
      topic: "heap",
      heapType,
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

  const heapModeLabel = heapType === "min" ? "Min Heap" : "Max Heap";
  const rootLabel = heap.length > 0 ? heap[0] : "NULL";
  const complexityLabel = "Insert / Extract O(log n), Peek O(1)";

  return (
  <div className="er-shell">
    <aside className={`er-left-rail ${sidebarCollapsed ? "collapsed" : ""}`}>
      <div className="er-brand">
        <div className="er-brand-logo">
          <img src={simulabLogo} alt="SimuLab" />
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
          <h1 className="er-page-title">{heapModeLabel}</h1>
          <p className="er-page-subtitle">
            Learn heap insertion, extraction, heapify-up, heapify-down, and array/tree representation.
          </p>
        </div>
      </div>

      <section className="er-config-card">
        <div className="er-config-top">
          <div>
            <h2>Heap Configuration</h2>
            <p>Select heap type, animation speed, and observe heap operations step by step.</p>
          </div>

          <div className="er-mode-pill">
            <div className="er-mode-pill-icon">
              <Cpu size={18} />
            </div>
            <div>
              <strong>{heapModeLabel}</strong>
              <span>{complexityLabel}. Current nodes: {heap.length}.</span>
            </div>
          </div>
        </div>

        <div className="er-config-grid">
          <div>
            <label className="sorting-label">Heap Type</label>
            <select
              value={heapType}
              onChange={(e) => setHeapType(e.target.value)}
              className="sorting-select"
              disabled={isRunning}
            >
              <option value="max">Max Heap</option>
              <option value="min">Min Heap</option>
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
          <button className="er-chip active">Mode = {heapModeLabel}</button>
          <button className="er-chip active">Nodes = {heap.length}</button>
          <button className="er-chip active">Root = {rootLabel}</button>
          <button className="er-chip active">Steps = {stepHistory.length}</button>
          <button className="er-chip active">Complexity = {complexityLabel}</button>
          <button className={`er-chip ${experimentRun ? "active" : ""}`}>
            {experimentRun ? "Experiment Run" : "Not Started"}
          </button>
        </div>
      </section>

      <div className="er-content-layout">
        <section className="er-content-card">
          {activeSection === "overview" && <HeapOverview heapType={heapType} />}

          {activeSection === "simulation" && (
            <HeapSimulation
              heapType={heapType}
              heap={heap}
              input={input}
              setInput={setInput}
              animateInsert={animateInsert}
              animateExtractRoot={animateExtractRoot}
              peekRoot={peekRoot}
              stopAnimation={stopAnimation}
              loadSampleHeap={loadSampleHeap}
              reset={reset}
              message={message}
              inputRef={inputRef}
              activeIndices={activeIndices}
              swappedIndices={swappedIndices}
              isRunning={isRunning}
              stepHistory={stepHistory}
            />
          )}

          {activeSection === "quiz" && (
            <HeapQuiz
              heapType={heapType}
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
            <HeapCoding
              heapType={heapType}
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