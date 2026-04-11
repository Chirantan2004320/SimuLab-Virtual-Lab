import React, { useState } from "react";

const questions = [
  {
    q: "When VGS is below threshold voltage, the MOSFET is in:",
    options: ["Cutoff", "Triode", "Saturation", "Breakdown"],
    correct: 0
  },
  {
    q: "The triode region is characterized by:",
    options: [
      "No channel formation",
      "Pinch-off near drain",
      "Resistive channel conduction",
      "Infinite current"
    ],
    correct: 2
  },
  {
    q: "Saturation starts approximately when:",
    options: [
      "VDS = 0",
      "VDS ≥ VGS − VT",
      "VGS = 0",
      "VDS < VT"
    ],
    correct: 1
  },
  {
    q: "In saturation, the drain current is mainly controlled by:",
    options: ["Only VDS", "Only body voltage", "VGS overdrive", "Source resistance only"],
    correct: 2
  },
  {
    q: "The threshold voltage VT determines:",
    options: [
      "Gate oxide thickness directly",
      "When the inversion channel starts to form",
      "The exact drain voltage always",
      "The package type"
    ],
    correct: 1
  }
];

export default function DVLSIMOSFETQuiz({ experimentRun }) {
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
        <p>Please interact with the MOSFET simulation before attempting the quiz.</p>
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