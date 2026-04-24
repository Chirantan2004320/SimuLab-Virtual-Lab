import React, { useMemo, useState } from "react";
import { FileCode2, CheckCircle2, Lightbulb, RefreshCcw } from "lucide-react";

const problemBank = [
  {
    id: 1,
    title: "Predict the selected input",
    description:
      "For a 4-to-1 multiplexer, if S1 = 1 and S0 = 0, which input reaches the output?",
    answer: "I2",
    placeholder: "Write the selected input name here...",
  },
  {
    id: 2,
    title: "Write the Boolean output expression",
    description:
      "Write the standard Boolean expression of a 4-to-1 multiplexer output Y using inputs I0, I1, I2, I3 and select lines S1, S0.",
    answer: "Y = I0·S1̅·S0̅ + I1·S1̅·S0 + I2·S1·S0̅ + I3·S1·S0",
    placeholder: "Write the Boolean expression here...",
  },
  {
    id: 3,
    title: "Design interpretation",
    description:
      "Explain briefly why a multiplexer is called a data selector.",
    answer:
      "A multiplexer is called a data selector because it selects one input from multiple input lines and routes the selected input to a single output based on select lines.",
    placeholder: "Write your explanation here...",
  },
];

function normalizeText(value) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function DSDMultiplexerCoding({ analysis }) {
  const [responses, setResponses] = useState(() =>
    problemBank.reduce((acc, item) => {
      acc[item.id] = "";
      return acc;
    }, {})
  );

  const [feedback, setFeedback] = useState({});

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
      result = "Partially correct or incorrect. Review the logic and try again.";
    }

    setFeedback((prev) => ({
      ...prev,
      [problem.id]: result,
    }));
  };

  const showModelAnswer = (problem) => {
    setResponses((prev) => ({
      ...prev,
      [problem.id]: problem.answer,
    }));
    setFeedback((prev) => ({
      ...prev,
      [problem.id]: "Model answer loaded.",
    }));
  };

  const clearAll = () => {
    setResponses(
      problemBank.reduce((acc, item) => {
        acc[item.id] = "";
        return acc;
      }, {})
    );
    setFeedback({});
  };

  const currentInsight = useMemo(() => {
    return `Current state: S1S0 = ${analysis.selectCode}, so ${analysis.selectedInputLabel} is selected and Y = ${analysis.output}.`;
  }, [analysis]);

  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <FileCode2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Design Practice</h2>
          <p className="sorting-sim-subtitle">
            Practice multiplexer logic through reasoning, Boolean expression writing, and design interpretation.
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

      {problemBank.map((problem, index) => (
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