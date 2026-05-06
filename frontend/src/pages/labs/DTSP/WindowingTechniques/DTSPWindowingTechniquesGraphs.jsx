import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { LineChart as LineChartIcon, Activity, BarChart3 } from "lucide-react";

export default function DTSPWindowingTechniquesGraphs({
  windowData,
  spectrumData,
  comparisonData,
  selectedWindowLabel
}) {
  if (!windowData.length) {
    return (
      <section className="comparison-shell">
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
          <div className="sorting-sim-icon">
            <LineChartIcon size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Graphs</h2>
            <p className="sorting-sim-subtitle">
              Generate a window first to view time and frequency plots.
            </p>
          </div>
        </div>

        <div className="coding-empty-state">
          No graph data available yet. Go to Simulation and click{" "}
          <b>Generate Window</b>.
        </div>
      </section>
    );
  }

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <LineChartIcon size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Graphs</h2>
          <p className="sorting-sim-subtitle">
            Visualize the selected window shape, spectrum, and comparison values.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Activity size={16} style={{ marginRight: 10 }} />
        Showing time-domain and frequency-domain behavior for{" "}
        <strong>{selectedWindowLabel}</strong> window.
      </div>

      <GraphCard title="Time-Domain Window Shape">
        <ResponsiveContainer>
          <LineChart data={windowData}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="n" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
              name="w[n]"
            />
          </LineChart>
        </ResponsiveContainer>
      </GraphCard>

      <GraphCard title="Normalized Magnitude Spectrum">
        <ResponsiveContainer>
          <LineChart data={spectrumData}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="omega" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="normalizedMagnitude"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="Normalized |W(ejw)|"
            />
          </LineChart>
        </ResponsiveContainer>
      </GraphCard>

      <GraphCard title="Window Energy Comparison">
        <ResponsiveContainer>
          <BarChart data={comparisonData}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="name" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Bar dataKey="energy" fill="#38bdf8" name="Energy" />
          </BarChart>
        </ResponsiveContainer>
      </GraphCard>

      <div className="overview-card">
        <div className="overview-card-head">
          <BarChart3 size={18} />
          <h4>Interpretation</h4>
        </div>
        <p>
          Rectangular windows provide sharp time truncation but higher leakage.
          Hamming, Hanning, Blackman, and Bartlett windows taper the edges,
          reducing leakage at the cost of wider main lobes.
        </p>
      </div>
    </section>
  );
}

function GraphCard({ title, children }) {
  return (
    <div className="overview-card" style={{ marginBottom: 18 }}>
      <div className="overview-card-head">
        <LineChartIcon size={18} />
        <h4>{title}</h4>
      </div>

      <div style={{ width: "100%", height: 320 }}>{children}</div>
    </div>
  );
}