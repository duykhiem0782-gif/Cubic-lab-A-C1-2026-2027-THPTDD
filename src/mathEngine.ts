import { CubicCoefficients, CubicAnalysis, Point2D, MonotonicityInterval, ExtremaCase } from './types';

const EPSILON = 1e-9;

export function isNearZero(val: number): boolean {
  return Math.abs(val) < EPSILON;
}

export function roundPrecision(num: number, decimals: number = 4): number {
  if (Math.abs(num) < 1e-12) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Finds if a float is very close to a simple rational number p/q with q in [1..16]
 */
export function toNiceFraction(val: number): { isFraction: boolean; numerator: number; denominator: number; text: string } {
  if (isNearZero(val)) return { isFraction: true, numerator: 0, denominator: 1, text: '0' };
  
  const sign = val < 0 ? -1 : 1;
  const absVal = Math.abs(val);

  // Check integer
  if (Math.abs(absVal - Math.round(absVal)) < 1e-5) {
    const intVal = Math.round(val);
    return { isFraction: true, numerator: intVal, denominator: 1, text: `${intVal}` };
  }

  for (let q = 2; q <= 16; q++) {
    const p = Math.round(absVal * q);
    if (Math.abs(absVal - p / q) < 1e-5) {
      const num = sign * p;
      return {
        isFraction: true,
        numerator: num,
        denominator: q,
        text: `\\frac{${num}}{${q}}`
      };
    }
  }

  return {
    isFraction: false,
    numerator: 0,
    denominator: 1,
    text: `${roundPrecision(val, 4)}`
  };
}

export function formatNumVi(val: number, decimals: number = 4): string {
  if (isNearZero(val)) return '0';
  const rounded = roundPrecision(val, decimals);
  // Convert -0 to 0
  if (Object.is(rounded, -0)) return '0';
  return rounded.toString();
}

export function formatPointVi(x: number, y: number, decimals: number = 3): string {
  return `(${formatNumVi(x, decimals)}; ${formatNumVi(y, decimals)})`;
}

/**
 * Build LaTeX expression for polynomial: ax^3 + bx^2 + cx + d
 */
export function formatCubicLatex(a: number, b: number, c: number, d: number): string {
  const terms: string[] = [];

  const pushTerm = (coeff: number, symbol: string) => {
    if (isNearZero(coeff)) return;
    const absCoeff = Math.abs(coeff);
    const coeffText = (absCoeff === 1 && symbol.length > 0) ? '' : formatNumVi(absCoeff);
    const part = `${coeffText}${symbol}`;
    if (terms.length === 0) {
      terms.push(coeff < 0 ? `-${part}` : part);
    } else {
      terms.push(coeff < 0 ? `- ${part}` : `+ ${part}`);
    }
  };

  // x^3 term
  pushTerm(a, 'x^3');
  // x^2 term
  pushTerm(b, 'x^2');
  // x term
  pushTerm(c, 'x');
  // constant term
  if (!isNearZero(d) || terms.length === 0) {
    if (terms.length === 0) {
      terms.push(formatNumVi(d));
    } else {
      terms.push(d < 0 ? `- ${formatNumVi(Math.abs(d))}` : `+ ${formatNumVi(d)}`);
    }
  }

  return terms.join(' ');
}

/**
 * Build LaTeX expression for quadratic derivative: 3ax^2 + 2bx + c
 */
export function formatDerivativeLatex(a: number, b: number, c: number): string {
  const coeffA = 3 * a;
  const coeffB = 2 * b;
  const coeffC = c;

  const terms: string[] = [];

  const pushTerm = (coeff: number, symbol: string) => {
    if (isNearZero(coeff)) return;
    const absCoeff = Math.abs(coeff);
    const coeffText = (absCoeff === 1 && symbol.length > 0) ? '' : formatNumVi(absCoeff);
    const part = `${coeffText}${symbol}`;
    if (terms.length === 0) {
      terms.push(coeff < 0 ? `-${part}` : part);
    } else {
      terms.push(coeff < 0 ? `- ${part}` : `+ ${part}`);
    }
  };

  // x^2 term
  pushTerm(coeffA, 'x^2');
  // x term
  pushTerm(coeffB, 'x');
  // constant term
  if (!isNearZero(coeffC) || terms.length === 0) {
    if (terms.length === 0) {
      terms.push('0');
    } else {
      terms.push(coeffC < 0 ? `- ${formatNumVi(Math.abs(coeffC))}` : `+ ${formatNumVi(coeffC)}`);
    }
  }

  return terms.join(' ');
}

/**
 * Evaluate cubic function f(x) = ax^3 + bx^2 + cx + d
 */
export function evalCubic(a: number, b: number, c: number, d: number, x: number): number {
  return a * x * x * x + b * x * x + c * x + d;
}

/**
 * Evaluate derivative f'(x) = 3ax^2 + 2bx + c
 */
export function evalDerivative(a: number, b: number, c: number, x: number): number {
  return 3 * a * x * x + 2 * b * x + c;
}

/**
 * Newton-Raphson refinement for real roots of cubic
 */
function refineRoot(a: number, b: number, c: number, d: number, initialGuess: number): number {
  let x = initialGuess;
  for (let iter = 0; iter < 10; iter++) {
    const fx = evalCubic(a, b, c, d, x);
    if (Math.abs(fx) < 1e-14) break;
    const fpx = evalDerivative(a, b, c, x);
    if (Math.abs(fpx) < 1e-12) break;
    const nextX = x - fx / fpx;
    if (Math.abs(nextX - x) < 1e-13) {
      x = nextX;
      break;
    }
    x = nextX;
  }
  // If close to integer
  if (Math.abs(x - Math.round(x)) < 1e-6) {
    const candidate = Math.round(x);
    if (Math.abs(evalCubic(a, b, c, d, candidate)) < 1e-7) {
      return candidate;
    }
  }
  return x;
}

/**
 * Solve cubic equation ax^3 + bx^2 + cx + d = 0 (a != 0)
 * Returns real roots sorted in ascending order with multiplicities
 */
export function solveCubic(a: number, b: number, c: number, d: number): { root: number; multiplicity: number }[] {
  // Check easy root at 0 if d is 0
  if (isNearZero(d)) {
    // x * (ax^2 + bx + c) = 0
    const quadRoots: number[] = [];
    const deltaQ = b * b - 4 * a * c;
    if (deltaQ > EPSILON) {
      const sqrtD = Math.sqrt(deltaQ);
      quadRoots.push((-b - sqrtD) / (2 * a));
      quadRoots.push((-b + sqrtD) / (2 * a));
    } else if (Math.abs(deltaQ) <= EPSILON) {
      quadRoots.push(-b / (2 * a));
    }
    const all = [0, ...quadRoots].map(r => refineRoot(a, b, c, d, r)).sort((x, y) => x - y);
    return groupRoots(all);
  }

  // Depressed cubic substitution: x = t - b/(3a)
  // t^3 + p*t + q = 0
  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  const shift = -b / (3 * a);

  // Cardano discriminant: D = (q/2)^2 + (p/3)^3
  const halfQ = q / 2;
  const pOver3 = p / 3;
  const D = halfQ * halfQ + pOver3 * pOver3 * pOver3;

  let rawRoots: number[] = [];

  if (D > EPSILON) {
    // One real root
    const sqrtD = Math.sqrt(D);
    const uArg = -halfQ + sqrtD;
    const vArg = -halfQ - sqrtD;
    const u = Math.sign(uArg) * Math.pow(Math.abs(uArg), 1 / 3);
    const v = Math.sign(vArg) * Math.pow(Math.abs(vArg), 1 / 3);
    rawRoots.push(u + v + shift);
  } else if (Math.abs(D) <= EPSILON) {
    // All roots real, at least two are equal
    if (Math.abs(p) <= EPSILON && Math.abs(q) <= EPSILON) {
      // Triple root
      rawRoots.push(shift, shift, shift);
    } else {
      const uArg = -halfQ;
      const u = Math.sign(uArg) * Math.pow(Math.abs(uArg), 1 / 3);
      rawRoots.push(2 * u + shift);
      rawRoots.push(-u + shift);
      rawRoots.push(-u + shift);
    }
  } else {
    // D < 0: Three distinct real roots (Trigonometric solution)
    const r = Math.sqrt(-pOver3 * pOver3 * pOver3);
    const phi = Math.acos(Math.max(-1, Math.min(1, -halfQ / r)));
    const m = 2 * Math.sqrt(-pOver3);
    rawRoots.push(m * Math.cos(phi / 3) + shift);
    rawRoots.push(m * Math.cos((phi + 2 * Math.PI) / 3) + shift);
    rawRoots.push(m * Math.cos((phi + 4 * Math.PI) / 3) + shift);
  }

  const refined = rawRoots.map(r => refineRoot(a, b, c, d, r)).sort((x, y) => x - y);
  return groupRoots(refined);
}

function groupRoots(sortedRoots: number[]): { root: number; multiplicity: number }[] {
  const result: { root: number; multiplicity: number }[] = [];
  for (const r of sortedRoots) {
    const existing = result.find(item => Math.abs(item.root - r) < 1e-4);
    if (existing) {
      existing.multiplicity += 1;
    } else {
      result.push({ root: r, multiplicity: 1 });
    }
  }
  return result;
}

/**
 * Main Analysis Function
 */
export function analyzeCubic(coefficients: CubicCoefficients): CubicAnalysis {
  const { a, b, c, d } = coefficients;

  if (isNearZero(a)) {
    return {
      isValid: false,
      errorMessage: 'Đây không phải là hàm số bậc ba. Vui lòng nhập a ≠ 0.',
      coefficients,
      functionFormulaLatex: '',
      derivativeFormulaLatex: '',
      secondDerivativeFormulaLatex: '',
      deltaPrime: 0,
      deltaPrimeLatex: '',
      extremaCase: 'no_extrema',
      derivativeRoots: [],
      hasExtrema: false,
      extremaExplanation: '',
      intervals: [],
      monotonicityExplanation: '',
      limitPosInf: '+\\infty',
      limitNegInf: '-\\infty',
      limitExplanation: '',
      yIntercept: { x: 0, y: 0 },
      xIntercepts: [],
      xInterceptExplanation: '',
      inflectionPoint: { x: 0, y: 0 },
      inflectionExplanation: '',
      stepByStepNotes: [],
      specialPoints: []
    };
  }

  // 1. Expressions
  const functionFormulaLatex = `y = ${formatCubicLatex(a, b, c, d)}`;
  const derivativeFormulaLatex = `y' = ${formatDerivativeLatex(a, b, c)}`;
  const secondDerivativeFormulaLatex = `y'' = ${formatNumVi(6 * a)}x ${b !== 0 ? (2 * b > 0 ? `+ ${formatNumVi(2 * b)}` : `- ${formatNumVi(Math.abs(2 * b))}`) : ''}`;

  // 2. Derivative & Delta'
  // y' = 3ax^2 + 2bx + c
  // A = 3a, B' = b, C = c
  // Delta' = b^2 - 3ac
  const deltaPrime = b * b - 3 * a * c;
  const deltaPrimeLatex = `\\Delta' = b^2 - 3ac = (${formatNumVi(b)})^2 - 3 \\cdot (${formatNumVi(a)}) \\cdot (${formatNumVi(c)}) = ${formatNumVi(deltaPrime)}`;

  let extremaCase: ExtremaCase = 'no_extrema';
  let derivativeRoots: number[] = [];
  let hasExtrema = false;
  let localMax: { x: number; y: number } | undefined;
  let localMin: { x: number; y: number } | undefined;
  let extremaExplanation = '';
  let monotonicityExplanation = '';
  const intervals: MonotonicityInterval[] = [];

  if (deltaPrime > EPSILON) {
    extremaCase = 'two_extrema';
    hasExtrema = true;
    const sqrtDelta = Math.sqrt(deltaPrime);
    // x = (-b +- sqrt(Delta')) / (3a)
    const root1 = (-b - sqrtDelta) / (3 * a);
    const root2 = (-b + sqrtDelta) / (3 * a);
    
    // Sort roots left < right
    const leftRoot = Math.min(root1, root2);
    const rightRoot = Math.max(root1, root2);
    derivativeRoots = [leftRoot, rightRoot];

    const yLeft = evalCubic(a, b, c, d, leftRoot);
    const yRight = evalCubic(a, b, c, d, rightRoot);

    if (a > 0) {
      // a > 0: y' > 0 on (-inf, leftRoot) and (rightRoot, +inf)
      // y' < 0 on (leftRoot, rightRoot)
      localMax = { x: leftRoot, y: yLeft };
      localMin = { x: rightRoot, y: yRight };

      intervals.push(
        { from: '-\\infty', to: formatNumVi(leftRoot), fromVal: -Infinity, toVal: leftRoot, type: 'dong_bien', sign: '+' },
        { from: formatNumVi(leftRoot), to: formatNumVi(rightRoot), fromVal: leftRoot, toVal: rightRoot, type: 'nghich_bien', sign: '-' },
        { from: formatNumVi(rightRoot), to: '+\\infty', fromVal: rightRoot, toVal: Infinity, type: 'dong_bien', sign: '+' }
      );

      extremaExplanation = `Vì \\Delta' = b^2 - 3ac = ${formatNumVi(deltaPrime)} > 0 nên phương trình y' = 0 có hai nghiệm phân biệt: x_1 = ${formatNumVi(leftRoot)}, x_2 = ${formatNumVi(rightRoot)}. Do hệ số a = ${formatNumVi(a)} > 0, đạo hàm đổi dấu từ (+) sang (-) qua x_1 và từ (-) sang (+) qua x_2. Do đó hàm số đạt cực đại tại x = ${formatNumVi(leftRoot)} và cực tiểu tại x = ${formatNumVi(rightRoot)}.`;
      monotonicityExplanation = `Hàm số đồng biến trên các khoảng (-\\infty; ${formatNumVi(leftRoot)}) và (${formatNumVi(rightRoot)}; +\\infty); nghịch biến trên khoảng (${formatNumVi(leftRoot)}; ${formatNumVi(rightRoot)}).`;
    } else {
      // a < 0: y' < 0 on (-inf, leftRoot) and (rightRoot, +inf)
      // y' > 0 on (leftRoot, rightRoot)
      localMin = { x: leftRoot, y: yLeft };
      localMax = { x: rightRoot, y: yRight };

      intervals.push(
        { from: '-\\infty', to: formatNumVi(leftRoot), fromVal: -Infinity, toVal: leftRoot, type: 'nghich_bien', sign: '-' },
        { from: formatNumVi(leftRoot), to: formatNumVi(rightRoot), fromVal: leftRoot, toVal: rightRoot, type: 'dong_bien', sign: '+' },
        { from: formatNumVi(rightRoot), to: '+\\infty', fromVal: rightRoot, toVal: Infinity, type: 'nghich_bien', sign: '-' }
      );

      extremaExplanation = `Vì \\Delta' = b^2 - 3ac = ${formatNumVi(deltaPrime)} > 0 nên phương trình y' = 0 có hai nghiệm phân biệt: x_1 = ${formatNumVi(leftRoot)}, x_2 = ${formatNumVi(rightRoot)}. Do hệ số a = ${formatNumVi(a)} < 0, đạo hàm đổi dấu từ (-) sang (+) qua x_1 và từ (+) sang (-) qua x_2. Do đó hàm số đạt cực tiểu tại x = ${formatNumVi(leftRoot)} và cực đại tại x = ${formatNumVi(rightRoot)}.`;
      monotonicityExplanation = `Hàm số nghịch biến trên các khoảng (-\\infty; ${formatNumVi(leftRoot)}) và (${formatNumVi(rightRoot)}; +\\infty); đồng biến trên khoảng (${formatNumVi(leftRoot)}; ${formatNumVi(rightRoot)}).`;
    }
  } else if (Math.abs(deltaPrime) <= EPSILON) {
    extremaCase = 'single_root';
    hasExtrema = false;
    const doubleRoot = -b / (3 * a);
    derivativeRoots = [doubleRoot];

    if (a > 0) {
      intervals.push({
        from: '-\\infty',
        to: '+\\infty',
        fromVal: -Infinity,
        toVal: Infinity,
        type: 'dong_bien',
        sign: '+'
      });
      monotonicityExplanation = `Vì y' = 3a(x - x_0)^2 \\ge 0 với mọi x \\in \\mathbb{R} (dấu bằng chỉ xảy ra tại x = ${formatNumVi(doubleRoot)}), hàm số đồng biến trên toàn bộ \\mathbb{R}.`;
    } else {
      intervals.push({
        from: '-\\infty',
        to: '+\\infty',
        fromVal: -Infinity,
        toVal: Infinity,
        type: 'nghich_bien',
        sign: '-'
      });
      monotonicityExplanation = `Vì y' = 3a(x - x_0)^2 \\le 0 với mọi x \\in \\mathbb{R} (dấu bằng chỉ xảy ra tại x = ${formatNumVi(doubleRoot)}), hàm số nghịch biến trên toàn bộ \\mathbb{R}.`;
    }

    extremaExplanation = `Phương trình y' = 0 có nghiệm kép x_0 = ${formatNumVi(doubleRoot)}. Vì đạo hàm y' không đổi dấu khi đi qua điểm x_0 (y' cùng dấu với a với mọi x ≠ x_0), hàm số không có hai cực trị phân biệt (không có điểm cực trị).`;
  } else {
    // deltaPrime < 0
    extremaCase = 'no_extrema';
    hasExtrema = false;
    derivativeRoots = [];

    if (a > 0) {
      intervals.push({
        from: '-\\infty',
        to: '+\\infty',
        fromVal: -Infinity,
        toVal: Infinity,
        type: 'dong_bien',
        sign: '+'
      });
      monotonicityExplanation = `Vì \\Delta' < 0 và hệ số 3a = ${formatNumVi(3 * a)} > 0 nên y' > 0 với mọi x \\in \\mathbb{R}. Hàm số luôn đồng biến trên toàn bộ tập xác định \\mathbb{R}.`;
    } else {
      intervals.push({
        from: '-\\infty',
        to: '+\\infty',
        fromVal: -Infinity,
        toVal: Infinity,
        type: 'nghich_bien',
        sign: '-'
      });
      monotonicityExplanation = `Vì \\Delta' < 0 và hệ số 3a = ${formatNumVi(3 * a)} < 0 nên y' < 0 với mọi x \\in \\mathbb{R}. Hàm số luôn nghịch biến trên toàn bộ tập xác định \\mathbb{R}.`;
    }

    extremaExplanation = `Vì \\Delta' = b^2 - 3ac = ${formatNumVi(deltaPrime)} < 0 nên phương trình y' = 0 vô nghiệm. Hệ số của x^2 trong y' là 3a = ${formatNumVi(3 * a)} (${a > 0 ? '> 0' : '< 0'}), do đó y' không đổi dấu trên \\mathbb{R}. Vì vậy hàm số đơn điệu trên \\mathbb{R} và không có điểm cực trị.`;
  }

  // 3. Limits
  const limitPosInf = a > 0 ? '+\\infty' : '-\\infty';
  const limitNegInf = a > 0 ? '-\\infty' : '+\\infty';
  const limitExplanation = `Vì bậc cao nhất là 3 (lẻ) và hệ số a = ${formatNumVi(a)} ${a > 0 ? '> 0' : '< 0'}:\n- \\lim_{x \\to +\\infty} y = ${limitPosInf}\n- \\lim_{x \\to -\\infty} y = ${limitNegInf}`;

  // 4. Intercepts
  // y-intercept: (0, d)
  const yIntercept = { x: 0, y: d };

  // x-intercepts: solve ax^3 + bx^2 + cx + d = 0
  const xIntercepts = solveCubic(a, b, c, d);
  let xInterceptExplanation = '';
  if (xIntercepts.length === 1) {
    xInterceptExplanation = `Phương trình ax³ + bx² + cx + d = 0 có 1 nghiệm thực duy nhất x = ${formatNumVi(xIntercepts[0].root)}. Đồ thị cắt trục hoành tại 1 điểm: (${formatNumVi(xIntercepts[0].root)}; 0).`;
  } else if (xIntercepts.length === 2) {
    const single = xIntercepts.find(r => r.multiplicity === 1);
    const doubleR = xIntercepts.find(r => r.multiplicity === 2);
    xInterceptExplanation = `Phương trình có 2 nghiệm thực (1 nghiệm đơn x = ${formatNumVi(single?.root ?? 0)}, 1 nghiệm kép x = ${formatNumVi(doubleR?.root ?? 0)}). Đồ thị tiếp xúc với Ox tại (${formatNumVi(doubleR?.root ?? 0)}; 0) và cắt Ox tại (${formatNumVi(single?.root ?? 0)}; 0).`;
  } else {
    xInterceptExplanation = `Phương trình có 3 nghiệm thực phân biệt: x_1 = ${formatNumVi(xIntercepts[0].root)}, x_2 = ${formatNumVi(xIntercepts[1].root)}, x_3 = ${formatNumVi(xIntercepts[2].root)}. Đồ thị cắt trục hoành tại 3 điểm phân biệt.`;
  }

  // 5. Inflection point (Tâm đối xứng)
  // y'' = 6ax + 2b = 0 => x_I = -b / (3a)
  const xInflection = -b / (3 * a);
  const yInflection = evalCubic(a, b, c, d, xInflection);
  const inflectionPoint = { x: xInflection, y: yInflection };
  const inflectionExplanation = `Tâm đối xứng của đồ thị là điểm uốn I(-b / (3a); f(-b / (3a))) = (${formatNumVi(xInflection)}; ${formatNumVi(yInflection)}). Đồ thị hàm số bậc ba luôn nhận điểm uốn I làm tâm đối xứng.`;

  // 6. Special Points list for plot
  const specialPoints: Point2D[] = [];

  // Tâm đối xứng
  specialPoints.push({
    x: xInflection,
    y: yInflection,
    label: `I(${formatNumVi(xInflection)}; ${formatNumVi(yInflection)})`,
    type: 'tam_doi_xung',
    description: 'Tâm đối xứng (Điểm uốn)'
  });

  // Cực đại & Cực tiểu
  if (localMax) {
    specialPoints.push({
      x: localMax.x,
      y: localMax.y,
      label: `CĐ(${formatNumVi(localMax.x)}; ${formatNumVi(localMax.y)})`,
      type: 'cuc_dai',
      description: 'Điểm cực đại'
    });
  }

  if (localMin) {
    specialPoints.push({
      x: localMin.x,
      y: localMin.y,
      label: `CT(${formatNumVi(localMin.x)}; ${formatNumVi(localMin.y)})`,
      type: 'cuc_tieu',
      description: 'Điểm cực tiểu'
    });
  }

  // Giao với Oy
  specialPoints.push({
    x: 0,
    y: d,
    label: `A(0; ${formatNumVi(d)})`,
    type: 'giao_oy',
    description: 'Giao điểm với trục tung Oy'
  });

  // Giao với Ox
  xIntercepts.forEach((r, idx) => {
    // Avoid exact duplicate with A(0; d) if d == 0 and r == 0
    if (Math.abs(r.root) < 1e-4 && Math.abs(d) < 1e-4) return;
    specialPoints.push({
      x: r.root,
      y: 0,
      label: `M${idx + 1}(${formatNumVi(r.root)}; 0)`,
      type: 'giao_ox',
      description: `Giao điểm với Ox (nghiệm ${r.multiplicity > 1 ? `kép bội ${r.multiplicity}` : 'đơn'})`
    });
  });

  // 7. Step by Step notes (Chuẩn theo các bước khảo sát SGK Toán 12)
  const stepByStepNotes = [
    {
      step: '1',
      title: 'Tập xác định',
      latex: 'D = \\mathbb{R}',
      content: 'Hàm số bậc ba là hàm đa thức, xác định với mọi x thuộc tập số thực R.'
    },
    {
      step: '2',
      title: 'Sự biến thiên & Đạo hàm',
      latex: `${derivativeFormulaLatex}; \\quad ${deltaPrimeLatex}`,
      content: `Ta xét phương trình y' = 0: biệt thức thu gọn ${deltaPrimeLatex}. ${
        extremaCase === 'two_extrema'
          ? `Vì Δ' > 0 nên y' = 0 có hai nghiệm phân biệt x₁ = ${formatNumVi(derivativeRoots[0])} và x₂ = ${formatNumVi(derivativeRoots[1])}.`
          : extremaCase === 'single_root'
          ? `Vì Δ' = 0 nên y' = 0 có nghiệm kép x₀ = ${formatNumVi(derivativeRoots[0])}.`
          : `Vì Δ' < 0 nên y' = 0 vô nghiệm.`
      }`
    },
    {
      step: '3',
      title: 'Chiều biến thiên & Cực trị',
      latex: hasExtrema
        ? `y_{CĐ} = ${formatNumVi(localMax?.y ?? 0)}, \\quad y_{CT} = ${formatNumVi(localMin?.y ?? 0)}`
        : undefined,
      content: `${monotonicityExplanation} ${extremaExplanation}`
    },
    {
      step: '4',
      title: 'Giới hạn tại vô cực',
      latex: `\\lim_{x \\to +\\infty} y = ${limitPosInf}, \\quad \\lim_{x \\to -\\infty} y = ${limitNegInf}`,
      content: limitExplanation
    },
    {
      step: '5',
      title: 'Các điểm đặc biệt & Tâm đối xứng',
      latex: `I\\left(${formatNumVi(xInflection)}; ${formatNumVi(yInflection)}\\right), \\quad A(0; ${formatNumVi(d)})`,
      content: `${inflectionExplanation} ${xInterceptExplanation}`
    }
  ];

  return {
    isValid: true,
    coefficients,
    functionFormulaLatex,
    derivativeFormulaLatex,
    secondDerivativeFormulaLatex,
    deltaPrime,
    deltaPrimeLatex,
    extremaCase,
    derivativeRoots,
    hasExtrema,
    localMax,
    localMin,
    extremaExplanation,
    intervals,
    monotonicityExplanation,
    limitPosInf,
    limitNegInf,
    limitExplanation,
    yIntercept,
    xIntercepts,
    xInterceptExplanation,
    inflectionPoint,
    inflectionExplanation,
    stepByStepNotes,
    specialPoints
  };
}
