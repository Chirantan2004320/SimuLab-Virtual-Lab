import React, { useRef, useState } from "react";
import { FlaskConical } from "lucide-react";
import "./Lab.css";
import "./SortingLab.css";

import QueueOverview from "./labs/queue/QueueOverview";
import QueueSimulation from "./labs/queue/QueueSimulation";
import QueueQuiz from "./labs/queue/QueueQuiz";
import QueueCoding from "./labs/queue/QueueCoding";

const normalQuizQuestions = [
  {
    question: "Which principle does a Queue follow?",
    options: ["LIFO", "FIFO", "Random", "Priority"],
    correct: 1
  },
  {
    question: "What is the operation to remove from a queue?",
    options: ["push", "pop", "dequeue", "peek"],
    correct: 2
  },
  {
    question: "Which element is removed first in a queue?",
    options: ["Last inserted", "Middle element", "First inserted", "Random element"],
    correct: 2
  },
  {
    question: "In a normal queue, insertion happens at:",
    options: ["Front", "Rear", "Middle", "Top"],
    correct: 1
  },
  {
    question: "In a normal queue, deletion happens at:",
    options: ["Rear", "Front", "Middle", "Bottom"],
    correct: 1
  },
  {
    question: "A queue becomes empty when:",
    options: ["Rear is full", "There are no elements left", "Front > Rear always", "Queue size is fixed"],
    correct: 1
  }
];

const circularQuizQuestions = [
  {
    question: "What is the main advantage of a circular queue?",
    options: [
      "It sorts data automatically",
      "It avoids memory wastage",
      "It behaves like a stack",
      "It removes the rear element first"
    ],
    correct: 1
  },
  {
    question: "In a circular queue, rear is updated using:",
    options: [
      "rear + 1",
      "(rear + 1) / size",
      "(rear + 1) % size",
      "rear - 1"
    ],
    correct: 2
  },
  {
    question: "A circular queue is full when:",
    options: [
      "front === rear",
      "count === capacity",
      "rear === 0",
      "front === -1"
    ],
    correct: 1
  },
  {
    question: "Which arithmetic helps circular queue wrap around?",
    options: ["Subtraction", "Division", "Modulo", "Multiplication"],
    correct: 2
  },
  {
    question: "If front is 5 and size is 8, next front after dequeue becomes:",
    options: ["6", "7", "0", "(5 + 1) % 8"],
    correct: 3
  },
  {
    question: "Circular queue is especially useful in:",
    options: ["Recursive stack calls", "Buffer management", "Binary trees", "Heap sorting"],
    correct: 1
  }
];

const codingProblemBank = {
  normal: [
    {
      title: "Implement enqueue(arr, value, maxSize)",
      description:
        "Write a function enqueue(arr, value, maxSize) that adds value to the rear of the queue if there is space. If full, return 'Overflow'."
    },
    {
      title: "Implement dequeue(arr)",
      description:
        "Write a function dequeue(arr) that removes the front element from the queue and returns the updated queue. If empty, return 'Underflow'."
    },
    {
      title: "Implement peek(arr)",
      description:
        "Write a function peek(arr) that returns the front element of the queue without removing it. If empty, return 'Empty'."
    }
  ],
  circular: [
    {
      title: "Implement circularEnqueue(arr, rear, count, value, maxSize)",
      description:
        "Write a function circularEnqueue(arr, rear, count, value, maxSize) that inserts value into a circular queue and returns updated arr, rear, and count. If full, return 'Overflow'."
    },
    {
      title: "Implement circularDequeue(arr, front, count, maxSize)",
      description:
        "Write a function circularDequeue(arr, front, count, maxSize) that removes the front value and returns updated arr, front, and count. If empty, return 'Underflow'."
    },
    {
      title: "Implement circularPeek(arr, front, count)",
      description:
        "Write a function circularPeek(arr, front, count) that returns the front element of the circular queue. If empty, return 'Empty'."
    }
  ]
};

