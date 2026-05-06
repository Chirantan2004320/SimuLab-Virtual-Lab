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
              <Bar dataKey={dataKey} fill="#22c55e" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DTSPLinearCircularConvolutionGraphs({
  x,
  h,
  yLinear,
  yCircularNoPad,
  yCircularPadded
}) {
  const [activeGraphTab, setActiveGraphTab] = useState("inputs");

  if (x.length === 0 || h.length === 0) {
    return (
      <section className="comparison-shell">
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
          <div className="sorting-sim-icon">
            <LineChartIcon size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Graphs</h2>
            <p className="sorting-sim-subtitle">
              Run the simulation first to view convolution graphs.
            </p>
          </div>
        </div>

        <div className="coding-empty-state">
          Please run the simulation first to view graphs.
        </div>
      </section>
    );
  }

  const xData = x.map((value, index) => ({ index, value }));
  const hData = h.map((value, index) => ({ index, value }));
  const linearData = yLinear.map((value, index) => ({ index, value }));
  const circularNoPadData = yCircularNoPad.map((value, index) => ({ index, value }));
  const circularPaddedData = yCircularPadded.map((value, index) => ({ index, value }));

  const compareLinearPadded = yLinear.map((value, index) => ({
    index,
    linear: value,
    paddedCircular: yCircularPadded[index] ?? 0
  }));

  const compareLinearNoPad = yLinear.map((value, index) => ({
    index,
    linear: value,
    noPadCircular: yCircularNoPad[index] ?? 0
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
            Compare input signals, convolution outputs, and zero-padding equivalence.
          </p>
        </div>
      </div>

      <div className="er-chip-row" style={{ marginBottom: 20 }}>
        <button
          className={`er-chip ${activeGraphTab === "inputs" ? "active" : ""}`}
          onClick={() => setActiveGraphTab("inputs")}
        >
          Input Graphs
        </button>

        <button
          className={`er-chip ${activeGraphTab === "outputs" ? "active" : ""}`}
          onClick={() => setActiveGraphTab("outputs")}
        >
          Output Graphs
        </button>

        <button
          className={`er-chip ${activeGraphTab === "comparison" ? "active" : ""}`}
          onClick={() => setActiveGraphTab("comparison")}
        >
          Comparison Graphs
        </button>
      </div>

      <div className="sorting-info-box">
        <Activity size={16} style={{ marginRight: 10 }} />
        Zero-padded circular convolution should overlap with linear convolution.
      </div>

      {activeGraphTab === "inputs" && (
        <>
          <GraphCard title="Input Sequence x[n]" data={xData} dataKey="value" line />
          <GraphCard title="Impulse Response h[n]" data={hData} dataKey="value" line />
        </>
      )}

      {activeGraphTab === "outputs" && (
        <>
          <GraphCard title="Linear Convolution Output" data={linearData} dataKey="value" />
          <GraphCard
            title="Circular Convolution without Zero Padding"
            data={circularNoPadData}
            dataKey="value"
          />
          <GraphCard
            title="Circular Convolution with Zero Padding"
            data={circularPaddedData}
            dataKey="value"
          />
        </>
      )}

      {activeGraphTab === "comparison" && (
        <>
          <GraphCard
            title="Linear vs Zero-Padded Circular Convolution"
            data={compareLinearPadded}
            dataKey="linear"
            secondLineKey="paddedCircular"
            line
          />

          <GraphCard
            title="Linear vs Non-Padded Circular Convolution"
            data={compareLinearNoPad}
            dataKey="linear"
            secondLineKey="noPadCircular"
            line
          />
        </>
      )}
    </section>
  );
}