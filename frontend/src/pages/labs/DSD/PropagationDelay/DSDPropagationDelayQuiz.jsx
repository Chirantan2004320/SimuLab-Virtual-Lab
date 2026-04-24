import React, { useState } from "react";
import { Brain, Lock, Trophy, RotateCcw } from "lucide-react";

const questions = [
  {
    q: "Propagation delay is the time between:",
    options: [
      "Power ON and power OFF",
      "Input change and corresponding output change",
      "Two clock cycles only",
      "Two unrelated signals"
    ],
    correct: 1
  },
  {
    q: "Propagation delay is usually measured in:",
    options: ["Amperes", "Volts", "Nanoseconds", "Ohms"],
    correct: 2
  },
  {
    q: "If time is less than the propagation delay:",
    options: [
      "Output must instantly change",
      "Output still shows old value",
      "Circuit turns off",
      "Clock stops"
    ],
    correct: 1
  },
  {
    q: "Ignoring propagation delay can lead to:",
    options: [
      "Better timing always",
      "Infinite memory",
      "Timing errors",
      "Lower voltage only"
    ],
    correct: 2
  },
  {
    q: "Propagation delay is important in:",
    options: [
      "Timing analysis",
      "Painting circuits",
      "Battery charging only",
      "Keyboard layout"
    ],
    correct: 0
  }
];

export default function DSDPropagationDelayQuiz({ experimentRun }) {
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
    <section className="quiz-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Brain size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Quiz</h2>
          <p className="sorting-sim-subtitle">
            Test your understanding of delayed signal response and timing behavior in real digital circuits.
          </p>
        </div>
      </div>

      {!experimentRun ? (
        <div className="quiz-locked-box">
          <Lock size={18} />
          <span>Please interact with the propagation delay simulation before attempting the quiz.</span>
        </div>
      ) : !submitted ? (
        <div className="quiz-list">
          {questions.map((q, i) => (
            <div key={i} className="quiz-card-upgraded">
              <div className="quiz-question-title">
                {i + 1}. {q.q}
              </div>

              <div className="quiz-options-grid">
                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    className={`quiz-option-card ${answers[i] === j ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={answers[i] === j}
                      onChange={() => handleAnswer(i, j)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="quiz-actions-row">
            <button className="sim-btn sim-btn-primary" onClick={submitQuiz} disabled={answers.includes(null)}>
              Submit Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-result-shell">
          <div className="quiz-score-box">
            <Trophy size={22} />
            <div>
              <h3>Quiz Completed</h3>
              <p>
                Your score: <strong>{score} / {questions.length}</strong>
              </p>
            </div>
          </div>

          <div className="quiz-actions-row">
            <button className="sim-btn sim-btn-muted" onClick={redoQuiz}>
              <RotateCcw size={16} />
              Retry Quiz
            </button>
          </div>
        </div>
      )}
    </section>
  );
}