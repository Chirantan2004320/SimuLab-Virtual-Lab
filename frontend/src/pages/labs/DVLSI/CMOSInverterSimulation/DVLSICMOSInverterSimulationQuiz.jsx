import React, { useState } from "react";

const questions = [
  {
    q: "When Vin is LOW, the CMOS inverter output is usually:",
    options: ["LOW", "HIGH", "Floating", "Undefined"],
    correct: 1
  },
  {
    q: "When Vin is HIGH, which transistor mainly conducts in a CMOS inverter?",
    options: ["pMOS", "nMOS", "Both always OFF", "Both always ON"],
    correct: 1
  },
  {
    q: "The switching region of a CMOS inverter is important because:",
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
    options: [
      "Same logic as input",
      "Complement of input",
      "Analog sine wave",
      "Always zero"
    ],
    correct: 1
  },
  {
    q: "Propagation delay is mainly associated with:",
    options: [
      "Change in output over time after input switching",
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

  return (
    <section className="card">
      <h2>Quiz</h2>

      {!experimentRun ? (
        <p>Please interact with the CMOS inverter simulation before attempting the quiz.</p>
      ) : (
        <div>
          {questions.map((q, i) => (
            <div key={i} className="quiz-question">
              <p>
                <strong>
                  {i + 1}. {q.q}
                </strong>
              </p>

              {q.options.map((opt, j) => (
                <label
                  key={j}
                  className={`quiz-option ${
                    submitted
                      ? j === q.correct
                        ? "correct"
                        : answers[i] === j
                        ? "wrong"
                        : ""
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={j}
                    checked={answers[i] === j}
                    onChange={() => handleAnswer(i, j)}
                    disabled={submitted}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          {!submitted ? (
            <button
              className="btn primary"
              onClick={submitQuiz}
              disabled={answers.includes(null)}
            >
              Submit Quiz
            </button>
          ) : (
            <div>
              <p>
                Score: {score} / {questions.length}
              </p>
              <button className="btn secondary" onClick={redoQuiz}>
                Redo Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}