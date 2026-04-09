import React from "react";

export default function DTSPFilterDesignOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To design FIR filters using the window method and study how filter type,
          cutoff frequency, filter length, and window choice affect the impulse
          response and frequency response.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          FIR filters can be designed by starting from an ideal frequency response
          and then computing the corresponding ideal impulse response.
        </p>
        <p>
          Since the ideal impulse response is usually infinite in length, it must
          be truncated to obtain a practical FIR filter. This truncation is done
          using a window function.
        </p>
        <p>
          Common window functions include:
        </p>
        <ul>
          <li><strong>Rectangular Window:</strong> simplest truncation, but produces more ripple.</li>
          <li><strong>Hamming Window:</strong> smoother response with reduced ripple.</li>
          <li><strong>Hanning Window:</strong> also reduces ripple and smooths the transition.</li>
        </ul>
        <p>
          The cutoff frequency determines which frequency range is passed, while
          the filter length affects the sharpness of the transition band.
        </p>
      </section>

      <section className="card">
        <h2>Filter Types</h2>
        <p>
          <strong>Low-pass filter:</strong> allows low-frequency components to pass
          and attenuates high-frequency components.
        </p>
        <p>
          <strong>High-pass filter:</strong> allows high-frequency components to pass
          and attenuates low-frequency components.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Select the filter type: Low-pass or High-pass.</li>
          <li>Choose a cutoff frequency.</li>
          <li>Select an odd filter length.</li>
          <li>Choose a window function.</li>
          <li>Click <strong>Generate Filter</strong>.</li>
          <li>Observe the impulse response and frequency response graphs.</li>
          <li>Compare the signal before and after filtering.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Key Observation</h2>
        <p>
          Window choice affects ripple and smoothness, while filter length affects
          how sharp the filter transition is. A longer FIR filter generally gives
          better selectivity, but at the cost of more computation.
        </p>
      </section>

      <section className="card">
        <h2>Practical Insight</h2>
        <p>
          FIR filters are widely used in digital signal processing because they are
          always stable and can be designed with linear phase, which preserves signal
          shape more effectively than many other filter types.
        </p>
      </section>
    </div>
  );
}