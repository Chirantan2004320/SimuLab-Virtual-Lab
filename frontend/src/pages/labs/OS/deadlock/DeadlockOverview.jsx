/* eslint-disable react/jsx-one-expression-per-line */

import React from "react";

import {
  Target,
  BookOpen,
  Clock3,
  Database,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

const modeNames = {
  conditions:
    "Deadlock Conditions",

  rag:
    "Resource Allocation Graph",

  banker:
    "Banker's Algorithm",
};

export default function DeadlockOverview({
  mode,
}) {

  const overviewData = {
    conditions: {
      aim:
        "To understand the four necessary Coffman conditions required for a deadlock to occur in an operating system.",

      theory:
        "Deadlock is a situation where multiple processes wait indefinitely for resources held by one another. A deadlock occurs only when all four Coffman conditions hold simultaneously in the system.",

      steps: [
        "Processes request shared system resources.",
        "Resources become allocated exclusively.",
        "Processes continue holding allocated resources while waiting for others.",
        "Resources cannot be forcibly removed from processes.",
        "Circular dependency forms among processes.",
        "All involved processes become permanently blocked."
      ],

      time:
        "Deadlock Detection Complexity: O(n)",

      space:
        "O(1)",

      stability:
        "Deadlock Detection",

      usage:
        "Deadlock condition analysis is widely used in operating systems, database management systems, distributed systems, and concurrent applications."
    },

    rag: {
      aim:
        "To understand how Resource Allocation Graphs represent process-resource relationships and help identify deadlocks.",

      theory:
        "A Resource Allocation Graph (RAG) is a directed graph used to represent processes, resources, allocation edges, and request edges. Cycles inside the graph may indicate potential deadlocks.",

      steps: [
        "Processes and resources are represented as graph nodes.",
        "Request edges indicate resource requests.",
        "Assignment edges indicate allocated resources.",
        "The system continuously tracks resource relationships.",
        "Cycles are checked within the graph structure.",
        "Deadlock possibility is analyzed based on cycle detection."
      ],

      time:
        "Graph Traversal Complexity: O(V + E)",

      space:
        "O(V + E)",

      stability:
        "Graph Based Detection",

      usage:
        "Resource Allocation Graphs are used in operating systems, distributed computing, transaction management systems, and deadlock detection mechanisms."
    },

    banker: {
      aim:
        "To understand how Banker’s Algorithm prevents deadlock by ensuring the system always remains in a safe state.",

      theory:
        "Banker’s Algorithm is a deadlock avoidance algorithm that checks whether granting a resource request keeps the system in a safe state. It uses Allocation, Max, Need, and Available matrices to determine safe execution sequences.",

      steps: [
        "Processes declare their maximum resource requirements.",
        "The system calculates the Need matrix.",
        "Available resources are checked before allocation.",
        "Safe sequence analysis is performed.",
        "Resources are allocated only if the system remains safe.",
        "Unsafe allocations are denied to avoid deadlock."
      ],

      time:
        "Safety Algorithm Complexity: O(n² × m)",

      space:
        "O(n × m)",

      stability:
        "Deadlock Avoidance",

      usage:
        "Banker’s Algorithm is used in operating systems, database systems, transaction processing systems, and multi-resource allocation environments."
    },
  };

  const data =
    overviewData[mode];

  return (
    <section className="overview-shell">

      <div
        className="sorting-sim-title-wrap"
        style={{ marginBottom: 20 }}
      >

        <div className="sorting-sim-icon">
          <ShieldAlert size={18} />
        </div>

        <div>

          <h2 className="sorting-sim-title">
            Overview
          </h2>

          <p className="sorting-sim-subtitle">
            Learn the concepts,
            execution flow, and
            resource handling logic
            of{" "}
            {
              modeNames[
                mode
              ]
            }.
          </p>

        </div>
      </div>

      <div className="overview-hero-card">

        <div className="overview-hero-header">

          <h3>
            {
              modeNames[
                mode
              ]
            }
          </h3>

          <span className="overview-badge">
            Deadlock Management
          </span>

        </div>

        <p className="overview-hero-text">
          {data.theory}
        </p>

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

            <h4>Complexity</h4>

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

            <CheckCircle2
              size={18}
            />

            <h4>Deadlock Type</h4>

          </div>

          <p>{data.stability}</p>

        </div>

      </div>

      <div className="overview-card overview-steps-card">

        <div className="overview-card-head">

          <BookOpen size={18} />

          <h4>Execution Steps</h4>

        </div>

        <ol className="overview-steps-list">

          {data.steps.map(
            (step, index) => (
              <li key={index}>

                <span className="overview-step-index">
                  {index + 1}
                </span>

                <span>{step}</span>

              </li>
            )
          )}

        </ol>

      </div>

      <div className="overview-card">

        <div className="overview-card-head">

          <Target size={18} />

          <h4>Where It Is Used</h4>

        </div>

        <p>{data.usage}</p>

      </div>

    </section>
  );
}