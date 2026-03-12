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

function analyzeSymmetry(h) {
  const N = h.length;
  if (N === 0) return { symmetry: "none", explanation: "No coefficients entered." };

  const tol = 1e-6;
  let symmetric = true;
  let antisymmetric = true;

  for (let n = 0; n < Math.floor(N / 2); n++) {
    const a = h[n];
    const b = h[N - 1 - n];
    if (Math.abs(a - b) > tol) {
      symmetric = false;
    }
    if (Math.abs(a + b) > tol) {
      antisymmetric = false;
    }
  }

   // For antisymmetric sequences with odd length, the center coefficient must be approximately zero.
   if (antisymmetric && N % 2 === 1) {
     const center = h[(N - 1) / 2];
     if (Math.abs(center) > tol) {
       antisymmetric = false;
     }
   }

  if (symmetric && !antisymmetric) {
    return { symmetry: "symmetric", explanation: "h[n] ≈ h[N-1-n] for all n." };
  }
  if (antisymmetric && !symmetric) {
    return { symmetry: "antisymmetric", explanation: "h[n] ≈ -h[N-1-n] for all n." };
  }
  if (symmetric && antisymmetric) {
    return {
      symmetry: "trivial",
      explanation: "All coefficients are approximately zero; sequence is both symmetric and antisymmetric in a trivial sense."
    };
  }
  return {
    symmetry: "none",
    explanation: "The sequence is neither symmetric nor antisymmetric around its center."
  };
}

function classifyLinearPhase(h) {
  const N = h.length;
  if (N === 0) {
    return {
      isLinearPhase: false,
      type: "N/A",
      explanation: "No coefficients provided to analyze."
    };
  }

  const { symmetry } = analyzeSymmetry(h);
  if (symmetry === "none") {
    return {
      isLinearPhase: false,
      type: "Not linear phase",
      explanation: "The impulse response is neither symmetric nor antisymmetric, so it does not satisfy standard linear-phase FIR conditions."
    };
  }

  // For real-coefficient FIR filters, symmetry or antisymmetry is sufficient for linear phase.
  let type = "Unknown";
  let explanation = "";

  if (symmetry === "symmetric" || symmetry === "trivial") {
    if (N % 2 === 1) {
      type = "Type I";
      explanation =
        "Symmetric impulse response with odd length (Type I). This is the most common linear-phase FIR structure.";
    } else {
      type = "Type II";
      explanation =
        "Symmetric impulse response with even length (Type II). This structure cannot realize exactly zero-phase at Nyquist.";
    }
  } else if (symmetry === "antisymmetric") {
    if (N % 2 === 1) {
      type = "Type III";
      explanation =
        "Antisymmetric impulse response with odd length (Type III). Magnitude response is zero at DC and Nyquist.";
    } else {
      type = "Type IV";
      explanation =
        "Antisymmetric impulse response with even length (Type IV). Magnitude response is zero at DC.";
    }
  }

  return {
    isLinearPhase: true,
    type,
    explanation
  };
}

function formatSequence(h) {
  return h.map((v, i) => (i === 0 ? v : `, ${v}`));
}

