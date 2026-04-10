import React, { useEffect, useMemo, useRef, useState } from "react";

// ✅ global css
import "../../../../styles/Lab.css";

// ✅ OPTIONAL (only if needed)


// ✅ correct (same folder)
import TreeOverview from "./TreeOverview";
import TreeSimulation from "./TreeSimulation";
import TreeQuiz from "./TreeQuiz";
import TreeCoding from "./TreeCoding";

const treeQuizQuestions = [
  {
    question: "A binary tree node can have at most how many children?",
    options: ["1", "2", "3", "Unlimited"],
    correct: 1
  },
  {
    question: "Which traversal visits Left → Root → Right?",
    options: ["Preorder", "Inorder", "Postorder", "Level order"],
    correct: 1
  },
  {
    question: "In a BST, values smaller than a node go to:",
    options: ["Right subtree", "Left subtree", "Any side", "Nowhere"],
    correct: 1
  }
];

const treeCodeTemplates = {
  javascript: `function inorderTraversal(root) {
  const result = [];

  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    result.push(node.value);
    dfs(node.right);
  }

  dfs(root);
  return result;
}`,
  python: `def inorder_traversal(root):
    result = []

    def dfs(node):
        if node is None:
            return
        dfs(node["left"])
        result.append(node["value"])
        dfs(node["right"])

    dfs(root)
    return result`,
  cpp: `void inorderTraversal(Node* root, vector<int>& result) {
    if (!root) return;
    inorderTraversal(root->left, result);
    result.push_back(root->value);
    inorderTraversal(root->right, result);
}`,
  c: `void inorderTraversal(struct Node* root, int result[], int* index) {
    if (root == NULL) return;
    inorderTraversal(root->left, result, index);
    result[(*index)++] = root->value;
    inorderTraversal(root->right, result, index);
}`,
  java: `static void inorderTraversal(Node root, List<Integer> result) {
    if (root == null) return;
    inorderTraversal(root.left, result);
    result.add(root.value);
    inorderTraversal(root.right, result);
}`
};

const codingProblem = {
  title: "Implement inorderTraversal(root)",
  description:
    "Write a function inorderTraversal(root) that returns the inorder traversal of a tree."
};

const createNode = (value) => ({
  id: `${Date.now()}-${Math.random()}`,
  value,
  left: null,
  right: null
});

const cloneTree = (node) => {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
};

const insertLevelOrder = (root, value) => {
  const newNode = createNode(value);

  if (!root) return newNode;

  const clonedRoot = cloneTree(root);
  const queue = [clonedRoot];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current.left) {
      current.left = newNode;
      return clonedRoot;
    } else {
      queue.push(current.left);
    }

    if (!current.right) {
      current.right = newNode;
      return clonedRoot;
    } else {
      queue.push(current.right);
    }
  }

  return clonedRoot;
};

const insertBST = (root, value) => {
  const numericValue = Number(value);

  if (!root) {
    return { root: createNode(numericValue), inserted: true, duplicate: false };
  }

  const clonedRoot = cloneTree(root);
  let current = clonedRoot;

  while (current) {
    if (numericValue === Number(current.value)) {
      return { root: clonedRoot, inserted: false, duplicate: true };
    }

    if (numericValue < Number(current.value)) {
      if (!current.left) {
        current.left = createNode(numericValue);
        return { root: clonedRoot, inserted: true, duplicate: false };
      }
      current = current.left;
    } else {
      if (!current.right) {
        current.right = createNode(numericValue);
        return { root: clonedRoot, inserted: true, duplicate: false };
      }
      current = current.right;
    }
  }

  return { root: clonedRoot, inserted: false, duplicate: false };
};

