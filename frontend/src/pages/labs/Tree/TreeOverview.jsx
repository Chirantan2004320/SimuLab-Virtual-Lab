import React from "react";
import { GitBranch, Target, Clock3, Database, CheckCircle2, BookOpen } from "lucide-react";

export default function TreeOverview({ treeMode }) {
  const isBST = treeMode === "bst";

  const data = isBST
    ? {
        name: "Binary Search Tree",
        badge: "Ordered Binary Tree",
        aim: "To understand and visualize BST insertion, traversal, searching, and deletion.",
        theory:
          "A Binary Search Tree is a special binary tree where values smaller than a node are placed in the left subtree, and values larger than a node are placed in the right subtree. This ordering allows efficient searching, insertion, and deletion when the tree remains reasonably balanced.",
        time: "Average Search / Insert / Delete: O(log n), Worst Case: O(n)",
        space: "O(n)",
        rule: "Left subtree values are smaller, right subtree values are larger.",
        steps: [
          "Start from the root node.",
          "Compare the new or target value with the current node.",
          "Move left if the value is smaller.",
          "Move right if the value is larger.",
          "Repeat until the correct position or target is found.",
          "Use tree traversals to inspect the structure."
        ],
        usage:
          "BSTs are useful for ordered data storage, fast lookup, range queries, and as a foundation for advanced balanced trees."
      }
    : {
        name: "Binary Tree",
        badge: "Hierarchical Structure",
        aim: "To understand and visualize node insertion and traversals such as preorder, inorder, and postorder in a binary tree.",
        theory:
          "A binary tree is a hierarchical data structure where each node can have at most two children: a left child and a right child. Trees are used to represent hierarchical relationships and recursive structures. Traversals provide systematic ways to visit all nodes in different orders.",
        time: "Traversal Time: O(n)",
        space: "O(n)",
        rule: "Each node can have at most two children.",
        steps: [
          "Start from the root node.",
          "Insert new nodes level by level in this simulation.",
          "Use preorder to visit Root → Left → Right.",
          "Use inorder to visit Left → Root → Right.",
          "Use postorder to visit Left → Right → Root.",
          "Observe how traversal order changes the output."
        ],
        usage:
          "Binary trees are used in expression trees, hierarchical storage, recursive problem solving, and as a base for BST, Heap, and AVL trees."
      };

  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Understand the structure, flow, and key ideas of {data.name}.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>{data.name}</h3>
          <span className="overview-badge">{data.badge}</span>
        </div>

        <p className="overview-hero-text">{data.theory}</p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>{data.aim}</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Clock3 size={18} />
            <h4>Time Complexity</h4>
          </div>
          <p>{data.time}</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Database size={18} />
            <h4>Space Complexity</h4>
          </div>
          <p>{data.space}</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Key Rule</h4>
          </div>
          <p>{data.rule}</p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <GitBranch size={18} />
          <h4>How It Works</h4>
        </div>

        <ol className="overview-steps-list">
          {data.steps.map((step, index) => (
            <li key={index}>
              <span className="overview-step-index">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <BookOpen size={18} />
          <h4>Where It Is Useful</h4>
        </div>
        <p>{data.usage}</p>
      </div>
    </section>
  );
}