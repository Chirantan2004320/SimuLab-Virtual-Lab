import React, { useState } from "react";
import ExperimentLayout from "../components/experiments/ExperimentLayout";
import "./Lab.css";

function parseCoefficients(text) {
  const parts = text
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
  const nums = parts.map(Number);
  if (nums.length === 0 || nums.some((n) => Number.isNaN(n))) {
    return null;
  }
  return nums;
}

function solveLinear(a, b) {
  if (Math.abs(a) < 1e-12) return [];
  return [{ re: -b / a, im: 0 }];
}

function solveQuadratic(a, b, c) {
  if (Math.abs(a) < 1e-12) {
    return solveLinear(b, c);
  }
  const D = b * b - 4 * a * c;
  const twoA = 2 * a;
  if (D >= 0) {
    const sqrtD = Math.sqrt(D);
    return [
      { re: (-b + sqrtD) / twoA, im: 0 },
      { re: (-b - sqrtD) / twoA, im: 0 }
    ];
  }
  const sqrtAbsD = Math.sqrt(-D);
  return [
    { re: -b / twoA, im: sqrtAbsD / twoA },
    { re: -b / twoA, im: -sqrtAbsD / twoA }
  ];
}

function computeRoots(coeffs) {
  if (!coeffs || coeffs.length < 2 || coeffs.length > 3) {
    return { roots: [], note: "Only first- and second-order polynomials are supported in this demo." };
  }
  const [a0, a1, a2] = coeffs;
  if (coeffs.length === 2) {
    const roots = solveLinear(a0, a1);
    return { roots, note: "" };
  }
  const roots = solveQuadratic(a0, a1, a2);
  return { roots, note: "" };
}

function formatComplex(z, digits = 3) {
  const re = Math.abs(z.re) < 1e-10 ? 0 : z.re;
  const im = Math.abs(z.im) < 1e-10 ? 0 : z.im;
  const reStr = re.toFixed(digits);
  const imStr = Math.abs(im).toFixed(digits);
  if (im === 0) return reStr;
  const sign = im >= 0 ? "+" : "-";
  return `${reStr} ${sign} j${imStr}`;
}

function magnitude(z) {
  return Math.sqrt(z.re * z.re + z.im * z.im);
}

