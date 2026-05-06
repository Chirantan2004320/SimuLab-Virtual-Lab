import React from "react";
import { Activity, Play, Layers, Gauge, Sparkles } from "lucide-react";

function formatSequence(seq, formatNumber) {
  return seq.map((v, i) => (i === 0 ? formatNumber(v) : `, ${formatNumber(v)}`));
}

function ContributionTable({ title, steps, formatNumber, explanation }) {
  if (!steps.length) return null;

  return (
    <div className="overview-card" style={{ marginBottom: 18 }}>
      <div className="overview-card-head">
        <Gauge size={18} />
        <h4>{title}</h4>
      </div>

      {explanation && (
        <div className="sorting-info-box">
          {explanation}
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table className="dbms-table">
          <thead>
            <tr>
              <th>k</th>
              <th>x index</th>
              <th>x[k]</th>
              <th>h index</th>
              <th>h value</th>
              <th>Product</th>
              <th>Running Sum</th>
              <th>Wrap?</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((step, index) => (
              <tr key={index} className={step.wrapped ? "highlight-row" : ""}>
                <td>{step.k}</td>
                <td>{step.xIndex}</td>
                <td>{formatNumber(step.xValue)}</td>
                <td>{step.hIndex}</td>
                <td>{formatNumber(step.hValue)}</td>
                <td>{formatNumber(step.product)}</td>
                <td>{formatNumber(step.runningSum)}</td>
                <td>{step.wrapped ? "Yes" : "No"}</td>
                <td>{step.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DTSPLinearCircularConvolutionSimulation({
  xText,
  setXText,
  hText,
  setHText,
  x,
  h,
  yLinear,
  yCircularNoPad,
  yCircularPadded,
  error,
  handleCompute,
  formatNumber,
  selectedLinearIndex,
  setSelectedLinearIndex,
  selectedCircularIndex,
  setSelectedCircularIndex,
  selectedPaddedIndex,
  setSelectedPaddedIndex,
  linearSteps,
  circularNoPadAnalysis,
  circularPaddedAnalysis
}) {
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
              Compute linear, circular, and zero-padded circular convolution outputs.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Layers size={18} />
            <h4>Linear Output Length</h4>
          </div>
          <p>
            Linear convolution length is <strong>N + M - 1</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>Wrap-Around</h4>
          </div>
          <p>
            Circular convolution without padding may wrap tail values back to the beginning.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles size={16} style={{ marginRight: 10 }} />
        Use the detailed output builder to inspect how each output sample is formed.
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">x[n] Input Sequence</label>
          <input
            value={xText}
            onChange={(e) => setXText(e.target.value)}
            placeholder="e.g. 1, 2, 1"
            className="sorting-input"
          />
        </div>

        <div className="sorting-input-group">
          <label className="sorting-label">h[n] Impulse Response</label>
          <input
            value={hText}
            onChange={(e) => setHText(e.target.value)}
            placeholder="e.g. 1, -1, 1"
            className="sorting-input"
          />
        </div>

        <div className="sorting-btn-group">
          <button className="sim-btn sim-btn-primary" onClick={handleCompute}>
            <Play size={16} />
            Compute Convolutions
          </button>
        </div>
      </div>

      {error && <div className="queue-warning-box">{error}</div>}

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Length of x[n]</span>
          <span className="sorting-stat-value">{x.length || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Length of h[n]</span>
          <span className="sorting-stat-value">{h.length || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Linear Length</span>
          <span className="sorting-stat-value">{yLinear.length || "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Circular Length</span>
          <span className="sorting-stat-value">{yCircularNoPad.length || "-"}</span>
        </div>
      </div>

      {x.length > 0 && h.length > 0 && (
        <>
          <div className="overview-card" style={{ marginBottom: 18 }}>
            <div className="overview-card-head">
              <Layers size={18} />
              <h4>Input Sequences</h4>
            </div>

            <div className="sorting-info-box">
              <strong style={{ marginRight: 8 }}>x[n]:</strong>
              {formatSequence(x, formatNumber)}
            </div>

            <div className="sorting-info-box" style={{ marginBottom: 18 }}>
              <strong style={{ marginRight: 8 }}>h[n]:</strong>
              {formatSequence(h, formatNumber)}
            </div>

            <div className="workspace">
              {x.map((value, index) => (
                <div key={`x-${index}`} className="cell" style={{ minWidth: 64 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>x[{index}]</div>
                    <div>{formatNumber(value)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="workspace" style={{ marginBottom: 0 }}>
              {h.map((value, index) => (
                <div key={`h-${index}`} className="cell" style={{ minWidth: 64 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>h[{index}]</div>
                    <div>{formatNumber(value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overview-grid" style={{ marginBottom: 18 }}>
            <div className="overview-card">
              <div className="overview-card-head">
                <Gauge size={18} />
                <h4>Linear Convolution</h4>
              </div>
              <p>{formatSequence(yLinear, formatNumber)}</p>
            </div>

            <div className="overview-card">
              <div className="overview-card-head">
                <Gauge size={18} />
                <h4>Circular Without Padding</h4>
              </div>
              <p>{formatSequence(yCircularNoPad, formatNumber)}</p>
            </div>

            <div className="overview-card">
              <div className="overview-card-head">
                <Gauge size={18} />
                <h4>Circular With Zero Padding</h4>
              </div>
              <p>{formatSequence(yCircularPadded, formatNumber)}</p>
            </div>

            <div className="overview-card">
              <div className="overview-card-head">
                <Layers size={18} />
                <h4>Important Result</h4>
              </div>
              <p>
                Zero-padded circular convolution matches linear convolution when L = N + M - 1.
              </p>
            </div>
          </div>

          <div className="overview-card" style={{ marginBottom: 18 }}>
            <div className="overview-card-head">
              <Activity size={18} />
              <h4>Advanced Output Sample Builder</h4>
            </div>

            <div className="er-config-grid">
              <div>
                <label className="sorting-label">Linear output index n</label>
                <select
                  value={selectedLinearIndex}
                  onChange={(e) => setSelectedLinearIndex(Number(e.target.value))}
                  className="sorting-select"
                >
                  {yLinear.map((_, n) => (
                    <option key={n} value={n}>
                      y_lin[{n}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="sorting-label">Circular output index n</label>
                <select
                  value={selectedCircularIndex}
                  onChange={(e) => setSelectedCircularIndex(Number(e.target.value))}
                  className="sorting-select"
                >
                  {yCircularNoPad.map((_, n) => (
                    <option key={n} value={n}>
                      y_circ[{n}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="sorting-label">Padded circular output index n</label>
                <select
                  value={selectedPaddedIndex}
                  onChange={(e) => setSelectedPaddedIndex(Number(e.target.value))}
                  className="sorting-select"
                >
                  {yCircularPadded.map((_, n) => (
                    <option key={n} value={n}>
                      y_pad[{n}]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sorting-stats-grid" style={{ marginTop: 18, marginBottom: 0 }}>
              <div className="sorting-stat-box">
                <span className="sorting-stat-label">Linear Output</span>
                <span className="sorting-stat-value">
                  {formatNumber(yLinear[selectedLinearIndex])}
                </span>
              </div>

              <div className="sorting-stat-box">
                <span className="sorting-stat-label">Circular Output</span>
                <span className="sorting-stat-value">
                  {formatNumber(yCircularNoPad[selectedCircularIndex])}
                </span>
              </div>

              <div className="sorting-stat-box">
                <span className="sorting-stat-label">Padded Circular</span>
                <span className="sorting-stat-value">
                  {formatNumber(yCircularPadded[selectedPaddedIndex])}
                </span>
              </div>

              <div className="sorting-stat-box">
                <span className="sorting-stat-label">Useful Length</span>
                <span className="sorting-stat-value">{yLinear.length}</span>
              </div>
            </div>
          </div>

          <ContributionTable
            title={`Detailed Linear Convolution for y_lin[${selectedLinearIndex}]`}
            steps={linearSteps}
            formatNumber={formatNumber}
          />

          <ContributionTable
            title={`Detailed Circular Convolution without Padding for y_circ[${selectedCircularIndex}]`}
            steps={circularNoPadAnalysis.steps}
            formatNumber={formatNumber}
            explanation={circularNoPadAnalysis.explanation}
          />

          <ContributionTable
            title={`Detailed Circular Convolution with Zero Padding for y_pad[${selectedPaddedIndex}]`}
            steps={circularPaddedAnalysis.steps}
            formatNumber={formatNumber}
            explanation={circularPaddedAnalysis.explanation}
          />

          <div className="overview-card">
            <div className="overview-card-head">
              <Sparkles size={18} />
              <h4>Summary Comparison</h4>
            </div>
            <p>
              Circular convolution without zero padding assumes periodic repetition, causing tail
              samples to wrap and overlap earlier samples. With zero padding to N + M - 1, this
              overlap is avoided and the result becomes equal to linear convolution.
            </p>
          </div>
        </>
      )}
    </section>
  );
}