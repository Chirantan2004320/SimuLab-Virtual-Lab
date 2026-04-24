import React, { useMemo, useState } from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";

const JOIN_PROBLEM_BANK = {
  inner: [
    {
      id: 1,
      title: "Basic INNER JOIN",
      description:
        "Write a SQL query to display student name, department name, and HOD name for only matching department records.",
      expectedQuery:
        "SELECT s.name, d.department_name, d.hod FROM students s INNER JOIN departments d ON s.department_id = d.department_id;",
      expectedResult: [
        { name: "Aarav", department_name: "CSE", hod: "Dr. Sharma" },
        { name: "Diya", department_name: "ECE", hod: "Dr. Iyer" },
        { name: "Kabir", department_name: "CSE", hod: "Dr. Sharma" },
        { name: "Meera", department_name: "Civil", hod: "Dr. Rao" }
      ]
    },
    {
      id: 2,
      title: "INNER JOIN with IDs",
      description:
        "Write a SQL query to display student name, student department_id, department name, and HOD for matching rows only.",
      expectedQuery:
        "SELECT s.name, s.department_id, d.department_name, d.hod FROM students s INNER JOIN departments d ON s.department_id = d.department_id;",
      expectedResult: [
        { name: "Aarav", department_id: 101, department_name: "CSE", hod: "Dr. Sharma" },
        { name: "Diya", department_id: 102, department_name: "ECE", hod: "Dr. Iyer" },
        { name: "Kabir", department_id: 101, department_name: "CSE", hod: "Dr. Sharma" },
        { name: "Meera", department_id: 104, department_name: "Civil", hod: "Dr. Rao" }
      ]
    },
    {
      id: 3,
      title: "INNER JOIN Department Mapping",
      description:
        "Write a SQL query to display only students that successfully map to a department using INNER JOIN.",
      expectedQuery:
        "SELECT s.name, d.department_name FROM students s INNER JOIN departments d ON s.department_id = d.department_id;",
      expectedResult: [
        { name: "Aarav", department_name: "CSE" },
        { name: "Diya", department_name: "ECE" },
        { name: "Kabir", department_name: "CSE" },
        { name: "Meera", department_name: "Civil" }
      ]
    }
  ],
  left: [
    {
      id: 1,
      title: "Basic LEFT JOIN",
      description:
        "Write a SQL query to display all students along with department name and HOD, even if some students do not have a matching department.",
      expectedQuery:
        "SELECT s.name, d.department_name, d.hod FROM students s LEFT JOIN departments d ON s.department_id = d.department_id;",
      expectedResult: [
        { name: "Aarav", department_name: "CSE", hod: "Dr. Sharma" },
        { name: "Diya", department_name: "ECE", hod: "Dr. Iyer" },
        { name: "Kabir", department_name: "CSE", hod: "Dr. Sharma" },
        { name: "Meera", department_name: "Civil", hod: "Dr. Rao" },
        { name: "Rohan", department_name: "NULL", hod: "NULL" }
      ]
    },
    {
      id: 2,
      title: "LEFT JOIN with department_id",
      description:
        "Write a SQL query to display student name, student department_id, department name, and HOD for all students.",
      expectedQuery:
        "SELECT s.name, s.department_id, d.department_name, d.hod FROM students s LEFT JOIN departments d ON s.department_id = d.department_id;",
      expectedResult: [
        { name: "Aarav", department_id: 101, department_name: "CSE", hod: "Dr. Sharma" },
        { name: "Diya", department_id: 102, department_name: "ECE", hod: "Dr. Iyer" },
        { name: "Kabir", department_id: 101, department_name: "CSE", hod: "Dr. Sharma" },
        { name: "Meera", department_id: 104, department_name: "Civil", hod: "Dr. Rao" },
        { name: "Rohan", department_id: 105, department_name: "NULL", hod: "NULL" }
      ]
    },
    {
      id: 3,
      title: "LEFT JOIN Department Visibility",
      description:
        "Write a SQL query to show every student and the department name if available.",
      expectedQuery:
        "SELECT s.name, d.department_name FROM students s LEFT JOIN departments d ON s.department_id = d.department_id;",
      expectedResult: [
        { name: "Aarav", department_name: "CSE" },
        { name: "Diya", department_name: "ECE" },
        { name: "Kabir", department_name: "CSE" },
        { name: "Meera", department_name: "Civil" },
        { name: "Rohan", department_name: "NULL" }
      ]
    }
  ],
  right: [
    {
      id: 1,
      title: "Basic RIGHT JOIN",
      description:
        "Write a SQL query to display all departments along with student names, even if some departments have no students.",
      expectedQuery:
        "SELECT s.name, d.department_name, d.hod FROM students s RIGHT JOIN departments d ON s.department_id = d.department_id;",
      expectedResult: [
        { name: "Aarav", department_name: "CSE", hod: "Dr. Sharma" },
        { name: "Kabir", department_name: "CSE", hod: "Dr. Sharma" },
        { name: "Diya", department_name: "ECE", hod: "Dr. Iyer" },
        { name: "NULL", department_name: "ME", hod: "Dr. Khan" },
        { name: "Meera", department_name: "Civil", hod: "Dr. Rao" }
      ]
    },
    {
      id: 2,
      title: "RIGHT JOIN with IDs",
      description:
        "Write a SQL query to display student name, student department_id, department name, and HOD for all departments.",
      expectedQuery:
        "SELECT s.name, s.department_id, d.department_name, d.hod FROM students s RIGHT JOIN departments d ON s.department_id = d.department_id;",
      expectedResult: [
        { name: "Aarav", department_id: 101, department_name: "CSE", hod: "Dr. Sharma" },
        { name: "Kabir", department_id: 101, department_name: "CSE", hod: "Dr. Sharma" },
        { name: "Diya", department_id: 102, department_name: "ECE", hod: "Dr. Iyer" },
        { name: "NULL", department_id: "NULL", department_name: "ME", hod: "Dr. Khan" },
        { name: "Meera", department_id: 104, department_name: "Civil", hod: "Dr. Rao" }
      ]
    },
    {
      id: 3,
      title: "RIGHT JOIN Department Coverage",
      description:
        "Write a SQL query to show every department and the student name if a matching student exists.",
      expectedQuery:
        "SELECT s.name, d.department_name FROM students s RIGHT JOIN departments d ON s.department_id = d.department_id;",
      expectedResult: [
        { name: "Aarav", department_name: "CSE" },
        { name: "Kabir", department_name: "CSE" },
        { name: "Diya", department_name: "ECE" },
        { name: "NULL", department_name: "ME" },
        { name: "Meera", department_name: "Civil" }
      ]
    }
  ]
};

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function normalizeSql(query) {
  return query
    .replace(/\s+/g, " ")
    .replace(/\s*;\s*$/, "")
    .trim()
    .toLowerCase();
}

