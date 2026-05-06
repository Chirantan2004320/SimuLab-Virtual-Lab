import React from "react";
import { Atom, Activity, Cpu } from "lucide-react";

export default function DVLSIMOSFETPhysics({ analysis, vgs, vds, vt, formatNumber }) {
  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <Atom size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Device Physics</h2>
          <p className="sorting-sim-subtitle">
            Understand what physically happens inside the MOSFET channel.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Activity size={16} style={{ marginRight: 10 }} />
        This section explains the physical behavior for the current operating point.
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">VGS</span>
          <span className="sorting-stat-value">{formatNumber(vgs)} V</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">VDS</span>
          <span className="sorting-stat-value">{formatNumber(vds)} V</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">VT</span>
          <span className="sorting-stat-value">{formatNumber(vt)} V</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">VOV = VGS − VT</span>
          <span className="sorting-stat-value">{formatNumber(Math.max(0, analysis.overdrive))} V</span>
        </div>
      </div>

      <div className="overview-card" style={{ marginBottom: 18 }}>
        <div className="overview-card-head">
          <Atom size={18} />
          <h4>Physical Interpretation</h4>
        </div>

        {analysis.region === "Cutoff" && (
          <>
            <p>
              Since VGS is below threshold voltage, a strong inversion layer is not created
              under the gate oxide. Therefore, there is no continuous channel connecting
              source and drain.
            </p>
            <p>
              In real devices, a very small leakage current may exist, but in this educational
              model the drain current is considered zero.
            </p>
          </>
        )}

        {analysis.region === "Triode" && (
          <>
            <p>
              Because VGS exceeds VT, an inversion channel forms. Since VDS is still small
              compared to the overdrive voltage, the channel exists throughout the device length.
            </p>
            <p>
              The MOSFET behaves like a voltage-controlled resistor, and current increases
              with VDS.
            </p>
          </>
        )}

        {analysis.region === "Saturation" && (
          <>
            <p>
              In saturation, the drain-side channel narrows until pinch-off occurs. Beyond this
              point, increasing VDS does not strongly increase current in the ideal model.
            </p>
            <p>
              In practical devices, channel-length modulation causes a slight current increase
              with VDS, which is why output resistance becomes finite.
            </p>
          </>
        )}
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <Cpu size={18} />
          <h4>Engineering Insight</h4>
        </div>

        <p>
          Triode operation is commonly used when the MOSFET acts like a switch or resistor.
          Saturation is typically used in analog amplification and current-source behavior.
        </p>
      </div>
    </section>
  );
}