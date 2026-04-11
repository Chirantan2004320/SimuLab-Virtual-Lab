import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DVLSICMOSInverterLayoutOverview from "./DVLSICMOSInverterLayoutOverview";
import DVLSICMOSInverterLayoutSimulation from "./DVLSICMOSInverterLayoutSimulation";
import DVLSICMOSInverterLayoutStickDiagram from "./DVLSICMOSInverterLayoutStickDiagram";
import DVLSICMOSInverterLayoutView from "./DVLSICMOSInverterLayoutView";
import DVLSICMOSInverterLayoutQuiz from "./DVLSICMOSInverterLayoutQuiz";
import DVLSICMOSInverterLayoutCoding from "./DVLSICMOSInverterLayoutCoding";

export default function DVLSICMOSInverterLayoutLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [polyWidth, setPolyWidth] = useState(2);
  const [metalWidth, setMetalWidth] = useState(3);
  const [contactSize, setContactSize] = useState(2);
  const [spacing, setSpacing] = useState(2);
  const [lambdaValue, setLambdaValue] = useState(1);

  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const minRules = {
      polyWidth: 2,
      metalWidth: 3,
      contactSize: 2,
      spacing: 2
    };

    const checks = [
      {
        name: "Poly Width",
        actual: polyWidth,
        required: minRules.polyWidth,
        pass: polyWidth >= minRules.polyWidth
      },
      {
        name: "Metal Width",
        actual: metalWidth,
        required: minRules.metalWidth,
        pass: metalWidth >= minRules.metalWidth
      },
      {
        name: "Contact Size",
        actual: contactSize,
        required: minRules.contactSize,
        pass: contactSize >= minRules.contactSize
      },
      {
        name: "Spacing",
        actual: spacing,
        required: minRules.spacing,
        pass: spacing >= minRules.spacing
      }
    ];

    const violations = checks.filter((c) => !c.pass);
    const allPass = violations.length === 0;

    let summary = "";
    if (allPass) {
      summary =
        "The CMOS inverter layout satisfies the simplified educational layout constraints.";
    } else {
      summary =
        "The layout violates one or more simplified design rules. Increase widths or spacing to correct it.";
    }

    return {
      checks,
      violations,
      allPass,
      summary
    };
  }, [polyWidth, metalWidth, contactSize, spacing]);

  return (
    <div className="lab-page">
      <h1>SimuLab: CMOS Inverter Layout</h1>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
          {["overview", "simulation", "stick diagram", "layout view", "quiz", "coding"].map(
            (sec) => (
              <button
                key={sec}
                className={`sorting-sidebar-item ${activeSection === sec ? "active" : ""}`}
                onClick={() => setActiveSection(sec)}
              >
                {sec.toUpperCase()}
              </button>
            )
          )}
        </aside>

        <main className="sorting-content">
          {activeSection === "overview" && <DVLSICMOSInverterLayoutOverview />}

          {activeSection === "simulation" && (
            <DVLSICMOSInverterLayoutSimulation
              polyWidth={polyWidth}
              setPolyWidth={setPolyWidth}
              metalWidth={metalWidth}
              setMetalWidth={setMetalWidth}
              contactSize={contactSize}
              setContactSize={setContactSize}
              spacing={spacing}
              setSpacing={setSpacing}
              lambdaValue={lambdaValue}
              setLambdaValue={setLambdaValue}
              analysis={analysis}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "stick diagram" && (
            <DVLSICMOSInverterLayoutStickDiagram
              polyWidth={polyWidth}
              metalWidth={metalWidth}
              contactSize={contactSize}
              spacing={spacing}
              lambdaValue={lambdaValue}
            />
          )}

          {activeSection === "layout view" && (
            <DVLSICMOSInverterLayoutView
              polyWidth={polyWidth}
              metalWidth={metalWidth}
              contactSize={contactSize}
              spacing={spacing}
              lambdaValue={lambdaValue}
              analysis={analysis}
            />
          )}

          {activeSection === "quiz" && (
            <DVLSICMOSInverterLayoutQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DVLSICMOSInverterLayoutCoding />}
        </main>
      </div>
    </div>
  );
}