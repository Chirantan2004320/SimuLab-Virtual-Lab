import React, { useMemo, useState } from "react";
import { FileCode2, CheckCircle2, Lightbulb, RefreshCcw } from "lucide-react";

const practiceBank = [
  {
    id: 1,
    title: "State Prediction",
    description:
      "For a JK Flip-Flop with J = 1, K = 1, and active clock, what happens to the output Q?",
    answer: "The output toggles.",
    placeholder: "Write your answer here..."
  },
  {
    id: 2,
    title: "Clocked Data Transfer",
    description:
      "In a D Flip-Flop, explain what happens to Q when CLK = 1 and D = 0.",
    answer: "Q becomes 0 because the D Flip-Flop copies D to Q when the clock is active.",
    placeholder: "Explain the output transition..."
  },
  {
    id: 3,
    title: "Invalid Condition",
    description:
      "Write the invalid input condition of a basic SR latch and explain why it is problematic.",
    answer: "The invalid condition is S = 1 and R = 1 because both set and reset are requested at the same time.",
    placeholder: "Write the condition and explanation..."
  }
];

function normalizeText(value) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function DSDFlipFlopsCoding({ selectedType, analysis, q }) {
  const [responses, setResponses] = useState(() =>
    practiceBank.reduce((acc, item) => {
      acc[item.id] = "";
      return acc;
    }, {})
  );

  const [feedback, setFeedback] = useState({});

  const currentInsight = useMemo(() => {
    return `Current lab state: type = ${selectedType.toUpperCase()}, Q = ${q}, Next Q = ${analysis.nextQ}, operation = ${analysis.stateName}.`;
  }, [selectedType, q, analysis]);

  const handleChange = (id, value) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const checkAnswer = (problem) => {
    const userValue = normalizeText(responses[problem.id] || "");
    const correctValue = normalizeText(problem.answer);

    let result = "";
    if (!userValue) {
      result = "Please write your answer first.";
    } else if (userValue === correctValue || userValue.includes(correctValue) || correctValue.includes(userValue)) {
      result = "Correct. Your design answer matches the expected concept.";
    } else {
      result = "Partially correct or incorrect. Review the flip-flop rule and try again.";
    }

    setFeedback((prev) => ({
      ...prev,
      [problem.id]: result
    }));
  };

  const showModelAnswer = (problem) => {
    setResponses((prev) => ({
      ...prev,
      [problem.id]: problem.answer
    }));
    setFeedback((prev) => ({
      ...prev,
      [problem.id]: "Model answer loaded."
    }));
  };

  const clearAll = () => {
    setResponses(
      practiceBank.reduce((acc, item) => {
        acc[item.id] = "";
        return acc;
      }, {})
    );
    setFeedback({});
  };

  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <FileCode2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Design Practice</h2>
          <p className="sorting-sim-subtitle">
            Practice state prediction, rule interpretation, and sequential logic reasoning instead of software programming.
          </p>
        </div>
      </div>

      <div className="coding-empty-state" style={{ marginBottom: 18 }}>
        <strong>Live Hint:</strong> {currentInsight}
      </div>

      <div className="coding-actions-upgraded" style={{ marginBottom: 18 }}>
        <button className="sim-btn sim-btn-muted" onClick={clearAll}>
          <RefreshCcw size={16} />
          Reset Practice
        </button>
      </div>

      {practiceBank.map((problem, index) => (
        <div key={problem.id} className="coding-card-upgraded">
          <div className="coding-card-header">
            <div>
              <h3>
                Task {index + 1}: {problem.title}
              </h3>
              <p>{problem.description}</p>
            </div>
          </div>

          <textarea
            className="coding-textarea-upgraded"
            rows={7}
            value={responses[problem.id]}
            onChange={(e) => handleChange(problem.id, e.target.value)}
            placeholder={problem.placeholder}
          />

          <div className="coding-actions-upgraded">
            <button className="sim-btn sim-btn-primary" onClick={() => checkAnswer(problem)}>
              <CheckCircle2 size={16} />
              Check Answer
            </button>

            <button className="sim-btn sim-btn-muted" onClick={() => showModelAnswer(problem)}>
              <Lightbulb size={16} />
              Show Model Answer
            </button>
          </div>

          {feedback[problem.id] && (
            <div className="coding-result-box">{feedback[problem.id]}</div>
          )}
        </div>
      ))}
    </section>
  );
}