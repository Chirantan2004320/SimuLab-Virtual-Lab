import React from "react";
import { Activity, Play, RotateCcw, Gauge, Layers, Sparkles } from "lucide-react";

export default function DTSPDFTIDFTSimulation({
  inputText,
  setInputText,
  sequence,
  dftResult,
  reconstructed,
  error,
  selectedK,
  setSelectedK,
  selectedBinSteps,
  selectedBinResult,
  handleComputeDFT,
  handleComputeIDFT,
  formatNumber,
  getMagnitude,
  getPhase
}) {
  const reconstructionError =
    sequence.length > 0 && reconstructed.length > 0
      ? sequence.map((val, i) => Math.abs(val - (reconstructed[i] || 0)))
      : [];

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
              Compute DFT coefficients, inspect frequency bins, and reconstruct the signal using IDFT.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>DFT Output</h4>
          </div>
          <p>
            A sequence of length <strong>N</strong> produces <strong>N</strong> complex DFT coefficients.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Layers size={18} />
            <h4>IDFT Reconstruction</h4>
          </div>
          <p>
            IDFT uses all frequency-domain coefficients to rebuild the original time-domain sequence.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles size={16} style={{ marginRight: 10 }} />
        Try sequences like 1, 2, 3, 4 or 1, 0, 1, 0 to compare how magnitude and phase change.
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Input Sequence</label>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 1, 2, 3, 4"
            className="sorting-input"
          />
        </div>

        <div className="sorting-btn-group">
          <button className="sim-btn sim-btn-primary" onClick={handleComputeDFT}>
            <Play size={16} />
            Compute DFT
          </button>

          <button
            className="sim-btn sim-btn-muted"
            onClick={handleComputeIDFT}
            disabled={!dftResult.length}
          >
            <RotateCcw size={16} />
            Compute IDFT
          </button>
        </div>
      </div>

      {error && (
        <div className="queue-warning-box">
          {error}
        </div>
      )}

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Sequence Length</span>
          <span className="sorting-stat-value">{sequence.length || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">DFT Coefficients</span>
          <span className="sorting-stat-value">{dftResult.length || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Selected Bin</span>
          <span className="sorting-stat-value">{dftResult.length ? `k=${selectedK}` : "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">IDFT Status</span>
          <span className="sorting-stat-value">{reconstructed.length ? "Done" : "Pending"}</span>
        </div>
      </div>

      {sequence.length > 0 && (
        <div className="overview-card" style={{ marginBottom: 18 }}>
          <div className="overview-card-head">
            <Layers size={18} />
            <h4>Input Sequence x[n]</h4>
          </div>

          <div className="workspace" style={{ marginBottom: 0 }}>
            {sequence.map((value, index) => (
              <div key={index} className="cell" style={{ minWidth: 64 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>n={index}</div>
                  <div>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dftResult.length > 0 && (
        <div className="overview-card" style={{ marginBottom: 18 }}>
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>DFT Coefficients X[k]</h4>
          </div>

          <div style={{ marginBottom: 16, maxWidth: 260 }}>
            <label className="sorting-label">Select Frequency Bin</label>
            <select
              value={selectedK}
              onChange={(e) => setSelectedK(Number(e.target.value))}
              className="sorting-select"
            >
              {dftResult.map((_, k) => (
                <option key={k} value={k}>
                  k = {k}
                </option>
              ))}
            </select>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="dbms-table">
              <thead>
                <tr>
                  <th>k</th>
                  <th>Real</th>
                  <th>Imag</th>
                  <th>|X[k]|</th>
                  <th>Phase</th>
                </tr>
              </thead>
              <tbody>
                {dftResult.map((Xk, k) => (
                  <tr key={k} className={k === selectedK ? "highlight-row" : ""}>
                    <td>{k}</td>
                    <td>{formatNumber(Xk.re)}</td>
                    <td>{formatNumber(Xk.im)}</td>
                    <td>{formatNumber(getMagnitude(Xk))}</td>
                    <td>{formatNumber(getPhase(Xk))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedBinResult && (
        <div className="overview-card" style={{ marginBottom: 18 }}>
          <div className="overview-card-head">
            <Activity size={18} />
            <h4>Step-by-Step Computation for X[{selectedK}]</h4>
          </div>

          <div className="sorting-info-box">
            <Layers size={16} style={{ marginRight: 10 }} />
            Each input sample contributes real and imaginary parts to the selected DFT coefficient.
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="dbms-table">
              <thead>
                <tr>
                  <th>n</th>
                  <th>x[n]</th>
                  <th>Angle</th>
                  <th>cos()</th>
                  <th>sin()</th>
                  <th>Real Contribution</th>
                  <th>Imag Contribution</th>
                  <th>Partial Real</th>
                  <th>Partial Imag</th>
                </tr>
              </thead>
              <tbody>
                {selectedBinSteps.map((step) => (
                  <tr key={step.n}>
                    <td>{step.n}</td>
                    <td>{formatNumber(step.x)}</td>
                    <td>{formatNumber(step.angle)}</td>
                    <td>{formatNumber(step.cosTerm)}</td>
                    <td>{formatNumber(step.sinTerm)}</td>
                    <td>{formatNumber(step.reContribution)}</td>
                    <td>{formatNumber(step.imContribution)}</td>
                    <td>{formatNumber(step.partialRe)}</td>
                    <td>{formatNumber(step.partialIm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sorting-stats-grid" style={{ marginTop: 18, marginBottom: 0 }}>
            <div className="sorting-stat-box">
              <span className="sorting-stat-label">Selected Bin</span>
              <span className="sorting-stat-value">k = {selectedK}</span>
            </div>

            <div className="sorting-stat-box">
              <span className="sorting-stat-label">Real Part</span>
              <span className="sorting-stat-value">{formatNumber(selectedBinResult.re)}</span>
            </div>

            <div className="sorting-stat-box">
              <span className="sorting-stat-label">Imaginary Part</span>
              <span className="sorting-stat-value">{formatNumber(selectedBinResult.im)}</span>
            </div>

            <div className="sorting-stat-box">
              <span className="sorting-stat-label">Magnitude</span>
              <span className="sorting-stat-value">{formatNumber(getMagnitude(selectedBinResult))}</span>
            </div>
          </div>
        </div>
      )}

      {reconstructed.length > 0 && (
        <div className="overview-card">
          <div className="overview-card-head">
            <RotateCcw size={18} />
            <h4>Reconstructed Sequence using IDFT</h4>
          </div>

          <div className="workspace" style={{ marginBottom: 18 }}>
            {reconstructed.map((value, index) => (
              <div key={index} className="cell" style={{ minWidth: 64 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>n={index}</div>
                  <div>{formatNumber(value, 4)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sorting-info-box" style={{ marginBottom: 0 }}>
            Reconstruction Error:{" "}
            {reconstructionError.map((value) => value.toFixed(4)).join(", ")}
          </div>
        </div>
      )}
    </section>
  );
}