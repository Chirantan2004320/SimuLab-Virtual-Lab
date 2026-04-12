import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "Half Adder Sum",
    description:
      "Write a function halfAdderSum(A, B) that returns the Sum output of a Half Adder."
  },
  {
    id: 2,
    title: "Half Adder Carry",
    description:
      "Write a function halfAdderCarry(A, B) that returns the Carry output of a Half Adder."
  },
  {
    id: 3,
    title: "Full Adder Sum",
    description:
      "Write a function fullAdderSum(A, B, Cin) that returns the Sum output of a Full Adder."
  }
];

export default function DSDAddersCoding() {
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
      return `function halfAdderSum(A, B) {
  return A ^ B;
}`;
    }

    if (id === 2) {
      return `function halfAdderCarry(A, B) {
  return A & B;
}`;
    }

    return `function fullAdderSum(A, B, Cin) {
  return A ^ B ^ Cin;
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
        const fn = new Function(`${code}; return halfAdderSum;`)();
        const output = fn(1, 0);
        resultText = `Function ran successfully. Example halfAdderSum(1,0) = ${output}`;
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return halfAdderCarry;`)();
        const output = fn(1, 1);
        resultText = `Function ran successfully. Example halfAdderCarry(1,1) = ${output}`;
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return fullAdderSum;`)();
        const output = fn(1, 0, 1);
        resultText = `Function ran successfully. Example fullAdderSum(1,0,1) = ${output}`;
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
        Practice implementing Half Adder and Full Adder logic using simple functions.
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