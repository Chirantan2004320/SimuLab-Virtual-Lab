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

import DVLSILambdaRulesMicrowindOverview from "./DVLSILambdaRulesMicrowindOverview";
import DVLSILambdaRulesMicrowindSimulation from "./DVLSILambdaRulesMicrowindSimulation";
import DVLSILambdaRulesMicrowindLayout from "./DVLSILambdaRulesMicrowindLayout";
import DVLSILambdaRulesMicrowindRulesCheck from "./DVLSILambdaRulesMicrowindRulesCheck";
import DVLSILambdaRulesMicrowindQuiz from "./DVLSILambdaRulesMicrowindQuiz";
import DVLSILambdaRulesMicrowindCoding from "./DVLSILambdaRulesMicrowindCoding";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "layout", label: "Layout", icon: LayoutGrid },
  { key: "rules check", label: "Rules Check", icon: CheckSquare },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

const quizQuestions = [
  {
    q: "What does lambda (λ) represent in lambda-based design rules?",
    options: [
      "A transistor current",
      "A scalable layout unit",
      "A supply voltage",
      "A logic level"
    ],
    correct: 1
  },
  {
    q: "Why are lambda rules useful?",
    options: [
      "They remove all DRC checks",
      "They make layouts process-scalable and easier to teach",
      "They replace transistors",
      "They reduce VDD automatically"
    ],
    correct: 1
  },
  {
    q: "If spacing is below the minimum rule, the likely result is:",
    options: [
      "No effect",
      "Possible fabrication violation or short",
      "Higher logic voltage only",
      "Infinite delay"
    ],
    correct: 1
  },
  {
    q: "Microwind is mainly associated with:",
    options: [
      "Layout visualization and learning",
      "Only operating systems",
      "Only database systems",
      "Signal compression"
    ],
    correct: 0
  },
  {
    q: "A contact in layout is used to:",
    options: [
      "Increase clock speed only",
      "Connect layers electrically",
      "Store memory bits",
      "Replace diffusion"
    ],
    correct: 1
  }
];

function formatNumber(value, digits = 2) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return v.toFixed(digits);
}

export default function DVLSILambdaRulesMicrowindLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [lambdaValue, setLambdaValue] = useState(1);
  const [polyWidth, setPolyWidth] = useState(2);
  const [metalWidth, setMetalWidth] = useState(3);
  const [diffSpacing, setDiffSpacing] = useState(2);
  const [polySpacing, setPolySpacing] = useState(2);
  const [contactSize, setContactSize] = useState(2);
  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

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

    return {
      rules,
      checks,
      violations,
      allPass,
      summary: allPass
        ? "All selected dimensions satisfy the simplified lambda design rules. The layout is DRC-safe in this educational model."
        : "Some dimensions violate the simplified lambda rules. Increase the failing widths or spacings to remove DRC-style errors."
    };
  }, [polyWidth, metalWidth, diffSpacing, polySpacing, contactSize]);

  const handleQuizAnswer = (index, value) => {
    const updated = [...quizAnswers];
    updated[index] = value;
    setQuizAnswers(updated);
  };

  const submitQuiz = async () => {
    let total = 0;

    quizQuestions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) total++;
    });

    setQuizScore(total);
    setQuizSubmitted(true);
    setQuizSaveStatus("Saving quiz result...");

    try {
      await saveQuizResult({
        labSlug: "dvlsi",
        experimentSlug: "lambda-rules-microwind",
        correctAnswers: total,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("Lambda Rules quiz save failed:", error);
      setQuizSaveStatus("Quiz submitted, but backend save failed.");
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
      : activeSection === "layout"
      ? 60
      : activeSection === "rules check"
      ? 78
      : activeSection === "quiz"
      ? 88
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
            className={`er-collapse-btn ${sidebarCollapsed ? "collapsed" : ""}`}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
                  <div className="er-progress-value">{progressPercent}%</div>
                  <div className="er-progress-text">Complete</div>
                </div>
              </div>
            </div>

            <div className="er-last-activity">
              <div className="er-last-activity-label">Last Activity</div>
              <div className="er-last-activity-row">
                <span>
                  {sidebarItems.find((i) => i.key === activeSection)?.label ||
                    "Lambda Rules"}
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
            <h1 className="er-page-title">Lambda Rules and Microwind</h1>
            <p className="er-page-subtitle">
              Learn scalable VLSI layout rules, visualize Microwind-style
              layers, and validate designs using DRC checks.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Experiment Configuration</h2>
              <p>
                Adjust lambda value, widths, spacings, and contact size to test
                layout rule compliance.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>{analysis.allPass ? "DRC PASS" : "DRC FAIL"}</strong>
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
              <label className="sorting-label">Lambda Value</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                λ = {formatNumber(lambdaValue, 1)}
              </div>
            </div>

            <div>
              <label className="sorting-label">DRC Status</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {analysis.allPass ? "PASS" : "FAIL"}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">Poly = {polyWidth}λ</button>
            <button className="er-chip active">Metal = {metalWidth}λ</button>
            <button className="er-chip active">
              Diff Spacing = {diffSpacing}λ
            </button>
            <button className="er-chip active">
              Poly Spacing = {polySpacing}λ
            </button>
            <button className="er-chip active">
              Contact = {contactSize}λ
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dvlsi"
              experimentSlug="lambda-rules-microwind"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DVLSILambdaRulesMicrowindOverview />
            )}

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
              <DVLSILambdaRulesMicrowindQuiz
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
              <DVLSILambdaRulesMicrowindCoding
                analysis={analysis}
                lambdaValue={lambdaValue}
                polyWidth={polyWidth}
                metalWidth={metalWidth}
                diffSpacing={diffSpacing}
                polySpacing={polySpacing}
                contactSize={contactSize}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}