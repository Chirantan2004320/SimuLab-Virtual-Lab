import React, { useState } from "react";
import ExperimentLayout from "../../../../components/experiments/ExperimentLayout";
import "../../../../styles/Lab.css";

function bit(v) {
  return v ? 1 : 0;
}

export default function DSDPropagationDelay() {
  const [a, setA] = useState(false);
  const [gateType, setGateType] = useState("NOT");
  const [output, setOutput] = useState(1);
  const [status, setStatus] = useState("Idle");
  const [delayMs] = useState(1000);

  const A = bit(a);

  const computeOutput = () => {
    switch (gateType) {
      case "NOT":
        return A ? 0 : 1;
      case "BUFFER":
        return A;
      default:
        return A;
    }
  };

  const propagateSignal = () => {
    setStatus("Propagating...");
    const nextOutput = computeOutput();

    setTimeout(() => {
      setOutput(nextOutput);
      setStatus(`Output updated after ${delayMs} ms`);
    }, delayMs);
  };

  const aim = (
    <p>
      To demonstrate the concept of propagation delay in digital circuits by
      applying an input change and observing that the output updates after a
      finite time interval.
    </p>
  );

  const theory = (
    <>
      <p>
        In practical digital circuits, output changes do not occur instantly
        after an input changes. A small time interval exists between the input
        transition and the corresponding output transition. This is called
        <strong> propagation delay</strong>.
      </p>
      <p>
        Propagation delay arises because real logic gates are built from
        physical electronic components that require time to respond.
      </p>
      <p>
        In this simple experiment, the delay is demonstrated using a gate model
        where the output updates after a fixed delay when the input changes.
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Toggle the input A between 0 and 1.</li>
      <li>Select a gate type (NOT or BUFFER).</li>
      <li>Click <strong>Propagate Signal</strong>.</li>
      <li>Observe that the output changes only after a short delay.</li>
      <li>Relate this delay to real gate propagation delay in digital systems.</li>
    </ol>
  );

  const simulation = (
    <>
      <div className="lab-controls" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        <label className="lab-label" style={{ minWidth: 140 }}>
          Input A:
          <button
            type="button"
            className="btn primary"
            onClick={() => setA((prev) => !prev)}
            style={{ marginTop: "0.5rem", minWidth: 80 }}
          >
            {A}
          </button>
        </label>

        <label className="lab-label" style={{ minWidth: 180 }}>
          Gate Type:
          <select
            className="lab-select"
            value={gateType}
            onChange={(e) => setGateType(e.target.value)}
            style={{ marginTop: "0.5rem" }}
          >
            <option value="NOT">NOT</option>
            <option value="BUFFER">BUFFER</option>
          </select>
        </label>
      </div>

      <button
        type="button"
        className="btn primary"
        onClick={propagateSignal}
        style={{ marginBottom: "1rem" }}
      >
        Propagate Signal
      </button>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h3>Current State</h3>
        <p style={{ marginTop: "0.5rem" }}>
          Input A: <span className="lab-output-value">{A}</span>
        </p>
        <p>
          Gate: <span className="lab-output-value">{gateType}</span>
        </p>
        <p>
          Output Y: <span className="lab-output-value">{output}</span>
        </p>
        <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
          Status: {status}
        </p>
      </div>
    </>
  );

  const result = (
    <p>
      The experiment shows that in digital circuits, outputs do not change
      instantaneously with inputs. Instead, a finite propagation delay exists,
      which is an important timing parameter in digital system design.
    </p>
  );

  return (
    <ExperimentLayout
      title="DSD Experiment 5: Propagation Delay"
      subtitle="Observe how a digital gate output changes only after a finite delay following an input transition."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}