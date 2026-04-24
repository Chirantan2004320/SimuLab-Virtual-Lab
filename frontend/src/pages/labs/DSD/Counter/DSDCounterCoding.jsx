import React, { useMemo, useState } from "react";
import { FileCode2, CheckCircle2, Lightbulb, RefreshCcw } from "lucide-react";

const problemBank = [
  {
    id: 1,
    title: "Predict the next state",
    description:
      "If a 2-bit counter is currently at state 10, what will be the next state after one clock pulse?",
    answer: "11",
    placeholder: "Write the next binary state here..."
  },
  {
    id: 2,
    title: "Write the full count sequence",
    description:
      "Write the full sequence of a 2-bit binary up counter starting from 00.",
    answer: "00 → 01 → 10 → 11 → 00",
    placeholder: "Write the full counter sequence here..."
  },
  {
    id: 3,
    title: "Identify Q1 and Q0",
    description:
      "For decimal count 3 in a 2-bit counter, write the values of Q1 and Q0.",
    answer: "Q1 = 1, Q0 = 1",
    placeholder: "Write Q1 and Q0 values here..."
  },
  {
    id: 4,
    title: "Explain reset operation",
    description:
      "Explain what happens when the counter reset is applied.",
    answer:
      "Reset brings the counter back to the initial state 00 regardless of the current count.",
    placeholder: "Write your explanation here..."
  }
];

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/->/g, "→")
    .trim();
}

export default function DSDCounterCoding({ count, clockPulses, analysis }) {
  const [responses, setResponses] = useState(() =>
    problemBank.reduce((acc, item) => {
      acc[item.id] = "";
      return acc;
    }, {})
  );

  const [feedback, setFeedback] = useState({});

  const currentInsight = useMemo(() => {
    return `Current state: Count = ${count}, Q1Q0 = ${analysis.binary}, next state = ${analysis.nextBinary}, clock pulses = ${clockPulses}.`;
  }, [count, clockPulses, analysis]);

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
      result = "Correct. Your counter design answer matches the expected concept.";
    } else {
      result = "Partially correct or incorrect. Review the counter sequence and try again.";
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
            Practice counter state prediction, sequence writing, and reset interpretation.
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