import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter
} from "recharts";
import { LineChart as LineChartIcon, Activity } from "lucide-react";

export default function DVLSIMOSFETGraphs({
  vgs,
  vds,
  vt,
  k,
  lambda,
  analysis,
  formatNumber
}) {
  const idVsVdsData = [];

  for (let x = 0; x <= 5; x += 0.1) {
    let id = 0;

    if (vgs < vt) {
      id = 0;
    } else if (x < vgs - vt) {
      id = k * ((vgs - vt) * x - 0.5 * x * x);
    } else {
      id = 0.5 * k * (vgs - vt) * (vgs - vt) * (1 + lambda * x);
    }

    idVsVdsData.push({
      vds: Number(x.toFixed(2)),
      id: Number(id.toFixed(4))
    });
  }

  const idVsVgsData = [];

  for (let x = 0; x <= 5; x += 0.1) {
    let id = 0;

    if (x < vt) {
      id = 0;
    } else if (vds < x - vt) {
      id = k * ((x - vt) * vds - 0.5 * vds * vds);
    } else {
      id = 0.5 * k * (x - vt) * (x - vt) * (1 + lambda * vds);
    }

    idVsVgsData.push({
      vgs: Number(x.toFixed(2)),
      id: Number(id.toFixed(4))
    });
  }

  const operatingPoint = [{ vds, id: Number(analysis.id.toFixed(4)) }];

  return (
    <section className="comparison-shell">
      <div className="sorting-sim-title-wrap" style={{ marginBottom: 18 }}>
        <div className="sorting-sim-icon">
          <LineChartIcon size={18} />
        </div>
        <div>
          <h2 className="sorting-sim-title">Graphs</h2>
          <p className="sorting-sim-subtitle">
            Visualize Id–Vds and Id–Vgs characteristics for the selected operating point.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Activity size={16} style={{ marginRight: 10 }} />
        The operating point is in the <strong style={{ marginLeft: 4 }}>{analysis.region}</strong> region with ID = {formatNumber(analysis.id, 4)} A.
      </div>

      <div className="overview-card" style={{ marginBottom: 18 }}>
        <div className="overview-card-head">
          <LineChartIcon size={18} />
          <h4>Id vs Vds</h4>
        </div>

        <div style={{ width: "100%", height: 340 }}>
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid stroke="#334155" />
              <XAxis type="number" dataKey="vds" name="VDS" stroke="#cbd5e1" />
              <YAxis type="number" dataKey="id" name="ID" stroke="#cbd5e1" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                data={idVsVdsData}
                dataKey="id"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={false}
                name="Id-Vds Curve"
              />
              <Scatter data={operatingPoint} fill="#f59e0b" name="Operating Point" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overview-card" style={{ marginBottom: 18 }}>
        <div className="overview-card-head">
          <LineChartIcon size={18} />
          <h4>Id vs Vgs</h4>
        </div>

        <div style={{ width: "100%", height: 340 }}>
          <ResponsiveContainer>
            <LineChart data={idVsVgsData}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="vgs" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="id"
                stroke="#22c55e"
                strokeWidth={2}
                name="Id-Vgs Curve"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overview-card">
        <div className="overview-card-head">
          <Activity size={18} />
          <h4>Current Interpretation</h4>
        </div>
        <p>
          For the current operating point, <strong>Id = {formatNumber(analysis.id, 4)} A</strong>.
          The device is operating in the <strong>{analysis.region}</strong> region.
        </p>
      </div>
    </section>
  );
}