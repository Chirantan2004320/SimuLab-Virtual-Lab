import React, { useState } from "react";

const questions = [
  {
    q: "What does a low-pass filter do?",
    options: [
      "Blocks low frequencies",
      "Allows low frequencies",
      "Only removes noise",
      "Amplifies all frequencies"
    ],
    correct: 1
  },
  {
    q: "What is the purpose of a window function in FIR design?",
    options: [
      "To reduce ripple and improve practical filter response",
      "To increase sampling frequency",
      "To convert FIR to IIR",
      "To remove all high frequencies"
    ],
    correct: 0
  },
  {
    q: "Which window usually gives smoother response than a rectangular window?",
    options: ["Hamming", "Impulse", "Unit", "None"],
    correct: 0
  },
  {
    q: "A high-pass filter mainly allows:",
    options: [
      "Low frequencies",
      "High frequencies",
      "Only DC component",
      "Only negative frequencies"
    ],
    correct: 1
  },
  {
    q: "FIR filters are always stable because:",
    options: [
      "They have finite impulse response",
      "They use cosine only",
      "They always have gain less than 1",
      "They have no frequency response"
    ],
    correct: 0
  }
];

export default function DTSPFilterDesignQuiz({ experimentRun }) {
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
        <p>Please generate and observe the filter at least once before attempting the quiz.</p>
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