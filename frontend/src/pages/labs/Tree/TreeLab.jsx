import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlaskConical } from "lucide-react";
import "../../Lab.css";
import "../../SortingLab.css";
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
  },
  {
    question: "Which traversal visits Root → Left → Right?",
    options: ["Inorder", "Postorder", "Preorder", "Level order"],
    correct: 2
  },
  {
    question: "Which traversal processes nodes level by level?",
    options: ["Preorder", "Postorder", "Level order", "Inorder"],
    correct: 2
  }
];

const binaryProblemBank = [
  {
    id: 1,
    title: "Implement inorderTraversal(root)",
    description:
      "Write a function inorderTraversal(root) that returns the inorder traversal of a binary tree.",
    functionName: "inorderTraversal",
    tests: [
      {
        input: [
          {
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
          }
        ],
        expected: [10, 20, 30, 40, 50, 60, 70]
      }
    ]
  },
  {
    id: 2,
    title: "Implement preorderTraversal(root)",
    description:
      "Write a function preorderTraversal(root) that returns the preorder traversal of a binary tree.",
    functionName: "preorderTraversal",
    tests: [
      {
        input: [
          {
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
          }
        ],
        expected: [40, 20, 10, 30, 60, 50, 70]
      }
    ]
  },
  {
    id: 3,
    title: "Implement postorderTraversal(root)",
    description:
      "Write a function postorderTraversal(root) that returns the postorder traversal of a binary tree.",
    functionName: "postorderTraversal",
    tests: [
      {
        input: [
          {
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
          }
        ],
        expected: [10, 30, 20, 50, 70, 60, 40]
      }
    ]
  },
  {
    id: 4,
    title: "Count tree nodes",
    description:
      "Write a function countNodes(root) that returns the total number of nodes in the binary tree.",
    functionName: "countNodes",
    tests: [
      {
        input: [
          {
            value: 10,
            left: { value: 20, left: null, right: null },
            right: { value: 30, left: null, right: null }
          }
        ],
        expected: 3
      }
    ]
  },
  {
    id: 5,
    title: "Count leaf nodes",
    description:
      "Write a function countLeafNodes(root) that returns the number of leaf nodes in the binary tree.",
    functionName: "countLeafNodes",
    tests: [
      {
        input: [
          {
            value: 10,
            left: { value: 20, left: null, right: null },
            right: {
              value: 30,
              left: { value: 40, left: null, right: null },
              right: null
            }
          }
        ],
        expected: 2
      }
    ]
  }
];

const bstProblemBank = [
  {
    id: 101,
    title: "Implement inorderTraversal(root) for BST",
    description:
      "Write a function inorderTraversal(root) that returns the inorder traversal of a BST.",
    functionName: "inorderTraversal",
    tests: [
      {
        input: [
          {
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
          }
        ],
        expected: [10, 20, 30, 40, 50, 60, 70]
      }
    ]
  },
  {
    id: 102,
    title: "Implement searchBST(root, target)",
    description:
      "Write a function searchBST(root, target) that returns true if the target exists in the BST, otherwise false.",
    functionName: "searchBST",
    tests: [
      {
        input: [
          {
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
          },
          50
        ],
        expected: true
      },
      {
        input: [
          {
            value: 40,
            left: { value: 20, left: null, right: null },
            right: { value: 60, left: null, right: null }
          },
          25
        ],
        expected: false
      }
    ]
  },
  {
    id: 103,
    title: "Find minimum in BST",
    description:
      "Write a function findMinBST(root) that returns the minimum value present in the BST.",
    functionName: "findMinBST",
    tests: [
      {
        input: [
          {
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
          }
        ],
        expected: 10
      }
    ]
  },
  {
    id: 104,
    title: "Find maximum in BST",
    description:
      "Write a function findMaxBST(root) that returns the maximum value present in the BST.",
    functionName: "findMaxBST",
    tests: [
      {
        input: [
          {
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
          }
        ],
        expected: 70
      }
    ]
  },
  {
    id: 105,
    title: "Count BST nodes",
    description:
      "Write a function countNodes(root) that returns the total number of nodes in the BST.",
    functionName: "countNodes",
    tests: [
      {
        input: [
          {
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
          }
        ],
        expected: 7
      }
    ]
  }
];

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
  let replacementDeletionDone = false;

  const removeNode = (node, val, ignoreDeleteFlag = false) => {
    if (!node) return null;

    if (val < Number(node.value)) {
      node.left = removeNode(node.left, val, ignoreDeleteFlag);
      return node;
    }

    if (val > Number(node.value)) {
      node.right = removeNode(node.right, val, ignoreDeleteFlag);
      return node;
    }

    if (!ignoreDeleteFlag && !deleted) deleted = true;
    if (ignoreDeleteFlag) replacementDeletionDone = true;

    if (!node.left && !node.right) return null;
    if (!node.left) return node.right;
    if (!node.right) return node.left;

    let successor = node.right;
    while (successor.left) successor = successor.left;

    node.value = successor.value;
    node.right = removeNode(node.right, Number(successor.value), true);
    return node;
  };

  const updatedRoot = removeNode(clonedRoot, target);
  return { root: updatedRoot, deleted: deleted || replacementDeletionDone };
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

