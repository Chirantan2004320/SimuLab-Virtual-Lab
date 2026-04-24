import React, { useMemo, useState } from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";

const NORMALIZATION_PROBLEM_BANK = {
  "1nf": [
    {
      id: 1,
      title: "Convert Repeating Subjects to 1NF",
      description:
        "A table stores multiple subjects like 'DBMS, OS' in a single cell. Write the 1NF design approach to fix it.",
      expectedKeywords: ["atomic", "separate rows", "one value", "repeating groups"]
    },
    {
      id: 2,
      title: "Fix Non-Atomic Phone Numbers",
      description:
        "A student table stores multiple phone numbers in one column separated by commas. Explain how to convert it into 1NF.",
      expectedKeywords: ["atomic", "one phone number", "separate rows", "separate table"]
    },
    {
      id: 3,
      title: "Convert Multi-Valued Skills Column",
      description:
        "An employee table stores skills like 'Java, SQL, Python' in one cell. Describe the 1NF transformation.",
      expectedKeywords: ["atomic", "one skill", "separate rows", "repeating groups"]
    }
  ],
  "2nf": [
    {
      id: 1,
      title: "Remove Partial Dependency",
      description:
        "A table has composite key (student_id, course_id), but course_name depends only on course_id. Explain how to convert it into 2NF.",
      expectedKeywords: ["partial dependency", "composite key", "separate course table", "studentcourse"]
    },
    {
      id: 2,
      title: "Split Enrollment Table",
      description:
        "In an enrollment table, instructor_name depends only on course_id while the primary key is (student_id, course_id). Describe the 2NF design.",
      expectedKeywords: ["partial dependency", "separate table", "course_id", "whole key"]
    },
    {
      id: 3,
      title: "Normalize Order Details to 2NF",
      description:
        "In an order table with composite key (order_id, product_id), product_name depends only on product_id. Explain the 2NF fix.",
      expectedKeywords: ["partial dependency", "product table", "order details", "composite key"]
    }
  ],
  "3nf": [
    {
      id: 1,
      title: "Remove Transitive Dependency",
      description:
        "A student table stores department_name and department_office, where department_office depends on department_name. Explain the 3NF design.",
      expectedKeywords: ["transitive dependency", "separate department table", "non-key", "depends only on key"]
    },
    {
      id: 2,
      title: "Normalize Employee Department Details",
      description:
        "An employee table stores department_name and manager_name, where manager_name depends on department_name. Describe the 3NF fix.",
      expectedKeywords: ["transitive dependency", "department table", "manager", "non-key"]
    },
    {
      id: 3,
      title: "Separate City Information",
      description:
        "A customer table stores city and city_zipcode, where city_zipcode depends on city rather than customer_id. Explain how to convert it into 3NF.",
      expectedKeywords: ["transitive dependency", "separate city table", "non-key", "customer"]
    }
  ]
};

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function normalizeText(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function DBMSNormalizationCoding({ normalForm }) {
  const [currentProblems, setCurrentProblems] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});

  const problemBank = useMemo(
    () => NORMALIZATION_PROBLEM_BANK[normalForm] || [],
    [normalForm]
  );

  const generateProblems = () => {
    const selected = shuffleArray(problemBank).slice(0, Math.min(3, problemBank.length));
    const initialAnswers = {};
    const initialResults = {};

    selected.forEach((problem) => {
      initialAnswers[problem.id] = "";
      initialResults[problem.id] = "";
    });

    setCurrentProblems(selected);
    setAnswers(initialAnswers);
    setResults(initialResults);
  };

  const handleAnswerChange = (problemId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [problemId]: value
    }));
  };

  const runAnswer = (problem) => {
    const userAnswer = answers[problem.id] || "";

    if (!userAnswer.trim()) {
      setResults((prev) => ({
        ...prev,
        [problem.id]: "Please write your normalization answer first."
      }));
      return;
    }

    const normalizedAnswer = normalizeText(userAnswer);
    const matchedKeywords = problem.expectedKeywords.filter((keyword) =>
      normalizedAnswer.includes(keyword.toLowerCase())
    );

    if (matchedKeywords.length >= 2) {
      setResults((prev) => ({
        ...prev,
        [problem.id]:
          `Good Answer!\n\nYour explanation includes important normalization ideas such as: ${matchedKeywords.join(", ")}.`
      }));
    } else {
      setResults((prev) => ({
        ...prev,
        [problem.id]:
          `Your answer needs improvement.\n\nTry mentioning the dependency issue clearly and explain how the table should be split to achieve ${normalForm.toUpperCase()}.`
      }));
    }
  };

  const analyzeAnswer = (problem) => {
    const answer = answers[problem.id] || "";

    if (!answer.trim()) {
      alert("Please enter an answer to analyze.");
      return;
    }

    const analysisData = {
      type: "normalization_answer_analysis",
      experiment: "normalization",
      normalForm,
      problemId: problem.id,
      title: problem.title,
      description: problem.description,
      answer
    };

    localStorage.setItem("vlab_normalization_answer_analysis", JSON.stringify(analysisData));
    alert("Answer analysis request sent to AI Assistant. Check the AI chat for feedback!");
  };

  const correctAnswer = (problem) => {
    const answer = answers[problem.id] || "";

    if (!answer.trim()) {
      alert("Please enter an answer to correct.");
      return;
    }

    const correctionData = {
      type: "normalization_answer_correction",
      experiment: "normalization",
      normalForm,
      problemId: problem.id,
      title: problem.title,
      description: problem.description,
      answer,
      expectedKeywords: problem.expectedKeywords
    };

    localStorage.setItem("vlab_normalization_answer_correction", JSON.stringify(correctionData));
    alert("Answer correction request sent to AI Assistant. Check the AI chat for the corrected answer!");
  };

  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Normalization Practice</h2>
          <p className="sorting-sim-subtitle">
            Generate {normalForm.toUpperCase()} design questions and solve them by writing normalization steps directly.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button className="sim-btn sim-btn-primary" onClick={generateProblems}>
          Generate Problems
        </button>
      </div>

      {currentProblems.length === 0 ? (
        <div className="coding-empty-state">
          No problems generated yet. Click <b>Generate Problems</b> to begin.
        </div>
      ) : null}

      {currentProblems.map((problem, index) => (
        <div key={problem.id} className="coding-card-upgraded">
          <div className="coding-card-header">
            <div>
              <h3>Problem {index + 1}</h3>
              <p style={{ marginBottom: 10 }}>
                <strong>{problem.title}</strong>
              </p>
              <p>{problem.description}</p>
            </div>
          </div>

          <textarea
            value={answers[problem.id] || ""}
            onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
            placeholder="Write your normalization answer here..."
            rows={14}
            className="coding-textarea-upgraded"
          />

          <div className="coding-actions-upgraded">
            <button
              className="sim-btn sim-btn-primary"
              onClick={() => runAnswer(problem)}
            >
              <Play size={16} />
              Run Answer
            </button>

            <button
              className="sim-btn sim-btn-muted"
              onClick={() => analyzeAnswer(problem)}
            >
              <Sparkles size={16} />
              Analyze Answer
            </button>

            <button
              className="sim-btn sim-btn-danger"
              onClick={() => correctAnswer(problem)}
            >
              <Wrench size={16} />
              Correct Answer
            </button>
          </div>

          {results[problem.id] && (
            <div className="coding-result-box">
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "inherit"
                }}
              >
                {results[problem.id]}
              </pre>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}