import React, { useMemo, useState, useEffect, useRef } from "react";

function parseInput(text) {
  return text.split(/,|\s+/).map(Number).filter((n) => !isNaN(n));
}

function generateBubbleSteps(a0) {
  const a = [...a0];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    array: [...a],
    info: "Initial state",
    comparisons,
    swaps,
    pass: 0,
    j: null
  });

  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    const pass = i + 1;

    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++;
      steps.push({
        array: [...a],
        info: `Compare ${a[j]} and ${a[j + 1]}`,
        comparisons,
        swaps,
        pass,
        j
      });

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        swapped = true;

        steps.push({
          array: [...a],
          info: `Swap ${a[j]} and ${a[j + 1]}`,
          comparisons,
          swaps,
          pass,
          j
        });
      }
    }

    if (!swapped) break;
  }

  steps.push({
    array: [...a],
    info: "Bubble Sort completed",
    comparisons,
    swaps,
    pass: null,
    j: null
  });

  return steps;
}

function generateSelectionSteps(a0) {
  const a = [...a0];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    array: [...a],
    info: "Initial state",
    comparisons,
    swaps,
    pass: 0,
    i: null,
    j: null,
    minIndex: null
  });

  let pass = 1;

  for (let i = 0; i < a.length - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < a.length; j++) {
      comparisons++;
      steps.push({
        array: [...a],
        info: `Compare ${a[j]} with current minimum ${a[minIndex]}`,
        comparisons,
        swaps,
        pass,
        i,
        j,
        minIndex
      });

      if (a[j] < a[minIndex]) {
        minIndex = j;
        steps.push({
          array: [...a],
          info: `New minimum found: ${a[minIndex]}`,
          comparisons,
          swaps,
          pass,
          i,
          j,
          minIndex
        });
      }
    }

    if (minIndex !== i) {
      [a[i], a[minIndex]] = [a[minIndex], a[i]];
      swaps++;
      steps.push({
        array: [...a],
        info: `Swap ${a[i]} into sorted position`,
        comparisons,
        swaps,
        pass,
        i,
        j: null,
        minIndex
      });
    }

    pass++;
  }

  steps.push({
    array: [...a],
    info: "Selection Sort completed",
    comparisons,
    swaps,
    pass: null,
    i: null,
    j: null,
    minIndex: null
  });

  return steps;
}

function generateInsertionSteps(a0) {
  const a = [...a0];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    array: [...a],
    info: "Initial state",
    comparisons,
    swaps,
    pass: 0,
    i: null,
    j: null,
    keyIndex: null,
    sortedEnd: null
  });

  let pass = 1;

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;

    steps.push({
      array: [...a],
      info: `Pick key ${key}`,
      comparisons,
      swaps,
      pass,
      i,
      j,
      keyIndex: i,
      sortedEnd: i - 1
    });

    while (j >= 0) {
      comparisons++;
      steps.push({
        array: [...a],
        info: `Compare key ${key} with ${a[j]}`,
        comparisons,
        swaps,
        pass,
        i,
        j,
        keyIndex: i,
        sortedEnd: i - 1
      });

      if (a[j] > key) {
        a[j + 1] = a[j];
        swaps++;
        steps.push({
          array: [...a],
          info: `Shift ${a[j]} right`,
          comparisons,
          swaps,
          pass,
          i,
          j,
          keyIndex: j,
          sortedEnd: i - 1
        });
        j--;
      } else {
        break;
      }
    }

    a[j + 1] = key;
    steps.push({
      array: [...a],
      info: `Insert key ${key} at position ${j + 1}`,
      comparisons,
      swaps,
      pass,
      i,
      j: j + 1,
      keyIndex: j + 1,
      sortedEnd: i
    });

    pass++;
  }

  steps.push({
    array: [...a],
    info: "Insertion Sort completed",
    comparisons,
    swaps,
    pass: null,
    i: null,
    j: null,
    keyIndex: null,
    sortedEnd: a.length - 1
  });

  return steps;
}

