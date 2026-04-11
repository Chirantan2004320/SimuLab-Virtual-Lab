import React, { useState } from "react";

const questions = [
  {
    q: "What does lambda (λ) represent in lambda-based design rules?",
    options: [
      "A transistor current",
      "A scalable layout unit",
      "A supply voltage",
      "A logic level"
    ],
    correct: 1
  },
  {
    q: "Why are lambda rules useful?",
    options: [
      "They remove all DRC checks",
      "They make layouts process-scalable and easier to teach",
      "They replace transistors",
      "They reduce VDD automatically"
    ],
    correct: 1
  },
  {
    q: "If spacing is below the minimum rule, the likely result is:",
    options: [
      "No effect",
      "Possible fabrication violation or short",
      "Higher logic voltage only",
      "Infinite delay"
    ],
    correct: 1
  },
  {
    q: "Microwind is mainly associated with:",
    options: [
      "Layout visualization and learning",
      "Only operating systems",
      "Only database systems",
      "Signal compression"
    ],
    correct: 0
  },
  {
    q: "A contact in layout is used to:",
    options: [
      "Increase clock speed only",
      "Connect layers electrically",
      "Store memory bits",
      "Replace diffusion"
    ],
    correct: 1
  }
];

export default function DVLSILambdaRulesMicrowindQuiz({ experimentRun }) {
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
        <p>Please interact with the lambda rules simulation before attempting the quiz.</p>
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