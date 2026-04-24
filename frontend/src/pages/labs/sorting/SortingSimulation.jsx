import React from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Activity } from "lucide-react";

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
              Visualize each comparison, shift, and swap step by step.
            </p>
          </div>
        </div>
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
        {info || "Click Start to begin the experiment."}
      </div>

      <div className="sorting-visualizer-wrap">
        <div className="sorting-bars-area">
          {arr.map((value, i) => {
            let extraClass = "";

            if (selectedAlgorithm === "selection") {
              if (i === current.minIndex) extraClass = "bar-min";
              else if (i === current.j) extraClass = "bar-scan";
              else if (i === current.i) extraClass = "bar-current";
            } else if (selectedAlgorithm === "insertion") {
              if (i === current.keyIndex) extraClass = "bar-current";
              else if (i === current.j) extraClass = "bar-scan";
              else if (i <= current.sortedEnd && current.sortedEnd !== undefined) extraClass = "bar-sorted";
            } else {
              if (i === current.j || i === current.j + 1) extraClass = "bar-active";
            }

            const heightPercent = Math.max(14, (value / maxVal) * 100);

            return (
              <div key={i} className="sorting-bar-column">
                <div className="sorting-bar-value">{value}</div>
                <div
                  className={`sorting-bar ${extraClass}`}
                  style={{ height: `${heightPercent}%` }}
                />
                <div className="sorting-bar-index">{i}</div>
              </div>
            );
          })}
        </div>
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