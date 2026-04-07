import React from "react";

export default function GraphOverview({ traversalType }) {
  const isDFS = traversalType === "dfs";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize graph traversal using{" "}
          {isDFS ? "Depth-First Search (DFS)" : "Breadth-First Search (BFS)"}.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        <p>
          A graph is a non-linear data structure consisting of vertices (nodes) and edges
          connecting those vertices.
        </p>

        <p>
          <strong>Graph traversal</strong> means visiting graph nodes in a systematic order.
        </p>

        {!isDFS ? (
          <>
            <p>
              <strong>Breadth-First Search (BFS)</strong> explores nodes level by level
              from the starting node.
            </p>

            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Uses a queue</li>
              <li>Visits nearest neighbors first</li>
              <li>Useful for shortest paths in unweighted graphs</li>
            </ul>
          </>
        ) : (
          <>
            <p>
              <strong>Depth-First Search (DFS)</strong> explores as deep as possible
              along a path before backtracking.
            </p>

            <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
              <li>Uses recursion or a stack</li>
              <li>Goes deep before visiting siblings</li>
              <li>Useful in path finding, cycle detection, and topological concepts</li>
            </ul>
          </>
        )}

        <p>
          In this virtual lab, you can build a graph, choose a start node, and animate
          the traversal step by step.
        </p>
      </section>
    </div>
  );
}