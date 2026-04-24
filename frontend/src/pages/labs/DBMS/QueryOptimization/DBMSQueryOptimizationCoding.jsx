import React from "react";
import {
  Code2,
  Play,
  Database,
  GitMerge,
  Filter,
  Wrench,
  Wand2,
} from "lucide-react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "java", label: "Java" },
];

const FALLBACK_PROBLEMS = {
  selection: [
    {
      title: "Optimize selection query",
      description:
        "Rewrite a query so filtering happens as early as possible using a WHERE clause.",
    },
    {
      title: "Reduce scanned rows",
      description:
        "Write an optimized idea for selecting only CSE students before later processing steps.",
    },
    {
      title: "Selection pushdown plan",
      description:
        "Show how selection pushdown reduces intermediate rows in a query execution plan.",
    },
  ],
  projection: [
    {
      title: "Optimize projection query",
      description:
        "Rewrite a query so only the needed columns are selected instead of using SELECT *.",
    },
    {
      title: "Reduce transferred columns",
      description:
        "Write an optimized query that returns only student_id and name from Students.",
    },
    {
      title: "Projection pushdown plan",
      description:
        "Explain through code or structured output how early projection reduces data flow.",
    },
  ],
  join: [
    {
      title: "Optimize join order",
      description:
        "Write an optimized query plan where filtering happens before a join.",
    },
    {
      title: "Reduce intermediate result",
      description:
        "Show how joining filtered Students with Enrollments is better than joining everything first.",
    },
    {
      title: "Join optimization strategy",
      description:
        "Write a structured answer showing how better join order reduces query cost.",
    },
  ],
};

const FALLBACK_TEMPLATES = {
  selection: {
    javascript: `const answer = {
  original: "SELECT * FROM Students WHERE department = 'CSE'",
  optimizedIdea: "Apply selection early so only CSE rows move to later stages"
};`,
    python: `answer = {
    "original": "SELECT * FROM Students WHERE department = 'CSE'",
    "optimizedIdea": "Apply selection early so only CSE rows move to later stages"
}`,
    cpp: `string answer =
"Apply the WHERE filter as early as possible to reduce rows processed later.";`,
    c: `char answer[] =
"Apply the WHERE filter as early as possible to reduce rows processed later.";`,
    java: `String answer =
"Apply the WHERE filter as early as possible to reduce rows processed later.";`,
  },
  projection: {
    javascript: `const answer = {
  original: "SELECT * FROM Students",
  optimized: "SELECT student_id, name FROM Students",
  optimizedIdea: "Project only required columns early"
};`,
    python: `answer = {
    "original": "SELECT * FROM Students",
    "optimized": "SELECT student_id, name FROM Students",
    "optimizedIdea": "Project only required columns early"
}`,
    cpp: `string answer =
"Select only required columns instead of SELECT * to reduce data transfer.";`,
    c: `char answer[] =
"Select only required columns instead of SELECT * to reduce data transfer.";`,
    java: `String answer =
"Select only required columns instead of SELECT * to reduce data transfer.";`,
  },
  join: {
    javascript: `const answer = {
  originalPlan: "Join Students and Enrollments first, then filter",
  optimizedPlan: "Filter Students by department first, then join with Enrollments"
};`,
    python: `answer = {
    "originalPlan": "Join Students and Enrollments first, then filter",
    "optimizedPlan": "Filter Students by department first, then join with Enrollments"
}`,
    cpp: `string answer =
"Apply selection before join so the join works on fewer rows.";`,
    c: `char answer[] =
"Apply selection before join so the join works on fewer rows.";`,
    java: `String answer =
"Apply selection before join so the join works on fewer rows.";`,
  },
};

