import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlaskConical } from "lucide-react";
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
  },
  {
    question: "What happens first in BFS after visiting a node?",
    options: [
      "Its neighbors are pushed into a stack",
      "Its neighbors are added to a queue",
      "The graph is sorted",
      "The node is deleted"
    ],
    correct: 1
  },
  {
    question: "BFS is commonly used for:",
    options: [
      "Cycle detection only",
      "Finding minimum spanning tree directly",
      "Shortest path in an unweighted graph",
      "Heap insertion"
    ],
    correct: 2
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
  },
  {
    question: "What does DFS do when it reaches a dead end?",
    options: ["Stops immediately", "Backtracks", "Sorts neighbors", "Restarts graph"],
    correct: 1
  },
  {
    question: "DFS is useful in:",
    options: [
      "Tree/graph traversal and path exploration",
      "Heapify down",
      "Queue management only",
      "Matrix multiplication only"
    ],
    correct: 0
  }
];

const bfsProblemBank = [
  {
    id: 1,
    title: "Implement bfs(graph, start)",
    description:
      "Write a function bfs(graph, start) that returns the BFS traversal order starting from the given node.",
    functionName: "bfs",
    tests: [
      [
        {
          A: ["B", "C"],
          B: ["A", "D", "E"],
          C: ["A", "F"],
          D: ["B"],
          E: ["B"],
          F: ["C"]
        },
        "A"
      ],
      [
        {
          X: ["Y"],
          Y: ["X", "Z"],
          Z: ["Y"]
        },
        "X"
      ]
    ],
    expected: [
      ["A", "B", "C", "D", "E", "F"],
      ["X", "Y", "Z"]
    ]
  },
  {
    id: 2,
    title: "Check if node is reachable using BFS",
    description:
      "Write a function canReachBFS(graph, start, target) that returns true if target can be reached from start using BFS.",
    functionName: "canReachBFS",
    tests: [
      [
        {
          A: ["B"],
          B: ["A", "C"],
          C: ["B"]
        },
        "A",
        "C"
      ],
      [
        {
          A: ["B"],
          B: ["A"],
          C: []
        },
        "A",
        "C"
      ]
    ],
    expected: [true, false]
  },
  {
    id: 3,
    title: "Count visited nodes in BFS",
    description:
      "Write a function countVisitedBFS(graph, start) that returns how many nodes are visited by BFS starting from start.",
    functionName: "countVisitedBFS",
    tests: [
      [
        {
          A: ["B", "C"],
          B: ["A"],
          C: ["A"]
        },
        "A"
      ],
      [
        {
          X: []
        },
        "X"
      ]
    ],
    expected: [3, 1]
  },
  {
    id: 4,
    title: "Return BFS last visited node",
    description:
      "Write a function lastVisitedBFS(graph, start) that returns the last node visited during BFS traversal.",
    functionName: "lastVisitedBFS",
    tests: [
      [
        {
          A: ["B", "C"],
          B: ["A", "D"],
          C: ["A"],
          D: ["B"]
        },
        "A"
      ]
    ],
    expected: ["D"]
  },
  {
    id: 5,
    title: "Return BFS traversal as string",
    description:
      "Write a function bfsPathString(graph, start) that returns the BFS order joined by '->'.",
    functionName: "bfsPathString",
    tests: [
      [
        {
          A: ["B", "C"],
          B: ["A"],
          C: ["A"]
        },
        "A"
      ]
    ],
    expected: ["A->B->C"]
  }
];

const dfsProblemBank = [
  {
    id: 101,
    title: "Implement dfs(graph, start)",
    description:
      "Write a function dfs(graph, start) that returns the DFS traversal order starting from the given node.",
    functionName: "dfs",
    tests: [
      [
        {
          A: ["B", "C"],
          B: ["A", "D", "E"],
          C: ["A", "F"],
          D: ["B"],
          E: ["B"],
          F: ["C"]
        },
        "A"
      ],
      [
        {
          X: ["Y"],
          Y: ["X", "Z"],
          Z: ["Y"]
        },
        "X"
      ]
    ],
    expected: [
      ["A", "B", "D", "E", "C", "F"],
      ["X", "Y", "Z"]
    ]
  },
  {
    id: 102,
    title: "Check if node is reachable using DFS",
    description:
      "Write a function canReachDFS(graph, start, target) that returns true if target can be reached from start using DFS.",
    functionName: "canReachDFS",
    tests: [
      [
        {
          A: ["B"],
          B: ["A", "C"],
          C: ["B"]
        },
        "A",
        "C"
      ],
      [
        {
          A: ["B"],
          B: ["A"],
          C: []
        },
        "A",
        "C"
      ]
    ],
    expected: [true, false]
  },
  {
    id: 103,
    title: "Count visited nodes in DFS",
    description:
      "Write a function countVisitedDFS(graph, start) that returns how many nodes are visited by DFS starting from start.",
    functionName: "countVisitedDFS",
    tests: [
      [
        {
          A: ["B", "C"],
          B: ["A"],
          C: ["A"]
        },
        "A"
      ],
      [
        {
          X: []
        },
        "X"
      ]
    ],
    expected: [3, 1]
  },
  {
    id: 104,
    title: "Return DFS last visited node",
    description:
      "Write a function lastVisitedDFS(graph, start) that returns the last node visited during DFS traversal.",
    functionName: "lastVisitedDFS",
    tests: [
      [
        {
          A: ["B", "C"],
          B: ["A", "D"],
          C: ["A"],
          D: ["B"]
        },
        "A"
      ]
    ],
    expected: ["C"]
  },
  {
    id: 105,
    title: "Return DFS traversal as string",
    description:
      "Write a function dfsPathString(graph, start) that returns the DFS order joined by '->'.",
    functionName: "dfsPathString",
    tests: [
      [
        {
          A: ["B", "C"],
          B: ["A"],
          C: ["A"]
        },
        "A"
      ]
    ],
    expected: ["A->B->C"]
  }
];

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

