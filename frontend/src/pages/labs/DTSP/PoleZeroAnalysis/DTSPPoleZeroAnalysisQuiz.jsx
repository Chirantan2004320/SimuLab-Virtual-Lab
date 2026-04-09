import React, { useState } from "react";

const quizQuestions = [
  {
    question: "What are the roots of the numerator polynomial called?",
    options: ["Poles", "Zeros", "Samples", "Modes"],
    correct: 1
  },
  {
    question: "What are the roots of the denominator polynomial called?",
    options: ["Zeros", "Poles", "Inputs", "Shifts"],
    correct: 1
  },
  {
    question: "A causal discrete-time system is stable if all poles are:",
    options: [
      "On the unit circle",
      "Inside the unit circle",
      "Outside the unit circle",
      "At the origin only"
    ],
    correct: 1
  },
  {
    question: "Which geometric object is used as the main stability reference in the z-plane?",
    options: ["Real axis", "Imaginary axis", "Unit circle", "Parabola"],
    correct: 2
  },
  {
    question: "If a pole lies outside the unit circle, the system is:",
    options: ["Stable", "Marginally stable", "Unstable", "Always FIR"]
    ,
    correct: 2
  }
];

export default function DTSPPoleZeroAnalysisQuiz({ experimentRun }) {
  const [quizAnswers, setQuizAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleQuizAnswer = (index, answer) => {
    const updated = [...quizAnswers];
    updated[index] = answer;
    setQuizAnswers(updated);
  };

  const submitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <section className="card">
      <h2>Quiz</h2>

      {!experimentRun ? (
        <p>Please run the simulation at least once before attempting the quiz.</p>
      ) : (
        <div>
          {quizQuestions.map((q, i) => (
            <div key={i} className="quiz-question">
              <p>
                <strong>
                  {i + 1}. {q.question}
                </strong>
              </p>

              {q.options.map((opt, j) => (
                <label
                  key={j}
                  className={`quiz-option ${
                    quizSubmitted
                      ? j === q.correct
                        ? "correct"
                        : quizAnswers[i] === j
                        ? "wrong"
                        : ""
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={j}
                    checked={quizAnswers[i] === j}
                    onChange={() => handleQuizAnswer(i, j)}
                    disabled={quizSubmitted}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          {!quizSubmitted ? (
            <button
              className="btn primary"
              onClick={submitQuiz}
              disabled={quizAnswers.includes(null)}
            >
              Submit Quiz
            </button>
          ) : (
            <div>
              <p>
                Score: {quizScore} / {quizQuestions.length}
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