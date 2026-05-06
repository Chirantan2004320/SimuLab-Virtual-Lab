import React, { useMemo, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  LineChart,
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

import DTSPLinearCircularConvolutionOverview from "./DTSPLinearCircularConvolutionOverview";
import DTSPLinearCircularConvolutionSimulation from "./DTSPLinearCircularConvolutionSimulation";
import DTSPLinearCircularConvolutionGraphs from "./DTSPLinearCircularConvolutionGraphs";
import DTSPLinearCircularConvolutionQuiz from "./DTSPLinearCircularConvolutionQuiz";
import DTSPLinearCircularConvolutionCoding from "./DTSPLinearCircularConvolutionCoding";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "simulation", label: "Simulation", icon: PlayCircle },
  { key: "graphs", label: "Graphs", icon: LineChart },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "coding", label: "Coding Practice", icon: FileCode2 }
];

function parseSequence(text) {
  const parts = text
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const nums = parts.map(Number);
  if (nums.length === 0 || nums.some((n) => Number.isNaN(n))) return null;

  return nums;
}

function linearConvolution(x, h) {
  const y = new Array(x.length + h.length - 1).fill(0);

  for (let n = 0; n < y.length; n++) {
    for (let k = 0; k < x.length; k++) {
      const hIndex = n - k;

      if (hIndex >= 0 && hIndex < h.length) {
        y[n] += x[k] * h[hIndex];
      }
    }
  }

  return y;
}

function circularConvolution(x, h, L) {
  const len = L || Math.max(x.length, h.length);
  const xa = new Array(len).fill(0);
  const ha = new Array(len).fill(0);

  for (let n = 0; n < len; n++) {
    if (n < x.length) xa[n] = x[n];
    if (n < h.length) ha[n] = h[n];
  }

  const y = new Array(len).fill(0);

  for (let n = 0; n < len; n++) {
    for (let k = 0; k < len; k++) {
      const index = (n - k + len) % len;
      y[n] += xa[k] * ha[index];
    }
  }

  return y;
}

function formatNumber(value, digits = 3) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "0";
  return Math.abs(v) < 1e-10 ? "0" : v.toFixed(digits);
}

function buildLinearSteps(x, h, n) {
  const steps = [];
  let runningSum = 0;

  for (let k = 0; k < x.length; k++) {
    const hIndex = n - k;
    const valid = hIndex >= 0 && hIndex < h.length;
    const xValue = x[k];
    const hValue = valid ? h[hIndex] : 0;
    const product = valid ? xValue * hValue : 0;

    runningSum += product;

    steps.push({
      k,
      xIndex: k,
      hIndex,
      xValue,
      hValue,
      product,
      valid,
      wrapped: false,
      runningSum,
      note: valid
        ? `Valid term: x[${k}] × h[${hIndex}] contributes to y[${n}]`
        : `Ignored: h[${hIndex}] is outside valid range`
    });
  }

  return steps;
}

function buildCircularSteps(x, h, n, L, padded = false) {
  const xa = new Array(L).fill(0);
  const ha = new Array(L).fill(0);

  for (let i = 0; i < L; i++) {
    if (i < x.length) xa[i] = x[i];
    if (i < h.length) ha[i] = h[i];
  }

  const steps = [];
  let runningSum = 0;

  for (let k = 0; k < L; k++) {
    const rawIndex = n - k;
    const wrappedIndex = (rawIndex + L) % L;
    const wrapped = rawIndex < 0 || rawIndex >= L;

    const xValue = xa[k];
    const hValue = ha[wrappedIndex];
    const product = xValue * hValue;

    runningSum += product;

    steps.push({
      k,
      xIndex: k,
      rawIndex,
      hIndex: wrappedIndex,
      xValue,
      hValue,
      product,
      valid: true,
      wrapped,
      runningSum,
      note: wrapped
        ? `Wrap-around: h[${rawIndex}] mapped to h[${wrappedIndex}] using modulo ${L}`
        : `Direct circular term: x[${k}] × h[${wrappedIndex}]`
    });
  }

  return {
    steps,
    explanation: padded
      ? `Because zero padding is used with L = ${L}, wrap-around does not corrupt the useful output.`
      : `Because L = ${L} is too short, wrap-around changes the result compared to linear convolution.`
  };
}

