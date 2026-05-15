import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Play,
  RotateCcw,
  Activity,
  Gauge,
  MemoryStick,
  Layers,
  Sparkles,
  ShieldCheck,
  Pause,
  ChevronRight,
  HardDrive,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const modeMeta = {
  fifo: {
    name:
      "FIFO Page Replacement",

    type:
      "Queue Based Replacement",

    complexity:
      "O(n)",

    space:
      "O(frame size)",

    insight:
      "FIFO replaces the oldest page currently loaded in memory regardless of usage frequency.",
  },

  lru: {
    name:
      "Least Recently Used",

    type:
      "History Based Replacement",

    complexity:
      "O(n²)",

    space:
      "O(frame size)",

    insight:
      "LRU replaces the page that has not been used for the longest duration in the past.",
  },

  optimal: {
    name:
      "Optimal Page Replacement",

    type:
      "Future Prediction Replacement",

    complexity:
      "O(n²)",

    space:
      "O(frame size)",

    insight:
      "Optimal replaces the page whose next usage occurs farthest in the future.",
  },
};

const defaultReferenceString =
  "7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2";

const defaultFrameCount =
  "3";

function FrameCard({
  value,
  active,
  type,
}) {

  let background =
    "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(30,41,59,0.88))";

  let border =
    "1px solid rgba(56,189,248,0.25)";

  let glow =
    "none";

  if (type === "hit") {

    background =
      "linear-gradient(135deg, rgba(34,197,94,0.25), rgba(16,185,129,0.18))";

    border =
      "2px solid rgba(34,197,94,0.6)";

    glow =
      "0 0 24px rgba(34,197,94,0.35)";
  }

  if (type === "fault") {

    background =
      "linear-gradient(135deg, rgba(239,68,68,0.25), rgba(220,38,38,0.18))";

    border =
      "2px solid rgba(239,68,68,0.6)";

    glow =
      "0 0 24px rgba(239,68,68,0.35)";
  }

  if (type === "replace") {

    background =
      "linear-gradient(135deg, rgba(250,204,21,0.25), rgba(249,115,22,0.18))";

    border =
      "2px solid rgba(250,204,21,0.7)";

    glow =
      "0 0 30px rgba(250,204,21,0.35)";
  }

  return (
    <div
      style={{
        width: 130,

        height: 150,

        borderRadius: 20,

        background,

        border,

        boxShadow:
          glow,

        display:
          "flex",

        flexDirection:
          "column",

        justifyContent:
          "center",

        alignItems:
          "center",

        transition:
          "all 0.45s ease",

        transform: active
          ? "translateY(-10px) scale(1.05)"
          : "translateY(0px)",
      }}
    >

      <HardDrive
        size={28}
        color="#ffffff"
        style={{
          marginBottom: 14,
        }}
      />

      <div
        style={{
          color:
            "#ffffff",

          fontSize:
            "1.5rem",

          fontWeight:
            800,
        }}
      >

        {value ?? "-"}

      </div>

    </div>
  );
}

