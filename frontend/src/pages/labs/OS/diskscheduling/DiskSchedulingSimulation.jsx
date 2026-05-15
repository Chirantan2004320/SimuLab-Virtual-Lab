import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Play,
  RotateCcw,
  Activity,
  Gauge,
  HardDrive,
  Layers,
  Sparkles,
  ShieldCheck,
  Pause,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Cpu,
  MoveRight,
} from "lucide-react";

const modeMeta = {
  fcfs: {
    name:
      "First Come First Serve",

    type:
      "Arrival Order Scheduling",

    complexity:
      "O(n)",

    space:
      "O(1)",

    insight:
      "FCFS services disk requests in the exact order they arrive in the request queue.",
  },

  sstf: {
    name:
      "Shortest Seek Time First",

    type:
      "Seek Optimization Scheduling",

    complexity:
      "O(n²)",

    space:
      "O(n)",

    insight:
      "SSTF selects the request nearest to the current head position to reduce seek time.",
  },

  scan: {
    name:
      "SCAN Disk Scheduling",

    type:
      "Elevator Scheduling",

    complexity:
      "O(n log n)",

    space:
      "O(n)",

    insight:
      "SCAN moves in one direction servicing requests, then reverses like an elevator.",
  },

  cscan: {
    name:
      "Circular SCAN",

    type:
      "Circular Elevator Scheduling",

    complexity:
      "O(n log n)",

    space:
      "O(n)",

    insight:
      "C-SCAN services requests in one direction only and jumps back to the start.",
  },
};

const defaultRequests =
  "98, 183, 37, 122, 14, 124, 65, 67";

const defaultHead =
  "53";

const defaultDiskSize =
  "200";

const defaultDirection =
  "right";

function TrackCard({
  track,
  active,
  completed,
}) {

  return (
    <div
      style={{
        minWidth: 110,

        height: 130,

        borderRadius: 22,

        background: active
          ? "linear-gradient(135deg, rgba(56,189,248,0.35), rgba(59,130,246,0.22))"
          : completed
          ? "linear-gradient(135deg, rgba(34,197,94,0.28), rgba(16,185,129,0.18))"
          : "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(30,41,59,0.88))",

        border: active
          ? "2px solid rgba(56,189,248,0.8)"
          : completed
          ? "2px solid rgba(34,197,94,0.6)"
          : "1px solid rgba(56,189,248,0.25)",

        display:
          "flex",

        flexDirection:
          "column",

        justifyContent:
          "center",

        alignItems:
          "center",

        transition:
          "all 0.4s ease",

        transform: active
          ? "translateY(-8px) scale(1.05)"
          : "translateY(0px)",

        boxShadow: active
          ? "0 0 28px rgba(56,189,248,0.35)"
          : "none",
      }}
    >

      <HardDrive
        size={28}
        color="#ffffff"
        style={{
          marginBottom: 12,
        }}
      />

      <div
        style={{
          color:
            "#ffffff",

          fontWeight:
            800,

          fontSize:
            "1.5rem",
        }}
      >

        {track}

      </div>

    </div>
  );
}

