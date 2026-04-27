import React, { useMemo, useState } from "react";
import { FileCode2, CheckCircle2, Lightbulb, RefreshCcw } from "lucide-react";

const problemBank = [
  {
    id: 1,
    title: "Configure PWM pin",
    description: "Write Arduino setup code to configure pin 9 as OUTPUT.",
    answer: "pinMode(9, OUTPUT);",
    placeholder: "Example: pinMode(...);"
  },
  {
    id: 2,
    title: "Set 50% brightness",
    description: "Write Arduino code to set pin 9 to approximately 50% brightness.",
    answer: "analogWrite(9, 128);",
    placeholder: "Example: analogWrite(...);"
  },
  {
    id: 3,
    title: "Turn LED OFF",
    description: "Write Arduino PWM code to turn the LED OFF.",
    answer: "analogWrite(9, 0);",
    placeholder: "Example: analogWrite(...);"
  },
  {
    id: 4,
    title: "Explain duty cycle",
    description: "Briefly explain what duty cycle means in PWM.",
    answer:
      "Duty cycle is the percentage of time a PWM signal stays HIGH during one cycle.",
    placeholder: "Write your explanation here..."
  }
];

function normalizeText(value) {
  return value.toLowerCase().replace(/\s+/g, " ").replace(/;/g, "").trim();
}

export default function PWMLedDesignPractice({ analysis }) {
  const [responses, setResponses] = useState(() =>
    problemBank.reduce((acc, item) => {
      acc[item.id] = "";
      return acc;
    }, {})
  );

  const [feedback, setFeedback] = useState({});

  const currentInsight = useMemo(() => {
    return `Current duty cycle: ${analysis.dutyCycle}%, PWM value: ${analysis.pwmValue}, brightness: ${analysis.brightnessLabel}.`;
  }, [analysis]);

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
      result = "Correct. Your answer matches the expected PWM concept.";
    } else {
      result = "Partially correct or incorrect. Review PWM duty cycle and analogWrite values.";
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
            Practice Arduino-style PWM LED brightness control.
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
              <h3>Task {index + 1}: {problem.title}</h3>
              <p>{problem.description}</p>
            </div>
          </div>

          <textarea
            className="coding-textarea-upgraded"
            rows={6}
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

          {feedback[problem.id] && <div className="coding-result-box">{feedback[problem.id]}</div>}
        </div>
      ))}
    </section>
  );
}