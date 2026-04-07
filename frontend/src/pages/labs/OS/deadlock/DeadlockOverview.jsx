import React from "react";

export default function DeadlockOverview({ mode }) {
  const isConditions = mode === "conditions";
  const isRag = mode === "rag";
  const isBanker = mode === "banker";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize{" "}
          {isConditions
            ? "the necessary conditions for deadlock"
            : isRag
            ? "Resource Allocation Graph based deadlock representation"
            : "Banker’s Algorithm for deadlock avoidance"}{" "}
          in Operating Systems.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {isConditions && (
          <>
            <p>
              Deadlock is a condition where a set of processes wait indefinitely for resources held by each other.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Mutual Exclusion</li>
              <li>Hold and Wait</li>
              <li>No Preemption</li>
              <li>Circular Wait</li>
            </ul>
          </>
        )}

        {isRag && (
          <>
            <p>
              A Resource Allocation Graph represents processes, resources, and their request/allocation relationships.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Processes are shown as circles</li>
              <li>Resources are shown as boxes</li>
              <li>Cycles may indicate deadlock</li>
            </ul>
          </>
        )}

        {isBanker && (
          <>
            <p>
              Banker’s Algorithm avoids deadlock by checking whether resource allocation keeps the system in a safe state.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Uses Allocation, Max, Need, and Available data</li>
              <li>Searches for a safe sequence</li>
              <li>Prevents unsafe allocations</li>
            </ul>
          </>
        )}
      </section>

      <section className="card">
        <h2>Concepts Covered</h2>
        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li>Deadlock Basics</li>
          <li>Coffman Conditions</li>
          <li>Resource Allocation Graph</li>
          <li>Safe and Unsafe State</li>
          <li>Deadlock Avoidance</li>
        </ul>
      </section>
    </div>
  );
}