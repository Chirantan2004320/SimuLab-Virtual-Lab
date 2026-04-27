import React, { useMemo, useState } from "react";
import "../../../SortingLab.css";
import {
  BookOpen,
  PlayCircle,
  CircuitBoard,
  ListChecks,
  Table2,
  Brain,
  FileCode2,
} from "lucide-react";

import TrafficLightOverview from "./TrafficLightOverview";
import TrafficLightSimulation from "./TrafficLightSimulation";
import TrafficLightCircuits from "./TrafficLightCircuits";
import TrafficLightWorking from "./TrafficLightWorking";
import TrafficLightStateTable from "./TrafficLightStateTable";
import TrafficLightQuiz from "./TrafficLightQuiz";
import TrafficLightDesignPractice from "./TrafficLightDesignPractice";

const simulabLogo = "/assets/logo.png";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "working", label: "Working", icon: ListChecks },
  { key: "state table", label: "State Table", icon: Table2 },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "design practice", label: "Design Practice", icon: FileCode2 }
];

export default function TrafficLightLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed] = useState(false);

  const [state, setState] = useState("RED");
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const timings = {
      RED: 5000,
      GREEN: 5000,
      YELLOW: 2000
    };

    return {
      state,
      isRunning,
      cycle,
      delay: timings[state],
      note: isRunning
        ? `System is in ${state} state. It will change after ${timings[state]} ms.`
        : "System is paused. Start simulation to run traffic cycle."
    };
  }, [state, isRunning, cycle]);

  return (
    <div className="er-shell">
      <aside className={`er-left-rail ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="er-brand">
          <div className="er-brand-logo">
            <img src={simulabLogo} alt="SimuLab" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <div className="er-brand-title">SimuLab</div>
              <div className="er-brand-subtitle">Microcontroller Lab</div>
            </div>
          )}
        </div>

        <div className="er-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`er-nav-item ${activeSection === item.key ? "active" : ""}`}
                onClick={() => setActiveSection(item.key)}
              >
                <Icon size={18} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <h1 className="er-page-title">Traffic Light Controller</h1>
          <p className="er-page-subtitle">
            Simulate a real-world traffic signal using microcontroller timing and GPIO sequencing 🚦
          </p>
        </div>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && <TrafficLightOverview analysis={analysis} />}

            {activeSection === "simulation" && (
              <TrafficLightSimulation
                state={state}
                setState={setState}
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                cycle={cycle}
                setCycle={setCycle}
                analysis={analysis}
                setExperimentRun={setExperimentRun}
              />
            )}

            {activeSection === "circuits" && <TrafficLightCircuits analysis={analysis} />}
            {activeSection === "working" && <TrafficLightWorking analysis={analysis} />}
            {activeSection === "state table" && <TrafficLightStateTable analysis={analysis} />}
            {activeSection === "quiz" && <TrafficLightQuiz experimentRun={experimentRun} />}
            {activeSection === "design practice" && <TrafficLightDesignPractice analysis={analysis} />}
          </section>
        </div>
      </main>
    </div>
  );
}