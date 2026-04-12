import React from "react";

function stateBadge(text, active) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "999px",
        fontWeight: "700",
        fontSize: "0.85rem",
        background: active ? "rgba(34,197,94,0.18)" : "rgba(59,130,246,0.16)",
        border: active
          ? "1px solid rgba(34,197,94,0.35)"
          : "1px solid rgba(59,130,246,0.35)",
        color: active ? "#86efac" : "#93c5fd"
      }}
    >
      {text}
    </span>
  );
}

export default function DSDPropagationDelayTruthTable({
  selectedGate,
  inputBit,
  delayNs,
  timeNs,
  analysis
}) {
  const rows = [
    {
      timeCondition: "t < delay",
      outputState: "Old Output",
      meaning: "Output has not yet changed"
    },
    {
      timeCondition: "t ≥ delay",
      outputState: "New Output",
      meaning: "Output now reflects new input"
    }
  ];

  return (
    <section className="card experiment">
      <h2>Truth Table</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        Propagation delay is described using timing conditions rather than only input-output logic combinations.
      </div>

      <div className="card">
        <h3>Timing Behavior Table</h3>
        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <thead>
            <tr>
              <th>Gate</th>
              <th>Input</th>
              <th>Condition</th>
              <th>Observed Output</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const active =
                (index === 0 && timeNs < delayNs) ||
                (index === 1 && timeNs >= delayNs);

              return (
                <tr key={index} className={active ? "highlight-row" : ""}>
                  <td>{selectedGate}</td>
                  <td>{inputBit}</td>
                  <td>{row.timeCondition}</td>
                  <td>{row.outputState}</td>
                  <td>{row.meaning}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
          <h3>Current Condition</h3>
          <p style={{ marginTop: "0.75rem" }}>
            {stateBadge(timeNs < delayNs ? "t < delay" : "t ≥ delay", true)}
          </p>
        </div>

        <div className="card">
          <h3>Observed Output</h3>
          <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
            At <strong>{timeNs} ns</strong>, output is <strong>{analysis.observedOutput}</strong>.
          </p>
        </div>

        <div className="card">
          <h3>Delay Value</h3>
          <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
            Configured propagation delay = <strong>{delayNs} ns</strong>.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Current Observation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          The input changed at 0 ns, but the output becomes valid only after {delayNs} ns.
        </p>
      </div>
    </section>
  );
}