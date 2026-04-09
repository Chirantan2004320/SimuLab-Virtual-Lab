import React from "react";

export default function DTSPLinearCircularConvolutionOverview() {
  return (
    <div>
      <section className="card">
        <h2>Aim</h2>
        <p>
          To compute the linear convolution of two discrete-time sequences and
          show how the same result can be obtained using circular convolution
          with appropriate zero padding.
        </p>
      </section>

      <section className="card">
        <h2>Theory</h2>
        <p>
          Linear convolution of two sequences x[n] and h[n] gives the output of
          a linear time-invariant system for a given input and impulse response.
        </p>
        <p>
          If x[n] has length N and h[n] has length M, then the linear
          convolution has length N + M − 1.
        </p>
        <p>
          Circular convolution assumes the sequences are periodic and performs
          summation with wrap-around using modulo indexing.
        </p>
        <p>
          Without zero padding, circular convolution usually does not match
          linear convolution because output samples overlap due to wrap-around.
        </p>
        <p>
          If both sequences are zero padded to length N + M − 1, circular
          convolution becomes equal to linear convolution.
        </p>
      </section>

      <section className="card">
        <h2>Procedure</h2>
        <ol>
          <li>Enter x[n] and h[n] as comma-separated values.</li>
          <li>Click on <strong>Compute Convolutions</strong>.</li>
          <li>Observe the linear convolution result.</li>
          <li>Compare it with circular convolution without zero padding.</li>
          <li>Observe how zero-padded circular convolution matches linear convolution.</li>
        </ol>
      </section>

      <section className="card">
        <h2>Key Observation</h2>
        <p>
          Circular convolution without padding causes wrap-around, but when the
          length is increased to N + M − 1 using zero padding, the wrap-around
          disappears and the output matches linear convolution exactly.
        </p>
      </section>
    </div>
  );
}