function AlgorithmPanel({ title, steps, currentIndex, type }) {
  const current = steps[currentIndex] || { array: [] };

  return (
    <div className="comparison-panel">
      <h3>{title}</h3>

      <div className="comparison-stats">
        <span>Comparisons: <b>{current.comparisons || 0}</b></span>
        <span>Swaps/Shifts: <b>{current.swaps || 0}</b></span>
        <span>Status: <b>{currentIndex >= steps.length - 1 ? "Done" : "Running"}</b></span>
      </div>

      <div className="comparison-info-box">
        {current.info || "Ready"}
      </div>

      <div className="comparison-workspace">
        {(current.array || []).map((v, i) => {
          let className = "cell";

          if (type === "selection") {
            if (i === current.i) className += " current-i";
            if (i === current.j) className += " scanning-j";
            if (i === current.minIndex) className += " min-index";
          } else if (type === "insertion") {
            if (i === current.keyIndex) className += " current-i";
            if (i === current.j) className += " scanning-j";
            if (i <= current.sortedEnd && current.sortedEnd !== undefined) className += " min-index";
          } else {
            if (i === current.j || i === current.j + 1) className += " active";
          }

          return (
            <div key={i} className={className}>
              {v}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SortingComparison() {
  const [input, setInput] = useState("5, 2, 9, 1, 6");
  const [speed, setSpeed] = useState(700);
  const [playing, setPlaying] = useState(false);

  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [selectionIndex, setSelectionIndex] = useState(0);
  const [insertionIndex, setInsertionIndex] = useState(0);

  const timerRef = useRef(null);

  const parsedArray = useMemo(() => parseInput(input), [input]);

  const bubbleSteps = useMemo(() => generateBubbleSteps(parsedArray), [parsedArray]);
  const selectionSteps = useMemo(() => generateSelectionSteps(parsedArray), [parsedArray]);
  const insertionSteps = useMemo(() => generateInsertionSteps(parsedArray), [parsedArray]);

  const maxSteps = Math.max(
    bubbleSteps.length,
    selectionSteps.length,
    insertionSteps.length
  );

  const resetAll = () => {
    setPlaying(false);
    clearInterval(timerRef.current);
    setBubbleIndex(0);
    setSelectionIndex(0);
    setInsertionIndex(0);
  };

  const startAll = () => {
    if (parsedArray.length < 2) return;
    resetAll();
    setPlaying(true);
  };

  const pauseAll = () => {
    setPlaying(false);
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!playing) return;

    timerRef.current = setInterval(() => {
      setBubbleIndex((prev) => (prev < bubbleSteps.length - 1 ? prev + 1 : prev));
      setSelectionIndex((prev) => (prev < selectionSteps.length - 1 ? prev + 1 : prev));
      setInsertionIndex((prev) => (prev < insertionSteps.length - 1 ? prev + 1 : prev));
    }, speed);

    return () => clearInterval(timerRef.current);
  }, [playing, speed, bubbleSteps.length, selectionSteps.length, insertionSteps.length]);

  useEffect(() => {
    if (
      bubbleIndex >= bubbleSteps.length - 1 &&
      selectionIndex >= selectionSteps.length - 1 &&
      insertionIndex >= insertionSteps.length - 1
    ) {
      setPlaying(false);
      clearInterval(timerRef.current);
    }
  }, [bubbleIndex, selectionIndex, insertionIndex, bubbleSteps.length, selectionSteps.length, insertionSteps.length]);

  return (
    <section className="card experiment">
      <h2>Comparison Visualizer</h2>
      <p style={{ marginBottom: "16px" }}>
        Run Bubble Sort, Selection Sort, and Insertion Sort side by side on the same input.
      </p>

      <div className="controls">
        <div>
          <label>Input Array</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ color: "#ffffff" }}
          />
        </div>

        <div className="buttons">
          <button className="btn primary" onClick={startAll}>Start Comparison</button>
          <button className="btn secondary" onClick={pauseAll}>Pause</button>
          <button className="btn danger" onClick={resetAll}>Reset</button>
        </div>
      </div>

      <div className="speed" style={{ marginBottom: "18px" }}>
        <label>Animation Speed: {speed} ms</label>
        <input
          type="range"
          min="200"
          max="1500"
          step="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </div>

      <div className="comparison-grid">
        <AlgorithmPanel
          title="Bubble Sort"
          steps={bubbleSteps}
          currentIndex={bubbleIndex}
          type="bubble"
        />
        <AlgorithmPanel
          title="Selection Sort"
          steps={selectionSteps}
          currentIndex={selectionIndex}
          type="selection"
        />
        <AlgorithmPanel
          title="Insertion Sort"
          steps={insertionSteps}
          currentIndex={insertionIndex}
          type="insertion"
        />
      </div>

      <div className="comparison-summary">
        <p><strong>Total Steps:</strong> {maxSteps}</p>
        <p>
          This view helps compare how each algorithm behaves on the same input and how their
          comparisons and swaps/shifts differ in practice.
        </p>
      </div>
    </section>
  );
}