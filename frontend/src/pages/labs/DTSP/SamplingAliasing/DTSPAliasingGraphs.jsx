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
import { LineChart as LineChartIcon, Activity, Waves } from "lucide-react";

export default function DTSPAliasingGraphs({
  continuous,
  samples,
  aliasedWave,
  aliasFreq,
  isAliasing,
  signalFreq,
  samplingFreq,
  nyquistRate
}) {
  if (!continuous.length) {
    return (
      <section className="comparison-shell">
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
          <div className="sorting-sim-icon">
            <LineChartIcon size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Graphs</h2>
            <p className="sorting-sim-subtitle">
              Run the simulation first to generate waveform graphs.
            </p>
          </div>
        </div>

        <div className="coding-empty-state">
          No graph data available yet. Go to Simulation and click <b>Generate Signal</b>.
        </div>
      </section>
    );
  }

  const sampledTrendData = samples.map((point) => ({
    t: point.t,
    value: point.value
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
            Analyze the continuous signal, sampled points, sampled trend, and apparent alias.
          </p>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Signal Frequency</span>
          <span className="sorting-stat-value">{signalFreq} Hz</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Sampling Frequency</span>
          <span className="sorting-stat-value">{samplingFreq} Hz</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Nyquist Rate</span>
          <span className="sorting-stat-value">{nyquistRate} Hz</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Observed Frequency</span>
          <span className="sorting-stat-value">{aliasFreq !== null ? `${aliasFreq} Hz` : "-"}</span>
        </div>
      </div>

      <div className="sorting-info-box">
        <Activity size={16} style={{ marginRight: 10 }} />
        {isAliasing
          ? `Aliasing is present because fs = ${samplingFreq} Hz is below the Nyquist rate of ${nyquistRate} Hz.`
          : `No aliasing is present because fs = ${samplingFreq} Hz satisfies the Nyquist rate.`}
      </div>

      <GraphCard title="Continuous Signal">
        <ResponsiveContainer>
          <LineChart data={continuous}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="t" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
              name="Continuous Signal"
            />
          </LineChart>
        </ResponsiveContainer>
      </GraphCard>

      <GraphCard title="Continuous Signal with Sampled Points">
        <ResponsiveContainer>
          <ScatterChart>
            <CartesianGrid stroke="#334155" />
            <XAxis type="number" dataKey="t" name="Time" stroke="#cbd5e1" />
            <YAxis type="number" dataKey="value" name="Amplitude" stroke="#cbd5e1" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Line
              type="monotone"
              data={continuous}
              dataKey="value"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
              name="Continuous Signal"
            />
            <Scatter data={samples} fill="#ef4444" name="Sampled Points" />
          </ScatterChart>
        </ResponsiveContainer>
      </GraphCard>

      <GraphCard title="Sampled Signal Trend">
        <ResponsiveContainer>
          <LineChart data={sampledTrendData}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="t" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#f97316"
              strokeWidth={2}
              name="Sampled Trend"
            />
          </LineChart>
        </ResponsiveContainer>
      </GraphCard>

      <GraphCard title="Original vs Apparent Aliased Signal">
        <ResponsiveContainer>
          <LineChart data={continuous}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="t" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
              name={`Original (${signalFreq} Hz)`}
            />
            {isAliasing && aliasedWave?.length > 0 && (
              <Line
                type="monotone"
                data={aliasedWave}
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name={`Aliased (${aliasFreq} Hz)`}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </GraphCard>

      <div className="overview-card">
        <div className="overview-card-head">
          <Waves size={18} />
          <h4>Interpretation</h4>
        </div>
        <p>
          The graphs show how the original waveform is sampled. If sampling frequency is below
          Nyquist rate, the sampled points may visually match a lower-frequency waveform, creating
          the illusion of a different signal.
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

      <div style={{ width: "100%", height: 320 }}>
        {children}
      </div>
    </div>
  );
}