import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function DTSPFilterDesignGraphs({
  impulse,
  frequency,
  inputSignal,
  outputSignal
}) {
  if (!impulse.length) {
    return (
      <section className="card experiment">
        <h2>Graphs</h2>
        <div className="info-box">Run simulation first to view graphs.</div>
      </section>
    );
  }

  const impulseData = impulse.map((v, i) => ({ n: i, value: v }));

  return (
    <section className="card experiment">
      <h2>Graphs</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        These graphs show the designed FIR filter coefficients, its frequency response,
        and the effect of filtering a mixed input signal.
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Impulse Response</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={impulseData}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="n" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              name="h[n]"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Frequency Response (Normalized)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={frequency}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="w" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line
              dataKey="mag"
              stroke="#38bdf8"
              strokeWidth={2}
              name="|H(ω)|"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Signal Before Filtering</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={inputSignal}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="n" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line
              dataKey="value"
              stroke="#facc15"
              strokeWidth={2}
              name="Input Signal"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Signal After Filtering</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={outputSignal}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="n" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line
              dataKey="value"
              stroke="#ef4444"
              strokeWidth={2}
              name="Filtered Output"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}