import React, { useState } from "react";

const questions = [
  {
    q: "A Half Adder adds how many inputs?",
    options: ["1", "2", "3", "4"],
    correct: 1
  },
  {
    q: "A Full Adder has which extra input compared to a Half Adder?",
    options: ["Clock", "Select", "Carry-in", "Enable"],
    correct: 2
  },
  {
    q: "In a Half Adder, Sum is given by:",
    options: ["A · B", "A + B", "A ⊕ B", "¬A"],
    correct: 2
  },
  {
    q: "In a Half Adder, Carry is given by:",
    options: ["A · B", "A ⊕ B", "A + B", "¬(A+B)"],
    correct: 0
  },
  {
    q: "A Full Adder is mainly used for:",
    options: [
      "Single input inversion",
      "Multi-bit binary addition",
      "Clock generation",
      "Signal delay only"
    ],
    correct: 1
  }
];

export default function DSDAddersQuiz({ experimentRun }) {
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
        <p>Please interact with the adder simulation before attempting the quiz.</p>
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