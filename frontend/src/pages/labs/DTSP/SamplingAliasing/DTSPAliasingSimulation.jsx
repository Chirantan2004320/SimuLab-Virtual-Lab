import React from "react";
import { Activity, Play, Gauge, Waves, Sparkles, AlertTriangle } from "lucide-react";

export default function DTSPAliasingSimulation({
  signalFreq,
  setSignalFreq,
  samplingFreq,
  setSamplingFreq,
  generateSignal,
  aliasFreq,
  isAliasing,
  nyquistRate,
  experimentRun
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
              Adjust frequencies and observe Nyquist condition, aliasing status, and apparent frequency.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>Nyquist Condition</h4>
          </div>
          <p>
            Sampling Frequency should be at least <strong>2 × Signal Frequency</strong>.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <Waves size={18} />
            <h4>Current Status</h4>
          </div>
          <p>
            {experimentRun
              ? isAliasing
                ? "Aliasing is occurring for the selected values."
                : "Sampling is safe for the selected values."
              : "Generate the signal to check aliasing."}
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles size={16} style={{ marginRight: 10 }} />
        Increase sampling frequency above the Nyquist rate to correctly capture the original waveform.
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">
            Signal Frequency: <strong>{signalFreq} Hz</strong>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={signalFreq}
            onChange={(e) => setSignalFreq(Number(e.target.value))}
            className="sorting-range"
          />
        </div>

        <div className="sorting-input-group">
          <label className="sorting-label">
            Sampling Frequency: <strong>{samplingFreq} Hz</strong>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={samplingFreq}
            onChange={(e) => setSamplingFreq(Number(e.target.value))}
            className="sorting-range"
          />
        </div>

        <div className="sorting-btn-group">
          <button className="sim-btn sim-btn-primary" onClick={generateSignal}>
            <Play size={16} />
            Generate Signal
          </button>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Signal Frequency</span>
          <span className="sorting-stat-value">{signalFreq} Hz</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Sampling Frequency</span>
          <span className="sorting-stat-value">{samplingFreq} Hz</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Nyquist Rate</span>
          <span className="sorting-stat-value">{nyquistRate} Hz</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Observed Alias</span>
          <span className="sorting-stat-value">
            {aliasFreq !== null ? `${aliasFreq} Hz` : "-"}
          </span>
        </div>
      </div>

      {aliasFreq !== null && (
        <div
          className="sorting-info-box"
          style={{
            borderLeft: isAliasing ? "4px solid #ef4444" : "4px solid #22c55e"
          }}
        >
          <AlertTriangle size={16} style={{ marginRight: 10 }} />
          {isAliasing
            ? `Aliasing occurs because sampling frequency (${samplingFreq} Hz) is less than the Nyquist rate (${nyquistRate} Hz). The signal may appear as approximately ${aliasFreq} Hz.`
            : `No aliasing occurs because sampling frequency (${samplingFreq} Hz) satisfies the Nyquist condition for the ${signalFreq} Hz signal.`}
        </div>
      )}

      <div className="overview-card">
        <div className="overview-card-head">
          <BookOpenFallback />
          <h4>Observation</h4>
        </div>
        <p>
          When the sampling frequency is high enough, sampled points follow the original signal.
          When the sampling frequency is too low, the sampled points can misleadingly form a
          different lower-frequency waveform.
        </p>
      </div>
    </section>
  );
}

function BookOpenFallback() {
  return <Waves size={18} />;
}