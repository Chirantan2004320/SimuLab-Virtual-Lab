import React from "react";
import { Link } from "react-router-dom";
import "./Lab.css";

export default function DSALabIndex() {
  const experiments = [
  {
    name: "Sorting Experiments",
    path: "/labs/dsa/sorting",
    desc: "Visualize and quiz on sorting algorithms",
    icon: "🔢",
    color: "#38bdf8"
  },
  {
    name: "Queue",
    path: "/labs/dsa/queue",
    desc: "Queue operations (enqueue/dequeue) with quiz",
    icon: "📋",
    color: "#10b981"
  },
  {
    name: "Linked List",
    path: "/labs/dsa/linked-list",
    desc: "Singly linked list operations and quiz",
    icon: "🔗",
    color: "#f59e0b"
  },
  {
    name: "Stack",
    path: "/labs/dsa/stack",
    desc: "Stack operations (push/pop) with visualization and quiz",
    icon: "📚",
    color: "#a78bfa"
  },
  {
  name: "Searching Algorithms",
  path: "/labs/dsa/searching",
  desc: "Linear and Binary Search visualization with quiz",
  icon: "🔍",
  color: "#ec4899"
},
{
  name: "Recursion Visualizer",
  path: "/labs/dsa/recursion",
  desc: "Visualize factorial and fibonacci recursion with call stack trace",
  icon: "🌀",
  color: "#8b5cf6"
},
{
  name: "Binary Tree",
  path: "/labs/dsa/tree",
  desc: "Insert nodes and visualize inorder, preorder, and postorder traversals",
  icon: "🌳",
  color: "#22c55e"
},
{
  name: "Heap / Priority Queue",
  path: "/labs/dsa/heap",
  desc: "Visualize Max Heap insert, extract max, and heapify operations",
  icon: "📦",
  color: "#06b6d4"
},
{
  name: "Graph Traversal",
  path: "/labs/dsa/graph",
  desc: "Build a graph and visualize BFS and DFS traversals",
  icon: "🕸️",
  color: "#f43f5e"
},
{
  name: "Hash Table",
  path: "/labs/dsa/hash-table",
  desc: "Visualize hashing, collisions, and operations like insert, search, and delete",
  icon: "🗂️",
  color: "#8b5cf6"
}
];

  return (
    <div className="lab-root">
      <div className="lab-header">
        <h1 className="lab-title">📊 DSA Lab</h1>
        <p className="lab-desc">Choose an experiment to begin. Each experiment contains an interactive visual demo and a short quiz.</p>
      </div>

      <section className="lab-list">
        {experiments.map((exp, i) => (
          <div key={i} className="card experiment-card" style={{borderLeftColor: exp.color}}>
            <div className="experiment-header">
              <span className="experiment-icon">{exp.icon}</span>
              <h3 className="experiment-name">{exp.name}</h3>
            </div>
            <p className="experiment-info">{exp.desc}</p>
            <Link to={exp.path} className="experiment-btn">Start Experiment <span>→</span></Link>
          </div>
        ))}
      </section>
    </div>
  );
}
