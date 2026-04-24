import React, { useEffect, useMemo, useState } from "react";
import { Code2, Play, Wrench, Sparkles } from "lucide-react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "java", label: "Java" },
];

const problemSet = {
  half: [
    {
      id: 1,
      title: "Half Adder Sum",
      description: "Write a function halfAdderSum(A, B) that returns the Sum output.",
    },
    {
      id: 2,
      title: "Half Adder Carry",
      description: "Write a function halfAdderCarry(A, B) that returns the Carry output.",
    },
    {
      id: 3,
      title: "Half Adder Result Object",
      description: "Return both Sum and Carry for the inputs A and B.",
    },
  ],
  full: [
    {
      id: 1,
      title: "Full Adder Sum",
      description: "Write a function fullAdderSum(A, B, Cin) that returns the Sum output.",
    },
    {
      id: 2,
      title: "Full Adder Carry",
      description: "Write a function fullAdderCarry(A, B, Cin) that returns the Carry output.",
    },
    {
      id: 3,
      title: "Full Adder Result Object",
      description: "Return both Sum and Carry for A, B, and Cin.",
    },
  ],
};

const templates = {
  half: {
    javascript: [
      `function halfAdderSum(A, B) {
  return A ^ B;
}`,
      `function halfAdderCarry(A, B) {
  return A & B;
}`,
      `const answer = {
  sum: 1 ^ 0,
  carry: 1 & 0
};`,
    ],
    python: [
      `def halfAdderSum(A, B):
    return A ^ B`,
      `def halfAdderCarry(A, B):
    return A & B`,
      `answer = {
    "sum": 1 ^ 0,
    "carry": 1 & 0
}`,
    ],
    cpp: [
      `int halfAdderSum(int A, int B) {
  return A ^ B;
}`,
      `int halfAdderCarry(int A, int B) {
  return A & B;
}`,
      `string answer = "sum = A ^ B, carry = A & B";`,
    ],
    c: [
      `int halfAdderSum(int A, int B) {
  return A ^ B;
}`,
      `int halfAdderCarry(int A, int B) {
  return A & B;
}`,
      `char answer[] = "sum = A ^ B, carry = A & B";`,
    ],
    java: [
      `int halfAdderSum(int A, int B) {
  return A ^ B;
}`,
      `int halfAdderCarry(int A, int B) {
  return A & B;
}`,
      `String answer = "sum = A ^ B, carry = A & B";`,
    ],
  },
  full: {
    javascript: [
      `function fullAdderSum(A, B, Cin) {
  return A ^ B ^ Cin;
}`,
      `function fullAdderCarry(A, B, Cin) {
  return (A & B) | (B & Cin) | (A & Cin);
}`,
      `const answer = {
  sum: 1 ^ 0 ^ 1,
  carry: (1 & 0) | (0 & 1) | (1 & 1)
};`,
    ],
    python: [
      `def fullAdderSum(A, B, Cin):
    return A ^ B ^ Cin`,
      `def fullAdderCarry(A, B, Cin):
    return (A & B) | (B & Cin) | (A & Cin)`,
      `answer = {
    "sum": 1 ^ 0 ^ 1,
    "carry": (1 & 0) | (0 & 1) | (1 & 1)
}`,
    ],
    cpp: [
      `int fullAdderSum(int A, int B, int Cin) {
  return A ^ B ^ Cin;
}`,
      `int fullAdderCarry(int A, int B, int Cin) {
  return (A & B) | (B & Cin) | (A & Cin);
}`,
      `string answer = "sum = A ^ B ^ Cin, carry = AB + BCin + ACin";`,
    ],
    c: [
      `int fullAdderSum(int A, int B, int Cin) {
  return A ^ B ^ Cin;
}`,
      `int fullAdderCarry(int A, int B, int Cin) {
  return (A & B) | (B & Cin) | (A & Cin);
}`,
      `char answer[] = "sum = A ^ B ^ Cin, carry = AB + BCin + ACin";`,
    ],
    java: [
      `int fullAdderSum(int A, int B, int Cin) {
  return A ^ B ^ Cin;
}`,
      `int fullAdderCarry(int A, int B, int Cin) {
  return (A & B) | (B & Cin) | (A & Cin);
}`,
      `String answer = "sum = A ^ B ^ Cin, carry = AB + BCin + ACin";`,
    ],
  },
};

