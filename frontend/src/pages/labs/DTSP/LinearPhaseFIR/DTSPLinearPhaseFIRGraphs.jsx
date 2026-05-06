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
import { LineChart as LineChartIcon, Activity } from "lucide-react";

function GraphCard({ title, data, dataKey, line = false }) {
  return (
    <div className="overview-card" style={{ marginBottom: 18 }}>
      <div className="overview-card-head">
        <LineChartIcon size={18} />
        <h4>{title}</h4>
      </div>

      <div style={{ width: "100%", height: 320 }}>
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
      <section className="comparison-shell">
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
          <div className="sorting-sim-icon">
            <LineChartIcon size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Graphs</h2>
            <p className="sorting-sim-subtitle">
              Run the simulation first to view FIR response graphs.
            </p>
          </div>
        </div>

        <div className="coding-empty-state">
          Please run the simulation first to view graphs.
        </div>
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
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <LineChartIcon size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Graphs</h2>
          <p className="sorting-sim-subtitle">
            Visualize impulse response, magnitude response, and phase response.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Activity size={16} style={{ marginRight: 10 }} />
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
        line
      />

      <GraphCard
        title="Phase Response ∠H(e^jω)"
        data={phaseData}
        dataKey="value"
        line
      />
    </section>
  );
}