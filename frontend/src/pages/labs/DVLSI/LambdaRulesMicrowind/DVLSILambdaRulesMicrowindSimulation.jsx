import React, { useEffect } from "react";
import { Activity, Ruler, ShieldCheck, Sparkles, SlidersHorizontal } from "lucide-react";

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
    <section className="sorting-sim-card">
      <div className="sorting-sim-header">
        <div className="sorting-sim-title-wrap">
          <div className="sorting-sim-icon">
            <Activity size={18} />
          </div>
          <div>
            <h2 className="sorting-sim-title">Simulation</h2>
            <p className="sorting-sim-subtitle">
              Adjust lambda dimensions and instantly check whether layout rules pass.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 18 }}>
        <div className="overview-card">
          <div className="overview-card-head">
            <Ruler size={18} />
            <h4>Lambda Scaling</h4>
          </div>
          <p>
            A dimension of 3λ becomes {formatNumber(lambdaValue * 3, 1)} physical units when λ ={" "}
            {formatNumber(lambdaValue, 1)}.
          </p>
        </div>

        <div className="overview-card">
          <div className="overview-card-head">
            <ShieldCheck size={18} />
            <h4>DRC Result</h4>
          </div>
          <p>
            Current layout status: <strong>{analysis.allPass ? "PASS" : "FAIL"}</strong>.
          </p>
        </div>
      </div>

      <div className="sorting-info-box">
        <Sparkles size={16} style={{ marginRight: 10 }} />
        {analysis.summary}
      </div>

      <div className="overview-card" style={{ marginBottom: 18 }}>
        <div className="overview-card-head">
          <SlidersHorizontal size={18} />
          <h4>Lambda and Layout Dimensions</h4>
        </div>

        <div className="er-config-grid">
          <SliderControl
            label={`Lambda Value λ: ${formatNumber(lambdaValue, 1)}`}
            min="1"
            max="5"
            step="0.5"
            value={lambdaValue}
            onChange={setLambdaValue}
          />

          <SliderControl
            label={`Poly Width: ${polyWidth}λ`}
            min="1"
            max="8"
            step="1"
            value={polyWidth}
            onChange={setPolyWidth}
          />

          <SliderControl
            label={`Metal Width: ${metalWidth}λ`}
            min="1"
            max="8"
            step="1"
            value={metalWidth}
            onChange={setMetalWidth}
          />

          <SliderControl
            label={`Diffusion Spacing: ${diffSpacing}λ`}
            min="1"
            max="8"
            step="1"
            value={diffSpacing}
            onChange={setDiffSpacing}
          />

          <SliderControl
            label={`Poly Spacing: ${polySpacing}λ`}
            min="1"
            max="8"
            step="1"
            value={polySpacing}
            onChange={setPolySpacing}
          />

          <SliderControl
            label={`Contact Size: ${contactSize}λ`}
            min="1"
            max="6"
            step="1"
            value={contactSize}
            onChange={setContactSize}
          />
        </div>
      </div>

      <div className="sorting-stats-grid">
        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Poly Width</span>
          <span className="sorting-stat-value">{polyWidth}λ</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Metal Width</span>
          <span className="sorting-stat-value">{metalWidth}λ</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">Poly Spacing</span>
          <span className="sorting-stat-value">{polySpacing}λ</span>
        </div>

        <div className="sorting-stat-box">
          <span className="sorting-stat-label">DRC Status</span>
          <span
            className="sorting-stat-value"
            style={{ color: analysis.allPass ? "#22c55e" : "#ef4444" }}
          >
            {analysis.allPass ? "PASS" : "FAIL"}
          </span>
        </div>
      </div>
    </section>
  );
}

function SliderControl({ label, min, max, step, value, onChange }) {
  return (
    <div>
      <label className="sorting-label">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="sorting-range"
      />
    </div>
  );
}