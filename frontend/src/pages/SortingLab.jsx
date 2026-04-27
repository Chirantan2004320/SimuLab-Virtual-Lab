import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PaymentDialog from "../components/PaymentDialog";
import {
  BookOpen,
  PlayCircle,
  GitCompare,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu
} from "lucide-react";
import "./SortingLab.css";

import SortingOverview from "./labs/sorting/SortingOverview";
import SortingSimulation from "./labs/sorting/SortingSimulation";
import SortingQuiz from "./labs/sorting/SortingQuiz";
import SortingCoding from "./labs/sorting/SortingCoding";
import SortingComparison from "./labs/sorting/SortingComparison";

/* KEEP YOUR EXISTING quizQuestions OBJECT HERE */
/* KEEP YOUR EXISTING problemBank ARRAY HERE */

const quizQuestions = {
  bubble: [
    {
      question: "What is the time complexity of Bubble Sort in the worst case?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correct: 2
    },
    {
      question: "What is the space complexity of Bubble Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correct: 3
    },
    {
      question:
        "In Bubble Sort, after each pass, which element is guaranteed to be in its correct position?",
      options: ["The smallest element", "The largest element", "A random element", "None"],
      correct: 1
    },
    {
      question: "How many comparisons are made in the first pass of Bubble Sort for an array of size n?",
      options: ["n", "n-1", "n-2", "n+1"],
      correct: 1
    },
    {
      question: "Bubble Sort is stable. What does this mean?",
      options: [
        "It uses constant space",
        "Equal elements maintain their relative order",
        "It sorts in place",
        "It is fast"
      ],
      correct: 1
    },
    {
      question: "When is Bubble Sort most efficient?",
      options: [
        "When the array is already sorted",
        "When the array is in reverse order",
        "When elements are random",
        "Never"
      ],
      correct: 0
    }
  ],
  selection: [
    {
      question: "What is the time complexity of Selection Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correct: 2
    },
    {
      question: "What is the space complexity of Selection Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correct: 3
    },
    {
      question: "In Selection Sort, how many swaps are performed in the worst case for an array of size n?",
      options: ["n", "n-1", "n-2", "Depends on input"],
      correct: 1
    },
    {
      question: "Selection Sort is stable. True or False?",
      options: ["True", "False"],
      correct: 1
    },
    {
      question: "What is the main advantage of Selection Sort over Bubble Sort?",
      options: ["Fewer comparisons", "Fewer swaps", "Better worst-case time", "It is stable"],
      correct: 1
    },
    {
      question: "In Selection Sort, the sorted subarray is built from:",
      options: ["Left to right", "Right to left", "Middle outwards", "Randomly"],
      correct: 0
    }
  ],
  insertion: [
    {
      question: "What is the best-case time complexity of Insertion Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correct: 0
    },
    {
      question: "What is the worst-case time complexity of Insertion Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correct: 2
    },
    {
      question: "Insertion Sort works best when:",
      options: [
        "The array is nearly sorted",
        "The array is reverse sorted",
        "The array is random",
        "The array has duplicates only"
      ],
      correct: 0
    },
    {
      question: "Insertion Sort is stable. What does this mean?",
      options: [
        "It is always fast",
        "It uses recursion",
        "Equal elements keep their relative order",
        "It uses extra memory"
      ],
      correct: 2
    },
    {
      question: "Which portion of the array is considered sorted during Insertion Sort?",
      options: ["Right portion", "Left portion", "Middle portion", "No portion"],
      correct: 1
    },
    {
      question: "What operation is most common in Insertion Sort?",
      options: ["Merging", "Partitioning", "Shifting elements", "Hashing"],
      correct: 2
    }
  ]
};

