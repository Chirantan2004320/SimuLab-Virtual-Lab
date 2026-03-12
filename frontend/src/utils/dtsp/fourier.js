// Reusable DTSP Fourier utilities (frontend-only).
// All functions use plain JavaScript and simple object shapes
// so they can be shared across experiment pages.

/**
 * Compute the Discrete Fourier Transform (DFT) of a real or complex sequence.
 * Input: sequence of real numbers (time-domain samples).
 * Output: array of complex objects { re, im }.
 */
export function computeDFT(sequence) {
  const N = sequence.length;
  if (N === 0) return [];
  const X = [];
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const angle = (2 * Math.PI * k * n) / N;
      re += sequence[n] * Math.cos(angle);
      im -= sequence[n] * Math.sin(angle);
    }
    X.push({ re, im });
  }
  return X;
}

/**
 * Compute the Inverse Discrete Fourier Transform (IDFT).
 * Input: array of complex objects { re, im }.
 * Output: array of real-valued samples (real part of IDFT / N).
 */
export function computeIDFT(X) {
  const N = X.length;
  if (N === 0) return [];
  const x = [];
  for (let n = 0; n < N; n++) {
    let re = 0;
    for (let k = 0; k < N; k++) {
      const angle = (2 * Math.PI * k * n) / N;
      const xr = X[k].re * Math.cos(angle) - X[k].im * Math.sin(angle);
      re += xr;
    }
    x.push(re / N);
  }
  return x;
}

/**
 * Magnitude of a complex number represented as { re, im }.
 */
export function getMagnitude({ re, im }) {
  return Math.sqrt(re * re + im * im);
}

/**
 * Phase (angle in radians) of a complex number represented as { re, im }.
 */
export function getPhase({ re, im }) {
  return Math.atan2(im, re);
}

