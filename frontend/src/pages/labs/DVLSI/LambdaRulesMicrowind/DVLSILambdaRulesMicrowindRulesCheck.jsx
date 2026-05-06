import React from "react";
import { CheckSquare, AlertTriangle, ShieldCheck, Lightbulb } from "lucide-react";

export default function DVLSILambdaRulesMicrowindRulesCheck({ analysis, lambdaValue }) {
  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <CheckSquare size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Rules Check</h2>
          <p className="sorting-sim-subtitle">
            Validate layout dimensions using simplified lambda-based DRC rules.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <ShieldCheck size={16} style={{ marginRight: 10 }} />
        This section performs a simplified DRC-style validation using lambda-based minimum design rules.
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Current Lambda</span>
          <span className="sorting-stat-value">{lambdaValue}λ</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Total Rules</span>
          <span className="sorting-stat-value">{analysis.checks.length}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Violations</span>
          <span
            className="sorting-stat-value"
            style={{ color: analysis.allPass ? "#22c55e" : "#ef4444" }}
          >
            {analysis.violations.length}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">DRC Status</span>
          <span
            className="sorting-stat-value"
            style={{ color: analysis.allPass ? "#22c55e" : "#ef4444" }}
          >
            {analysis.allPass ? "PASS" : "FAIL"}
          </span>
        </div>
      </div>

      <div className="overview-card" style={{ marginBottom: 18 }}>
        <div className="overview-card-head">
          <CheckSquare size={18} />
          <h4>Rule Validation Table</h4>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="dbms-table">
            <thead>
              <tr>
                <th>Rule</th>
                <th>Actual</th>
                <th>Required</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {analysis.checks.map((item, index) => (
                <tr key={index} className={!item.pass ? "highlight-row" : ""}>
                  <td>{item.name}</td>
                  <td>{item.actual}λ</td>
                  <td>{item.required}λ</td>
                  <td style={{ color: item.pass ? "#22c55e" : "#ef4444", fontWeight: 800 }}>
                    {item.pass ? "PASS" : "FAIL"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overview-card" style={{ marginBottom: 18 }}>
        <div className="overview-card-head">
          <AlertTriangle size={18} />
          <h4>Violation Summary</h4>
        </div>

        {analysis.allPass ? (
          <p style={{ color: "#86efac" }}>
            No violations found. The layout satisfies all simplified lambda rules.
          </p>
        ) : (
          <div>
            {analysis.violations.map((v, i) => (
              <p key={i} style={{ color: "#fca5a5", marginBottom: 8 }}>
                {v.name} is too small: actual = {v.actual}λ, required = {v.required}λ.
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <Lightbulb size={18} />
          <h4>Engineering Insight</h4>
        </div>
        <p>
          Layout rule violations can lead to fabrication failures such as shorts, opens,
          weak connectivity, or poor manufacturability. DRC is therefore a critical step
          in physical design.
        </p>
      </div>
    </section>
  );
}