export default function DSDAddersCoding({ selectedAdder }) {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const problems = useMemo(() => problemSet[selectedAdder], [selectedAdder]);

  const [codes, setCodes] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setCodes(templates[selectedAdder][selectedLanguage]);
    setResults(Array(3).fill(""));
  }, [selectedAdder, selectedLanguage]);

  const handleCodeChange = (index, value) => {
    setCodes((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const setResultAt = (index, value) => {
    setResults((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const runCode = (index) => {
    if (selectedLanguage !== "javascript") {
      setResultAt(
        index,
        `Execution for ${selectedLanguage.toUpperCase()} is not enabled yet. Please use JavaScript for now.`
      );
      return;
    }

    try {
      if (selectedAdder === "half") {
        if (index === 0) {
          const fn = new Function(`${codes[index]}; return halfAdderSum;`)();
          const output = fn(1, 0);
          setResultAt(index, `Output:\nhalfAdderSum(1, 0) = ${output}`);
          return;
        }

        if (index === 1) {
          const fn = new Function(`${codes[index]}; return halfAdderCarry;`)();
          const output = fn(1, 1);
          setResultAt(index, `Output:\nhalfAdderCarry(1, 1) = ${output}`);
          return;
        }

        const fn = new Function(`${codes[index]}; return answer;`);
        const result = fn();
        setResultAt(index, `Output:\n${JSON.stringify(result, null, 2)}`);
        return;
      }

      if (index === 0) {
        const fn = new Function(`${codes[index]}; return fullAdderSum;`)();
        const output = fn(1, 0, 1);
        setResultAt(index, `Output:\nfullAdderSum(1, 0, 1) = ${output}`);
        return;
      }

      if (index === 1) {
        const fn = new Function(`${codes[index]}; return fullAdderCarry;`)();
        const output = fn(1, 1, 0);
        setResultAt(index, `Output:\nfullAdderCarry(1, 1, 0) = ${output}`);
        return;
      }

      const fn = new Function(`${codes[index]}; return answer;`);
      const result = fn();
      setResultAt(index, `Output:\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setResultAt(index, `Error: ${error.message}`);
    }
  };

  const analyzeCode = (index) => {
    const content = (codes[index] || "").toLowerCase();

    const expected =
      selectedAdder === "half"
        ? index === 0
          ? ["^", "sum"]
          : index === 1
          ? ["&", "carry"]
          : ["sum", "carry"]
        : index === 0
        ? ["^", "cin"]
        : index === 1
        ? ["&", "|", "cin"]
        : ["sum", "carry", "cin"];

    const score = expected.filter((token) => content.includes(token)).length;

    if (score >= Math.max(2, expected.length - 1)) {
      setResultAt(index, "Analysis:\nYour answer includes the expected adder logic.");
    } else {
      setResultAt(
        index,
        "Analysis:\nYour answer is partially correct, but it should include more of the required adder logic."
      );
    }
  };

  const correctCode = (index) => {
    setCodes((prev) =>
      prev.map((item, i) => (i === index ? templates[selectedAdder][selectedLanguage][index] : item))
    );
    setResultAt(index, "Model answer loaded for this problem.");
  };

  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Coding Practice</h2>
          <p className="sorting-sim-subtitle">
            Practice implementing {selectedAdder === "half" ? "Half Adder" : "Full Adder"} logic.
          </p>
        </div>
      </div>

      {problems.map((problem, index) => (
        <div key={problem.id} className="coding-card-upgraded">
          <div className="coding-card-header">
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "rgba(56,189,248,0.10)",
                  border: "1px solid rgba(56,189,248,0.18)",
                  color: "#38bdf8",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                }}
              >
                <Sparkles size={14} />
                <span>{selectedAdder === "half" ? "Half Adder" : "Full Adder"} Problem</span>
              </div>

              <h3>{problem.title}</h3>
              <p>{problem.description}</p>
            </div>

            {index === 0 && (
              <div className="coding-language-wrap">
                <label className="sorting-label">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="sorting-select"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <textarea
            value={codes[index] || ""}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            rows={12}
            className="coding-textarea-upgraded"
            placeholder="Write your code here..."
          />

          <div className="coding-actions-upgraded">
            <button className="sim-btn sim-btn-primary" onClick={() => runCode(index)}>
              <Play size={16} />
              Run Code
            </button>

            <button className="sim-btn sim-btn-muted" onClick={() => analyzeCode(index)}>
              <Wrench size={16} />
              Analyze
            </button>

            <button className="sim-btn sim-btn-muted" onClick={() => correctCode(index)}>
              Load Correct
            </button>
          </div>

          {selectedLanguage !== "javascript" && (
            <div className="coding-result-box" style={{ marginTop: 14 }}>
              Execution for {selectedLanguage.toUpperCase()} will be enabled later.
              For now, direct execution works in JavaScript.
            </div>
          )}

          {results[index] && <div className="coding-result-box">{results[index]}</div>}
        </div>
      ))}
    </section>
  );
}