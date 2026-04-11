import React, { useEffect } from "react";

export default function DVLSILambdaRulesMicrowindSimulation({
  lambdaValue,
  setLambdaValue,
  polyWidth,
  setPolyWidth,
  metalWidth,
  setMetalWidth,
  diffSpacing,
  setDiffSpacing,
  polySpacing,
  setPolySpacing,
  contactSize,
  setContactSize,
  analysis,
  formatNumber,
  setExperimentRun
}) {
  useEffect(() => {
    setExperimentRun(true);
  }, [
    lambdaValue,
    polyWidth,
    metalWidth,
    diffSpacing,
    polySpacing,
    contactSize,
    setExperimentRun
  ]);

  return (
    <section className="card experiment">
      <h2>Simulation</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "1rem"
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Lambda Value λ: <strong>{formatNumber(lambdaValue, 1)}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={lambdaValue}
            onChange={(e) => setLambdaValue(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Poly Width (λ): <strong>{polyWidth}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            value={polyWidth}
            onChange={(e) => setPolyWidth(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Metal Width (λ): <strong>{metalWidth}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            value={metalWidth}
            onChange={(e) => setMetalWidth(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Diffusion Spacing (λ): <strong>{diffSpacing}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            value={diffSpacing}
            onChange={(e) => setDiffSpacing(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Poly Spacing (λ): <strong>{polySpacing}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            value={polySpacing}
            onChange={(e) => setPolySpacing(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Contact Size (λ): <strong>{contactSize}</strong>
          </label>
          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={contactSize}
            onChange={(e) => setContactSize(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px"
        }}
      >
        <div className="stat-card">
          <strong>Poly Width</strong>
          <div>{polyWidth}λ</div>
        </div>

        <div className="stat-card">
          <strong>Metal Width</strong>
          <div>{metalWidth}λ</div>
        </div>

        <div className="stat-card">
          <strong>Poly Spacing</strong>
          <div>{polySpacing}λ</div>
        </div>

        <div className="stat-card">
          <strong>DRC Status</strong>
          <div>{analysis.allPass ? "PASS" : "FAIL"}</div>
        </div>
      </div>

      <div className="info-box" style={{ marginTop: "1rem" }}>
        {analysis.summary}
      </div>
    </section>
  );
}