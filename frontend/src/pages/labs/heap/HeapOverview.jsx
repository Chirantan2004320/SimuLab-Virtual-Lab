import React from "react";
import { GitBranch, Target, Clock3, Database, CheckCircle2, BookOpen } from "lucide-react";

export default function HeapOverview({ heapType }) {
  const isMin = heapType === "min";

  const data = isMin
    ? {
        name: "Min Heap",
        badge: "Priority Structure",
        aim: "To understand and visualize the working of a Min Heap, including insertion, extraction, and heap property maintenance.",
        theory:
          "A Heap is a complete binary tree commonly stored using an array. In a Min Heap, each parent node is smaller than or equal to its children, which guarantees that the minimum value always remains at the root.",
        time: "Insert / Extract / Heapify: O(log n), Peek: O(1)",
        space: "O(n)",
        rule: "Parent is always smaller than or equal to its children.",
        steps: [
          "Insert a new value at the end of the array.",
          "Heapify up until the Min Heap property is restored.",
          "To extract, remove the root value.",
          "Move the last element to the root position.",
          "Heapify down by swapping with the smaller child when needed.",
          "Continue until the heap property is restored."
        ],
        usage:
          "Min Heaps are used in priority queues, shortest path algorithms, task scheduling, and event simulation."
      }
    : {
        name: "Max Heap",
        badge: "Priority Structure",
        aim: "To understand and visualize the working of a Max Heap, including insertion, extraction, and heap property maintenance.",
        theory:
          "A Heap is a complete binary tree commonly stored using an array. In a Max Heap, each parent node is greater than or equal to its children, which guarantees that the maximum value always remains at the root.",
        time: "Insert / Extract / Heapify: O(log n), Peek: O(1)",
        space: "O(n)",
        rule: "Parent is always greater than or equal to its children.",
        steps: [
          "Insert a new value at the end of the array.",
          "Heapify up until the Max Heap property is restored.",
          "To extract, remove the root value.",
          "Move the last element to the root position.",
          "Heapify down by swapping with the larger child when needed.",
          "Continue until the heap property is restored."
        ],
        usage:
          "Max Heaps are used in priority queues, scheduling systems, top-k queries, and heap sort."
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
            Understand the structure, rules, and operations of {data.name}.
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
            <h4>Heap Rule</h4>
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