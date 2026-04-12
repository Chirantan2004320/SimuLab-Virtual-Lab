import React, { useState } from "react";

const questions = [
  {
    q: "A counter is a:",
    options: [
      "Combinational circuit only",
      "Sequential circuit",
      "Pure analog circuit",
      "Power supply device"
    ],
    correct: 1
  },
  {
    q: "A 2-bit binary counter has how many states?",
    options: ["2", "3", "4", "8"],
    correct: 2
  },
  {
    q: "After state 01, a 2-bit binary counter goes to:",
    options: ["00", "10", "11", "01"],
    correct: 1
  },
  {
    q: "Counters usually advance on:",
    options: [
      "Temperature change",
      "Clock pulse",
      "Mouse click only",
      "Voltage drop only"
    ],
    correct: 1
  },
  {
    q: "The counting sequence for a 2-bit counter is:",
    options: [
      "00 → 10 → 01 → 11",
      "00 → 01 → 10 → 11",
      "11 → 10 → 01 → 00 only",
      "00 → 11 → 10 → 01"
    ],
    correct: 1
  }
];

export default function DSDCounterQuiz({ experimentRun }) {
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
        <p>Please interact with the counter simulation before attempting the quiz.</p>
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