import React, { useMemo, useState } from "react";
import { FileCode2, CheckCircle2, Lightbulb, RefreshCcw } from "lucide-react";

const problemBank = [
  {
    id: 1,
    title: "Decoder Output Prediction",
    description:
      "For a 2-to-4 decoder, if A = 1 and B = 0, which output line becomes active?",
    answer: "Y2",
    placeholder: "Write the active output line here..."
  },
  {
    id: 2,
    title: "Encoder Code Prediction",
    description:
      "For a 4-to-2 encoder, if input I3 is active, what binary output is produced?",
    answer: "11",
    placeholder: "Write the binary output here..."
  },
  {
    id: 3,
    title: "Conceptual Explanation",
    description:
      "Explain briefly how an encoder is the reverse operation of a decoder.",
    answer:
      "An encoder is the reverse of a decoder because it converts one active input line into a binary code, while a decoder converts a binary input code into one active output line.",
    placeholder: "Write your explanation here..."
  }
];

function normalizeText(value) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function DSDDecoderEncoderCoding({
  mode,
  a,
  b,
  inputs,
  analysis
}) {
  const [responses, setResponses] = useState(() =>
    problemBank.reduce((acc, item) => {
      acc[item.id] = "";
      return acc;
    }, {})
  );

  const [feedback, setFeedback] = useState({});

  const currentInsight = useMemo(() => {
    return mode === "decoder"
      ? `Current decoder state: A=${a}, B=${b}, active output = Y${analysis.index}.`
      : analysis.index === -1
      ? "Current encoder state: no valid active input line."
      : `Current encoder state: active input = I${analysis.index}, binary output = ${analysis.binary}.`;
  }, [mode, a, b, inputs, analysis]);

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
      result = "Correct. Your design answer matches the expected logic concept.";
    } else {
      result = "Partially correct or incorrect. Review the mapping and try again.";
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
            Practice decoder and encoder logic through signal prediction, mapping, and concept-based reasoning.
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
            value={responses[problem.id]}
            onChange={(e) => handleChange(problem.id, e.target.value)}
            rows={7}
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