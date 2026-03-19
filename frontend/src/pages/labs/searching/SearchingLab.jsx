import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../Lab.css";
import "../../SortingLab.css";
import SearchingOverview from "./SearchingOverview";
import SearchingSimulation from "./SearchingSimulation";
import SearchingQuiz from "./SearchingQuiz";
import SearchingCoding from "./SearchingCoding";

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
  }
];

const codingProblemByType = {
  linear: {
    title: "Implement linearSearch(arr, target)",
    description:
      "Write a function linearSearch(arr, target) that returns the index of target if found, otherwise returns -1."
  },
  binary: {
    title: "Implement binarySearch(arr, target)",
    description:
      "Write a function binarySearch(arr, target) for a sorted array. It should return the index of target if found, otherwise returns -1."
  }
};

const searchingCodeTemplates = {
  linear: {
    javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
    cpp: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
    c: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
    java: `static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`
  },
  binary: {
    javascript: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }

  return -1;
}`,
    python: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1`,
    cpp: `int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;

    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }

    return -1;
}`,
    c: `int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;

    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }

    return -1;
}`,
    java: `static int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;

    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }

    return -1;
}`
  }
};

const parseArrayInput = (input) =>
  input
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "")
    .map(Number)
    .filter((num) => !Number.isNaN(num));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function SearchingLab() {
  const [searchType, setSearchType] = useState("linear");
  const [arrayInput, setArrayInput] = useState("10, 20, 30, 40, 50");
  const [target, setTarget] = useState("");
  const [array, setArray] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Searching lab initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [lowIndex, setLowIndex] = useState(null);
  const [highIndex, setHighIndex] = useState(null);
  const [midIndex, setMidIndex] = useState(null);

  const quizQuestions = useMemo(
    () => (searchType === "binary" ? binaryQuizQuestions : linearQuizQuestions),
    [searchType]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(searchingCodeTemplates.linear.javascript);
  const [codeResult, setCodeResult] = useState("");

  const targetRef = useRef(null);

  useEffect(() => {
    setArray([]);
    setTarget("");
    setMessage("Searching lab initialized.");
    setExperimentRun(false);
    setIsRunning(false);
    setCurrentIndex(null);
    setFoundIndex(null);
    setLowIndex(null);
    setHighIndex(null);
    setMidIndex(null);
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCodeResult("");
  }, [searchType, quizQuestions.length]);

  useEffect(() => {
    setCode(searchingCodeTemplates[searchType][selectedLanguage]);
    setCodeResult("");
  }, [searchType, selectedLanguage]);

  const loadSample = () => {
    if (isRunning) return;

    if (searchType === "linear") {
      setArrayInput("15, 8, 23, 4, 42, 16, 9");
      setTarget("42");
      setMessage("Loaded sample array for Linear Search.");
    } else {
      setArrayInput("5, 10, 15, 20, 25, 30, 35");
      setTarget("25");
      setMessage("Loaded sample array for Binary Search.");
    }

    setArray([]);
    setCurrentIndex(null);
    setFoundIndex(null);
    setLowIndex(null);
    setHighIndex(null);
    setMidIndex(null);
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

    setCurrentIndex(null);
    setFoundIndex(null);
    setLowIndex(null);
    setHighIndex(null);
    setMidIndex(null);
    setIsRunning(true);
    setExperimentRun(true);

    try {
      if (searchType === "linear") {
        setArray(parsed);
        setMessage(`Starting Linear Search for ${targetValue}...`);
        await sleep(600);

        let found = -1;

        for (let i = 0; i < parsed.length; i++) {
          setCurrentIndex(i);
          setMessage(`Checking index ${i} (value = ${parsed[i]})...`);
          await sleep(700);

          if (parsed[i] === targetValue) {
            found = i;
            setFoundIndex(i);
            setMessage(`Linear Search: Found ${targetValue} at index ${i}.`);
            break;
          }
        }

        if (found === -1) {
          setCurrentIndex(null);
          setMessage(`Linear Search: ${targetValue} not found in the array.`);
        }
      } else {
        const sorted = [...parsed].sort((a, b) => a - b);
        setArray(sorted);
        setMessage(`Starting Binary Search for ${targetValue}... Array sorted automatically.`);
        await sleep(700);

        let low = 0;
        let high = sorted.length - 1;
        let found = -1;

        while (low <= high) {
          const mid = Math.floor((low + high) / 2);

          setLowIndex(low);
          setHighIndex(high);
          setMidIndex(mid);

          setMessage(
            `Checking mid index ${mid} (value = ${sorted[mid]}) with low = ${low}, high = ${high}.`
          );
          await sleep(900);

          if (sorted[mid] === targetValue) {
            found = mid;
            setFoundIndex(mid);
            setMessage(`Binary Search: Found ${targetValue} at index ${mid}.`);
            break;
          }

          if (sorted[mid] < targetValue) {
            setMessage(
              `${sorted[mid]} is less than ${targetValue}. Searching in the right half.`
            );
            await sleep(800);
            low = mid + 1;
          } else {
            setMessage(
              `${sorted[mid]} is greater than ${targetValue}. Searching in the left half.`
            );
            await sleep(800);
            high = mid - 1;
          }
        }

        if (found === -1) {
          setLowIndex(null);
          setHighIndex(null);
          setMidIndex(null);
          setMessage(`Binary Search: ${targetValue} not found.`);
        }
      }

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: `${searchType}-search`, time: Date.now() })
      );
    } finally {
      setIsRunning(false);
    }
  };

  const reset = () => {
    if (isRunning) return;

    setArray([]);
    setArrayInput("");
    setTarget("");
    setCurrentIndex(null);
    setFoundIndex(null);
    setLowIndex(null);
    setHighIndex(null);
    setMidIndex(null);
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

  const runCode = () => {
    if (selectedLanguage !== "javascript") {
      setCodeResult(
        `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      );
      return;
    }

    try {
      let result;

      if (searchType === "linear") {
        // eslint-disable-next-line no-new-func
        const fn = new Function("arr", "target", `${code}; return linearSearch(arr, target);`);
        result = fn([7, 14, 21, 28], 21);
      } else {
        // eslint-disable-next-line no-new-func
        const fn = new Function("arr", "target", `${code}; return binarySearch(arr, target);`);
        result = fn([5, 10, 15, 20, 25], 20);
      }

      setCodeResult(`Output: ${JSON.stringify(result)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  const codingProblem =
    searchType === "binary" ? codingProblemByType.binary : codingProblemByType.linear;

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Searching Algorithms</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Search Type</h2>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="lab-select"
          style={{ minWidth: "240px" }}
          disabled={isRunning}
        >
          <option value="linear">Linear Search</option>
          <option value="binary">Binary Search</option>
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
          {activeSection === "overview" && <SearchingOverview searchType={searchType} />}

          {activeSection === "simulation" && (
            <SearchingSimulation
              searchType={searchType}
              arrayInput={arrayInput}
              setArrayInput={setArrayInput}
              target={target}
              setTarget={setTarget}
              runSearch={runSearch}
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
            />
          )}

          {activeSection === "coding" && (
            <SearchingCoding
              codingProblem={codingProblem}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              code={code}
              setCode={setCode}
              codeResult={codeResult}
              runCode={runCode}
              searchType={searchType}
            />
          )}
        </main>
      </div>
    </div>
  );
}