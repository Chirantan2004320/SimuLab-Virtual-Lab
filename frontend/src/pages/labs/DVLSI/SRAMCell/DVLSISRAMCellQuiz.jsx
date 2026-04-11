import React, { useState } from "react";

const questions = [
  {
    q: "A basic SRAM cell stores data using:",
    options: [
      "One resistor only",
      "Two cross-coupled inverters",
      "Only one capacitor",
      "A ring oscillator"
    ],
    correct: 1
  },
  {
    q: "The wordline in an SRAM cell is used to:",
    options: [
      "Set VDD only",
      "Enable access transistors",
      "Replace the bitline",
      "Erase the transistor"
    ],
    correct: 1
  },
  {
    q: "A typical SRAM cell stores:",
    options: ["8 bits", "4 bits", "1 bit", "16 bits"],
    correct: 2
  },
  {
    q: "The two internal nodes of an SRAM cell are usually:",
    options: ["Equal always", "Complementary", "Floating always", "AC only"],
    correct: 1
  },
  {
    q: "Compared with DRAM, SRAM generally:",
    options: [
      "Needs refresh constantly",
      "Is slower",
      "Is faster and does not need refresh",
      "Uses fewer transistors per bit"
    ],
    correct: 2
  }
];

export default function DVLSISRAMCellQuiz({ experimentRun }) {
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
        <p>Please interact with the SRAM cell simulation before attempting the quiz.</p>
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