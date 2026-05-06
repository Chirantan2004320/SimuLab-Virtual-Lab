import React from "react";
import { Activity, Play, Gauge, Layers, Sparkles, Zap } from "lucide-react";

export default function DTSPFFTvsDFTSimulation({
  inputText,
  setInputText,
  originalSequence,
  paddedSequence,
  dftResult,
  fftResult,
  dftOps,
  fftOps,
  fftStages,
  error,
  handleAnalyze,
  formatNumber,
  getMagnitude
}) {
  const efficiencyGain = fftOps > 0 ? (dftOps / fftOps).toFixed(2) : "-";

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
              Compare direct DFT and recursive FFT results, stages, and operation counts.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>Direct DFT</h4>
          </div>
          <p>
            Direct DFT computes each frequency bin using all input samples, so the cost grows
            quickly as sequence length increases.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Zap size={18} />
            <h4>Recursive FFT</h4>
          </div>
          <p>
            FFT divides the sequence into smaller parts and combines them efficiently using
            butterfly-style operations.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles size={16} style={{ marginRight: 10 }} />
        If the input length is not a power of two, the sequence is padded with zeros before FFT analysis.
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
          <button className="sim-btn sim-btn-primary" onClick={handleAnalyze}>
            <Play size={16} />
            Analyze FFT vs DFT
          </button>
        </div>
      </div>

      {error && <div className="queue-warning-box">{error}</div>}

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Padded Length</span>
          <span className="sorting-stat-value">{paddedSequence.length || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">DFT Operations</span>
          <span className="sorting-stat-value">{dftOps || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">FFT Operations</span>
          <span className="sorting-stat-value">{fftOps || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Efficiency Gain</span>
          <span className="sorting-stat-value">{efficiencyGain}x</span>
        </div>
      </div>

      {paddedSequence.length > 0 && (
        <>
          <div className="overview-card" style={{ marginBottom: 18 }}>
            <div className="overview-card-head">
              <Layers size={18} />
              <h4>Input Information</h4>
            </div>

            <div className="sorting-info-box">
              <strong style={{ marginRight: 8 }}>Original Sequence:</strong>
              {originalSequence.map((v, i) => (i === 0 ? v : `, ${v}`))}
            </div>

            <div className="sorting-info-box" style={{ marginBottom: 0 }}>
              <strong style={{ marginRight: 8 }}>Padded Sequence:</strong>
              {paddedSequence.map((v, i) => (i === 0 ? v : `, ${v}`))}
            </div>
          </div>

          <div className="overview-card" style={{ marginBottom: 18 }}>
            <div className="overview-card-head">
              <Gauge size={18} />
              <h4>DFT vs FFT Magnitude Comparison</h4>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="dbms-table">
                <thead>
                  <tr>
                    <th>k</th>
                    <th>|DFT[k]|</th>
                    <th>|FFT[k]|</th>
                  </tr>
                </thead>
                <tbody>
                  {dftResult.map((d, k) => (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{formatNumber(getMagnitude(d))}</td>
                      <td>{formatNumber(getMagnitude(fftResult[k] || { re: 0, im: 0 }))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {fftStages.length > 0 && (
            <div className="overview-card">
              <div className="overview-card-head">
                <Zap size={18} />
                <h4>FFT Stage Breakdown</h4>
              </div>

              {fftStages.map((stage, idx) => (
                <div key={idx} style={{ marginTop: 18 }}>
                  <div className="sorting-info-box">
                    <strong>
                      Stage {idx + 1}
                    </strong>
                    <span style={{ marginLeft: 8 }}>— size {stage.size}</span>
                  </div>

                  <div className="workspace">
                    {stage.values.map((value, i) => (
                      <div
                        key={i}
                        className="cell"
                        style={{ minWidth: 88, textAlign: "center" }}
                      >
                        <div>
                          <div style={{ fontSize: 12, color: "#9ca3af" }}>X[{i}]</div>
                          <div>
                            {formatNumber(value.re, 2)}
                            {value.im >= 0 ? "+" : ""}
                            {formatNumber(value.im, 2)}j
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}