import React, { useState } from "react";
import "../../../Lab.css";

import DTSPPoleZeroAnalysisOverview from "./DTSPPoleZeroAnalysisOverview.jsx";
import DTSPPoleZeroAnalysisSimulation from "./DTSPPoleZeroAnalysisSimulation.jsx";
import DTSPPoleZeroAnalysisGraphs from "./DTSPPoleZeroAnalysisGraphs.jsx";
import DTSPPoleZeroAnalysisQuiz from "./DTSPPoleZeroAnalysisQuiz.jsx";
import DTSPPoleZeroAnalysisCoding from "./DTSPPoleZeroAnalysisCoding.jsx";

import {
  parseCoefficients,
  computeRoots,
  magnitude
} from "../../../../utils/dtsp/polezero"; // we’ll create this next

export default function DTSPPoleZeroAnalysisLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [numText, setNumText] = useState("1, 0, -0.5");
  const [denText, setDenText] = useState("1, -0.8");

  const [zeros, setZeros] = useState([]);
  const [poles, setPoles] = useState([]);
  const [stabilityText, setStabilityText] = useState("");
  const [error, setError] = useState("");
  const [experimentRun, setExperimentRun] = useState(false);

  const handleAnalyze = () => {
    setError("");

    const num = parseCoefficients(numText);
    const den = parseCoefficients(denText);

    if (!num || !den) {
      setError("Invalid coefficients.");
      return;
    }

    const z = computeRoots(num);
    const p = computeRoots(den);

    setZeros(z.roots);
    setPoles(p.roots);

    if (!p.roots.length) return;

    const mags = p.roots.map(magnitude);

    if (mags.every((m) => m < 1)) {
      setStabilityText("Stable system (all poles inside unit circle)");
    } else if (mags.some((m) => m > 1)) {
      setStabilityText("Unstable system (pole outside unit circle)");
    } else {
      setStabilityText("Marginally stable system");
    }

    setExperimentRun(true);
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Pole-Zero Analysis</h1>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
          {["overview", "simulation", "graphs", "quiz", "coding"].map((sec) => (
            <button
              key={sec}
              className={`sorting-sidebar-item ${activeSection === sec ? "active" : ""}`}
              onClick={() => setActiveSection(sec)}
            >
              {sec.toUpperCase()}
            </button>
          ))}
        </aside>

        <main className="sorting-content">
          {activeSection === "overview" && <DTSPPoleZeroAnalysisOverview />}

          {activeSection === "simulation" && (
            <DTSPPoleZeroAnalysisSimulation
              numText={numText}
              setNumText={setNumText}
              denText={denText}
              setDenText={setDenText}
              handleAnalyze={handleAnalyze}
              zeros={zeros}
              poles={poles}
              stabilityText={stabilityText}
              error={error}
            />
          )}

          {activeSection === "graphs" && (
            <DTSPPoleZeroAnalysisGraphs zeros={zeros} poles={poles} />
          )}

          {activeSection === "quiz" && (
            <DTSPPoleZeroAnalysisQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DTSPPoleZeroAnalysisCoding />}
        </main>
      </div>
    </div>
  );
}