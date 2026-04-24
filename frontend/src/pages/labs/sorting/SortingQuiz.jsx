import React from "react";
import { Brain, RotateCcw, Download, CheckCircle2, Lock } from "lucide-react";

const SortingQuiz = ({
  selectedAlgorithm,
  experimentRun,
  quizQuestions,
  quizAnswers,
  quizSubmitted,
  quizScore,
  handleQuizAnswer,
  submitQuiz,
  redoQuiz,
  exportQuiz
}) => {
  const algorithmNames = {
    bubble: "Bubble Sort",
    selection: "Selection Sort",
    insertion: "Insertion Sort"
  };

  const total = quizQuestions[selectedAlgorithm].length;
  const percentage = total ? Math.round((quizScore / total) * 100) : 0;

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
            Answer the questions below for {algorithmNames[selectedAlgorithm]}.
          </p>
        </div>
      </div>

      {!quizSubmitted ? (
        <div className="quiz-list">
          {quizQuestions[selectedAlgorithm].map((q, i) => (
            <div key={i} className="quiz-card-upgraded">
              <div className="quiz-question-title">
                {i + 1}. {q.question}
              </div>

              <div className="quiz-options-grid">
                {q.options.map((opt, j) => (
                  <label key={j} className="quiz-option-card">
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

          <div className="quiz-list">
            {quizQuestions[selectedAlgorithm].map((q, i) => (
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

            <button className="sim-btn sim-btn-primary" onClick={exportQuiz}>
              <Download size={16} />
              Export Results
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SortingQuiz;