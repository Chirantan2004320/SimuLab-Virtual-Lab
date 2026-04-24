import React from "react";
import { Table2, CheckCircle2 } from "lucide-react";

function renderBitCell(value, active = false) {
  return (
    <span
      style={{
        fontWeight: "bold",
        color: value === "1" || value === 1 ? "#22c55e" : "#ef4444",
        background: active ? "rgba(56,189,248,0.12)" : "transparent",
        padding: "2px 8px",
        borderRadius: "999px"
      }}
    >
      {value}
    </span>
  );
}

export default function DSDDecoderEncoderTruthTable({
  mode,
  a,
  b,
  inputs,
  analysis
}) {
  const decoderRows = [
    { A: 0, B: 0, Y0: 1, Y1: 0, Y2: 0, Y3: 0 },
    { A: 0, B: 1, Y0: 0, Y1: 1, Y2: 0, Y3: 0 },
    { A: 1, B: 0, Y0: 0, Y1: 0, Y2: 1, Y3: 0 },
    { A: 1, B: 1, Y0: 0, Y1: 0, Y2: 0, Y3: 1 }
  ];

  const encoderRows = [
    { input: "I0", Y1: 0, Y0: 0 },
    { input: "I1", Y1: 0, Y0: 1 },
    { input: "I2", Y1: 1, Y0: 0 },
    { input: "I3", Y1: 1, Y0: 1 }
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
              Verify the active output line for decoder mode or the binary output code for encoder mode.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-info-box">
        The highlighted row corresponds to the currently active input combination.
      </div>

      {mode === "decoder" && (
        <>
          <div className="sorting-sim-card" style={{ marginTop: 18, padding: 18 }}>
            <h3 style={{ color: "#f8fafc", marginBottom: 14 }}>2-to-4 Decoder Truth Table</h3>
            <table className="dbms-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>A</th>
                  <th>B</th>
                  <th>Y0</th>
                  <th>Y1</th>
                  <th>Y2</th>
                  <th>Y3</th>
                </tr>
              </thead>
              <tbody>
                {decoderRows.map((row, i) => {
                  const highlight = row.A === a && row.B === b;
                  return (
                    <tr key={i} className={highlight ? "highlight-row" : ""}>
                      <td>{row.A}</td>
                      <td>{row.B}</td>
                      <td>{renderBitCell(row.Y0, highlight && analysis.index === 0)}</td>
                      <td>{renderBitCell(row.Y1, highlight && analysis.index === 1)}</td>
                      <td>{renderBitCell(row.Y2, highlight && analysis.index === 2)}</td>
                      <td>{renderBitCell(row.Y3, highlight && analysis.index === 3)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="overview-grid" style={{ marginTop: 18 }}>
            <div className="overview-card">
              <div className="overview-card-head">
                <CheckCircle2 size={18} />
                <h4>Current Observation</h4>
              </div>
              <p>
                Input combination <strong>{a}{b}</strong> activates only <strong>Y{analysis.index}</strong>.
              </p>
            </div>
          </div>
        </>
      )}

      {mode === "encoder" && (
        <>
          <div className="sorting-sim-card" style={{ marginTop: 18, padding: 18 }}>
            <h3 style={{ color: "#f8fafc", marginBottom: 14 }}>4-to-2 Encoder Truth Table</h3>
            <table className="dbms-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Active Input</th>
                  <th>Y1</th>
                  <th>Y0</th>
                  <th>Binary Code</th>
                </tr>
              </thead>
              <tbody>
                {encoderRows.map((row, i) => {
                  const highlight = inputs[i] === 1;
                  return (
                    <tr key={i} className={highlight ? "highlight-row" : ""}>
                      <td>{row.input}</td>
                      <td>{renderBitCell(row.Y1, highlight)}</td>
                      <td>{renderBitCell(row.Y0, highlight)}</td>
                      <td>
                        <strong>{`${row.Y1}${row.Y0}`}</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="overview-grid" style={{ marginTop: 18 }}>
            <div className="overview-card">
              <div className="overview-card-head">
                <CheckCircle2 size={18} />
                <h4>Current Observation</h4>
              </div>
              <p>
                The active input is <strong>{analysis.index === -1 ? "none" : `I${analysis.index}`}</strong>.
              </p>
              <p style={{ marginTop: 10 }}>
                The corresponding binary output is <strong>{analysis.binary}</strong>.
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}