const quizQuestions = [
  {
    question: "What is the length of linear convolution of sequences of lengths N and M?",
    options: ["N + M", "N + M - 1", "max(N, M)", "N × M"],
    correct: 1
  },
  {
    question: "Circular convolution without zero padding differs from linear convolution because of:",
    options: ["Noise", "Wrap-around effect", "Sampling error", "Only phase shift"],
    correct: 1
  },
  {
    question: "To make circular convolution equal linear convolution, the circular length should be:",
    options: ["max(N, M)", "N", "M", "N + M - 1"],
    correct: 3
  },
  {
    question: "Zero padding helps by:",
    options: [
      "Reducing amplitude",
      "Avoiding overlap due to wrap-around",
      "Removing negative values",
      "Making signals periodic"
    ],
    correct: 1
  },
  {
    question: "Linear convolution is commonly used to find the output of:",
    options: [
      "A linear time-invariant system",
      "A random system",
      "Only periodic systems",
      "Only analog systems"
    ],
    correct: 0
  }
];

export default function DTSPLinearCircularConvolutionLab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [xText, setXText] = useState("1, 2, 1");
  const [hText, setHText] = useState("1, -1, 1");

  const [x, setX] = useState([]);
  const [h, setH] = useState([]);
  const [yLinear, setYLinear] = useState([]);
  const [yCircularNoPad, setYCircularNoPad] = useState([]);
  const [yCircularPadded, setYCircularPadded] = useState([]);
  const [error, setError] = useState("");
  const [experimentRun, setExperimentRun] = useState(false);

  const [selectedLinearIndex, setSelectedLinearIndex] = useState(0);
  const [selectedCircularIndex, setSelectedCircularIndex] = useState(0);
  const [selectedPaddedIndex, setSelectedPaddedIndex] = useState(0);

  const [quizAnswers, setQuizAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSaveStatus, setQuizSaveStatus] = useState("");

  const handleCompute = () => {
    setError("");

    const xSeq = parseSequence(xText);
    const hSeq = parseSequence(hText);

    if (!xSeq || !hSeq) {
      setError("Please enter valid numeric sequences for x[n] and h[n].");
      setX([]);
      setH([]);
      setYLinear([]);
      setYCircularNoPad([]);
      setYCircularPadded([]);
      return;
    }

    const yLin = linearConvolution(xSeq, hSeq);
    const L = Math.max(xSeq.length, hSeq.length);
    const Lfull = xSeq.length + hSeq.length - 1;

    setX(xSeq);
    setH(hSeq);
    setYLinear(yLin);
    setYCircularNoPad(circularConvolution(xSeq, hSeq, L));
    setYCircularPadded(circularConvolution(xSeq, hSeq, Lfull));

    setSelectedLinearIndex(0);
    setSelectedCircularIndex(0);
    setSelectedPaddedIndex(0);
    setExperimentRun(true);

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({
        name: "dtsp-linear-circular-convolution",
        time: Date.now()
      })
    );
  };

  const linearSteps = useMemo(() => {
    if (!x.length || !h.length || !yLinear.length) return [];
    return buildLinearSteps(x, h, selectedLinearIndex);
  }, [x, h, yLinear, selectedLinearIndex]);

  const circularNoPadAnalysis = useMemo(() => {
    if (!x.length || !h.length || !yCircularNoPad.length) {
      return { steps: [], explanation: "" };
    }

    return buildCircularSteps(
      x,
      h,
      selectedCircularIndex,
      Math.max(x.length, h.length),
      false
    );
  }, [x, h, yCircularNoPad, selectedCircularIndex]);

  const circularPaddedAnalysis = useMemo(() => {
    if (!x.length || !h.length || !yCircularPadded.length) {
      return { steps: [], explanation: "" };
    }

    return buildCircularSteps(
      x,
      h,
      selectedPaddedIndex,
      x.length + h.length - 1,
      true
    );
  }, [x, h, yCircularPadded, selectedPaddedIndex]);

  const handleQuizAnswer = (index, answer) => {
    const updated = [...quizAnswers];
    updated[index] = answer;
    setQuizAnswers(updated);
  };

  const submitQuiz = async () => {
    let score = 0;

    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });

    setQuizScore(score);
    setQuizSubmitted(true);
    setQuizSaveStatus("Saving quiz result...");

    try {
      await saveQuizResult({
        labSlug: "dtsp",
        experimentSlug: "linear-circular-convolution",
        correctAnswers: score,
        totalQuestions: quizQuestions.length
      });

      setQuizSaveStatus("Quiz result saved to dashboard.");
    } catch (error) {
      console.error("Convolution quiz save failed:", error);
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
      ? 20
      : activeSection === "simulation"
      ? 45
      : activeSection === "graphs"
      ? 65
      : activeSection === "quiz"
      ? 82
      : 95;

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
              <div className="er-brand-subtitle">DTSP Lab</div>
            </div>
          )}
        </div>

        <div className="er-collapse-wrap">
          <button
            type="button"
            className={`er-collapse-btn ${sidebarCollapsed ? "collapsed" : ""}`}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
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
          </div>
        )}
      </aside>

      <main className="er-main-area">
        <div className="er-page-header">
          <div>
            <h1 className="er-page-title">Linear & Circular Convolution</h1>
            <p className="er-page-subtitle">
              Compare linear convolution, circular convolution, wrap-around
              effect, and zero-padding equivalence.
            </p>
          </div>
        </div>

        <section className="er-config-card">
          <div className="er-config-top">
            <div>
              <h2>Experiment Configuration</h2>
              <p>
                Enter x[n] and h[n], compute convolution outputs, and inspect
                sample-wise contributions.
              </p>
            </div>

            <div className="er-mode-pill">
              <div className="er-mode-pill-icon">
                <Cpu size={18} />
              </div>
              <div>
                <strong>Convolution Analysis</strong>
                <span>
                  Zero-padded circular convolution matches linear convolution
                  when L = N + M - 1.
                </span>
              </div>
            </div>
          </div>

          <div className="er-config-grid">
            <div>
              <label className="sorting-label">Input Sequence x[n]</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {xText}
              </div>
            </div>

            <div>
              <label className="sorting-label">Impulse Response h[n]</label>
              <div
                className="sorting-select"
                style={{ display: "flex", alignItems: "center" }}
              >
                {hText}
              </div>
            </div>
          </div>

          <div className="er-chip-row">
            <button className="er-chip active">N = {x.length || "-"}</button>
            <button className="er-chip active">M = {h.length || "-"}</button>
            <button className="er-chip active">
              Linear Length = {yLinear.length || "-"}
            </button>
            <button className={`er-chip ${experimentRun ? "active" : ""}`}>
              {experimentRun ? "Simulation Run" : "Not Started"}
            </button>
          </div>

          <div style={{ marginTop: 18 }}>
            <MarkCompleteButton
              labSlug="dtsp"
              experimentSlug="linear-circular-convolution"
              points={10}
            />
          </div>
        </section>

        <div className="er-content-layout">
          <section className="er-content-card">
            {activeSection === "overview" && (
              <DTSPLinearCircularConvolutionOverview />
            )}

            {activeSection === "simulation" && (
              <DTSPLinearCircularConvolutionSimulation
                xText={xText}
                setXText={setXText}
                hText={hText}
                setHText={setHText}
                x={x}
                h={h}
                yLinear={yLinear}
                yCircularNoPad={yCircularNoPad}
                yCircularPadded={yCircularPadded}
                error={error}
                handleCompute={handleCompute}
                formatNumber={formatNumber}
                selectedLinearIndex={selectedLinearIndex}
                setSelectedLinearIndex={setSelectedLinearIndex}
                selectedCircularIndex={selectedCircularIndex}
                setSelectedCircularIndex={setSelectedCircularIndex}
                selectedPaddedIndex={selectedPaddedIndex}
                setSelectedPaddedIndex={setSelectedPaddedIndex}
                linearSteps={linearSteps}
                circularNoPadAnalysis={circularNoPadAnalysis}
                circularPaddedAnalysis={circularPaddedAnalysis}
              />
            )}

            {activeSection === "graphs" && (
              <DTSPLinearCircularConvolutionGraphs
                x={x}
                h={h}
                yLinear={yLinear}
                yCircularNoPad={yCircularNoPad}
                yCircularPadded={yCircularPadded}
              />
            )}

            {activeSection === "quiz" && (
              <DTSPLinearCircularConvolutionQuiz
                experimentRun={experimentRun}
                quizQuestions={quizQuestions}
                quizAnswers={quizAnswers}
                quizSubmitted={quizSubmitted}
                quizScore={quizScore}
                quizSaveStatus={quizSaveStatus}
                handleQuizAnswer={handleQuizAnswer}
                submitQuiz={submitQuiz}
                redoQuiz={redoQuiz}
              />
            )}

            {activeSection === "coding" && (
              <DTSPLinearCircularConvolutionCoding />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}