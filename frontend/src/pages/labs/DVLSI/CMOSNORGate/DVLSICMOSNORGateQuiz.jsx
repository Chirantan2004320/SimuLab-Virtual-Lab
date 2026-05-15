import React, { useState } from "react";
import { Brain, Lock, Trophy, RotateCcw } from "lucide-react";

const questions = [
  {
    q: "What is the output of a NOR gate when both inputs are 0?",
    options: ["0", "1", "Undefined", "Floating"],
    correct: 1
  },
  {
    q: "In a CMOS NOR gate, the pMOS transistors are connected in:",
    options: ["Parallel", "Series", "Feedback", "Cascade only"],
    correct: 1
  },
  {
    q: "In a CMOS NOR gate, the nMOS transistors are connected in:",
    options: ["Series", "Parallel", "Open circuit", "Diagonal"],
    correct: 1
  },
  {
    q: "If A = 1 and B = 0, the NOR output is:",
    options: ["1", "0", "VDD", "Unknown"],
    correct: 1
  },
  {
    q: "The NOR gate outputs HIGH only when:",
    options: [
      "At least one input is HIGH",
      "Both inputs are HIGH",
      "Both inputs are LOW",
      "A is LOW only"
    ],
    correct: 2
  }
];

export default function DVLSICMOSNORQuiz({ experimentRun }) {
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

  const total = questions.length;
  const percentage = total ? Math.round((score / total) * 100) : 0;

  return (
    <section className="quiz-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Brain size={18} />
        </div>

        <div>
          <h2 className="sorting-sim-title">Quiz</h2>

          <p className="sorting-sim-subtitle">
            Test your understanding of CMOS NOR logic behavior, transistor
            conduction paths, pull-up and pull-down networks, and output states.
          </p>
        </div>
      </div>

      {!experimentRun ? (
        <div className="quiz-locked-box">
          <Lock size={18} />

          <span>
            Please interact with the CMOS NOR simulation before attempting the
            quiz.
          </span>
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
                    className={`quiz-option-card ${
                      answers[i] === j ? "selected" : ""
                    }`}
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
            <Trophy size={22} />

            <div>
              <h3>Quiz Completed</h3>

              <p>
                Score: <strong>{score} / {total}</strong> ({percentage}%)
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
                          isCorrect
                            ? "correct"
                            : isWrong
                            ? "wrong"
                            : ""
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
            <button
              className="sim-btn sim-btn-muted"
              onClick={redoQuiz}
            >
              <RotateCcw size={16} />
              Retry Quiz
            </button>
          </div>
        </div>
      )}
    </section>
  );
}