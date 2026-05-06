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
import { LineChart as LineChartIcon, Activity } from "lucide-react";

function GraphCard({ title, data, xKey, dataKey, name, dot = true }) {
  return (
    <div className="overview-card" style={{ marginBottom: 18 }}>
      <div className="overview-card-head">
        <LineChartIcon size={18} />
        <h4>{title}</h4>
      </div>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey={xKey} stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line
              dataKey={dataKey}
              stroke="#38bdf8"
              strokeWidth={2}
              name={name}
              dot={dot}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DTSPFilterDesignGraphs({
  impulse,
  frequency,
  inputSignal,
  outputSignal
}) {
  if (!impulse.length) {
    return (
      <section className="comparison-shell">
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
          <div className="sorting-sim-icon">
            <LineChartIcon size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Graphs</h2>
            <p className="sorting-sim-subtitle">
              Generate the filter first to view response graphs.
            </p>
          </div>
        </div>

        <div className="coding-empty-state">
          Run simulation first to view graphs.
        </div>
      </section>
    );
  }

  const impulseData = impulse.map((v, i) => ({ n: i, value: v }));

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <LineChartIcon size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Graphs</h2>
          <p className="sorting-sim-subtitle">
            Visualize FIR coefficients, frequency response, and signal filtering effect.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Activity size={16} style={{ marginRight: 10 }} />
        These graphs show the designed filter coefficients, normalized response, and before/after filtering.
      </div>

      <GraphCard
        title="Impulse Response h[n]"
        data={impulseData}
        xKey="n"
        dataKey="value"
        name="h[n]"
      />

      <GraphCard
        title="Frequency Response |H(ω)|"
        data={frequency}
        xKey="w"
        dataKey="mag"
        name="|H(ω)|"
      />

      <GraphCard
        title="Signal Before Filtering"
        data={inputSignal}
        xKey="n"
        dataKey="value"
        name="Input Signal"
        dot={false}
      />

      <GraphCard
        title="Signal After Filtering"
        data={outputSignal}
        xKey="n"
        dataKey="value"
        name="Filtered Output"
        dot={false}
      />
    </section>
  );
}