import React, { useState } from "react";

const questions = [
  {
    q: "Which gate passes the input unchanged to the output?",
    options: ["NOT", "BUFFER", "XOR", "NOR"],
    correct: 1
  },
  {
    q: "Which gate inverts a single input?",
    options: ["AND", "OR", "NOT", "XNOR"],
    correct: 2
  },
  {
    q: "Which gate gives output 1 only when both inputs are 1?",
    options: ["OR", "AND", "XOR", "NOR"],
    correct: 1
  },
  {
    q: "XOR gate gives output 1 when:",
    options: [
      "Both inputs are 0",
      "Inputs are different",
      "Inputs are equal",
      "Both inputs are 1"
    ],
    correct: 1
  },
  {
    q: "XNOR gate gives output 1 when:",
    options: [
      "Inputs are different",
      "Inputs are equal",
      "Only A is 1",
      "Only B is 1"
    ],
    correct: 1
  }
];

export default function DSDLogicGatesQuiz({ experimentRun }) {
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
        <p>Please interact with the logic gate simulation before attempting the quiz.</p>
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