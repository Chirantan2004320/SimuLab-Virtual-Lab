import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter
} from "recharts";

export default function DVLSICMOSInverterSimulationGraphs({
  vin,
  analysis,
  transferData,
  transientData,
  vdd
}) {
  const operatingPoint = [{ vin, vout: analysis.vout }];

  if (!transferData.length) {
    return (
      <section className="card experiment">
        <h2>Graphs</h2>
        <div className="info-box">Adjust simulation parameters to view graphs.</div>
      </section>
    );
  }

  return (
    <section className="card experiment">
      <h2>Graphs</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        These graphs show the voltage transfer characteristic and a simple transient
        response of the CMOS inverter. The current operating point is highlighted on the transfer curve.
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Voltage Transfer Characteristic (VTC)</h3>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid stroke="#334155" />
              <XAxis
                type="number"
                dataKey="vin"
                name="Vin"
                domain={[0, Math.max(vdd, 0.5)]}
                stroke="#cbd5e1"
              />
              <YAxis
                type="number"
                dataKey="vout"
                name="Vout"
                domain={[0, Math.max(vdd, 0.5)]}
                stroke="#cbd5e1"
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                data={transferData}
                dataKey="vout"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={false}
                name="Transfer Curve"
              />
              <Scatter
                data={operatingPoint}
                fill="#f59e0b"
                name="Operating Point"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Transient Response</h3>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={transientData}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="time" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Legend />
              <Line
                type="stepAfter"
                dataKey="vin"
                stroke="#22c55e"
                strokeWidth={2}
                name="Vin"
                dot={false}
              />
              <Line
                type="stepAfter"
                dataKey="vout"
                stroke="#ef4444"
                strokeWidth={2}
                name="Vout"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}