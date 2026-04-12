import React, { useState } from "react";

const questions = [
  {
    q: "A decoder converts:",
    options: [
      "Output lines to binary",
      "Binary input to one active output line",
      "Analog signal to digital",
      "Clock to pulse"
    ],
    correct: 1
  },
  {
    q: "A 2-to-4 decoder has how many outputs?",
    options: ["2", "3", "4", "8"],
    correct: 2
  },
  {
    q: "An encoder performs the reverse operation of a:",
    options: ["Flip-Flop", "Comparator", "Decoder", "Counter"],
    correct: 2
  },
  {
    q: "If input I2 is active in a 4-to-2 encoder, the binary output is:",
    options: ["00", "01", "10", "11"],
    correct: 2
  },
  {
    q: "For a decoder, input 11 activates:",
    options: ["Y0", "Y1", "Y2", "Y3"],
    correct: 3
  }
];

export default function DSDDecoderEncoderQuiz({ experimentRun }) {
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
        <p>Please interact with the decoder/encoder simulation before attempting the quiz.</p>
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