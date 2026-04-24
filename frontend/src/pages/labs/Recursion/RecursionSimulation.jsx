import React, { useEffect, useRef } from "react";
import { Activity, Play, Square, RotateCcw, FlaskConical } from "lucide-react";

function TraceStep({ step, index, isActive, registerTraceRef }) {
  return (
    <div
      ref={(el) => registerTraceRef(index, el)}
      className={`recursion-trace-item ${isActive ? "active" : ""}`}
      style={{ marginLeft: `${step.level * 24}px` }}
    >
      <strong>{index + 1}.</strong> {step.text}
    </div>
  );
}

function CallFrameCard({ frame, registerFrameRef }) {
  const isReturned = frame.status === "returned";

  return (
    <div
      ref={(el) => registerFrameRef(frame.id, el)}
      className={`recursion-frame-card ${isReturned ? "returned" : "active-frame"}`}
      style={{ marginLeft: `${frame.level * 28}px` }}
    >
      <div className="recursion-frame-title">{frame.label}</div>
      <div className="recursion-frame-meta">Depth: {frame.level}</div>
      <div className="recursion-frame-meta">
        Status: <strong>{isReturned ? "Returned" : "Active"}</strong>
      </div>

      {isReturned && (
        <div className="recursion-frame-return">
          Return Value: <strong>{frame.returnValue}</strong>
        </div>
      )}
    </div>
  );
}

export default function RecursionSimulation({
  recursionType,
  inputValue,
  setInputValue,
  runVisualization,
  stopVisualization,
  reset,
  loadSample,
  message,
  steps,
  activeStepIndex,
  finalResult,
  inputRef,
  isRunning,
  callFrames
}) {
  const traceRefs = useRef({});
  const frameRefs = useRef({});

  const registerTraceRef = (index, el) => {
    if (el) traceRefs.current[index] = el;
  };

  const registerFrameRef = (id, el) => {
    if (el) frameRefs.current[id] = el;
  };

  useEffect(() => {
    if (activeStepIndex !== null && traceRefs.current[activeStepIndex]) {
      traceRefs.current[activeStepIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [activeStepIndex]);

  useEffect(() => {
    if (callFrames.length > 0) {
      const latestFrame = callFrames[callFrames.length - 1];
      const latestFrameEl = frameRefs.current[latestFrame.id];

      if (latestFrameEl) {
        latestFrameEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    }
  }, [callFrames]);

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
              Visualize {recursionType === "fibonacci" ? "Fibonacci" : "Factorial"} recursion through calls, base cases, and returns.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Input n</label>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            ref={inputRef}
            placeholder={recursionType === "fibonacci" ? "Enter n (0-8)" : "Enter n (0-10)"}
            className="sorting-input"
            disabled={isRunning}
          />
        </div>

        <div className="sorting-btn-group">
          <button className="sim-btn sim-btn-primary" onClick={runVisualization} disabled={isRunning}>
            <Play size={16} />
            {isRunning ? "Running..." : "Run Visualization"}
          </button>

          <button className="sim-btn sim-btn-danger" onClick={stopVisualization} disabled={!isRunning}>
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
      </div>

      <div className="sorting-info-box">{message || "Run a recursion visualization to begin."}</div>

      {finalResult !== null && (
        <div className="recursion-result-box">
          Final Result: {finalResult}
        </div>
      )}

      <div className="recursion-panels-grid">
        <div className="recursion-panel-card">
          <div className="recursion-panel-title">Recursive Trace / Call Order</div>

          {steps.length === 0 ? (
            <div className="recursion-panel-empty">Recursive steps will appear here.</div>
          ) : (
            <div className="recursion-scroll-area">
              {steps.map((step, index) => (
                <TraceStep
                  key={index}
                  step={step}
                  index={index}
                  isActive={index === activeStepIndex}
                  registerTraceRef={registerTraceRef}
                />
              ))}
            </div>
          )}
        </div>

        <div className="recursion-panel-card">
          <div className="recursion-panel-title">Call Frames Visualization</div>

          {callFrames.length === 0 ? (
            <div className="recursion-panel-empty">
              Call frames will appear here during recursion.
            </div>
          ) : (
            <div className="recursion-scroll-area">
              {callFrames.map((frame) => (
                <CallFrameCard
                  key={frame.id}
                  frame={frame}
                  registerFrameRef={registerFrameRef}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}