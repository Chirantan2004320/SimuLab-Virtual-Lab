import React, { useState } from "react";
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
import { LineChart as LineChartIcon, BarChart3, Activity } from "lucide-react";

function GraphCard({ title, data, dataKey, xKey = "index", line = false, secondLineKey = null }) {
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
              <XAxis dataKey={xKey} stroke="#cbd5e1" />
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
              <XAxis dataKey={xKey} stroke="#cbd5e1" />
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

function SpectrumBars({ title, values, formatNumber, labelPrefix = "k" }) {
  if (!values.length) return null;

  const maxValue = Math.max(...values.map((v) => Math.abs(v)), 1);

  return (
    <div className="overview-card" style={{ marginBottom: 18 }}>
      <div className="overview-card-head">
        <BarChart3 size={18} />
        <h4>{title}</h4>
      </div>

      <div className="comparison-bars-area" style={{ height: 260, overflowX: "auto" }}>
        {values.map((value, index) => {
          const heightPercent = Math.max((Math.abs(value) / maxValue) * 100, 8);

          return (
            <div key={index} className="comparison-bar-column">
              <div className="comparison-bar-value">{formatNumber(value)}</div>
              <div
                className="sorting-bar"
                style={{ height: `${heightPercent}%` }}
              />
              <div className="sorting-bar-index">
                {labelPrefix}={index}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DTSPDFTIDFTGraphs({
  sequence,
  dftResult,
  reconstructed,
  formatNumber,
  getMagnitude,
  getPhase
}) {
  const [activeGraphTab, setActiveGraphTab] = useState("dft");

  const timeDomainData = sequence.map((value, index) => ({
    index,
    value
  }));

  const magnitudeData = dftResult.map((x, index) => ({
    index,
    magnitude: Number(formatNumber(getMagnitude(x), 4))
  }));

  const phaseData = dftResult.map((x, index) => ({
    index,
    phase: Number(formatNumber(getPhase(x), 4))
  }));

  const reconstructedData = reconstructed.map((value, index) => ({
    index,
    value: Number(formatNumber(value, 4))
  }));

  const compareData = sequence.map((value, index) => ({
    index,
    original: Number(formatNumber(value, 4)),
    reconstructed: Number(formatNumber(reconstructed[index] ?? 0, 4))
  }));

  const magnitudes = dftResult.map((x) => getMagnitude(x));
  const phases = dftResult.map((x) => getPhase(x));

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <LineChartIcon size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Graphs</h2>
          <p className="sorting-sim-subtitle">
            Visualize time-domain sequence, magnitude spectrum, phase spectrum, and IDFT reconstruction.
          </p>
        </div>
      </div>

      <div className="er-chip-row" style={{ marginBottom: 20 }}>
        <button
          className={`er-chip ${activeGraphTab === "dft" ? "active" : ""}`}
          onClick={() => setActiveGraphTab("dft")}
        >
          DFT Graphs
        </button>

        <button
          className={`er-chip ${activeGraphTab === "idft" ? "active" : ""}`}
          onClick={() => setActiveGraphTab("idft")}
        >
          IDFT Graphs
        </button>
      </div>

      {activeGraphTab === "dft" && (
        <>
          {sequence.length === 0 ? (
            <div className="coding-empty-state">
              Please compute DFT first to view DFT graphs.
            </div>
          ) : (
            <>
              <div className="sorting-info-box">
                <Activity size={16} style={{ marginRight: 10 }} />
                DFT graphs show how the input sequence is represented through magnitude and phase across frequency bins.
              </div>

              <GraphCard
                title="Input Time Domain Signal"
                data={timeDomainData}
                dataKey="value"
                line
              />

              <GraphCard
                title="Magnitude Spectrum"
                data={magnitudeData}
                dataKey="magnitude"
              />

              <GraphCard
                title="Phase Spectrum"
                data={phaseData}
                dataKey="phase"
                line
              />

              <SpectrumBars
                title="Magnitude Spectrum Bars"
                values={magnitudes}
                formatNumber={formatNumber}
              />

              <SpectrumBars
                title="Phase Spectrum Bars"
                values={phases}
                formatNumber={formatNumber}
              />
            </>
          )}
        </>
      )}

      {activeGraphTab === "idft" && (
        <>
          {reconstructed.length === 0 ? (
            <div className="coding-empty-state">
              Please compute IDFT first to view IDFT graphs.
            </div>
          ) : (
            <>
              <div className="sorting-info-box">
                <Activity size={16} style={{ marginRight: 10 }} />
                IDFT graphs compare the reconstructed signal with the original input sequence.
              </div>

              <GraphCard
                title="Reconstructed Time Domain Signal"
                data={reconstructedData}
                dataKey="value"
                line
              />

              <GraphCard
                title="Original vs Reconstructed Signal"
                data={compareData}
                dataKey="original"
                secondLineKey="reconstructed"
                line
              />
            </>
          )}
        </>
      )}
    </section>
  );
}