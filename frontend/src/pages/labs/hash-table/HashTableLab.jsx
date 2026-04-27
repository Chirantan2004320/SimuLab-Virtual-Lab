import React, { useMemo, useRef, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu,
  GitCompare
} from "lucide-react";

import "../../Lab.css";
import "../../SortingLab.css";

import HashTableOverview from "./HashTableOverview";
import HashTableSimulation from "./HashTableSimulation";
import HashTableQuiz from "./HashTableQuiz";
import HashTableCoding from "./HashTableCoding";
import HashTableComparison from "./HashTableComparison";

const TABLE_SIZE = 7;
const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "comparison", label: "Comparison", icon: GitCompare },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

const hashQuizQuestions = [
  {
    question: "What is the main purpose of a hash function?",
    options: ["To sort values", "To map keys to table indices", "To reverse strings", "To balance trees"],
    correct: 1
  },
  {
    question: "What is a collision in a hash table?",
    options: ["When two keys map to the same index", "When a key is deleted", "When the table is empty", "When values are sorted"],
    correct: 0
  },
  {
    question: "In separate chaining, collisions are handled using:",
    options: ["Arrays only", "Stacks", "Linked lists / chains", "Binary trees only"],
    correct: 2
  },
  {
    question: "Which formula is used in this lab's hash function?",
    options: ["key + size", "key * size", "key % size", "size % key"],
    correct: 2
  },
  {
    question: "What is the expected average-case time complexity of insert/search/delete in a good hash table?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct: 0
  }
];

const problemBank = [
  {
    id: 1,
    title: "Implement hashInsert(table, key, size)",
    description: "Write a function hashInsert(table, key, size) that inserts a numeric key into a hash table using separate chaining.",
    functionName: "hashInsert",
    tests: [
      { input: [[[], [], [], [], [], [], []], 10, 7], expected: [[], [], [], [10], [], [], []] },
      { input: [[[7], [], [], [], [], [], []], 14, 7], expected: [[7, 14], [], [], [], [], [], []] }
    ]
  },
  {
    id: 2,
    title: "Implement hashSearch(table, key, size)",
    description: "Write a function hashSearch(table, key, size) that returns true if the key exists in the appropriate chain, otherwise false.",
    functionName: "hashSearch",
    tests: [
      { input: [[[7, 14], [], [], [], [], [], []], 14, 7], expected: true },
      { input: [[[7, 14], [], [], [], [], [], []], 21, 7], expected: false }
    ]
  },
  {
    id: 3,
    title: "Implement hashDelete(table, key, size)",
    description: "Write a function hashDelete(table, key, size) that removes the key from the chain if present and returns the updated table.",
    functionName: "hashDelete",
    tests: [
      { input: [[[7, 14], [], [], [], [], [], []], 14, 7], expected: [[7], [], [], [], [], [], []] },
      { input: [[[7], [], [], [], [], [], []], 10, 7], expected: [[7], [], [], [], [], [], []] }
    ]
  },
  {
    id: 4,
    title: "Implement getBucketIndex(key, size)",
    description: "Write a function getBucketIndex(key, size) that returns the bucket index using the hash rule from this lab.",
    functionName: "getBucketIndex",
    tests: [
      { input: [10, 7], expected: 3 },
      { input: [24, 7], expected: 3 },
      { input: [5, 7], expected: 5 }
    ]
  },
  {
    id: 5,
    title: "Implement bucketLength(table, index)",
    description: "Write a function bucketLength(table, index) that returns the number of elements stored in a given chain.",
    functionName: "bucketLength",
    tests: [
      { input: [[[7, 14], [], [], [], [], [], []], 0], expected: 2 },
      { input: [[[7, 14], [], [], [], [], [], []], 1], expected: 0 }
    ]
  }
];