function getStarterCode(problem, language) {
  const fn = problem.functionName;

  if (language === "python") {
    const map = {
      bfs: `def bfs(graph, start):
    # Write your solution here
    return []
`,
      canReachBFS: `def canReachBFS(graph, start, target):
    # Write your solution here
    return False
`,
      countVisitedBFS: `def countVisitedBFS(graph, start):
    # Write your solution here
    return 0
`,
      lastVisitedBFS: `def lastVisitedBFS(graph, start):
    # Write your solution here
    return None
`,
      bfsPathString: `def bfsPathString(graph, start):
    # Write your solution here
    return ""
`,
      dfs: `def dfs(graph, start):
    # Write your solution here
    return []
`,
      canReachDFS: `def canReachDFS(graph, start, target):
    # Write your solution here
    return False
`,
      countVisitedDFS: `def countVisitedDFS(graph, start):
    # Write your solution here
    return 0
`,
      lastVisitedDFS: `def lastVisitedDFS(graph, start):
    # Write your solution here
    return None
`,
      dfsPathString: `def dfsPathString(graph, start):
    # Write your solution here
    return ""
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
    bfs: `function bfs(graph, start) {
  // Write your solution here
  return [];
}
`,
    canReachBFS: `function canReachBFS(graph, start, target) {
  // Write your solution here
  return false;
}
`,
    countVisitedBFS: `function countVisitedBFS(graph, start) {
  // Write your solution here
  return 0;
}
`,
    lastVisitedBFS: `function lastVisitedBFS(graph, start) {
  // Write your solution here
  return null;
}
`,
    bfsPathString: `function bfsPathString(graph, start) {
  // Write your solution here
  return "";
}
`,
    dfs: `function dfs(graph, start) {
  // Write your solution here
  return [];
}
`,
    canReachDFS: `function canReachDFS(graph, start, target) {
  // Write your solution here
  return false;
}
`,
    countVisitedDFS: `function countVisitedDFS(graph, start) {
  // Write your solution here
  return 0;
}
`,
    lastVisitedDFS: `function lastVisitedDFS(graph, start) {
  // Write your solution here
  return null;
}
`,
    dfsPathString: `function dfsPathString(graph, start) {
  // Write your solution here
  return "";
}
`
  };

  return map[fn] || `function solve() {\n  // Write your solution here\n}\n`;
}

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
  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [selectedLanguages, setSelectedLanguages] = useState({});
  const [results, setResults] = useState({});

  useEffect(() => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setCurrentProblems([]);
    setCodes({});
    setSelectedLanguages({});
    setResults({});
  }, [quizQuestions.length, traversalType]);

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

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const generateProblems = () => {
    const bank = traversalType === "dfs" ? dfsProblemBank : bfsProblemBank;
    const shuffled = [...bank].sort(() => 0.5 - Math.random());
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
      const allOutputs = [];
      let allCorrect = true;

      for (let i = 0; i < problem.tests.length; i++) {
        const args = problem.tests[i].map((item) =>
          typeof item === "object" && item !== null ? JSON.parse(JSON.stringify(item)) : item
        );
        const expected = problem.expected[i];

        const fn = new Function(
          ...Array.from({ length: args.length }, (_, index) => `arg${index}`),
          `${code}; return ${problem.functionName}(${args.map((_, index) => `arg${index}`).join(", ")});`
        );

        const result = fn(...args);
        allOutputs.push(result);

        if (JSON.stringify(result) !== JSON.stringify(expected)) {
          allCorrect = false;
          break;
        }
      }

      setResults((prev) => ({
        ...prev,
        [problemId]: allCorrect
          ? `Correct! Your outputs: ${allOutputs.map((o) => JSON.stringify(o)).join(", ")}`
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
      topic: "graph",
      traversalType,
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
      topic: "graph",
      traversalType,
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
              Interactive Graph Traversal Experiment
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            {traversalType === "dfs" ? "Depth-First Search" : "Breadth-First Search"}
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
            Build a graph, choose a start node, and visualize BFS or DFS traversal step by step.
          </p>
        </div>

        <section className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Traversal Settings</h2>

          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", alignItems: "end" }}>
            <div style={{ minWidth: "220px" }}>
              <label className="sorting-label">Traversal Type</label>
              <select
                value={traversalType}
                onChange={(e) => setTraversalType(e.target.value)}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value="bfs">BFS</option>
                <option value="dfs">DFS</option>
              </select>
            </div>

            <div style={{ minWidth: "220px" }}>
              <label className="sorting-label">Animation Speed</label>
              <select
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="sorting-select"
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
                  redoQuiz={redoQuiz}
                />
              )}

              {activeSection === "coding" && (
                <GraphCoding
                  traversalType={traversalType}
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