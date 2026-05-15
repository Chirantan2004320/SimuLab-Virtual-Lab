import React from "react";

import {
  LineChart as LineChartIcon,
  Activity,
  Waves
} from "lucide-react";

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

export default function DVLSIRingOscillatorGraphs({
  stages,
  tpd,
  analysis,
  formatNumber
}) {
  const waveformData = [];

  const totalTime = Math.max(
    20,
    6 * stages * tpd
  );

  for (
    let t = 0;
    t <= totalTime;
    t += totalTime / 40
  ) {
    let node0 = 0;

    if (
      analysis.oscillates &&
      analysis.period > 0
    ) {
      const normalized =
        (t %
          analysis.period) /
        analysis.period;

      node0 =
        normalized < 0.5
          ? 1
          : 0;
    }

    const node1 =
      analysis.oscillates
        ? (((
            t + tpd
          ) %
            analysis.period) /
            analysis.period <
          0.5
            ? 0
            : 1)
        : 0;

    waveformData.push({
      time: Number(
        t.toFixed(2)
      ),

      node0,
      node1
    });
  }

  return (
    <section className="sorting-simulation-shell">
      <div className="sorting-sim-title-wrap">
        <div className="sorting-sim-icon">
          <LineChartIcon
            size={18}
          />
        </div>

        <div>
          <h2 className="sorting-sim-title">
            Waveform Graphs
          </h2>

          <p className="sorting-sim-subtitle">
            Observe waveform-style
            timing transitions
            across oscillator nodes
            during feedback loop
            operation.
          </p>
        </div>
      </div>

      <div className="sorting-info-panel">
        <h3>
          Graph Description
        </h3>

        <p>
          This educational waveform
          view shows logic
          transitions at two nodes
          of the ring oscillator.
          Node transitions are
          phase-shifted because each
          inverter introduces
          propagation delay.
        </p>
      </div>

      <div className="sorting-visual-card">
        <div className="sorting-visual-header">
          <h3>
            Oscillation Waveforms
          </h3>
        </div>

        <div
          style={{
            width: "100%",
            height: 340
          }}
        >
          <ResponsiveContainer>
            <LineChart
              data={waveformData}
            >
              <CartesianGrid stroke="#334155" />

              <XAxis
                dataKey="time"
                stroke="#cbd5e1"
              />

              <YAxis
                domain={[
                  -0.2,
                  1.2
                ]}
                stroke="#cbd5e1"
              />

              <Tooltip />

              <Legend />

              <Line
                type="stepAfter"
                dataKey="node0"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={false}
                name="Node 0"
              />

              <Line
                type="stepAfter"
                dataKey="node1"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={false}
                name="Node 1"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-card">
          <div className="sorting-stat-icon blue">
            <Activity size={18} />
          </div>

          <div>
            <div className="sorting-stat-label">
              Period
            </div>

            <div className="sorting-stat-value">
              {analysis.oscillates
                ? `${formatNumber(
                    analysis.period
                  )} ns`
                : "—"}
            </div>
          </div>
        </div>

        <div className="sorting-stat-card">
          <div className="sorting-stat-icon green">
            <Waves size={18} />
          </div>

          <div>
            <div className="sorting-stat-label">
              Frequency
            </div>

            <div className="sorting-stat-value">
              {analysis.oscillates
                ? `${formatNumber(
                    analysis.frequency,
                    4
                  )} GHz`
                : "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="sorting-conclusion-box">
        <strong>
          Observation:
        </strong>{" "}
        Increasing propagation
        delay or stage count
        increases oscillation
        period and reduces
        oscillation frequency.
      </div>
    </section>
  );
}