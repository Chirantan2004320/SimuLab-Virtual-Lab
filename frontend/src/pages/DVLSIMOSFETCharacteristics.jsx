import React, { useMemo, useState } from "react";
import ExperimentLayout from "../components/experiments/ExperimentLayout";
import "./Lab.css";

function formatNumber(value, digits = 4) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return v.toFixed(digits);
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function DVLSIMOSFETCharacteristics() {
  const [deviceType, setDeviceType] = useState("nmos");
  const [vgs, setVgs] = useState(2.0);
  const [vds, setVds] = useState(2.0);
  const [vt, setVt] = useState(1.0);
  const [k, setK] = useState(1.0);

  const analysis = useMemo(() => {
    const K = Math.max(0.0001, Number(k));
    const VT = Math.abs(Number(vt));

    if (deviceType === "nmos") {
      const VGS = Number(vgs);
      const VDS = Number(vds);

      if (VGS <= VT) {
        return {
          region: "Cutoff",
          id: 0,
          note: "The nMOS is OFF because VGS is less than or equal to the threshold voltage.",
        };
      }

      const overdrive = VGS - VT;

      if (VDS < overdrive) {
        const id = K * ((overdrive * VDS) - (0.5 * VDS * VDS));
        return {
          region: "Triode / Linear",
          id: Math.max(0, id),
          note: "The nMOS operates in the triode region because VDS is less than VGS - VT.",
        };
      }

      const id = 0.5 * K * overdrive * overdrive;
      return {
        region: "Saturation",
        id: Math.max(0, id),
        note: "The nMOS operates in saturation because VDS is greater than or equal to VGS - VT.",
      };
    }

    // Simplified pMOS educational model using magnitudes
    const VSG = Math.abs(Number(vgs));
    const VSD = Math.abs(Number(vds));

    if (VSG <= VT) {
      return {
        region: "Cutoff",
        id: 0,
        note: "The pMOS is OFF because |VSG| is less than or equal to the threshold voltage magnitude.",
      };
    }

    const overdrive = VSG - VT;

    if (VSD < overdrive) {
      const id = K * ((overdrive * VSD) - (0.5 * VSD * VSD));
      return {
        region: "Triode / Linear",
        id: Math.max(0, id),
        note: "The pMOS operates in the triode region because |VSD| is less than |VSG| - |VT|.",
      };
    }

    const id = 0.5 * K * overdrive * overdrive;
    return {
      region: "Saturation",
      id: Math.max(0, id),
      note: "The pMOS operates in saturation because |VSD| is greater than or equal to |VSG| - |VT|.",
    };
  }, [deviceType, vgs, vds, vt, k]);

  const aim = (
    <p>
      To study the output and transfer characteristics of MOSFET devices and
      understand the regions of operation of nMOS and pMOS transistors.
    </p>
  );

  const theory = (
    <>
      <p>
        A MOSFET operates in different regions depending on gate voltage,
        drain voltage, and threshold voltage. The main operating regions are
        cutoff, triode, and saturation.
      </p>
      <p>
        For an nMOS transistor, conduction begins when the gate-to-source
        voltage exceeds the threshold voltage. For a pMOS transistor, the same
        idea applies using the magnitude of the source-to-gate voltage.
      </p>
      <p>
        In this simplified virtual experiment, the drain current is estimated
        using standard long-channel MOSFET equations for educational purposes.
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Select the MOSFET type: nMOS or pMOS.</li>
      <li>Adjust the gate voltage, drain voltage, threshold voltage, and k parameter.</li>
      <li>Observe the calculated drain current and region of operation.</li>
      <li>Compare how the device transitions between cutoff, triode, and saturation.</li>
    </ol>
  );

  const simulation = (
    <>
      <div className="lab-controls" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        <label className="lab-label" style={{ minWidth: 180 }}>
          Device Type:
          <select
            className="lab-select"
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            style={{ marginTop: "0.5rem" }}
          >
            <option value="nmos">nMOS</option>
            <option value="pmos">pMOS</option>
          </select>
        </label>

        <label className="lab-label" style={{ minWidth: 180 }}>
          {deviceType === "nmos" ? "VGS (V):" : "|VSG| (V):"}
          <input
            className="lab-input"
            type="number"
            step="0.1"
            value={vgs}
            onChange={(e) => setVgs(clampNumber(parseFloat(e.target.value || 0), 0, 10))}
          />
        </label>

        <label className="lab-label" style={{ minWidth: 180 }}>
          {deviceType === "nmos" ? "VDS (V):" : "|VSD| (V):"}
          <input
            className="lab-input"
            type="number"
            step="0.1"
            value={vds}
            onChange={(e) => setVds(clampNumber(parseFloat(e.target.value || 0), 0, 10))}
          />
        </label>

        <label className="lab-label" style={{ minWidth: 180 }}>
          |VT| (V):
          <input
            className="lab-input"
            type="number"
            step="0.1"
            value={vt}
            onChange={(e) => setVt(clampNumber(parseFloat(e.target.value || 0), 0, 5))}
          />
        </label>

        <label className="lab-label" style={{ minWidth: 180 }}>
          k parameter:
          <input
            className="lab-input"
            type="number"
            step="0.1"
            value={k}
            onChange={(e) => setK(clampNumber(parseFloat(e.target.value || 0), 0.1, 10))}
          />
        </label>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h3>Computed MOSFET Characteristics</h3>
        <table style={{ width: "100%", marginTop: "0.75rem", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "0.4rem" }}>Device</td>
              <td style={{ padding: "0.4rem" }}>
                <span className="lab-output-value">{deviceType.toUpperCase()}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem" }}>Region of Operation</td>
              <td style={{ padding: "0.4rem" }}>
                <span className="lab-output-value">{analysis.region}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem" }}>Drain Current ID</td>
              <td style={{ padding: "0.4rem" }}>
                <span className="lab-output-value">{formatNumber(analysis.id)} mA (relative)</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: "0.75rem", color: "#9ca3af" }}>{analysis.note}</p>
      </div>

      <div className="card" style={{ padding: "1rem" }}>
        <h3>Interpretation</h3>
        <p style={{ marginTop: "0.5rem" }}>
          Increase the gate voltage to turn the device ON. Then compare how the
          drain current changes as drain voltage increases. Notice how the
          device moves into saturation once the drain voltage condition is met.
        </p>
      </div>
    </>
  );

  const result = (
    <p>
      This experiment demonstrates how MOSFET current depends on gate voltage,
      drain voltage, threshold voltage, and the device parameter k. It also
      shows how nMOS and pMOS devices transition between cutoff, triode, and
      saturation regions.
    </p>
  );

  return (
    <ExperimentLayout
      title="DVLSI Experiment 1: MOSFET Characteristics"
      subtitle="Analyze simplified nMOS and pMOS operating regions and observe how drain current changes with voltage conditions."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}