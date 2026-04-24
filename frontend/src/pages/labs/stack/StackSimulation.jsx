import React from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Eye,
  RotateCcw,
  HelpCircle,
  Ruler
} from "lucide-react";

function StackBlock({ value, isTop, isHighlighted, index }) {
  return (
    <div
      className={`stack-node-card ${isTop ? "top" : ""} ${isHighlighted ? "highlighted" : ""}`}
    >
      {isTop && <div className="stack-node-badge">TOP</div>}

      <div className="stack-node-top">
        <span className="stack-node-label">Index {index}</span>
      </div>

      <div className="stack-node-value">{value}</div>
    </div>
  );
}

export default function StackSimulation({
  stack,
  input,
  setInput,
  pushElement,
  popElement,
  peekElement,
  checkIsEmpty,
  showSize,
  reset,
  message,
  inputRef,
  maxSize,
  highlightedIndex,
  lastOperation
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
              Perform stack operations and visualize how elements are added and removed from
              the top.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Value</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
            className="sorting-input"
            placeholder="Enter value to push"
          />
        </div>

        <div className="sorting-btn-group">
          <button className="sim-btn sim-btn-primary" onClick={pushElement}>
            <ArrowDownToLine size={16} />
            Push
          </button>

          <button className="sim-btn sim-btn-danger" onClick={popElement}>
            <ArrowUpFromLine size={16} />
            Pop
          </button>

          <button className="sim-btn sim-btn-muted" onClick={peekElement}>
            <Eye size={16} />
            Peek
          </button>

          <button className="sim-btn sim-btn-muted" onClick={checkIsEmpty}>
            <HelpCircle size={16} />
            isEmpty
          </button>

          <button className="sim-btn sim-btn-muted" onClick={showSize}>
            <Ruler size={16} />
            Size
          </button>

          <button className="sim-btn sim-btn-muted" onClick={reset}>
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Current Size</span>
          <span className="sorting-stat-value">{stack.length}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Maximum Size</span>
          <span className="sorting-stat-value">{maxSize}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Top Index</span>
          <span className="sorting-stat-value">{stack.length ? stack.length - 1 : "-"}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Last Operation</span>
          <span className="sorting-stat-value" style={{ fontSize: "1rem" }}>
            {lastOperation}
          </span>
        </div>
      </div>

      <div className="sorting-info-box">
        {message || "Perform an operation to begin."}
      </div>

      <div className="sorting-visualizer-wrap stack-visualizer-wrap">
        {stack.length === 0 ? (
          <div className="linked-empty-state">
            <div className="linked-empty-icon">📚</div>
            <div className="linked-empty-title">Stack is empty</div>
            <div className="linked-empty-subtitle">
              Push a value to place it at the top of the stack.
            </div>
          </div>
        ) : (
          <div className="stack-shell">
            <div className="stack-track">
              {stack.map((item, index) => (
                <StackBlock
                  key={`${item}-${index}`}
                  value={item}
                  index={index}
                  isTop={index === stack.length - 1}
                  isHighlighted={index === highlightedIndex}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}