const deleteBST = (root, value) => {
  if (!root) return { root: null, deleted: false };

  const target = Number(value);
  const clonedRoot = cloneTree(root);
  let deleted = false;

  const removeNode = (node, val) => {
    if (!node) return null;

    if (val < Number(node.value)) {
      node.left = removeNode(node.left, val);
      return node;
    }

    if (val > Number(node.value)) {
      node.right = removeNode(node.right, val);
      return node;
    }

    deleted = true;

    // Case 1: no child
    if (!node.left && !node.right) {
      return null;
    }

    // Case 2: one child
    if (!node.left) return node.right;
    if (!node.right) return node.left;

    // Case 3: two children
    let successor = node.right;
    while (successor.left) {
      successor = successor.left;
    }

    node.value = successor.value;
    node.right = removeNode(node.right, Number(successor.value));
    return node;
  };

  const updatedRoot = removeNode(clonedRoot, target);
  return { root: updatedRoot, deleted };
};

const buildPreorderNodes = (root, result = []) => {
  if (!root) return result;
  result.push(root);
  buildPreorderNodes(root.left, result);
  buildPreorderNodes(root.right, result);
  return result;
};

const buildInorderNodes = (root, result = []) => {
  if (!root) return result;
  buildInorderNodes(root.left, result);
  result.push(root);
  buildInorderNodes(root.right, result);
  return result;
};