export default function DTSPPoleZeroAnalysis() {
  const [numText, setNumText] = useState("1, 0, -0.5");
  const [denText, setDenText] = useState("1, -0.8");
  const [zeros, setZeros] = useState([]);
  const [poles, setPoles] = useState([]);
  const [numNote, setNumNote] = useState("");
  const [denNote, setDenNote] = useState("");
  const [stabilityText, setStabilityText] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = () => {
    setError("");
    setStabilityText("");

    const numCoeffs = parseCoefficients(numText);
    const denCoeffs = parseCoefficients(denText);

    if (!numCoeffs || !denCoeffs) {
      setError("Please enter valid numeric coefficients for both numerator and denominator.");
      setZeros([]);
      setPoles([]);
      setNumNote("");
      setDenNote("");
      return;
    }

    const numResult = computeRoots(numCoeffs);
    const denResult = computeRoots(denCoeffs);

    setZeros(numResult.roots);
    setPoles(denResult.roots);
    setNumNote(numResult.note);
    setDenNote(denResult.note);

    if (denResult.roots.length === 0) {
      setStabilityText("Stability cannot be determined: no poles were computed (order higher than 2 or invalid coefficients).");
      return;
    }

    const mags = denResult.roots.map(magnitude);
    const maxMag = Math.max(...mags);
    const minMag = Math.min(...mags);
    const tol = 1e-3;

    if (maxMag < 1 - tol) {
      setStabilityText("All poles lie strictly inside the unit circle (|p| < 1). The discrete-time system is stable.");
    } else if (
      mags.some((m) => Math.abs(m - 1) <= tol) &&
      mags.every((m) => m <= 1 + tol)
    ) {
      setStabilityText("At least one pole lies approximately on the unit circle (|p| ≈ 1) and none are clearly outside. The system is marginally stable.");
    } else {
      setStabilityText("At least one pole lies outside the unit circle (|p| > 1). The discrete-time system is unstable.");
    }
  };

  const aim = (
    <p>
      To determine the zeros and poles of simple discrete-time transfer functions and interpret
      system stability based on the location of poles in the z-plane.
    </p>
  );

  const theory = (
    <>
      <p>
        A discrete-time LTI system can be described by its transfer function H(z) = N(z) / D(z),
        where the roots of N(z) are the zeros and the roots of D(z) are the poles.
      </p>
      <p>
        In this simplified demo, the entered numerator and denominator coefficients are interpreted
        directly as coefficients of low-order polynomials in z (for first- and second-order
        cases), and their roots are computed using basic analytic formulas.
      </p>
      <p>
        Stability of a causal discrete-time system is determined by the pole locations. If all
        poles lie strictly inside the unit circle (|p| &lt; 1), the system is stable. Poles very
        close to the unit circle correspond to marginally stable behavior, and any pole
        sufficiently outside the unit circle makes the system unstable.
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Enter the numerator coefficients of H(z) as comma-separated values (in descending powers).</li>
      <li>Enter the denominator coefficients of H(z) as comma-separated values (in descending powers).</li>
      <li>Click on <strong>Analyze Poles and Zeros</strong>.</li>
      <li>Observe the computed zeros and poles for simple first- and second-order cases.</li>
      <li>Read the stability interpretation based on the magnitudes of the poles.</li>
    </ol>
  );

  const simulation = (
    <>
      <div className="lab-controls" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        <label className="lab-label" style={{ flex: 1, minWidth: 260 }}>
          Numerator coefficients N(z):
          <input
            className="lab-input"
            value={numText}
            onChange={(e) => setNumText(e.target.value)}
            placeholder="e.g. 1, 0, -0.5"
          />
        </label>
        <label className="lab-label" style={{ flex: 1, minWidth: 260 }}>
          Denominator coefficients D(z):
          <input
            className="lab-input"
            value={denText}
            onChange={(e) => setDenText(e.target.value)}
            placeholder="e.g. 1, -0.8"
          />
        </label>
      </div>

      <button className="btn primary" type="button" onClick={handleAnalyze}>
        Analyze Poles and Zeros
      </button>

      {error && (
        <div className="stack-warning show" style={{ marginTop: "1rem" }}>
          {error}
        </div>
      )}

      {(zeros.length > 0 || poles.length > 0 || numNote || denNote || stabilityText) && (
        <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
          <div className="card" style={{ padding: "1rem" }}>
            <h3>Zeros (roots of N(z))</h3>
            {zeros.length > 0 ? (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                {zeros.map((z, i) => (
                  <li key={i} style={{ color: "#e5e7eb", fontSize: "0.95rem" }}>
                    z{`_${i}`} = <span className="lab-output-value">{formatComplex(z)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
                No zeros computed. Ensure the numerator degree is 1 or 2 for this demo.
              </p>
            )}
            {numNote && (
              <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>{numNote}</p>
            )}
          </div>

          <div className="card" style={{ padding: "1rem" }}>
            <h3>Poles (roots of D(z))</h3>
            {poles.length > 0 ? (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                {poles.map((p, i) => (
                  <li key={i} style={{ color: "#e5e7eb", fontSize: "0.95rem" }}>
                    p{`_${i}`} = <span className="lab-output-value">{formatComplex(p)}</span>{" "}
                    (|p| = {magnitude(p).toFixed(3)})
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
                No poles computed. Ensure the denominator degree is 1 or 2 for this demo.
              </p>
            )}
            {denNote && (
              <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>{denNote}</p>
            )}
          </div>

          {stabilityText && (
            <div className="card" style={{ padding: "1rem" }}>
              <h3>Stability Interpretation</h3>
              <p style={{ marginTop: "0.5rem", color: "#e5e7eb", fontSize: "0.95rem" }}>
                {stabilityText}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );

  const result = (
    <p>
      By computing zeros and poles of simple transfer functions and examining the magnitudes of the
      poles, students can relate algebraic coefficients of H(z) to qualitative behavior of
      discrete-time systems, particularly stability.
    </p>
  );

  return (
    <ExperimentLayout
      title="DTSP Experiment 1: Pole–Zero Analysis"
      subtitle="Enter simple transfer-function coefficients to visualize zeros, poles, and basic stability."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}

