import React, { useState } from "react";
import { Brain, Lock, CheckCircle2, RotateCcw } from "lucide-react";

const questions = [
  {
    q: "A Half Adder adds how many inputs?",
    options: ["1", "2", "3", "4"],
    correct: 1,
  },
  {
    q: "A Full Adder has which extra input compared to a Half Adder?",
    options: ["Clock", "Select", "Carry-in", "Enable"],
    correct: 2,
  },
  {
    q: "In a Half Adder, Sum is given by:",
    options: ["A · B", "A + B", "A ⊕ B", "¬A"],
    correct: 2,
  },
  {
    q: "In a Half Adder, Carry is given by:",
    options: ["A · B", "A ⊕ B", "A + B", "¬(A+B)"],
    correct: 0,
  },
  {
    q: "A Full Adder is mainly used for:",
    options: [
      "Single input inversion",
      "Multi-bit binary addition",
      "Clock generation",
      "Signal delay only",
    ],
    correct: 1,
  },
];

export default function DSDAddersQuiz({ experimentRun }) {
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

  if (!experimentRun) {
    return (
      <section className="quiz-shell">
        <div className="quiz-locked-box">
          <Lock size={18} />
          <span>Please interact with the adder simulation before attempting the quiz.</span>
        </div>
      </section>
    );
  }

  return (
    <section className="quiz-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Brain size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Quiz</h2>
          <p className="sorting-sim-subtitle">
            Verify your understanding of Half Adder and Full Adder concepts.
          </p>
        </div>
      </div>

      {!submitted ? (
        <div className="quiz-list">
          {questions.map((q, i) => (
            <div key={i} className="quiz-card-upgraded">
              <div className="quiz-question-title">
                {i + 1}. {q.q}
              </div>

              <div className="quiz-options-grid">
                {q.options.map((opt, j) => (
                  <label key={j} className="quiz-option-card">
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
            <button
              className="sim-btn sim-btn-primary"
              onClick={submitQuiz}
              disabled={answers.includes(null)}
            >
              Submit Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-result-shell">
          <div className="quiz-score-box">
            <CheckCircle2 size={22} />
            <div>
              <h3>Quiz Completed</h3>
              <p>
                Your score is <strong>{score} / {questions.length}</strong>.
              </p>
            </div>
          </div>

          <button className="sim-btn sim-btn-muted" onClick={redoQuiz}>
            <RotateCcw size={16} />
            Redo Quiz
          </button>
        </div>
      )}
    </section>
  );
}