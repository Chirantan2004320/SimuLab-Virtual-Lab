import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlaskConical } from "lucide-react";
import "../../Lab.css";
import "../../SortingLab.css";
import HashTableOverview from "./HashTableOverview";
import HashTableSimulation from "./HashTableSimulation";
import HashTableQuiz from "./HashTableQuiz";
import HashTableCoding from "./HashTableCoding";

const TABLE_SIZE = 7;

const hashQuizQuestions = [
  {
    question: "What is the main purpose of a hash function?",
    options: [
      "To sort values",
      "To map keys to table indices",
      "To reverse strings",
      "To balance trees"
    ],
    correct: 1
  },
  {
    question: "What is a collision in a hash table?",
    options: [
      "When two keys map to the same index",
      "When a key is deleted",
      "When the table is empty",
      "When values are sorted"
    ],
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
    description:
      "Write a function hashInsert(table, key, size) that inserts a numeric key into a hash table using separate chaining.",
    functionName: "hashInsert",
    tests: [
      { input: [[[], [], [], [], [], [], []], 10, 7], expected: [[], [], [], [10], [], [], []] },
      { input: [[[7], [], [], [], [], [], []], 14, 7], expected: [[7, 14], [], [], [], [], [], []] }
    ]
  },
  {
    id: 2,
    title: "Implement hashSearch(table, key, size)",
    description:
      "Write a function hashSearch(table, key, size) that returns true if the key exists in the appropriate chain, otherwise false.",
    functionName: "hashSearch",
    tests: [
      { input: [[[7, 14], [], [], [], [], [], []], 14, 7], expected: true },
      { input: [[[7, 14], [], [], [], [], [], []], 21, 7], expected: false }
    ]
  },
  {
    id: 3,
    title: "Implement hashDelete(table, key, size)",
    description:
      "Write a function hashDelete(table, key, size) that removes the key from the chain if present and returns the updated table.",
    functionName: "hashDelete",
    tests: [
      { input: [[[7, 14], [], [], [], [], [], []], 14, 7], expected: [[7], [], [], [], [], [], []] },
      { input: [[[7], [], [], [], [], [], []], 10, 7], expected: [[7], [], [], [], [], [], []] }
    ]
  },
  {
    id: 4,
    title: "Implement getBucketIndex(key, size)",
    description:
      "Write a function getBucketIndex(key, size) that returns the bucket index using the hash rule from this lab.",
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
    description:
      "Write a function bucketLength(table, index) that returns the number of elements stored in a given chain.",
    functionName: "bucketLength",
    tests: [
      { input: [[[7, 14], [], [], [], [], [], []], 0], expected: 2 },
      { input: [[[7, 14], [], [], [], [], [], []], 1], expected: 0 }
    ]
  }
];

const hashCodeTemplates = {
  javascript: `function hashInsert(table, key, size) {
  const index = key % size;
  table[index].push(key);
  return table;
}`,
  python: `def hash_insert(table, key, size):
    index = key % size
    table[index].append(key)
    return table`,
  cpp: `vector<vector<int>> hashInsert(vector<vector<int>> table, int key, int size) {
    int index = key % size;
    table[index].push_back(key);
    return table;
}`,
  c: `void hashInsert(int key, int size, struct Node* table[]) {
    int index = key % size;
    // Insert key into linked list at table[index]
}`,
  java: `static List<List<Integer>> hashInsert(List<List<Integer>> table, int key, int size) {
    int index = key % size;
    table.get(index).add(key);
    return table;
}`
};

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
        [problemId]:
          `Execution for ${language.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
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

    const analysisData = {
      code: currentCode,
      problemId,
      topic: "hash-table",
      language
    };

    localStorage.setItem("vlab_code_analysis", JSON.stringify(analysisData));
    alert("Code analysis request sent to AI Assistant. Check the AI chat for feedback!");
  };

  const correctCode = (problemId, language) => {
    const codeKey = `${problemId}_${language}`;
    const currentCode = codes[codeKey];

    if (!currentCode) {
      alert("Please enter code to correct.");
      return;
    }

    const correctionData = {
      code: currentCode,
      problemId,
      topic: "hash-table",
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
              Interactive Hash Table Experiment
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            Hash Table
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
            Explore hashing, collisions, separate chaining, insertion, search, and deletion through interactive bucket visualization.
          </p>
        </div>

        <section className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Settings</h2>

          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", alignItems: "end" }}>
            <div style={{ minWidth: "220px" }}>
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}