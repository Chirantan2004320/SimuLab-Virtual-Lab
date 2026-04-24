import React from "react";
import { Table2, CheckCircle2, TimerReset } from "lucide-react";

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
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Table2 size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Truth Table</h2>
            <p className="sorting-sim-subtitle">
              Timing behavior is represented through time conditions instead of only static input-output combinations.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-info-box">
        The highlighted row matches the current timing condition of the signal.
      </div>

      <div className="sorting-sim-card" style={{ marginTop: 18, padding: 18 }}>
        <h3 style={{ color: "#f8fafc", marginBottom: 14 }}>Timing Behavior Table</h3>

        <table className="dbms-table" style={{ width: "100%" }}>
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

      <div className="overview-grid" style={{ marginTop: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <TimerReset size={18} />
            <h4>Current Condition</h4>
          </div>
          <p>{stateBadge(timeNs < delayNs ? "t < delay" : "t ≥ delay", true)}</p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <CheckCircle2 size={18} />
            <h4>Observed Output</h4>
          </div>
          <p>
            At <strong>{timeNs} ns</strong>, the output is <strong>{analysis.observedOutput}</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}