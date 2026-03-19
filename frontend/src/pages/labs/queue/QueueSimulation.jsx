import React from "react";

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
  clearLog,
  reset,
  QUEUE_SIZE,
  inputRef
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
    <section className="card experiment">
      <h2>
        Experiment - Interactive Simulation{" "}
        <span style={{ color: "#38bdf8" }}>
          ({isCircular ? "Circular Queue" : "Normal Queue"})
        </span>
      </h2>

      <form
        className="stack-form"
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="queue-input" className="stack-label">
          Enter Value:
        </label>
        <input
          id="queue-input"
          className="stack-input"
          type="text"
          placeholder="Enter a value to enqueue"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enqueue()}
          ref={inputRef}
          disabled={animating}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            className="stack-btn push-btn"
            onClick={enqueue}
            disabled={visibleSize >= QUEUE_SIZE || animating}
          >
            ENQUEUE
          </button>

          <button
            type="button"
            className="stack-btn pop-btn"
            onClick={dequeue}
            disabled={visibleSize === 0 || animating}
          >
            DEQUEUE
          </button>

          <button
            type="button"
            className="stack-btn push-btn"
            onClick={peekFront}
            disabled={visibleSize === 0 || animating}
          >
            PEEK
          </button>

          <button
            type="button"
            className="stack-btn reset-btn"
            onClick={reset}
            disabled={animating}
          >
            RESET
          </button>

          <button
            type="button"
            className="stack-btn"
            onClick={clearLog}
            disabled={animating}
            style={{ background: "#475569", color: "#fff" }}
          >
            CLEAR LOG
          </button>
        </div>
      </form>

      <div className="stack-speed-panel">
        <label htmlFor="queue-speed-slider" className="stack-label">
          Animation Speed:
        </label>
        <input
          id="queue-speed-slider"
          type="range"
          min="100"
          max="1000"
          value={animDuration}
          step="50"
          onChange={handleSpeedChange}
        />
        <span id="queue-speed-value">{animDuration}ms</span>
      </div>

      <div className="stack-edu-panel">
        <div className="stack-info" style={{ flexWrap: "wrap", gap: "14px" }}>
          <span>Queue Size: {visibleSize} / {QUEUE_SIZE}</span>
          <span>Front: {frontValue}</span>
          <span>Rear: {rearValue}</span>
          {isCircular && <span>Front Index: {front}</span>}
          {isCircular && <span>Rear Index: {rear}</span>}
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "999px",
              background:
                status === "Empty"
                  ? "rgba(239,68,68,0.18)"
                  : status === "Full"
                  ? "rgba(245,158,11,0.18)"
                  : "rgba(16,185,129,0.18)",
              color:
                status === "Empty"
                  ? "#f87171"
                  : status === "Full"
                  ? "#fbbf24"
                  : "#34d399",
              fontWeight: 700
            }}
          >
            {status}
          </span>
        </div>

        <div className="top-pointer">
          {visibleSize === 0
            ? `${isCircular ? "Circular Queue" : "Queue"} is empty`
            : `${isCircular ? "Circular Queue" : "Queue"} has ${visibleSize} element(s)`}
        </div>

        {warning && <div className="stack-warning show">{warning}</div>}

        <section className="queue-container" aria-label="Queue Visualization">
          <div className="queue-label-front">FRONT</div>

          {visibleSize === 0 ? (
  <div
    style={{
      textAlign: "center",
      padding: "2rem",
      color: "#9ca3af",
      fontSize: "1.1rem"
    }}
  >
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
            } ${val.value === null ? "empty-slot" : ""}`}
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
  <div className="queue-visualization">
    {displayQueue.map((val, i) => (
      <div
        key={i}
        className={`queue-block ${val.isFront ? "front" : ""} ${val.isRear ? "rear" : ""}`}
        style={{ transitionDuration: `${animDuration}ms`, opacity: val.value === null ? 0.35 : 1 }}
      >
        <div className="queue-value">{val.value === null ? "-" : val.value}</div>
        <div className="queue-index">Index {i}</div>
      </div>
    ))}
  </div>
)}
          <div className="queue-label-rear">REAR</div>
        </section>

        <div className="stack-log-panel">
          <div className="stack-log-title">Operation Log</div>
          <ul id="queue-log-list" className="stack-log-list">
            {log.map((msg, idx) => (
              <li key={idx} style={{ fontSize: "0.95rem" }}>
                {msg}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default QueueSimulation;