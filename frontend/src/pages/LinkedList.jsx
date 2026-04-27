import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu,
  GitCompare
} from "lucide-react";

import "./Lab.css";
import "./SortingLab.css";

import LinkedListOverview from "./labs/linked-list/LinkedListOverview.jsx";
import LinkedListSimulation from "./labs/linked-list/LinkedListSimulation.jsx";
import LinkedListQuiz from "./labs/linked-list/LinkedListQuiz.jsx";
import LinkedListCoding from "./labs/linked-list/LinkedListCoding.jsx";
import LinkedListComparison from "./labs/linked-list/LinkedListComparison.jsx";

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "comparison", label: "Comparison", icon: GitCompare },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

const singlyQuizQuestions = [
  {
    question: "What is the main advantage of a linked list over an array?",
    options: ["Random access", "Dynamic size", "Lower memory usage always", "Faster indexing"],
    correct: 1
  },
  {
    question: "Insertion at the head of a singly linked list takes:",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correct: 0
  },
  {
    question: "A node in a singly linked list usually stores:",
    options: ["data and next", "data and prev", "left and right", "parent only"],
    correct: 0
  },
  {
    question: "Which traversal is directly possible in a singly linked list?",
    options: ["Backward only", "Forward only", "Both forward and backward", "Random access"],
    correct: 1
  },
  {
    question: "Searching in a linked list generally takes:",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct: 2
  }
];

const doublyQuizQuestions = [
  {
    question: "A doubly linked list node contains:",
    options: ["data only", "data and next", "data, prev, and next", "head and tail only"],
    correct: 2
  },
  {
    question: "The main benefit of a doubly linked list is:",
    options: ["Less memory", "Backward traversal", "Faster indexing", "No pointers needed"],
    correct: 1
  },
  {
    question: "Insertion at head in a doubly linked list takes:",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correct: 0
  },
  {
    question: "A doubly linked list supports:",
    options: ["Only forward traversal", "Only backward traversal", "Both forward and backward traversal", "No traversal"],
    correct: 2
  },
  {
    question: "Compared to singly linked list, doubly linked list uses:",
    options: ["Less memory", "Equal memory", "More memory", "No memory"],
    correct: 2
  }
];

const problemBank = {
  singly: [
    {
      id: 1,
      type: "Easy",
      title: "Insert at Head",
      description:
        "Write a function insertAtHead(head, value) that inserts a new node at the beginning of a singly linked list and returns the new head."
    },
    {
      id: 2,
      type: "Easy",
      title: "Insert at Tail",
      description:
        "Write a function insertAtTail(head, value) that inserts a new node at the end of a singly linked list and returns the head."
    },
    {
      id: 3,
      type: "Medium",
      title: "Search in Linked List",
      description:
        "Write a function searchNode(head, value) that returns true if the value exists in the singly linked list, otherwise false."
    }
  ],
  doubly: [
    {
      id: 4,
      type: "Easy",
      title: "Insert at Tail",
      description:
        "Write a function insertAtTail(head, value) that inserts a new node at the end of a doubly linked list and returns the head."
    },
    {
      id: 5,
      type: "Medium",
      title: "Insert at Head",
      description:
        "Write a function insertAtHead(head, value) that inserts a new node at the beginning of a doubly linked list and returns the new head."
    },
    {
      id: 6,
      type: "Medium",
      title: "Backward Traversal",
      description:
        "Write a function backwardTraversal(tail) that returns all node values from tail to head in an array."
    }
  ]
};

