import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Lab.css";
import "./SortingLab.css";

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
  }
];

const codingProblemByType = {
  singly: {
    title: "Implement insertAtHead(head, value)",
    description:
      "Write a function insertAtHead(head, value) for a singly linked list. It should return the new head."
  },
  doubly: {
    title: "Implement insertAtTail(head, value)",
    description:
      "Write a function insertAtTail(head, value) for a doubly linked list. It should return the head of the updated list."
  }
};

const linkedListCodeTemplates = {
  singly: {
    javascript: `function insertAtHead(head, value) {
  return { value, next: head };
}`,
    python: `def insert_at_head(head, value):
    return {"value": value, "next": head}`,
    cpp: `struct Node {
    int value;
    Node* next;
    Node(int v) : value(v), next(nullptr) {}
};

Node* insertAtHead(Node* head, int value) {
    Node* node = new Node(value);
    node->next = head;
    return node;
}`,
    c: `typedef struct Node {
    int value;
    struct Node* next;
} Node;

Node* insertAtHead(Node* head, int value) {
    Node* node = (Node*)malloc(sizeof(Node));
    node->value = value;
    node->next = head;
    return node;
}`,
    java: `class Node {
    int value;
    Node next;
    Node(int value) { this.value = value; }
}

static Node insertAtHead(Node head, int value) {
    Node node = new Node(value);
    node.next = head;
    return node;
}`
  },
  doubly: {
    javascript: `function insertAtTail(head, value) {
  const node = { value, prev: null, next: null };
  if (!head) return node;

  let curr = head;
  while (curr.next) curr = curr.next;

  curr.next = node;
  node.prev = curr;
  return head;
}`,
    python: `def insert_at_tail(head, value):
    node = {"value": value, "prev": None, "next": None}
    if head is None:
        return node
    curr = head
    while curr["next"] is not None:
        curr = curr["next"]
    curr["next"] = node
    node["prev"] = curr
    return head`,
    cpp: `struct Node {
    int value;
    Node* prev;
    Node* next;
    Node(int v) : value(v), prev(nullptr), next(nullptr) {}
};

Node* insertAtTail(Node* head, int value) {
    Node* node = new Node(value);
    if (!head) return node;
    Node* curr = head;
    while (curr->next) curr = curr->next;
    curr->next = node;
    node->prev = curr;
    return head;
}`,
    c: `typedef struct Node {
    int value;
    struct Node* prev;
    struct Node* next;
} Node;

Node* insertAtTail(Node* head, int value) {
    Node* node = (Node*)malloc(sizeof(Node));
    node->value = value;
    node->prev = NULL;
    node->next = NULL;
    if (!head) return node;
    Node* curr = head;
    while (curr->next) curr = curr->next;
    curr->next = node;
    node->prev = curr;
    return head;
}`,
    java: `class Node {
    int value;
    Node prev, next;
    Node(int value) { this.value = value; }
}

static Node insertAtTail(Node head, int value) {
    Node node = new Node(value);
    if (head == null) return node;
    Node curr = head;
    while (curr.next != null) curr = curr.next;
    curr.next = node;
    node.prev = curr;
    return head;
}`
  }
};

function LinkedListOverview({ listType }) {
  const isDoubly = listType === "doubly";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize operations of a{" "}
          {isDoubly ? "Doubly Linked List" : "Singly Linked List"}, including insertion,
          deletion, traversal, and searching using node-based dynamic storage.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        {!isDoubly ? (
          <>
            <p>
              A singly linked list is a linear data structure made of nodes. Each node stores
              data and a pointer to the next node. The last node points to NULL.
            </p>
            <p>
              <strong>Key operations:</strong>
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Insert at head</li>
              <li>Insert at tail</li>
              <li>Delete head</li>
              <li>Delete tail</li>
              <li>Traverse from head to tail</li>
              <li>Search for a value</li>
            </ul>
            <p>
              <strong>Advantage:</strong> Dynamic size and efficient insertion at head.
            </p>
            <p>
              <strong>Limitation:</strong> No backward traversal.
            </p>
          </>
        ) : (
          <>
            <p>
              A doubly linked list is a linear data structure where each node stores data,
              a pointer to the previous node, and a pointer to the next node.
            </p>
            <p>
              <strong>Key operations:</strong>
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Insert at head</li>
              <li>Insert at tail</li>
              <li>Delete head</li>
              <li>Delete tail</li>
              <li>Forward traversal</li>
              <li>Backward traversal</li>
              <li>Search for a value</li>
            </ul>
            <p>
              <strong>Advantage:</strong> Traversal in both directions.
            </p>
            <p>
              <strong>Limitation:</strong> More memory per node due to extra pointer.
            </p>
          </>
        )}
      </section>
    </div>
  );
}

