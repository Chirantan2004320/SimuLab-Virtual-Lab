export function parseCoefficients(text) {
  return text.split(",").map(Number);
}

export function magnitude(z) {
  return Math.sqrt(z.re * z.re + z.im * z.im);
}

export function computeRoots(coeffs) {
  if (coeffs.length === 2) {
    return {
      roots: [{ re: -coeffs[1] / coeffs[0], im: 0 }]
    };
  }

  if (coeffs.length === 3) {
    const [a, b, c] = coeffs;
    const D = b * b - 4 * a * c;

    if (D >= 0) {
      const r1 = (-b + Math.sqrt(D)) / (2 * a);
      const r2 = (-b - Math.sqrt(D)) / (2 * a);
      return { roots: [{ re: r1, im: 0 }, { re: r2, im: 0 }] };
    } else {
      return {
        roots: [
          { re: -b / (2 * a), im: Math.sqrt(-D) / (2 * a) },
          { re: -b / (2 * a), im: -Math.sqrt(-D) / (2 * a) }
        ]
      };
    }
  }

  return { roots: [] };
}