import React from "react";

export default function DVLSIMOSFETPhysics({ analysis, vgs, vds, vt, formatNumber }) {
  return (
    <section className="card experiment">
      <h2>Device Physics</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        This section explains what physically happens inside the MOSFET channel for the
        current operating point.
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "1rem"
        }}
      >
        <div className="stat-card">
          <strong>VGS</strong>
          <div>{formatNumber(vgs)} V</div>
        </div>
        <div className="stat-card">
          <strong>VDS</strong>
          <div>{formatNumber(vds)} V</div>
        </div>
        <div className="stat-card">
          <strong>VT</strong>
          <div>{formatNumber(vt)} V</div>
        </div>
        <div className="stat-card">
          <strong>VOV = VGS − VT</strong>
          <div>{formatNumber(Math.max(0, analysis.overdrive))} V</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Physical Interpretation</h3>

        {analysis.region === "Cutoff" && (
          <>
            <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
              Since VGS is below threshold voltage, a strong inversion layer is not created under the gate oxide.
              As a result, there is no continuous channel connecting source and drain.
            </p>
            <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
              Only a very small leakage current may exist in practice, but in this educational model
              the drain current is taken as zero.
            </p>
          </>
        )}

        {analysis.region === "Triode" && (
          <>
            <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
              Because VGS exceeds VT, an inversion channel forms. Since VDS is still small compared
              to the overdrive voltage, the channel exists throughout the device length.
            </p>
            <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
              The MOSFET behaves like a voltage-controlled resistor, and current increases with VDS.
            </p>
          </>
        )}

        {analysis.region === "Saturation" && (
          <>
            <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
              In saturation, the drain-side channel narrows until pinch-off occurs. Beyond this point,
              increasing VDS does not strongly increase the current in the ideal model.
            </p>
            <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
              In practical devices, channel-length modulation causes a slight current increase with VDS,
              which is why the output resistance is finite.
            </p>
          </>
        )}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Engineering Insight</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          Triode operation is commonly used when the MOSFET acts like a switch or resistor.
          Saturation is the region typically used in analog amplification and current-source behavior.
        </p>
      </div>
    </section>
  );
}