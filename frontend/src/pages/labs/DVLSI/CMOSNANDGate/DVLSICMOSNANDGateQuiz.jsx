import React, { useState } from "react";

const questions = [
  {
    q: "What is the output of a NAND gate when both inputs are 1?",
    options: ["1", "0", "Undefined", "Floating"],
    correct: 1
  },
  {
    q: "In a CMOS NAND gate, the pMOS transistors are connected in:",
    options: ["Series", "Parallel", "Diagonal", "Feedback"],
    correct: 1
  },
  {
    q: "In a CMOS NAND gate, the nMOS transistors are connected in:",
    options: ["Parallel", "Series", "Open circuit", "Cross-coupled"],
    correct: 1
  },
  {
    q: "If A = 0 and B = 1, the NAND output is:",
    options: ["0", "1", "VDD/2", "Unknown"],
    correct: 1
  },
  {
    q: "A NAND gate is called a universal gate because:",
    options: [
      "It uses only one transistor",
      "It can implement any Boolean function",
      "It has no delay",
      "It needs no power supply"
    ],
    correct: 1
  }
];

export default function DVLSICMOSNANDQuiz({ experimentRun }) {
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
        <p>Please interact with the CMOS NAND simulation before attempting the quiz.</p>
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