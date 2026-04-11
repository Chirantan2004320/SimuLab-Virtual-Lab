import React from "react";

export default function DVLSILambdaRulesMicrowindRulesCheck({ analysis, lambdaValue }) {
  return (
    <section className="card experiment">
      <h2>Rules Check</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        This section performs a simplified DRC-style validation using lambda-based minimum design rules.
      </div>

      <div className="stat-card" style={{ marginBottom: "1rem" }}>
        <strong>Current Lambda</strong>
        <div>{lambdaValue}λ</div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Rule Validation Table</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
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
                <td>{item.pass ? "PASS" : "FAIL"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Violation Summary</h3>
        {analysis.allPass ? (
          <p style={{ marginTop: "0.75rem", color: "#86efac" }}>
            No violations found. The layout satisfies all simplified lambda rules.
          </p>
        ) : (
          <div style={{ marginTop: "0.75rem" }}>
            {analysis.violations.map((v, i) => (
              <p key={i} style={{ color: "#fca5a5", marginBottom: "8px" }}>
                {v.name} is too small: actual = {v.actual}λ, required = {v.required}λ
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Engineering Insight</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          Layout rule violations can lead to fabrication failures such as shorts, opens,
          weak connectivity, or poor manufacturability. DRC is therefore a critical step
          in physical design.
        </p>
      </div>
    </section>
  );
}