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
      <section className="card experiment">
        <h2>Graphs</h2>
        <div className="info-box">Run the simulation first to view graphs.</div>
      </section>
    );
  }

  const sampledTrendData = samples.map((point) => ({
    t: point.t,
    value: point.value
  }));

  return (
    <section className="card experiment">
      <h2>Graphs</h2>

      <div
        style={{
          marginBottom: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px"
        }}
      >
        <div className="stat-card">
          <strong>Signal Frequency</strong>
          <div>{signalFreq} Hz</div>
        </div>

        <div className="stat-card">
          <strong>Sampling Frequency</strong>
          <div>{samplingFreq} Hz</div>
        </div>

        <div className="stat-card">
          <strong>Nyquist Rate</strong>
          <div>{nyquistRate} Hz</div>
        </div>

        <div className="stat-card">
          <strong>Observed Frequency</strong>
          <div>{aliasFreq !== null ? `${aliasFreq} Hz` : "-"}</div>
        </div>
      </div>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        {isAliasing
          ? `Aliasing is present because fs = ${samplingFreq} Hz is below the Nyquist rate of ${nyquistRate} Hz. The sampled signal may appear to have an aliased frequency of about ${aliasFreq} Hz.`
          : `No aliasing is present because fs = ${samplingFreq} Hz satisfies the Nyquist rate for the ${signalFreq} Hz signal.`}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Continuous Signal</h3>
        <div style={{ width: "100%", height: 300 }}>
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
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Continuous Signal with Sampled Points</h3>
        <div style={{ width: "100%", height: 320 }}>
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
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Sampled Signal Trend</h3>
        <div style={{ width: "100%", height: 300 }}>
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
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Original vs Apparent Aliased Signal</h3>
        <div style={{ width: "100%", height: 300 }}>
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
              {isAliasing && aliasedWave?.length > 0 ? (
                <Line
                  type="monotone"
                  data={aliasedWave}
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  name={`Aliased (${aliasFreq} Hz)`}
                />
              ) : null}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Interpretation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          The first graph shows the original continuous-time waveform. The second graph overlays
          the sampled points on the original signal. The third graph connects the sampled points to
          show the apparent sampled trend. The fourth graph compares the true original signal with
          the apparent aliased waveform when undersampling occurs.
        </p>

        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          When the sampling rate is too low, the sampled points can incorrectly suggest a lower
          frequency signal. This is the core idea of aliasing.
        </p>
      </div>
    </section>
  );
}