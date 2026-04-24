import React, { useState } from "react";
import { Brain, Lock, Trophy, RotateCcw } from "lucide-react";

const questions = [
  {
    q: "A multiplexer is mainly used to:",
    options: [
      "Store data permanently",
      "Select one input from many and route it to output",
      "Invert a signal only",
      "Generate clock signals",
    ],
    correct: 1,
  },
  {
    q: "A 4-to-1 multiplexer has how many select lines?",
    options: ["1", "2", "3", "4"],
    correct: 1,
  },
  {
    q: "If S1S0 = 10, which input is selected?",
    options: ["I0", "I1", "I2", "I3"],
    correct: 2,
  },
  {
    q: "If S1S0 = 01, the output is connected to:",
    options: ["I0", "I1", "I2", "I3"],
    correct: 1,
  },
  {
    q: "Multiplexers are examples of:",
    options: [
      "Sequential circuits",
      "Combinational circuits",
      "Analog amplifiers",
      "Memory cells",
    ],
    correct: 1,
  },
];

export default function DSDMultiplexerQuiz({ experimentRun }) {
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
            Check your understanding of multiplexer selection and routing logic.
          </p>
        </div>
      </div>

      {!experimentRun ? (
        <div className="quiz-locked-box">
          <Lock size={18} />
          <span>Please interact with the multiplexer simulation before attempting the quiz.</span>
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