import React from "react";

export default function DVLSICMOSInverterLayoutOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand the physical layout of a CMOS inverter using stick diagrams,
          layer-based layout views, and simplified lambda-based spacing rules.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          A CMOS inverter consists of one pMOS transistor connected to VDD and one nMOS
          transistor connected to ground. In layout form, the pMOS is usually placed in
          the upper region and the nMOS in the lower region, with a common polysilicon
          gate used as the input.
        </p>
        <p>
          Stick diagrams provide an abstract representation of layout topology without exact
          dimensions, while full layout views show physical layers such as diffusion, poly,
          metal, and contact regions.
        </p>
        <p>
          Good layout design must also follow spacing and width rules to ensure that the
          circuit can be fabricated correctly.
        </p>
      </section>

      <section className="card">
        <h2>What You Will Observe</h2>
        <p><strong>Input Path:</strong> poly gate line crossing both transistors.</p>
        <p><strong>Output Node:</strong> connection joining pMOS and nMOS drains.</p>
        <p><strong>Power Rails:</strong> VDD at the top and GND at the bottom.</p>
        <p><strong>Contacts and Metal:</strong> used to connect layers electrically.</p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Select layout parameters such as width, spacing, and lambda.</li>
          <li>Observe the stick diagram representation.</li>
          <li>Study the layer-based layout view of the inverter.</li>
          <li>Check whether the selected dimensions satisfy the simplified design rules.</li>
          <li>Relate the physical layout to the schematic behavior of a CMOS inverter.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Practical Insight</h2>
        <p>
          Layout design is one of the most important stages in DVLSI. Even if a schematic is
          logically correct, poor layout can lead to fabrication failure, larger area, parasitic
          effects, and poor performance.
        </p>
      </section>
    </div>
  );
}