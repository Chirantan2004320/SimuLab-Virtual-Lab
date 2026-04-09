export function padToPowerOfTwo(sequence) {
  const arr = [...sequence];
  let size = 1;
  while (size < arr.length) size *= 2;
  while (arr.length < size) arr.push(0);
  return arr;
}

export function complexAdd(a, b) {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function complexSub(a, b) {
  return { re: a.re - b.re, im: a.im - b.im };
}

export function complexMul(a, b) {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re
  };
}

export function expTerm(k, N) {
  const angle = (-2 * Math.PI * k) / N;
  return { re: Math.cos(angle), im: Math.sin(angle) };
}

export function computeDFTWithCount(sequence) {
  const N = sequence.length;
  const result = [];
  let operations = 0;

  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;

    for (let n = 0; n < N; n++) {
      const angle = (-2 * Math.PI * k * n) / N;
      re += sequence[n] * Math.cos(angle);
      im += sequence[n] * Math.sin(angle);
      operations++;
    }

    result.push({ re, im });
  }

  return { result, operations };
}

export function fftRecursive(sequence) {
  const complexSeq = sequence.map((x) =>
    typeof x === "number" ? { re: x, im: 0 } : x
  );

  let operations = 0;
  const stages = [];

  function fft(arr, depth = 0) {
    const N = arr.length;
    if (N === 1) return arr;

    const even = fft(arr.filter((_, i) => i % 2 === 0), depth + 1);
    const odd = fft(arr.filter((_, i) => i % 2 === 1), depth + 1);

    const combined = new Array(N);

    for (let k = 0; k < N / 2; k++) {
      const twiddle = expTerm(k, N);
      const t = complexMul(twiddle, odd[k]);
      combined[k] = complexAdd(even[k], t);
      combined[k + N / 2] = complexSub(even[k], t);
      operations++;
    }

    stages.push({
      depth,
      size: N,
      values: combined.map((v) => ({
        re: Number(v.re.toFixed(4)),
        im: Number(v.im.toFixed(4))
      }))
    });

    return combined;
  }

  const result = fft(complexSeq);
  return { result, operations, stages: stages.reverse() };
}

export function getMagnitude(c) {
  return Math.sqrt(c.re * c.re + c.im * c.im);
}

export function getPhase(c) {
  return Math.atan2(c.im, c.re);
}