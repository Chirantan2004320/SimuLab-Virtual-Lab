import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlaskConical } from "lucide-react";
import "./SortingLab.css";
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
  },
  {
    question: "Which operation is used to view the top element without removing it?",
    options: ["Pop", "Peek", "Push", "Traverse"],
    correct: 1
  },
  {
    question: "What happens when you try to push into a full stack?",
    options: ["Underflow", "Overflow", "Peek", "Shift"],
    correct: 1
  },
  {
    question: "Which of the following is a common application of a stack?",
    options: [
      "Printer queue",
      "CPU scheduling",
      "Undo operation",
      "Round robin processing"
    ],
    correct: 2
  }
];

const problemBank = [
  {
    id: 1,
    title: "Implement push(stack, value)",
    description:
      "Write a function push(stack, value) that inserts value at the top of the stack and returns the updated stack.",
    functionName: "push",
    tests: [
      { input: [[10, 20], 30], expected: [10, 20, 30] },
      { input: [[], 5], expected: [5] },
      { input: [[1, 2, 3], 9], expected: [1, 2, 3, 9] }
    ]
  },
  {
    id: 2,
    title: "Implement popElement(stack)",
    description:
      "Write a function popElement(stack) that removes the top element from the stack and returns the updated stack. If the stack is empty, return the empty stack.",
    functionName: "popElement",
    tests: [
      { input: [[10, 20, 30]], expected: [10, 20] },
      { input: [[5]], expected: [] },
      { input: [[]], expected: [] }
    ]
  },
  {
    id: 3,
    title: "Implement peek(stack)",
    description:
      "Write a function peek(stack) that returns the top element of the stack. If the stack is empty, return null.",
    functionName: "peek",
    tests: [
      { input: [[10, 20, 30]], expected: 30 },
      { input: [[5]], expected: 5 },
      { input: [[]], expected: null }
    ]
  },
  {
    id: 4,
    title: "Implement isEmpty(stack)",
    description:
      "Write a function isEmpty(stack) that returns true if the stack has no elements, otherwise false.",
    functionName: "isEmpty",
    tests: [
      { input: [[]], expected: true },
      { input: [[1]], expected: false },
      { input: [[10, 20]], expected: false }
    ]
  },
  {
    id: 5,
    title: "Implement size(stack)",
    description:
      "Write a function size(stack) that returns the number of elements currently present in the stack.",
    functionName: "size",
    tests: [
      { input: [[]], expected: 0 },
      { input: [[1]], expected: 1 },
      { input: [[10, 20, 30]], expected: 3 }
    ]
  },
  {
    id: 6,
    title: "Implement pushTwice(stack, a, b)",
    description:
      "Write a function pushTwice(stack, a, b) that pushes a and then b onto the stack and returns the updated stack.",
    functionName: "pushTwice",
    tests: [
      { input: [[1], 2, 3], expected: [1, 2, 3] },
      { input: [[], 5, 6], expected: [5, 6] },
      { input: [[10], 20, 30], expected: [10, 20, 30] }
    ]
  }
];

const LANGUAGES = ["javascript", "python", "cpp", "c", "java"];

function getStarterCode(problem, language) {
  const fn = problem.functionName;

  if (language === "python") {
    if (fn === "push") {
      return `def push(stack, value):
    # Write your solution here
    stack.append(value)
    return stack
`;
    }

    if (fn === "popElement") {
      return `def popElement(stack):
    # Write your solution here
    return stack
`;
    }

    if (fn === "peek") {
      return `def peek(stack):
    # Write your solution here
    return None
`;
    }

    if (fn === "isEmpty") {
      return `def isEmpty(stack):
    # Write your solution here
    return len(stack) == 0
`;
    }

    if (fn === "size") {
      return `def size(stack):
    # Write your solution here
    return len(stack)
`;
    }

    if (fn === "pushTwice") {
      return `def pushTwice(stack, a, b):
    # Write your solution here
    return stack
`;
    }
  }

  if (language === "cpp") {
    if (fn === "push") {
      return `#include <vector>
using namespace std;

vector<int> push(vector<int> stack, int value) {
    // Write your solution here
    stack.push_back(value);
    return stack;
}
`;
    }

    if (fn === "popElement") {
      return `#include <vector>
using namespace std;

vector<int> popElement(vector<int> stack) {
    // Write your solution here
    return stack;
}
`;
    }

    if (fn === "peek") {
      return `#include <vector>
using namespace std;

int peek(vector<int> stack) {
    // Write your solution here
    return -1;
}
`;
    }

    if (fn === "isEmpty") {
      return `#include <vector>
using namespace std;

bool isEmpty(vector<int> stack) {
    // Write your solution here
    return stack.empty();
}
`;
    }

    if (fn === "size") {
      return `#include <vector>
using namespace std;

int size(vector<int> stack) {
    // Write your solution here
    return stack.size();
}
`;
    }

    if (fn === "pushTwice") {
      return `#include <vector>
using namespace std;

vector<int> pushTwice(vector<int> stack, int a, int b) {
    // Write your solution here
    return stack;
}
`;
    }
  }

  if (language === "c") {
    return `/* C execution template only. Browser execution is available for JavaScript for now. */`;
  }

  if (language === "java") {
    if (fn === "push") {
      return `import java.util.*;

public class Main {
    public static List<Integer> push(List<Integer> stack, int value) {
        // Write your solution here
        stack.add(value);
        return stack;
    }
}
`;
    }

    if (fn === "popElement") {
      return `import java.util.*;

public class Main {
    public static List<Integer> popElement(List<Integer> stack) {
        // Write your solution here
        return stack;
    }
}
`;
    }

    if (fn === "peek") {
      return `import java.util.*;

public class Main {
    public static Integer peek(List<Integer> stack) {
        // Write your solution here
        return null;
    }
}
`;
    }

    if (fn === "isEmpty") {
      return `import java.util.*;

public class Main {
    public static boolean isEmpty(List<Integer> stack) {
        // Write your solution here
        return stack.isEmpty();
    }
}
`;
    }

    if (fn === "size") {
      return `import java.util.*;

public class Main {
    public static int size(List<Integer> stack) {
        // Write your solution here
        return stack.size();
    }
}
`;
    }

    if (fn === "pushTwice") {
      return `import java.util.*;

public class Main {
    public static List<Integer> pushTwice(List<Integer> stack, int a, int b) {
        // Write your solution here
        return stack;
    }
}
`;
    }
  }

  if (fn === "push") {
    return `function push(stack, value) {
  // Write your solution here
  stack.push(value);
  return stack;
}
`;
  }

  if (fn === "popElement") {
    return `function popElement(stack) {
  // Write your solution here
  return stack;
}
`;
  }

  if (fn === "peek") {
    return `function peek(stack) {
  // Write your solution here
  return null;
}
`;
  }

  if (fn === "isEmpty") {
    return `function isEmpty(stack) {
  // Write your solution here
  return stack.length === 0;
}
`;
  }

  if (fn === "size") {
    return `function size(stack) {
  // Write your solution here
  return stack.length;
}
`;
  }

  if (fn === "pushTwice") {
    return `function pushTwice(stack, a, b) {
  // Write your solution here
  return stack;
}
`;
  }

  return `function solve() {
  // Write your solution here
}
`;
}

