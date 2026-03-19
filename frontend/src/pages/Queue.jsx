import React, { useRef, useState } from "react";
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
    question:
      "What is the time complexity of enqueue in a simple array-based queue (amortized)?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correct: 0
  },
  {
    question: "What is the operation to remove from a queue?",
    options: ["push", "pop", "dequeue", "peek"],
    correct: 2
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
  }
];

const QUEUE_SIZE = 8;

const codingProblemByType = {
  normal: {
    title: "Implement enqueue(arr, value, maxSize)",
    description:
      "Write a function enqueue(arr, value, maxSize) that adds value to the end of the queue array if there is space, and returns the updated array. If the queue is full, return the string 'Overflow'."
  },
  circular: {
    title: "Implement circularEnqueue(arr, rear, count, value, maxSize)",
    description:
      "Write a function circularEnqueue(arr, rear, count, value, maxSize) that inserts value into a circular queue and returns an object with updated arr, rear, and count. If full, return 'Overflow'."
  }
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

  const [queue, setQueue] = useState([]);
  const [circularQueue, setCircularQueue] = useState(
    new Array(QUEUE_SIZE).fill(null)
  );
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
  const [code, setCode] = useState(queueCodeTemplates.normal.javascript);
  const [codeResult, setCodeResult] = useState("");

  const inputRef = useRef();

  const quizQuestions =
    queueType === "circular" ? circularQuizQuestions : normalQuizQuestions;

  const codingProblem =
    queueType === "circular"
      ? codingProblemByType.circular
      : codingProblemByType.normal;

  React.useEffect(() => {
    setCode(queueCodeTemplates[queueType][selectedLanguage]);
    setCodeResult("");
  }, [selectedLanguage, queueType]);

  React.useEffect(() => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [queueType,selectedLanguage, quizQuestions.length]);

  const enqueue = () => {
    if (!input.trim()) {
      setWarning("Please enter a value!");
      setTimeout(() => setWarning(""), 2000);
      return;
    }

    if (queueType === "normal") {
      if (queue.length >= QUEUE_SIZE) {
        setWarning("Queue Overflow! Cannot add more elements.");
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
      if (count >= QUEUE_SIZE) {
        setWarning("Circular Queue Overflow!");
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
          newRear = (rear + 1) % QUEUE_SIZE;
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
        setWarning("Queue Underflow! Cannot remove from empty queue.");
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
        setWarning("Circular Queue Underflow!");
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
          setFront((prev) => (prev + 1) % QUEUE_SIZE);
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

  const clearLog = () => {
    setLog(["Log cleared."]);
  };

  const reset = () => {
    setQueue([]);
    setCircularQueue(new Array(QUEUE_SIZE).fill(null));
    setFront(-1);
    setRear(-1);
    setCount(0);
    setInput("");
    setLog(["Queue initialized."]);
    setWarning("");
    setAnimating(false);
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
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "arr",
          "value",
          "maxSize",
          `${code}; return enqueue(arr, value, maxSize);`
        );
        result = fn([10, 20], 30, 5);
      } else {
        // eslint-disable-next-line no-new-func
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
      ? queue.map((value, i) => ({
          value,
          isFront: i === 0,
          isRear: i === queue.length - 1
        }))
      : circularQueue.map((value, i) => ({
          value,
          isFront: count > 0 && i === front,
          isRear: count > 0 && i === rear
        }));

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Queue Data Structure</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Queue Type</h2>
        <select
          value={queueType}
          onChange={(e) => setQueueType(e.target.value)}
          className="lab-select"
          style={{ minWidth: "220px" }}
        >
          <option value="normal">Normal Queue</option>
          <option value="circular">Circular Queue</option>
        </select>
      </section>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
          <button
            className={`sorting-sidebar-item ${
              activeSection === "overview" ? "active" : ""
            }`}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </button>

          <button
            className={`sorting-sidebar-item ${
              activeSection === "simulation" ? "active" : ""
            }`}
            onClick={() => setActiveSection("simulation")}
          >
            Simulation
          </button>

          <button
            className={`sorting-sidebar-item ${
              activeSection === "quiz" ? "active" : ""
            }`}
            onClick={() => setActiveSection("quiz")}
          >
            Quiz
          </button>

          <button
            className={`sorting-sidebar-item ${
              activeSection === "coding" ? "active" : ""
            }`}
            onClick={() => setActiveSection("coding")}
          >
            Coding
          </button>
        </aside>

        <main className="sorting-content">
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
              clearLog={clearLog}
              reset={reset}
              QUEUE_SIZE={QUEUE_SIZE}
              inputRef={inputRef}
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
            <QueueCoding
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