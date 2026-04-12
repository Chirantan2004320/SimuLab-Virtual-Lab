import React, { useEffect } from "react";

function LED({ active, label }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px"
      }}
    >
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: active ? "#22c55e" : "#1f2937",
          boxShadow: active
            ? "0 0 12px #22c55e, 0 0 24px #22c55e"
            : "inset 0 0 6px #000",
          border: "2px solid #374151",
          transition: "all 0.3s ease"
        }}
      />
      <span style={{ fontSize: "0.82rem", color: "#9ca3af" }}>{label}</span>
    </div>
  );
}

export default function DSDDecoderEncoderSimulation({
  mode,
  setMode,
  a,
  setA,
  b,
  setB,
  inputs,
  setInputs,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [mode, a, b, inputs, setExperimentRun]);

  const setSingleActiveInput = (index) => {
    const arr = [0, 0, 0, 0];
    arr[index] = 1;
    setInputs(arr);
  };

  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        Switch between Decoder and Encoder mode and observe how the active input/output changes.
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3>Mode Selection</h3>
        <div style={{ marginTop: "0.75rem" }}>
          <label style={{ fontWeight: "600", marginRight: "10px" }}>Mode:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              color: "#000"
            }}
          >
            <option value="decoder">Decoder</option>
            <option value="encoder">Encoder</option>
          </select>
        </div>
      </div>

      {mode === "decoder" && (
        <>
          <div className="card" style={{ marginBottom: "1rem" }}>
            <h3>Decoder Inputs</h3>
            <div style={{ display: "flex", gap: "12px", marginTop: "0.75rem", flexWrap: "wrap" }}>
              <button className="btn primary" onClick={() => setA(a ^ 1)}>
                A = {a}
              </button>
              <button className="btn primary" onClick={() => setB(b ^ 1)}>
                B = {b}
              </button>
            </div>
          </div>

          <div className="info-box">
            Input Code <strong>{analysis.binary}</strong> activates <strong>Y{analysis.index}</strong>.
          </div>

          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Decoder Outputs</h3>
            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                justifyItems: "center"
              }}
            >
              {analysis.outputs.map((v, i) => (
                <LED key={i} active={v === 1} label={`Y${i}`} />
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Observation</h3>
            <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>{analysis.note}</p>
          </div>
        </>
      )}

      {mode === "encoder" && (
        <>
          <div className="card" style={{ marginBottom: "1rem" }}>
            <h3>Encoder Inputs</h3>
            <p style={{ marginTop: "0.5rem", color: "#9ca3af" }}>
              Activate one input line. A standard encoder expects one active input at a time.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
                marginTop: "1rem"
              }}
            >
              {inputs.map((v, i) => (
                <button
                  key={i}
                  className="btn primary"
                  style={{
                    background: v ? "#22c55e" : undefined,
                    color: v ? "#052e16" : undefined,
                    fontWeight: "700"
                  }}
                  onClick={() => setSingleActiveInput(i)}
                >
                  I{i} = {v}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Binary Output</h3>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "18px",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div className="stat-card" style={{ minWidth: "100px", textAlign: "center" }}>
                <strong>Y1</strong>
                <div style={{ marginTop: "10px", fontSize: "1.3rem", fontWeight: "bold" }}>
                  {analysis.binary[0]}
                </div>
              </div>

              <div className="stat-card" style={{ minWidth: "100px", textAlign: "center" }}>
                <strong>Y0</strong>
                <div style={{ marginTop: "10px", fontSize: "1.3rem", fontWeight: "bold" }}>
                  {analysis.binary[1]}
                </div>
              </div>
            </div>

            <p style={{ marginTop: "1rem", color: "#d1d5db" }}>
              {analysis.index === -1
                ? "No valid active input detected."
                : `Active input I${analysis.index} is encoded as ${analysis.binary}.`}
            </p>
          </div>
        </>
      )}
    </section>
  );
}