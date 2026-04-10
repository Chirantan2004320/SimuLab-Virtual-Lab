import React, { useMemo, useState } from "react";
import ExperimentLayout from "../../../../components/experiments/ExperimentLayout";
import "../../../../styles/Lab.css";

const RULES = {
  poly: {
    title: "Polysilicon Rules",
    short: "Minimum width and spacing for polysilicon lines.",
    details:
      "Polysilicon lines are used for MOS gates and interconnect in some layouts. Lambda rules define minimum width and spacing so that gates are manufacturable and electrically reliable.",
    example: {
      minWidth: "2λ",
      minSpacing: "2λ",
      overlap: "Poly crossing active region forms a transistor gate.",
    },
  },
  active: {
    title: "Active / Diffusion Rules",
    short: "Rules for active areas where source and drain are formed.",
    details:
      "Active regions define diffusion areas in silicon. Their width, spacing, and overlap with other layers must follow lambda rules to ensure proper transistor formation and avoid fabrication errors.",
    example: {
      minWidth: "3λ",
      minSpacing: "3λ",
      overlap: "Active with implant/doping defines source and drain regions.",
    },
  },
  metal1: {
    title: "Metal1 Rules",
    short: "Minimum width and spacing rules for first metal interconnect.",
    details:
      "Metal1 is commonly used for routing signals. Lambda rules define the minimum line width and spacing to prevent shorts, opens, and excessive resistance.",
    example: {
      minWidth: "3λ",
      minSpacing: "3λ",
      overlap: "Metal1 overlaps contact cuts to connect devices and wires.",
    },
  },
  contact: {
    title: "Contact Rules",
    short: "Rules for contacts between layers such as active, poly, and metal.",
    details:
      "Contacts connect conducting layers together. They need enclosure by surrounding layers and spacing from nearby shapes to ensure reliable connectivity after fabrication.",
    example: {
      minWidth: "2λ x 2λ",
      minSpacing: "2λ",
      overlap: "Contacts must be enclosed by metal or diffusion by at least 1λ or more depending on process.",
    },
  },
};

export default function DVLSILambdaRulesMicrowind() {
  const [selectedRule, setSelectedRule] = useState("poly");

  const rule = useMemo(() => RULES[selectedRule], [selectedRule]);

  const aim = (
    <p>
      To study lambda-based layout design rules and understand how Microwind-style
      VLSI layout constraints help ensure manufacturable and reliable integrated circuits.
    </p>
  );

  const theory = (
    <>
      <p>
        In VLSI design, layout dimensions are often expressed in terms of a scalable
        parameter called lambda (λ). This makes it easier to describe minimum feature
        sizes and spacing rules independent of a specific fabrication technology.
      </p>
      <p>
        Lambda rules define constraints such as minimum width, minimum spacing,
        enclosure, and overlap for layers like polysilicon, active diffusion,
        metal, and contacts.
      </p>
      <p>
        Microwind is a layout-oriented tool used to visualize and design VLSI layouts.
        In this virtual experiment, we use simplified rule examples to understand the
        purpose of these constraints.
      </p>
    </>
  );

  const procedure = (
    <ol>
      <li>Select a rule category such as Polysilicon, Active, Metal1, or Contact.</li>
      <li>Read the description of the selected layout rule.</li>
      <li>Observe the simplified visual example and the lambda values.</li>
      <li>Understand how minimum width, spacing, and overlap affect layout design.</li>
      <li>Relate these rules to practical CMOS layout work in Microwind.</li>
    </ol>
  );

  const simulation = (
    <>
      <div className="lab-controls" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        <label className="lab-label" style={{ minWidth: 240 }}>
          Select Rule Category:
          <select
            className="lab-select"
            value={selectedRule}
            onChange={(e) => setSelectedRule(e.target.value)}
            style={{ marginTop: "0.5rem" }}
          >
            <option value="poly">Polysilicon</option>
            <option value="active">Active / Diffusion</option>
            <option value="metal1">Metal1</option>
            <option value="contact">Contact</option>
          </select>
        </label>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h3>{rule.title}</h3>
        <p style={{ marginTop: "0.5rem" }}>{rule.short}</p>
        <p style={{ marginTop: "0.75rem", color: "#9ca3af" }}>{rule.details}</p>
      </div>

      <div className="card" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h3>Lambda Rule Values</h3>
        <table style={{ width: "100%", marginTop: "0.75rem", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "0.4rem" }}>Minimum Width</td>
              <td style={{ padding: "0.4rem" }}>
                <span className="lab-output-value">{rule.example.minWidth}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem" }}>Minimum Spacing</td>
              <td style={{ padding: "0.4rem" }}>
                <span className="lab-output-value">{rule.example.minSpacing}</span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem" }}>Layout Note</td>
              <td style={{ padding: "0.4rem" }}>
                <span className="lab-output-value">{rule.example.overlap}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card" style={{ padding: "1rem" }}>
        <h3>Simplified Visual Interpretation</h3>

        {selectedRule === "poly" && (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ height: "18px", width: "220px", background: "#f59e0b", borderRadius: "4px" }} />
            <p style={{ marginTop: "0.75rem", color: "#9ca3af" }}>
              This bar represents a polysilicon strip. Lambda rules control its minimum width and spacing from nearby strips.
            </p>
          </div>
        )}

        {selectedRule === "active" && (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ height: "30px", width: "240px", background: "#22c55e", borderRadius: "4px" }} />
            <p style={{ marginTop: "0.75rem", color: "#9ca3af" }}>
              This block represents an active diffusion area where source and drain regions are formed.
            </p>
          </div>
        )}

        {selectedRule === "metal1" && (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ height: "20px", width: "260px", background: "#60a5fa", borderRadius: "4px" }} />
            <p style={{ marginTop: "0.75rem", color: "#9ca3af" }}>
              This line represents a Metal1 interconnect used to route signals across the layout.
            </p>
          </div>
        )}

        {selectedRule === "contact" && (
          <div style={{ marginTop: "1rem" }}>
            <div
              style={{
                height: "28px",
                width: "28px",
                background: "#e5e7eb",
                border: "3px solid #94a3b8",
                borderRadius: "3px",
              }}
            />
            <p style={{ marginTop: "0.75rem", color: "#9ca3af" }}>
              This square represents a contact cut used to connect one conducting layer to another.
            </p>
          </div>
        )}
      </div>
    </>
  );

  const result = (
    <p>
      This experiment explains how lambda rules simplify VLSI layout design by
      defining scalable minimum dimensions and spacing constraints. It also
      introduces the Microwind style of thinking about layout geometry and manufacturability.
    </p>
  );

  return (
    <ExperimentLayout
      title="DVLSI Experiment 2: Lambda Rules and Microwind"
      subtitle="Explore lambda-based layout rules and understand basic VLSI layout constraints through simplified visual examples."
      aim={aim}
      theory={theory}
      procedure={procedure}
      simulation={simulation}
      result={result}
    />
  );
}