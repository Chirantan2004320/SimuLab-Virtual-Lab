import React from "react";

export default function DVLSILambdaRulesMicrowindOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To understand lambda-based layout design rules and observe how simple
          layout dimensions can be validated using rule-based checks similar to
          Microwind-style design environments.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          Lambda rules are scalable layout rules used in VLSI design. Instead of
          specifying every dimension directly in micrometers, many layout constraints
          are expressed as multiples of a basic unit called lambda (λ).
        </p>
        <p>
          This makes layouts portable across different fabrication processes and easier
          to teach. Designers can define widths, spacings, and contact sizes relative
          to lambda and then check whether the layout satisfies the minimum design rules.
        </p>
        <p>
          Tools like Microwind visually represent layout layers and help students
          understand how rule violations occur in practical IC design.
        </p>
      </section>

      <section className="card">
        <h2>What You Will Study</h2>
        <p>
          <strong>Poly Width:</strong> minimum width of a polysilicon line.
        </p>
        <p>
          <strong>Metal Width:</strong> minimum width of a metal interconnect.
        </p>
        <p>
          <strong>Spacing Rules:</strong> minimum allowed distance between layers or shapes.
        </p>
        <p>
          <strong>Contact Size:</strong> the minimum allowed size of a contact opening.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Choose a lambda value.</li>
          <li>Set poly width, metal width, contact size, and spacing values.</li>
          <li>Observe the generated layout view.</li>
          <li>Run the rule check section and identify violations.</li>
          <li>Adjust dimensions until the layout becomes rule-compliant.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Practical Insight</h2>
        <p>
          In real VLSI design, design-rule checking (DRC) ensures that the layout can be
          fabricated reliably. Even a small width or spacing error may cause open circuits,
          shorts, or yield problems.
        </p>
      </section>
    </div>
  );
}