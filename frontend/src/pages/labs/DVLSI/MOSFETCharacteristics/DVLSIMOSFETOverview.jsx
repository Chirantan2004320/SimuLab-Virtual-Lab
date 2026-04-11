import React from "react";

export default function DVLSIMOSFETOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To study MOSFET current-voltage characteristics and understand the cutoff,
          triode, and saturation regions through interactive device-level analysis.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A MOSFET is a voltage-controlled semiconductor device in which the drain
          current is controlled primarily by the gate-to-source voltage.
        </p>
        <p>
          When the gate voltage is below threshold, the channel is not formed and the
          device remains in cutoff. When the gate voltage exceeds threshold, a channel
          forms between source and drain and current can flow.
        </p>
        <p>
          Depending on the drain-to-source voltage, the device may operate in the
          triode region or in saturation. These regions are essential for both analog
          and digital VLSI design.
        </p>
      </section>

      <section className="card">
        <h2>Operating Regions</h2>
        <p>
          <strong>Cutoff:</strong> VGS &lt; VT, so the device is OFF and current is nearly zero.
        </p>
        <p>
          <strong>Triode:</strong> VGS &gt; VT and VDS &lt; (VGS − VT), so the device behaves like a controlled resistor.
        </p>
        <p>
          <strong>Saturation:</strong> VGS &gt; VT and VDS ≥ (VGS − VT), so the channel pinches off and current saturates.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Select the MOSFET type and device parameters.</li>
          <li>Adjust VGS, VDS, threshold voltage, and device constant.</li>
          <li>Observe the current, region of operation, and device behavior.</li>
          <li>Study the Id–Vds and Id–Vgs graphs.</li>
          <li>Use the circuit and physics views to understand channel formation and pinch-off.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Practical Insight</h2>
        <p>
          MOSFETs are the basic active devices used in CMOS digital logic and in many
          analog circuits. Understanding their operating regions is critical for designing
          inverters, amplifiers, switches, and memory circuits.
        </p>
      </section>
    </div>
  );
}