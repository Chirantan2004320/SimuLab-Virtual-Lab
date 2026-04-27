import React, { useState } from "react";
import { Brain, Lock, Trophy, RotateCcw } from "lucide-react";

const questions = [
  {
    q: "A traffic light controller is best represented as:",
    options: [
      "A random circuit",
      "A finite state machine",
      "A database table",
      "An analog amplifier"
    ],
    correct: 1
  },
  {
    q: "In this experiment, the correct sequence is:",
    options: [
      "RED → GREEN → YELLOW → RED",
      "RED → YELLOW → GREEN → RED",
      "GREEN → RED → YELLOW only",
      "All lights ON always"
    ],
    correct: 0
  },
  {
    q: "Why is timing important in a traffic light controller?",
    options: [
      "To keep each light active for a fixed duration",
      "To change board color",
      "To increase voltage randomly",
      "To remove GPIO pins"
    ],
    correct: 0
  },
  {
    q: "Which microcontroller feature controls the LEDs?",
    options: ["GPIO output pins", "Keyboard", "Speaker", "Camera"],
    correct: 0
  },
  {
    q: "Only one light should normally be active because:",
    options: [
      "It avoids confusing traffic signals",
      "It saves code lines only",
      "It makes the resistor bigger",
      "It disables the controller"
    ],
    correct: 0
  }
];

export default function TrafficLightQuiz({ experimentRun }) {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (index, value) => {
    if (submitted) return;
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
            Check your understanding of GPIO sequencing and traffic light logic.
          </p>
        </div>
      </div>

      {!experimentRun ? (
        <div className="quiz-locked-box">
          <Lock size={18} />
          <span>Please interact with the traffic light simulation before attempting the quiz.</span>
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