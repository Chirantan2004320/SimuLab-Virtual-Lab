import React from "react";
import { Activity, Plus, Search, Trash2, FlaskConical, RotateCcw } from "lucide-react";

function ChainNode({ value, isActive }) {
  return (
    <div className={`hash-chain-node ${isActive ? "active" : ""}`}>
      {value}
    </div>
  );
}

function StepHistoryPanel({ stepHistory }) {
  return (
    <div className="hash-history-card">
      <div className="hash-history-title">Step History</div>

      {stepHistory.length === 0 ? (
        <div className="hash-history-empty">Operation steps will appear here.</div>
      ) : (
        <div className="hash-history-list">
          {stepHistory.map((step, index) => (
            <div key={index} className="hash-history-item">
              <strong>{index + 1}.</strong> {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HashTableSimulation({
  table,
  input,
  setInput,
  insert,
  search,
  remove,
  reset,
  loadSample,
  message,
  activeBucket,
  activeValue,
  inputRef,
  stepHistory,
  tableSize,
  isRunning
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
              Visualize hashing, collisions, and separate chaining bucket by bucket.
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
            placeholder="Enter number"
            className="sorting-input"
            disabled={isRunning}
          />
        </div>

        <div className="sorting-btn-group">
          <button className="sim-btn sim-btn-primary" onClick={insert} disabled={isRunning}>
            <Plus size={16} />
            Insert
          </button>

          <button className="sim-btn sim-btn-muted" onClick={search} disabled={isRunning}>
            <Search size={16} />
            Search
          </button>

          <button className="sim-btn sim-btn-danger" onClick={remove} disabled={isRunning}>
            <Trash2 size={16} />
            Delete
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

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Table Size</span>
          <span className="sorting-stat-value">{tableSize}</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Filled Buckets</span>
          <span className="sorting-stat-value">
            {table.filter((bucket) => bucket.length > 0).length}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Stored Keys</span>
          <span className="sorting-stat-value">
            {table.reduce((sum, bucket) => sum + bucket.length, 0)}
          </span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Collision Buckets</span>
          <span className="sorting-stat-value">
            {table.filter((bucket) => bucket.length > 1).length}
          </span>
        </div>
      </div>

      <div className="sorting-info-box">{message || "Perform an operation to begin."}</div>

      <div className="hash-panel-card">
        <div className="hash-panel-title">Bucket Visualization (Table Size = {tableSize})</div>

        <div className="hash-bucket-list">
          {table.map((bucket, i) => (
            <div
              key={i}
              className={`hash-bucket-row ${activeBucket === i ? "active" : ""}`}
            >
              <div className="hash-bucket-index">{i}</div>

              <div className="hash-bucket-arrow">→</div>

              {bucket.length === 0 ? (
                <div className="hash-bucket-empty">Empty</div>
              ) : (
                <div className="hash-chain-wrap">
                  {bucket.map((value, index) => (
                    <React.Fragment key={`${value}-${index}`}>
                      <ChainNode
                        value={value}
                        isActive={activeBucket === i && activeValue === value}
                      />
                      {index < bucket.length - 1 && (
                        <div className="hash-chain-arrow">→</div>
                      )}
                    </React.Fragment>
                  ))}
                  <div className="hash-chain-null">NULL</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <StepHistoryPanel stepHistory={stepHistory} />
    </section>
  );
}