import React, { useMemo, useState } from "react";
import { FileCode2, CheckCircle2, Lightbulb, RefreshCcw } from "lucide-react";

const problemBank = [
  {
    id: 1,
    title: "Configure red light pin",
    description:
      "Write Arduino setup code to configure pin 8 as OUTPUT for the red LED.",
    answer: "pinMode(8, OUTPUT);",
    placeholder: "Example: pinMode(...);"
  },
  {
    id: 2,
    title: "Turn red light ON",
    description:
      "Write the Arduino statement to turn ON the red LED connected to pin 8.",
    answer: "digitalWrite(8, HIGH);",
    placeholder: "Example: digitalWrite(...);"
  },
  {
    id: 3,
    title: "Turn green light OFF",
    description:
      "Write the Arduino statement to turn OFF the green LED connected to pin 10.",
    answer: "digitalWrite(10, LOW);",
    placeholder: "Example: digitalWrite(...);"
  },
  {
    id: 4,
    title: "Explain FSM logic",
    description:
      "Briefly explain why a traffic light controller can be considered a finite state machine.",
    answer:
      "A traffic light controller is a finite state machine because it has fixed states such as red, green, and yellow, and it moves between them in a defined sequence.",
    placeholder: "Write your explanation here..."
  }
];

function normalizeText(value) {
  return value.toLowerCase().replace(/\s+/g, " ").replace(/;/g, "").trim();
}

export default function TrafficLightDesignPractice({ analysis }) {
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
      result = "Correct. Your answer matches the expected traffic light concept.";
    } else {
      result = "Partially correct or incorrect. Review the GPIO and state-machine logic.";
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
    return `Current state: ${analysis.state}, delay: ${analysis.delay} ms, cycle count: ${analysis.cycle}.`;
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
            Practice GPIO traffic light logic using Arduino-style statements and FSM reasoning.
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