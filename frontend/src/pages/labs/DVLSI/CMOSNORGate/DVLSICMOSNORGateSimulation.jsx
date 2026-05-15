import React, { useEffect } from "react";
import {
  Activity,
  Cpu,
  Zap,
  SlidersHorizontal,
  Sparkles,
  GitBranch
} from "lucide-react";

export default function DVLSICMOSNORSimulation({
  A,
  setA,
  B,
  setB,
  analysis,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [A, B, setExperimentRun]);

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Activity size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Simulation</h2>
            <p className="sorting-sim-subtitle">
              Change the input values and observe NOR logic output, transistor switching, and
              current conduction paths.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Cpu size={18} />
            <h4>Logic Condition</h4>
          </div>
          <p>
            <strong>{analysis.logicCase}</strong>
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Conduction Path</h4>
          </div>
          <p>{analysis.currentPath}</p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles size={16} style={{ marginRight: 10 }} />
        {analysis.note}
      </div>

      <div className="overview-card" style={{ marginTop: 18, marginBottom: 18 }}>
        <div className="overview-card-head">
          <SlidersHorizontal size={18} />
          <h4>Input Parameters</h4>
        </div>

        <div
          className="er-config-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px"
          }}
        >
          <div>
            <label className="sorting-label">Input A</label>
            <select
              value={A}
              onChange={(e) => setA(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                color: "#000"
              }}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </div>

          <div>
            <label className="sorting-label">Input B</label>
            <select
              value={B}
              onChange={(e) => setB(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                color: "#000"
              }}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </div>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Input A</span>
          <span className="sorting-stat-value">{A}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Input B</span>
          <span className="sorting-stat-value">{B}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Output Y</span>
          <span className="sorting-stat-value">{analysis.output}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Logic Case</span>
          <span className="sorting-stat-value">{analysis.logicCase}</span>
        </div>
      </div>

      <div className="overview-card" style={{ marginTop: 18 }}>
        <div className="overview-card-head">
          <GitBranch size={18} />
          <h4>Transistor State Summary</h4>
        </div>

        <table className="dbms-table" style={{ width: "100%", marginTop: "0.75rem" }}>
          <tbody>
            <tr>
              <td>pMOS A</td>
              <td>{analysis.pmosA}</td>
            </tr>
            <tr>
              <td>pMOS B</td>
              <td>{analysis.pmosB}</td>
            </tr>
            <tr>
              <td>nMOS A</td>
              <td>{analysis.nmosA}</td>
            </tr>
            <tr>
              <td>nMOS B</td>
              <td>{analysis.nmosB}</td>
            </tr>
            <tr>
              <td>Current Path</td>
              <td>{analysis.currentPath}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}