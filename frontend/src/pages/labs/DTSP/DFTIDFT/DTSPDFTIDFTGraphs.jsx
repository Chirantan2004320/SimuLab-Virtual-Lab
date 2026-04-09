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

function GraphCard({ title, data, dataKey, xKey = "index", line = false, secondLineKey = null }) {
  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <h3>{title}</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          {line ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={xKey} stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              {secondLineKey ? <Legend /> : null}
              <Line type="monotone" dataKey={dataKey} stroke="#38bdf8" strokeWidth={2} />
              {secondLineKey ? (
                <Line type="monotone" dataKey={secondLineKey} stroke="#22c55e" strokeWidth={2} />
              ) : null}
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

function SpectrumBars({ title, values, color = "#38bdf8", formatNumber, labelPrefix = "k" }) {
  if (!values.length) return null;

  const maxValue = Math.max(...values.map((v) => Math.abs(v)), 1);

  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <h3>{title}</h3>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "12px",
          minHeight: "220px",
          padding: "20px 10px 10px",
          overflowX: "auto"
        }}
      >
        {values.map((value, index) => {
          const height = `${Math.max((Math.abs(value) / maxValue) * 160, 8)}px`;

          return (
            <div
              key={index}
              style={{
                minWidth: "60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <div style={{ color: "#e5e7eb", fontSize: "12px" }}>
                {formatNumber(value)}
              </div>

              <div
                style={{
                  width: "38px",
                  height,
                  borderRadius: "8px 8px 0 0",
                  background: color,
                  boxShadow: `0 0 14px ${color}55`
                }}
              />

              <div style={{ color: "#9ca3af", fontSize: "12px" }}>
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
    <section className="card experiment">
      <h2>Graphs</h2>

      <div className="buttons" style={{ marginBottom: "1rem" }}>
        <button
          className={`btn ${activeGraphTab === "dft" ? "primary" : "secondary"}`}
          onClick={() => setActiveGraphTab("dft")}
        >
          DFT Graphs
        </button>

        <button
          className={`btn ${activeGraphTab === "idft" ? "primary" : "secondary"}`}
          onClick={() => setActiveGraphTab("idft")}
        >
          IDFT Graphs
        </button>
      </div>

      {activeGraphTab === "dft" && (
        <>
          {sequence.length === 0 ? (
            <div className="info-box">
              Please compute DFT first to view DFT graphs.
            </div>
          ) : (
            <>
              <GraphCard
                title="Input Time Domain Signal"
                data={timeDomainData}
                dataKey="value"
                line={true}
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
                line={true}
              />

              <SpectrumBars
                title="Magnitude Spectrum Bars"
                values={magnitudes}
                color="#22c55e"
                formatNumber={formatNumber}
              />

              <SpectrumBars
                title="Phase Spectrum Bars"
                values={phases}
                color="#a855f7"
                formatNumber={formatNumber}
              />
            </>
          )}
        </>
      )}

      {activeGraphTab === "idft" && (
        <>
          {reconstructed.length === 0 ? (
            <div className="info-box">
              Please compute IDFT first to view IDFT graphs.
            </div>
          ) : (
            <>
              <GraphCard
                title="Reconstructed Time Domain Signal"
                data={reconstructedData}
                dataKey="value"
                line={true}
              />

              <GraphCard
                title="Original vs Reconstructed Signal"
                data={compareData}
                dataKey="original"
                secondLineKey="reconstructed"
                line={true}
              />
            </>
          )}
        </>
      )}
    </section>
  );
}