import React from "react";

export default function HashTableOverview({ tableSize }) {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize a hash table using separate chaining for collision handling.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A hash table stores data using a hash function that maps keys to table indices.
        </p>

        <p>
          In this lab, the hash function used is:
        </p>

        <p>
          <strong>hash(key) = key % {tableSize}</strong>
        </p>

        <p>
          <strong>Operations:</strong>
        </p>

        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li>Insert → expected O(1)</li>
          <li>Search → expected O(1)</li>
          <li>Delete → expected O(1)</li>
        </ul>

        <p>
          <strong>Collision:</strong> When two values map to the same index.
        </p>

        <p>
          <strong>Collision handling:</strong> Separate Chaining, where each bucket stores a chain of values.
        </p>
      </section>
    </div>
  );
}