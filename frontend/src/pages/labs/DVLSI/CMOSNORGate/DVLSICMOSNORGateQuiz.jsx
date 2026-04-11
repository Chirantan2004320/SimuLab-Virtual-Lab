import React, { useState } from "react";

const questions = [
  {
    q: "What is the output of a NOR gate when both inputs are 0?",
    options: ["0", "1", "Undefined", "Floating"],
    correct: 1
  },
  {
    q: "In a CMOS NOR gate, the pMOS transistors are connected in:",
    options: ["Parallel", "Series", "Feedback", "Cascade only"],
    correct: 1
  },
  {
    q: "In a CMOS NOR gate, the nMOS transistors are connected in:",
    options: ["Series", "Parallel", "Open circuit", "Diagonal"],
    correct: 1
  },
  {
    q: "If A = 1 and B = 0, the NOR output is:",
    options: ["1", "0", "VDD", "Unknown"],
    correct: 1
  },
  {
    q: "The NOR gate outputs HIGH only when:",
    options: [
      "At least one input is HIGH",
      "Both inputs are HIGH",
      "Both inputs are LOW",
      "A is LOW only"
    ],
    correct: 2
  }
];

export default function DVLSICMOSNORQuiz({ experimentRun }) {
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
        <p>Please interact with the CMOS NOR simulation before attempting the quiz.</p>
      ) : (
        <div>
          {questions.map((q, i) => (
            <div key={i} className="quiz-question">
              <p>
                <strong>
                  {i + 1}. {q.q}
                </strong>
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
              <p>
                Score: {score} / {questions.length}
              </p>
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