export default function DTSPLinearPhaseFIRAnalysis() {
  const [coeffText, setCoeffText] = useState("1, 2, 3, 2, 1");
  const [coeffs, setCoeffs] = useState([]);
  const [symmetryInfo, setSymmetryInfo] = useState({ symmetry: "none", explanation: "" });
  const [linearPhaseInfo, setLinearPhaseInfo] = useState({
    isLinearPhase: false,
    type: "N/A",
    explanation: ""
  });
  const [error, setError] = useState("");

  const handleAnalyze = () => {
    setError("");

    const h = parseCoefficients(coeffText);
    if (!h) {
      setError("Please enter valid numeric FIR coefficients as comma-separated values.");
      setCoeffs([]);
      setSymmetryInfo({ symmetry: "none", explanation: "" });
      setLinearPhaseInfo({ isLinearPhase: false, type: "N/A", explanation: "" });
      return;
    }

    const sym = analyzeSymmetry(h);
    const lin = classifyLinearPhase(h);

    setCoeffs(h);
    setSymmetryInfo(sym);
    setLinearPhaseInfo(lin);
  };

  const aim = (
    <p>
      To analyze the impulse response of a finite impulse response (FIR) filter, determine whether
      it has linear phase, and classify it into one of the standard FIR linear-phase types when
      applicable.
    </p>
  );

  const theory = (
    <>
      <p>
        Many FIR filters are designed to have linear phase, meaning that the phase response is a
        straight line with frequency. This preserves the waveform shape of signals passing through
        the filter (apart from a pure delay).
      </p>
      <p>
        For real-coefficient FIR filters, linear phase is obtained when the impulse response is
        either symmetric or antisymmetric around its center. Based on the length of the impulse
        response and the type of symmetry, FIR filters are classified into four types (Type I–IV).
      </p>
      <p>
        Type I and II filters have symmetric impulse responses (even symmetry), while Type III and
        IV filters have antisymmetric impulse responses (odd symmetry). The parity of the length
        (odd or even) determines which specific type applies.
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Enter the FIR filter coefficients as comma-separated numbers (impulse response h[n]).</li>
      <li>Click on <strong>Analyze FIR</strong>.</li>
      <li>Observe whether the sequence is symmetric, antisymmetric, or neither.</li>
      <li>
        Check if the filter satisfies linear-phase conditions and see which FIR type (I–IV) it
        belongs to when applicable.
      </li>
      <li>Use the explanation text to understand the relationship between symmetry and filter type.</li>
    </ol>
  );

  const simulation = (
    <>
      <div className="lab-controls" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        <label className="lab-label" style={{ flex: 1, minWidth: 260 }}>
          FIR coefficients h[n]:
          <input
            className="lab-input"
            value={coeffText}
            onChange={(e) => setCoeffText(e.target.value)}
            placeholder="e.g. 1, 2, 3, 2, 1"
          />
        </label>
      </div>

      <button className="btn primary" type="button" onClick={handleAnalyze}>
        Analyze FIR
      </button>

      {error && (
        <div className="stack-warning show" style={{ marginTop: "1rem" }}>
          {error}
        </div>
      )}

      {(coeffs.length > 0 || symmetryInfo.explanation || linearPhaseInfo.explanation) && (
        <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
          <div className="card" style={{ padding: "1rem" }}>
            <h3>Impulse Response</h3>
            {coeffs.length > 0 ? (
              <p style={{ marginTop: "0.5rem" }}>
                <strong>h[n]: </strong>
                <span className="lab-output-value">{formatSequence(coeffs)}</span>
              </p>
            ) : (
              <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
                No coefficients analyzed yet.
              </p>
            )}
          </div>

          <div className="card" style={{ padding: "1rem" }}>
            <h3>Symmetry Analysis</h3>
            <p style={{ marginTop: "0.5rem", color: "#e5e7eb", fontSize: "0.95rem" }}>
              <strong>Classification:</strong>{" "}
              <span className="lab-output-value">
                {symmetryInfo.symmetry === "symmetric" && "Symmetric"}
                {symmetryInfo.symmetry === "antisymmetric" && "Antisymmetric"}
                {symmetryInfo.symmetry === "trivial" && "Trivially symmetric/antisymmetric"}
                {symmetryInfo.symmetry === "none" && "Neither symmetric nor antisymmetric"}
              </span>
            </p>
            {symmetryInfo.explanation && (
              <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
                {symmetryInfo.explanation}
              </p>
            )}
          </div>

          <div className="card" style={{ padding: "1rem" }}>
            <h3>Linear Phase Classification</h3>
            <p style={{ marginTop: "0.5rem", color: "#e5e7eb", fontSize: "0.95rem" }}>
              <strong>Linear phase:</strong>{" "}
              <span className="lab-output-value">
                {linearPhaseInfo.isLinearPhase ? "Yes" : "No"}
              </span>
            </p>
            <p style={{ marginTop: "0.5rem", color: "#e5e7eb", fontSize: "0.95rem" }}>
              <strong>FIR Type:</strong>{" "}
              <span className="lab-output-value">{linearPhaseInfo.type}</span>
            </p>
            {linearPhaseInfo.explanation && (
              <p style={{ marginTop: "0.5rem", color: "#9ca3af", fontSize: "0.9rem" }}>
                {linearPhaseInfo.explanation}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );

  const result = (
    <p>
      This analysis links the shape of the FIR impulse response to its phase characteristics and
      filter type. By checking symmetry and length, students can quickly classify common linear-phase
      FIR designs into Types I–IV and understand how these structures preserve waveform shape.
    </p>
  );

  return (
    <ExperimentLayout
      title="DTSP Experiment 5: Linear Phase FIR Analysis"
      subtitle="Analyze FIR impulse responses for symmetry, linear phase, and standard FIR type classification."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}

