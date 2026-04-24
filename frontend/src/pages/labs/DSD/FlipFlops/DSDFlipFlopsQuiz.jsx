import React, { useState } from "react";
import { Brain, Lock, Trophy, RotateCcw } from "lucide-react";

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
    options: ["T = 0", "T = 1", "CLK = 0 only", "Always"],
    correct: 1
  },
  {
    q: "The invalid condition in a basic SR latch is:",
    options: ["S = 0, R = 0", "S = 1, R = 0", "S = 0, R = 1", "S = 1, R = 1"],
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
    <section className="quiz-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Brain size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Quiz</h2>
          <p className="sorting-sim-subtitle">
            Check your understanding of state storage, clocking behavior, and flip-flop operation rules.
          </p>
        </div>
      </div>

      {!experimentRun ? (
        <div className="quiz-locked-box">
          <Lock size={18} />
          <span>Please interact with the flip-flop simulation before attempting the quiz.</span>
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