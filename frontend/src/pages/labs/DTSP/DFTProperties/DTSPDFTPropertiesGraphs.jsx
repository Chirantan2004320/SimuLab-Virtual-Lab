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
  Bar,
  Legend
} from "recharts";
import { LineChart as LineChartIcon, Activity } from "lucide-react";

function GraphCard({ title, data, dataKey, secondLineKey = null, line = false }) {
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
              {secondLineKey ? <Legend /> : null}
              <Line type="monotone" dataKey={dataKey} stroke="#38bdf8" strokeWidth={2} />
              {secondLineKey && (
                <Line type="monotone" dataKey={secondLineKey} stroke="#22c55e" strokeWidth={2} />
              )}
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="index" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              {secondLineKey ? <Legend /> : null}
              <Bar dataKey={dataKey} fill="#22c55e" />
              {secondLineKey && <Bar dataKey={secondLineKey} fill="#a855f7" />}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DTSPDFTPropertiesGraphs({
  sequence,
  transformedSequence,
  originalDFT,
  transformedDFT,
  property,
  formatNumber,
  getMagnitude,
  getPhase
}) {
  if (!sequence.length) {
    return (
      <section className="comparison-shell">
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
          <div className="sorting-sim-icon">
            <LineChartIcon size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Graphs</h2>
            <p className="sorting-sim-subtitle">
              Run the simulation first to view spectrum comparison graphs.
            </p>
          </div>
        </div>

        <div className="coding-empty-state">
          Please run the simulation first to view graphs.
        </div>
      </section>
    );
  }

  const originalTimeData = sequence.map((value, index) => ({ index, value }));
  const transformedTimeData = transformedSequence.map((value, index) => ({ index, value }));

  const compareTimeData = sequence.map((value, index) => ({
    index,
    original: Number(formatNumber(value, 4)),
    transformed: Number(formatNumber(transformedSequence[index] ?? 0, 4))
  }));

  const originalMagnitudeData = originalDFT.map((x, index) => ({
    index,
    magnitude: Number(formatNumber(getMagnitude(x), 4))
  }));

  const transformedMagnitudeData = transformedDFT.map((x, index) => ({
    index,
    magnitude: Number(formatNumber(getMagnitude(x), 4))
  }));

  const compareMagnitudeData = originalDFT.map((x, index) => ({
    index,
    original: Number(formatNumber(getMagnitude(x), 4)),
    transformed: Number(formatNumber(getMagnitude(transformedDFT[index] || { re: 0, im: 0 }), 4))
  }));

  const comparePhaseData = originalDFT.map((x, index) => ({
    index,
    original: Number(formatNumber(getPhase(x), 4)),
    transformed: Number(formatNumber(getPhase(transformedDFT[index] || { re: 0, im: 0 }), 4))
  }));

  const propertyText =
    property === "linearity"
      ? "Linearity compares the DFT of a sum with the sum of individual DFTs."
      : property === "timeShift"
      ? "Time shift mainly changes phase while preserving much of the magnitude pattern."
      : "Frequency shift redistributes energy across frequency bins.";

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <LineChartIcon size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Graphs</h2>
          <p className="sorting-sim-subtitle">
            Compare original and transformed signals in time and frequency domain.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Activity size={16} style={{ marginRight: 10 }} />
        {propertyText}
      </div>

      <GraphCard
        title="Original Time-Domain Sequence"
        data={originalTimeData}
        dataKey="value"
        line
      />

      <GraphCard
        title="Transformed Time-Domain Sequence"
        data={transformedTimeData}
        dataKey="value"
        line
      />

      <GraphCard
        title="Original vs Transformed Sequence"
        data={compareTimeData}
        dataKey="original"
        secondLineKey="transformed"
        line
      />

      <GraphCard
        title="Original Magnitude Spectrum"
        data={originalMagnitudeData}
        dataKey="magnitude"
      />

      <GraphCard
        title="Transformed Magnitude Spectrum"
        data={transformedMagnitudeData}
        dataKey="magnitude"
      />

      <GraphCard
        title="Magnitude Spectrum Comparison"
        data={compareMagnitudeData}
        dataKey="original"
        secondLineKey="transformed"
      />

      <GraphCard
        title="Phase Comparison"
        data={comparePhaseData}
        dataKey="original"
        secondLineKey="transformed"
        line
      />
    </section>
  );
}