function LinkedListNode({ value, isHead, isTail, isHighlighted }) {
  return (
    <div
      style={{
        minWidth: 72,
        padding: "14px 16px",
        borderRadius: 12,
        background: isHighlighted
          ? "linear-gradient(135deg, rgba(34,197,94,0.28), rgba(16,185,129,0.2))"
          : "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(129,140,248,0.2))",
        border: isHighlighted ? "2px solid #22c55e" : "2px solid #38bdf8",
        color: "#fff",
        fontWeight: 700,
        textAlign: "center",
        boxShadow: isHighlighted
          ? "0 0 18px rgba(34,197,94,0.45)"
          : "0 4px 12px rgba(56,189,248,0.15)",
        position: "relative",
        transition: "all 0.25s ease"
      }}
    >
      {isHead && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: 8,
            fontSize: 12,
            fontWeight: 800,
            color: "#10b981"
          }}
        >
          HEAD
        </div>
      )}
      {isTail && (
        <div
          style={{
            position: "absolute",
            top: -12,
            right: 8,
            fontSize: 12,
            fontWeight: 800,
            color: "#f59e0b"
          }}
        >
          TAIL
        </div>
      )}
      {value}
    </div>
  );
}

function LinkedListSimulation({
  listType,
  nodes,
  input,
  setInput,
  searchValue,
  setSearchValue,
  insertHead,
  insertTail,
  deleteHead,
  deleteTail,
  traverseForward,
  traverseBackward,
  searchNode,
  reset,
  message,
  inputRef,
  highlightedIndex
}) {
  const isDoubly = listType === "doubly";

  return (
    <section className="card experiment">
      <h2>
        Simulation{" "}
        <span style={{ color: "#38bdf8" }}>
          ({isDoubly ? "Doubly Linked List" : "Singly Linked List"})
        </span>
      </h2>

      <div className="controls">
        <div>
          <label>Node Value</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
            placeholder="Enter value"
            style={{ color: "#ffffff" }}
          />
        </div>

        <div>
          <label>Search Value</label>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Enter value to search"
            style={{ color: "#ffffff" }}
          />
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={insertHead}>
            Insert Head
          </button>
          <button className="btn primary" onClick={insertTail}>
            Insert Tail
          </button>
          <button className="btn secondary" onClick={deleteHead}>
            Delete Head
          </button>
          <button className="btn danger" onClick={deleteTail}>
            Delete Tail
          </button>
          <button className="btn info" onClick={traverseForward}>
            Traverse Forward
          </button>
          {isDoubly && (
            <button className="btn success" onClick={traverseBackward}>
              Traverse Backward
            </button>
          )}
          <button className="btn info" onClick={searchNode}>
            Search
          </button>
          <button className="btn secondary" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <div className="info-box">{message || "Perform an operation to begin."}</div>

      <div className="workspace" style={{ flexWrap: "wrap", minHeight: 120 }}>
        {nodes.length === 0 ? (
          <div style={{ color: "#9ca3af", fontSize: "1.05rem" }}>Linked list is empty</div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
            {isDoubly && (
              <div style={{ color: "#94a3b8", fontWeight: 700, marginRight: 8 }}>NULL</div>
            )}

            {nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                <LinkedListNode
                  value={node.value}
                  isHead={index === 0}
                  isTail={index === nodes.length - 1}
                  isHighlighted={index === highlightedIndex}
                />
                {index < nodes.length - 1 ? (
                  <div
                    style={{
                      color: "#ffffff",
                      fontSize: 22,
                      fontWeight: 700,
                      minWidth: isDoubly ? 44 : 28,
                      textAlign: "center"
                    }}
                  >
                    {isDoubly ? "⇄" : "→"}
                  </div>
                ) : (
                  <div
                    style={{
                      color: "#94a3b8",
                      fontWeight: 700,
                      minWidth: isDoubly ? 44 : 28,
                      textAlign: "center"
                    }}
                  >
                    → NULL
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function LinkedListQuiz({
  listType,
  quizQuestions,
  quizAnswers,
  quizSubmitted,
  quizScore,
  experimentRun,
  handleQuizAnswer,
  submitQuiz
}) {
  return (
    <section className="card">
      <h2>
        Quiz{" "}
        <span style={{ color: "#38bdf8" }}>
          ({listType === "doubly" ? "Doubly Linked List" : "Singly Linked List"})
        </span>
      </h2>

      {!experimentRun ? (
        <p style={{ color: "#d1d5db" }}>
          Please run the experiment at least once before attempting the quiz.
        </p>
      ) : (
        <div>
          {quizQuestions.map((q, i) => (
            <div
              key={i}
              style={{
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: "1px solid var(--border)"
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <strong style={{ color: "#e5e7eb", fontSize: "1.05rem" }}>
                  {i + 1}. {q.question}
                </strong>
              </div>

              <div style={{ marginLeft: 20 }}>
                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                      cursor: "pointer",
                      color: "#d1d5db"
                    }}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={quizAnswers[i] === j}
                      onChange={() => handleQuizAnswer(i, j)}
                      disabled={quizSubmitted}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {!quizSubmitted ? (
            <button className="btn primary" onClick={submitQuiz}>
              Submit Quiz
            </button>
          ) : (
            <div
              style={{
                marginTop: 16,
                padding: "1rem",
                background: "rgba(56,189,248,0.1)",
                borderRadius: 8,
                borderLeft: "4px solid #38bdf8"
              }}
            >
              <strong style={{ color: "#38bdf8", fontSize: "1.1rem" }}>
                Quiz Score: {quizScore} / {quizQuestions.length}
              </strong>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function LinkedListCoding({
  codingProblem,
  selectedLanguage,
  setSelectedLanguage,
  code,
  setCode,
  codeResult,
  runCode
}) {
  return (
    <section className="card">
      <h2>Coding Practice</h2>
      <p>
        Practice linked list logic in your preferred language. JavaScript execution works now.
        Other languages can be enabled later with Judge0.
      </p>

      <div className="coding-problem">
        <h3>{codingProblem.title}</h3>
        <p>{codingProblem.description}</p>

        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              color: "#e5e7eb",
              fontWeight: 600
            }}
          >
            Select Language
          </label>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="lab-select"
            style={{ minWidth: "220px" }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
          </select>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={14}
          style={{
            width: "100%",
            fontFamily: "monospace",
            color: "#000000"
          }}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button className="btn secondary" onClick={runCode}>
            Run Code
          </button>
        </div>

        {selectedLanguage !== "javascript" && (
          <p style={{ marginTop: 12, color: "#fbbf24", fontWeight: 600 }}>
            Execution for {selectedLanguage.toUpperCase()} will be enabled later with Judge0.
          </p>
        )}

        {codeResult && (
          <p className="result" style={{ marginTop: 12 }}>
            {codeResult}
          </p>
        )}
      </div>
    </section>
  );
}

export default function LinkedListLab() {
  const [listType, setListType] = useState("singly");
  const [nodes, setNodes] = useState([]);
  const [input, setInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Linked list initialized.");
  const [experimentRun, setExperimentRun] = useState(false);

  const quizQuestions = useMemo(
    () => (listType === "doubly" ? doublyQuizQuestions : singlyQuizQuestions),
    [listType]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(3).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(linkedListCodeTemplates.singly.javascript);
  const [codeResult, setCodeResult] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    setNodes([]);
    setInput("");
    setSearchValue("");
    setHighlightedIndex(null);
    setMessage("Linked list initialized.");
    setExperimentRun(false);
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCodeResult("");
  }, [listType, quizQuestions.length]);

  useEffect(() => {
    setCode(linkedListCodeTemplates[listType][selectedLanguage]);
    setCodeResult("");
  }, [listType, selectedLanguage]);

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
    setExperimentRun(true);
    inputRef.current?.focus();

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: `${listType}-linked-list`, time: Date.now() })
    );
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
    setExperimentRun(true);
    inputRef.current?.focus();

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: `${listType}-linked-list`, time: Date.now() })
    );
  };

  const deleteHead = () => {
    if (nodes.length === 0) {
      setMessage("Cannot delete head. Linked list is empty.");
      return;
    }

    const removed = nodes[0].value;
    setNodes((prev) => prev.slice(1));
    setHighlightedIndex(null);
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
    setMessage(`Deleted tail node (${removed}).`);
    setExperimentRun(true);
  };

  const traverseForward = () => {
    if (nodes.length === 0) {
      setMessage("Linked list is empty.");
      return;
    }

    setHighlightedIndex(null);
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
    setMessage(
      `Backward Traversal: NULL ← ${[...nodes]
        .reverse()
        .map((n) => n.value)
        .join(" ← ")}`
    );
    setExperimentRun(true);
  };

  const searchNode = () => {
    if (!searchValue.trim()) {
      setMessage("Please enter a value to search.");
      return;
    }

    if (nodes.length === 0) {
      setMessage("Linked list is empty.");
      setHighlightedIndex(null);
      return;
    }

    const index = nodes.findIndex(
      (node) => String(node.value).trim() === searchValue.trim()
    );

    if (index === -1) {
      setHighlightedIndex(null);
      setMessage(`Value ${searchValue.trim()} not found in the linked list.`);
    } else {
      setHighlightedIndex(index);
      setMessage(`Value ${searchValue.trim()} found at position ${index}.`);
    }

    setExperimentRun(true);
  };

  const reset = () => {
    setNodes([]);
    setInput("");
    setSearchValue("");
    setHighlightedIndex(null);
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

  const runCode = () => {
    if (selectedLanguage !== "javascript") {
      setCodeResult(
        `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      );
      return;
    }

    try {
      let result;

      if (listType === "singly") {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "head",
          "value",
          `${code}; return insertAtHead(head, value);`
        );
        result = fn({ value: 20, next: null }, 10);
      } else {
        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "head",
          "value",
          `${code}; return insertAtTail(head, value);`
        );
        result = fn({ value: 10, prev: null, next: null }, 20);
      }

      setCodeResult(`Output: ${JSON.stringify(result)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  const codingProblem =
    listType === "doubly" ? codingProblemByType.doubly : codingProblemByType.singly;

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Linked List</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>List Type</h2>
        <select
          value={listType}
          onChange={(e) => setListType(e.target.value)}
          className="lab-select"
          style={{ minWidth: "240px" }}
        >
          <option value="singly">Singly Linked List</option>
          <option value="doubly">Doubly Linked List</option>
        </select>
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
            />
          )}

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
            />
          )}

          {activeSection === "coding" && (
            <LinkedListCoding
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