import React from "react";
import { BookOpen, Target, Clock3, Database, CheckCircle2 } from "lucide-react";

const QueueOverview = ({ queueType }) => {
  const isCircular = queueType === "circular";

  const data = isCircular
    ? {
        title: "Circular Queue",
        aim: "To understand how a Circular Queue improves memory usage by reusing vacant positions through wrap-around indexing.",
        theory:
          "A Circular Queue is an advanced variation of a normal queue in which the last position is logically connected back to the first. This overcomes the unused-space problem of a linear queue. When the rear reaches the end of the array, it wraps around to the beginning if there is free space available. This makes Circular Queue highly efficient for fixed-size buffer systems.",
        steps: [
          "Insert elements at the rear position.",
          "Remove elements from the front position.",
          "Use modulo arithmetic to wrap indices.",
          "Detect full condition when advancing rear reaches front.",
          "Detect empty condition when there are no elements left.",
          "Reuse freed positions efficiently."
        ],
        time: "Enqueue: O(1), Dequeue: O(1), Peek: O(1)",
        space: "O(n)",
        status: "Efficient fixed-size queue structure",
        usage:
          "Used in CPU round-robin scheduling, circular buffers, streaming systems, I/O buffering, and real-time embedded systems."
      }
    : {
        title: "Queue",
        aim: "To understand and visualize queue operations and study the FIFO (First In First Out) principle.",
        theory:
          "A Queue is a linear data structure that follows the FIFO rule, meaning the first element inserted is the first one removed. Elements are added from the rear and removed from the front. It is widely used where order of processing matters, such as scheduling, buffering, and request handling systems.",
        steps: [
          "Insert an element at the rear using enqueue.",
          "Remove an element from the front using dequeue.",
          "Peek the front element without deleting it.",
          "Check whether the queue is empty.",
          "Check whether the queue is full in fixed-capacity implementations.",
          "Continue processing in FIFO order."
        ],
        time: "Enqueue: O(1), Dequeue: O(1), Peek: O(1)",
        space: "O(n)",
        status: "FIFO linear data structure",
        usage:
          "Used in printer queues, customer waiting systems, breadth-first search, task scheduling, buffering, and message handling."
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
            Learn the concept, operations, and applications of {data.title}.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>{data.title}</h3>
          <span className="overview-badge">Queue Data Structure</span>
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
            <h4>Key Characteristic</h4>
          </div>
          <p>{data.status}</p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <BookOpen size={18} />
          <h4>Core Operations Flow</h4>
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
          <Target size={18} />
          <h4>Applications</h4>
        </div>
        <p>{data.usage}</p>
      </div>
    </section>
  );
};

export default QueueOverview;