export default function LinkedListLab() {
  const [listType, setListType] = useState("singly");
  const [nodes, setNodes] = useState([]);
  const [input, setInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [scanningIndex, setScanningIndex] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [message, setMessage] = useState("Linked list initialized.");
  const [experimentRun, setExperimentRun] = useState(false);

  const quizQuestions = useMemo(
    () => (listType === "doubly" ? doublyQuizQuestions : singlyQuizQuestions),
    [listType]
  );

  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [selectedLanguages, setSelectedLanguages] = useState({});
  const [results, setResults] = useState({});

  const inputRef = useRef(null);

  const listModeLabel =
    listType === "doubly" ? "Doubly Linked List" : "Singly Linked List";

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 50
      : activeSection === "comparison"
      ? 65
      : activeSection === "quiz"
      ? 80
      : 95;

  useEffect(() => {
    setNodes([]);
    setInput("");
    setSearchValue("");
    setHighlightedIndex(null);
    setScanningIndex(null);
    setIsSearching(false);
    setMessage("Linked list initialized.");
    setExperimentRun(false);
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCurrentProblems([]);
    setCodes({});
    setSelectedLanguages({});
    setResults({});
  }, [listType, quizQuestions.length]);

  const createNode = (value) => ({
    id: `${Date.now()}-${Math.random()}`,
    value
  });

  const insertHead = () => {
    if (!input.trim()) {
      setMessage("Please enter a value.");
      return;
    }

    const newNode = createNode(input.trim());
    setNodes((prev) => [newNode, ...prev]);
    setMessage(`Inserted ${input.trim()} at head.`);
    setInput("");
    setHighlightedIndex(null);
    setScanningIndex(null);
    setExperimentRun(true);
    inputRef.current?.focus();
  };

  const insertTail = () => {
    if (!input.trim()) {
      setMessage("Please enter a value.");
      return;
    }

    const newNode = createNode(input.trim());
    setNodes((prev) => [...prev, newNode]);
    setMessage(`Inserted ${input.trim()} at tail.`);
    setInput("");
    setHighlightedIndex(null);
    setScanningIndex(null);
    setExperimentRun(true);
    inputRef.current?.focus();
  };

  const deleteHead = () => {
    if (nodes.length === 0) {
      setMessage("Cannot delete head. Linked list is empty.");
      return;
    }

    const removed = nodes[0].value;
    setNodes((prev) => prev.slice(1));
    setHighlightedIndex(null);
    setScanningIndex(null);
    setMessage(`Deleted head node (${removed}).`);
    setExperimentRun(true);
  };

  const deleteTail = () => {
    if (nodes.length === 0) {
      setMessage("Cannot delete tail. Linked list is empty.");
      return;
    }

    const removed = nodes[nodes.length - 1].value;
    setNodes((prev) => prev.slice(0, -1));
    setHighlightedIndex(null);
    setScanningIndex(null);
    setMessage(`Deleted tail node (${removed}).`);
    setExperimentRun(true);
  };

  const traverseForward = () => {
    if (nodes.length === 0) {
      setMessage("Linked list is empty.");
      return;
    }

    setHighlightedIndex(null);
    setScanningIndex(null);
    setMessage(`Forward Traversal: ${nodes.map((n) => n.value).join(" → ")} → NULL`);
    setExperimentRun(true);
  };

  const traverseBackward = () => {
    if (nodes.length === 0) {
      setMessage("Linked list is empty.");
      return;
    }

    if (listType !== "doubly") {
      setMessage("Backward traversal is available only in doubly linked list.");
      return;
    }

    setHighlightedIndex(null);
    setScanningIndex(null);
    setMessage(
      `Backward Traversal: NULL ← ${[...nodes].reverse().map((n) => n.value).join(" ← ")}`
    );
    setExperimentRun(true);
  };

  const searchNode = async () => {
    if (!searchValue.trim()) {
      setMessage("Please enter a value to search.");
      return;
    }

    if (nodes.length === 0) {
      setMessage("Linked list is empty.");
      setHighlightedIndex(null);
      setScanningIndex(null);
      return;
    }

    setIsSearching(true);
    setHighlightedIndex(null);
    setScanningIndex(null);

    const target = searchValue.trim();

    for (let i = 0; i < nodes.length; i++) {
      setScanningIndex(i);
      setMessage(`Comparing ${target} with node at position ${i} (value = ${nodes[i].value})...`);

      await new Promise((resolve) => setTimeout(resolve, 700));

      if (String(nodes[i].value).trim() === target) {
        setScanningIndex(null);
        setHighlightedIndex(i);
        setMessage(`Value ${target} found at position ${i}.`);
        setExperimentRun(true);
        setIsSearching(false);
        return;
      }
    }

    setScanningIndex(null);
    setHighlightedIndex(null);
    setMessage(`Value ${target} not found in the linked list.`);
    setExperimentRun(true);
    setIsSearching(false);
  };

  const reset = () => {
    setNodes([]);
    setInput("");
    setSearchValue("");
    setHighlightedIndex(null);
    setScanningIndex(null);
    setIsSearching(false);
    setMessage("Linked list reset.");
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
      experiment: listType === "doubly" ? "doubly-linked-list" : "singly-linked-list",
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

  const getStarterCode = (problem, language) => {
    if (problem.title === "Insert at Head" && listType === "singly") {
      if (language === "python") {
        return `def insertAtHead(head, value):
    return {"value": value, "next": head}`;
      }

      return `function insertAtHead(head, value) {
  return { value, next: head };
}`;
    }

    if (problem.title === "Insert at Tail" && listType === "singly") {
      return `function insertAtTail(head, value) {
  const node = { value, next: null };
  if (!head) return node;

  let curr = head;
  while (curr.next) curr = curr.next;
  curr.next = node;
  return head;
}`;
    }

    if (problem.title === "Search in Linked List") {
      return `function searchNode(head, value) {
  let curr = head;
  while (curr) {
    if (curr.value === value) return true;
    curr = curr.next;
  }
  return false;
}`;
    }

    if (problem.title === "Insert at Tail" && listType === "doubly") {
      return `function insertAtTail(head, value) {
  const node = { value, prev: null, next: null };
  if (!head) return node;

  let curr = head;
  while (curr.next) curr = curr.next;

  curr.next = node;
  node.prev = curr;
  return head;
}`;
    }

    if (problem.title === "Insert at Head" && listType === "doubly") {
      return `function insertAtHead(head, value) {
  const node = { value, prev: null, next: head };
  if (head) head.prev = node;
  return node;
}`;
    }

    if (problem.title === "Backward Traversal") {
      return `function backwardTraversal(tail) {
  const result = [];
  let curr = tail;
  while (curr) {
    result.push(curr.value);
    curr = curr.prev;
  }
  return result;
}`;
    }

    return `function solve() {
  // Write your solution here
}`;
  };

  const generateProblems = () => {
    const selected = problemBank[listType];
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

  const handleCodeChange = (problemId, language, code) => {
    const key = `${problemId}_${language}`;
    setCodes((prev) => ({ ...prev, [key]: code }));
  };

  const runCode = (problemId, language) => {
    const problem = currentProblems.find((p) => p.id === problemId);
    const codeKey = `${problemId}_${language}`;
    const userCode = codes[codeKey];

    if (!userCode || !problem) {
      setResults((prev) => ({ ...prev, [problemId]: "Please enter code." }));
      return;
    }

    if (language !== "javascript") {
      setResults((prev) => ({
        ...prev,
        [problemId]: `${language.toUpperCase()} execution will be added later. For now, use JavaScript.`
      }));
      return;
    }

    try {
      let result;

      if (problem.title === "Insert at Head" && listType === "singly") {
        const fn = new Function("head", "value", `${userCode}; return insertAtHead(head, value);`);
        result = fn({ value: 20, next: null }, 10);
      } else if (problem.title === "Insert at Tail" && listType === "singly") {
        const fn = new Function("head", "value", `${userCode}; return insertAtTail(head, value);`);
        result = fn({ value: 10, next: { value: 20, next: null } }, 30);
      } else if (problem.title === "Search in Linked List") {
        const fn = new Function("head", "value", `${userCode}; return searchNode(head, value);`);
        result = fn(
          { value: 10, next: { value: 20, next: { value: 30, next: null } } },
          20
        );
      } else if (problem.title === "Insert at Tail" && listType === "doubly") {
        const fn = new Function("head", "value", `${userCode}; return insertAtTail(head, value);`);
        result = fn({ value: 10, prev: null, next: null }, 20);
      } else if (problem.title === "Insert at Head" && listType === "doubly") {
        const fn = new Function("head", "value", `${userCode}; return insertAtHead(head, value);`);
        result = fn({ value: 20, prev: null, next: null }, 10);
      } else if (problem.title === "Backward Traversal") {
        const tail = {
          value: 30,
          prev: {
            value: 20,
            prev: {
              value: 10,
              prev: null,
              next: null
            },
            next: null
          },
          next: null
        };

        tail.prev.next = tail;
        tail.prev.prev.next = tail.prev;

        const fn = new Function("tail", `${userCode}; return backwardTraversal(tail);`);
        result = fn(tail);
      }

      setResults((prev) => ({
        ...prev,
        [problemId]: `Output: ${JSON.stringify(result)}`
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
    const userCode = codes[codeKey];

    if (!userCode) {
      alert("Please enter code to analyze.");
      return;
    }

    localStorage.setItem(
      "vlab_code_analysis",
      JSON.stringify({
        code: userCode,
        problemId,
        topic: "linked-list",
        language
      })
    );

    alert("Code analysis request sent to AI Assistant. Check the AI chat for feedback.");
  };

  const correctCode = (problemId, language) => {
    const codeKey = `${problemId}_${language}`;
    const userCode = codes[codeKey];

    if (!userCode) {
      alert("Please enter code to correct.");
      return;
    }

    localStorage.setItem(
      "vlab_code_correction",
      JSON.stringify({
        code: userCode,
        problemId,
        topic: "linked-list",
        language,
        action: "correct"
      })
    );

    alert("Code correction request sent to AI Assistant. Check the AI chat for corrected code.");
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
            <h1 className="er-page-title">Linked List</h1>
            <p className="er-page-subtitle">
              Explore singly and doubly linked list operations through simulation, comparison, quiz, and coding practice.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Linked List Configuration</h2>
              <p>Select list type and observe how node connections change.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>{listModeLabel}</strong>
                <span>
                  Current nodes: {nodes.length}. Insert, delete, search, and traverse linked nodes.
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">List Type</label>
              <select
                value={listType}
                onChange={(e) => setListType(e.target.value)}
                className="sorting-select"
              >
                <option value="singly">Singly Linked List</option>
                <option value="doubly">Doubly Linked List</option>
              </select>
            </div>

            <div>
              <label className="sorting-label">Current Status</label>
              <div className="sorting-select" style={{ display: "flex", alignItems: "center" }}>
                {nodes.length === 0 ? "Empty List" : `${nodes.length} node(s) active`}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">Type = {listModeLabel}</button>
            <button className="er-chip active">Nodes = {nodes.length}</button>
            <button className="er-chip active">
              Head = {nodes.length ? nodes[0].value : "NULL"}
            </button>
            <button className="er-chip active">
              Tail = {nodes.length ? nodes[nodes.length - 1].value : "NULL"}
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Experiment Run" : "Not Started"}
            </button>
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <LinkedListOverview listType={listType} />}

            {activeSection === "simulation" && (
              <LinkedListSimulation
                listType={listType}
                nodes={nodes}
                input={input}
                setInput={setInput}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                insertHead={insertHead}
                insertTail={insertTail}
                deleteHead={deleteHead}
                deleteTail={deleteTail}
                traverseForward={traverseForward}
                traverseBackward={traverseBackward}
                searchNode={searchNode}
                reset={reset}
                message={message}
                inputRef={inputRef}
                highlightedIndex={highlightedIndex}
                scanningIndex={scanningIndex}
                isSearching={isSearching}
              />
            )}

            {activeSection === "comparison" && <LinkedListComparison />}

            {activeSection === "quiz" && (
              <LinkedListQuiz
                listType={listType}
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
              <LinkedListCoding
                currentProblems={currentProblems}
                codes={codes}
                selectedLanguages={selectedLanguages}
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