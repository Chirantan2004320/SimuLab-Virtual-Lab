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
import { LineChart as LineChartIcon, Activity } from "lucide-react";

function GraphCard({ title, data, dataKey, secondKey = null, line = false }) {
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
              <Legend />
              <Line type="monotone" dataKey={dataKey} stroke="#38bdf8" strokeWidth={2} />
              {secondKey && (
                <Line type="monotone" dataKey={secondKey} stroke="#22c55e" strokeWidth={2} />
              )}
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="index" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill="#38bdf8" />
              {secondKey && <Bar dataKey={secondKey} fill="#22c55e" />}
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
      <section className="comparison-shell">
        <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
          <div className="sorting-sim-icon">
            <LineChartIcon size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Graphs</h2>
            <p className="sorting-sim-subtitle">
              Run the simulation first to compare DFT and FFT graphs.
            </p>
          </div>
        </div>

        <div className="coding-empty-state">
          Please run the simulation first to view graphs.
        </div>
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
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <LineChartIcon size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Graphs</h2>
          <p className="sorting-sim-subtitle">
            Compare input sequence, DFT/FFT spectrum match, and operation count.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Activity size={16} style={{ marginRight: 10 }} />
        DFT and FFT magnitude spectra should match closely, while operation count shows why FFT is faster.
      </div>

      <GraphCard
        title="Input Sequence"
        data={timeData}
        dataKey="value"
        line
      />

      <GraphCard
        title="DFT Magnitude vs FFT Magnitude"
        data={compareSpectrumData}
        dataKey="dft"
        secondKey="fft"
        line
      />

      <GraphCard
        title="Operation Count Comparison"
        data={opsData}
        dataKey="operations"
      />
    </section>
  );
}