const queueCodeTemplates = {
  normal: {
    javascript: `function enqueue(arr, value, maxSize) {
  if (arr.length >= maxSize) return "Overflow";
  arr.push(value);
  return arr;
}`,
    python: `def enqueue(arr, value, max_size):
    if len(arr) >= max_size:
        return "Overflow"
    arr.append(value)
    return arr`,
    cpp: `#include <vector>
#include <string>
using namespace std;

vector<int> enqueue(vector<int> arr, int value, int maxSize) {
    if ((int)arr.size() >= maxSize) return {};
    arr.push_back(value);
    return arr;
}`,
    c: `#include <stdio.h>

int enqueue(int arr[], int *size, int value, int maxSize) {
    if (*size >= maxSize) return -1;
    arr[*size] = value;
    (*size)++;
    return 0;
}`,
    java: `import java.util.*;

public class Main {
    public static Object enqueue(List<Integer> arr, int value, int maxSize) {
        if (arr.size() >= maxSize) return "Overflow";
        arr.add(value);
        return arr;
    }
}`
  },
  circular: {
    javascript: `function circularEnqueue(arr, rear, count, value, maxSize) {
  if (count >= maxSize) return "Overflow";
  rear = (rear + 1) % maxSize;
  arr[rear] = value;
  count++;
  return { arr, rear, count };
}`,
    python: `def circular_enqueue(arr, rear, count, value, max_size):
    if count >= max_size:
        return "Overflow"
    rear = (rear + 1) % max_size
    arr[rear] = value
    count += 1
    return {"arr": arr, "rear": rear, "count": count}`,
    cpp: `#include <vector>
using namespace std;

struct Result {
    vector<int> arr;
    int rear;
    int count;
};

Result circularEnqueue(vector<int> arr, int rear, int count, int value, int maxSize) {
    rear = (rear + 1) % maxSize;
    arr[rear] = value;
    count++;
    return {arr, rear, count};
}`,
    c: `#include <stdio.h>

int circularEnqueue(int arr[], int *rear, int *count, int value, int maxSize) {
    if (*count >= maxSize) return -1;
    *rear = (*rear + 1) % maxSize;
    arr[*rear] = value;
    (*count)++;
    return 0;
}`,
    java: `import java.util.*;

public class Main {
    public static Object circularEnqueue(List<Integer> arr, int rear, int count, int value, int maxSize) {
        if (count >= maxSize) return "Overflow";
        rear = (rear + 1) % maxSize;
        arr.set(rear, value);
        count++;
        Map<String, Object> result = new HashMap<>();
        result.put("arr", arr);
        result.put("rear", rear);
        result.put("count", count);
        return result;
    }
}`
  }
};

