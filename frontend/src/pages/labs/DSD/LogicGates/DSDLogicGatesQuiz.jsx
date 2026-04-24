import React, { useState } from "react";
import { Brain, Lock, CheckCircle2, RotateCcw } from "lucide-react";

const questions = [
  {
    q: "Which gate passes the input unchanged to the output?",
    options: ["NOT", "BUFFER", "XOR", "NOR"],
    correct: 1,
  },
  {
    q: "Which gate inverts a single input?",
    options: ["AND", "OR", "NOT", "XNOR"],
    correct: 2,
  },
  {
    q: "Which gate gives output 1 only when both inputs are 1?",
    options: ["OR", "AND", "XOR", "NOR"],
    correct: 1,
  },
  {
    q: "XOR gate gives output 1 when:",
    options: [
      "Both inputs are 0",
      "Inputs are different",
      "Inputs are equal",
      "Both inputs are 1",
    ],
    correct: 1,
  },
  {
    q: "XNOR gate gives output 1 when:",
    options: [
      "Inputs are different",
      "Inputs are equal",
      "Only A is 1",
      "Only B is 1",
    ],
    correct: 1,
  },
];

export default function DSDLogicGatesQuiz({ experimentRun }) {
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
            Test your understanding of digital logic gate behavior and truth tables.
          </p>
        </div>
      </div>

      {!experimentRun ? (
        <div className="quiz-locked-box">
          <Lock size={18} />
          <span>Please interact with the logic gate simulation before attempting the quiz.</span>
        </div>
      ) : (
        <>
          {!submitted ? (
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

              <button
                className="sim-btn sim-btn-primary"
                onClick={submitQuiz}
                disabled={answers.includes(null)}
              >
                Submit Quiz
              </button>
            </div>
          ) : (
            <div className="quiz-result-shell">
              <div className="quiz-score-box">
                <CheckCircle2 size={22} />
                <div>
                  <h3>Quiz Completed</h3>
                  <p>
                    You scored {score} / {questions.length}
                  </p>
                </div>
              </div>

              <div className="quiz-list">
                {questions.map((q, i) => (
                  <div key={i} className="quiz-card-upgraded">
                    <div className="quiz-question-title">
                      {i + 1}. {q.q}
                    </div>

                    <div className="quiz-options-grid">
                      {q.options.map((opt, j) => {
                        const isCorrect = j === q.correct;
                        const isWrong = answers[i] === j && j !== q.correct;

                        return (
                          <div
                            key={j}
                            className={`quiz-option-card result-mode ${
                              isCorrect ? "correct" : isWrong ? "wrong" : ""
                            }`}
                          >
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="quiz-actions-row">
                <button className="sim-btn sim-btn-muted" onClick={redoQuiz}>
                  <RotateCcw size={16} />
                  Redo Quiz
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}