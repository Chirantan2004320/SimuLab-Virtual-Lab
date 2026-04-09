import React, { useState } from "react";
import "../../../Lab.css";

import Overview from "./DTSPAliasingOverview.jsx";
import Simulation from "./DTSPAliasingSimulation.jsx";
import Graphs from "./DTSPAliasingGraphs.jsx";
import Quiz from "./DTSPAliasingQuiz.jsx";
import Coding from "./DTSPAliasingCoding.jsx";

function estimateAliasFrequency(f, fs) {
  if (fs <= 0) return f;

  let alias = f % fs;
  if (alias > fs / 2) {
    alias = fs - alias;
  }

  return Math.abs(alias);
}

export default function DTSPAliasingLab() {
  const [active, setActive] = useState("overview");

  const [signalFreq, setSignalFreq] = useState(2);
  const [samplingFreq, setSamplingFreq] = useState(10);

  const [continuous, setContinuous] = useState([]);
  const [samples, setSamples] = useState([]);
  const [aliasedWave, setAliasedWave] = useState([]);
  const [aliasFreq, setAliasFreq] = useState(null);
  const [isAliasing, setIsAliasing] = useState(false);
  const [nyquistRate, setNyquistRate] = useState(4);

  const generateSignal = () => {
    const cont = [];
    const samp = [];
    const aliasWave = [];

    const duration = 1;
    const step = 0.01;

    const nyquist = 2 * signalFreq;
    const aliasingNow = samplingFreq < nyquist;
    const observedAliasFreq = estimateAliasFrequency(signalFreq, samplingFreq);

    for (let t = 0; t <= duration + 1e-9; t += step) {
      cont.push({
        t: Number(t.toFixed(3)),
        value: Math.sin(2 * Math.PI * signalFreq * t)
      });

      aliasWave.push({
        t: Number(t.toFixed(3)),
        value: Math.sin(2 * Math.PI * observedAliasFreq * t)
      });
    }

    const Ts = 1 / samplingFreq;
    for (let t = 0; t <= duration + 1e-9; t += Ts) {
      samp.push({
        t: Number(t.toFixed(3)),
        value: Math.sin(2 * Math.PI * signalFreq * t)
      });
    }

    setContinuous(cont);
    setSamples(samp);
    setAliasedWave(aliasWave);
    setAliasFreq(observedAliasFreq);
    setIsAliasing(aliasingNow);
    setNyquistRate(nyquist);
  };

  return (
    <div className="lab-page">
      <h1>SimuLab: Sampling & Aliasing</h1>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
          {["overview", "simulation", "graphs", "quiz", "coding"].map((tab) => (
            <button
              key={tab}
              className={`sorting-sidebar-item ${active === tab ? "active" : ""}`}
              onClick={() => setActive(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </aside>

        <main className="sorting-content">
          {active === "overview" && <Overview />}

          {active === "simulation" && (
            <Simulation
              signalFreq={signalFreq}
              setSignalFreq={setSignalFreq}
              samplingFreq={samplingFreq}
              setSamplingFreq={setSamplingFreq}
              generateSignal={generateSignal}
              aliasFreq={aliasFreq}
              isAliasing={isAliasing}
              nyquistRate={nyquistRate}
            />
          )}

          {active === "graphs" && (
            <Graphs
              continuous={continuous}
              samples={samples}
              aliasedWave={aliasedWave}
              aliasFreq={aliasFreq}
              isAliasing={isAliasing}
              signalFreq={signalFreq}
              samplingFreq={samplingFreq}
              nyquistRate={nyquistRate}
            />
          )}

          {active === "quiz" && <Quiz />}
          {active === "coding" && <Coding />}
        </main>
      </div>
    </div>
  );
}