import React, { useMemo, useState } from "react";
import StepHistoryPanel from "../../../../components/dbms/StepHistoryPanel.jsx";
import InfoStatCard from "../../../../components/dbms/InfoStatCard.jsx";
import ObservationBox from "../../../../components/dbms/ObservationBox.jsx";

function ProcessCard({ title, state, isActive }) {
  let border = "2px solid #38bdf8";
  let background =
    "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(129,140,248,0.2))";
  let boxShadow = "0 4px 12px rgba(56,189,248,0.15)";

  if (isActive) {
    border = "2px solid #facc15";
    background =
      "linear-gradient(135deg, rgba(250,204,21,0.25), rgba(234,179,8,0.18))";
    boxShadow = "0 0 18px rgba(250,204,21,0.25)";
  }

  return (
    <div
      style={{
        minWidth: 220,
        padding: "18px 16px",
        borderRadius: 12,
        background,
        border,
        color: "#ffffff",
        boxShadow,
        transition: "all 0.25s ease"
      }}
    >
      <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 10 }}>
        {title}
      </div>

      <div style={{ color: "#e5e7eb" }}>
        <strong>State:</strong> {state}
      </div>
    </div>
  );
}

function BufferVisualization({ buffer, capacity, producerActive, consumerActive }) {
  const slots = Array.from({ length: capacity }, (_, i) => buffer[i] || null);

  return (
    <section className="card">
      <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Bounded Buffer</h3>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 18
        }}
      >
        {slots.map((item, index) => (
          <div
            key={index}
            style={{
              width: 80,
              minHeight: 90,
              borderRadius: 10,
              border: "2px solid rgba(56,189,248,0.35)",
              background: item
                ? "linear-gradient(135deg, rgba(34,197,94,0.24), rgba(16,185,129,0.18))"
                : "rgba(15,23,42,0.4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 700
            }}
          >
            <div>{item || "Empty"}</div>
            <div style={{ fontSize: "0.8rem", color: "#cbd5e1", marginTop: 6 }}>
              slot {index}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 18,
          justifyContent: "center",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: producerActive ? "rgba(250,204,21,0.18)" : "rgba(15,23,42,0.35)",
            border: producerActive
              ? "1px solid rgba(250,204,21,0.35)"
              : "1px solid rgba(56,189,248,0.22)",
            color: "#e5e7eb",
            fontWeight: 600
          }}
        >
          Producer
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: consumerActive ? "rgba(250,204,21,0.18)" : "rgba(15,23,42,0.35)",
            border: consumerActive
              ? "1px solid rgba(250,204,21,0.35)"
              : "1px solid rgba(56,189,248,0.22)",
            color: "#e5e7eb",
            fontWeight: 600
          }}
        >
          Consumer
        </div>
      </div>
    </section>
  );
}

