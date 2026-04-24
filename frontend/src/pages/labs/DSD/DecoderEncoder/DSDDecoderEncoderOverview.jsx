import React from "react";
import {
  BookOpen,
  GitBranch,
  Workflow,
  Lightbulb,
  Binary,
  CheckCircle2
} from "lucide-react";

export default function DSDDecoderEncoderOverview({ mode }) {
  return (
    <div className="overview-shell">
      <section className="overview-hero-card">
        <div className="overview-hero-header">
          <h3>Binary Expansion and Compression</h3>
          <div className="overview-badge">
            {mode === "decoder" ? "Decoder Focus" : "Encoder Focus"}
          </div>
        </div>
        <p className="overview-hero-text">
          A decoder and encoder are complementary combinational circuits.
          A <strong>decoder</strong> converts a binary input into one active output line,
          while an <strong>encoder</strong> converts one active input line into its corresponding binary output.
        </p>
      </section>

      <div className="overview-grid">
        <section className="overview-card">
          <div className="overview-card-head">
            <Binary size={18} />
            <h4>Aim</h4>
          </div>
          <p>
            Study how binary information is converted between coded inputs and active signal lines using decoder and encoder circuits.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <GitBranch size={18} />
            <h4>Decoder Theory</h4>
          </div>
          <p>
            A 2-to-4 decoder takes two binary inputs and activates exactly one of four output lines based on the input combination.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Workflow size={18} />
            <h4>Encoder Theory</h4>
          </div>
          <p>
            A 4-to-2 encoder accepts one active input line and produces the corresponding two-bit binary code at the output.
          </p>
        </section>

        <section className="overview-card">
          <div className="overview-card-head">
            <Lightbulb size={18} />
            <h4>Applications</h4>
          </div>
          <p>
            Decoders are used in memory selection and display control, while encoders are used in keyboards, interrupt systems, and digital communication logic.
          </p>
        </section>
      </div>

      <section className="overview-card">
        <div className="overview-card-head">
          <CheckCircle2 size={18} />
          <h4>Mapping Summary</h4>
        </div>

        <div className="linked-overview-grid">
          <div className="linked-overview-card">
            <div className="linked-overview-card-title">
              <span>Decoder Mapping</span>
            </div>
            <ul>
              <li>00 → Y0</li>
              <li>01 → Y1</li>
              <li>10 → Y2</li>
              <li>11 → Y3</li>
            </ul>
          </div>

          <div className="linked-overview-card">
            <div className="linked-overview-card-title">
              <span>Encoder Mapping</span>
            </div>
            <ul>
              <li>I0 active → 00</li>
              <li>I1 active → 01</li>
              <li>I2 active → 10</li>
              <li>I3 active → 11</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="overview-card overview-steps-card">
        <div className="overview-card-head">
          <Workflow size={18} />
          <h4>Procedure</h4>
        </div>

        <ul className="overview-steps-list">
          <li>
            <span className="overview-step-index">1</span>
            <span>Select Decoder or Encoder mode.</span>
          </li>
          <li>
            <span className="overview-step-index">2</span>
            <span>In Decoder mode, toggle binary inputs A and B.</span>
          </li>
          <li>
            <span className="overview-step-index">3</span>
            <span>In Encoder mode, activate one input line from I0 to I3.</span>
          </li>
          <li>
            <span className="overview-step-index">4</span>
            <span>Observe the resulting active output line or binary code.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}