import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../Lab.css";
import "../../SortingLab.css";
import GraphOverview from "./GraphOverview";
import GraphSimulation from "./GraphSimulation";
import GraphQuiz from "./GraphQuiz";
import GraphCoding from "./GraphCoding";

const bfsQuizQuestions = [
  {
    question: "Breadth-First Search (BFS) uses which data structure?",
    options: ["Stack", "Queue", "Heap", "Linked List"],
    correct: 1
  },
  {
    question: "BFS is especially useful for:",
    options: [
      "Finding a shortest path in an unweighted graph",
      "Sorting arrays",
      "Building a heap",
      "Recursion only"
    ],
    correct: 0
  },
  {
    question: "BFS visits nodes:",
    options: ["Depth first", "Level by level", "Randomly", "Only leaf nodes"],
    correct: 1
  }
];

const dfsQuizQuestions = [
  {
    question: "Depth-First Search (DFS) commonly uses which data structure?",
    options: ["Queue", "Stack", "Heap", "Array only"],
    correct: 1
  },
  {
    question: "DFS explores nodes:",
    options: ["Level by level", "Deep along a path first", "In sorted order", "Only from right to left"],
    correct: 1
  },
  {
    question: "DFS is often implemented using:",
    options: ["Recursion", "Binary search", "Hashing", "Heap sort"],
    correct: 0
  }
];

const codingProblemByType = {
  bfs: {
    title: "Implement bfs(graph, start)",
    description:
      "Write a function bfs(graph, start) that returns the BFS traversal order starting from the given node."
  },
  dfs: {
    title: "Implement dfs(graph, start)",
    description:
      "Write a function dfs(graph, start) that returns the DFS traversal order starting from the given node."
  }
};