const problemBank = [
  {
    id: 1,
    algorithm: "bubble",
    description:
      "Write a function bubbleSort(arr) that sorts the given array in ascending order using Bubble Sort algorithm. The function should modify the array in place.",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: [1, 1, 3, 4, 5] },
      { input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] },
      { input: [1, 2, 3], expected: [1, 2, 3] }
    ]
  },
  {
    id: 2,
    algorithm: "bubble",
    description:
      "Implement an optimized Bubble Sort that stops early if no swaps are made in a pass. Function: optimizedBubbleSort(arr)",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: [1, 1, 3, 4, 5] },
      { input: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5] },
      { input: [5, 1, 2, 3, 4], expected: [1, 2, 3, 4, 5] }
    ]
  },
  {
    id: 3,
    algorithm: "bubble",
    description: "Write a function that counts the number of swaps in Bubble Sort. Function: countSwaps(arr) - return the swap count.",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: 4 },
      { input: [1, 2, 3], expected: 0 },
      { input: [2, 1], expected: 1 }
    ]
  },
  {
    id: 4,
    algorithm: "bubble",
    description: "Implement Bubble Sort for descending order. Function: bubbleSortDesc(arr)",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: [5, 4, 3, 1, 1] },
      { input: [1, 2, 3], expected: [3, 2, 1] }
    ]
  },
  {
    id: 5,
    algorithm: "bubble",
    description: "Write a function to check if an array is already sorted using Bubble Sort logic. Function: isSorted(arr) - return true or false.",
    tests: [
      { input: [1, 2, 3, 4, 5], expected: true },
      { input: [3, 1, 4, 1, 5], expected: false },
      { input: [5, 4, 3, 2, 1], expected: false }
    ]
  },
  {
    id: 6,
    algorithm: "selection",
    description:
      "Write a function selectionSort(arr) that sorts the given array in ascending order using Selection Sort algorithm. The function should modify the array in place.",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: [1, 1, 3, 4, 5] },
      { input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] },
      { input: [1, 2, 3], expected: [1, 2, 3] }
    ]
  },
  {
    id: 7,
    algorithm: "selection",
    description:
      "Implement Selection Sort for descending order. Function: selectionSortDesc(arr) - modify the array in place to sort in descending order.",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: [5, 4, 3, 1, 1] },
      { input: [1, 2, 3], expected: [3, 2, 1] }
    ]
  },
  {
    id: 8,
    algorithm: "selection",
    description:
      "Write a function that counts the number of swaps performed during Selection Sort. Function: countSwapsSelection(arr) - return the total number of swaps needed.",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: 3 },
      { input: [1, 2, 3], expected: 0 },
      { input: [2, 1], expected: 1 }
    ]
  },
  {
    id: 9,
    algorithm: "selection",
    description:
      "Write a function to find the index of the minimum element in an array starting from a given position. Function: findMinIndex(arr, startIndex) - return the index of the smallest element from startIndex onwards.",
    tests: [
      { input: [[3, 1, 4, 1, 5], 0], expected: 1 },
      { input: [[5, 4, 3, 2, 1], 2], expected: 4 },
      { input: [[1, 2, 3], 0], expected: 0 }
    ]
  },
  {
    id: 10,
    algorithm: "selection",
    description:
      "Implement Selection Sort and return the number of passes performed. Function: selectionSortWithPasses(arr) - sort the array and return the number of passes (n-1 for array of size n).",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: 4 },
      { input: [1, 2, 3], expected: 2 },
      { input: [2, 1], expected: 1 }
    ]
  },
  {
    id: 11,
    algorithm: "insertion",
    description: "Write a function insertionSort(arr) that sorts the given array in ascending order using Insertion Sort.",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: [1, 1, 3, 4, 5] },
      { input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] },
      { input: [1, 2, 3], expected: [1, 2, 3] }
    ]
  },
  {
    id: 12,
    algorithm: "insertion",
    description: "Implement Insertion Sort in descending order. Function: insertionSortDesc(arr)",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: [5, 4, 3, 1, 1] },
      { input: [1, 2, 3], expected: [3, 2, 1] }
    ]
  },
  {
    id: 13,
    algorithm: "insertion",
    description: "Write a function countShifts(arr) that returns the total number of shifts performed during Insertion Sort.",
    tests: [
      { input: [3, 1, 4, 1, 5], expected: 3 },
      { input: [1, 2, 3], expected: 0 },
      { input: [5, 4, 3], expected: 3 }
    ]
  }
];


