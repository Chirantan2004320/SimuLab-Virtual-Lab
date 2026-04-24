import React from "react";
import { Layers3, Target, Clock3, Database, CheckCircle2, BookOpen } from "lucide-react";

export default function StackOverview() {
  const steps = [
    "Create an empty stack structure.",
    "Push inserts a new element at the top of the stack.",
    "Pop removes the most recently inserted element.",
    "Peek displays the current top element without removing it.",
    "isEmpty checks whether the stack contains any element.",
    "size returns the total number of elements currently stored."
  ];

  return (
    <section className="overview-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 20 }}>
        <div className="sorting-sim-icon">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Overview</h2>
          <p className="sorting-sim-subtitle">
            Understand the stack data structure, its operations, and real-world use cases.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Stack</h3>
          <span className="overview-badge">Linear Data Structure</span>
        </div>

        <p className="overview-hero-text">
          A stack is a linear data structure that follows the <strong>LIFO</strong> principle,
          which means <strong>Last In, First Out</strong>. The most recently inserted element
          is the first one to be removed. Because all insertions and deletions happen only at
          one end, called the <strong>top</strong>, stacks are simple, efficient, and widely
          used in many computer science applications.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To understand and visualize stack operations such as push, pop, peek, isEmpty,
            and size using the LIFO principle.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Clock3 size={18} />
            <h4>Time Complexity</h4>
          </div>
          <p>Push: O(1), Pop: O(1), Peek: O(1), isEmpty: O(1), Size: O(1)</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Database size={18} />
            <h4>Space Complexity</h4>
          </div>
          <p>O(n), where n is the number of elements currently stored in the stack.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Access Rule</h4>
          </div>
          <p>
            Only the top element is directly accessible at any time. This makes stack
            operations fast and predictable.
          </p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Layers3 size={18} />
          <h4>How Stack Operations Work</h4>
        </div>

        <ol className="overview-steps-list">
          {steps.map((step, index) => (
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
          <h4>Applications</h4>
        </div>
        <p>
          Stacks are used in function call management, undo and redo systems, expression
          evaluation, syntax parsing, browser history navigation, backtracking algorithms,
          and balanced parentheses checking.
        </p>
      </div>
    </section>
  );
}