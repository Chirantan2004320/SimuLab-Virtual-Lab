import React, { useState } from "react";
import { Brain, Lock, Trophy, RotateCcw } from "lucide-react";

const questions = [
  {
    q: "A comparator is mainly used to:",
    options: ["Store binary data", "Compare binary values", "Generate clock pulses", "Encode analog input"],
    correct: 1
  },
  {
    q: "If A = 1 and B = 0, which output becomes active?",
    options: ["A < B", "A = B", "A > B", "None"],
    correct: 2
  },
  {
    q: "If A = 0 and B = 0, the active output is:",
    options: ["A > B", "A = B", "A < B", "All outputs"],
    correct: 1
  },
  {
    q: "A 1-bit comparator has how many comparison outputs?",
    options: ["1", "2", "3", "4"],
    correct: 2
  },
  {
    q: "The expression for A > B in a 1-bit comparator is:",
    options: ["A · B̅", "A̅ · B", "A + B", "A̅B̅ + AB"],
    correct: 0
  }
];

export default function DSDComparatorQuiz({ experimentRun }) {
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
            Check your understanding of comparator outputs and logic expressions.
          </p>
        </div>
      </div>

      {!experimentRun ? (
        <div className="quiz-locked-box">
          <Lock size={18} />
          <span>Please interact with the comparator simulation before attempting the quiz.</span>
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