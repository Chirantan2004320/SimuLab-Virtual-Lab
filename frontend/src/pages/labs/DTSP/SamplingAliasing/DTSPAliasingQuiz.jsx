import React, { useState } from "react";

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
    options: [
      "Above Nyquist",
      "At Nyquist",
      "Below Nyquist",
      "Always safe"
    ],
    correct: 2
  }
];

export default function DTSPAliasingQuiz() {
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
    </section>
  );
}