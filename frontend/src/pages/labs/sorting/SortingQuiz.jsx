import React from 'react';

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

  return (
    <section className="card">
      <h2>Quiz</h2>
      {!experimentRun ? (
        <p>Please run the experiment at least once before attempting the quiz.</p>
      ) : (
        <div>
          {quizQuestions[selectedAlgorithm].map((q, i) => (
            <div key={i} className="quiz-question">
              <p><strong>{i + 1}. {q.question}</strong></p>
              {q.options.map((opt, j) => (
                <label key={j} className={`quiz-option ${quizSubmitted ? (j === q.correct ? 'correct' : (quizAnswers[i] === j ? 'wrong' : '')) : ''}`}>
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={j}
                    checked={quizAnswers[i] === j}
                    onChange={() => handleQuizAnswer(i, j)}
                    disabled={quizSubmitted}
                  />
                  {opt}
                  {quizSubmitted && j === q.correct && quizAnswers[i] !== j && <span> (Correct)</span>}
                </label>
              ))}
            </div>
          ))}
          {!quizSubmitted ? (
            <button className="btn primary" onClick={submitQuiz} disabled={quizAnswers.includes(null)}>Submit Quiz</button>
          ) : (
            <div>
              <p><strong>Experiment:</strong> {algorithmNames[selectedAlgorithm]} SimuLab: Virtual Lab</p>
              <p><strong>Date/Time:</strong> {new Date().toLocaleString()}</p>
              <p>Score: {quizScore} / {quizQuestions[selectedAlgorithm].length}</p>
              <button className="btn secondary" onClick={redoQuiz}>Redo Quiz</button>
              <button className="btn primary" onClick={exportQuiz}>Export Results</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SortingQuiz;