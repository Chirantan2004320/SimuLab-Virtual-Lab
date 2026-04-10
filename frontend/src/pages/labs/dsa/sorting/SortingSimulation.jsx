import React from 'react';

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
  prevStep,
  selectedExp,
  hasAccess
}) => {
  const highlight = current.j;

  return (
    <section className="card experiment">
      <h2>Experiment</h2>

      <div className="controls">
        <div>
          <label>Input Array</label>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ color: "#ffffff" }}
          />
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={start} disabled={selectedExp && selectedExp.requiresPayment && !hasAccess}>Start</button>
          <button className="btn secondary" onClick={pause}>Pause</button>
          <button className="btn danger" onClick={reset}>Reset</button>
          <button className="btn secondary" onClick={prevStep} disabled={idx === 0 || steps.length === 0}>Previous</button>
          <button className="btn secondary" onClick={nextStep} disabled={idx >= steps.length - 1 || steps.length === 0}>Next</button>
        </div>
      </div>

      <div className="stats">
        <span>Comparisons: <b>{comparisons}</b></span>
        <span>Swaps/Shifts: <b>{swaps}</b></span>
        {current.pass && <span>Pass: <b>{current.pass}</b></span>}
        <span>Step: <b>{idx}</b> / {steps.length - 1}</span>
      </div>

      <div className="info-box">
        {info || "Click Start to begin the experiment"}
      </div>

      <div className="workspace">
        {(current.array || []).map((v, i) => {
          let className = "cell";

          if (selectedAlgorithm === "selection") {
            if (i === current.i) className += " current-i";
            if (i === current.j) className += " scanning-j";
            if (i === current.minIndex) className += " min-index";
          } else if (selectedAlgorithm === "insertion") {
            if (i === current.keyIndex) className += " current-i";
            if (i === current.j) className += " scanning-j";
            if (i <= current.sortedEnd && current.sortedEnd !== undefined) className += " min-index";
          } else {
            if (i === highlight || i === highlight + 1) className += " active";
          }

          return (
            <div key={i} className={className}>
              {v}
            </div>
          );
        })}
      </div>

      <div className="speed">
        <label>Animation Speed: {speed} ms</label>
        <input
          type="range"
          min="200"
          max="1500"
          step="100"
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
        />
      </div>
    </section>
  );
};

export default SortingSimulation;