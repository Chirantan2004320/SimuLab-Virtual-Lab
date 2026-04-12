import React, { useState } from "react";

const questions = [
  {
    q: "A multiplexer is mainly used to:",
    options: [
      "Store data permanently",
      "Select one input from many and route it to output",
      "Invert a signal only",
      "Generate clock signals"
    ],
    correct: 1
  },
  {
    q: "A 4-to-1 multiplexer has how many select lines?",
    options: ["1", "2", "3", "4"],
    correct: 1
  },
  {
    q: "If S1S0 = 10, which input is selected?",
    options: ["I0", "I1", "I2", "I3"],
    correct: 2
  },
  {
    q: "If S1S0 = 01, the output is connected to:",
    options: ["I0", "I1", "I2", "I3"],
    correct: 1
  },
  {
    q: "Multiplexers are examples of:",
    options: [
      "Sequential circuits",
      "Combinational circuits",
      "Analog amplifiers",
      "Memory cells"
    ],
    correct: 1
  }
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
    <section className="card">
      <h2>Quiz</h2>

      {!experimentRun ? (
        <p>Please interact with the multiplexer simulation before attempting the quiz.</p>
      ) : (
        <div>
          {questions.map((q, i) => (
            <div key={i} className="quiz-question">
              <p>
                <strong>{i + 1}. {q.q}</strong>
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
              <p>Score: {score} / {questions.length}</p>
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