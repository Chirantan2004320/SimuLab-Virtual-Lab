import React from "react";

export default function StackOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize the working of a stack, including push, pop, peek,
          checking emptiness, and size using the LIFO principle.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A stack is a linear data structure that follows the <strong>LIFO</strong> principle,
          which stands for <strong>Last In, First Out</strong>.
        </p>

        <p>
          This means the element inserted last is the first one to be removed.
        </p>

        <p>
          <strong>Key operations:</strong>
        </p>

        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li>Push – Insert an element at the top</li>
          <li>Pop – Remove the top element</li>
          <li>Peek/Top – View the top element</li>
          <li>isEmpty – Check whether the stack is empty</li>
          <li>Size – Number of elements currently in stack</li>
        </ul>

        <p>
          <strong>Applications:</strong> Function call stack, undo operations, expression
          evaluation, browser history, balanced parentheses.
        </p>

        <p>
          <strong>Time Complexity:</strong> Push, Pop, and Peek generally take O(1).
        </p>
      </section>
    </div>
  );
}