const createEmptyTable = () => Array.from({ length: TABLE_SIZE }, () => []);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getStarterCode(problem, language) {
  const fn = problem.functionName;

  if (language === "python") {
    const map = {
      hashInsert: `def hashInsert(table, key, size):
    # Write your solution here
    return table
`,
      hashSearch: `def hashSearch(table, key, size):
    # Write your solution here
    return False
`,
      hashDelete: `def hashDelete(table, key, size):
    # Write your solution here
    return table
`,
      getBucketIndex: `def getBucketIndex(key, size):
    # Write your solution here
    return 0
`,
      bucketLength: `def bucketLength(table, index):
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
    hashInsert: `function hashInsert(table, key, size) {
  // Write your solution here
  return table;
}
`,
    hashSearch: `function hashSearch(table, key, size) {
  // Write your solution here
  return false;
}
`,
    hashDelete: `function hashDelete(table, key, size) {
  // Write your solution here
  return table;
}
`,
    getBucketIndex: `function getBucketIndex(key, size) {
  // Write your solution here
  return 0;
}
`,
    bucketLength: `function bucketLength(table, index) {
  // Write your solution here
  return 0;
}
`
  };

  return map[fn] || `function solve() {\n  // Write your solution here\n}\n`;
}

export default function HashTableLab() {
  const [table, setTable] = useState(createEmptyTable());
  const [input, setInput] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [message, setMessage] = useState("Hash Table initialized.");
  const [activeBucket, setActiveBucket] = useState(null);
  const [activeValue, setActiveValue] = useState(null);
  const [stepHistory, setStepHistory] = useState([]);
  const [experimentRun, setExperimentRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(650);

  const inputRef = useRef(null);

  const quizQuestions = useMemo(() => hashQuizQuestions, []);
  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [currentProblems, setCurrentProblems] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState({});
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});

  const hash = (value) => value % TABLE_SIZE;

  const filledBuckets = table.filter((bucket) => bucket.length > 0).length;
  const storedKeys = table.reduce((sum, bucket) => sum + bucket.length, 0);
  const collisionBuckets = table.filter((bucket) => bucket.length > 1).length;

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

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const clearHighlights = () => {
    setActiveBucket(null);
    setActiveValue(null);
  };

  const insert = async () => {
    if (isRunning) return;

    const value = Number(input.trim());

    if (input.trim() === "" || Number.isNaN(value)) {
      setMessage("Please enter a valid number.");
      return;
    }

    const index = hash(value);
    const newTable = table.map((bucket) => [...bucket]);

    setIsRunning(true);
    setStepHistory([]);
    setExperimentRun(true);
    setActiveBucket(index);
    setActiveValue(null);

    try {
      setMessage(`Computing hash for ${value}...`);
      addStep(`Compute hash: ${value} % ${TABLE_SIZE} = ${index}`);
      await sleep(animationSpeed);

      if (newTable[index].length > 0) {
        setMessage(`Collision detected at bucket ${index}.`);
        addStep(`Collision detected at bucket ${index}. Existing chain: [${newTable[index].join(", ")}]`);
        await sleep(animationSpeed);
      } else {
        addStep(`Bucket ${index} is empty.`);
      }

      newTable[index].push(value);
      setTable(newTable);
      setActiveValue(value);
      setMessage(`Inserted ${value} into bucket ${index}.`);
      addStep(`Inserted ${value} at the end of chain in bucket ${index}.`);

      localStorage.setItem(
        "vlab_last_experiment",
        JSON.stringify({ name: "hash-table", time: Date.now() })
      );

      setInput("");
      inputRef.current?.focus();
    } finally {
      setIsRunning(false);
    }
  };

  const search = async () => {
    if (isRunning) return;

    const value = Number(input.trim());

    if (input.trim() === "" || Number.isNaN(value)) {
      setMessage("Please enter a valid number.");
      return;
    }

    const index = hash(value);
    const bucket = table[index];

    setIsRunning(true);
    setStepHistory([]);
    setExperimentRun(true);
    setActiveBucket(index);
    setActiveValue(null);

    try {
      addStep(`Compute hash: ${value} % ${TABLE_SIZE} = ${index}`);
      setMessage(`Searching bucket ${index}...`);
      await sleep(animationSpeed);

      if (bucket.length === 0) {
        setMessage(`${value} not found. Bucket ${index} is empty.`);
        addStep(`Bucket ${index} is empty. Search failed.`);
        return;
      }

      addStep(`Search chain in bucket ${index}: [${bucket.join(", ")}]`);

      for (let i = 0; i < bucket.length; i++) {
        const current = bucket[i];
        setActiveValue(current);
        setMessage(`Checking ${current} in bucket ${index}...`);
        addStep(`Compare target ${value} with ${current}.`);
        await sleep(animationSpeed);

        if (current === value) {
          setMessage(`Found ${value} in bucket ${index}.`);
          addStep(`${value} found in bucket ${index}.`);
          return;
        }
      }

      setActiveValue(null);
      setMessage(`${value} not found.`);
      addStep(`${value} does not exist in bucket ${index}.`);
    } finally {
      setIsRunning(false);
    }
  };

  const remove = async () => {
    if (isRunning) return;

    const value = Number(input.trim());

    if (input.trim() === "" || Number.isNaN(value)) {
      setMessage("Please enter a valid number.");
      return;
    }

    const index = hash(value);
    const bucket = [...table[index]];
    const newTable = table.map((b) => [...b]);

    setIsRunning(true);
    setStepHistory([]);
    setExperimentRun(true);
    setActiveBucket(index);
    setActiveValue(null);

    try {
      addStep(`Compute hash: ${value} % ${TABLE_SIZE} = ${index}`);
      setMessage(`Checking bucket ${index} for deletion...`);
      await sleep(animationSpeed);

      if (bucket.length === 0) {
        setMessage(`${value} not found, so nothing was deleted.`);
        addStep(`Bucket ${index} is empty. Delete failed.`);
        return;
      }

      addStep(`Inspect chain in bucket ${index}: [${bucket.join(", ")}]`);

      let foundIndex = -1;

      for (let i = 0; i < bucket.length; i++) {
        setActiveValue(bucket[i]);
        setMessage(`Checking ${bucket[i]}...`);
        addStep(`Compare target ${value} with ${bucket[i]}.`);
        await sleep(animationSpeed);

        if (bucket[i] === value) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex === -1) {
        setActiveValue(null);
        setMessage(`${value} not found, so nothing was deleted.`);
        addStep(`${value} was not present in bucket ${index}.`);
        return;
      }

      newTable[index].splice(foundIndex, 1);
      setTable(newTable);
      setMessage(`Deleted ${value} from bucket ${index}.`);
      addStep(`${value} removed from chain in bucket ${index}.`);
      setActiveValue(null);
    } finally {
      setIsRunning(false);
    }
  };

  const reset = () => {
    if (isRunning) return;

    setTable(createEmptyTable());
    setInput("");
    clearHighlights();
    setStepHistory([]);
    setMessage("Hash Table reset.");
    setExperimentRun(false);
  };

  const loadSample = () => {
    if (isRunning) return;

    const sample = [10, 17, 24, 5, 12];
    const newTable = createEmptyTable();

    sample.forEach((val) => {
      const index = val % TABLE_SIZE;
      newTable[index].push(val);
    });

    setTable(newTable);
    clearHighlights();
    setStepHistory(["Loaded sample data into the hash table."]);
    setMessage("Loaded sample hash table.");
    setExperimentRun(true);
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
      experiment: "hash-table",
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
    const currentCode = codes[codeKey];

    if (!problem || !currentCode) {
      setResults((prev) => ({
        ...prev,
        [problemId]: "Please enter code."
      }));
      return;
    }

    if (language !== "javascript") {
      setResults((prev) => ({
        ...prev,
        [problemId]: `Execution for ${language.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      }));
      return;
    }

    try {
      const outputs = [];
      let allCorrect = true;

      for (const test of problem.tests) {
        const args = test.input.map((item) =>
          Array.isArray(item) ? JSON.parse(JSON.stringify(item)) : item
        );

        const fn = new Function(
          ...Array.from({ length: args.length }, (_, index) => `arg${index}`),
          `${currentCode}; return ${problem.functionName}(${args.map((_, index) => `arg${index}`).join(", ")});`
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
    const currentCode = codes[codeKey];

    if (!currentCode) {
      alert("Please enter code to analyze.");
      return;
    }

    localStorage.setItem(
      "vlab_code_analysis",
      JSON.stringify({
        code: currentCode,
        problemId,
        topic: "hash-table",
        language
      })
    );

    alert("Code analysis request sent to AI Assistant. Check the AI chat for feedback!");
  };

  const correctCode = (problemId, language) => {
    const codeKey = `${problemId}_${language}`;
    const currentCode = codes[codeKey];

    if (!currentCode) {
      alert("Please enter code to correct.");
      return;
    }

    localStorage.setItem(
      "vlab_code_correction",
      JSON.stringify({
        code: currentCode,
        problemId,
        topic: "hash-table",
        language,
        action: "correct"
      })
    );

    alert("Code correction request sent to AI Assistant. Check the AI chat for the corrected code!");
  };

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
            <h1 className="er-page-title">Hash Table</h1>
            <p className="er-page-subtitle">
              Explore hashing, collisions, separate chaining, insertion, search, deletion, quiz, and coding practice.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Hash Table Configuration</h2>
              <p>Use modulo hashing and separate chaining to understand bucket-based lookup.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>Separate Chaining</strong>
                <span>Hash rule: key % {TABLE_SIZE}</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Animation Speed</label>
              <select
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value={1000}>Slow</option>
                <option value={650}>Normal</option>
                <option value={350}>Fast</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Table Size</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                {TABLE_SIZE} Buckets
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">Hash = key % {TABLE_SIZE}</button>
            <button className="er-chip active">Stored Keys = {storedKeys}</button>
            <button className="er-chip active">Filled Buckets = {filledBuckets}</button>
            <button className="er-chip active">Collisions = {collisionBuckets}</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <HashTableOverview tableSize={TABLE_SIZE} />}

            {activeSection === "simulation" && (
              <HashTableSimulation
                table={table}
                input={input}
                setInput={setInput}
                insert={insert}
                search={search}
                remove={remove}
                reset={reset}
                loadSample={loadSample}
                message={message}
                activeBucket={activeBucket}
                activeValue={activeValue}
                inputRef={inputRef}
                stepHistory={stepHistory}
                tableSize={TABLE_SIZE}
                isRunning={isRunning}
              />
            )}

            {activeSection === "comparison" && <HashTableComparison />}

            {activeSection === "quiz" && (
              <HashTableQuiz
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
              <HashTableCoding
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