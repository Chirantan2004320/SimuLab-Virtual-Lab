import React from "react";
import { Activity, Play, Square, RotateCcw, FlaskConical } from "lucide-react";

function ArrayBlock({
  value,
  index,
  isCurrent,
  isFound,
  isLow,
  isHigh,
  isMid,
  searchType,
  lowIndex,
  highIndex
}) {
  let className = "searching-array-block";

  if (searchType === "binary" && lowIndex !== null && highIndex !== null) {
    if (index < lowIndex || index > highIndex) className += " dimmed";
  }

  if (isFound) className += " found";
  else if (searchType === "linear" && isCurrent) className += " current";
  else if (searchType === "binary" && isMid) className += " mid";

  return (
    <div className={className}>
      <div className="searching-array-value">{value}</div>
      <div className="searching-array-index">idx {index}</div>

      {searchType === "binary" && isLow && <div className="searching-array-tag low">LOW</div>}
      {searchType === "binary" && isHigh && <div className="searching-array-tag high">HIGH</div>}
      {searchType === "binary" && isMid && <div className="searching-array-tag mid">MID</div>}
    </div>
  );
}

function StepHistoryPanel({ stepHistory }) {
  return (
    <div className="searching-history-card">
      <div className="searching-history-title">Step History</div>

      {stepHistory.length === 0 ? (
        <div className="searching-history-empty">Search steps will appear here.</div>
      ) : (
        <div className="searching-history-list">
          {stepHistory.map((step, index) => (
            <div key={index} className="searching-history-item">
              <strong>{index + 1}.</strong> {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchingSimulation({
  searchType,
  arrayInput,
  setArrayInput,
  target,
  setTarget,
  runSearch,
  stopSearch,
  reset,
  loadSample,
  message,
  array,
  currentIndex,
  foundIndex,
  lowIndex,
  highIndex,
  midIndex,
  targetRef,
  isRunning,
  stepHistory
}) {
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
              Visualize {searchType === "binary" ? "Binary Search" : "Linear Search"} step by step.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group" style={{ flex: 2 }}>
          <label className="sorting-label">Array Values</label>
          <input
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            placeholder="Enter values like 10, 20, 30, 40"
            className="sorting-input"
            disabled={isRunning}
          />
        </div>

        <div className="sorting-input-group" style={{ flex: 1 }}>
          <label className="sorting-label">Target Value</label>
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            ref={targetRef}
            placeholder="Enter target"
            className="sorting-input"
            disabled={isRunning}
          />
        </div>
      </div>

      <div className="sorting-btn-group" style={{ marginBottom: 18 }}>
        <button className="sim-btn sim-btn-primary" onClick={runSearch} disabled={isRunning}>
          <Play size={16} />
          {isRunning ? "Running..." : "Run Search"}
        </button>

        <button className="sim-btn sim-btn-danger" onClick={stopSearch} disabled={!isRunning}>
          <Square size={16} />
          Stop
        </button>

        <button className="sim-btn sim-btn-muted" onClick={loadSample} disabled={isRunning}>
          <FlaskConical size={16} />
          Load Sample
        </button>

        <button className="sim-btn sim-btn-muted" onClick={reset} disabled={isRunning}>
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="sorting-info-box">{message || "Run a search to begin."}</div>

      <div className="sorting-visualizer-wrap searching-visualizer-wrap">
        {array.length === 0 ? (
          <div className="linked-empty-state">
            <div className="linked-empty-icon">🔎</div>
            <div className="linked-empty-title">Parsed array will appear here</div>
            <div className="linked-empty-subtitle">
              Enter array values and a target, then run the search.
            </div>
          </div>
        ) : (
          <div className="searching-array-shell">
            <div className="searching-array-track">
              {array.map((value, index) => (
                <ArrayBlock
                  key={`${value}-${index}`}
                  value={value}
                  index={index}
                  isCurrent={index === currentIndex}
                  isFound={index === foundIndex}
                  isLow={index === lowIndex}
                  isHigh={index === highIndex}
                  isMid={index === midIndex}
                  searchType={searchType}
                  lowIndex={lowIndex}
                  highIndex={highIndex}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <StepHistoryPanel stepHistory={stepHistory} />
    </section>
  );
}