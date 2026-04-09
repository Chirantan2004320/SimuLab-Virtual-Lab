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

function GraphCard({ title, data, dataKey, secondLineKey = null, line = false }) {
  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <h3>{title}</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          {line ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="index" stroke="#cbd5e1" />
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
    <section className="card experiment">
      <h2>Graphs</h2>

      <div className="buttons" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        <button
          className={`btn ${activeGraphTab === "inputs" ? "primary" : "secondary"}`}
          onClick={() => setActiveGraphTab("inputs")}
        >
          Input Graphs
        </button>

        <button
          className={`btn ${activeGraphTab === "outputs" ? "primary" : "secondary"}`}
          onClick={() => setActiveGraphTab("outputs")}
        >
          Output Graphs
        </button>

        <button
          className={`btn ${activeGraphTab === "comparison" ? "primary" : "secondary"}`}
          onClick={() => setActiveGraphTab("comparison")}
        >
          Comparison Graphs
        </button>
      </div>

      {x.length === 0 || h.length === 0 ? (
        <div className="info-box">Please run the simulation first to view graphs.</div>
      ) : (
        <>
          {activeGraphTab === "inputs" && (
            <>
              <GraphCard title="Input Sequence x[n]" data={xData} dataKey="value" line={true} />
              <GraphCard title="Impulse Response h[n]" data={hData} dataKey="value" line={true} />
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
                line={true}
              />

              <GraphCard
                title="Linear vs Non-Padded Circular Convolution"
                data={compareLinearNoPad}
                dataKey="linear"
                secondLineKey="noPadCircular"
                line={true}
              />
            </>
          )}
        </>
      )}
    </section>
  );
}