const buildLevelOrderNodes = (root) => {
  const result = [];
  if (!root) return result;

  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return result;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getStarterCode(problem, language) {
  const fn = problem.functionName;

  if (language === "python") {
    const map = {
      inorderTraversal: `def inorderTraversal(root):
    # Write your solution here
    return []
`,
      preorderTraversal: `def preorderTraversal(root):
    # Write your solution here
    return []
`,
      postorderTraversal: `def postorderTraversal(root):
    # Write your solution here
    return []
`,
      countNodes: `def countNodes(root):
    # Write your solution here
    return 0
`,
      countLeafNodes: `def countLeafNodes(root):
    # Write your solution here
    return 0
`,
      searchBST: `def searchBST(root, target):
    # Write your solution here
    return False
`,
      findMinBST: `def findMinBST(root):
    # Write your solution here
    return None
`,
      findMaxBST: `def findMaxBST(root):
    # Write your solution here
    return None
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
    inorderTraversal: `function inorderTraversal(root) {
  // Write your solution here
  return [];
}
`,
    preorderTraversal: `function preorderTraversal(root) {
  // Write your solution here
  return [];
}
`,
    postorderTraversal: `function postorderTraversal(root) {
  // Write your solution here
  return [];
}
`,
    countNodes: `function countNodes(root) {
  // Write your solution here
  return 0;
}
`,
    countLeafNodes: `function countLeafNodes(root) {
  // Write your solution here
  return 0;
}
`,
    searchBST: `function searchBST(root, target) {
  // Write your solution here
  return false;
}
`,
    findMinBST: `function findMinBST(root) {
  // Write your solution here
  return null;
}
`,
    findMaxBST: `function findMaxBST(root) {
  // Write your solution here
  return null;
}
`
  };

  return map[fn] || `function solve() {\n  // Write your solution here\n}\n`;
}

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
  const [nodeCount, setNodeCount] = useState(0);

  const stopRequestedRef = useRef(false);
  const quizQuestions = useMemo(() => treeQuizQuestions, []);

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

  useEffect(() => {
    setTreeRoot(null);
    setInput("");
    setSearchInput("");
    setDeleteInput("");
    setLastTraversal([]);
    setVisitedNodeIds([]);
    setActiveNodeId(null);
    setNodeCount(0);
    setMessage(treeMode === "bst" ? "BST initialized." : "Binary tree initialized.");
    setExperimentRun(false);
    setCurrentProblems([]);
    setSelectedLanguages({});
    setCodes({});
    setResults({});
  }, [treeMode]);

  useEffect(() => {
    const count = buildPreorderNodes(treeRoot, []).length;
    setNodeCount(count);
  }, [treeRoot]);

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
          : type === "postorder"
          ? buildPostorderNodes(treeRoot, [])
          : buildLevelOrderNodes(treeRoot);

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

  const runLevelOrder = async () => {
    await animateTraversal("level order");
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

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const generateProblems = () => {
    const bank = treeMode === "bst" ? bstProblemBank : binaryProblemBank;
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
      let allCorrect = true;
      const outputs = [];

      for (const test of problem.tests) {
        const args = test.input.map((item) =>
          typeof item === "object" && item !== null ? JSON.parse(JSON.stringify(item)) : item
        );

        const fn = new Function(
          ...Array.from({ length: args.length }, (_, i) => `arg${i}`),
          `${code}; return ${problem.functionName}(${args.map((_, i) => `arg${i}`).join(", ")});`
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
      topic: "tree",
      treeMode,
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
      topic: "tree",
      treeMode,
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
              Interactive Tree Experiment
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            {treeMode === "bst" ? "Binary Search Tree" : "Binary Tree"}
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
            Visualize tree insertion, traversals, BST search and delete operations, and practice tree-based coding problems.
          </p>
        </div>

        <section className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-4">Tree Configuration</h2>

          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", alignItems: "end" }}>
            <div style={{ minWidth: "240px" }}>
              <label className="sorting-label">Tree Mode</label>
              <select
                value={treeMode}
                onChange={(e) => setTreeMode(e.target.value)}
                className="sorting-select"
                disabled={isRunning}
              >
                <option value="binary">Binary Tree</option>
                <option value="bst">Binary Search Tree (BST)</option>
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
              {activeSection === "overview" && <TreeOverview treeMode={treeMode} />}

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
                  runLevelOrder={runLevelOrder}
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
                  nodeCount={nodeCount}
                />
              )}

              {activeSection === "quiz" && (
                <TreeQuiz
                  treeMode={treeMode}
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
                <TreeCoding
                  treeMode={treeMode}
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