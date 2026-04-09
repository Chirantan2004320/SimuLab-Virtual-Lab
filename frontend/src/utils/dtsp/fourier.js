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

    const value = re / N;
    x.push(Math.abs(value) < 1e-10 ? 0 : value);
  }

  return x;
}

export function getMagnitude({ re, im }) {
  return Math.sqrt(re * re + im * im);
}

export function getPhase({ re, im }) {
  return Math.atan2(im, re);
}