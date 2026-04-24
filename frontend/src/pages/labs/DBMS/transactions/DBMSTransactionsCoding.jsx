import React, { useMemo, useState } from "react";
import { Code2, Play, Sparkles, Wrench } from "lucide-react";

const TRANSACTION_PROBLEM_BANK = {
  commit: [
    {
      id: 1,
      title: "Money Transfer with COMMIT",
      description:
        "Write SQL statements to transfer ₹1000 from account A101 to account B205 and permanently save the changes after both updates succeed.",
      expectedKeywords: ["begin", "update", "commit", "accounts"]
    },
    {
      id: 2,
      title: "Successful Transaction Save",
      description:
        "Write a transaction that debits one account, credits another, and then commits the transaction.",
      expectedKeywords: ["begin", "update", "commit", "where"]
    },
    {
      id: 3,
      title: "Permanent Save After Updates",
      description:
        "Write SQL for a successful two-step transaction that ends with COMMIT.",
      expectedKeywords: ["begin", "commit", "update", "transaction"]
    }
  ],
  rollback: [
    {
      id: 1,
      title: "Undo Failed Transfer",
      description:
        "Write SQL statements to start a transaction, perform one update, and rollback the whole transaction if an error occurs before completion.",
      expectedKeywords: ["begin", "rollback", "update", "accounts"]
    },
    {
      id: 2,
      title: "Rollback After Error",
      description:
        "Write a transaction where the debit happens first, then an error occurs, and the changes are rolled back.",
      expectedKeywords: ["begin", "update", "rollback", "transaction"]
    },
    {
      id: 3,
      title: "Restore Previous State",
      description:
        "Write SQL that demonstrates how rollback restores the earlier consistent database state.",
      expectedKeywords: ["begin", "rollback", "update", "where"]
    }
  ],
  atomicity: [
    {
      id: 1,
      title: "Atomic Bank Transfer",
      description:
        "Write SQL statements for a bank transfer where both debit and credit must happen together or not happen at all.",
      expectedKeywords: ["begin", "update", "commit", "rollback"]
    },
    {
      id: 2,
      title: "All-or-Nothing Transfer",
      description:
        "Write a transaction showing that either both updates complete successfully or the whole transaction is undone.",
      expectedKeywords: ["begin", "commit", "rollback", "transaction"]
    },
    {
      id: 3,
      title: "Atomicity Demonstration",
      description:
        "Write SQL for a transfer that preserves Atomicity using transaction control statements.",
      expectedKeywords: ["begin", "update", "commit", "rollback"]
    }
  ]
};

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function normalizeText(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function DBMSTransactionsCoding({ transactionType }) {
  const [currentProblems, setCurrentProblems] = useState([]);
  const [queries, setQueries] = useState({});
  const [results, setResults] = useState({});

  const problemBank = useMemo(
    () => TRANSACTION_PROBLEM_BANK[transactionType] || [],
    [transactionType]
  );

  const generateProblems = () => {
    const selected = shuffleArray(problemBank).slice(0, Math.min(3, problemBank.length));
    const initialQueries = {};
    const initialResults = {};

    selected.forEach((problem) => {
      initialQueries[problem.id] = "-- Write your SQL transaction query here\n";
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
        [problem.id]: "Please write your SQL transaction first."
      }));
      return;
    }

    const normalizedQuery = normalizeText(userQuery);
    const matchedKeywords = problem.expectedKeywords.filter((keyword) =>
      normalizedQuery.includes(keyword.toLowerCase())
    );

    if (matchedKeywords.length >= 3) {
      setResults((prev) => ({
        ...prev,
        [problem.id]:
          `Good Query!\n\nYour answer includes important transaction concepts such as: ${matchedKeywords.join(", ")}.`
      }));
    } else {
      setResults((prev) => ({
        ...prev,
        [problem.id]:
          `Your query needs improvement.\n\nTry including the required transaction control statements and update steps for ${transactionType.toUpperCase()}.`
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
      type: "transaction_query_analysis",
      experiment: "transactions",
      transactionType,
      problemId: problem.id,
      title: problem.title,
      description: problem.description,
      query
    };

    localStorage.setItem("vlab_transaction_query_analysis", JSON.stringify(analysisData));
    alert("Query analysis request sent to AI Assistant. Check the AI chat for feedback!");
  };

  const correctQuery = (problem) => {
    const query = queries[problem.id] || "";

    if (!query.trim()) {
      alert("Please enter a query to correct.");
      return;
    }

    const correctionData = {
      type: "transaction_query_correction",
      experiment: "transactions",
      transactionType,
      problemId: problem.id,
      title: problem.title,
      description: problem.description,
      query,
      expectedKeywords: problem.expectedKeywords
    };

    localStorage.setItem("vlab_transaction_query_correction", JSON.stringify(correctionData));
    alert("Query correction request sent to AI Assistant. Check the AI chat for the corrected query!");
  };

  return (
    <section className="coding-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Code2 size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">SQL Transaction Practice</h2>
          <p className="sorting-sim-subtitle">
            Generate {transactionType.toUpperCase()} transaction problems and solve them by writing SQL directly.
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
            placeholder="Write your SQL transaction query here..."
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