export default function QueueLab() {
  const [queueType, setQueueType] = useState("normal");
  const [queueSize, setQueueSize] = useState(8);

  const [queue, setQueue] = useState([]);
  const [circularQueue, setCircularQueue] = useState(new Array(8).fill(null));
  const [front, setFront] = useState(-1);
  const [rear, setRear] = useState(-1);
  const [count, setCount] = useState(0);

  const [input, setInput] = useState("");
  const [log, setLog] = useState(["Queue initialized."]);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);
  const [warning, setWarning] = useState("");
  const [animating, setAnimating] = useState(false);
  const [animDuration, setAnimDuration] = useState(400);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [code, setCode] = useState(queueCodeTemplates.normal.javascript);
  const [codeResult, setCodeResult] = useState("");
  const [traversalActiveIndex, setTraversalActiveIndex] = useState(null);

  const inputRef = useRef();

  const quizQuestions =
    queueType === "circular" ? circularQuizQuestions : normalQuizQuestions;

  const codingProblems =
    queueType === "circular"
      ? codingProblemBank.circular
      : codingProblemBank.normal;

  const codingProblem = codingProblems[selectedProblemIndex];

  React.useEffect(() => {
    setCode(queueCodeTemplates[queueType][selectedLanguage]);
    setCodeResult("");
  }, [selectedLanguage, queueType]);

  React.useEffect(() => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [queueType, selectedLanguage, quizQuestions.length]);

  React.useEffect(() => {
    setSelectedProblemIndex(0);
  }, [queueType]);

  const updateQueueSize = (value) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 3 || parsed > 20) return;

    setQueueSize(parsed);
    setQueue([]);
    setCircularQueue(new Array(parsed).fill(null));
    setFront(-1);
    setRear(-1);
    setCount(0);
    setInput("");
    setLog([`Queue size changed to ${parsed}. Queue reset.`]);
    setWarning("");
    setAnimating(false);
    setTraversalActiveIndex(null);
  };

  const enqueue = () => {
    if (!input.trim()) {
      setWarning("Please enter a value.");
      setTimeout(() => setWarning(""), 2000);
      return;
    }

    if (queueType === "normal") {
      if (queue.length >= queueSize) {
        setWarning("Queue Overflow. Cannot add more elements.");
        setTimeout(() => setWarning(""), 2000);
        return;
      }

      setAnimating(true);
      setTimeout(() => {
        setQueue((prev) => [...prev, input]);
        setLog((prev) => [`ENQUEUE: ${input} added to queue`, ...prev].slice(0, 10));
        setInput("");
        setExperimentRun(true);
        setAnimating(false);
        if (inputRef.current) inputRef.current.focus();
      }, animDuration);
    } else {
      if (count >= queueSize) {
        setWarning("Circular Queue Overflow.");
        setTimeout(() => setWarning(""), 2000);
        return;
      }

      setAnimating(true);
      setTimeout(() => {
        const updated = [...circularQueue];
        let newFront = front;
        let newRear = rear;

        if (count === 0) {
          newFront = 0;
          newRear = 0;
        } else {
          newRear = (rear + 1) % queueSize;
        }

        updated[newRear] = input;

        setCircularQueue(updated);
        setFront(newFront);
        setRear(newRear);
        setCount((prev) => prev + 1);
        setLog((prev) => [`CIRCULAR ENQUEUE: ${input} inserted at index ${newRear}`, ...prev].slice(0, 10));
        setInput("");
        setExperimentRun(true);
        setAnimating(false);
        if (inputRef.current) inputRef.current.focus();
      }, animDuration);
    }
  };

  const dequeue = () => {
    if (queueType === "normal") {
      if (queue.length === 0) {
        setWarning("Queue Underflow. Cannot remove from empty queue.");
        setLog((prev) => [`DEQUEUE failed: Queue empty`, ...prev].slice(0, 10));
        setTimeout(() => setWarning(""), 2000);
        return;
      }

      setAnimating(true);
      setTimeout(() => {
        const val = queue[0];
        setQueue((prev) => prev.slice(1));
        setLog((prev) => [`DEQUEUE: ${val} removed from queue`, ...prev].slice(0, 10));
        setExperimentRun(true);
        setAnimating(false);
      }, animDuration);
    } else {
      if (count === 0 || front === -1) {
        setWarning("Circular Queue Underflow.");
        setLog((prev) => [`DEQUEUE failed: Circular Queue empty`, ...prev].slice(0, 10));
        setTimeout(() => setWarning(""), 2000);
        return;
      }

      setAnimating(true);
      setTimeout(() => {
        const updated = [...circularQueue];
        const removedValue = updated[front];
        updated[front] = null;

        if (count === 1) {
          setFront(-1);
          setRear(-1);
        } else {
          setFront((prev) => (prev + 1) % queueSize);
        }

        setCircularQueue(updated);
        setCount((prev) => prev - 1);
        setLog((prev) => [`CIRCULAR DEQUEUE: ${removedValue} removed from index ${front}`, ...prev].slice(0, 10));
        setExperimentRun(true);
        setAnimating(false);
      }, animDuration);
    }
  };

  const peekFront = () => {
    if (queueType === "normal") {
      if (queue.length === 0) {
        setWarning("Queue is empty. Nothing to peek.");
        setTimeout(() => setWarning(""), 2000);
        return;
      }

      setLog((prev) => [`PEEK: Front element is ${queue[0]}`, ...prev].slice(0, 10));
    } else {
      if (count === 0 || front === -1) {
        setWarning("Circular Queue is empty. Nothing to peek.");
        setTimeout(() => setWarning(""), 2000);
        return;
      }

      setLog((prev) => [`CIRCULAR PEEK: Front element is ${circularQueue[front]} at index ${front}`, ...prev].slice(0, 10));
    }

    setExperimentRun(true);
  };

  const traverseQueue = () => {
    if (queueType === "normal") {
      if (queue.length === 0) {
        setWarning("Queue is empty. Nothing to traverse.");
        setTimeout(() => setWarning(""), 2000);
        return;
      }

      const indices = queue.map((_, i) => i);
      const values = queue.join(" → ");

      setAnimating(true);
      indices.forEach((index, step) => {
        setTimeout(() => {
          setTraversalActiveIndex(index);
        }, step * animDuration);
      });

      setTimeout(() => {
        setTraversalActiveIndex(null);
        setLog((prev) => [`TRAVERSAL: ${values}`, ...prev].slice(0, 10));
        setExperimentRun(true);
        setAnimating(false);
      }, indices.length * animDuration);
    } else {
      if (count === 0 || front === -1) {
        setWarning("Circular Queue is empty. Nothing to traverse.");
        setTimeout(() => setWarning(""), 2000);
        return;
      }

      const indices = [];
      const values = [];

      for (let i = 0; i < count; i++) {
        const index = (front + i) % queueSize;
        indices.push(index);
        values.push(circularQueue[index]);
      }

      setAnimating(true);
      indices.forEach((index, step) => {
        setTimeout(() => {
          setTraversalActiveIndex(index);
        }, step * animDuration);
      });

      setTimeout(() => {
        setTraversalActiveIndex(null);
        setLog((prev) => [`CIRCULAR TRAVERSAL: ${values.join(" → ")}`, ...prev].slice(0, 10));
        setExperimentRun(true);
        setAnimating(false);
      }, indices.length * animDuration);
    }
  };

  const clearLog = () => {
    setLog(["Log cleared."]);
  };

  const reset = () => {
    setQueue([]);
    setCircularQueue(new Array(queueSize).fill(null));
    setFront(-1);
    setRear(-1);
    setCount(0);
    setInput("");
    setLog(["Queue initialized."]);
    setWarning("");
    setAnimating(false);
    setTraversalActiveIndex(null);
  };

  const handleSpeedChange = (e) => {
    setAnimDuration(Number(e.target.value));
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
      experiment: queueType === "circular" ? "circular-queue" : "queue",
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

      if (queueType === "normal") {
        const fn = new Function(
          "arr",
          "value",
          "maxSize",
          `${code}; return enqueue(arr, value, maxSize);`
        );
        result = fn([10, 20], 30, 5);
      } else {
        const fn = new Function(
          "arr",
          "rear",
          "count",
          "value",
          "maxSize",
          `${code}; return circularEnqueue(arr, rear, count, value, maxSize);`
        );
        result = fn([10, 20, null, null, null], 1, 2, 30, 5);
      }

      setCodeResult(`Output: ${JSON.stringify(result)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  const displayQueue =
    queueType === "normal"
      ? Array.from({ length: queueSize }, (_, i) => ({
          value: queue[i] ?? null,
          isFront: queue.length > 0 && i === 0,
          isRear: queue.length > 0 && i === queue.length - 1
        }))
      : circularQueue.map((value, i) => ({
          value,
          isFront: count > 0 && i === front,
          isRear: count > 0 && i === rear
        }));

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
              Interactive Queue Experiment
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            Queue Data Structure
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
            Explore queue operations visually through theory, simulation, quiz, and coding practice.
          </p>
        </div>

        <section className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Queue Setup</h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="sorting-label">Queue Type</label>
              <select
                value={queueType}
                onChange={(e) => setQueueType(e.target.value)}
                className="sorting-select"
              >
                <option value="normal">Normal Queue</option>
                <option value="circular">Circular Queue</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="sorting-label">Queue Size</label>
              <input
                type="number"
                min="3"
                max="20"
                value={queueSize}
                onChange={(e) => updateQueueSize(e.target.value)}
                className="sorting-input"
              />
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
              {activeSection === "overview" && (
                <QueueOverview queueType={queueType} />
              )}

              {activeSection === "simulation" && (
                <QueueSimulation
                  queueType={queueType}
                  queue={queueType === "normal" ? queue : circularQueue}
                  displayQueue={displayQueue}
                  front={front}
                  rear={rear}
                  count={count}
                  input={input}
                  setInput={setInput}
                  log={log}
                  warning={warning}
                  animating={animating}
                  animDuration={animDuration}
                  handleSpeedChange={handleSpeedChange}
                  enqueue={enqueue}
                  dequeue={dequeue}
                  peekFront={peekFront}
                  traverseQueue={traverseQueue}
                  clearLog={clearLog}
                  reset={reset}
                  QUEUE_SIZE={queueSize}
                  inputRef={inputRef}
                  traversalActiveIndex={traversalActiveIndex}
                />
              )}

              {activeSection === "quiz" && (
                <QueueQuiz
                  queueType={queueType}
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
                <div>
                  <div style={{ marginBottom: "18px" }}>
                    <label className="sorting-label">Problem</label>
                    <select
                      value={selectedProblemIndex}
                      onChange={(e) => setSelectedProblemIndex(Number(e.target.value))}
                      className="sorting-select"
                      style={{ maxWidth: "360px" }}
                    >
                      {codingProblems.map((problem, index) => (
                        <option key={index} value={index}>
                          Problem {index + 1}: {problem.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <QueueCoding
                    codingProblem={codingProblem}
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                    code={code}
                    setCode={setCode}
                    codeResult={codeResult}
                    runCode={runCode}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}