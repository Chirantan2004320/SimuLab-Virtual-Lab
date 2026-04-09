import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from "recharts";

function GraphCard({ title, data, dataKey, line = false }) {
  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <h3>{title}</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          {line ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="index" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Line type="monotone" dataKey={dataKey} stroke="#38bdf8" strokeWidth={2} />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="index" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Bar dataKey={dataKey} fill="#22c55e" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DTSPLinearPhaseFIRGraphs({
  impulseResponse,
  frequencyData,
  symmetryType,
  formatNumber
}) {
  if (!impulseResponse.length) {
    return (
      <section className="card experiment">
        <h2>Graphs</h2>
        <div className="info-box">Please run the simulation first to view graphs.</div>
      </section>
    );
  }

  const impulseData = impulseResponse.map((value, index) => ({
    index,
    value: Number(formatNumber(value, 4))
  }));

  const magnitudeData = frequencyData.magnitude.map((item) => ({
    index: item.index,
    value: Number(formatNumber(item.value, 4))
  }));

  const phaseData = frequencyData.phase.map((item) => ({
    index: item.index,
    value: Number(formatNumber(item.value, 4))
  }));

  return (
    <section className="card experiment">
      <h2>Graphs</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        {symmetryType === "Not Linear Phase"
          ? "This FIR filter does not satisfy linear phase symmetry conditions."
          : `This FIR filter is classified as ${symmetryType}.`}
      </div>

      <GraphCard
        title="Impulse Response h[n]"
        data={impulseData}
        dataKey="value"
      />

      <GraphCard
        title="Magnitude Response |H(e^jω)|"
        data={magnitudeData}
        dataKey="value"
        line={true}
      />

      <GraphCard
        title="Phase Response ∠H(e^jω)"
        data={phaseData}
        dataKey="value"
        line={true}
      />
    </section>
  );
}