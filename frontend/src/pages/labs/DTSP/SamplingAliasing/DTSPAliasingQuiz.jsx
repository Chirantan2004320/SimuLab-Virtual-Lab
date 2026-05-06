import React, { useState } from "react";
import { Brain, RotateCcw, CheckCircle2, Lock } from "lucide-react";
import { saveQuizResult } from "../../../../API/progressApi";

const quizQuestions = [
  {
    question: "According to the Nyquist criterion, the sampling frequency must be at least:",
    options: [
      "Equal to the signal frequency",
      "Twice the highest signal frequency",
      "Half the signal frequency",
      "Independent of signal frequency"
    ],
    correct: 1
  },
  {
    question: "What happens when a signal is sampled below the Nyquist rate?",
    options: [
      "The signal becomes louder",
      "Aliasing occurs",
      "The signal becomes constant",
      "The phase becomes zero"
    ],
    correct: 1
  },
  {
    question: "Aliasing causes:",
    options: [
      "A high-frequency signal to appear as a lower-frequency signal",
      "A signal to disappear completely",
      "An increase in signal amplitude only",
      "Perfect reconstruction"
    ],
    correct: 0
  },
  {
    question: "If fs = 10 Hz and signal frequency f = 3 Hz, then:",
    options: [
      "Aliasing occurs",
      "Nyquist is satisfied",
      "The signal cannot be sampled",
      "The sequence becomes random"
    ],
    correct: 1
  },
  {
    question: "Which of the following is mainly used to avoid aliasing before sampling?",
    options: [
      "Differentiator",
      "Anti-aliasing low-pass filter",
      "Integrator",
      "Oscillator"
    ],
    correct: 1
  },
  {
    question: "If a 9 Hz signal is sampled at 10 Hz, the sampling is:",
    options: ["Above Nyquist", "At Nyquist", "Below Nyquist", "Always safe"],
    correct: 2
  }
];

export default function DTSPAliasingQuiz({ experimentRun }) {
  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const total = quizQuestions.length;
  const percentage = total ? Math.round((quizScore / total) * 100) : 0;

  const handleQuizAnswer = (index, answer) => {
    const updated = [...quizAnswers];
    updated[index] = answer;
    setQuizAnswers(updated);
  };

  const submitQuiz = async () => {
    let score = 0;

    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });

    setQuizScore(score);
    setQuizSubmitted(true);
    setQuizSaveStatus("Saving quiz result...");

    try {
      await saveQuizResult({
        labSlug: "dtsp",
        experimentSlug: "sampling-aliasing",
        correctAnswers: score,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("DTSP quiz save failed:", error);
      setQuizSaveStatus("Quiz submitted, but backend save failed.");
    }
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizSaveStatus("");
  };

  if (!experimentRun) {
    return (
      <section className="quiz-shell">
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
          <div className="sorting-sim-icon">
            <Brain size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Quiz</h2>
            <p className="sorting-sim-subtitle">
              Test your understanding after running the experiment.
            </p>
          </div>
        </div>

        <div className="quiz-locked-box">
          <Lock size={18} />
          <span>Please run the simulation at least once before attempting the quiz.</span>
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
            Answer the questions below for Sampling & Aliasing.
          </p>
        </div>
      </div>

      {!quizSubmitted ? (
        <div className="quiz-list">
          {quizQuestions.map((q, i) => (
            <div key={i} className="quiz-card-upgraded">
              <div className="quiz-question-title">
                {i + 1}. {q.question}
              </div>

              <div className="quiz-options-grid">
                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    className={`quiz-option-card ${
                      quizAnswers[i] === j ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={j}
                      checked={quizAnswers[i] === j}
                      onChange={() => handleQuizAnswer(i, j)}
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
            disabled={quizAnswers.includes(null)}
          >
            Submit Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-result-shell">
          <div className="quiz-score-box">
            <CheckCircle2 size={22} />
            <div>
              <h3>Quiz Submitted</h3>
              <p>
                Score: <b>{quizScore}</b> / {total} ({percentage}%)
              </p>
            </div>
          </div>

          {quizSaveStatus && (
            <p className="text-sm text-muted-foreground" style={{ marginTop: 8 }}>
              {quizSaveStatus}
            </p>
          )}

          <div className="quiz-list">
            {quizQuestions.map((q, i) => (
              <div key={i} className="quiz-card-upgraded">
                <div className="quiz-question-title">
                  {i + 1}. {q.question}
                </div>

                <div className="quiz-options-grid">
                  {q.options.map((opt, j) => {
                    const isCorrect = j === q.correct;
                    const isChosen = quizAnswers[i] === j;

                    return (
                      <div
                        key={j}
                        className={`quiz-option-card result-mode ${
                          isCorrect ? "correct" : isChosen ? "wrong" : ""
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
    </section>
  );
}