import React from "react";

export default function HeapOverview({ heapType }) {
  const isMin = heapType === "min";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize the working of a {isMin ? "Min Heap" : "Max Heap"},
          including insertion, extraction, and heap property maintenance.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A Heap is a complete binary tree commonly stored using an array.
        </p>

        <p>
          In a <strong>{isMin ? "Min Heap" : "Max Heap"}</strong>, every parent node is{" "}
          {isMin ? "smaller than or equal to" : "greater than or equal to"} its children.
          Therefore, the {isMin ? "minimum" : "maximum"} element is always at the root.
        </p>

        <p>
          <strong>Key operations:</strong>
        </p>

        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li>Insert – add a new element and heapify up</li>
          <li>Extract {isMin ? "Min" : "Max"} – remove the root and heapify down</li>
          <li>Peek – view the root element</li>
        </ul>

        <p>
          <strong>Array relations:</strong>
        </p>

        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li>Left child = 2i + 1</li>
          <li>Right child = 2i + 2</li>
          <li>Parent = Math.floor((i - 1) / 2)</li>
        </ul>

        <p>
          Heaps are used in priority queues, scheduling systems, top-k problems, and graph algorithms.
        </p>
      </section>
    </div>
  );
}