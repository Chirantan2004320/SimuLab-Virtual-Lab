import React from "react";

/**
 * Generic experiment layout used across lab pages.
 * Renders common sections with consistent styling:
 * Title, Aim, Theory, Procedure, Simulation, and Result.
 *
 * All section props accept React nodes so each experiment
 * can pass rich content (text, lists, JSX, etc.).
 */
export default function ExperimentLayout({
  title,
  subtitle,
  aim,
  theory,
  procedure,
  simulation,
  result
}) {
  return (
    <div className="lab-page">
      <div className="lab-root">
        {/* Header / Title */}
        <div className="lab-header">
          {title && (
            <h1 className="lab-title">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="lab-desc">
              {subtitle}
            </p>
          )}
        </div>

        {/* Aim */}
        {aim && (
          <section className="card">
            <h2>Aim</h2>
            <div>
              {aim}
            </div>
          </section>
        )}

        {/* Theory */}
        {theory && (
          <section className="card">
            <h2>Theory</h2>
            <div>
              {theory}
            </div>
          </section>
        )}

        {/* Procedure */}
        {procedure && (
          <section className="card">
            <h2>Procedure</h2>
            <div>
              {procedure}
            </div>
          </section>
        )}

        {/* Simulation / Interactive Area */}
        {simulation && (
          <section className="card experiment">
            <h2>Simulation</h2>
            <div>
              {simulation}
            </div>
          </section>
        )}

        {/* Result / Observations */}
        {result && (
          <section className="card">
            <h2>Result</h2>
            <div>
              {result}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

