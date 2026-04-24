import React from "react";
import { BookOpen, Target, Clock3, Database, CheckCircle2, GitBranch } from "lucide-react";

export default function HashTableOverview({ tableSize }) {
  const steps = [
    "Take the input key.",
    `Compute the bucket index using key % ${tableSize}.`,
    "Go to the computed bucket.",
    "If the bucket is empty, insert directly.",
    "If the bucket already contains values, handle the collision using a chain.",
    "For search and delete, traverse only the corresponding chain."
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
            Understand hashing, collisions, and separate chaining in a fixed-size table.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Hash Table</h3>
          <span className="overview-badge">Collision Handling</span>
        </div>

        <p className="overview-hero-text">
          A hash table stores data by mapping keys to table indices using a hash function.
          In this lab, the hash function is <strong>key % {tableSize}</strong>. When multiple
          keys map to the same index, the collision is handled using separate chaining.
        </p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-head">
            <Target size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            To understand and visualize a hash table using separate chaining for collision handling.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Clock3 size={18} />
            <h4>Expected Time Complexity</h4>
          </div>
          <p>Insert: O(1), Search: O(1), Delete: O(1) on average.</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Database size={18} />
            <h4>Hash Function</h4>
          </div>
          <p>hash(key) = key % {tableSize}</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Collision Handling</h4>
          </div>
          <p>Separate chaining, where each bucket stores a linked sequence of values.</p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <GitBranch size={18} />
          <h4>How It Works</h4>
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
          <h4>Where It Is Useful</h4>
        </div>
        <p>
          Hash tables are widely used in dictionaries, caches, symbol tables, indexing systems,
          and fast lookup scenarios where near-constant average access time is important.
        </p>
      </div>
    </section>
  );
}