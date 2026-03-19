import React, { useEffect, useMemo, useRef, useState } from "react";
import "./SortingLab.css"
import "./Lab.css";
import StackOverview from "./labs/stack/StackOverview.jsx";
import StackSimulation from "./labs/stack/StackSimulation.jsx";
import StackQuiz from "./labs/stack/StackQuiz.jsx";
import StackCoding from "./labs/stack/StackCoding.jsx";

const stackQuizQuestions = [
  {
    question: "Which principle does a stack follow?",
    options: ["FIFO", "LIFO", "Round Robin", "Priority"],
    correct: 1
  },
  {
    question: "Which stack operation removes the top element?",
    options: ["Push", "Peek", "Pop", "Insert"],
    correct: 2
  },
  {
    question: "What is the time complexity of push in a stack?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correct: 0
  }
];

const stackCodeTemplates = {
  javascript: `function push(stack, value) {
  stack.push(value);
  return stack;
}`,
  python: `def push(stack, value):
    stack.append(value)
    return stack`,
  cpp: `#include <vector>
using namespace std;

vector<int> push(vector<int> stack, int value) {
    stack.push_back(value);
    return stack;
}`,
  c: `#include <stdio.h>

int push(int stack[], int *top, int value) {
    (*top)++;
    stack[*top] = value;
    return stack[*top];
}`,
  java: `import java.util.*;

static List<Integer> push(List<Integer> stack, int value) {
    stack.add(value);
    return stack;
}`
};

const codingProblem = {
  title: "Implement push(stack, value)",
  description:
    "Write a function push(stack, value) that inserts value at the top of the stack and returns the updated stack."
};

export default function StackLab() {
  const [stack, setStack] = useState([]);
  const [input, setInput] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Stack initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [maxSize, setMaxSize] = useState(5);

  const quizQuestions = useMemo(() => stackQuizQuestions, []);

  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(stackCodeTemplates.javascript);
  const [codeResult, setCodeResult] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [quizQuestions.length]);

  useEffect(() => {
    setCode(stackCodeTemplates[selectedLanguage]);
    setCodeResult("");
  }, [selectedLanguage]);

  const pushElement = () => {
    if (!input.trim()) {
      setMessage("Please enter a value.");
      return;
    }

    if (stack.length >= maxSize) {
      setMessage(`Stack Overflow! Max size is ${maxSize}.`);
      return;
    }

    const value = input.trim();
    setStack((prev) => [...prev, value]);
    setMessage(`Pushed ${value} onto the stack.`);
    setInput("");
    setExperimentRun(true);
    inputRef.current?.focus();

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: "stack", time: Date.now() })
    );
  };

  const popElement = () => {
    if (stack.length === 0) {
      setMessage("Stack Underflow! Stack is empty.");
      return;
    }

    const removed = stack[stack.length - 1];
    setStack((prev) => prev.slice(0, -1));
    setMessage(`Popped ${removed} from the stack.`);
    setExperimentRun(true);
  };

  const peekElement = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty. No top element.");
      return;
    }

    const top = stack[stack.length - 1];
    setMessage(`Top element is ${top}.`);
    setExperimentRun(true);
  };

  const checkIsEmpty = () => {
    setMessage(stack.length === 0 ? "Stack is empty." : "Stack is not empty.");
    setExperimentRun(true);
  };

  const showSize = () => {
    setMessage(`Current stack size is ${stack.length}.`);
    setExperimentRun(true);
  };

  const reset = () => {
    setStack([]);
    setInput("");
    setMessage("Stack reset.");
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
      experiment: "stack",
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
      const fn = new Function("stack", "value", `${code}; return push(stack, value);`);
      const result = fn([10, 20], 30);
      setCodeResult(`Output: ${JSON.stringify(result)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Stack</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Stack Configuration</h2>

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
              Max Size
            </label>
            <input
              type="number"
              min="1"
              value={maxSize}
              onChange={(e) => setMaxSize(Number(e.target.value) || 1)}
              style={{ color: "#ffffff" }}
            />
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
          {activeSection === "overview" && <StackOverview />}

          {activeSection === "simulation" && (
            <StackSimulation
              stack={stack}
              input={input}
              setInput={setInput}
              pushElement={pushElement}
              popElement={popElement}
              peekElement={peekElement}
              checkIsEmpty={checkIsEmpty}
              showSize={showSize}
              reset={reset}
              message={message}
              inputRef={inputRef}
              maxSize={maxSize}
            />
          )}

          {activeSection === "quiz" && (
            <StackQuiz
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
            <StackCoding
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