import React, { useMemo, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  LayoutGrid,
  CheckSquare,
  Brain,
  FileCode2,
  ChevronsLeft,
  Cpu
} from "lucide-react";

import "../../../Lab.css";
import "../../../SortingLab.css";

import MarkCompleteButton from "../../../../components/MarkCompleteButton";
import SimuLabLogo from "../../../../components/SimuLabLogo";
import { saveQuizResult } from "../../../../API/progressApi";

import DVLSICMOSInverterLayoutOverview from "./DVLSICMOSInverterLayoutOverview";
import DVLSICMOSInverterLayoutSimulation from "./DVLSICMOSInverterLayoutSimulation";
import DVLSICMOSInverterLayoutStickDiagram from "./DVLSICMOSInverterLayoutStickDiagram";
import DVLSICMOSInverterLayoutView from "./DVLSICMOSInverterLayoutView";
import DVLSICMOSInverterLayoutQuiz from "./DVLSICMOSInverterLayoutQuiz";
import DVLSICMOSInverterLayoutCoding from "./DVLSICMOSInverterLayoutCoding";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "stick diagram", label: "Stick Diagram", icon: LayoutGrid },
  { key: "layout view", label: "Layout View", icon: CheckSquare },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

const quizQuestions = [
  {
    q: "In a CMOS inverter layout, the pMOS transistor is usually placed:",
    options: [
      "Below the nMOS region",
      "Above the nMOS region",
      "Inside the contact only",
      "Not used in layout"
    ],
    correct: 1
  },
  {
    q: "The common polysilicon line in a CMOS inverter layout represents:",
    options: ["Output node", "Input gate", "Ground line", "Well contact"],
    correct: 1
  },
  {
    q: "The output node in a CMOS inverter layout is formed by:",
    options: [
      "Joining the transistor drains",
      "Joining only the sources",
      "Removing contacts",
      "Connecting VDD and GND directly"
    ],
    correct: 0
  },
  {
    q: "Stick diagrams are mainly used to:",
    options: [
      "Show exact fabrication masks only",
      "Abstract layout topology and connectivity",
      "Replace circuit equations",
      "Measure threshold voltage"
    ],
    correct: 1
  },
  {
    q: "If spacing is below the minimum allowed value, the layout may suffer from:",
    options: [
      "No issue at all",
      "Possible DRC violation",
      "Automatic gain increase",
      "Lower lambda value"
    ],
    correct: 1
  }
];

function formatNumber(value, digits = 2) {
  const v = Number(value);

  if (!Number.isFinite(v)) return "0";

  return v.toFixed(digits);
}

export default function DVLSICMOSInverterLayoutLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [polyWidth, setPolyWidth] = useState(2);
  const [metalWidth, setMetalWidth] = useState(3);
  const [contactSize, setContactSize] = useState(2);
  const [spacing, setSpacing] = useState(2);
  const [lambdaValue, setLambdaValue] = useState(1);

  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );

  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

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

  const handleQuizAnswer = (index, value) => {
    const updated = [...quizAnswers];
    updated[index] = value;
    setQuizAnswers(updated);
  };

  const submitQuiz = async () => {
    let total = 0;

    quizQuestions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        total++;
      }
    });

    setQuizScore(total);
    setQuizSubmitted(true);
    setQuizSaveStatus("Saving quiz result...");

    try {
      await saveQuizResult({
        labSlug: "dvlsi",
        experimentSlug: "cmos-inverter-layout",
        correctAnswers: total,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("CMOS Layout quiz save failed:", error);

      setQuizSaveStatus(
        "Quiz submitted, but backend save failed."
      );
    }
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizSaveStatus("");
  };

  const progressPercent =
    activeSection === "overview"
      ? 18
      : activeSection === "simulation"
      ? 40
      : activeSection === "stick diagram"
      ? 60
      : activeSection === "layout view"
      ? 78
      : activeSection === "quiz"
      ? 90
      : 96;

  return (
    <div className="er-shell">
      <aside className={`er-left-rail ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="er-brand">
          <div className="er-brand-logo simulab-sidebar-logo">
            <SimuLabLogo size={58} showText={false} variant="default" />
          </div>

          {!sidebarCollapsed && (
            <div>
              <div className="er-brand-title">SimuLab</div>
              <div className="er-brand-subtitle">DVLSI Lab</div>
            </div>
          )}
        </div>

        <div className="er-collapse-wrap">
          <button
            type="button"
            className={`er-collapse-btn ${
              sidebarCollapsed ? "collapsed" : ""
            }`}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <ChevronsLeft size={18} />
          </button>
        </div>

        <div className="er-nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                className={`er-nav-item ${
                  activeSection === item.key ? "active" : ""
                }`}
                onClick={() => setActiveSection(item.key)}
                title={item.label}
              >
                <Icon size={18} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {!sidebarCollapsed && (
          <div className="er-progress-card">
            <div className="er-progress-title">Your Progress</div>

            <div className="er-progress-ring">
              <div
                className="er-progress-circle"
                style={{
                  background: `conic-gradient(#4da8ff ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}% 100%)`
                }}
              >
                <div className="er-progress-inner">
                  <div className="er-progress-value">
                    {progressPercent}%
                  </div>

                  <div className="er-progress-text">
                    Complete
                  </div>
                </div>
              </div>
            </div>

            <div className="er-last-activity">
              <div className="er-last-activity-label">
                Last Activity
              </div>

              <div className="er-last-activity-row">
                <span>
                  {sidebarItems.find(
                    (i) => i.key === activeSection
                  )?.label || "CMOS Layout"}
                </span>

                <span className="dot-live">Just now</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">
              CMOS Inverter Layout
            </h1>

            <p className="er-page-subtitle">
              Learn CMOS inverter layout topology, stick diagrams,
              lambda rules, and layout validation concepts.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Layout Configuration</h2>

              <p>
                Adjust layout widths, spacing, contact size,
                and lambda scaling to observe layout compliance.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>

              <div>
                <strong>
                  {analysis.allPass ? "DRC PASS" : "DRC FAIL"}
                </strong>

                <span>
                  {analysis.allPass
                    ? "Layout is rule-compliant."
                    : `${analysis.violations.length} violation(s) detected.`}
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">
                Lambda Value
              </label>

              <div
                className="sorting-select"
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                λ = {formatNumber(lambdaValue, 1)}
              </div>
            </div>

            <div>
              <label className="sorting-label">
                DRC Status
              </label>

              <div
                className="sorting-select"
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {analysis.allPass ? "PASS" : "FAIL"}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">
              Poly = {polyWidth}λ
            </button>

            <button className="er-chip active">
              Metal = {metalWidth}λ
            </button>

            <button className="er-chip active">
              Contact = {contactSize}λ
            </button>

            <button className="er-chip active">
              Spacing = {spacing}λ
            </button>

            <button className="er-chip active">
              λ = {lambdaValue}
            </button>

            <button
              className={`er-chip ${
                experimentRun ? "active" : ""
              }`}
            >
              {experimentRun
                ? "Simulation Run"
                : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dvlsi"
              experimentSlug="cmos-inverter-layout"
              points={10}
              onComplete={() => {
                window.dispatchEvent(
                  new Event("progress-updated")
                );
              }}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DVLSICMOSInverterLayoutOverview />
            )}

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
              <DVLSICMOSInverterLayoutQuiz
                experimentRun={experimentRun}
                questions={quizQuestions}
                answers={quizAnswers}
                submitted={quizSubmitted}
                score={quizScore}
                quizSaveStatus={quizSaveStatus}
                handleAnswer={handleQuizAnswer}
                submitQuiz={submitQuiz}
                redoQuiz={redoQuiz}
              />
            )}

            {activeSection === "coding" && (
              <DVLSICMOSInverterLayoutCoding
                analysis={analysis}
                polyWidth={polyWidth}
                metalWidth={metalWidth}
                contactSize={contactSize}
                spacing={spacing}
                lambdaValue={lambdaValue}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}