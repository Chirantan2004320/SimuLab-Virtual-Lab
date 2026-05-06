import React from "react";
import {
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { LineChart as LineChartIcon, Activity, CircleDot } from "lucide-react";

export default function DTSPIIRFilterDesignGraphs({
  frequencyResponse,
  poles,
  inputSignal,
  outputSignal,
  filterType
}) {
  if (!frequencyResponse.length) {
    return (
      <section className="comparison-shell">
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
          <div className="sorting-sim-icon">
            <LineChartIcon size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Graphs</h2>
            <p className="sorting-sim-subtitle">
              Design the filter first to view response graphs.
            </p>
          </div>
        </div>

        <div className="coding-empty-state">
          No graph data available yet. Go to Simulation and click{" "}
          <b>Design Filter</b>.
        </div>
      </section>
    );
  }

  const unitCircle = Array.from({ length: 121 }, (_, index) => {
    const theta = (2 * Math.PI * index) / 120;
    return {
      re: Math.cos(theta),
      im: Math.sin(theta)
    };
  });

  const label = filterType === "lowpass" ? "Low Pass" : "High Pass";

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <LineChartIcon size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Graphs</h2>
          <p className="sorting-sim-subtitle">
            Visualize magnitude response, pole locations, and filtering effect.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Activity size={16} style={{ marginRight: 10 }} />
        {label} Butterworth-style response is shown using normalized frequency.
      </div>

      <GraphCard title="Magnitude Response">
        <ResponsiveContainer>
          <LineChart data={frequencyResponse}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="frequency" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="magnitude"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
              name="|H(f)|"
            />
          </LineChart>
        </ResponsiveContainer>
      </GraphCard>

      <GraphCard title="Pole Locations with Unit Circle">
        <ResponsiveContainer>
          <ScatterChart>
            <CartesianGrid stroke="#334155" />
            <XAxis
              type="number"
              dataKey="re"
              name="Real"
              stroke="#cbd5e1"
              domain={[-1.2, 1.2]}
            />
            <YAxis
              type="number"
              dataKey="im"
              name="Imag"
              stroke="#cbd5e1"
              domain={[-1.2, 1.2]}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Line
              type="monotone"
              data={unitCircle}
              dataKey="im"
              stroke="#64748b"
              strokeWidth={2}
              dot={false}
              name="Unit Circle"
            />
            <Scatter data={poles} fill="#ef4444" name="Poles" />
          </ScatterChart>
        </ResponsiveContainer>
      </GraphCard>

      <GraphCard title="Input Signal">
        <ResponsiveContainer>
          <LineChart data={inputSignal}>
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
              name="Input Signal"
            />
          </LineChart>
        </ResponsiveContainer>
      </GraphCard>

      <GraphCard title="Filtered Output Signal">
        <ResponsiveContainer>
          <LineChart data={outputSignal}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="n" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="Output Signal"
            />
          </LineChart>
        </ResponsiveContainer>
      </GraphCard>

      <div className="overview-card">
        <div className="overview-card-head">
          <CircleDot size={18} />
          <h4>Interpretation</h4>
        </div>
        <p>
          A Butterworth-style response is smooth in the passband. Increasing
          order sharpens the transition. Pole locations help explain system
          behavior and stability.
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