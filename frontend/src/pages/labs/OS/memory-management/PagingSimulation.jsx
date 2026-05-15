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
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle2,
  Database,
} from "lucide-react";

const modeMeta = {
  paging: {
    name:
      "Paging Memory Management",

    type:
      "Fixed Size Allocation",

    complexity:
      "O(1)",

    space:
      "O(Page Table)",

    insight:
      "Paging divides logical memory into pages and physical memory into frames for efficient memory allocation.",
  },

  segmentation: {
    name:
      "Segmentation",

    type:
      "Variable Size Allocation",

    complexity:
      "O(1)",

    space:
      "O(Segment Table)",

    insight:
      "Segmentation divides memory into logical units like code, data, and stack segments.",
  },

  virtual: {
    name:
      "Virtual Memory",

    type:
      "Demand Paging",

    complexity:
      "O(1)",

    space:
      "O(Page Table + Swap)",

    insight:
      "Virtual memory allows execution of large processes beyond physical RAM using secondary storage.",
  },
};

const defaultAddresses =
  "12, 25, 33, 18, 41, 9, 27";

const defaultFrameSize =
  "8";

function MemoryCard({
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

  return (
    <div
      style={{
        width: 140,

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

      <Database
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
            "1.4rem",

          fontWeight:
            800,
        }}
      >

        {value ?? "-"}

      </div>

    </div>
  );
}

export default function PagingSimulation({
  mode =
    "paging",

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

  const [, setRunning] =
    useState(false);

  const timerRef =
    useRef(null);

  const [
    addressInput,
    setAddressInput,
  ] = useState(
    defaultAddresses
  );

  const [
    frameSize,
    setFrameSize,
  ] = useState(
    defaultFrameSize
  );

  const [
    frames,
    setFrames,
  ] = useState([]);

  const [
    currentAddress,
    setCurrentAddress,
  ] = useState(null);

  const [
    translatedAddress,
    setTranslatedAddress,
  ] = useState(null);

  const [
    pageFaults,
    setPageFaults,
  ] = useState(0);

  const [
    pageHits,
    setPageHits,
  ] = useState(0);

  const [
    actionType,
    setActionType,
  ] = useState("");

  const parseAddresses =
    () => {

      return addressInput
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

      setCurrentAddress(
        null
      );

      setTranslatedAddress(
        null
      );

      setPageFaults(0);

      setPageHits(0);

      setActionType("");
    };

  const generateSteps =
    () => {

      const addresses =
        parseAddresses();

      const frame =
        Number(
          frameSize
        );

      const generatedSteps =
        [];

      const loadedPages =
        [];

      let faults = 0;

      let hits = 0;

      addresses.forEach(
        (
          address,
          index
        ) => {

          const page =
            Math.floor(
              address /
                frame
            );

          const offset =
            address %
            frame;

          let action =
            "fault";

          if (
            loadedPages.includes(
              page
            )
          ) {

            hits++;

            action =
              "hit";

          } else {

            faults++;

            loadedPages.push(
              page
            );
          }

          generatedSteps.push(
            {
              text:
                mode ===
                "paging"
                  ? `Logical Address ${address} mapped to Page ${page} with Offset ${offset}.`
                  : mode ===
                    "segmentation"
                  ? `Address ${address} translated using Segment ${page} and Offset ${offset}.`
                  : `Virtual Address ${address} loaded into memory frame.`,

              frames:
                [
                  ...loadedPages,
                ],

              current:
                address,

              translated:
                `${page}:${offset}`,

              action,

              hits,

              faults,
            }
          );

          if (
            mode ===
              "virtual" &&
            index % 3 ===
              2
          ) {

            generatedSteps.push(
              {
                text:
                  `Page Fault occurred while accessing virtual page ${page}. Page loaded from secondary storage.`,

                frames:
                  [
                    ...loadedPages,
                  ],

                current:
                  address,

                translated:
                  `${page}:${offset}`,

                action:
                  "fault",

                hits,

                faults,
              }
            );
          }
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
          "Please enter valid addresses."
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

          setCurrentAddress(
            step.current
          );

          setTranslatedAddress(
            step.translated
          );

          setPageHits(
            step.hits
          );

          setPageFaults(
            step.faults
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

            current += 1;

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
            "Frame Size",

          value:
            frameSize,
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
        frameSize,
        pageHits,
        pageFaults,
      ]
    );

  return (
    <section className="sorting-sim-card">

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
              Interactive visualization for Paging and Memory Management concepts.
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
            Address Sequence
          </label>

          <input
            value={
              addressInput
            }
            onChange={(e) =>
              setAddressInput(
                e.target.value
              )
            }
            className="sorting-input"
            placeholder="12, 25, 33"
          />

        </div>

        <div>

          <label className="sorting-label">
            Frame Size
          </label>

          <input
            value={
              frameSize
            }
            onChange={(e) =>
              setFrameSize(
                e.target.value
              )
            }
            className="sorting-input"
            placeholder="8"
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

          {frames.map(
            (
              value,
              index
            ) => (

              <MemoryCard
                key={index}
                value={
                  value
                }
                active={
                  value ===
                  Math.floor(
                    currentAddress /
                      Number(
                        frameSize
                      )
                  )
                }
                type={
                  actionType
                }
              />
            )
          )}

        </div>

      </div>

      {translatedAddress && (

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

          Translated Address:
          {" "}
          {translatedAddress}

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

          Memory Hit occurred for address{" "}
          {
            currentAddress
          }

        </div>
      )}

      {actionType ===
        "fault" && (

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

          Page Fault occurred for address{" "}
          {
            currentAddress
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
                visualize memory
                management flow.
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