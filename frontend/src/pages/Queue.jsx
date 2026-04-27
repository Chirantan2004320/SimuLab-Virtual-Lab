import React, { useRef, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu
} from "lucide-react";
import "./Lab.css";
import "./SortingLab.css";

import QueueOverview from "./labs/queue/QueueOverview";
import QueueSimulation from "./labs/queue/QueueSimulation";
import QueueQuiz from "./labs/queue/QueueQuiz";
import QueueCoding from "./labs/queue/QueueCoding";

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

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
    options: ["rear + 1", "(rear + 1) / size", "(rear + 1) % size", "rear - 1"],
    correct: 2
  },
  {
    question: "A circular queue is full when:",
    options: ["front === rear", "count === capacity", "rear === 0", "front === -1"],
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [code, setCode] = useState(queueCodeTemplates.normal.javascript);
  const [codeResult, setCodeResult] = useState("");
  const [traversalActiveIndex, setTraversalActiveIndex] = useState(null);

  const [operationStats, setOperationStats] = useState({
    enqueue: 0,
    dequeue: 0,
    peek: 0,
    traverse: 0
  });

  const inputRef = useRef();

  const quizQuestions =
    queueType === "circular" ? circularQuizQuestions : normalQuizQuestions;

  const codingProblems =
    queueType === "circular" ? codingProblemBank.circular : codingProblemBank.normal;

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

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 52
      : activeSection === "quiz"
      ? 78
      : 95;

  const visibleSize = queueType === "normal" ? queue.length : count;
  const queueModeLabel = queueType === "circular" ? "Circular Queue" : "Normal Queue";

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
    setOperationStats({
      enqueue: 0,
      dequeue: 0,
      peek: 0,
      traverse: 0
    });
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

      const valueToAdd = input;

      setAnimating(true);
      setTimeout(() => {
        setQueue((prev) => [...prev, valueToAdd]);
        setLog((prev) => [`ENQUEUE: ${valueToAdd} added to queue`, ...prev].slice(0, 10));
        setInput("");
        setExperimentRun(true);
        setOperationStats((prev) => ({ ...prev, enqueue: prev.enqueue + 1 }));
        setAnimating(false);
        if (inputRef.current) inputRef.current.focus();
      }, animDuration);
    } else {
      if (count >= queueSize) {
        setWarning("Circular Queue Overflow.");
        setTimeout(() => setWarning(""), 2000);
        return;
      }

      const valueToAdd = input;

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

        updated[newRear] = valueToAdd;

        setCircularQueue(updated);
        setFront(newFront);
        setRear(newRear);
        setCount((prev) => prev + 1);
        setLog((prev) =>
          [`CIRCULAR ENQUEUE: ${valueToAdd} inserted at index ${newRear}`, ...prev].slice(0, 10)
        );
        setInput("");
        setExperimentRun(true);
        setOperationStats((prev) => ({ ...prev, enqueue: prev.enqueue + 1 }));
        setAnimating(false);
        if (inputRef.current) inputRef.current.focus();
      }, animDuration);
    }
  };

  const dequeue = () => {
    if (queueType === "normal") {
      if (queue.length === 0) {
        setWarning("Queue Underflow. Cannot remove from empty queue.");
        setLog((prev) => ["DEQUEUE failed: Queue empty", ...prev].slice(0, 10));
        setTimeout(() => setWarning(""), 2000);
        return;
      }

      setAnimating(true);
      setTimeout(() => {
        const val = queue[0];
        setQueue((prev) => prev.slice(1));
        setLog((prev) => [`DEQUEUE: ${val} removed from queue`, ...prev].slice(0, 10));
        setExperimentRun(true);
        setOperationStats((prev) => ({ ...prev, dequeue: prev.dequeue + 1 }));
        setAnimating(false);
      }, animDuration);
    } else {
      if (count === 0 || front === -1) {
        setWarning("Circular Queue Underflow.");
        setLog((prev) => ["DEQUEUE failed: Circular Queue empty", ...prev].slice(0, 10));
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
        setLog((prev) =>
          [`CIRCULAR DEQUEUE: ${removedValue} removed from index ${front}`, ...prev].slice(0, 10)
        );
        setExperimentRun(true);
        setOperationStats((prev) => ({ ...prev, dequeue: prev.dequeue + 1 }));
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

      setLog((prev) =>
        [`CIRCULAR PEEK: Front element is ${circularQueue[front]} at index ${front}`, ...prev].slice(0, 10)
      );
    }

    setExperimentRun(true);
    setOperationStats((prev) => ({ ...prev, peek: prev.peek + 1 }));
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
        setOperationStats((prev) => ({ ...prev, traverse: prev.traverse + 1 }));
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
        setOperationStats((prev) => ({ ...prev, traverse: prev.traverse + 1 }));
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
    setOperationStats({
      enqueue: 0,
      dequeue: 0,
      peek: 0,
      traverse: 0
    });
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

  const analyzeCode = (problemIndex, language) => {
  const analysisData = {
    code,
    problemIndex,
    queueType,
    language
  };

  localStorage.setItem("vlab_code_analysis", JSON.stringify(analysisData));
  alert("Code analysis request sent to AI Assistant. Check the AI chat for feedback!");
};

const correctCode = (problemIndex, language) => {
  const correctionData = {
    code,
    problemIndex,
    queueType,
    language,
    action: "correct"
  };

  localStorage.setItem("vlab_code_correction", JSON.stringify(correctionData));
  alert("Code correction request sent to AI Assistant. Check the AI chat for the corrected code!");
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
            <h1 className="er-page-title">Queue Data Structure</h1>
            <p className="er-page-subtitle">
              Explore FIFO queue operations, circular queue wrap-around, complexity, quiz, and coding practice.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Queue Configuration</h2>
              <p>Select queue type and capacity before running queue operations.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>{queueModeLabel}</strong>
                <span>
                  Current size: {visibleSize}/{queueSize}. Enqueue and dequeue run in O(1).
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
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

            <div>
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

          <div className="er-chip-row">
            <button className="er-chip active">Type = {queueModeLabel}</button>
            <button className="er-chip active">Used = {visibleSize}/{queueSize}</button>
            <button className="er-chip active">Enqueue = O(1)</button>
            <button className="er-chip active">Dequeue = O(1)</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Experiment Run" : "Not Started"}
            </button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <QueueOverview queueType={queueType} />}

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
                operationStats={operationStats}
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
                <div style={{ marginBottom: 18 }}>
                  <label className="sorting-label">Problem</label>
                  <select
                    value={selectedProblemIndex}
                    onChange={(e) => setSelectedProblemIndex(Number(e.target.value))}
                    className="sorting-select"
                    style={{ maxWidth: 420 }}
                  >
                    {codingProblems.map((problem, index) => (
                      <option key={index} value={index}>
                        Problem {index + 1}: {problem.title}
                      </option>
                    ))}
                  </select>
                </div>

                <QueueCoding
                    codingProblems={codingProblems}
                    queueCodeTemplates={queueCodeTemplates}
                    queueType={queueType}
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                    code={code}
                    setCode={setCode}
                    codeResult={codeResult}
                    runCode={runCode}
                    analyzeCode={analyzeCode}
                    correctCode={correctCode}
                />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}