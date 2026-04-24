import React, { useState } from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";

const SAMPLE_STUDENTS = [
  { id: 1, name: "Aarav", department: "CSE", age: 20, marks: 82 },
  { id: 2, name: "Diya", department: "ECE", age: 21, marks: 91 },
  { id: 3, name: "Kabir", department: "CSE", age: 19, marks: 76 },
  { id: 4, name: "Meera", department: "ME", age: 22, marks: 88 },
  { id: 5, name: "Rohan", department: "CSE", age: 20, marks: 95 },
  { id: 6, name: "Ishita", department: "ECE", age: 19, marks: 84 }
];

const SQL_PROBLEM_BANK = [
  {
    id: 1,
    title: "Top CSE Students",
    description:
      "Write a SQL query to display name, department, and marks for CSE students having marks greater than or equal to 80. Sort the result by marks in descending order and limit the output to top 3 rows.",
    expectedQuery:
      "SELECT name, department, marks FROM students WHERE department = 'CSE' AND marks >= 80 ORDER BY marks DESC LIMIT 3;",
    expectedResult: [
      { name: "Rohan", department: "CSE", marks: 95 },
      { name: "Aarav", department: "CSE", marks: 82 }
    ]
  },
  {
    id: 2,
    title: "ECE Students by Age",
    description:
      "Write a SQL query to display name, age, and department for all ECE students sorted by age in ascending order.",
    expectedQuery:
      "SELECT name, age, department FROM students WHERE department = 'ECE' ORDER BY age ASC;",
    expectedResult: [
      { name: "Ishita", age: 19, department: "ECE" },
      { name: "Diya", age: 21, department: "ECE" }
    ]
  },
  {
    id: 3,
    title: "Adult Students",
    description:
      "Write a SQL query to display id, name, and age for students whose age is greater than or equal to 20. Sort by age in ascending order and limit the result to 2 rows.",
    expectedQuery:
      "SELECT id, name, age FROM students WHERE age >= 20 ORDER BY age ASC LIMIT 2;",
    expectedResult: [
      { id: 1, name: "Aarav", age: 20 },
      { id: 5, name: "Rohan", age: 20 }
    ]
  },
  {
    id: 4,
    title: "High Scorers",
    description:
      "Write a SQL query to display name, department, and marks for students scoring more than or equal to 85. Sort the result by marks in descending order.",
    expectedQuery:
      "SELECT name, department, marks FROM students WHERE marks >= 85 ORDER BY marks DESC;",
    expectedResult: [
      { name: "Diya", department: "ECE", marks: 91 },
      { name: "Meera", department: "ME", marks: 88 },
      { name: "Rohan", department: "CSE", marks: 95 }
    ]
  },
  {
    id: 5,
    title: "Mechanical Department List",
    description:
      "Write a SQL query to display id, name, department, and marks for all students from the ME department.",
    expectedQuery:
      "SELECT id, name, department, marks FROM students WHERE department = 'ME';",
    expectedResult: [
      { id: 4, name: "Meera", department: "ME", marks: 88 }
    ]
  }
];

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

export default function DBMSSQLBasicsCoding() {
  const [currentProblems, setCurrentProblems] = useState([]);
  const [queries, setQueries] = useState({});
  const [results, setResults] = useState({});

  const generateProblems = () => {
    const selected = shuffleArray(SQL_PROBLEM_BANK).slice(0, 3);
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
          "Incorrect Query.\n\nTry checking your SELECT columns, WHERE condition, ORDER BY clause, and LIMIT."
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
      type: "sql_query_analysis",
      experiment: "sql-basics",
      problemId: problem.id,
      title: problem.title,
      description: problem.description,
      sampleTable: SAMPLE_STUDENTS,
      query
    };

    localStorage.setItem("vlab_sql_query_analysis", JSON.stringify(analysisData));
    alert("Query analysis request sent to AI Assistant. Check the AI chat for feedback!");
  };

  const correctQuery = (problem) => {
    const query = queries[problem.id] || "";

    if (!query.trim()) {
      alert("Please enter a query to correct.");
      return;
    }

    const correctionData = {
      type: "sql_query_correction",
      experiment: "sql-basics",
      problemId: problem.id,
      title: problem.title,
      description: problem.description,
      sampleTable: SAMPLE_STUDENTS,
      query,
      expectedQuery: problem.expectedQuery
    };

    localStorage.setItem("vlab_sql_query_correction", JSON.stringify(correctionData));
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
            Generate SQL problems and solve them by writing queries directly.
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