import React from "react";
import { Code2, Play } from "lucide-react";

const QueueCoding = ({
  codingProblem,
  selectedLanguage,
  setSelectedLanguage,
  code,
  setCode,
  codeResult,
  runCode
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
            Practice queue logic in your preferred language.
          </p>
        </div>
      </div>

      <div className="coding-card-upgraded">
        <div className="coding-card-header">
          <div>
            <h3>{codingProblem.title}</h3>
            <p>{codingProblem.description}</p>
          </div>

          <div className="coding-language-wrap">
            <label className="sorting-label">Select Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
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
        </div>

        {selectedLanguage !== "javascript" && (
          <p style={{ marginTop: 14, color: "#fbbf24", fontWeight: 600 }}>
            Execution for {selectedLanguage.toUpperCase()} will be enabled later with Judge0.
          </p>
        )}

        {codeResult && <div className="coding-result-box">{codeResult}</div>}
      </div>
    </section>
  );
};

export default QueueCoding;