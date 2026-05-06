import React, { useMemo, useState } from "react";
import "../../../SortingLab.css";
import {
  BookOpen,
  PlayCircle,
  CircuitBoard,
  Table2,
  Brain,
  FileCode2,
  ChevronsLeft,
  Scale
} from "lucide-react";

import MarkCompleteButton from "../../../../components/MarkCompleteButton";
import SimuLabLogo from "../../../../components/SimuLabLogo";
import { saveQuizResult } from "../../../../API/progressApi";

import DSDComparatorOverview from "./DSDComparatorOverview";
import DSDComparatorSimulation from "./DSDComparatorSimulation";
import DSDComparatorCircuits from "./DSDComparatorCircuits";
import DSDComparatorTruthTable from "./DSDComparatorTruthTable";
import DSDComparatorQuiz from "./DSDComparatorQuiz";
import DSDComparatorCoding from "./DSDComparatorCoding";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "circuits", label: "Circuits", icon: CircuitBoard },
  { key: "truth table", label: "Truth Table", icon: Table2 },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Design Practice", icon: FileCode2 }
];

const quizQuestions = [
  {
    q: "A comparator is mainly used to:",
    options: ["Store binary data", "Compare binary values", "Generate clock pulses", "Encode analog input"],
    correct: 1
  },
  {
    q: "If A = 1 and B = 0, which output becomes active?",
    options: ["A < B", "A = B", "A > B", "None"],
    correct: 2
  },
  {
    q: "If A = 0 and B = 0, the active output is:",
    options: ["A > B", "A = B", "A < B", "All outputs"],
    correct: 1
  },
  {
    q: "A 1-bit comparator has how many comparison outputs?",
    options: ["1", "2", "3", "4"],
    correct: 2
  },
  {
    q: "The expression for A > B in a 1-bit comparator is:",
    options: ["A · B̅", "A̅ · B", "A + B", "A̅B̅ + AB"],
    correct: 0
  }
];

export default function DSDComparatorLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [experimentRun, setExperimentRun] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const analysis = useMemo(() => {
    const greater = a > b ? 1 : 0;
    const equal = a === b ? 1 : 0;
    const less = a < b ? 1 : 0;

    const expressions = {
      greater: "A · B̅",
      equal: "A̅B̅ + AB",
      less: "A̅ · B"
    };

    if (greater) {
      return {
        greater,
        equal,
        less,
        relation: "A > B",
        activeOutput: "Greater",
        note: "Since A is greater than B, the A > B output becomes active.",
        expressions
      };
    }

    if (equal) {
      return {
        greater,
        equal,
        less,
        relation: "A = B",
        activeOutput: "Equal",
        note: "Since both inputs are equal, only the equality output becomes active.",
        expressions
      };
    }

    return {
      greater,
      equal,
      less,
      relation: "A < B",
      activeOutput: "Less",
      note: "Since A is less than B, the A < B output becomes active.",
      expressions
    };
  }, [a, b]);

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
        labSlug: "dsd",
        experimentSlug: "comparator",
        correctAnswers: total,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("Comparator quiz save failed:", error);
      setQuizSaveStatus("Quiz submitted, but backend save failed.");
    }
  };

  const redoQuiz = () => {
    setQuizAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizSaveStatus("");
  };

  const toggleA = () => {
    setA((prev) => prev ^ 1);
    setExperimentRun(true);
  };

  const toggleB = () => {
    setB((prev) => prev ^ 1);
    setExperimentRun(true);
  };

  const progressPercent =
    activeSection === "overview"
      ? 20
      : activeSection === "simulation"
      ? 45
      : activeSection === "circuits"
      ? 60
      : activeSection === "truth table"
      ? 74
      : activeSection === "quiz"
      ? 86
      : 94;

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
              <div className="er-brand-subtitle">DSD Virtual Lab</div>
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
                    "Comparator"}
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
            <h1 className="er-page-title">Comparator</h1>
            <p className="er-page-subtitle">
              Compare two 1-bit binary inputs and observe greater-than, equal-to,
              and less-than outputs.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Comparator Configuration</h2>
              <p>Toggle A and B to see which comparison output becomes active.</p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Scale size={18} />
              </div>
              <div>
                <strong>1-bit Comparator</strong>
                <span>Three outputs: A &gt; B, A = B, and A &lt; B.</span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Current Inputs</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                A = {a}, B = {b}
              </div>
            </div>

            <div>
              <label className="sorting-label">Active Relation</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {analysis.relation}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active" onClick={toggleA}>
              A = {a}
            </button>
            <button className="er-chip active" onClick={toggleB}>
              B = {b}
            </button>
            <button className="er-chip active">A &gt; B = {analysis.greater}</button>
            <button className="er-chip active">A = B = {analysis.equal}</button>
            <button className="er-chip active">A &lt; B = {analysis.less}</button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dsd"
              experimentSlug="comparator"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DSDComparatorOverview analysis={analysis} />
            )}

            {activeSection === "simulation" && (
              <DSDComparatorSimulation
                a={a}
                setA={setA}
                b={b}
                setB={setB}
                analysis={analysis}
                setExperimentRun={setExperimentRun}
              />
            )}

            {activeSection === "circuits" && (
              <DSDComparatorCircuits a={a} b={b} analysis={analysis} />
            )}

            {activeSection === "truth table" && (
              <DSDComparatorTruthTable a={a} b={b} analysis={analysis} />
            )}

            {activeSection === "quiz" && (
              <DSDComparatorQuiz
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
              <DSDComparatorCoding a={a} b={b} analysis={analysis} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}