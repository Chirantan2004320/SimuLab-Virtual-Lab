import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function DVLSIRingOscillatorGraphs({ stages, tpd, analysis, formatNumber }) {
  const waveformData = [];
  const totalTime = Math.max(20, 6 * stages * tpd);

  for (let t = 0; t <= totalTime; t += totalTime / 40) {
    let node0 = 0;

    if (analysis.oscillates && analysis.period > 0) {
      const normalized = (t % analysis.period) / analysis.period;
      node0 = normalized < 0.5 ? 1 : 0;
    }

    let node1 = analysis.oscillates
      ? (((t + tpd) % analysis.period) / analysis.period < 0.5 ? 0 : 1)
      : 0;

    waveformData.push({
      time: Number(t.toFixed(2)),
      node0,
      node1
    });
  }

  return (
    <section className="card experiment">
      <h2>Graphs</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        This graph gives an educational waveform-style view of two nodes in the ring oscillator loop.
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Waveform View</h3>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={waveformData}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="time" stroke="#cbd5e1" />
              <YAxis domain={[-0.2, 1.2]} stroke="#cbd5e1" />
              <Tooltip />
              <Legend />
              <Line
                type="stepAfter"
                dataKey="node0"
                stroke="#38bdf8"
                strokeWidth={2}
                name="Node 0"
                dot={false}
              />
              <Line
                type="stepAfter"
                dataKey="node1"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Node 1"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Oscillation Summary</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          {analysis.oscillates
            ? `The approximate oscillation period is ${formatNumber(analysis.period)} ns and the approximate frequency is ${formatNumber(analysis.frequency, 4)} GHz.`
            : "No periodic waveform is produced because the oscillator is either disabled or the stage count does not satisfy the oscillation condition."}
        </p>
      </div>
    </section>
  );
}