const buildPostorderNodes = (root, result = []) => {
  if (!root) return result;
  buildPostorderNodes(root.left, result);
  buildPostorderNodes(root.right, result);
  result.push(root);
  return result;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function TreeLab() {
  const [treeMode, setTreeMode] = useState("binary");
  const [treeRoot, setTreeRoot] = useState(null);
  const [input, setInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deleteInput, setDeleteInput] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [message, setMessage] = useState("Tree initialized.");
  const [experimentRun, setExperimentRun] = useState(false);
  const [lastTraversal, setLastTraversal] = useState([]);
  const [visitedNodeIds, setVisitedNodeIds] = useState([]);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);

  const stopRequestedRef = useRef(false);

  const quizQuestions = useMemo(() => treeQuizQuestions, []);

  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(treeCodeTemplates.javascript);
  const [codeResult, setCodeResult] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [quizQuestions.length]);

  useEffect(() => {
    setCode(treeCodeTemplates[selectedLanguage]);
    setCodeResult("");
  }, [selectedLanguage]);

  useEffect(() => {
    setTreeRoot(null);
    setInput("");
    setSearchInput("");
    setDeleteInput("");
    setLastTraversal([]);
    setVisitedNodeIds([]);
    setActiveNodeId(null);
    setMessage(treeMode === "bst" ? "BST initialized." : "Binary tree initialized.");
    setExperimentRun(false);
  }, [treeMode]);

  const clearHighlights = () => {
    setVisitedNodeIds([]);
    setActiveNodeId(null);
    setLastTraversal([]);
  };

  const insertNode = () => {
    if (isRunning) return;

    if (!input.trim()) {
      setMessage("Please enter a node value.");
      return;
    }

    if (treeMode === "binary") {
      const value = input.trim();
      const updatedTree = insertLevelOrder(treeRoot, value);

      setTreeRoot(updatedTree);
      setMessage(`Inserted node ${value} into the binary tree.`);
    } else {
      if (Number.isNaN(Number(input.trim()))) {
        setMessage("Please enter a valid number for BST.");
        return;
      }

      const { root, inserted, duplicate } = insertBST(treeRoot, input.trim());

      if (duplicate) {
        setMessage("Duplicate values are not allowed in BST.");
        return;
      }

      if (inserted) {
        setTreeRoot(root);
        setMessage(`Inserted ${Number(input.trim())} into the BST.`);
      }
    }

    setInput("");
    clearHighlights();
    setExperimentRun(true);
    inputRef.current?.focus();

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({ name: treeMode === "bst" ? "bst" : "binary-tree", time: Date.now() })
    );
  };

  const stopTraversal = () => {
    stopRequestedRef.current = true;
    setMessage("Stopping operation...");
  };

  const animateTraversal = async (type) => {
    if (!treeRoot || isRunning) {
      if (!treeRoot) setMessage("Tree is empty.");
      return;
    }

    stopRequestedRef.current = false;
    setIsRunning(true);
    setVisitedNodeIds([]);
    setActiveNodeId(null);
    setLastTraversal([]);
    setExperimentRun(true);

    try {
      const nodeSequence =
        type === "preorder"
          ? buildPreorderNodes(treeRoot, [])
          : type === "inorder"
          ? buildInorderNodes(treeRoot, [])
          : buildPostorderNodes(treeRoot, []);

      const values = [];

      for (let i = 0; i < nodeSequence.length; i++) {
        if (stopRequestedRef.current) {
          setActiveNodeId(null);
          setMessage(`${type[0].toUpperCase() + type.slice(1)} traversal stopped.`);
          return;
        }

        const node = nodeSequence[i];
        setActiveNodeId(node.id);
        setMessage(`${type[0].toUpperCase() + type.slice(1)}: Visiting node ${node.value}`);

        await sleep(animationSpeed);

        values.push(node.value);
        setVisitedNodeIds((prev) => [...prev, node.id]);
        setLastTraversal([...values]);

        await sleep(Math.max(180, animationSpeed / 2));
      }

      setActiveNodeId(null);
      setMessage(`${type[0].toUpperCase() + type.slice(1)} Traversal: ${values.join(" → ")}`);
    } finally {
      setIsRunning(false);
      stopRequestedRef.current = false;
    }
  };

  const searchBST = async (customTarget = null) => {
  if (treeMode !== "bst") {
    setMessage("Search visualization is available only in BST mode.");
    return { found: false, pathValues: [] };
  }

  if (!treeRoot) {
    setMessage("BST is empty.");
    return { found: false, pathValues: [] };
  }

  if (isRunning) return { found: false, pathValues: [] };

  const rawValue = customTarget !== null ? String(customTarget) : searchInput.trim();

  if (!rawValue || Number.isNaN(Number(rawValue))) {
    setMessage("Please enter a valid search value for BST.");
    return { found: false, pathValues: [] };
  }

  const target = Number(rawValue);

  stopRequestedRef.current = false;
  setIsRunning(true);
  setVisitedNodeIds([]);
  setActiveNodeId(null);
  setLastTraversal([]);
  setExperimentRun(true);

  try {
    let current = treeRoot;
    const pathValues = [];

    while (current) {
      const node = current;

      if (stopRequestedRef.current) {
        setActiveNodeId(null);
        setMessage("BST search stopped.");
        return { found: false, pathValues };
      }

      setActiveNodeId(node.id);
      pathValues.push(node.value);

      setMessage(`Checking node ${node.value}...`);
      await sleep(animationSpeed);

      setVisitedNodeIds((prev) => [...prev, node.id]);

      if (Number(node.value) === target) {
        setLastTraversal([...pathValues]);
        setActiveNodeId(null);
        setMessage(`Found ${target} in BST. Path: ${pathValues.join(" → ")}`);
        return { found: true, pathValues };
      }

      if (target < Number(node.value)) {
        setMessage(`${target} is smaller than ${node.value}. Going left.`);
        await sleep(Math.max(220, animationSpeed / 1.5));
        current = node.left;
      } else {
        setMessage(`${target} is greater than ${node.value}. Going right.`);
        await sleep(Math.max(220, animationSpeed / 1.5));
        current = node.right;
      }
    }

    setActiveNodeId(null);
    setLastTraversal([...pathValues]);
    setMessage(`${target} not found in BST. Path checked: ${pathValues.join(" → ")}`);
    return { found: false, pathValues };
  } finally {
    setIsRunning(false);
    stopRequestedRef.current = false;
  }
};


  const deleteNodeHandler = async () => {
    if (treeMode !== "bst") {
      setMessage("Delete is available only in BST mode.");
      return;
    }

    if (!treeRoot) {
      setMessage("BST is empty.");
      return;
    }

    if (isRunning) return;

    if (!deleteInput.trim() || Number.isNaN(Number(deleteInput.trim()))) {
      setMessage("Enter a valid value to delete.");
      return;
    }

    const target = Number(deleteInput.trim());

    const searchResult = await searchBST(target);

    if (!searchResult.found) {
      setMessage(`${target} does not exist in BST, so nothing was deleted.`);
      return;
    }

    const result = deleteBST(treeRoot, target);

    setTreeRoot(result.root);
    setDeleteInput("");
    setActiveNodeId(null);
    setVisitedNodeIds([]);
    setLastTraversal([]);

    if (result.deleted) {
      setMessage(`Deleted ${target} from BST.`);
    } else {
      setMessage(`${target} was not deleted.`);
    }

    setExperimentRun(true);
  };

  const runPreorder = async () => {
    await animateTraversal("preorder");
  };

  const runInorder = async () => {
    await animateTraversal("inorder");
  };

  const runPostorder = async () => {
    await animateTraversal("postorder");
  };

  const loadSampleTree = () => {
    if (isRunning) return;

    let root = null;

    if (treeMode === "binary") {
      ["10", "20", "30", "40", "50", "60", "70"].forEach((value) => {
        root = insertLevelOrder(root, value);
      });
      setMessage("Loaded sample binary tree.");
    } else {
      [40, 20, 60, 10, 30, 50, 70].forEach((value) => {
        const result = insertBST(root, value);
        root = result.root;
      });
      setMessage("Loaded sample BST.");
    }

    setTreeRoot(root);
    clearHighlights();
    setExperimentRun(true);
  };

  const reset = () => {
    if (isRunning) return;

    setTreeRoot(null);
    setInput("");
    setSearchInput("");
    setDeleteInput("");
    clearHighlights();
    setMessage(treeMode === "bst" ? "BST reset." : "Binary tree reset.");
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
      experiment: treeMode === "bst" ? "bst" : "binary-tree",
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
      const sampleTree = {
        value: 40,
        left: {
          value: 20,
          left: { value: 10, left: null, right: null },
          right: { value: 30, left: null, right: null }
        },
        right: {
          value: 60,
          left: { value: 50, left: null, right: null },
          right: { value: 70, left: null, right: null }
        }
      };

      // eslint-disable-next-line no-new-func
      const fn = new Function("root", `${code}; return inorderTraversal(root);`);
      const result = fn(sampleTree);

      setCodeResult(`Output: ${JSON.stringify(result)}`);
    } catch (error) {
      setCodeResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Virtual Lab – Tree</h1>

      <section className="card" style={{ marginBottom: "20px" }}>
        <h2>Tree Mode</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <select
              value={treeMode}
              onChange={(e) => setTreeMode(e.target.value)}
              className="lab-select"
              style={{ minWidth: "240px" }}
              disabled={isRunning}
            >
              <option value="binary">Binary Tree</option>
              <option value="bst">Binary Search Tree (BST)</option>
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
          {activeSection === "overview" && <TreeOverview />}

          {activeSection === "simulation" && (
            <TreeSimulation
              treeMode={treeMode}
              treeRoot={treeRoot}
              input={input}
              setInput={setInput}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              deleteInput={deleteInput}
              setDeleteInput={setDeleteInput}
              insertNode={insertNode}
              runPreorder={runPreorder}
              runInorder={runInorder}
              runPostorder={runPostorder}
              searchBST={searchBST}
              deleteNodeHandler={deleteNodeHandler}
              stopTraversal={stopTraversal}
              loadSampleTree={loadSampleTree}
              reset={reset}
              message={message}
              inputRef={inputRef}
              lastTraversal={lastTraversal}
              visitedNodeIds={visitedNodeIds}
              activeNodeId={activeNodeId}
              isRunning={isRunning}
            />
          )}

          {activeSection === "quiz" && (
            <TreeQuiz
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
            <TreeCoding
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