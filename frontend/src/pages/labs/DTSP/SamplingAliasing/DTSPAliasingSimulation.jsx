import React from "react";

export default function DTSPAliasingSimulation({
  signalFreq,
  setSignalFreq,
  samplingFreq,
  setSamplingFreq,
  generateSignal,
  aliasFreq,
  isAliasing,
  nyquistRate
}) {
    
    const nyquist = nyquistRate;

  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "18px",
          marginTop: "1rem"
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Signal Frequency (Hz): <strong>{signalFreq}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={signalFreq}
            onChange={(e) => setSignalFreq(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Sampling Frequency (Hz): <strong>{samplingFreq}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={samplingFreq}
            onChange={(e) => setSamplingFreq(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div className="buttons" style={{ marginTop: "1rem" }}>
        <button className="btn primary" onClick={generateSignal}>
          Generate Signal
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
          <strong>Signal Frequency</strong>
          <div>{signalFreq} Hz</div>
        </div>

        <div className="stat-card">
          <strong>Sampling Frequency</strong>
          <div>{samplingFreq} Hz</div>
        </div>

        <div className="stat-card">
          <strong>Nyquist Rate</strong>
          <div>{nyquist} Hz</div>
        </div>

        <div className="stat-card">
          <strong>Status</strong>
          <div>{isAliasing ? "Aliasing" : "Safe Sampling"}</div>
        </div>
      </div>

      {aliasFreq !== null && (
        <>
          <div
            className="info-box"
            style={{
              marginTop: "1rem",
              borderLeft: isAliasing ? "4px solid #ef4444" : "4px solid #22c55e"
            }}
          >
            {isAliasing
              ? `⚠️ Aliasing occurs because sampling frequency (${samplingFreq} Hz) is less than the Nyquist rate (${nyquist} Hz). The signal may appear as a lower frequency of about ${aliasFreq} Hz.`
              : `✅ No aliasing occurs because sampling frequency (${samplingFreq} Hz) satisfies the Nyquist condition for the ${signalFreq} Hz signal.`}
          </div>

          <div className="card" style={{ marginTop: "1rem" }}>
            <h3>Observation</h3>
            <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
              When the sampling frequency is high enough, the sampled points follow the original
              signal correctly. When the sampling frequency becomes too low, the sampled points can
              misleadingly suggest a different lower-frequency waveform. This effect is called aliasing.
            </p>
          </div>
        </>
      )}
    </section>
  );
}