const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "comparison", label: "Comparison", icon: GitCompare },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

function SortingLab() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const [, setExperimentsList] = useState([]);
  const [selectedExp, setSelectedExp] = useState(null);
  const [hasAccess, setHasAccess] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseMsg, setPurchaseMsg] = useState("");
  const [purchaseExpiry] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const [input, setInput] = useState("5, 2, 9, 1, 6");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble");
  const [steps, setSteps] = useState([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [info, setInfo] = useState("");
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [selectedLanguages, setSelectedLanguages] = useState({});
  const [results, setResults] = useState({});

  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const timer = useRef(null);

  const algorithmNames = {
    bubble: "Bubble Sort",
    selection: "Selection Sort",
    insertion: "Insertion Sort"
  };

  const algorithmMeta = {
  bubble: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: "Yes",
    technique: "Adjacent comparison + swapping"
  },
  selection: {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: "No",
    technique: "Select minimum + place in sorted side"
  },
  insertion: {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: "Yes",
    technique: "Insert key into sorted portion"
  }
};

  function getLabName(algo) {
    if (algo === "bubble") return "Bubble Sort Lab";
    if (algo === "selection") return "Selection Sort Lab";
    return "Insertion Sort Lab";
  }

  function parseInput(text) {
    return text
      .split(/,|\s+/)
      .map(Number)
      .filter((n) => !isNaN(n));
  }

  function generateSteps(a0) {
    const a = [...a0];
    const s = [];
    let comp = 0;
    let sw = 0;

    s.push({
      array: [...a],
      j: null,
      info: "Initial array loaded. Ready to begin sorting.",
      i: null,
      minIndex: null,
      keyIndex: null,
      sortedEnd: null,
      pass: 0
    });

    if (selectedAlgorithm === "bubble") {
      for (let i = 0; i < a.length - 1; i++) {
        let swapped = false;
        const currentPass = i + 1;

        s.push({
          array: [...a],
          j: null,
          info: `Pass ${currentPass}: Starting bubble sort pass. Elements from index 0 to ${a.length - i - 1} will be compared.`,
          comp,
          sw,
          i: null,
          minIndex: null,
          keyIndex: null,
          sortedEnd: null,
          pass: currentPass
        });

        for (let j = 0; j < a.length - i - 1; j++) {
          comp++;
          s.push({
            array: [...a],
            j,
            info: `Pass ${currentPass}: Comparing elements at positions ${j} and ${j + 1} (${a[j]} > ${a[j + 1]}?)`,
            comp,
            sw,
            i: null,
            minIndex: null,
            keyIndex: null,
            sortedEnd: null,
            pass: currentPass
          });

          if (a[j] > a[j + 1]) {
            [a[j], a[j + 1]] = [a[j + 1], a[j]];
            sw++;
            swapped = true;

            s.push({
              array: [...a],
              j,
              info: `Pass ${currentPass}: Elements swapped! ${a[j]} moved to position ${j}, ${a[j + 1]} moved to position ${j + 1}`,
              comp,
              sw,
              i: null,
              minIndex: null,
              keyIndex: null,
              sortedEnd: null,
              pass: currentPass
            });
          } else {
            s.push({
              array: [...a],
              j,
              info: `Pass ${currentPass}: No swap needed. Elements are already in correct order.`,
              comp,
              sw,
              i: null,
              minIndex: null,
              keyIndex: null,
              sortedEnd: null,
              pass: currentPass
            });
          }
        }

        s.push({
          array: [...a],
          j: null,
          info: `Pass ${currentPass} complete. Largest element (${a[a.length - i - 1]}) is now in its final position.`,
          comp,
          sw,
          i: null,
          minIndex: null,
          keyIndex: null,
          sortedEnd: null,
          pass: currentPass
        });

        if (!swapped) {
          s.push({
            array: [...a],
            j: null,
            info: `Optimization: No swaps occurred in pass ${currentPass}. Array is already sorted!`,
            comp,
            sw,
            i: null,
            minIndex: null,
            keyIndex: null,
            sortedEnd: null,
            pass: currentPass
          });
          break;
        }
      }

      s.push({
        array: [...a],
        j: null,
        info: "Bubble Sort complete! Array is now fully sorted.",
        comp,
        sw,
        i: null,
        minIndex: null,
        keyIndex: null,
        sortedEnd: null,
        pass: null
      });
    } else if (selectedAlgorithm === "selection") {
      let pass = 1;

      for (let i = 0; i < a.length - 1; i++) {
        let minIdx = i;

        s.push({
          array: [...a],
          i,
          j: null,
          minIndex: minIdx,
          keyIndex: null,
          sortedEnd: null,
          info: `Pass ${pass}: Finding minimum element starting from position ${i} in the unsorted portion`,
          comp,
          sw,
          pass
        });

        for (let j = i + 1; j < a.length; j++) {
          comp++;
          s.push({
            array: [...a],
            i,
            j,
            minIndex: minIdx,
            keyIndex: null,
            sortedEnd: null,
            info: `Pass ${pass}: Comparing element at position ${j} (${a[j]}) with current minimum at position ${minIdx} (${a[minIdx]})`,
            comp,
            sw,
            pass
          });

          if (a[j] < a[minIdx]) {
            minIdx = j;
            s.push({
              array: [...a],
              i,
              j,
              minIndex: minIdx,
              keyIndex: null,
              sortedEnd: null,
              info: `Pass ${pass}: New minimum found! Element ${a[minIdx]} at position ${minIdx} is smaller than previous minimum`,
              comp,
              sw,
              pass
            });
          }
        }

        if (minIdx !== i) {
          [a[i], a[minIdx]] = [a[minIdx], a[i]];
          sw++;
          s.push({
            array: [...a],
            i,
            j: null,
            minIndex: minIdx,
            keyIndex: null,
            sortedEnd: null,
            info: `Pass ${pass}: Swapping minimum element (${a[i]}) into position ${i}`,
            comp,
            sw,
            pass
          });
        } else {
          s.push({
            array: [...a],
            i,
            j: null,
            minIndex: minIdx,
            keyIndex: null,
            sortedEnd: null,
            info: `Pass ${pass}: No swap needed. Minimum element is already at position ${i}`,
            comp,
            sw,
            pass
          });
        }

        pass++;
      }

      s.push({
        array: [...a],
        j: null,
        info: "Selection Sort complete! Array is now fully sorted.",
        comp,
        sw,
        i: null,
        minIndex: null,
        keyIndex: null,
        sortedEnd: null,
        pass: null
      });
    } else if (selectedAlgorithm === "insertion") {
      let pass = 1;

      for (let i = 1; i < a.length; i++) {
        const key = a[i];
        let j = i - 1;

        s.push({
          array: [...a],
          i,
          j,
          minIndex: null,
          keyIndex: i,
          sortedEnd: i - 1,
          info: `Pass ${pass}: Pick key element ${key} at position ${i}. Insert it into the sorted portion on the left.`,
          comp,
          sw,
          pass
        });

        while (j >= 0) {
          comp++;
          s.push({
            array: [...a],
            i,
            j,
            minIndex: null,
            keyIndex: i,
            sortedEnd: i - 1,
            info: `Pass ${pass}: Compare key ${key} with element ${a[j]} at position ${j}.`,
            comp,
            sw,
            pass
          });

          if (a[j] > key) {
            a[j + 1] = a[j];
            sw++;

            s.push({
              array: [...a],
              i,
              j,
              minIndex: null,
              keyIndex: j,
              sortedEnd: i - 1,
              info: `Pass ${pass}: ${a[j]} is greater than ${key}, so shift ${a[j]} one position to the right.`,
              comp,
              sw,
              pass
            });

            j--;
          } else {
            break;
          }
        }

        a[j + 1] = key;

        s.push({
          array: [...a],
          i,
          j: j + 1,
          minIndex: null,
          keyIndex: j + 1,
          sortedEnd: i,
          info: `Pass ${pass}: Insert key ${key} at position ${j + 1}. The sorted portion now extends to index ${i}.`,
          comp,
          sw,
          pass
        });

        pass++;
      }

      s.push({
        array: [...a],
        j: null,
        info: "Insertion Sort complete! Array is now fully sorted.",
        comp,
        sw,
        i: null,
        minIndex: null,
        keyIndex: null,
        sortedEnd: a.length - 1,
        pass: null
      });
    }

    return s;
  }

  function start() {
    const a = parseInput(input);
    if (a.length < 2) return;

    const s = generateSteps(a);
    setSteps(s);
    setIdx(0);
    setInfo(s[0]?.info || "Starting simulation...");
    setComparisons(s[0]?.comp || 0);
    setSwaps(s[0]?.sw || 0);
    setPlaying(true);
    setExperimentRun(true);
  }

  useEffect(() => {
    const fetchExps = async () => {
      try {
        try {
          await axios.post("http://localhost:5000/api/experiments/seed/sorting-experiment");
        } catch (seedErr) {
          console.warn("Seed warning (non-critical):", seedErr.message);
        }

        const res = await axios.get("http://localhost:5000/api/experiments");
        const expList = res.data || [];
        setExperimentsList(expList);

        const sorting = expList.find((e) => e.type === "sorting");

        if (sorting) {
          setSelectedExp(sorting);
          setTimeout(() => checkAccess(), 300);
        }
      } catch (e) {
        console.error("Error fetching experiments:", e);
      }
    };

    fetchExps();
  }, []);

  const checkAccess = async () => {
    setHasAccess(true);
  };

  const handleGooglePayClick = () => {
    if (!selectedExp || !user) {
      setPurchaseMsg("Please login to purchase.");
      return;
    }
    setShowPaymentDialog(true);
    setPurchaseMsg("");
  };

  function pause() {
    setPlaying(false);
    clearInterval(timer.current);
  }

  function reset() {
    setPlaying(false);
    clearInterval(timer.current);
    setSteps([]);
    setIdx(0);
    setInfo("");
    setComparisons(0);
    setSwaps(0);
  }

  function nextStep() {
    if (idx < steps.length - 1) {
      const nextIdx = idx + 1;
      const nextStep = steps[nextIdx];
      setIdx(nextIdx);
      setInfo(nextStep.info);
      setComparisons(nextStep.comp);
      setSwaps(nextStep.sw);
    }
  }

  function prevStep() {
    if (idx > 0) {
      const prevIdx = idx - 1;
      const prevStep = steps[prevIdx];
      setIdx(prevIdx);
      setInfo(prevStep.info);
      setComparisons(prevStep.comp);
      setSwaps(prevStep.sw);
    }
  }

  function handleQuizAnswer(index, answer) {
    const newAnswers = [...quizAnswers];
    newAnswers[index] = answer;
    setQuizAnswers(newAnswers);
  }

  function submitQuiz() {
    let score = 0;
    quizQuestions[selectedAlgorithm].forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });

    setQuizScore(score);
    setQuizSubmitted(true);
  }

  function redoQuiz() {
    setQuizAnswers(Array(quizQuestions[selectedAlgorithm].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }

  function exportQuiz() {
    window.print();
  }

  function generateProblems() {
    const filteredProblems = problemBank.filter((p) => p.algorithm === selectedAlgorithm);
    const shuffled = [...filteredProblems].sort(() => 0.5 - Math.random());
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
  }

  function getStarterCode(problem, language) {
    const funcMatch = problem.description.match(/Function:\s*(\w+)/);
    const funcName = funcMatch ? funcMatch[1] : "solve";

    if (language === "python") {
      return `def ${funcName}(arr):
    # Write your solution here
    pass
`;
    }

    if (language === "cpp") {
      return `#include <bits/stdc++.h>
using namespace std;

void ${funcName}(vector<int>& arr) {
    // Write your solution here
}
`;
    }

    if (language === "java") {
      return `import java.util.*;

public class Main {
    public static void ${funcName}(int[] arr) {
        // Write your solution here
    }
}
`;
    }

    return `function ${funcName}(arr) {
  // Write your solution here
}
`;
  }

  function handleCodeChange(problemId, language, code) {
    const key = `${problemId}_${language}`;
    setCodes((prev) => ({ ...prev, [key]: code }));
  }

  function handleLanguageChange(problemId, language, problem) {
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
  }

  function runCode(problemId, language) {
    const problem = currentProblems.find((p) => p.id === problemId);
    const codeKey = `${problemId}_${language}`;
    const code = codes[codeKey];

    if (!code) {
      setResults((prev) => ({ ...prev, [problemId]: "Please enter code" }));
      return;
    }

    if (language !== "javascript") {
      setResults((prev) => ({
        ...prev,
        [problemId]: `${language.toUpperCase()} execution will be added later. For now, only JavaScript runs directly in the browser.`
      }));
      return;
    }

    try {
      const funcMatch = problem.description.match(/Function:\s*(\w+)/);
      const funcName = funcMatch ? funcMatch[1] : null;

      if (!funcName) {
        setResults((prev) => ({ ...prev, [problemId]: "Incorrect Output" }));
        return;
      }

      let allCorrect = true;
      const actualResults = [];

      for (const test of problem.tests) {
        let result;

        if (problem.id === 9) {
          const func = new Function(
            "arr",
            "startIndex",
            code + "; return " + funcName + "(arr, startIndex);"
          );
          result = func(test.input[0], test.input[1]);
        } else if ([3, 5, 8, 10, 13].includes(problem.id)) {
          const func = new Function("arr", code + "; return " + funcName + "(arr);");
          result = func([...test.input]);
        } else {
          const func = new Function("arr", code + "; " + funcName + "(arr); return arr;");
          result = func([...test.input]);
        }

        actualResults.push(result);

        if (JSON.stringify(result) !== JSON.stringify(test.expected)) {
          allCorrect = false;
          break;
        }
      }

      setResults((prev) => ({
        ...prev,
        [problemId]: allCorrect
          ? `Correct! Your outputs: ${actualResults.map((result) => JSON.stringify(result)).join(", ")}`
          : "Incorrect Output"
      }));
    } catch (e) {
      setResults((prev) => ({
        ...prev,
        [problemId]: "Error: " + e.message
      }));
    }
  }

  function analyzeCode(problemId, language) {
    const codeKey = `${problemId}_${language}`;
    const code = codes[codeKey];

    if (!code) {
      alert("Please enter code to analyze");
      return;
    }

    localStorage.setItem(
      "vlab_code_analysis",
      JSON.stringify({
        code,
        problemId,
        algorithm: selectedAlgorithm,
        language
      })
    );

    alert("Code analysis request sent to AI Assistant. Check the AI chat for feedback!");
  }

  function correctCode(problemId, language) {
    const codeKey = `${problemId}_${language}`;
    const code = codes[codeKey];

    if (!code) {
      alert("Please enter code to correct");
      return;
    }

    localStorage.setItem(
      "vlab_code_correction",
      JSON.stringify({
        code,
        problemId,
        algorithm: selectedAlgorithm,
        language,
        action: "correct"
      })
    );

    alert("Code correction request sent to AI Assistant. Check the AI chat for the corrected code!");
  }

  useEffect(() => {
    setQuizAnswers(Array(quizQuestions[selectedAlgorithm].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [selectedAlgorithm]);

  useEffect(() => {
    localStorage.setItem("vlab_current_algorithm", selectedAlgorithm);
  }, [selectedAlgorithm]);

  useEffect(() => {
    if (playing && steps.length > 0) {
      timer.current = setInterval(() => {
        setIdx((prevIdx) => {
          if (prevIdx >= steps.length - 1) {
            setPlaying(false);
            clearInterval(timer.current);
            return prevIdx;
          }

          const nextIdx = prevIdx + 1;
          const nextStep = steps[nextIdx];

          if (nextStep) {
            setInfo(nextStep.info);
            setComparisons(nextStep.comp);
            setSwaps(nextStep.sw);
          }

          return nextIdx;
        });
      }, speed);
    } else {
      clearInterval(timer.current);
    }

    return () => clearInterval(timer.current);
  }, [playing, steps, speed]);

  const current = steps[idx] || {};
  const highlight = current.j;

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 45
      : activeSection === "comparison"
      ? 65
      : activeSection === "quiz"
      ? 82
      : 95;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Please log in to access the lab.
      </div>
    );
  }

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
            <h1 className="er-page-title">{algorithmNames[selectedAlgorithm]}</h1>
            <p className="er-page-subtitle">
              Explore sorting algorithms through animated simulation, side-by-side comparison, quiz, and coding practice.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Algorithm Configuration</h2>
              <p>Select a sorting algorithm and observe its comparisons, swaps, and passes.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>{algorithmNames[selectedAlgorithm]}</strong>
                <span>
                  Step through the algorithm and track how the array changes during execution.
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Sorting Algorithm</label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="sorting-select"
              >
                <option value="bubble">Bubble Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="insertion">Insertion Sort</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Current Input</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                {input}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">Best = {algorithmMeta[selectedAlgorithm].best}</button>
            <button className="er-chip active">Average = {algorithmMeta[selectedAlgorithm].average}</button>
            <button className="er-chip active">Worst = {algorithmMeta[selectedAlgorithm].worst}</button>
            <button className="er-chip active">Space = {algorithmMeta[selectedAlgorithm].space}</button>
            <button className="er-chip active">Stable = {algorithmMeta[selectedAlgorithm].stable}</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
            {experimentRun ? "Simulation Run" : "Not Started"}
        </button>
    </div>

          {purchaseMsg ? (
            <div className="sorting-info-box" style={{ marginTop: 18 }}>
              {purchaseMsg}
            </div>
          ) : null}
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <SortingOverview
                selectedAlgorithm={selectedAlgorithm}
                algorithmNames={algorithmNames}
                setSelectedAlgorithm={setSelectedAlgorithm}
              />
            )}

            {activeSection === "simulation" && (
              <SortingSimulation
                selectedAlgorithm={selectedAlgorithm}
                algorithmNames={algorithmNames}
                input={input}
                setInput={setInput}
                start={start}
                pause={pause}
                reset={reset}
                prevStep={prevStep}
                nextStep={nextStep}
                idx={idx}
                steps={steps}
                selectedExp={selectedExp}
                hasAccess={hasAccess}
                purchaseExpiry={purchaseExpiry}
                purchaseLoading={purchaseLoading}
                purchaseMsg={purchaseMsg}
                handleGooglePayClick={handleGooglePayClick}
                comparisons={comparisons}
                swaps={swaps}
                current={current}
                highlight={highlight}
                info={info}
                speed={speed}
                setSpeed={setSpeed}
              />
            )}

            {activeSection === "comparison" && <SortingComparison />}

            {activeSection === "quiz" && (
              <SortingQuiz
                selectedAlgorithm={selectedAlgorithm}
                algorithmNames={algorithmNames}
                experimentRun={experimentRun}
                quizQuestions={quizQuestions}
                quizAnswers={quizAnswers}
                quizSubmitted={quizSubmitted}
                quizScore={quizScore}
                handleQuizAnswer={handleQuizAnswer}
                submitQuiz={submitQuiz}
                redoQuiz={redoQuiz}
                exportQuiz={exportQuiz}
              />
            )}

            {activeSection === "coding" && (
              <SortingCoding
                selectedAlgorithm={selectedAlgorithm}
                currentProblems={currentProblems}
                codes={codes}
                selectedLanguages={selectedLanguages}
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

      {showPaymentDialog && false && (
        <PaymentDialog
          selectedExp={selectedExp}
          user={user}
          onSuccess={() => {
            setHasAccess(true);
            setPurchaseMsg("✓ Payment verified! Access granted.");
          }}
          onClose={() => {
            setShowPaymentDialog(false);
            setPurchaseMsg("");
          }}
          isLoading={purchaseLoading}
          setLoading={setPurchaseLoading}
          setMessage={setPurchaseMsg}
        />
      )}
    </div>
  );
}

export default SortingLab;