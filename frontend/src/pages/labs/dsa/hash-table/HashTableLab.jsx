import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../../../styles/Lab.css";

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
  }
];

const codingProblem = {
  title: "Implement hashInsert(table, key, size)",
  description:
    "Write a function hashInsert(table, key, size) that inserts a numeric key into a hash table using separate chaining."
};

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

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(hashCodeTemplates.javascript);
  const [codeResult, setCodeResult] = useState("");

  useEffect(() => {
    setCode(hashCodeTemplates[selectedLanguage]);
    setCodeResult("");
  }, [selectedLanguage]);

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

  const runCode = () => {
    if (selectedLanguage !== "javascript") {
      setCodeResult(
        `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      );
      return;
    }

    try {
      const sampleTable = [[], [], [], [], [], [], []];
      // eslint-disable-next-line no-new-func
      const fn = new Function("table", "key", "size", `${code}; return hashInsert(table, key, size);`);
      const result = fn(sampleTable, 10, TABLE_SIZE);
      setCodeResult(`Output: ${JSON.stringify(result)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Hash Table</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Settings</h2>
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
              Animation Speed
            </label>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="lab-select"
              style={{ minWidth: "180px" }}
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
            />
          )}

          {activeSection === "coding" && (
            <HashTableCoding
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