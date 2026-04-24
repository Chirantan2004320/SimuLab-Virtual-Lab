import React, { useMemo, useState } from "react";
import { FileCode2, CheckCircle2, Lightbulb, RefreshCcw } from "lucide-react";

const practiceBank = [
  {
    id: 1,
    title: "Delay Interpretation",
    description:
      "If the propagation delay is 5 ns and the current time is 3 ns, should the output already reflect the new input? Explain briefly.",
    answer:
      "No. The output should still show the old value because the full 5 ns propagation delay has not elapsed yet.",
    placeholder: "Write your explanation here..."
  },
  {
    id: 2,
    title: "NOT Gate Observation",
    description:
      "For a NOT gate, explain what happens to the output after the delay elapses when the input changes from 0 to 1.",
    answer:
      "After the delay elapses, the NOT gate output changes to the inverse of the new input, so it becomes 0.",
    placeholder: "Describe the delayed output response..."
  },
  {
    id: 3,
    title: "Timing Importance",
    description:
      "Why is propagation delay important in high-speed digital systems?",
    answer:
      "Propagation delay is important because ignoring it can cause timing errors, incorrect outputs, race conditions, and unreliable circuit operation.",
    placeholder: "Write the reason here..."
  }
];

function normalizeText(value) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function DSDPropagationDelayCoding({
  selectedGate,
  inputBit,
  delayNs,
  timeNs,
  analysis
}) {
  const [responses, setResponses] = useState(() =>
    practiceBank.reduce((acc, item) => {
      acc[item.id] = "";
      return acc;
    }, {})
  );

  const [feedback, setFeedback] = useState({});

  const currentInsight = useMemo(() => {
    return `Current state: gate = ${selectedGate}, input = ${inputBit}, delay = ${delayNs} ns, time = ${timeNs} ns, observed output = ${analysis.observedOutput}.`;
  }, [selectedGate, inputBit, delayNs, timeNs, analysis]);

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
      result = "Correct. Your design answer matches the expected timing concept.";
    } else {
      result = "Partially correct or incorrect. Review the timing behavior and try again.";
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
            Practice timing analysis and conceptual delay reasoning instead of software coding.
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