export default function PageReplacementSimulation({
  mode =
    "fifo",

  setExperimentRun,
}) {

  const meta =
    modeMeta[mode];

  const [message, setMessage] =
    useState(
      "Simulation initialized."
    );

  const [steps, setSteps] =
    useState([]);

  const [stepIndex, setStepIndex] =
    useState(0);

  const [,setRunning] =
    useState(false);

  const timerRef =
    useRef(null);

  const [
    referenceInput,
    setReferenceInput,
  ] = useState(
    defaultReferenceString
  );

  const [
    frameCount,
    setFrameCount,
  ] = useState(
    defaultFrameCount
  );

  const [
    frames,
    setFrames,
  ] = useState([]);

  const [
    currentReference,
    setCurrentReference,
  ] = useState(null);

  const [
    pageHits,
    setPageHits,
  ] = useState(0);

  const [
    pageFaults,
    setPageFaults,
  ] = useState(0);

  const [
    replacedPage,
    setReplacedPage,
  ] = useState(null);

  const [
    actionType,
    setActionType,
  ] = useState("");

  const parseReferences =
    () => {

      return referenceInput
        .split(",")
        .map(
          (item) =>
            Number(
              item.trim()
            )
        )
        .filter(
          (num) =>
            !Number.isNaN(
              num
            )
        );
    };

  const reset =
    () => {

      clearInterval(
        timerRef.current
      );

      setRunning(false);

      setMessage(
        "Simulation reset."
      );

      setSteps([]);

      setStepIndex(0);

      setFrames([]);

      setCurrentReference(
        null
      );

      setPageHits(0);

      setPageFaults(0);

      setReplacedPage(
        null
      );

      setActionType("");
    };

  const generateSteps =
    () => {

      const refs =
        parseReferences();

      const maxFrames =
        Number(
          frameCount
        );

      const generatedSteps =
        [];

      const localFrames =
        [];

      const queue = [];

      const recentUse =
        new Map();

      let hits = 0;

      let faults = 0;

      refs.forEach(
        (
          page,
          index
        ) => {

          let action =
            "fault";

          let replaced =
            null;

          if (
            localFrames.includes(
              page
            )
          ) {

            hits++;

            action =
              "hit";

            recentUse.set(
              page,
              index
            );

            generatedSteps.push(
              {
                text: `Reference ${page}: Page Hit detected.`,

                frames:
                  [
                    ...localFrames,
                  ],

                current:
                  page,

                action:
                  "hit",

                replaced:
                  null,

                hits,

                faults,
              }
            );

            return;
          }

          faults++;

          if (
            localFrames.length <
            maxFrames
          ) {

            localFrames.push(
              page
            );

            queue.push(
              page
            );

            recentUse.set(
              page,
              index
            );

          } else {

            if (
              mode ===
              "fifo"
            ) {

              replaced =
                queue.shift();

              const replaceIndex =
                localFrames.indexOf(
                  replaced
                );

              localFrames[
                replaceIndex
              ] = page;

              queue.push(
                page
              );
            }

            else if (
              mode ===
              "lru"
            ) {

              let lruPage =
                localFrames[0];

              localFrames.forEach(
                (
                  framePage
                ) => {

                  if (
                    (
                      recentUse.get(
                        framePage
                      ) ??
                      -1
                    ) <
                    (
                      recentUse.get(
                        lruPage
                      ) ??
                      -1
                    )
                  ) {

                    lruPage =
                      framePage;
                  }
                }
              );

              replaced =
                lruPage;

              const replaceIndex =
                localFrames.indexOf(
                  lruPage
                );

              localFrames[
                replaceIndex
              ] = page;

              recentUse.delete(
                lruPage
              );

              recentUse.set(
                page,
                index
              );
            }

            else {

              let farthest =
                -1;

              let replaceIndex =
                0;

              localFrames.forEach(
                (
                  framePage,
                  frameIndex
                ) => {

                  const nextUse =
                    refs
                      .slice(
                        index +
                          1
                      )
                      .indexOf(
                        framePage
                      );

                  if (
                    nextUse ===
                    -1
                  ) {

                    replaceIndex =
                      frameIndex;

                    farthest =
                      Infinity;

                    return;
                  }

                  if (
                    nextUse >
                      farthest &&
                    farthest !==
                      Infinity
                  ) {

                    farthest =
                      nextUse;

                    replaceIndex =
                      frameIndex;
                  }
                }
              );

              replaced =
                localFrames[
                  replaceIndex
                ];

              localFrames[
                replaceIndex
              ] = page;
            }

            action =
              "replace";
          }

          generatedSteps.push(
            {
              text:
                replaced !==
                null
                  ? `Reference ${page}: Replaced page ${replaced} with ${page}.`
                  : `Reference ${page}: Page Fault occurred.`,

              frames:
                [
                  ...localFrames,
                ],

              current:
                page,

              action,

              replaced,

              hits,

              faults,
            }
          );
        }
      );

      return generatedSteps;
    };

  const runSimulation =
    () => {

      reset();

      const simulationSteps =
        generateSteps();

      if (
        simulationSteps.length ===
        0
      ) {

        setMessage(
          "Please enter valid references."
        );

        return;
      }

      setRunning(true);

      let current = 0;

      const applyStep =
        (
          step
        ) => {

          setFrames(
            step.frames
          );

          setCurrentReference(
            step.current
          );

          setPageHits(
            step.hits
          );

          setPageFaults(
            step.faults
          );

          setReplacedPage(
            step.replaced
          );

          setActionType(
            step.action
          );

          setMessage(
            step.text
          );

          setSteps(
            (prev) => [
              ...prev,
              step.text,
            ]
          );
        };

      applyStep(
        simulationSteps[0]
      );

      timerRef.current =
        setInterval(
          () => {

            current++;

            if (
              current >=
              simulationSteps.length
            ) {

              clearInterval(
                timerRef.current
              );

              setRunning(
                false
              );

              if (
                setExperimentRun
              ) {

                setExperimentRun(
                  true
                );
              }

              return;
            }

            applyStep(
              simulationSteps[
                current
              ]
            );

            setStepIndex(
              current
            );

          },
          1800
        );
    };

  const pauseSimulation =
    () => {

      clearInterval(
        timerRef.current
      );

      setRunning(false);
    };

  useEffect(() => {

    return () =>
      clearInterval(
        timerRef.current
      );

  }, []);

  const stats =
    useMemo(
      () => [

        {
          label:
            "Frames",

          value:
            frameCount,
        },

        {
          label:
            "Page Hits",

          value:
            pageHits,
        },

        {
          label:
            "Page Faults",

          value:
            pageFaults,
        },

      ],
      [
        frameCount,
        pageHits,
        pageFaults,
      ]
    );

  return (
    <section className="sorting-sim-card">

      <style>
        {`
          @keyframes glowPulse {
            0% {
              box-shadow: 0 0 0px rgba(59,130,246,0.2);
            }

            50% {
              box-shadow: 0 0 24px rgba(59,130,246,0.6);
            }

            100% {
              box-shadow: 0 0 0px rgba(59,130,246,0.2);
            }
          }
        `}
      </style>

      <div className="sorting-sim-header">

        <div className="sorting-sim-title-wrap">

          <div className="sorting-sim-icon">

            <Activity size={18} />

          </div>

          <div>

            <h2 className="sorting-sim-title">
              Simulation
            </h2>

            <p className="sorting-sim-subtitle">
              Advanced animated visualization for Page Replacement algorithms.
            </p>

          </div>

        </div>

      </div>

      <div
        className="overview-grid"
        style={{
          marginBottom: 20,
        }}
      >

        <div className="overview-card">

          <div className="overview-card-head">

            <Gauge size={18} />

            <h4>Complexity</h4>

          </div>

          <p>
            {
              meta.complexity
            }
          </p>

        </div>

        <div className="overview-card">

          <div className="overview-card-head">

            <MemoryStick
              size={18}
            />

            <h4>Space</h4>

          </div>

          <p>
            {meta.space}
          </p>

        </div>

        <div className="overview-card">

          <div className="overview-card-head">

            <ShieldCheck
              size={18}
            />

            <h4>Type</h4>

          </div>

          <p>
            {meta.type}
          </p>

        </div>

      </div>

      <div
        className="sorting-info-box"
        style={{
          marginBottom: 20,
        }}
      >

        <Sparkles
          size={16}
          style={{
            marginRight: 10,
          }}
        />

        {meta.insight}

      </div>

      <div
        style={{
          display:
            "grid",

          gap: 16,

          marginBottom: 24,
        }}
      >

        <div>

          <label className="sorting-label">
            Reference String
          </label>

          <input
            value={
              referenceInput
            }
            onChange={(e) =>
              setReferenceInput(
                e.target.value
              )
            }
            className="sorting-input"
            placeholder="7, 0, 1, 2, 0, 3"
          />

        </div>

        <div>

          <label className="sorting-label">
            Number of Frames
          </label>

          <input
            value={
              frameCount
            }
            onChange={(e) =>
              setFrameCount(
                e.target.value
              )
            }
            className="sorting-input"
            placeholder="3"
          />

        </div>

      </div>

      <div
        className="sorting-btn-group"
        style={{
          marginBottom: 24,
        }}
      >

        <button
          className="sim-btn sim-btn-primary"
          onClick={
            runSimulation
          }
        >

          <Play size={16} />

          Start

        </button>

        <button
          className="sim-btn sim-btn-muted"
          onClick={
            pauseSimulation
          }
        >

          <Pause size={16} />

          Pause

        </button>

        <button
          className="sim-btn sim-btn-danger"
          onClick={
            reset
          }
        >

          <RotateCcw
            size={16}
          />

          Reset

        </button>

      </div>

      <div
        className="sorting-info-box"
        style={{
          animation:
            "glowPulse 2.5s infinite",
        }}
      >

        <ChevronRight
          size={16}
          style={{
            marginRight: 10,
          }}
        />

        {message}

      </div>

      <div
        className="sorting-stats-grid"
        style={{
          marginTop: 24,
        }}
      >

        {stats.map(
          (
            stat
          ) => (

            <div
              key={
                stat.label
              }
              className="sorting-stat-box"
            >

              <span className="sorting-stat-label">
                {
                  stat.label
                }
              </span>

              <span className="sorting-stat-value">
                {
                  stat.value
                }
              </span>

            </div>
          )
        )}

      </div>

      <div
        style={{
          marginTop: 40,
        }}
      >

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "center",

            gap: 24,

            flexWrap:
              "wrap",
          }}
        >

          {Array.from({
            length:
              Number(
                frameCount
              ) || 0,
          }).map(
            (
              _,
              index
            ) => {

              const value =
                frames[
                  index
                ];

              return (

                <FrameCard
                  key={index}
                  value={
                    value
                  }
                  active={
                    value ===
                    currentReference
                  }
                  type={
                    actionType
                  }
                />
              );
            }
          )}

        </div>

      </div>

      {replacedPage !==
        null && (

        <div
          className="sorting-info-box"
          style={{
            marginTop: 24,

            border:
              "1px solid rgba(250,204,21,0.35)",

            background:
              "rgba(250,204,21,0.12)",

            color:
              "#fde68a",
          }}
        >

          <ArrowRightLeft
            size={16}
            style={{
              marginRight: 10,
            }}
          />

          Replaced Page:
          {" "}
          {replacedPage}

        </div>
      )}

      {actionType ===
        "hit" && (

        <div
          className="sorting-info-box"
          style={{
            marginTop: 24,

            border:
              "1px solid rgba(34,197,94,0.35)",

            background:
              "rgba(34,197,94,0.12)",

            color:
              "#dcfce7",
          }}
        >

          <CheckCircle2
            size={16}
            style={{
              marginRight: 10,
            }}
          />

          Page Hit occurred for reference{" "}
          {
            currentReference
          }

        </div>
      )}

      {(actionType ===
        "fault" ||
        actionType ===
          "replace") && (

        <div
          className="sorting-info-box"
          style={{
            marginTop: 24,

            border:
              "1px solid rgba(239,68,68,0.35)",

            background:
              "rgba(239,68,68,0.12)",

            color:
              "#fecaca",
          }}
        >

          <AlertTriangle
            size={16}
            style={{
              marginRight: 10,
            }}
          />

          Page Fault occurred for reference{" "}
          {
            currentReference
          }

        </div>
      )}

      <div
        className="overview-card overview-steps-card"
        style={{
          marginTop: 40,
        }}
      >

        <div className="overview-card-head">

          <Layers size={18} />

          <h4>
            Execution Steps
          </h4>

        </div>

        <ol className="overview-steps-list">

          {steps.length ===
          0 ? (

            <li>

              <span>
                Start the
                simulation to
                visualize Page
                Replacement flow.
              </span>

            </li>

          ) : (

            steps.map(
              (
                step,
                index
              ) => (

                <li
                  key={
                    index
                  }
                  style={{
                    opacity:
                      index <=
                      stepIndex
                        ? 1
                        : 0.4,

                    transform:
                      index ===
                      stepIndex
                        ? "translateX(8px)"
                        : "translateX(0px)",

                    transition:
                      "all 0.35s ease",
                  }}
                >

                  <span className="overview-step-index">
                    {index + 1}
                  </span>

                  <span>
                    {step}
                  </span>

                </li>
              )
            )
          )}

        </ol>

      </div>

    </section>
  );
}