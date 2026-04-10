import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// ✅ FIXED
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PaymentDialog from "../../../../components/PaymentDialog";

// ✅ CSS

import "../../../../styles/Lab.css";

// ✅ FIXED (same folder)
import SortingOverview from "./SortingOverview";
import SortingSimulation from "./SortingSimulation";
import SortingQuiz from "./SortingQuiz";
import SortingCoding from "./SortingCoding";
import SortingComparison from "./SortingComparison";

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
  const [hasAccess, setHasAccess] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseMsg, setPurchaseMsg] = useState("");
  const [purchaseExpiry,] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPaymentReceipt, setShowPaymentReceipt] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

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

  const timer = useRef(null);

  const [activeSection, setActiveSection] = useState("overview");

  const algorithmNames = {
    bubble: "Bubble Sort",
    selection: "Selection Sort",
    insertion: "Insertion Sort"
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

        s.push({
          array: [...a],
          i: i + 1,
          j: null,
          minIndex: null,
          keyIndex: null,
          sortedEnd: null,
          info: `Pass ${pass} completed`,
          comp,
          sw,
          pass
        });

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

    s.push({
      array: [...a],
      j: null,
      info: "Array is sorted",
      comp,
      sw,
      i: null,
      minIndex: null,
      keyIndex: null,
      sortedEnd: null,
      pass: null
    });

    return s;
  }

  function start() {
    if (selectedExp && selectedExp.requiresPayment && !hasAccess) {
      setPurchaseMsg("This experiment requires purchase. Please buy access to run it.");
      return;
    }

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

    try {
      const currentUser = user || JSON.parse(localStorage.getItem("user") || "null");
      if (currentUser && currentUser.id) {
        const key = `vlab_progress_${currentUser.id}`;
        const prog = JSON.parse(localStorage.getItem(key) || "{}");
        prog.experiments = prog.experiments || [];
        if (!prog.experiments.includes(selectedAlgorithm)) {
          prog.experiments.push(selectedAlgorithm);
        }
        prog.lastExperimentRun = Date.now();
        localStorage.setItem(key, JSON.stringify(prog));
      } else {
        const completed = JSON.parse(localStorage.getItem("vlab_completed_experiments") || "[]");
        if (!completed.includes(selectedAlgorithm)) {
          completed.push(selectedAlgorithm);
          localStorage.setItem("vlab_completed_experiments", JSON.stringify(completed));
        }
      }
    } catch (e) {
      console.error("Error saving progress:", e);
    }
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
          setTimeout(() => checkAccess(sorting._id), 300);
        } else {
          console.warn("No sorting experiment found in list");
        }
      } catch (e) {
        console.error("Error fetching experiments:", e);
      }
    };

    fetchExps();
  }, [setExperimentsList]);

  const checkAccess = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`http://localhost:5000/api/experiments/${id}/access`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      setHasAccess(!!res.data.access);
    } catch (e) {
      console.error("Error checking access:", e.response?.data || e.message);
      setHasAccess(false);
    }
  };

  const handleGooglePayClick = () => {
    if (!selectedExp || !user) {
      setPurchaseMsg("Please login to purchase.");
      return;
    }
    setShowPaymentDialog(true);
    setPurchaseMsg("");
  };

  const closePaymentReceipt = () => {
    setShowPaymentReceipt(false);
    setPaymentDetails(null);
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

    const quizResult = {
      correct: score,
      total: quizQuestions[selectedAlgorithm].length,
      algorithm: selectedAlgorithm,
      timestamp: Date.now()
    };

    try {
      const currentUser = user || JSON.parse(localStorage.getItem("user") || "null");
      if (currentUser && currentUser.id) {
        const key = `vlab_progress_${currentUser.id}`;
        const prog = JSON.parse(localStorage.getItem(key) || "{}");
        prog.quizzes = prog.quizzes || [];
        prog.quizzes.push(quizResult);
        localStorage.setItem(key, JSON.stringify(prog));
      } else {
        const existingScores = JSON.parse(localStorage.getItem("vlab_scores") || "[]");
        existingScores.push(quizResult);
        localStorage.setItem("vlab_scores", JSON.stringify(existingScores));
      }
    } catch (e) {
      console.error("Error saving quiz result:", e);
    }

    localStorage.setItem("vlab_last_quiz_completion", Date.now().toString());
  }

  function redoQuiz() {
    setQuizAnswers(Array(quizQuestions[selectedAlgorithm].length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }

  function exportQuiz() {
    const questions = quizQuestions[selectedAlgorithm] || [];

    const studentDetails = user
      ? {
          name: user.name,
          email: user.email,
          studentId: user.id,
          lab: getLabName(selectedAlgorithm)
        }
      : {
          name: "Unknown",
          email: "unknown@example.com",
          studentId: "N/A",
          lab: getLabName(selectedAlgorithm)
        };

    const html = `
      <html>
        <head>
          <title>Sorting Quiz Results</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #111 }
            h1 { color: #22223b }
            .student-info { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
            .q { margin-bottom: 12px }
            .correct { color: #2b8a3e; font-weight: 700 }
            .wrong { color: #b71c1c; font-weight: 700 }
          </style>
        </head>
        <body>
          <h1>Sorting Quiz Results - ${selectedAlgorithm}</h1>
          <div class="student-info">
            <h2>Student Information</h2>
            <p><strong>Name:</strong> ${studentDetails.name}</p>
            <p><strong>Email:</strong> ${studentDetails.email}</p>
            <p><strong>Student ID:</strong> ${studentDetails.studentId}</p>
            <p><strong>Lab:</strong> ${studentDetails.lab}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Score:</strong> ${quizScore} / ${questions.length}</p>
          </div>
          <hr />
          <h2>Quiz Answers</h2>
          ${questions
            .map((q, i) => {
              const userAnswer = quizAnswers[i];
              const correct = q.correct;
              return `<div class="q">
                <div><strong>${i + 1}. ${q.question}</strong></div>
                <div>User Answer: <span class="${userAnswer === correct ? "correct" : "wrong"}">${
                  userAnswer !== null ? q.options[userAnswer] : "No answer"
                }</span></div>
                <div>Correct Answer: <span class="correct">${q.options[correct]}</span></div>
              </div>`;
            })
            .join("")}
        </body>
      </html>`;

    const w = window.open("", "_blank");
    if (w) {
      try {
        w.document.open();
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(() => {
          w.print();
        }, 300);
        return;
      } catch (e) {
        // fall through
      }
    }

    try {
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sorting-quiz-results.html";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert("Popup blocked: quiz report downloaded. Open the downloaded file to print.");
    } catch (err) {
      alert("Unable to open or download the quiz report. Please allow popups and try again.");
    }
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
      [problemId]:
        `${language.toUpperCase()} execution will be added later. For now, only JavaScript runs directly in the browser.`
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

      // eslint-disable-next-line no-new-func
      if (problem.id === 9) {
      // eslint-disable-next-line no-new-func
        const func = new Function(
          "arr",
          "startIndex",
          code + "; return " + funcName + "(arr, startIndex);"
        );
        result = func(test.input[0], test.input[1]);
      // eslint-disable-next-line no-new-func
      } else if (problem.id === 10) {
        // eslint-disable-next-line no-new-func
        const func = new Function("arr", code + "; return " + funcName + "(arr);");
        result = func([...test.input]);
      // eslint-disable-next-line no-new-func
      } else if ([3, 5, 8, 13].includes(problem.id)) {
      // eslint-disable-next-line no-new-func  
        const func = new Function("arr", code + "; return " + funcName + "(arr);");
        result = func([...test.input]);
      // eslint-disable-next-line no-new-func
      } else {
      // eslint-disable-next-line no-new-func  
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
        ? `Correct! Your outputs: ${actualResults
            .map((result) => JSON.stringify(result))
            .join(", ")}`
        : "Incorrect Output"
    }));

    if (allCorrect) {
      const practice = JSON.parse(localStorage.getItem("vlab_practice") || "{}");
      practice[selectedAlgorithm] = (practice[selectedAlgorithm] || 0) + 1;
      localStorage.setItem("vlab_practice", JSON.stringify(practice));
    }
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

  const analysisData = {
    code,
    problemId,
    algorithm: selectedAlgorithm,
    language
  };

  localStorage.setItem("vlab_code_analysis", JSON.stringify(analysisData));
  alert("Code analysis request sent to AI Assistant. Check the AI chat for feedback!");
}


  function correctCode(problemId, language) {
  const codeKey = `${problemId}_${language}`;
  const code = codes[codeKey];

  if (!code) {
    alert("Please enter code to correct");
    return;
  }

  const correctionData = {
    code,
    problemId,
    algorithm: selectedAlgorithm,
    language,
    action: "correct"
  };

  localStorage.setItem("vlab_code_correction", JSON.stringify(correctionData));
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

  if (loading) {
    return (
      <div className="lab-page">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="lab-page">
        <p>Please log in to access the lab.</p>
      </div>
    );
  }

  if (selectedExp && selectedExp.requiresPayment && !hasAccess) {
    return (
      <>
        <div className="lab-page">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              backgroundColor: "#f0f2f5",
              padding: "20px"
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "50px",
                borderRadius: "15px",
                maxWidth: "600px",
                width: "100%",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{ fontSize: 80, marginBottom: 20, color: "#d1495a" }}>🔒</div>

              <h1 style={{ margin: "0 0 20px 0", color: "#333", fontSize: 32 }}>Experiment Locked</h1>

              <p style={{ fontSize: 18, color: "#666", marginBottom: 30 }}>
                <strong>{selectedExp.title}</strong>
              </p>

              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: 30,
                  borderLeft: "4px solid #2980b9"
                }}
              >
                <p style={{ margin: "10px 0", color: "#333" }}>
                  <strong>To access this experiment, you need to purchase a subscription</strong>
                </p>
                <p style={{ margin: "10px 0", color: "#666", fontSize: 14 }}>
                  Get <strong>{selectedExp.defaultDurationDays || 30} days</strong> of full access for just{" "}
                  <strong>₹{selectedExp.price || 1}</strong>
                </p>
              </div>

              <div style={{ marginBottom: 30, textAlign: "left" }}>
                <h3 style={{ marginTop: 0, marginBottom: 15, color: "#333" }}>What You'll Get:</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ padding: "8px 0", color: "#555", borderBottom: "1px solid #eee" }}>
                    ✓ Full access to {selectedExp.title}
                  </li>
                  <li style={{ padding: "8px 0", color: "#555", borderBottom: "1px solid #eee" }}>
                    ✓ Step-by-step visualizations
                  </li>
                  <li style={{ padding: "8px 0", color: "#555", borderBottom: "1px solid #eee" }}>
                    ✓ Interactive quizzes and practice problems
                  </li>
                  <li style={{ padding: "8px 0", color: "#555" }}>
                    ✓ Valid for {selectedExp.defaultDurationDays || 30} days from purchase
                  </li>
                </ul>
              </div>

              <div
                style={{
                  backgroundColor: "#27ae60",
                  color: "white",
                  padding: "25px",
                  borderRadius: "10px",
                  marginBottom: 30
                }}
              >
                <p style={{ margin: 0, fontSize: 14 }}>Subscription Price</p>
                <p style={{ margin: "10px 0 0 0", fontSize: 42, fontWeight: "bold" }}>₹{selectedExp.price || 1}</p>
                <p style={{ margin: "5px 0 0 0", fontSize: 12, opacity: 0.9 }}>
                  for {selectedExp.defaultDurationDays || 30} days access
                </p>
              </div>

              <button
                onClick={handleGooglePayClick}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "15px 30px",
                  fontSize: 16,
                  fontWeight: "bold",
                  backgroundColor: "#2980b9",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginBottom: 15,
                  transition: "background-color 0.3s"
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#1f618d")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#2980b9")}
              >
                💳 Pay with Google Pay
              </button>

              <p style={{ fontSize: 12, color: "#999", margin: 0 }}>
                Payment is secure and encrypted. You'll get instant access after payment.
              </p>
            </div>
          </div>
        </div>

        {showPaymentDialog && (
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
      </>
    );
  }

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – {algorithmNames[selectedAlgorithm]}</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Algorithm Selection</h2>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          style={{
            color: "#000",
            padding: "10px 12px",
            borderRadius: "8px",
            fontSize: "15px",
            minWidth: "220px"
          }}
        >
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
        </select>
      </section>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
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
            className={`sorting-sidebar-item ${activeSection === "comparison" ? "active" : ""}`}
            onClick={() => setActiveSection("comparison")}
          >
            Comparison
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
          {activeSection === "comparison" && (
           <SortingComparison />
          )}

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
        </main>
      </div>

      {showPaymentDialog && (
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

      {showPaymentReceipt && paymentDetails && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "15px",
              maxWidth: "500px",
              width: "100%",
              color: "#000",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <div style={{ fontSize: 50, color: "#27ae60", marginBottom: 10 }}>✓</div>
              <h2 style={{ margin: 0, color: "#27ae60" }}>Payment Successful!</h2>
              <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: 14 }}>
                Your subscription is now active
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: 25,
                border: "1px solid #e9ecef"
              }}
            >
              <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: "1px solid #dee2e6" }}>
                <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: 12 }}>EXPERIMENT</p>
                <p style={{ margin: 0, fontSize: 16, fontWeight: "bold", color: "#000" }}>
                  {paymentDetails.experimentTitle}
                </p>
              </div>

              <div
                style={{
                  marginBottom: 15,
                  paddingBottom: 15,
                  borderBottom: "1px solid #dee2e6",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span style={{ color: "#666", fontSize: 14 }}>Amount Paid</span>
                <span style={{ fontSize: 18, fontWeight: "bold", color: "#27ae60" }}>
                  ₹{paymentDetails.amount} {paymentDetails.currency}
                </span>
              </div>

              <div
                style={{
                  marginBottom: 15,
                  paddingBottom: 15,
                  borderBottom: "1px solid #dee2e6",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <span style={{ color: "#666", fontSize: 14 }}>Subscription Duration</span>
                <span style={{ fontSize: 14, fontWeight: "bold", color: "#000" }}>
                  {paymentDetails.duration} days
                </span>
              </div>

              <div
                style={{
                  marginBottom: 15,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span style={{ color: "#666", fontSize: 14 }}>Access Until</span>
                <span style={{ fontSize: 14, fontWeight: "bold", color: "#2980b9" }}>
                  {paymentDetails.expiryDate}
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: 25,
                fontSize: 12,
                color: "#666",
                lineHeight: "1.8"
              }}
            >
              <p style={{ margin: "0 0 8px 0" }}>
                <strong>Order ID:</strong> {paymentDetails.orderId}
              </p>
              <p style={{ margin: "0 0 8px 0" }}>
                <strong>Transaction ID:</strong> {paymentDetails.transactionId}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Purchase Date:</strong> {paymentDetails.purchaseDate}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#e8f5e9",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: 25,
                borderLeft: "4px solid #27ae60"
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", color: "#27ae60", fontSize: 13 }}>🔒 Security & Privacy</h4>
              <ul
                style={{
                  margin: 0,
                  padding: "0 0 0 20px",
                  fontSize: 11,
                  color: "#555",
                  lineHeight: "1.6"
                }}
              >
                <li>✓ Encrypted Payment: All transactions are protected by SSL/TLS encryption</li>
                <li>✓ Data Protection: Your personal data is securely stored and never shared</li>
                <li>✓ Verification: You can verify this receipt using your Order ID</li>
                <li>✓ Non-transferable: This subscription is exclusively for the registered user</li>
                <li>✓ Support: Report any unauthorized access at support@virtuallab.com</li>
              </ul>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn success"
                onClick={closePaymentReceipt}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  fontSize: 14,
                  fontWeight: "bold",
                  backgroundColor: "#27ae60",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Start Learning
              </button>
              <button
                className="btn secondary"
                onClick={closePaymentReceipt}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  fontSize: 14,
                  fontWeight: "bold",
                  backgroundColor: "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Download Receipt
              </button>
            </div>

            <div
              style={{
                marginTop: 20,
                padding: "12px",
                backgroundColor: "#fff3cd",
                borderRadius: "5px",
                fontSize: 12,
                color: "#856404",
                borderLeft: "4px solid #ffc107"
              }}
            >
              <strong>Note:</strong> After {paymentDetails.duration} days, you'll need to renew your subscription to continue accessing this experiment.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SortingLab;
