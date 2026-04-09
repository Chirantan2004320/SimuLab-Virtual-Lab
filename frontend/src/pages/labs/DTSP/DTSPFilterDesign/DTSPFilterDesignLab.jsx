import React, { useState } from "react";
import "../../../Lab.css";

import DTSPFilterDesignOverview from "./DTSPFilterDesignOverview";
import DTSPFilterDesignSimulation from "./DTSPFilterDesignSimulation";
import DTSPFilterDesignGraphs from "./DTSPFilterDesignGraphs";
import DTSPFilterDesignQuiz from "./DTSPFilterDesignQuiz";
import DTSPFilterDesignCoding from "./DTSPFilterDesignCoding";

function formatNumber(value, digits = 4) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

export default function DTSPFilterDesignLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [filterType, setFilterType] = useState("lowpass");
  const [cutoff, setCutoff] = useState(0.3);
  const [length, setLength] = useState(11);
  const [windowType, setWindowType] = useState("hamming");

  const [impulse, setImpulse] = useState([]);
  const [frequency, setFrequency] = useState([]);
  const [inputSignal, setInputSignal] = useState([]);
  const [outputSignal, setOutputSignal] = useState([]);
  const [experimentRun, setExperimentRun] = useState(false);

  const generateFilter = () => {
    const N = length;
    const M = (N - 1) / 2;
    const h = [];

    for (let n = 0; n < N; n++) {
      const k = n - M;
      let val;

      if (k === 0) {
        val = 2 * cutoff;
      } else {
        val = Math.sin(2 * Math.PI * cutoff * k) / (Math.PI * k);
      }

      if (filterType === "highpass") {
        val = (n === M ? 1 : 0) - val;
      }

      let w = 1;
      if (windowType === "hamming") {
        w = 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1));
      } else if (windowType === "hanning") {
        w = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (N - 1));
      }

      h.push(val * w);
    }

    setImpulse(h);

    const freq = [];
    for (let i = 0; i <= 100; i++) {
      const w = (Math.PI * i) / 100;
      let re = 0;
      let im = 0;

      for (let n = 0; n < N; n++) {
        re += h[n] * Math.cos(w * n);
        im -= h[n] * Math.sin(w * n);
      }

      freq.push({
        w: (i / 100).toFixed(2),
        mag: Math.sqrt(re * re + im * im)
      });
    }

    setFrequency(freq);

    const signal = [];
    const output = [];

    for (let n = 0; n < 100; n++) {
      const x =
        Math.sin(2 * Math.PI * 0.1 * n) +
        0.6 * Math.sin(2 * Math.PI * 0.4 * n);

      signal.push({ n, value: x });

      let y = 0;
      for (let k = 0; k < N; k++) {
        if (n - k >= 0) {
          const sample =
            Math.sin(2 * Math.PI * 0.1 * (n - k)) +
            0.6 * Math.sin(2 * Math.PI * 0.4 * (n - k));
          y += h[k] * sample;
        }
      }

      output.push({ n, value: y });
    }

    setInputSignal(signal);
    setOutputSignal(output);
    setExperimentRun(true);
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: FIR Filter Design</h1>

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
          {activeSection === "overview" && <DTSPFilterDesignOverview />}

          {activeSection === "simulation" && (
            <DTSPFilterDesignSimulation
              filterType={filterType}
              setFilterType={setFilterType}
              cutoff={cutoff}
              setCutoff={setCutoff}
              length={length}
              setLength={setLength}
              windowType={windowType}
              setWindowType={setWindowType}
              generateFilter={generateFilter}
              impulse={impulse}
              formatNumber={formatNumber}
            />
          )}

          {activeSection === "graphs" && (
            <DTSPFilterDesignGraphs
              impulse={impulse}
              frequency={frequency}
              inputSignal={inputSignal}
              outputSignal={outputSignal}
            />
          )}

          {activeSection === "quiz" && (
            <DTSPFilterDesignQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DTSPFilterDesignCoding />}
        </main>
      </div>
    </div>
  );
}