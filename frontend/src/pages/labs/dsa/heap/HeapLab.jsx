import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../../../styles/Lab.css";

import HeapOverview from "./HeapOverview";
import HeapSimulation from "./HeapSimulation";
import HeapQuiz from "./HeapQuiz";
import HeapCoding from "./HeapCoding";

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

const codingProblem = {
  title: "Implement insertHeap(heap, value, isMinHeap)",
  description:
    "Write a function insertHeap(heap, value, isMinHeap) that inserts a value into a heap and restores the heap property."
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(heapCodeTemplates.javascript);
  const [codeResult, setCodeResult] = useState("");

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
  }, [heapType, quizQuestions.length]);

  useEffect(() => {
    setCode(heapCodeTemplates[selectedLanguage]);
    setCodeResult("");
  }, [selectedLanguage]);

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

  const runCode = () => {
    if (selectedLanguage !== "javascript") {
      setCodeResult(
        `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      );
      return;
    }

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(
        "heap",
        "value",
        "isMinHeap",
        `${code}; return insertHeap(heap, value, isMinHeap);`
      );
      const result = fn(
        heapType === "min" ? [10, 20, 15, 40] : [90, 70, 80, 30],
        35,
        heapType === "min"
      );
      setCodeResult(`Output: ${JSON.stringify(result)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Heap</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Heap Settings</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                color: "#e5e7eb",
                fontWeight: 600
              }}
            >
              Heap Type
            </label>
            <select
              value={heapType}
              onChange={(e) => setHeapType(e.target.value)}
              className="lab-select"
              style={{ minWidth: "200px" }}
              disabled={isRunning}
            >
              <option value="max">Max Heap</option>
              <option value="min">Min Heap</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                color: "#e5e7eb",
                fontWeight: 600
              }}
            >
              Animation Speed
            </label>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="lab-select"
              style={{ minWidth: "200px" }}
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
            />
          )}

          {activeSection === "coding" && (
            <HeapCoding
              codingProblem={codingProblem}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              code={code}
              setCode={setCode}
              codeResult={codeResult}
              runCode={runCode}
            />
          )}
        </main>
      </div>
    </div>
  );
}