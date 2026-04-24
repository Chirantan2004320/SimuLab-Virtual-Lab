import React, { useMemo, useState } from "react";
import { FileCode2, CheckCircle2, Lightbulb, RefreshCcw } from "lucide-react";

const problemBank = [
  {
    id: 1,
    title: "Predict comparator output",
    description:
      "For A = 1 and B = 0, identify which output becomes active: A > B, A = B, or A < B.",
    answer: "A > B",
    placeholder: "Write the active output here..."
  },
  {
    id: 2,
    title: "Write the greater-than expression",
    description:
      "Write the Boolean expression for the greater-than output of a 1-bit comparator.",
    answer: "A · B̅",
    placeholder: "Write the expression for A > B..."
  },
  {
    id: 3,
    title: "Write the equality expression",
    description:
      "Write the Boolean expression for the equality output of a 1-bit comparator.",
    answer: "A̅B̅ + AB",
    placeholder: "Write the expression for A = B..."
  },
  {
    id: 4,
    title: "Design interpretation",
    description:
      "Explain why only one comparator output should be active for a valid 1-bit comparison.",
    answer:
      "Only one comparator output is active because two binary inputs can have only one valid relationship at a time: A is greater than B, A is equal to B, or A is less than B.",
    placeholder: "Write your explanation here..."
  }
];

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[\s.]+/g, " ")
    .replace(/×/g, "·")
    .trim();
}

export default function DSDComparatorCoding({ a, b, analysis }) {
  const [responses, setResponses] = useState(() =>
    problemBank.reduce((acc, item) => {
      acc[item.id] = "";
      return acc;
    }, {})
  );

  const [feedback, setFeedback] = useState({});

  const currentInsight = useMemo(() => {
    return `Current state: A = ${a}, B = ${b}, so the active relation is ${analysis.relation}.`;
  }, [a, b, analysis]);

  const handleChange = (id, value) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const checkAnswer = (problem) => {
    const userValue = normalizeText(responses[problem.id] || "");
    const correctValue = normalizeText(problem.answer);

    let result = "";
    if (!userValue) {
      result = "Please write your answer first.";
    } else if (
      userValue === correctValue ||
      userValue.includes(correctValue) ||
      correctValue.includes(userValue)
    ) {
      result = "Correct. Your comparator design answer matches the expected concept.";
    } else {
      result = "Partially correct or incorrect. Review the comparator relation and logic expression.";
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
      problemBank.reduce((acc, item) => {
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
            Practice comparator output prediction, Boolean expression writing, and design interpretation.
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