export default function DBMSQueryOptimizationCoding({
  codingProblems,
  codingProblem,
  selectedLanguage,
  setSelectedLanguage,
  codes,
  results,
  handleCodeChange,
  runCode,
  analyzeCode,
  correctCode,
  code,
  setCode,
  codeResult,
  mode,
}) {
  const modeIcon =
    mode === "selection" ? (
      <Filter size={18} />
    ) : mode === "projection" ? (
      <Database size={18} />
    ) : (
      <GitMerge size={18} />
    );

  const modeSummary =
    mode === "selection"
      ? "Practice writing optimized answers that apply filtering early."
      : mode === "projection"
      ? "Practice writing optimized answers that keep only required columns."
      : "Practice writing optimized answers that improve join order and reduce intermediate rows.";

  const problems =
    codingProblems && codingProblems.length > 0
      ? codingProblems
      : codingProblem
      ? [codingProblem]
      : FALLBACK_PROBLEMS[mode];

  const useMultiProblemMode =
    Array.isArray(codes) &&
    Array.isArray(results) &&
    typeof handleCodeChange === "function" &&
    typeof analyzeCode === "function" &&
    typeof correctCode === "function";

  const singleStarter = FALLBACK_TEMPLATES[mode]?.[selectedLanguage] || "";

  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Coding Practice</h2>
          <p className="sorting-sim-subtitle">
            Practice {mode.toUpperCase()} query optimization concepts through structured answers and query-plan thinking.
          </p>
        </div>
      </div>

      {problems.map((problem, index) => (
        <div key={index} className="coding-card-upgraded">
          <div className="coding-card-header">
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "rgba(56,189,248,0.10)",
                  border: "1px solid rgba(56,189,248,0.18)",
                  color: "#38bdf8",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                }}
              >
                {modeIcon}
                <span>
                  {mode === "selection"
                    ? "Selection Pushdown"
                    : mode === "projection"
                    ? "Projection Pushdown"
                    : "Join Optimization"}
                </span>
              </div>

              <h3>
                Problem {index + 1}: {problem.title}
              </h3>
              <p>{problem.description}</p>
              {index === 0 && (
                <p style={{ marginTop: 8, color: "#94a3b8" }}>{modeSummary}</p>
              )}
            </div>

            {index === 0 && (
              <div className="coding-language-wrap">
                <label className="sorting-label">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="sorting-select"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <textarea
            value={
              useMultiProblemMode
                ? codes[index] || singleStarter
                : code || singleStarter
            }
            onChange={(e) => {
              if (useMultiProblemMode) {
                handleCodeChange(index, e.target.value);
              } else if (typeof setCode === "function") {
                setCode(e.target.value);
              }
            }}
            rows={14}
            className="coding-textarea-upgraded"
            placeholder="Write your optimized query-plan answer here..."
          />

          <div className="coding-actions-upgraded">
            <button
              className="sim-btn sim-btn-primary"
              onClick={() => {
                if (useMultiProblemMode) runCode(index);
                else runCode();
              }}
            >
              <Play size={16} />
              Run Code
            </button>

            <button
              className="sim-btn sim-btn-muted"
              onClick={() => {
                if (useMultiProblemMode) analyzeCode(index);
              }}
              disabled={!useMultiProblemMode}
            >
              <Wrench size={16} />
              Analyze Query
            </button>

            <button
              className="sim-btn sim-btn-danger"
              onClick={() => {
                if (useMultiProblemMode) correctCode(index);
              }}
              disabled={!useMultiProblemMode}
            >
              <Wand2 size={16} />
              Correct Query
            </button>
          </div>

          {selectedLanguage !== "javascript" && index === 0 && (
            <div className="coding-result-box" style={{ marginTop: 14 }}>
              Execution for {selectedLanguage.toUpperCase()} will be enabled later.
              For now, direct execution works in JavaScript.
            </div>
          )}

          {useMultiProblemMode
            ? results[index] && (
                <div className="coding-result-box">{results[index]}</div>
              )
            : codeResult && <div className="coding-result-box">{codeResult}</div>}
        </div>
      ))}
    </section>
  );
}