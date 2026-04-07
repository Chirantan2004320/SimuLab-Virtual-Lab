import React, { useMemo, useState } from "react";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";
import SimpleTable from "../../../../components/dbms/SimpleTable.jsx";

const defaultReferenceString = "7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2";
const defaultFrameCount = "3";

function FrameCell({ value, highlightType }) {
  let background = "rgba(15,23,42,0.4)";
  let border = "1px solid rgba(56,189,248,0.22)";
  let color = "#e5e7eb";

  if (highlightType === "hit") {
    background = "rgba(34,197,94,0.18)";
    border = "1px solid rgba(34,197,94,0.35)";
    color = "#dcfce7";
  } else if (highlightType === "fault") {
    background = "rgba(239,68,68,0.16)";
    border = "1px solid rgba(239,68,68,0.32)";
    color = "#fecaca";
  } else if (highlightType === "replace") {
    background = "rgba(250,204,21,0.20)";
    border = "1px solid rgba(250,204,21,0.35)";
    color = "#fef3c7";
  }

  return (
    <div
      style={{
        width: 78,
        minHeight: 78,
        borderRadius: 10,
        background,
        border,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: "1.15rem",
        color
      }}
    >
      {value === null || value === undefined ? "-" : value}
    </div>
  );
}

function ReferenceStrip({ references, currentIndex }) {
  return (
    <section className="card">
      <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Reference String</h3>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap"
        }}
      >
        {references.map((page, index) => (
          <div
            key={`${page}-${index}`}
            style={{
              width: 52,
              minHeight: 52,
              borderRadius: 10,
              background:
                index === currentIndex
                  ? "linear-gradient(135deg, rgba(250,204,21,0.22), rgba(234,179,8,0.16))"
                  : "rgba(15,23,42,0.4)",
              border:
                index === currentIndex
                  ? "2px solid rgba(250,204,21,0.4)"
                  : "1px solid rgba(56,189,248,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#e5e7eb",
              fontWeight: 800
            }}
          >
            {page}
          </div>
        ))}
      </div>
    </section>
  );
}

