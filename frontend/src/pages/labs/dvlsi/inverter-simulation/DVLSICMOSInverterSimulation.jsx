import React, { useMemo, useState } from "react";
import ExperimentLayout from "../../../../components/experiments/ExperimentLayout";
import "../../../../styles/Lab.css";

function formatNumber(value, digits = 3) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return v.toFixed(digits);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function DVLSICMOSInverterSimulation() {
  const [vin, setVin] = useState(0);
  const [vdd, setVdd] = useState(5);
  const [switchPoint, setSwitchPoint] = useState(2.5);
  const [tpd, setTpd] = useState(2);
  const [loadCap, setLoadCap] = useState(10);

  const analysis = useMemo(() => {
    const VDD = Math.max(0.1, Number(vdd));
    const VM = clamp(Number(switchPoint), 0, VDD);
    const VIN = clamp(Number(vin), 0, VDD);
    const delay = Math.max(0.1, Number(tpd));
    const cap = Math.max(0.1, Number(loadCap));

    let logicRegion = "";
    let vout = 0;
    let note = "";

    if (VIN < VM * 0.8) {
      vout = VDD;
      logicRegion = "Logic HIGH output";
      note =
        "The nMOS is mostly OFF and the pMOS is ON, so the inverter output stays near VDD.";
    } else if (VIN > VM * 1.2) {
      vout = 0;
      logicRegion = "Logic LOW output";
      note =
        "The nMOS is ON and the pMOS is mostly OFF, so the inverter output is pulled near ground.";
    } else {
      const normalized = (VIN - VM * 0.8) / (VM * 0.4 || 1);
      vout = VDD * (1 - normalized);
      vout = clamp(vout, 0, VDD);
      logicRegion = "Transition region";
      note =
        "Both transistors conduct during switching, so the output transitions rapidly between HIGH and LOW.";
    }

    const noiseMarginHigh = Math.max(0, VDD - VM);
    const noiseMarginLow = Math.max(0, VM);
    const dynamicPower = 0.5 * cap * VDD * VDD * 0.001;

    return {
      vout,
      logicRegion,
      note,
      noiseMarginHigh,
      noiseMarginLow,
      delay,
      dynamicPower,
    };
  }, [vin, vdd, switchPoint, tpd, loadCap]);

  const aim = (
    <p>
      To study the transfer behavior of a CMOS inverter and understand its
      switching action, noise margin concepts, propagation delay, and dynamic power trend.
    </p>
  );

  const theory = (
    <>
      <p>
        A CMOS inverter is formed by connecting a pMOS transistor at the top and
        an nMOS transistor at the bottom. The same input voltage drives both gates,
        while the output is taken from their common drain connection.
      </p>
      <p>
        When the input is LOW, the pMOS conducts and the nMOS is OFF, so the output
        is HIGH. When the input is HIGH, the nMOS conducts and the pMOS is OFF, so
        the output is LOW.
      </p>
      <p>
        Around the switching threshold, both transistors can conduct at the same time.
        This transition region is important for delay, power, and noise margin analysis.
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Adjust the supply voltage VDD and inverter switching point.</li>
      <li>Vary the input voltage Vin from 0 up to VDD.</li>
      <li>Observe the output voltage Vout and logic interpretation.</li>
      <li>Study how the inverter moves between HIGH, LOW, and transition regions.</li>
      <li>Relate the results to propagation delay, noise margins, and dynamic power trend.</li>
    </ol>
  );

  const simulation = (
    <>
      <div className="lab-controls" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        <label className="lab-label" style={{ minWidth: 180 }}>
          Vin (V):
          <input
            className="lab-input"
            type="number"
            step="0.1"
            value={vin}
            onChange={(e) => setVin(clamp(parseFloat(e.target.value || 0), 0, 10))}
          />
        </label>

        <label className="lab-label" style={{ minWidth: 180 }}>
          VDD (V):
          <input
            className="lab-input"
            type="number"
            step="0.1"
            value={vdd}
            onChange={(e) => setVdd(clamp(parseFloat(e.target.value || 0), 0.5, 10))}
          />
        </label>

        <label className="lab-label" style={{ minWidth: 180 }}>
          Switching Point VM (V):
          <input
            className="lab-input"
            type="number"
            step="0.1"
            value={switchPoint}
            onChange={(e) => setSwitchPoint(clamp(parseFloat(e.target.value || 0), 0, 10))}
          />
        </label>

        <label className="lab-label" style={{ minWidth: 180 }}>
          Propagation Delay (ns):
          <input
            className="lab-input"
            type="number"
            step="0.1"
            value={tpd}
            onChange={(e) => setTpd(clamp(parseFloat(e.target.value || 0), 0.1, 20))}
          />
        </label>

        <label className="lab-label" style={{ minWidth: 180 }}>
          Load Capacitance (fF):
          <input
            className="lab-input"
            type="number"
            step="0.1"
            value={loadCap}
            onChange={(e) => setLoadCap(clamp(parseFloat(e.target.value || 0), 0.1, 100))}
          />
        </label>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h3>CMOS Inverter Output Analysis</h3>
        <table style={{ width: "100%", marginTop: "0.75rem", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "0.4rem" }}>Input Voltage Vin</td>
              <td style={{ padding: "0.4rem" }}>
                <span className="lab-output-value">{formatNumber(vin)} V</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem" }}>Output Voltage Vout</td>
              <td style={{ padding: "0.4rem" }}>
                <span className="lab-output-value">{formatNumber(analysis.vout)} V</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem" }}>Operating Interpretation</td>
              <td style={{ padding: "0.4rem" }}>
                <span className="lab-output-value">{analysis.logicRegion}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem" }}>Propagation Delay</td>
              <td style={{ padding: "0.4rem" }}>
                <span className="lab-output-value">{formatNumber(analysis.delay)} ns</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem" }}>Estimated Dynamic Power Trend</td>
              <td style={{ padding: "0.4rem" }}>
                <span className="lab-output-value">{formatNumber(analysis.dynamicPower)} arb. units</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: "0.75rem", color: "#9ca3af" }}>{analysis.note}</p>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h3>Noise Margin Interpretation</h3>
        <p style={{ marginTop: "0.5rem" }}>
          <strong>Noise Margin Low (approx): </strong>
          <span className="lab-output-value">{formatNumber(analysis.noiseMarginLow)} V</span>
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          <strong>Noise Margin High (approx): </strong>
          <span className="lab-output-value">{formatNumber(analysis.noiseMarginHigh)} V</span>
        </p>
        <p style={{ marginTop: "0.75rem", color: "#9ca3af" }}>
          These are simplified educational estimates based on the switching point and supply voltage.
        </p>
      </div>

      <div className="card" style={{ padding: "1rem" }}>
        <h3>Simple Transfer View</h3>
        <div
          style={{
            marginTop: "1rem",
            height: "180px",
            position: "relative",
            border: "1px solid #374151",
            borderRadius: "8px",
            background: "#111827",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: "12px", top: "8px", color: "#9ca3af", fontSize: "0.85rem" }}>
            Vout
          </div>
          <div style={{ position: "absolute", right: "12px", bottom: "8px", color: "#9ca3af", fontSize: "0.85rem" }}>
            Vin
          </div>

          <svg width="100%" height="100%" viewBox="0 0 400 180" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#60a5fa"
              strokeWidth="3"
              points={`20,20 120,20 200,90 280,150 380,150`}
            />
            <circle
              cx={20 + (clamp(vin, 0, vdd || 1) / (vdd || 1)) * 360}
              cy={20 + ((analysis.vout <= 0 ? 0 : (vdd - analysis.vout) / (vdd || 1)) * 130)}
              r="5"
              fill="#f59e0b"
            />
          </svg>
        </div>
        <p style={{ marginTop: "0.75rem", color: "#9ca3af" }}>
          The blue curve is a conceptual inverter transfer characteristic. The orange marker shows the current operating point.
        </p>
      </div>
    </>
  );

  const result = (
    <p>
      This experiment demonstrates the voltage transfer behavior of a CMOS inverter
      and highlights the roles of switching threshold, propagation delay, load,
      and simplified noise margin concepts in digital VLSI design.
    </p>
  );

  return (
    <ExperimentLayout
      title="DVLSI Experiment 3: CMOS Inverter Simulation"
      subtitle="Study CMOS inverter switching behavior, output response, delay, and simplified noise margin concepts."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}