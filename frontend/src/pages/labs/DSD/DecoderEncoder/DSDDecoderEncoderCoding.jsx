import React, { useState } from "react";

const problemBank = [
  {
    id: 1,
    title: "2-to-4 Decoder",
    description:
      "Write a function decoder2to4(a, b) that returns an array [Y0, Y1, Y2, Y3] with one active output."
  },
  {
    id: 2,
    title: "4-to-2 Encoder",
    description:
      "Write a function encoder4to2(inputs) that returns the binary code of the active input."
  },
  {
    id: 3,
    title: "Decoder Selected Output",
    description:
      "Write a function selectedOutput(a, b) that returns the output index selected by the binary input."
  }
];

export default function DSDDecoderEncoderCoding() {
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
      return `function decoder2to4(a, b) {
  const index = a * 2 + b;
  const outputs = [0, 0, 0, 0];
  outputs[index] = 1;
  return outputs;
}`;
    }

    if (id === 2) {
      return `function encoder4to2(inputs) {
  const index = inputs.findIndex(v => v === 1);
  return index === -1 ? "--" : index.toString(2).padStart(2, "0");
}`;
    }

    return `function selectedOutput(a, b) {
  return a * 2 + b;
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
        const fn = new Function(`${code}; return decoder2to4;`)();
        const output = fn(1, 0);
        resultText = `Function ran successfully. Example decoder2to4(1,0) = [${output.join(", ")}]`;
      } else if (problemId === 2) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return encoder4to2;`)();
        const output = fn([0, 0, 1, 0]);
        resultText = `Function ran successfully. Example encoder4to2([0,0,1,0]) = ${output}`;
      } else if (problemId === 3) {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}; return selectedOutput;`)();
        const output = fn(1, 1);
        resultText = `Function ran successfully. Example selectedOutput(1,1) = ${output}`;
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
        Practice implementing decoder and encoder logic using JavaScript functions.
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
            rows={12}
            placeholder="Write your code here..."
            style={{
              width: "100%",
              fontFamily: "monospace",
              color: "#000",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "10px"
            }}
          />

          <button className="btn secondary" onClick={() => runCode(problem.id)}>
            Run Code
          </button>

          {results[problem.id] && (
            <p className="result" style={{ marginTop: "10px" }}>
              {results[problem.id]}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}