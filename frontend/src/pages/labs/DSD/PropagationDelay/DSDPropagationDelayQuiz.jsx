import React, { useState } from "react";

const questions = [
  {
    q: "Propagation delay is the time between:",
    options: [
      "Power ON and power OFF",
      "Input change and corresponding output change",
      "Two clock cycles only",
      "Two unrelated signals"
    ],
    correct: 1
  },
  {
    q: "Propagation delay is usually measured in:",
    options: ["Amperes", "Volts", "Nanoseconds", "Ohms"],
    correct: 2
  },
  {
    q: "If time is less than the propagation delay:",
    options: [
      "Output must instantly change",
      "Output still shows old value",
      "Circuit turns off",
      "Clock stops"
    ],
    correct: 1
  },
  {
    q: "Ignoring propagation delay can lead to:",
    options: [
      "Better timing always",
      "Infinite memory",
      "Timing errors",
      "Lower voltage only"
    ],
    correct: 2
  },
  {
    q: "Propagation delay is important in:",
    options: [
      "Timing analysis",
      "Painting circuits",
      "Battery charging only",
      "Keyboard layout"
    ],
    correct: 0
  }
];

export default function DSDPropagationDelayQuiz({ experimentRun }) {
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
        <p>Please interact with the propagation delay simulation before attempting the quiz.</p>
      ) : (
        <div>
          {questions.map((q, i) => (
            <div key={i} className="quiz-question">
              <p><strong>{i + 1}. {q.q}</strong></p>

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
            <button className="btn primary" onClick={submitQuiz} disabled={answers.includes(null)}>
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