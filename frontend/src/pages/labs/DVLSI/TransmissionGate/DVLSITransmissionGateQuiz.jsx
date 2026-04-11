import React, { useState } from "react";

const questions = [
  {
    q: "A transmission gate is made using:",
    options: [
      "Two nMOS in series",
      "One nMOS and one pMOS in parallel",
      "Only one pMOS",
      "Only one inverter"
    ],
    correct: 1
  },
  {
    q: "A transmission gate is turned ON when:",
    options: [
      "Control = 0 and Control̅ = 1",
      "Control = 1 and Control̅ = 0",
      "Both controls are 1",
      "Both controls are 0"
    ],
    correct: 1
  },
  {
    q: "Compared to a single nMOS pass transistor, a transmission gate:",
    options: [
      "Passes both logic levels better",
      "Has no transistor",
      "Always inverts the signal",
      "Cannot isolate output"
    ],
    correct: 0
  },
  {
    q: "When the transmission gate is OFF, the output is typically:",
    options: ["1", "0", "Z / floating", "Always inverted"],
    correct: 2
  },
  {
    q: "A single nMOS pass transistor passes strongly:",
    options: ["Logic 1 only", "Logic 0 only", "Both equally", "Neither"],
    correct: 1
  }
];

export default function DVLSITransmissionGateQuiz({ experimentRun }) {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const submitQuiz = () => {
    let total = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) total++;
    });
    setScore(total);
    setSubmitted(true);
  };

  const redoQuiz = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setScore(0);
  };

  return (
    <section className="card">
      <h2>Quiz</h2>

      {!experimentRun ? (
        <p>Please interact with the transmission gate simulation before attempting the quiz.</p>
      ) : (
        <div>
          {questions.map((q, i) => (
            <div key={i} className="quiz-question">
              <p>
                <strong>{i + 1}. {q.q}</strong>
              </p>

              {q.options.map((opt, j) => (
                <label
                  key={j}
                  className={`quiz-option ${
                    submitted
                      ? j === q.correct
                        ? "correct"
                        : answers[i] === j
                        ? "wrong"
                        : ""
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={j}
                    checked={answers[i] === j}
                    onChange={() => handleAnswer(i, j)}
                    disabled={submitted}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          {!submitted ? (
            <button
              className="btn primary"
              onClick={submitQuiz}
              disabled={answers.includes(null)}
            >
              Submit Quiz
            </button>
          ) : (
            <div>
              <p>Score: {score} / {questions.length}</p>
              <button className="btn secondary" onClick={redoQuiz}>
                Redo Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}