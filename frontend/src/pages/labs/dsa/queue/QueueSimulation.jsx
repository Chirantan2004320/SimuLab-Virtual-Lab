import React from "react";

const QueueSimulation = ({
  displayQueue,
  queueType,
  queue,
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
    visibleSize > 0 && front !== -1 ? queue[front] : "Empty";

  const rearValue =
    visibleSize > 0 && rear !== -1 ? queue[rear] : "Empty";

  const status =
    visibleSize === 0
      ? "Empty"
      : visibleSize === QUEUE_SIZE
        ? "Full"
        : "Active";

  return (
    <section className="card experiment">
      <h2>
        Queue Simulation{" "}
        <span style={{ color: "#38bdf8" }}>
          ({isCircular ? "Circular Queue" : "Normal Queue"})
        </span>
      </h2>

      {/* INPUT + BUTTONS */}
      <div className="controls">
        <div>
          <label>Value</label>
          <input
            type="text"
            placeholder="Enter value"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enqueue()}
            ref={inputRef}
            disabled={animating}
          />
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={enqueue} disabled={animating}>
            ENQUEUE
          </button>
          <button className="btn danger" onClick={dequeue} disabled={animating}>
            DEQUEUE
          </button>
          <button className="btn info" onClick={peekFront} disabled={animating}>
            PEEK
          </button>
          <button className="btn secondary" onClick={reset} disabled={animating}>
            RESET
          </button>
          <button className="btn secondary" onClick={clearLog} disabled={animating}>
            CLEAR LOG
          </button>
        </div>
      </div>

      {/* SPEED */}
      <div style={{ marginBottom: 10 }}>
        <label>Animation Speed</label>
        <input
          type="range"
          min="100"
          max="1000"
          value={animDuration}
          step="50"
          onChange={handleSpeedChange}
        />
        <span style={{ marginLeft: 10 }}>{animDuration}ms</span>
      </div>

      {/* STATUS */}
      <div className="info-box">
        Queue Size: {visibleSize}/{QUEUE_SIZE} | Front: {frontValue} | Rear: {rearValue}
        <span style={{ marginLeft: 10, fontWeight: "bold" }}>({status})</span>
      </div>

      {/* VISUALIZATION */}
      <section className="queue-container">


        {visibleSize === 0 ? (
          <div style={{ color: "#9ca3af", padding: "2rem" }}>
            Queue is empty
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
                    className={`circular-queue-block ${val.isFront ? "front" : ""
                      } ${val.isRear ? "rear" : ""}`}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      transitionDuration: `${animDuration}ms`
                    }}
                  >
                    <div className="queue-value">{val.value ?? "-"}</div>
                    <div className="queue-index">{i}</div>
                    {val.isFront && <div className="circular-label front-label">F</div>}
                    {val.isRear && <div className="circular-label rear-label">R</div>}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="queue-visualization">
            {displayQueue.map((val, i) => (
              <div
                key={i}
                className={`queue-block ${val.isFront ? "front" : ""
                  } ${val.isRear ? "rear" : ""}`}
                style={{ transitionDuration: `${animDuration}ms` }}
              >
                {/* 🔥 FRONT POINTER */}
                {val.isFront && (
                  <div className="queue-pointer top">FRONT</div>
                )}

                <div className="queue-value">{val.value ?? "-"}</div>
                <div className="queue-index">{i}</div>

                {/* 🔥 REAR POINTER */}
                {val.isRear && (
                  <div className="queue-pointer bottom">REAR</div>
                )}
              </div>
            ))}


          </div>
        )}


      </section>

      {/* LOG */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Operation Log</h3>
        {log.length === 0 ? (
          <div style={{ color: "#9ca3af" }}>No operations yet</div>
        ) : (
          log.map((msg, i) => <div key={i}>{msg}</div>)
        )}
      </div>
    </section>
  );
};

export default QueueSimulation;