function renderTable(rows) {
  if (!rows || rows.length === 0) {
    return "No rows returned.";
  }
  return JSON.stringify(rows, null, 2);
}

export default function DBMSJoinsCoding({ joinType }) {
  const [currentProblems, setCurrentProblems] = useState([]);
  const [queries, setQueries] = useState({});
  const [results, setResults] = useState({});

  const problemBank = useMemo(() => JOIN_PROBLEM_BANK[joinType] || [], [joinType]);

  const generateProblems = () => {
    const selected = shuffleArray(problemBank).slice(0, Math.min(3, problemBank.length));
    const initialQueries = {};
    const initialResults = {};

    selected.forEach((problem) => {
      initialQueries[problem.id] = "-- Write your SQL query here\n";
      initialResults[problem.id] = "";
    });

    setCurrentProblems(selected);
    setQueries(initialQueries);
    setResults(initialResults);
  };

  const handleQueryChange = (problemId, value) => {
    setQueries((prev) => ({
      ...prev,
      [problemId]: value
    }));
  };

  const runQuery = (problem) => {
    const userQuery = queries[problem.id] || "";

    if (!userQuery.trim()) {
      setResults((prev) => ({
        ...prev,
        [problem.id]: "Please write a SQL query first."
      }));
      return;
    }

    const normalizedUserQuery = normalizeSql(userQuery);
    const normalizedExpectedQuery = normalizeSql(problem.expectedQuery);

    if (normalizedUserQuery === normalizedExpectedQuery) {
      setResults((prev) => ({
        ...prev,
        [problem.id]: `Correct Query!\n\nResult:\n${renderTable(problem.expectedResult)}`
      }));
    } else {
      setResults((prev) => ({
        ...prev,
        [problem.id]:
          `Incorrect Query.\n\nCheck your ${joinType.toUpperCase()} JOIN syntax, selected columns, table aliases, and ON condition.`
      }));
    }
  };

  const analyzeQuery = (problem) => {
    const query = queries[problem.id] || "";

    if (!query.trim()) {
      alert("Please enter a query to analyze.");
      return;
    }

    const analysisData = {
      type: "sql_join_query_analysis",
      experiment: "sql-joins",
      joinType,
      problemId: problem.id,
      title: problem.title,
      description: problem.description,
      query
    };

    localStorage.setItem("vlab_sql_join_query_analysis", JSON.stringify(analysisData));
    alert("Query analysis request sent to AI Assistant. Check the AI chat for feedback!");
  };

  const correctQuery = (problem) => {
    const query = queries[problem.id] || "";

    if (!query.trim()) {
      alert("Please enter a query to correct.");
      return;
    }

    const correctionData = {
      type: "sql_join_query_correction",
      experiment: "sql-joins",
      joinType,
      problemId: problem.id,
      title: problem.title,
      description: problem.description,
      query,
      expectedQuery: problem.expectedQuery
    };

    localStorage.setItem("vlab_sql_join_query_correction", JSON.stringify(correctionData));
    alert("Query correction request sent to AI Assistant. Check the AI chat for the corrected query!");
  };

  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">SQL Query Practice</h2>
          <p className="sorting-sim-subtitle">
            Generate {joinType.toUpperCase()} JOIN problems and solve them by writing SQL queries directly.
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
            value={queries[problem.id] || ""}
            onChange={(e) => handleQueryChange(problem.id, e.target.value)}
            placeholder="Write your SQL query here..."
            rows={14}
            className="coding-textarea-upgraded"
          />

          <div className="coding-actions-upgraded">
            <button
              className="sim-btn sim-btn-primary"
              onClick={() => runQuery(problem)}
            >
              <Play size={16} />
              Run Query
            </button>

            <button
              className="sim-btn sim-btn-muted"
              onClick={() => analyzeQuery(problem)}
            >
              <Sparkles size={16} />
              Analyze Query
            </button>

            <button
              className="sim-btn sim-btn-danger"
              onClick={() => correctQuery(problem)}
            >
              <Wrench size={16} />
              Correct Query
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