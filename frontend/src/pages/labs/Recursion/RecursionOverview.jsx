import React from "react";
import { GitBranch, Target, Clock3, Database, CheckCircle2, BookOpen } from "lucide-react";

export default function RecursionOverview({ recursionType }) {
  const isFibonacci = recursionType === "fibonacci";

  const data = isFibonacci
    ? {
        name: "Fibonacci Recursion",
        badge: "Tree Recursion",
        aim: "To understand and visualize recursion using Fibonacci with recursive calls, base cases, and return flow.",
        theory:
          "Recursion is a programming technique where a function calls itself to solve smaller subproblems. In recursive Fibonacci, each call may create two more calls, which forms a recursion tree. This makes Fibonacci a powerful example for understanding branching recursive flow and repeated subproblems.",
        time: "Naive Recursive Time: O(2ⁿ)",
        space: "O(n) call stack space",
        rule: "Base cases: fibonacci(0) = 0 and fibonacci(1) = 1",
        steps: [
          "Start with fibonacci(n).",
          "If n is 0, return 0.",
          "If n is 1, return 1.",
          "Otherwise compute fibonacci(n - 1).",
          "Then compute fibonacci(n - 2).",
          "Add both returned values.",
          "Return the final result upward through the call stack."
        ],
        usage:
          "Fibonacci recursion helps explain recursion trees, overlapping subproblems, and why optimized techniques like memoization are useful."
      }
    : {
        name: "Factorial Recursion",
        badge: "Single Recursion",
        aim: "To understand and visualize recursion using Factorial with recursive calls, base case, and return flow.",
        theory:
          "Recursion is a programming technique where a function solves a problem by calling itself on a smaller input. Factorial is one of the most common recursive examples because each call reduces the problem size by one until a simple base case is reached.",
        time: "Time Complexity: O(n)",
        space: "O(n) call stack space",
        rule: "Base cases: factorial(0) = 1 and factorial(1) = 1",
        steps: [
          "Start with factorial(n).",
          "If n is 0 or 1, return 1.",
          "Otherwise call factorial(n - 1).",
          "Wait for the smaller subproblem to return.",
          "Multiply n by the returned value.",
          "Return the result upward through the call stack."
        ],
        usage:
          "Factorial recursion is useful for teaching recursive breakdown, base cases, and return flow in a simple and structured way."
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
            Learn the recursive idea, flow, and complexity of {data.name}.
          </p>
        </div>
      </div>

      <div className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>{data.name}</h3>
          <span className="overview-badge">{data.badge}</span>
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
            <h4>Base Rule</h4>
          </div>
          <p>{data.rule}</p>
        </div>
      </div>

      <div className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <GitBranch size={18} />
          <h4>Recursive Flow</h4>
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
          <BookOpen size={18} />
          <h4>Why It Matters</h4>
        </div>
        <p>{data.usage}</p>
      </div>
    </section>
  );
}