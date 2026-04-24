import React from "react";
import { GitBranch, Target, Clock3, Database, CheckCircle2, BookOpen } from "lucide-react";

export default function GraphOverview({ traversalType }) {
  const isDFS = traversalType === "dfs";

  const data = isDFS
    ? {
        name: "Depth-First Search (DFS)",
        badge: "Deep Traversal",
        aim: "To understand and visualize graph traversal using Depth-First Search (DFS).",
        theory:
          "A graph is a non-linear data structure consisting of vertices (nodes) and edges. Depth-First Search explores as deep as possible along a path before backtracking. It is often implemented using recursion or an explicit stack.",
        time: "Traversal Time: O(V + E)",
        space: "O(V)",
        rule: "Go deeper first, then backtrack when needed.",
        steps: [
          "Start from the chosen node.",
          "Mark the current node as visited.",
          "Visit one unvisited neighbor and continue deeper.",
          "Repeat until no unvisited neighbor remains.",
          "Backtrack to the previous node.",
          "Continue until all reachable nodes are visited."
        ],
        usage:
          "DFS is useful for path exploration, connected components, cycle detection, topological concepts, and recursion-based graph processing."
      }
    : {
        name: "Breadth-First Search (BFS)",
        badge: "Level Traversal",
        aim: "To understand and visualize graph traversal using Breadth-First Search (BFS).",
        theory:
          "A graph is a non-linear data structure consisting of vertices (nodes) and edges. Breadth-First Search explores nodes level by level from the start node. It uses a queue to ensure neighbors are visited before going deeper.",
        time: "Traversal Time: O(V + E)",
        space: "O(V)",
        rule: "Visit all nearest neighbors first before moving deeper.",
        steps: [
          "Start from the chosen node.",
          "Mark it visited and place it in a queue.",
          "Remove the front node from the queue.",
          "Visit its unvisited neighbors and enqueue them.",
          "Repeat for the next queued node.",
          "Continue until the queue becomes empty."
        ],
        usage:
          "BFS is useful for shortest paths in unweighted graphs, level-order exploration, network reachability, and minimum-step problems."
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
            Understand the traversal logic, working flow, and applications of {data.name}.
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
            <h4>Traversal Rule</h4>
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