function SemaphoreVisualization({ semaphoreValue, waitingQueue, activeOperation }) {
  return (
    <section className="card">
      <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Semaphore State</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16
        }}
      >
        <div
          style={{
            padding: "16px",
            borderRadius: 10,
            background: "rgba(15,23,42,0.45)",
            border: "1px solid rgba(56,189,248,0.25)",
            color: "#e5e7eb"
          }}
        >
          <strong style={{ color: "#38bdf8" }}>Semaphore Value</strong>
          <div style={{ marginTop: 8, fontSize: "1.4rem", fontWeight: 800 }}>
            {semaphoreValue}
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: 10,
            background: "rgba(15,23,42,0.45)",
            border: "1px solid rgba(56,189,248,0.25)",
            color: "#e5e7eb"
          }}
        >
          <strong style={{ color: "#38bdf8" }}>Active Operation</strong>
          <div style={{ marginTop: 8 }}>{activeOperation || "None"}</div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <strong style={{ color: "#38bdf8" }}>Waiting Queue</strong>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 12,
            flexWrap: "wrap"
          }}
        >
          {waitingQueue.length === 0 ? (
            <span style={{ color: "#9ca3af" }}>No waiting processes</span>
          ) : (
            waitingQueue.map((process, index) => (
              <div
                key={`${process}-${index}`}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.28)",
                  color: "#fecaca",
                  fontWeight: 600
                }}
              >
                {process}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default function ProcessSynchronizationSimulation({
  mode = "critical",
  setExperimentRun
}) {
  const [message, setMessage] = useState("Process Synchronization simulation initialized.");
  const [stepHistory, setStepHistory] = useState([]);

  const [process1State, setProcess1State] = useState("Ready");
  const [process2State, setProcess2State] = useState("Ready");
  const [activeProcess, setActiveProcess] = useState("");

  const [semaphoreValue, setSemaphoreValue] = useState(1);
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [activeOperation, setActiveOperation] = useState("");

  const [buffer, setBuffer] = useState(["Item1"]);
  const [bufferCapacity,] = useState(3);
  const [, setProducerState] = useState("Ready");
  const [, setConsumerState] = useState("Ready");

  const addStep = (text) => {
    setStepHistory((prev) => [...prev, text]);
  };

  const resetCritical = () => {
    setProcess1State("Ready");
    setProcess2State("Ready");
    setActiveProcess("");
  };

  const resetSemaphore = () => {
    setSemaphoreValue(1);
    setWaitingQueue([]);
    setActiveOperation("");
    setProcess1State("Ready");
    setProcess2State("Ready");
  };

  const resetProducerConsumer = () => {
    setBuffer(["Item1"]);
    setProducerState("Ready");
    setConsumerState("Ready");
    setActiveProcess("");
  };

  const reset = () => {
    setMessage("Simulation reset.");
    setStepHistory([]);
    resetCritical();
    resetSemaphore();
    resetProducerConsumer();
    if (setExperimentRun) setExperimentRun(false);
  };

  const loadSample = () => {
    reset();

    if (mode === "critical") {
      setMessage("Critical Section sample loaded.");
      setStepHistory(["Sample loaded for Critical Section."]);
    } else if (mode === "semaphore") {
      setSemaphoreValue(1);
      setMessage("Semaphore sample loaded.");
      setStepHistory(["Sample loaded for Semaphore."]);
    } else {
      setBuffer(["Item1"]);
      setMessage("Producer-Consumer sample loaded.");
      setStepHistory(["Sample loaded for Producer-Consumer."]);
    }
  };

  const runCriticalSection = () => {
    resetCritical();
    setStepHistory([]);

    setProcess1State("Trying");
    setActiveProcess("P1");
    addStep("P1 tries to enter the critical section.");

    setProcess1State("In Critical Section");
    addStep("P1 enters the critical section successfully.");

    setProcess2State("Trying");
    addStep("P2 also tries to enter the critical section.");

    setProcess2State("Waiting");
    addStep("P2 must wait because P1 is already inside the critical section.");

    setProcess1State("Exited");
    addStep("P1 exits the critical section.");

    setProcess2State("In Critical Section");
    setActiveProcess("P2");
    addStep("P2 now enters the critical section safely.");

    setMessage("Critical Section simulation completed.");
    if (setExperimentRun) setExperimentRun(true);
  };

  const runSemaphore = () => {
    resetSemaphore();
    setStepHistory([]);

    let sem = 1;

    setActiveOperation("P1 performs wait()");
    addStep("P1 performs wait() on semaphore.");
    sem -= 1;
    setSemaphoreValue(sem);
    setProcess1State("Using Resource");
    addStep("Semaphore becomes 0. P1 acquires the resource.");

    setActiveOperation("P2 performs wait()");
    addStep("P2 performs wait() on semaphore.");
    if (sem <= 0) {
      setWaitingQueue(["P2"]);
      setProcess2State("Blocked");
      addStep("P2 is blocked because the resource is unavailable.");
    }

    setActiveOperation("P1 performs signal()");
    addStep("P1 performs signal() and releases the resource.");
    sem += 1;
    setSemaphoreValue(sem);
    setProcess1State("Completed");

    setWaitingQueue([]);
    setProcess2State("Using Resource");
    setActiveOperation("P2 resumes");
    addStep("P2 resumes and acquires the resource.");

    setMessage("Semaphore simulation completed.");
    if (setExperimentRun) setExperimentRun(true);
  };

  const runProducerConsumer = () => {
    resetProducerConsumer();
    setStepHistory([]);

    let currentBuffer = ["Item1"];

    setProducerState("Producing");
    setActiveProcess("Producer");
    addStep("Producer prepares a new item to insert into the buffer.");

    if (currentBuffer.length < bufferCapacity) {
      currentBuffer = [...currentBuffer, `Item${currentBuffer.length + 1}`];
      setBuffer(currentBuffer);
      addStep(`Producer inserts ${currentBuffer[currentBuffer.length - 1]} into the buffer.`);
    } else {
      setProducerState("Waiting");
      addStep("Producer must wait because the buffer is full.");
    }

    setConsumerState("Consuming");
    setActiveProcess("Consumer");
    addStep("Consumer tries to remove an item from the buffer.");

    if (currentBuffer.length > 0) {
      const removed = currentBuffer[0];
      currentBuffer = currentBuffer.slice(1);
      setBuffer(currentBuffer);
      addStep(`Consumer removes ${removed} from the buffer.`);
    } else {
      setConsumerState("Waiting");
      addStep("Consumer must wait because the buffer is empty.");
    }

    setProducerState("Ready");
    setConsumerState("Ready");
    setMessage("Producer-Consumer simulation completed.");
    if (setExperimentRun) setExperimentRun(true);
  };

  const runSimulation = () => {
    if (mode === "critical") {
      runCriticalSection();
    } else if (mode === "semaphore") {
      runSemaphore();
    } else {
      runProducerConsumer();
    }
  };

  const observationText =
    mode === "critical"
      ? "Mutual exclusion ensures that only one process enters the critical section at a time, preventing race conditions."
      : mode === "semaphore"
      ? "Semaphores coordinate access to shared resources using wait() and signal() operations."
      : "Producer-Consumer synchronization ensures that producers do not overflow the buffer and consumers do not underflow it.";

  const stats = useMemo(() => {
    if (mode === "critical") {
      return [
        { label: "P1 State", value: process1State },
        { label: "P2 State", value: process2State },
        { label: "Active Process", value: activeProcess || "None" }
      ];
    }

    if (mode === "semaphore") {
      return [
        { label: "Semaphore Value", value: semaphoreValue },
        { label: "Waiting Processes", value: waitingQueue.length },
        { label: "Active Operation", value: activeOperation || "None" }
      ];
    }

    return [
      { label: "Buffer Size", value: buffer.length },
      { label: "Buffer Capacity", value: bufferCapacity },
      { label: "Active Side", value: activeProcess || "None" }
    ];
  }, [
    mode,
    process1State,
    process2State,
    activeProcess,
    semaphoreValue,
    waitingQueue.length,
    activeOperation,
    buffer.length,
    bufferCapacity
  ]);

  return (
    <>
      <section className="card experiment">
        <h2>
          Simulation <span style={{ color: "#38bdf8" }}>({mode.toUpperCase()})</span>
        </h2>

        <div className="buttons" style={{ marginBottom: 14 }}>
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

        <div className="info-box">
          {message || "Run the Process Synchronization simulation to begin."}
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

      {mode === "critical" && (
        <section className="card">
          <h3 style={{ marginBottom: 14, color: "#e5e7eb" }}>Critical Section State</h3>

          <div
            style={{
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
            <ProcessCard
              title="Process P1"
              state={process1State}
              isActive={activeProcess === "P1"}
            />
            <ProcessCard
              title="Process P2"
              state={process2State}
              isActive={activeProcess === "P2"}
            />
          </div>
        </section>
      )}

      {mode === "semaphore" && (
        <SemaphoreVisualization
          semaphoreValue={semaphoreValue}
          waitingQueue={waitingQueue}
          activeOperation={activeOperation}
        />
      )}

      {mode === "producerConsumer" && (
        <BufferVisualization
          buffer={buffer}
          capacity={bufferCapacity}
          producerActive={activeProcess === "Producer"}
          consumerActive={activeProcess === "Consumer"}
        />
      )}

      <StepHistoryPanel steps={stepHistory} />
    </>
  );
}