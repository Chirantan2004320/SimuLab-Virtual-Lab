import React, { useState } from "react";
import { Brain, RotateCcw, CheckCircle2, Lock } from "lucide-react";

const questions = [
  {
    q: "When Vin is LOW, the CMOS inverter output is usually:",
    options: ["LOW", "HIGH", "Floating", "Undefined"],
    correct: 1
  },
  {
    q: "When Vin is HIGH, which transistor mainly conducts?",
    options: ["pMOS", "nMOS", "Both always OFF", "Both always ON"],
    correct: 1
  },
  {
    q: "The switching region is important because:",
    options: [
      "Nothing changes there",
      "Both devices may conduct and output transitions rapidly",
      "Only pMOS exists there",
      "Only layout is affected"
    ],
    correct: 1
  },
  {
    q: "A CMOS inverter ideally produces:",
    options: ["Same logic as input", "Complement of input", "Analog sine wave", "Always zero"],
    correct: 1
  },
  {
    q: "Propagation delay is mainly associated with:",
    options: [
      "Output response time after input switching",
      "Only DC current",
      "Gate color",
      "Substrate connection only"
    ],
    correct: 0
  }
];

export default function DVLSICMOSInverterSimulationQuiz({ experimentRun }) {
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

  const percentage = Math.round((score / questions.length) * 100);

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
              Test your understanding after interacting with the CMOS inverter simulation.
            </p>
          </div>
        </div>

        <div className="quiz-locked-box">
          <Lock size={18} />
          <span>Please interact with the simulation before attempting the quiz.</span>
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
            Answer the questions below based on CMOS inverter operation.
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
              <h3>Quiz Submitted</h3>
              <p>
                Score: <b>{score}</b> / {questions.length} ({percentage}%)
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
                    const isChosen = answers[i] === j;

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