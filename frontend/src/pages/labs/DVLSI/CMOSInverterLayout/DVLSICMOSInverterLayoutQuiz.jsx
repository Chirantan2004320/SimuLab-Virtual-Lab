import React, { useState } from "react";

const questions = [
  {
    q: "In a CMOS inverter layout, the pMOS transistor is usually placed:",
    options: [
      "Below the nMOS region",
      "Above the nMOS region",
      "Inside the contact only",
      "Not used in layout"
    ],
    correct: 1
  },
  {
    q: "The common polysilicon line in a CMOS inverter layout represents:",
    options: ["Output node", "Input gate", "Ground line", "Well contact"],
    correct: 1
  },
  {
    q: "The output node in a CMOS inverter layout is formed by:",
    options: [
      "Joining the transistor drains",
      "Joining only the sources",
      "Removing contacts",
      "Connecting VDD and GND directly"
    ],
    correct: 0
  },
  {
    q: "Stick diagrams are mainly used to:",
    options: [
      "Show exact fabrication masks only",
      "Abstract layout topology and connectivity",
      "Replace circuit equations",
      "Measure threshold voltage"
    ],
    correct: 1
  },
  {
    q: "If spacing is below the minimum allowed value, the layout may suffer from:",
    options: [
      "No issue at all",
      "Possible DRC violation",
      "Automatic gain increase",
      "Lower lambda value"
    ],
    correct: 1
  }
];

export default function DVLSICMOSInverterLayoutQuiz({ experimentRun }) {
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
        <p>Please interact with the CMOS inverter layout simulation before attempting the quiz.</p>
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