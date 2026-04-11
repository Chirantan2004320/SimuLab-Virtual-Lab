import React, { useState } from "react";

const questions = [
  {
    q: "A ring oscillator requires how many inverter stages to oscillate?",
    options: [
      "An even number only",
      "An odd number only",
      "Exactly two",
      "Exactly four"
    ],
    correct: 1
  },
  {
    q: "The oscillation period of a ring oscillator is approximately:",
    options: [
      "T ≈ N / tp",
      "T ≈ 2 × N × tp",
      "T ≈ VDD × tp",
      "T ≈ tp / N"
    ],
    correct: 1
  },
  {
    q: "If the number of inverter stages is even, the ring oscillator usually:",
    options: [
      "Oscillates faster",
      "Settles instead of oscillating",
      "Draws no power ever",
      "Acts like a NAND gate"
    ],
    correct: 1
  },
  {
    q: "The main reason oscillation occurs is:",
    options: [
      "Odd inversion plus delay in feedback loop",
      "No power supply needed",
      "Infinite gain alone",
      "Removing all delay"
    ],
    correct: 0
  },
  {
    q: "Ring oscillators are often used for:",
    options: [
      "Only memory storage",
      "Process monitoring and clock-like signal generation",
      "Only database indexing",
      "Only layout extraction"
    ],
    correct: 1
  }
];

export default function DVLSIRingOscillatorQuiz({ experimentRun }) {
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
        <p>Please interact with the ring oscillator simulation before attempting the quiz.</p>
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