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

export default function DVLSICMOSInverterSimulationGraphs({
  vin,
  analysis,
  transferData,
  transientData,
  vdd
}) {
  return (
    <section className="sorting-sim-card">
      <h2>Graphs</h2>

      <div className="sorting-info-box">
        Shows VTC and transient switching behavior of CMOS inverter
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Voltage Transfer Curve</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transferData}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="vin" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" domain={[0, vdd]} />
            <Tooltip />
            <Legend />
            <Line dataKey="vout" stroke="#38bdf8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Transient Response</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transientData}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="time" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line dataKey="vin" stroke="#22c55e" />
            <Line dataKey="vout" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}