import React, { useEffect } from "react";

function bitColor(v) {
  return v === 1 ? "#22c55e" : "#ef4444";
}

function ToggleButton({ label, value, onClick }) {
  return (
    <div className="stat-card">
      <strong>{label}</strong>
      <button
        type="button"
        className="btn primary"
        onClick={onClick}
        style={{ marginTop: "10px", width: "100%" }}
      >
        {value}
      </button>
    </div>
  );
}

export default function DSDFlipFlopsSimulation({
  selectedType,
  setSelectedType,
  s,
  setS,
  r,
  setR,
  d,
  setD,
  j,
  setJ,
  k,
  setK,
  t,
  setT,
  clk,
  setClk,
  q,
  analysis,
  applyClockedUpdate,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [selectedType, s, r, d, j, k, t, clk, q, setExperimentRun]);

  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        Select the sequential element, set its inputs, and click <strong>Apply Next State</strong>.
      </div>

      <div className="stat-card" style={{ marginBottom: "1rem" }}>
        <strong>Flip-Flop Type</strong>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{
            marginTop: "10px",
            color: "#000",
            padding: "10px 12px",
            borderRadius: "8px",
            width: "100%"
          }}
        >
          <option value="sr">SR Latch</option>
          <option value="d">D Flip-Flop</option>
          <option value="jk">JK Flip-Flop</option>
          <option value="t">T Flip-Flop</option>
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px"
        }}
      >
        {selectedType === "sr" && (
          <>
            <ToggleButton label="S" value={s} onClick={() => setS((prev) => (prev ? 0 : 1))} />
            <ToggleButton label="R" value={r} onClick={() => setR((prev) => (prev ? 0 : 1))} />
          </>
        )}

        {selectedType === "d" && (
          <>
            <ToggleButton label="D" value={d} onClick={() => setD((prev) => (prev ? 0 : 1))} />
            <ToggleButton label="CLK" value={clk} onClick={() => setClk((prev) => (prev ? 0 : 1))} />
          </>
        )}

        {selectedType === "jk" && (
          <>
            <ToggleButton label="J" value={j} onClick={() => setJ((prev) => (prev ? 0 : 1))} />
            <ToggleButton label="K" value={k} onClick={() => setK((prev) => (prev ? 0 : 1))} />
            <ToggleButton label="CLK" value={clk} onClick={() => setClk((prev) => (prev ? 0 : 1))} />
          </>
        )}

        {selectedType === "t" && (
          <>
            <ToggleButton label="T" value={t} onClick={() => setT((prev) => (prev ? 0 : 1))} />
            <ToggleButton label="CLK" value={clk} onClick={() => setClk((prev) => (prev ? 0 : 1))} />
          </>
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button className="btn primary" onClick={applyClockedUpdate}>
          Apply Next State
        </button>
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px"
        }}
      >
        <div className="stat-card">
          <strong>Current Q</strong>
          <div style={{ color: bitColor(q), fontWeight: "bold", fontSize: "1.3rem" }}>{q}</div>
        </div>

        <div className="stat-card">
          <strong>Next Q</strong>
          <div style={{ color: bitColor(analysis.nextQ), fontWeight: "bold", fontSize: "1.3rem" }}>
            {analysis.nextQ}
          </div>
        </div>

        <div className="stat-card">
          <strong>Q̅</strong>
          <div style={{ color: bitColor(analysis.qBar), fontWeight: "bold", fontSize: "1.3rem" }}>
            {analysis.qBar}
          </div>
        </div>

        <div className="stat-card">
          <strong>State</strong>
          <div>{analysis.stateName}</div>
        </div>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        {analysis.note}
      </div>
    </section>
  );
}