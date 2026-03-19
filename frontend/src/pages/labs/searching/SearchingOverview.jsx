import React from "react";

export default function SearchingOverview({ searchType }) {
  const isBinary = searchType === "binary";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize the working of{" "}
          {isBinary ? "Binary Search" : "Linear Search"} for finding a target element in an array.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        {!isBinary ? (
          <>
            <p>
              Linear Search is a simple searching algorithm in which each element of the array
              is checked one by one until the target is found or the array ends.
            </p>

            <p>
              <strong>Key points:</strong>
            </p>

            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Works on both sorted and unsorted arrays</li>
              <li>Checks elements sequentially</li>
              <li>Easy to implement</li>
              <li>Worst-case time complexity: O(n)</li>
            </ul>

            <p>
              <strong>Use case:</strong> Suitable for small or unsorted datasets.
            </p>
          </>
        ) : (
          <>
            <p>
              Binary Search is an efficient searching algorithm that works on a{" "}
              <strong>sorted array</strong>. It repeatedly compares the target with the middle
              element and reduces the search range by half.
            </p>

            <p>
              <strong>Key points:</strong>
            </p>

            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Works only on sorted arrays</li>
              <li>Checks the middle element first</li>
              <li>Reduces the search range by half each step</li>
              <li>Worst-case time complexity: O(log n)</li>
            </ul>

            <p>
              <strong>Use case:</strong> Suitable for fast searching in sorted datasets.
            </p>
          </>
        )}
      </section>
    </div>
  );
}