import React from "react";

export default function RecursionOverview({ recursionType }) {
  const isFibonacci = recursionType === "fibonacci";

  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand and visualize recursion using{" "}
          {isFibonacci ? "Fibonacci" : "Factorial"} with recursive calls, base cases,
          and return flow.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>

        <p>
          Recursion is a programming technique in which a function calls itself to solve
          smaller instances of the same problem.
        </p>

        <p>
          Every recursive solution usually has:
        </p>

        <ul style={{ color: "#ffffff", lineHeight: "1.8" }}>
          <li><strong>Base Case</strong> – the condition that stops recursion</li>
          <li><strong>Recursive Case</strong> – the function calling itself with a smaller input</li>
          <li><strong>Call Stack</strong> – the sequence of active function calls</li>
        </ul>

        {!isFibonacci ? (
          <>
            <p>
              <strong>Factorial Formula:</strong> factorial(n) = n × factorial(n - 1)
            </p>
            <p>
              <strong>Base Case:</strong> factorial(0) = 1 and factorial(1) = 1
            </p>
            <p>
              Factorial is a classic example of recursion with one recursive call at each level.
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>Fibonacci Formula:</strong> fibonacci(n) = fibonacci(n - 1) + fibonacci(n - 2)
            </p>
            <p>
              <strong>Base Cases:</strong> fibonacci(0) = 0 and fibonacci(1) = 1
            </p>
            <p>
              Fibonacci is a recursive example with two recursive calls at many levels,
              which makes the call tree larger.
            </p>
          </>
        )}

        <p>
          <strong>Important:</strong> Without a proper base case, recursion may never stop and can cause stack overflow.
        </p>
      </section>
    </div>
  );
}