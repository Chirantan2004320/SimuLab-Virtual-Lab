import React from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";

const QueueCoding = ({
  codingProblems,
  queueCodeTemplates,
  queueType,
  selectedLanguage,
  setSelectedLanguage,
  code,
  setCode,
  codeResult,
  runCode,
  analyzeCode,
  correctCode
}) => {
  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Coding Practice</h2>
          <p className="sorting-sim-subtitle">
            Solve queue operation problems and test your implementation.
          </p>
        </div>
      </div>

      <div className="coding-empty-state" style={{ marginBottom: 18 }}>
        <strong>Practice Mode:</strong> Complete all queue problems below. JavaScript can run directly in browser.
      </div>

      {codingProblems.map((problem, index) => (
        <div key={index} className="coding-card-upgraded">
          <div className="coding-card-header">
            <div>
              <h3>Problem {index + 1}</h3>
              <p>{problem.description}</p>
            </div>

            <div className="coding-language-wrap">
              <label className="sorting-label">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  const lang = e.target.value;
                  setSelectedLanguage(lang);
                  setCode(queueCodeTemplates[queueType][lang]);
                }}
                className="sorting-select"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="java">Java</option>
              </select>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={14}
            className="coding-textarea-upgraded"
            placeholder="Write your queue solution here..."
          />

          <div className="coding-actions-upgraded">
            <button className="sim-btn sim-btn-primary" onClick={runCode}>
              <Play size={16} />
              Run Code
            </button>

            <button
              className="sim-btn sim-btn-muted"
              onClick={() => analyzeCode(index, selectedLanguage)}
            >
              <Sparkles size={16} />
              Analyze Code
            </button>

            <button
              className="sim-btn sim-btn-danger"
              onClick={() => correctCode(index, selectedLanguage)}
            >
              <Wrench size={16} />
              Correct Code
            </button>
          </div>

          {selectedLanguage !== "javascript" && (
            <div className="modern-coding-note">
              Execution for {selectedLanguage.toUpperCase()} will be enabled later with Judge0.
            </div>
          )}

          {codeResult && index === 0 && (
            <div className="coding-result-box">{codeResult}</div>
          )}
        </div>
      ))}
    </section>
  );
};

export default QueueCoding;