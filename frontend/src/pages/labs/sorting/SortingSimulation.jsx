import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Activity,
  Gauge,
  MemoryStick,
  Layers,
  Sparkles
} from "lucide-react";

const algorithmMeta = {
  bubble: {
    name: "Bubble Sort",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: "Stable",
    insight: "Larger values repeatedly bubble toward the end after every pass."
  },
  selection: {
    name: "Selection Sort",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: "Not Stable",
    insight: "The minimum element is selected from the unsorted portion and placed at the front."
  },
  insertion: {
    name: "Insertion Sort",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: "Stable",
    insight: "Each key is inserted into its correct position inside the sorted left portion."
  }
};

const SortingSimulation = ({
  selectedAlgorithm,
  input,
  setInput,
  steps,
  idx,
  speed,
  setSpeed,
  info,
  comparisons,
  swaps,
  current,
  start,
  pause,
  reset,
  nextStep,
  prevStep
}) => {
  const arr = current.array || [];
  const maxVal = arr.length ? Math.max(...arr) : 1;
  const meta = algorithmMeta[selectedAlgorithm];

  // ✅ NEW: actual complexity logic
  const isCompleted = steps.length > 0 && idx >= steps.length - 1;
  const inputSize = arr.length;

  const actualComplexity = isCompleted
    ? `${comparisons} comparisons + ${swaps} operations`
    : "Run full simulation to calculate";

  const getBlockClass = (i) => {
    if (selectedAlgorithm === "selection") {
      if (i === current.minIndex) return "bar-min";
      if (i === current.j) return "bar-scan";
      if (i === current.i) return "bar-current";
    }

    if (selectedAlgorithm === "insertion") {
      if (i === current.keyIndex) return "bar-current";
      if (i === current.j) return "bar-scan";
      if (i <= current.sortedEnd && current.sortedEnd !== undefined) return "bar-sorted";
    }

    if (selectedAlgorithm === "bubble") {
      if (i === current.j || i === current.j + 1) return "bar-active";
    }

    return "";
  };

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Activity size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Simulation</h2>
            <p className="sorting-sim-subtitle">
              Visualize comparisons, swaps, shifts, sorted sections, and complexity.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ THEORY COMPLEXITY */}
      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Gauge size={18} />
            <h4>Time Complexity</h4>
          </div>
          <p>
            Best: <strong>{meta.best}</strong> · Average: <strong>{meta.average}</strong> · Worst:{" "}
            <strong>{meta.worst}</strong>
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <MemoryStick size={18} />
            <h4>Space + Stability</h4>
          </div>
          <p>
            Space: <strong>{meta.space}</strong> · <strong>{meta.stable}</strong>
          </p>
        </div>
      </div>

      {/* ✅ NEW: ACTUAL COMPLEXITY */}
      <div className="overview-card" style={{ marginBottom: 18 }}>
        <div className="overview-card-head">
          <Gauge size={18} />
          <h4>Actual Complexity (Your Input)</h4>
        </div>

        <p>{actualComplexity}</p>

        {isCompleted && (
          <p style={{ marginTop: 8 }}>
            For <strong>n = {inputSize}</strong>, algorithm performed{" "}
            <strong>{comparisons}</strong> comparisons and{" "}
            <strong>{swaps}</strong> swaps/shifts.
          </p>
        )}
      </div>

      <div className="sorting-info-box">
        <Sparkles size={16} style={{ marginRight: 10 }} />
        {meta.insight}
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Input Array</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="sorting-input"
            placeholder="e.g. 5, 2, 9, 1, 6"
          />
        </div>

        <div className="sorting-btn-group">
          <button className="sim-btn sim-btn-primary" onClick={start}>
            <Play size={16} />
            Start
          </button>

          <button className="sim-btn sim-btn-muted" onClick={pause}>
            <Pause size={16} />
            Pause
          </button>

          <button className="sim-btn sim-btn-danger" onClick={reset}>
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Comparisons</span>
          <span className="sorting-stat-value">{comparisons}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Swaps / Shifts</span>
          <span className="sorting-stat-value">{swaps}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Current Step</span>
          <span className="sorting-stat-value">
            {steps.length ? idx : 0}/{steps.length ? steps.length - 1 : 0}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Pass</span>
          <span className="sorting-stat-value">{current.pass || "-"}</span>
        </div>
      </div>

      <div className="sorting-info-box">
        <Layers size={16} style={{ marginRight: 10 }} />
        {info || "Click Start to begin the experiment."}
      </div>

      <div className="sorting-visualizer-wrap">
        <div className="sorting-bars-area">
          {arr.map((value, i) => {
            const extraClass = getBlockClass(i);
            const heightPercent = Math.max(14, (value / maxVal) * 100);

            return (
              <div key={`${value}-${i}`} className="sorting-bar-column">
                <div className="sorting-bar-value">{value}</div>

                <div
                  className={`sorting-bar ${extraClass}`}
                  style={{
                    height: `${heightPercent}%`,
                    transform: extraClass ? "scale(1.08) translateY(-6px)" : undefined
                  }}
                />

                <div className="sorting-bar-index">idx {i}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="er-chip-row" style={{ marginBottom: 18 }}>
        <button className="er-chip active">Blue = Normal</button>
        <button className="er-chip active">Orange = Comparing</button>
        <button className="er-chip active">Purple = Scanning</button>
        <button className="er-chip active">Green = Sorted / Minimum</button>
      </div>

      <div className="sorting-bottom-controls">
        <div className="sorting-step-buttons">
          <button
            className="sim-btn sim-btn-muted"
            onClick={prevStep}
            disabled={idx === 0 || steps.length === 0}
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          <button
            className="sim-btn sim-btn-muted"
            onClick={nextStep}
            disabled={idx >= steps.length - 1 || steps.length === 0}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="sorting-speed-wrap">
          <label className="sorting-label">Animation Speed: {speed} ms</label>
          <input
            type="range"
            min="200"
            max="1500"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="sorting-range"
          />
        </div>
      </div>
    </section>
  );
};

export default SortingSimulation;