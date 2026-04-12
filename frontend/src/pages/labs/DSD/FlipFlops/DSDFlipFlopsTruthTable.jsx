import React from "react";

function stateBadgeStyle(state) {
  let background = "rgba(148,163,184,0.18)";
  let border = "1px solid rgba(148,163,184,0.28)";
  let color = "#e5e7eb";

  if (state === "Set" || state === "Load 1") {
    background = "rgba(34,197,94,0.18)";
    border = "1px solid rgba(34,197,94,0.35)";
    color = "#86efac";
  }

  if (state === "Reset" || state === "Load 0") {
    background = "rgba(239,68,68,0.16)";
    border = "1px solid rgba(239,68,68,0.35)";
    color = "#fca5a5";
  }

  if (state === "Hold") {
    background = "rgba(59,130,246,0.16)";
    border = "1px solid rgba(59,130,246,0.35)";
    color = "#93c5fd";
  }

  if (state === "Toggle") {
    background = "rgba(250,204,21,0.16)";
    border = "1px solid rgba(250,204,21,0.35)";
    color = "#fde68a";
  }

  if (state === "Invalid") {
    background = "rgba(168,85,247,0.16)";
    border = "1px solid rgba(168,85,247,0.35)";
    color = "#d8b4fe";
  }

  return {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "0.85rem",
    background,
    border,
    color
  };
}

function renderStateBadge(state) {
  return <span style={stateBadgeStyle(state)}>{state}</span>;
}

function renderOutputCell(value) {
  const isHigh = value === 1 || value === "1";
  const isLow = value === 0 || value === "0";

  return (
    <span
      style={{
        fontWeight: "bold",
        color: isHigh ? "#22c55e" : isLow ? "#ef4444" : "#e5e7eb"
      }}
    >
      {value}
    </span>
  );
}

export default function DSDFlipFlopsTruthTable({
  selectedType,
  s,
  r,
  d,
  j,
  k,
  t,
  clk,
  q,
  analysis
}) {
  const srRows = [
    { S: 0, R: 0, nextQ: "Q", state: "Hold" },
    { S: 0, R: 1, nextQ: 0, state: "Reset" },
    { S: 1, R: 0, nextQ: 1, state: "Set" },
    { S: 1, R: 1, nextQ: "-", state: "Invalid" }
  ];

  const dRows = [
    { CLK: 0, D: 0, nextQ: "Q", state: "Hold" },
    { CLK: 0, D: 1, nextQ: "Q", state: "Hold" },
    { CLK: 1, D: 0, nextQ: 0, state: "Load 0" },
    { CLK: 1, D: 1, nextQ: 1, state: "Load 1" }
  ];

  const jkRows = [
    { CLK: 1, J: 0, K: 0, nextQ: "Q", state: "Hold" },
    { CLK: 1, J: 0, K: 1, nextQ: 0, state: "Reset" },
    { CLK: 1, J: 1, K: 0, nextQ: 1, state: "Set" },
    { CLK: 1, J: 1, K: 1, nextQ: "Q̅", state: "Toggle" }
  ];

  const tRows = [
    { CLK: 1, T: 0, nextQ: "Q", state: "Hold" },
    { CLK: 1, T: 1, nextQ: "Q̅", state: "Toggle" }
  ];

  const renderSR = () => (
    <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
      <thead>
        <tr>
          <th>S</th>
          <th>R</th>
          <th>Next Q</th>
          <th>State</th>
        </tr>
      </thead>
      <tbody>
        {srRows.map((row, index) => {
          const highlight = row.S === s && row.R === r;
          return (
            <tr key={index} className={highlight ? "highlight-row" : ""}>
              <td>{row.S}</td>
              <td>{row.R}</td>
              <td>{renderOutputCell(row.nextQ)}</td>
              <td>{renderStateBadge(row.state)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderD = () => (
    <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
      <thead>
        <tr>
          <th>CLK</th>
          <th>D</th>
          <th>Next Q</th>
          <th>State</th>
        </tr>
      </thead>
      <tbody>
        {dRows.map((row, index) => {
          const highlight = row.CLK === clk && row.D === d;
          return (
            <tr key={index} className={highlight ? "highlight-row" : ""}>
              <td>{row.CLK}</td>
              <td>{row.D}</td>
              <td>{renderOutputCell(row.nextQ)}</td>
              <td>{renderStateBadge(row.state)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderJK = () => (
    <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
      <thead>
        <tr>
          <th>CLK</th>
          <th>J</th>
          <th>K</th>
          <th>Next Q</th>
          <th>State</th>
        </tr>
      </thead>
      <tbody>
        {jkRows.map((row, index) => {
          const highlight = row.CLK === clk && row.J === j && row.K === k;
          return (
            <tr key={index} className={highlight ? "highlight-row" : ""}>
              <td>{row.CLK}</td>
              <td>{row.J}</td>
              <td>{row.K}</td>
              <td>{renderOutputCell(row.nextQ)}</td>
              <td>{renderStateBadge(row.state)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderT = () => (
    <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
      <thead>
        <tr>
          <th>CLK</th>
          <th>T</th>
          <th>Next Q</th>
          <th>State</th>
        </tr>
      </thead>
      <tbody>
        {tRows.map((row, index) => {
          const highlight = row.CLK === clk && row.T === t;
          return (
            <tr key={index} className={highlight ? "highlight-row" : ""}>
              <td>{row.CLK}</td>
              <td>{row.T}</td>
              <td>{renderOutputCell(row.nextQ)}</td>
              <td>{renderStateBadge(row.state)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const tableTitle =
    selectedType === "sr"
      ? "SR Latch Truth Table"
      : selectedType === "d"
      ? "D Flip-Flop Truth Table"
      : selectedType === "jk"
      ? "JK Flip-Flop Truth Table"
      : "T Flip-Flop Truth Table";

  return (
    <section className="card experiment">
      <h2>Truth Table</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        The truth table below shows the behavior of the selected flip-flop or latch. The highlighted row matches the current input combination.
      </div>

      <div className="card">
        <h3>{tableTitle}</h3>

        {selectedType === "sr" && renderSR()}
        {selectedType === "d" && renderD()}
        {selectedType === "jk" && renderJK()}
        {selectedType === "t" && renderT()}
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px"
        }}
      >
        <div className="card">
          <h3>Current State</h3>
          <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
            Present output is <strong>Q = {q}</strong>.
          </p>
        </div>

        <div className="card">
          <h3>Next State</h3>
          <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
            Based on the selected inputs, the next output is <strong>Q = {analysis.nextQ}</strong>.
          </p>
        </div>

        <div className="card">
          <h3>Operation</h3>
          <p style={{ marginTop: "0.75rem" }}>
            {renderStateBadge(analysis.stateName)}
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Current Input Observation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          Current Q = <strong>{q}</strong>, Next Q = <strong>{analysis.nextQ}</strong>, State = <strong>{analysis.stateName}</strong>.
        </p>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          This matches the highlighted rule in the truth table for the present input combination.
        </p>
      </div>
    </section>
  );
}