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
    <section className="card experiment">
      <h2>Graphs</h2>

      <div className="info-box" style={{ marginBottom: "1rem" }}>
        The first graph shows how drain current varies with VDS for the chosen VGS.
        The second graph shows how drain current varies with VGS for the chosen VDS.
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Id vs Vds</h3>
        <div style={{ width: "100%", height: 320 }}>
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

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Id vs Vgs</h3>
        <div style={{ width: "100%", height: 320 }}>
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

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Current Interpretation</h3>
        <p style={{ marginTop: "0.75rem", color: "#d1d5db" }}>
          For the current operating point, <strong>Id = {formatNumber(analysis.id, 4)} A</strong>.
          The device is in the <strong>{analysis.region}</strong> region.
        </p>
      </div>
    </section>
  );
}