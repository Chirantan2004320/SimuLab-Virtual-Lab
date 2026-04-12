import React, { useState } from "react";

const questions = [
  {
    q: "Which flip-flop copies D to Q when clock is active?",
    options: ["SR", "D", "JK", "T"],
    correct: 1
  },
  {
    q: "Which flip-flop toggles when both inputs are 1?",
    options: ["SR", "D", "JK", "Latch only"],
    correct: 2
  },
  {
    q: "A T flip-flop toggles when:",
    options: ["T=0", "T=1", "CLK=0 only", "Always"],
    correct: 1
  },
  {
    q: "The invalid condition in a basic SR latch is:",
    options: ["S=0, R=0", "S=1, R=0", "S=0, R=1", "S=1, R=1"],
    correct: 3
  },
  {
    q: "Flip-flops are examples of:",
    options: ["Combinational circuits", "Sequential circuits", "Analog circuits", "Power circuits"],
    correct: 1
  }
];

export default function DSDFlipFlopsQuiz({ experimentRun }) {
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
        <p>Please interact with the flip-flop simulation before attempting the quiz.</p>
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