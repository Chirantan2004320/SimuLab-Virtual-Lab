import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

function GraphCard({ title, data, dataKey, secondKey = null, line = false }) {
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
              <Legend />
              <Line type="monotone" dataKey={dataKey} stroke="#38bdf8" strokeWidth={2} />
              {secondKey ? (
                <Line type="monotone" dataKey={secondKey} stroke="#22c55e" strokeWidth={2} />
              ) : null}
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="index" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill="#38bdf8" />
              {secondKey ? <Bar dataKey={secondKey} fill="#22c55e" /> : null}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DTSPFFTvsDFTGraphs({
  paddedSequence,
  dftResult,
  fftResult,
  dftOps,
  fftOps,
  formatNumber,
  getMagnitude
}) {
  if (!paddedSequence.length) {
    return (
      <section className="card experiment">
        <h2>Graphs</h2>
        <div className="info-box">Please run the simulation first to view graphs.</div>
      </section>
    );
  }

  const timeData = paddedSequence.map((value, index) => ({
    index,
    value
  }));

  const compareSpectrumData = dftResult.map((d, index) => ({
    index,
    dft: Number(formatNumber(getMagnitude(d), 4)),
    fft: Number(formatNumber(getMagnitude(fftResult[index] || { re: 0, im: 0 }), 4))
  }));

  const opsData = [
    { index: "DFT", operations: dftOps },
    { index: "FFT", operations: fftOps }
  ];

  return (
    <section className="card experiment">
      <h2>Graphs</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        The graphs below compare the same transform computed using direct DFT and recursive FFT.
        The spectrum should match closely, while the operation count shows why FFT is faster.
      </div>

      <GraphCard
        title="Input Sequence"
        data={timeData}
        dataKey="value"
        line={true}
      />

      <GraphCard
        title="DFT Magnitude vs FFT Magnitude"
        data={compareSpectrumData}
        dataKey="dft"
        secondKey="fft"
        line={true}
      />

      <GraphCard
        title="Operation Count Comparison"
        data={opsData}
        dataKey="operations"
      />
    </section>
  );
}