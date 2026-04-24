import React from "react";
import {
  Activity,
  Plus,
  Trash2,
  Eye,
  Square,
  FlaskConical,
  RotateCcw
} from "lucide-react";

function ArrayCell({ value, index, isActive, isSwapped }) {
  let className = "heap-array-cell";
  if (isSwapped) className += " swapped";
  if (isActive) className += " active";

  return (
    <div className={className}>
      <div className="heap-array-value">{value}</div>
      <div className="heap-array-index">idx {index}</div>
    </div>
  );
}

function HeapNodeCard({ value, isActive, isSwapped }) {
  return (
    <div className={`heap-node-card ${isSwapped ? "swapped" : ""} ${isActive ? "active" : ""}`}>
      {value}
    </div>
  );
}

function RenderHeapTree({ heap, index, activeIndices, swappedIndices, isRoot = false }) {
  if (index >= heap.length) return null;

  const left = 2 * index + 1;
  const right = 2 * index + 2;

  const isActive = activeIndices.includes(index);
  const isSwapped = swappedIndices.includes(index);

  return (
    <div className="heap-node-wrapper">
      <div className="heap-node-top-wrap">
        {isRoot && <div className="heap-root-badge">ROOT</div>}
        <HeapNodeCard value={heap[index]} isActive={isActive} isSwapped={isSwapped} />
      </div>

      {(left < heap.length || right < heap.length) && (
        <>
          <div className="heap-connector-down" />
          <div className="heap-connector-branch" />

          <div className="heap-children-row">
            <div className="heap-child-slot">
              {left < heap.length ? (
                <RenderHeapTree
                  heap={heap}
                  index={left}
                  activeIndices={activeIndices}
                  swappedIndices={swappedIndices}
                />
              ) : (
                <div className="heap-null-tag">NULL</div>
              )}
            </div>

            <div className="heap-child-slot">
              {right < heap.length ? (
                <RenderHeapTree
                  heap={heap}
                  index={right}
                  activeIndices={activeIndices}
                  swappedIndices={swappedIndices}
                />
              ) : (
                <div className="heap-null-tag">NULL</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StepHistoryPanel({ stepHistory }) {
  return (
    <div className="heap-history-card">
      <div className="heap-history-title">Step History</div>

      {stepHistory.length === 0 ? (
        <div className="heap-history-empty">Heap steps will appear here.</div>
      ) : (
        <div className="heap-history-list">
          {stepHistory.map((step, index) => (
            <div key={index} className="heap-history-item">
              <strong>{index + 1}.</strong> {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HeapSimulation({
  heapType,
  heap,
  input,
  setInput,
  animateInsert,
  animateExtractRoot,
  peekRoot,
  stopAnimation,
  loadSampleHeap,
  reset,
  message,
  inputRef,
  activeIndices,
  swappedIndices,
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
              Visualize {heapType === "min" ? "Min Heap" : "Max Heap"} operations through array and tree representation.
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
          <button className="sim-btn sim-btn-primary" onClick={animateInsert} disabled={isRunning}>
            <Plus size={16} />
            Insert
          </button>

          <button className="sim-btn sim-btn-danger" onClick={animateExtractRoot} disabled={isRunning}>
            <Trash2 size={16} />
            Extract {heapType === "min" ? "Min" : "Max"}
          </button>

          <button className="sim-btn sim-btn-muted" onClick={peekRoot} disabled={isRunning}>
            <Eye size={16} />
            Peek
          </button>

          <button className="sim-btn sim-btn-danger" onClick={stopAnimation} disabled={!isRunning}>
            <Square size={16} />
            Stop
          </button>

          <button className="sim-btn sim-btn-muted" onClick={loadSampleHeap} disabled={isRunning}>
            <FlaskConical size={16} />
            Load Sample
          </button>

          <button className="sim-btn sim-btn-muted" onClick={reset} disabled={isRunning}>
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="sorting-info-box">{message || "Perform a heap operation to begin."}</div>

      <div className="heap-panel-card">
        <div className="heap-panel-title">Array Representation</div>

        {heap.length === 0 ? (
          <div className="heap-empty-state">Heap array is empty.</div>
        ) : (
          <div className="heap-array-row">
            {heap.map((value, index) => (
              <ArrayCell
                key={`${value}-${index}`}
                value={value}
                index={index}
                isActive={activeIndices.includes(index)}
                isSwapped={swappedIndices.includes(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="heap-panel-card">
        <div className="heap-panel-title">Tree Representation</div>

        <div className="sorting-visualizer-wrap heap-visualizer-wrap">
          {heap.length === 0 ? (
            <div className="linked-empty-state">
              <div className="linked-empty-icon">⛰️</div>
              <div className="linked-empty-title">Heap tree is empty</div>
              <div className="linked-empty-subtitle">
                Insert values or load a sample heap to start visualization.
              </div>
            </div>
          ) : (
            <div className="heap-tree-shell">
              <RenderHeapTree
                heap={heap}
                index={0}
                activeIndices={activeIndices}
                swappedIndices={swappedIndices}
                isRoot
              />
            </div>
          )}
        </div>
      </div>

      <StepHistoryPanel stepHistory={stepHistory} />
    </section>
  );
}