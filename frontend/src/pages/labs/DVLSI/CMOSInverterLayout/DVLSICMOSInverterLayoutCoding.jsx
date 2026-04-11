import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "Minimum Spacing Check",
    description:
      "Write a function checkSpacing(actual, required) that returns true if the chosen spacing satisfies the minimum rule."
  },
  {
    id: 2,
    title: "Contact Validation",
    description:
      "Write a function validContactSize(actual, required) that returns PASS or FAIL."
  },
  {
    id: 3,
    title: "Lambda Dimension Calculator",
    description:
      "Write a function dimensionInLambda(lambdaValue, multiplier) that returns the final layout dimension."
  }
];

export default function DVLSICMOSInverterLayoutCoding() {
  const [currentProblems, setCurrentProblems] = useState([]);
  const [codes, setCodes] = useState({});
  const [results, setResults] = useState({});

  const generateProblems = () => {
    setCurrentProblems(problemBank);
    const initialCodes = {};
    problemBank.forEach((p) => {
      initialCodes[p.id] = getStarterCode(p.id);
    });
    setCodes(initialCodes);
    setResults({});
  };

  const getStarterCode = (id) => {
    if (id === 1) {
      return `function checkSpacing(actual, required) {
  return actual >= required;
}`;
    }

    if (id === 2) {
      return `function validContactSize(actual, required) {
  return actual >= required ? "PASS" : "FAIL";
}`;
    }

    return `function dimensionInLambda(lambdaValue, multiplier) {
  return lambdaValue * multiplier;
}`;
  };

  const handleCodeChange = (problemId, code) => {
    setCodes((prev) => ({ ...prev, [problemId]: code }));
  };

  const runCode = (problemId) => {
    const code = codes[problemId];

    if (!code) {
      setResults((prev) => ({
        ...prev,
        [problemId]: "Please enter code first."
      }));
      return;
    }

    try {
      let resultText = "";

      if (problemId === 1) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return checkSpacing;`)();
        const output = fn(3, 2);
        resultText =
          typeof output === "boolean"
            ? `Function ran successfully. Example checkSpacing(3,2) = ${output}`
            : "Return value should be true or false.";
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return validContactSize;`)();
        const output = fn(1, 2);
        resultText =
          typeof output === "string"
            ? `Function ran successfully. Example validContactSize(1,2) = ${output}`
            : "Return value should be PASS or FAIL.";
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return dimensionInLambda;`)();
        const output = fn(2, 4);
        resultText =
          typeof output === "number"
            ? `Function ran successfully. Example dimensionInLambda(2,4) = ${output}`
            : "Return value should be a number.";
      }

      setResults((prev) => ({
        ...prev,
        [problemId]: resultText
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [problemId]: `Error: ${error.message}`
      }));
    }
  };

  return (
    <section className="card">
      <h2>Coding Practice</h2>
      <p>
        Practice simple layout rule validation and lambda-based dimension calculations.
      </p>

      <button className="btn primary" onClick={generateProblems}>
        Generate Problems
      </button>

      {currentProblems.map((problem, index) => (
        <div key={problem.id} className="coding-problem">
          <h3>
            Problem {index + 1}: {problem.title}
          </h3>
          <p>{problem.description}</p>

          <textarea
            value={codes[problem.id] || ""}
            onChange={(e) => handleCodeChange(problem.id, e.target.value)}
            placeholder="Write your code here..."
            rows={12}
            style={{
              width: "100%",
              fontFamily: "monospace",
              color: "#000000",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "10px"
            }}
          />

          <button className="btn secondary" onClick={() => runCode(problem.id)}>
            Run Code
          </button>

          {results[problem.id] && <p className="result">{results[problem.id]}</p>}
        </div>
      ))}
    </section>
  );
}