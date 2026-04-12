import React, { useState } from "react";

const questions = [
  {
    q: "A comparator is used to:",
    options: [
      "Store data",
      "Compare binary values",
      "Generate clock pulses",
      "Encode analog input"
    ],
    correct: 1
  },
  {
    q: "If A = 1 and B = 0, which output becomes active?",
    options: ["A < B", "A = B", "A > B", "None"],
    correct: 2
  },
  {
    q: "If A = 0 and B = 0, the active output is:",
    options: ["A > B", "A = B", "A < B", "All outputs"],
    correct: 1
  },
  {
    q: "A 1-bit comparator has how many comparison outputs?",
    options: ["1", "2", "3", "4"],
    correct: 2
  },
  {
    q: "If A = 0 and B = 1, then:",
    options: ["A > B", "A = B", "A < B", "Invalid"],
    correct: 2
  }
];

export default function DSDComparatorQuiz({ experimentRun }) {
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
        <p>Please interact with the comparator simulation before attempting the quiz.</p>
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