export default function StackLab() {
  const [stack, setStack] = useState([]);
  const [input, setInput] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Stack initialized. Ready to begin.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [maxSize, setMaxSize] = useState(5);
  const [lastOperation, setLastOperation] = useState("Not started");
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const quizQuestions = useMemo(() => stackQuizQuestions, []);
  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [currentProblems, setCurrentProblems] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState({});
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});

  const inputRef = useRef(null);

  useEffect(() => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [quizQuestions.length]);

  const persistRun = () => {
    setExperimentRun(true);
    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: "stack", time: Date.now() })
    );
  };

  const pushElement = () => {
    const value = input.trim();

    if (!value) {
      setMessage("Please enter a value before pushing.");
      setHighlightedIndex(null);
      return;
    }

    if (stack.length >= maxSize) {
      setMessage(`Stack Overflow! Maximum size is ${maxSize}.`);
      setLastOperation("Overflow");
      setHighlightedIndex(stack.length - 1);
      persistRun();
      return;
    }

    const newStack = [...stack, value];
    setStack(newStack);
    setMessage(`Pushed ${value} onto the stack.`);
    setLastOperation(`Push(${value})`);
    setHighlightedIndex(newStack.length - 1);
    setInput("");
    persistRun();
    inputRef.current?.focus();
  };

  const popElement = () => {
    if (stack.length === 0) {
      setMessage("Stack Underflow! The stack is empty.");
      setLastOperation("Underflow");
      setHighlightedIndex(null);
      persistRun();
      return;
    }

    const removed = stack[stack.length - 1];
    const newStack = stack.slice(0, -1);

    setStack(newStack);
    setMessage(`Popped ${removed} from the stack.`);
    setLastOperation(`Pop() → ${removed}`);
    setHighlightedIndex(newStack.length - 1 >= 0 ? newStack.length - 1 : null);
    persistRun();
  };

  const peekElement = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty. No top element is available.");
      setLastOperation("Peek on empty stack");
      setHighlightedIndex(null);
      persistRun();
      return;
    }

    const top = stack[stack.length - 1];
    setMessage(`Top element is ${top}.`);
    setLastOperation(`Peek() → ${top}`);
    setHighlightedIndex(stack.length - 1);
    persistRun();
  };

  const checkIsEmpty = () => {
    const empty = stack.length === 0;
    setMessage(empty ? "Stack is empty." : "Stack is not empty.");
    setLastOperation("isEmpty()");
    setHighlightedIndex(stack.length > 0 ? stack.length - 1 : null);
    persistRun();
  };

  const showSize = () => {
    setMessage(`Current stack size is ${stack.length}.`);
    setLastOperation("size()");
    setHighlightedIndex(stack.length > 0 ? stack.length - 1 : null);
    persistRun();
  };

  const reset = () => {
    setStack([]);
    setInput("");
    setMessage("Stack reset. All elements cleared.");
    setExperimentRun(false);
    setLastOperation("Reset");
    setHighlightedIndex(null);
  };

  const handleQuizAnswer = (index, answer) => {
    const updated = [...quizAnswers];
    updated[index] = answer;
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

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const generateProblems = () => {
    const shuffled = [...problemBank].sort(() => 0.5 - Math.random());
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
      topic: "stack",
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
      topic: "stack",
      language,
      action: "correct"
    };

    localStorage.setItem("vlab_code_correction", JSON.stringify(correctionData));
    alert("Code correction request sent to AI Assistant. Check the AI chat for the corrected code!");
  };

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
              Interactive Stack Experiment
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            Stack
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
            Learn stack operations visually through push, pop, peek, size checks, quiz
            practice, and coding exercises.
          </p>
        </div>

        <section className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Stack Configuration</h2>

          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", alignItems: "end" }}>
            <div style={{ minWidth: "220px" }}>
              <label className="sorting-label">Maximum Stack Size</label>
              <input
                type="number"
                min="1"
                value={maxSize}
                onChange={(e) => setMaxSize(Math.max(1, Number(e.target.value) || 1))}
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
                  highlightedIndex={highlightedIndex}
                  lastOperation={lastOperation}
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
                  redoQuiz={redoQuiz}
                />
              )}

              {activeSection === "coding" && (
                <StackCoding
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}