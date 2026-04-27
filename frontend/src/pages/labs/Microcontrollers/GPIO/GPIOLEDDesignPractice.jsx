import React, { useMemo, useState } from "react";
import { FileCode2, CheckCircle2, Lightbulb, RefreshCcw } from "lucide-react";

const problemBank = [
  {
    id: 1,
    title: "Configure GPIO pin",
    description:
      "Write the Arduino setup code to configure pin 13 as an output pin.",
    answer: "pinMode(13, OUTPUT);",
    placeholder: "Example: pinMode(...);"
  },
  {
    id: 2,
    title: "Turn LED ON",
    description:
      "Write the Arduino statement to set GPIO pin 13 HIGH and turn the LED ON.",
    answer: "digitalWrite(13, HIGH);",
    placeholder: "Example: digitalWrite(...);"
  },
  {
    id: 3,
    title: "Turn LED OFF",
    description:
      "Write the Arduino statement to set GPIO pin 13 LOW and turn the LED OFF.",
    answer: "digitalWrite(13, LOW);",
    placeholder: "Example: digitalWrite(...);"
  },
  {
    id: 4,
    title: "Explain resistor purpose",
    description:
      "Briefly explain why a 220Ω resistor is connected in series with the LED.",
    answer:
      "The resistor limits current and protects the LED and GPIO pin from excessive current.",
    placeholder: "Write your explanation here..."
  }
];

function normalizeText(value) {
  return value.toLowerCase().replace(/\s+/g, " ").replace(/;/g, "").trim();
}

export default function GPIOLEDDesignPractice({ analysis }) {
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
    } else if (
      userValue === correctValue ||
      userValue.includes(correctValue) ||
      correctValue.includes(userValue)
    ) {
      result = "Correct. Your answer matches the expected GPIO LED concept.";
    } else {
      result = "Partially correct or incorrect. Review the GPIO LED logic and try again.";
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

  const currentInsight = useMemo(() => {
    return `Current state: GPIO pin is ${analysis.pinState ? "HIGH" : "LOW"}, voltage is ${analysis.voltage}, and LED is ${analysis.led ? "ON" : "OFF"}.`;
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
            Practice GPIO LED control logic using Arduino-style statements and simple design reasoning.
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
            rows={6}
            value={responses[problem.id]}
            onChange={(e) => handleChange(problem.id, e.target.value)}
            placeholder={problem.placeholder}
          />

          <div className="coding-actions-upgraded">
            <button
              className="sim-btn sim-btn-primary"
              onClick={() => checkAnswer(problem)}
            >
              <CheckCircle2 size={16} />
              Check Answer
            </button>

            <button
              className="sim-btn sim-btn-muted"
              onClick={() => showModelAnswer(problem)}
            >
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