export default function DiskSchedulingSimulation({
  mode =
    "fcfs",

  setExperimentRun,
}) {

  const meta =
    modeMeta[mode];

  const [message, setMessage] =
    useState(
      "Disk Scheduling simulation initialized."
    );

  const [steps, setSteps] =
    useState([]);

  const [stepIndex, setStepIndex] =
    useState(0);

  const [running, setRunning] =
    useState(false);

  const timerRef =
    useRef(null);

  const [
    requestInput,
    setRequestInput,
  ] = useState(
    defaultRequests
  );

  const [
    headInput,
    setHeadInput,
  ] = useState(
    defaultHead
  );

  const [
    diskSizeInput,
    setDiskSizeInput,
  ] = useState(
    defaultDiskSize
  );

  const [
    direction,
    setDirection,
  ] = useState(
    defaultDirection
  );

  const [
    seekSequence,
    setSeekSequence,
  ] = useState([]);

  const [
    currentTrack,
    setCurrentTrack,
  ] = useState(null);

  const [
    totalMovement,
    setTotalMovement,
  ] = useState(0);

  const [
    currentMovement,
    setCurrentMovement,
  ] = useState(0);

  const parseRequests =
    () => {

      return requestInput
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

      setSeekSequence([]);

      setCurrentTrack(null);

      setTotalMovement(0);

      setCurrentMovement(0);
    };

  const generateSequence =
    () => {

      const requests =
        parseRequests();

      const head =
        Number(
          headInput
        );

      const diskSize =
        Number(
          diskSizeInput
        );

      const sequence =
        [head];

      const logs = [];

      let total = 0;

      if (
        mode === "fcfs"
      ) {

        requests.forEach(
          (
            request
          ) => {

            total +=
              Math.abs(
                request -
                  sequence[
                    sequence.length -
                      1
                  ]
              );

            logs.push(
              `Move head from ${
                sequence[
                  sequence.length -
                    1
                ]
              } to ${request}.`
            );

            sequence.push(
              request
            );
          }
        );
      }

      else if (
        mode === "sstf"
      ) {

        const pending =
          [
            ...requests,
          ];

        let current =
          head;

        while (
          pending.length
        ) {

          let nearest =
            pending[0];

          const currentHead =
  current;

pending.forEach(
  (request) => {

    if (
      Math.abs(
        request -
          currentHead
      ) <
      Math.abs(
        nearest -
          currentHead
      )
    ) {

      nearest =
        request;
    }
  }
);

          total +=
            Math.abs(
              nearest -
                current
            );

          logs.push(
            `Nearest request from ${current} is ${nearest}.`
          );

          current =
            nearest;

          sequence.push(
            nearest
          );

          pending.splice(
            pending.indexOf(
              nearest
            ),
            1
          );
        }
      }

      else if (
        mode === "scan"
      ) {

        const left =
          requests
            .filter(
              (
                r
              ) =>
                r <
                head
            )
            .sort(
              (
                a,
                b
              ) =>
                a - b
            );

        const right =
          requests
            .filter(
              (
                r
              ) =>
                r >=
                head
            )
            .sort(
              (
                a,
                b
              ) =>
                a - b
            );

        let current =
          head;

        if (
          direction ===
          "right"
        ) {

          right.forEach(
            (
              request
            ) => {

              total +=
                Math.abs(
                  request -
                    current
                );

              logs.push(
                `Move right from ${current} to ${request}.`
              );

              current =
                request;

              sequence.push(
                request
              );
            }
          );

          if (
            current !==
            diskSize - 1
          ) {

            total +=
              Math.abs(
                diskSize -
                  1 -
                  current
              );

            sequence.push(
              diskSize - 1
            );

            current =
              diskSize - 1;
          }

          [
            ...left,
          ]
            .reverse()
            .forEach(
              (
                request
              ) => {

                total +=
                  Math.abs(
                    request -
                      current
                  );

                logs.push(
                  `Reverse and move left from ${current} to ${request}.`
                );

                current =
                  request;

                sequence.push(
                  request
                );
              }
            );
        }

        else {

          [
            ...left,
          ]
            .reverse()
            .forEach(
              (
                request
              ) => {

                total +=
                  Math.abs(
                    request -
                      current
                  );

                logs.push(
                  `Move left from ${current} to ${request}.`
                );

                current =
                  request;

                sequence.push(
                  request
                );
              }
            );

          if (
            current !== 0
          ) {

            total +=
              current;

            sequence.push(
              0
            );

            current = 0;
          }

          right.forEach(
            (
              request
            ) => {

              total +=
                Math.abs(
                  request -
                    current
                );

              logs.push(
                `Reverse and move right from ${current} to ${request}.`
              );

              current =
                request;

              sequence.push(
                request
              );
            }
          );
        }
      }

      else {

        const left =
          requests
            .filter(
              (
                r
              ) =>
                r <
                head
            )
            .sort(
              (
                a,
                b
              ) =>
                a - b
            );

        const right =
          requests
            .filter(
              (
                r
              ) =>
                r >=
                head
            )
            .sort(
              (
                a,
                b
              ) =>
                a - b
            );

        let current =
          head;

        right.forEach(
          (
            request
          ) => {

            total +=
              Math.abs(
                request -
                  current
              );

            logs.push(
              `Move right from ${current} to ${request}.`
            );

            current =
              request;

            sequence.push(
              request
            );
          }
        );

        total +=
          Math.abs(
            diskSize -
              1 -
              current
          );

        sequence.push(
          diskSize - 1
        );

        current =
          diskSize - 1;

        total +=
          diskSize - 1;

        logs.push(
          "Jump back to disk start."
        );

        sequence.push(
          0
        );

        current = 0;

        left.forEach(
          (
            request
          ) => {

            total +=
              Math.abs(
                request -
                  current
              );

            logs.push(
              `Continue moving right to ${request}.`
            );

            current =
              request;

            sequence.push(
              request
            );
          }
        );
      }

      return {
        sequence,
        logs,
        total,
      };
    };

  const runSimulation =
    () => {

      reset();

      const data =
        generateSequence();

      if (
        data.sequence
          .length === 0
      ) {

        setMessage(
          "Please enter valid requests."
        );

        return;
      }

      setRunning(true);

      const applyStep =
        (
          index
        ) => {

          const activeTrack =
            data.sequence[
              index
            ];

          const previousTrack =
            index === 0
              ? activeTrack
              : data.sequence[
                  index -
                    1
                ];

          setCurrentTrack(
            activeTrack
          );

          setCurrentMovement(
            Math.abs(
              activeTrack -
                previousTrack
            )
          );

          setTotalMovement(
            data.sequence
              .slice(
                1,
                index + 1
              )
              .reduce(
                (
                  acc,
                  track,
                  idx
                ) =>
                  acc +
                  Math.abs(
                    track -
                      data
                        .sequence[
                        idx
                      ]
                  ),
                0
              )
          );

          setMessage(
            index === 0
              ? `Initial Head Position: ${activeTrack}`
              : data.logs[
                  index -
                    1
                ]
          );

          setSteps(
            (
              prev
            ) => [
              ...prev,
              index ===
              0
                ? `Head initialized at ${activeTrack}.`
                : data.logs[
                    index -
                      1
                  ],
            ]
          );

          setSeekSequence(
            data.sequence.slice(
              0,
              index + 1
            )
          );

          setStepIndex(
            index
          );
        };

      applyStep(0);

      let currentStep = 0;

      timerRef.current =
        setInterval(
          () => {

            currentStep += 1;

            if (
              currentStep >=
              data.sequence
                .length
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

            const nextStep =
              currentStep;

            applyStep(
              nextStep
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

  const requestCount =
    parseRequests().length;

  const stats = [

    {
      label:
        "Requests",

      value:
        requestCount,
    },

    {
      label:
        "Current Track",

      value:
        currentTrack ??
        "-",
    },

    {
      label:
        "Head Movement",

      value:
        totalMovement,
    },

  ];

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
              Advanced animated visualization for Disk Scheduling algorithms.
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

            <h4>
              Complexity
            </h4>

          </div>

          <p>
            {
              meta.complexity
            }
          </p>

        </div>

        <div className="overview-card">

          <div className="overview-card-head">

            <Cpu size={18} />

            <h4>
              Space
            </h4>

          </div>

          <p>
            {
              meta.space
            }
          </p>

        </div>

        <div className="overview-card">

          <div className="overview-card-head">

            <ShieldCheck
              size={18}
            />

            <h4>
              Type
            </h4>

          </div>

          <p>
            {
              meta.type
            }
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

        {
          meta.insight
        }

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
            Request Queue
          </label>

          <input
            value={
              requestInput
            }
            onChange={(e) =>
              setRequestInput(
                e.target.value
              )
            }
            className="sorting-input"
            placeholder="98, 183, 37, 122"
          />

        </div>

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px,1fr))",

            gap: 16,
          }}
        >

          <div>

            <label className="sorting-label">
              Initial Head
            </label>

            <input
              value={
                headInput
              }
              onChange={(e) =>
                setHeadInput(
                  e.target.value
                )
              }
              className="sorting-input"
            />

          </div>

          <div>

            <label className="sorting-label">
              Disk Size
            </label>

            <input
              value={
                diskSizeInput
              }
              onChange={(e) =>
                setDiskSizeInput(
                  e.target.value
                )
              }
              className="sorting-input"
            />

          </div>

          {(mode ===
            "scan" ||
            mode ===
              "cscan") && (

            <div>

              <label className="sorting-label">
                Direction
              </label>

              <select
                value={
                  direction
                }
                onChange={(e) =>
                  setDirection(
                    e.target.value
                  )
                }
                className="sorting-select"
              >

                <option value="right">
                  Right
                </option>

                <option value="left">
                  Left
                </option>

              </select>

            </div>
          )}

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
          marginTop: 42,
        }}
      >

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "center",

            alignItems:
              "center",

            gap: 18,

            flexWrap:
              "wrap",
          }}
        >

          {seekSequence.map(
            (
              track,
              index
            ) => (

              <React.Fragment
                key={
                  index
                }
              >

                <TrackCard
                  track={
                    track
                  }
                  active={
                    index ===
                    stepIndex
                  }
                  completed={
                    index <
                    stepIndex
                  }
                />

                {index !==
                  seekSequence.length -
                    1 && (

                  <MoveRight
                    size={28}
                    color="#38bdf8"
                  />
                )}

              </React.Fragment>
            )
          )}

        </div>

      </div>

      <div
        className="sorting-info-box"
        style={{
          marginTop: 24,

          border:
            "1px solid rgba(56,189,248,0.35)",

          background:
            "rgba(56,189,248,0.10)",
        }}
      >

        <Navigation
          size={16}
          style={{
            marginRight: 10,
          }}
        />

        Current Head Movement:
        {" "}
        {
          currentMovement
        }

      </div>

      {totalMovement >
        0 && (

        <div
          className="sorting-info-box"
          style={{
            marginTop: 20,

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

          Total Head Movement:
          {" "}
          {
            totalMovement
          }

        </div>
      )}

      {running && (

        <div
          className="sorting-info-box"
          style={{
            marginTop: 20,

            border:
              "1px solid rgba(250,204,21,0.35)",

            background:
              "rgba(250,204,21,0.12)",

            color:
              "#fde68a",
          }}
        >

          <AlertTriangle
            size={16}
            style={{
              marginRight: 10,
            }}
          />

          Disk head is actively servicing requests.

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
                visualize Disk
                Scheduling flow.
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
                        : 0.45,

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