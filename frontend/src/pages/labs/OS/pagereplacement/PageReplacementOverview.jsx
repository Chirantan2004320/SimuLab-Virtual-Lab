import React from "react";

export default function PageReplacementOverview({ mode }) {
  const isFIFO = mode === "fifo";
  const isLRU = mode === "lru";
  const isOptimal = mode === "optimal";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize{" "}
          {isFIFO
            ? "FIFO Page Replacement"
            : isLRU
            ? "LRU Page Replacement"
            : "Optimal Page Replacement"}{" "}
          using page references and memory frames.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        {isFIFO && (
          <>
            <p>
              FIFO replaces the page that entered memory first.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Simple to implement</li>
              <li>Uses arrival order in memory</li>
              <li>May replace frequently used old pages</li>
            </ul>
          </>
        )}

        {isLRU && (
          <>
            <p>
              LRU replaces the page that has not been used for the longest time in the past.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Uses recent usage history</li>
              <li>Usually performs better than FIFO</li>
              <li>Needs tracking of page access times</li>
            </ul>
          </>
        )}

        {isOptimal && (
          <>
            <p>
              Optimal replaces the page whose next use is farthest in the future.
            </p>
            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Gives minimum possible page faults</li>
              <li>Mostly used as a benchmark</li>
              <li>Needs future knowledge, so not practical in real systems</li>
            </ul>
          </>
        )}
      </section>

      <section className="card">
        <h2>Concepts Covered</h2>
        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li>Page Hit</li>
          <li>Page Fault</li>
          <li>Frames</li>
          <li>Replacement Decision</li>
          <li>Fault Comparison</li>
        </ul>
      </section>
    </div>
  );
}