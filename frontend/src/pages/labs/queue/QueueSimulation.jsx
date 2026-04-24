import React from "react";
import {
  Play,
  Trash2,
  RotateCcw,
  Eye,
  Activity,
  Trash,
  ScanLine,
} from "lucide-react";

const QueueSimulation = ({
  queueType,
  queue,
  displayQueue,
  front,
  rear,
  count,
  input,
  setInput,
  log,
  warning,
  animating,
  animDuration,
  handleSpeedChange,
  enqueue,
  dequeue,
  peekFront,
  traverseQueue,
  clearLog,
  reset,
  QUEUE_SIZE,
  inputRef,
  traversalActiveIndex
}) => {
  const isCircular = queueType === "circular";

  const visibleSize = isCircular ? count : queue.length;

  const frontValue =
    isCircular
      ? count > 0 && front !== -1
        ? queue[front]
        : "Empty"
      : queue.length > 0
      ? queue[0]
      : "Empty";

  const rearValue =
    isCircular
      ? count > 0 && rear !== -1
        ? queue[rear]
        : "Empty"
      : queue.length > 0
      ? queue[queue.length - 1]
      : "Empty";

  const status =
    visibleSize === 0
      ? "Empty"
      : visibleSize === QUEUE_SIZE
      ? "Full"
      : "Active";

  return (
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Activity size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">
              Simulation{" "}
              <span style={{ color: "#38bdf8" }}>
                ({isCircular ? "Circular Queue" : "Normal Queue"})
              </span>
            </h2>
            <p className="sorting-sim-subtitle">
              Perform queue operations interactively and observe front/rear behavior.
            </p>
          </div>
        </div>
      </div>

      <div className="sorting-input-row">
        <div className="sorting-input-group">
          <label className="sorting-label">Enter Value</label>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enqueue()}
            disabled={animating}
            className="sorting-input"
            placeholder="Enter a value to enqueue"
          />
        </div>

        <div className="sorting-btn-group">
          <button
            type="button"
            className="sim-btn sim-btn-primary"
            onClick={enqueue}
            disabled={visibleSize >= QUEUE_SIZE || animating}
          >
            <Play size={16} />
            Enqueue
          </button>

          <button
            type="button"
            className="sim-btn sim-btn-muted"
            onClick={dequeue}
            disabled={visibleSize === 0 || animating}
          >
            <Trash2 size={16} />
            Dequeue
          </button>

          <button
            type="button"
            className="sim-btn sim-btn-muted"
            onClick={peekFront}
            disabled={visibleSize === 0 || animating}
          >
            <Eye size={16} />
            Peek
          </button>

          <button
            type="button"
            className="sim-btn sim-btn-muted"
            onClick={traverseQueue}
            disabled={visibleSize === 0 || animating}
          >
            <ScanLine size={16} />
            Traverse
          </button>

          <button
            type="button"
            className="sim-btn sim-btn-danger"
            onClick={reset}
            disabled={animating}
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="button"
            className="sim-btn sim-btn-muted"
            onClick={clearLog}
            disabled={animating}
          >
            <Trash size={16} />
            Clear Log
          </button>
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Queue Size</span>
          <span className="sorting-stat-value">
            {visibleSize}/{QUEUE_SIZE}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Front</span>
          <span className="sorting-stat-value">{frontValue}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Rear</span>
          <span className="sorting-stat-value">{rearValue}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Status</span>
          <span
            className="sorting-stat-value"
            style={{
              color:
                status === "Empty"
                  ? "#f87171"
                  : status === "Full"
                  ? "#fbbf24"
                  : "#34d399"
            }}
          >
            {status}
          </span>
        </div>
      </div>

      {isCircular && (
        <div className="sorting-stats-grid" style={{ marginTop: "-4px", marginBottom: "18px" }}>
          <div className="sorting-stat-box">
            <span className="sorting-stat-label">Front Index</span>
            <span className="sorting-stat-value">{front}</span>
          </div>

          <div className="sorting-stat-box">
            <span className="sorting-stat-label">Rear Index</span>
            <span className="sorting-stat-value">{rear}</span>
          </div>

          <div className="sorting-stat-box">
            <span className="sorting-stat-label">Type</span>
            <span className="sorting-stat-value">{isCircular ? "Circular" : "Linear"}</span>
          </div>

          <div className="sorting-stat-box">
            <span className="sorting-stat-label">Occupied</span>
            <span className="sorting-stat-value">{visibleSize}</span>
          </div>
        </div>
      )}

      <div className="sorting-info-box">
        {visibleSize === 0
          ? `${isCircular ? "Circular Queue" : "Queue"} is empty`
          : `${isCircular ? "Circular Queue" : "Queue"} has ${visibleSize} element(s)`}
      </div>

      {warning && (
        <div className="queue-warning-box">
          {warning}
        </div>
      )}

      <div className="sorting-visualizer-wrap">
        {visibleSize === 0 ? (
          <div className="queue-empty-state">
            {isCircular ? "Circular Queue is empty" : "Queue is empty"}
          </div>
        ) : isCircular ? (
          <div className="circular-queue-wrapper">
            <div className="circular-queue">
              {displayQueue.map((val, i) => {
                const angle = (360 / displayQueue.length) * i - 90;
                const radius = 140;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <div
                    key={i}
                    className={`circular-queue-block ${val.isFront ? "front" : ""} ${
                      val.isRear ? "rear" : ""
                    } ${val.value === null ? "empty-slot" : ""} ${
                      traversalActiveIndex === i ? "queue-traverse-active" : ""
                    }`}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      transitionDuration: `${animDuration}ms`,
                      opacity: val.value === null ? 0.45 : 1
                    }}
                  >
                    <div className="queue-value">{val.value === null ? "-" : val.value}</div>
                    <div className="queue-index">Index {i}</div>
                    {val.isFront && <div className="circular-label front-label">F</div>}
                    {val.isRear && <div className="circular-label rear-label">R</div>}
                  </div>
                );
              })}
              <div className="circular-queue-center">Circular Queue</div>
            </div>
          </div>
        ) : (
          <div className="queue-linear-shell">
            <div className="queue-label-front">FRONT</div>
            <div className="queue-visualization">
              {displayQueue.map((val, i) => (
                <div
                  key={i}
                  className={`queue-block ${val.isFront ? "front" : ""} ${
                    val.isRear ? "rear" : ""
                  } ${traversalActiveIndex === i ? "queue-traverse-active" : ""}`}
                  style={{
                    transitionDuration: `${animDuration}ms`,
                    opacity: val.value === null ? 0.35 : 1
                  }}
                >
                  <div className="queue-value">{val.value === null ? "-" : val.value}</div>
                  <div className="queue-index">Index {i}</div>
                </div>
              ))}
            </div>
            <div className="queue-label-rear">REAR</div>
          </div>
        )}
      </div>

      <div className="sorting-bottom-controls">
        <div className="sorting-speed-wrap">
          <label className="sorting-label">Animation Speed: {animDuration} ms</label>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={animDuration}
            onChange={handleSpeedChange}
            className="sorting-range"
          />
        </div>
      </div>

      <div className="queue-log-card">
        <div className="queue-log-title">Operation Log</div>
        <ul className="queue-log-list">
          {log.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default QueueSimulation;