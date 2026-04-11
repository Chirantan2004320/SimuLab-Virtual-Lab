import React, { useMemo, useState } from "react";
import "../../../Lab.css";

import DVLSILambdaRulesMicrowindOverview from "./DVLSILambdaRulesMicrowindOverview";
import DVLSILambdaRulesMicrowindSimulation from "./DVLSILambdaRulesMicrowindSimulation";
import DVLSILambdaRulesMicrowindLayout from "./DVLSILambdaRulesMicrowindLayout";
import DVLSILambdaRulesMicrowindRulesCheck from "./DVLSILambdaRulesMicrowindRulesCheck";
import DVLSILambdaRulesMicrowindQuiz from "./DVLSILambdaRulesMicrowindQuiz";
import DVLSILambdaRulesMicrowindCoding from "./DVLSILambdaRulesMicrowindCoding";

function formatNumber(value, digits = 2) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return v.toFixed(digits);
}

export default function DVLSILambdaRulesMicrowindLab() {
  const [activeSection, setActiveSection] = useState("overview");

  const [lambdaValue, setLambdaValue] = useState(1);
  const [polyWidth, setPolyWidth] = useState(2);
  const [metalWidth, setMetalWidth] = useState(3);
  const [diffSpacing, setDiffSpacing] = useState(2);
  const [polySpacing, setPolySpacing] = useState(2);
  const [contactSize, setContactSize] = useState(2);

  const [experimentRun, setExperimentRun] = useState(false);

  const analysis = useMemo(() => {
    const rules = {
      minPolyWidth: 2,
      minMetalWidth: 3,
      minDiffSpacing: 2,
      minPolySpacing: 2,
      minContactSize: 2
    };

    const checks = [
      {
        name: "Poly Width",
        actual: polyWidth,
        required: rules.minPolyWidth,
        pass: polyWidth >= rules.minPolyWidth
      },
      {
        name: "Metal Width",
        actual: metalWidth,
        required: rules.minMetalWidth,
        pass: metalWidth >= rules.minMetalWidth
      },
      {
        name: "Diffusion Spacing",
        actual: diffSpacing,
        required: rules.minDiffSpacing,
        pass: diffSpacing >= rules.minDiffSpacing
      },
      {
        name: "Poly Spacing",
        actual: polySpacing,
        required: rules.minPolySpacing,
        pass: polySpacing >= rules.minPolySpacing
      },
      {
        name: "Contact Size",
        actual: contactSize,
        required: rules.minContactSize,
        pass: contactSize >= rules.minContactSize
      }
    ];

    const violations = checks.filter((item) => !item.pass);
    const allPass = violations.length === 0;

    let summary = "";
    if (allPass) {
      summary =
        "All selected dimensions satisfy the simplified lambda design rules. The layout is DRC-safe in this educational model.";
    } else {
      summary =
        "Some dimensions violate the simplified lambda rules. Increase the failing widths or spacings to remove DRC-style errors.";
    }

    return {
      rules,
      checks,
      violations,
      allPass,
      summary
    };
  }, [polyWidth, metalWidth, diffSpacing, polySpacing, contactSize]);

  return (
    <div className="lab-page">
      <h1>SimuLab: Lambda Rules and Microwind</h1>

      <div className="sorting-lab-layout">
        <aside className="sorting-sidebar">
          {["overview", "simulation", "layout", "rules check", "quiz", "coding"].map((sec) => (
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
          {activeSection === "overview" && <DVLSILambdaRulesMicrowindOverview />}

          {activeSection === "simulation" && (
            <DVLSILambdaRulesMicrowindSimulation
              lambdaValue={lambdaValue}
              setLambdaValue={setLambdaValue}
              polyWidth={polyWidth}
              setPolyWidth={setPolyWidth}
              metalWidth={metalWidth}
              setMetalWidth={setMetalWidth}
              diffSpacing={diffSpacing}
              setDiffSpacing={setDiffSpacing}
              polySpacing={polySpacing}
              setPolySpacing={setPolySpacing}
              contactSize={contactSize}
              setContactSize={setContactSize}
              analysis={analysis}
              formatNumber={formatNumber}
              setExperimentRun={setExperimentRun}
            />
          )}

          {activeSection === "layout" && (
            <DVLSILambdaRulesMicrowindLayout
              lambdaValue={lambdaValue}
              polyWidth={polyWidth}
              metalWidth={metalWidth}
              diffSpacing={diffSpacing}
              polySpacing={polySpacing}
              contactSize={contactSize}
              analysis={analysis}
            />
          )}

          {activeSection === "rules check" && (
            <DVLSILambdaRulesMicrowindRulesCheck
              analysis={analysis}
              lambdaValue={lambdaValue}
            />
          )}

          {activeSection === "quiz" && (
            <DVLSILambdaRulesMicrowindQuiz experimentRun={experimentRun} />
          )}

          {activeSection === "coding" && <DVLSILambdaRulesMicrowindCoding />}
        </main>
      </div>
    </div>
  );
}