function FrameVisualization({ frames, lastAction, replacedPage }) {
  return (
    <section className="card">
      <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Current Frames</h3>

      <div
        style={{
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        {frames.map((frame, index) => {
          let highlightType = "";
          if (lastAction === "hit" && frame?.isCurrent) highlightType = "hit";
          if (lastAction === "fault" && frame?.isCurrent) highlightType = "fault";
          if (lastAction === "replace" && frame?.isCurrent) highlightType = "replace";

          return (
            <div
              key={`frame-${index}`}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
            >
              <FrameCell value={frame?.value ?? null} highlightType={highlightType} />
              <div style={{ color: "#94a3b8", fontSize: "0.82rem" }}>Frame {index + 1}</div>
            </div>
          );
        })}
      </div>

      {replacedPage !== null && replacedPage !== undefined && (
        <div
          style={{
            marginTop: 16,
            padding: "12px 14px",
            borderRadius: 8,
            background: "rgba(250,204,21,0.12)",
            border: "1px solid rgba(250,204,21,0.25)",
            color: "#fde68a",
            fontWeight: 600
          }}
        >
          Replaced page: {replacedPage}
        </div>
      )}
    </section>
  );
}

function parseReferenceString(input) {
  const parsed = input
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "")
    .map(Number)
    .filter((num) => !Number.isNaN(num));

  return parsed;
}

function simulateFIFO(referenceString, frameCount, addStep) {
  const frames = [];
  const timeline = [];
  const queue = [];
  let hits = 0;
  let faults = 0;

  referenceString.forEach((page, index) => {
    let action = "";
    let replacedPage = null;

    if (frames.includes(page)) {
      hits++;
      action = "hit";
      addStep(`Reference ${page}: page hit. Page already exists in memory.`);
    } else {
      faults++;
      if (frames.length < frameCount) {
        frames.push(page);
        queue.push(page);
        action = "fault";
        addStep(`Reference ${page}: page fault. Empty frame available, so page ${page} is inserted.`);
      } else {
        replacedPage = queue.shift();
        const replaceIndex = frames.indexOf(replacedPage);
        frames[replaceIndex] = page;
        queue.push(page);
        action = "replace";
        addStep(
          `Reference ${page}: page fault. FIFO replaces oldest page ${replacedPage} with ${page}.`
        );
      }
    }

    timeline.push({
      page,
      index,
      frames: frames.map((value) => ({ value, isCurrent: value === page })),
      action,
      replacedPage,
      hits,
      faults
    });
  });

  return { timeline, hits, faults };
}

function simulateLRU(referenceString, frameCount, addStep) {
  const frames = [];
  const recentUse = new Map();
  const timeline = [];
  let hits = 0;
  let faults = 0;

  referenceString.forEach((page, index) => {
    let action = "";
    let replacedPage = null;

    if (frames.includes(page)) {
      hits++;
      recentUse.set(page, index);
      action = "hit";
      addStep(`Reference ${page}: page hit. LRU updates recent use of page ${page}.`);
    } else {
      faults++;
      if (frames.length < frameCount) {
        frames.push(page);
        recentUse.set(page, index);
        action = "fault";
        addStep(`Reference ${page}: page fault. Empty frame available, so page ${page} is inserted.`);
      } else {
        let lruPage = frames[0];
        frames.forEach((framePage) => {
          if ((recentUse.get(framePage) ?? -1) < (recentUse.get(lruPage) ?? -1)) {
            lruPage = framePage;
          }
        });

        replacedPage = lruPage;
        const replaceIndex = frames.indexOf(lruPage);
        frames[replaceIndex] = page;
        recentUse.delete(lruPage);
        recentUse.set(page, index);
        action = "replace";
        addStep(
          `Reference ${page}: page fault. LRU replaces least recently used page ${replacedPage} with ${page}.`
        );
      }
    }

    timeline.push({
      page,
      index,
      frames: frames.map((value) => ({ value, isCurrent: value === page })),
      action,
      replacedPage,
      hits,
      faults
    });
  });

  return { timeline, hits, faults };
}

function simulateOptimal(referenceString, frameCount, addStep) {
  const frames = [];
  const timeline = [];
  let hits = 0;
  let faults = 0;

  referenceString.forEach((page, index) => {
    let action = "";
    let replacedPage = null;

    if (frames.includes(page)) {
      hits++;
      action = "hit";
      addStep(`Reference ${page}: page hit. Page already exists in memory.`);
    } else {
      faults++;
      if (frames.length < frameCount) {
        frames.push(page);
        action = "fault";
        addStep(`Reference ${page}: page fault. Empty frame available, so page ${page} is inserted.`);
      } else {
        let replaceIndex = -1;
        let farthest = -1;

        frames.forEach((framePage, frameIndex) => {
          const nextUse = referenceString.slice(index + 1).indexOf(framePage);

          if (nextUse === -1) {
            replaceIndex = frameIndex;
            farthest = Number.POSITIVE_INFINITY;
            return;
          }

          if (nextUse > farthest && farthest !== Number.POSITIVE_INFINITY) {
            farthest = nextUse;
            replaceIndex = frameIndex;
          }
        });

        replacedPage = frames[replaceIndex];
        frames[replaceIndex] = page;
        action = "replace";
        addStep(
          `Reference ${page}: page fault. Optimal replaces page ${replacedPage}, which is used farthest in future.`
        );
      }
    }

    timeline.push({
      page,
      index,
      frames: frames.map((value) => ({ value, isCurrent: value === page })),
      action,
      replacedPage,
      hits,
      faults
    });
  });

  return { timeline, hits, faults };
}

export default function PageReplacementSimulation({
  mode = "fifo",
  setExperimentRun
}) {
  const [referenceInput, setReferenceInput] = useState(defaultReferenceString);
  const [frameCount, setFrameCount] = useState(defaultFrameCount);
  const [message, setMessage] = useState("Page Replacement simulation initialized.");
  const [stepHistory, setStepHistory] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const references = useMemo(() => parseReferenceString(referenceInput), [referenceInput]);

  const currentStep =
    currentStepIndex >= 0 && currentStepIndex < timeline.length ? timeline[currentStepIndex] : null;

//   const addStep = (text) => {
//     setStepHistory((prev) => [...prev, text]);
//   };

  const loadSample = () => {
    setReferenceInput(defaultReferenceString);
    setFrameCount(defaultFrameCount);
    setMessage("Sample page reference string loaded.");
    setStepHistory(["Sample loaded for Page Replacement."]);
    setTimeline([]);
    setCurrentStepIndex(-1);
    if (setExperimentRun) setExperimentRun(false);
  };

  const reset = () => {
    setReferenceInput("");
    setFrameCount(defaultFrameCount);
    setMessage("Simulation reset.");
    setStepHistory([]);
    setTimeline([]);
    setCurrentStepIndex(-1);
    if (setExperimentRun) setExperimentRun(false);
  };

  const runSimulation = () => {
    const parsedReferences = parseReferenceString(referenceInput);
    const parsedFrameCount = Number(frameCount);

    if (!parsedReferences.length) {
      setMessage("Please enter a valid page reference string.");
      return;
    }

    if (Number.isNaN(parsedFrameCount) || parsedFrameCount <= 0) {
      setMessage("Please enter a valid positive number of frames.");
      return;
    }

    setStepHistory([]);
    setTimeline([]);
    setCurrentStepIndex(-1);

    const localSteps = [];
    const pushStep = (text) => {
      localSteps.push(text);
    };

    let result;

    if (mode === "fifo") {
      result = simulateFIFO(parsedReferences, parsedFrameCount, pushStep);
      setMessage("FIFO simulation completed.");
    } else if (mode === "lru") {
      result = simulateLRU(parsedReferences, parsedFrameCount, pushStep);
      setMessage("LRU simulation completed.");
    } else {
      result = simulateOptimal(parsedReferences, parsedFrameCount, pushStep);
      setMessage("Optimal simulation completed.");
    }

    setTimeline(result.timeline);
    setStepHistory(localSteps);
    setCurrentStepIndex(result.timeline.length ? result.timeline.length - 1 : -1);
    if (setExperimentRun) setExperimentRun(true);

    localStorage.setItem(
      "vlab_last_experiment",
      JSON.stringify({
        name: `page-replacement-${mode}`,
        time: Date.now()
      })
    );
  };

  const goPrev = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const goNext = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, timeline.length - 1));
  };

  const observationText =
    mode === "fifo"
      ? "FIFO replaces the oldest page in memory, regardless of how frequently it is used."
      : mode === "lru"
      ? "LRU replaces the page that has not been used for the longest time in the past."
      : "Optimal replaces the page that will be used farthest in the future, giving the minimum possible faults.";

  const stats = useMemo(() => {
    if (!currentStep) {
      return [
        { label: "References", value: references.length },
        { label: "Page Hits", value: 0 },
        { label: "Page Faults", value: 0 }
      ];
    }

    return [
      { label: "References", value: references.length },
      { label: "Page Hits", value: currentStep.hits },
      { label: "Page Faults", value: currentStep.faults }
    ];
  }, [currentStep, references.length]);

  const resultRows = timeline.map((step) => ({
    step: step.index + 1,
    reference: step.page,
    frames: step.frames.map((f) => f.value).join(" | "),
    action: step.action.toUpperCase(),
    replaced: step.replacedPage ?? "-"
  }));

  return (
    <>
      <section className="card experiment">
        <h2>
          Simulation <span style={{ color: "#38bdf8" }}>({mode.toUpperCase()})</span>
        </h2>

        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#e5e7eb",
                fontWeight: 600
              }}
            >
              Page Reference String
            </label>
            <input
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value)}
              className="lab-input"
              style={{ width: "100%" }}
              placeholder="Enter pages like 7, 0, 1, 2, 0, 3, 0, 4"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#e5e7eb",
                fontWeight: 600
              }}
            >
              Number of Frames
            </label>
            <input
              value={frameCount}
              onChange={(e) => setFrameCount(e.target.value)}
              className="lab-input"
              style={{ width: "220px" }}
              placeholder="Enter frame count"
            />
          </div>

          <div className="buttons">
            <button className="btn primary" onClick={runSimulation}>
              Run Simulation
            </button>

            <button className="btn info" onClick={loadSample}>
              Load Sample
            </button>

            <button className="btn secondary" onClick={reset}>
              Reset
            </button>
          </div>
        </div>

        <div className="info-box" style={{ marginTop: 16 }}>
          {message}
        </div>

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16
          }}
        >
          {stats.map((stat) => (
            <InfoStatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>

        <ObservationBox text={observationText} />
      </section>

      <ReferenceStrip
        references={references}
        currentIndex={currentStep ? currentStep.index : -1}
      />

      <FrameVisualization
        frames={
          currentStep
            ? currentStep.frames
            : Array.from({ length: Number(frameCount) || 0 }, () => ({
                value: null,
                isCurrent: false
              }))
        }
        lastAction={currentStep?.action || ""}
        replacedPage={currentStep?.replacedPage ?? null}
      />

      <section className="card">
        <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Step Controls</h3>

        <div className="buttons">
          <button
            className="btn secondary"
            onClick={goPrev}
            disabled={!timeline.length || currentStepIndex <= 0}
          >
            Previous Step
          </button>

          <button
            className="btn secondary"
            onClick={goNext}
            disabled={!timeline.length || currentStepIndex >= timeline.length - 1}
          >
            Next Step
          </button>
        </div>

        {currentStep && (
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(15,23,42,0.45)",
              border: "1px solid rgba(56,189,248,0.22)",
              color: "#e5e7eb"
            }}
          >
            <strong>Current Reference:</strong> {currentStep.page} <br />
            <strong>Action:</strong> {currentStep.action.toUpperCase()}
          </div>
        )}
      </section>

      <SimpleTable title="Simulation Result Table" rows={resultRows} />
      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}