const graphCodeTemplates = {
  bfs: {
    javascript: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const order = [];

  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return order;
}`,
    python: `def bfs(graph, start):
    visited = set([start])
    queue = [start]
    order = []

    while queue:
        node = queue.pop(0)
        order.append(node)

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order`,
    cpp: `vector<string> bfs(map<string, vector<string>> graph, string start) {
    set<string> visited;
    queue<string> q;
    vector<string> order;

    visited.insert(start);
    q.push(start);

    while (!q.empty()) {
        string node = q.front();
        q.pop();
        order.push_back(node);

        for (string neighbor : graph[node]) {
            if (!visited.count(neighbor)) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }

    return order;
}`,
    c: `/* BFS in C is usually implemented with adjacency lists and a queue. */`,
    java: `static List<String> bfs(Map<String, List<String>> graph, String start) {
    Set<String> visited = new HashSet<>();
    Queue<String> queue = new LinkedList<>();
    List<String> order = new ArrayList<>();

    visited.add(start);
    queue.add(start);

    while (!queue.isEmpty()) {
        String node = queue.poll();
        order.add(node);

        for (String neighbor : graph.getOrDefault(node, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.add(neighbor);
            }
        }
    }

    return order;
}`
  },
  dfs: {
    javascript: `function dfs(graph, start) {
  const visited = new Set();
  const order = [];

  function traverse(node) {
    visited.add(node);
    order.push(node);

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        traverse(neighbor);
      }
    }
  }

  traverse(start);
  return order;
}`,
    python: `def dfs(graph, start):
    visited = set()
    order = []

    def traverse(node):
        visited.add(node)
        order.append(node)

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                traverse(neighbor)

    traverse(start)
    return order`,
    cpp: `void dfsHelper(map<string, vector<string>>& graph, string node, set<string>& visited, vector<string>& order) {
    visited.insert(node);
    order.push_back(node);

    for (string neighbor : graph[node]) {
        if (!visited.count(neighbor)) {
            dfsHelper(graph, neighbor, visited, order);
        }
    }
}`,
    c: `/* DFS in C is usually implemented with adjacency lists and recursion or a stack. */`,
    java: `static void dfsHelper(Map<String, List<String>> graph, String node, Set<String> visited, List<String> order) {
    visited.add(node);
    order.add(node);

    for (String neighbor : graph.getOrDefault(node, new ArrayList<>())) {
        if (!visited.contains(neighbor)) {
            dfsHelper(graph, neighbor, visited, order);
        }
    }
}`
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildAdjacencyList = (nodes, edges) => {
  const graph = {};

  nodes.forEach((node) => {
    graph[node] = [];
  });

  edges.forEach(([a, b]) => {
    if (!graph[a]) graph[a] = [];
    if (!graph[b]) graph[b] = [];

    if (!graph[a].includes(b)) graph[a].push(b);
    if (!graph[b].includes(a)) graph[b].push(a);
  });

  Object.keys(graph).forEach((key) => {
    graph[key].sort();
  });

  return graph;
};

export default function GraphLab() {
  const [traversalType, setTraversalType] = useState("bfs");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeInput, setNodeInput] = useState("");
  const [edgeInput, setEdgeInput] = useState("");
  const [startNode, setStartNode] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Graph initialized.");
  const [experimentRun, setExperimentRun] = useState(false);

  const [visitedNodes, setVisitedNodes] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [stepHistory, setStepHistory] = useState([]);

  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const stopRequestedRef = useRef(false);

  const nodeInputRef = useRef(null);

  const quizQuestions = useMemo(
    () => (traversalType === "dfs" ? dfsQuizQuestions : bfsQuizQuestions),
    [traversalType]
  );

  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(graphCodeTemplates.bfs.javascript);
  const [codeResult, setCodeResult] = useState("");

  useEffect(() => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [quizQuestions.length]);

  useEffect(() => {
    setCode(graphCodeTemplates[traversalType][selectedLanguage]);
    setCodeResult("");
  }, [traversalType, selectedLanguage]);

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const clearTraversalState = () => {
    setVisitedNodes([]);
    setActiveNode(null);
    setTraversalOrder([]);
    setStepHistory([]);
  };

  const addNode = () => {
    if (isRunning) return;

    const value = nodeInput.trim().toUpperCase();

    if (!value) {
      setMessage("Please enter a node label.");
      return;
    }

    if (nodes.includes(value)) {
      setMessage(`Node ${value} already exists.`);
      return;
    }

    setNodes((prev) => [...prev, value]);
    setNodeInput("");
    setMessage(`Added node ${value}.`);
    setExperimentRun(true);
    nodeInputRef.current?.focus();
  };

  const addEdge = () => {
    if (isRunning) return;

    const raw = edgeInput.trim().toUpperCase();

    if (!raw.includes("-")) {
      setMessage("Please enter edge in format A-B.");
      return;
    }

    const [a, b] = raw.split("-").map((s) => s.trim());

    if (!a || !b) {
      setMessage("Please enter a valid edge like A-B.");
      return;
    }

    if (a === b) {
      setMessage("Self-loops are not allowed in this graph visualizer.");
      return;
    }

    if (!nodes.includes(a) || !nodes.includes(b)) {
      setMessage("Both nodes must exist before adding an edge.");
      return;
    }

    const alreadyExists = edges.some(
      ([x, y]) => (x === a && y === b) || (x === b && y === a)
    );

    if (alreadyExists) {
      setMessage(`Edge ${a}-${b} already exists.`);
      return;
    }

    setEdges((prev) => [...prev, [a, b]]);
    setEdgeInput("");
    setMessage(`Added edge ${a}-${b}.`);
    setExperimentRun(true);
  };

  const stopTraversal = () => {
    stopRequestedRef.current = true;
    setMessage("Stopping traversal...");
    addStep("Stop requested by user.");
  };

  const runBFS = async () => {
    if (isRunning) return;

    const start = startNode.trim().toUpperCase();

    if (!start || !nodes.includes(start)) {
      setMessage("Please enter a valid start node.");
      return;
    }

    const graph = buildAdjacencyList(nodes, edges);

    stopRequestedRef.current = false;
    setIsRunning(true);
    clearTraversalState();
    setExperimentRun(true);

    try {
      const visited = new Set([start]);
      const queue = [start];
      const order = [];

      addStep(`Starting BFS from node ${start}.`);
      setMessage(`Starting BFS from ${start}...`);
      await sleep(animationSpeed);

      while (queue.length > 0) {
        if (stopRequestedRef.current) {
          setActiveNode(null);
          setMessage("BFS stopped.");
          return;
        }

        const node = queue.shift();
        setActiveNode(node);
        setMessage(`BFS visiting ${node}...`);
        addStep(`Dequeued ${node} and visiting it.`);
        await sleep(animationSpeed);

        order.push(node);
        setVisitedNodes((prev) => [...prev, node]);
        setTraversalOrder([...order]);

        for (const neighbor of graph[node] || []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
            addStep(`Discovered ${neighbor} from ${node}, added to queue.`);
          }
        }

        await sleep(Math.max(200, animationSpeed / 1.5));
      }

      setActiveNode(null);
      setMessage(`BFS Traversal: ${order.join(" → ")}`);
      addStep(`BFS complete. Order: ${order.join(" → ")}.`);
    } finally {
      setIsRunning(false);
      stopRequestedRef.current = false;
    }
  };

  const runDFS = async () => {
    if (isRunning) return;

    const start = startNode.trim().toUpperCase();

    if (!start || !nodes.includes(start)) {
      setMessage("Please enter a valid start node.");
      return;
    }

    const graph = buildAdjacencyList(nodes, edges);

    stopRequestedRef.current = false;
    setIsRunning(true);
    clearTraversalState();
    setExperimentRun(true);

    try {
      const visited = new Set();
      const order = [];

      addStep(`Starting DFS from node ${start}.`);
      setMessage(`Starting DFS from ${start}...`);
      await sleep(animationSpeed);

      const dfsVisit = async (node) => {
        if (stopRequestedRef.current) return;

        visited.add(node);
        setActiveNode(node);
        setMessage(`DFS visiting ${node}...`);
        addStep(`Visited ${node}.`);
        await sleep(animationSpeed);

        order.push(node);
        setVisitedNodes((prev) => [...prev, node]);
        setTraversalOrder([...order]);

        for (const neighbor of graph[node] || []) {
          if (!visited.has(neighbor)) {
            addStep(`Going deeper from ${node} to ${neighbor}.`);
            await sleep(Math.max(180, animationSpeed / 1.8));
            await dfsVisit(neighbor);
            if (stopRequestedRef.current) return;
          }
        }
      };

      await dfsVisit(start);

      if (!stopRequestedRef.current) {
        setActiveNode(null);
        setMessage(`DFS Traversal: ${order.join(" → ")}`);
        addStep(`DFS complete. Order: ${order.join(" → ")}.`);
      }
    } finally {
      setIsRunning(false);
      stopRequestedRef.current = false;
    }
  };

  const runTraversal = async () => {
    if (traversalType === "dfs") {
      await runDFS();
    } else {
      await runBFS();
    }
  };

  const loadSampleGraph = () => {
    if (isRunning) return;

    const sampleNodes = ["A", "B", "C", "D", "E", "F"];
    const sampleEdges = [
      ["A", "B"],
      ["A", "C"],
      ["B", "D"],
      ["B", "E"],
      ["C", "F"]
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setStartNode("A");
    clearTraversalState();
    setMessage("Loaded sample graph.");
    setExperimentRun(true);
  };

  const reset = () => {
    if (isRunning) return;

    setNodes([]);
    setEdges([]);
    setNodeInput("");
    setEdgeInput("");
    setStartNode("");
    clearTraversalState();
    setMessage("Graph reset.");
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
      experiment: traversalType === "dfs" ? "dfs-graph" : "bfs-graph",
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

      if (traversalType === "bfs") {
        // eslint-disable-next-line no-new-func
        const fn = new Function("graph", "start", `${code}; return bfs(graph, start);`);
        result = fn(
          {
            A: ["B", "C"],
            B: ["A", "D", "E"],
            C: ["A", "F"],
            D: ["B"],
            E: ["B"],
            F: ["C"]
          },
          "A"
        );
      } else {
        // eslint-disable-next-line no-new-func
        const fn = new Function("graph", "start", `${code}; return dfs(graph, start);`);
        result = fn(
          {
            A: ["B", "C"],
            B: ["A", "D", "E"],
            C: ["A", "F"],
            D: ["B"],
            E: ["B"],
            F: ["C"]
          },
          "A"
        );
      }

      setCodeResult(`Output: ${JSON.stringify(result)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Graph Traversal</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Traversal Settings</h2>

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
              Traversal Type
            </label>
            <select
              value={traversalType}
              onChange={(e) => setTraversalType(e.target.value)}
              className="lab-select"
              style={{ minWidth: "220px" }}
              disabled={isRunning}
            >
              <option value="bfs">BFS</option>
              <option value="dfs">DFS</option>
            </select>
          </div>

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
              <option value={1100}>Slow</option>
              <option value={700}>Normal</option>
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
          {activeSection === "overview" && <GraphOverview traversalType={traversalType} />}

          {activeSection === "simulation" && (
            <GraphSimulation
              traversalType={traversalType}
              nodes={nodes}
              edges={edges}
              nodeInput={nodeInput}
              setNodeInput={setNodeInput}
              edgeInput={edgeInput}
              setEdgeInput={setEdgeInput}
              startNode={startNode}
              setStartNode={setStartNode}
              addNode={addNode}
              addEdge={addEdge}
              runTraversal={runTraversal}
              stopTraversal={stopTraversal}
              loadSampleGraph={loadSampleGraph}
              reset={reset}
              message={message}
              nodeInputRef={nodeInputRef}
              visitedNodes={visitedNodes}
              activeNode={activeNode}
              traversalOrder={traversalOrder}
              stepHistory={stepHistory}
              isRunning={isRunning}
            />
          )}

          {activeSection === "quiz" && (
            <GraphQuiz
              traversalType={traversalType}
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
            <GraphCoding
              traversalType={traversalType}
              codingProblem={codingProblemByType[traversalType]}
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