import { TestRunner, assertNear, assertStrictEqual, assertTrue, assertFalse } from './testUtils';
import {
  evalCubic,
  evalDerivative,
  solveCubic,
  analyzeCubic,
  isNearZero,
  roundPrecision,
  toNiceFraction,
  formatNumVi,
  formatPointVi,
  formatCubicLatex,
  formatDerivativeLatex
} from '../src/mathEngine';

export function registerMathEngineTests(runner: TestRunner) {
  // SUITE 1: NUMERICAL UTILITIES
  runner.suite('MathEngine: Numerical & Formatting Utilities', () => {
    runner.test('isNearZero: Identifies values within epsilon = 1e-9', () => {
      assertTrue(isNearZero(0), '0 is near zero');
      assertTrue(isNearZero(1e-10), '1e-10 is near zero');
      assertTrue(isNearZero(-1e-10), '-1e-10 is near zero');
      assertFalse(isNearZero(1e-8), '1e-8 is not near zero');
      assertFalse(isNearZero(-1e-8), '-1e-8 is not near zero');
      assertFalse(isNearZero(1), '1 is not near zero');
    });

    runner.test('roundPrecision: Correct rounding and -0 normalization', () => {
      assertStrictEqual(roundPrecision(3.14159265, 2), 3.14);
      assertStrictEqual(roundPrecision(3.14159265, 4), 3.1416);
      assertStrictEqual(roundPrecision(2.00000001, 4), 2);
      // Boundary: value near zero
      assertStrictEqual(roundPrecision(1e-14, 4), 0);
      assertStrictEqual(roundPrecision(-1e-14, 4), 0);
    });

    runner.test('toNiceFraction: Independent rational number detection', () => {
      // 0
      const frac0 = toNiceFraction(0);
      assertTrue(frac0.isFraction);
      assertStrictEqual(frac0.text, '0');

      // Integers
      const fracInt = toNiceFraction(5);
      assertTrue(fracInt.isFraction);
      assertStrictEqual(fracInt.text, '5');

      const fracNegInt = toNiceFraction(-4);
      assertTrue(fracNegInt.isFraction);
      assertStrictEqual(fracNegInt.text, '-4');

      // 1/3 ~ 0.3333333333
      const fracThird = toNiceFraction(1 / 3);
      assertTrue(fracThird.isFraction);
      assertStrictEqual(fracThird.numerator, 1);
      assertStrictEqual(fracThird.denominator, 3);
      assertStrictEqual(fracThird.text, '\\frac{1}{3}');

      // -3/4 = -0.75
      const fracNeg34 = toNiceFraction(-0.75);
      assertTrue(fracNeg34.isFraction);
      assertStrictEqual(fracNeg34.numerator, -3);
      assertStrictEqual(fracNeg34.denominator, 4);

      // Irrational sqrt(2) ~ 1.41421356 should not be a simple fraction with q <= 16
      const fracIrr = toNiceFraction(Math.SQRT2);
      assertFalse(fracIrr.isFraction);
    });

    runner.test('formatNumVi: Formats Vietnamese decimal notation and prevents -0', () => {
      assertStrictEqual(formatNumVi(0), '0');
      assertStrictEqual(formatNumVi(-0), '0');
      assertStrictEqual(formatNumVi(-0.00000001), '0');
      assertStrictEqual(formatNumVi(12.5), '12.5');
      assertStrictEqual(formatNumVi(-3.75), '-3.75');
    });

    runner.test('formatPointVi: Formats 2D point (x; y)', () => {
      assertStrictEqual(formatPointVi(1, 2), '(1; 2)');
      assertStrictEqual(formatPointVi(-3.5, 0), '(-3.5; 0)');
    });

    runner.test('formatCubicLatex: Polynomial formatting rules', () => {
      // Standard: x^3 - 3x^2 + 2
      assertStrictEqual(formatCubicLatex(1, -3, 0, 2), 'x^3 - 3x^2 + 2');
      // Negative leading coeff: -x^3 + 2x - 5
      assertStrictEqual(formatCubicLatex(-1, 0, 2, -5), '-x^3 + 2x - 5');
      // Coeff > 1: 2x^3 + x^2 - x
      assertStrictEqual(formatCubicLatex(2, 1, -1, 0), '2x^3 + x^2 - x');
      // Pure cubic: x^3
      assertStrictEqual(formatCubicLatex(1, 0, 0, 0), 'x^3');
    });

    runner.test('formatDerivativeLatex: Quadratic derivative formatting', () => {
      // For y = x^3 - 3x^2 + 2 -> y' = 3x^2 - 6x
      assertStrictEqual(formatDerivativeLatex(1, -3, 0), '3x^2 - 6x');
      // For a = 1/3, b = 0, c = -4 -> y' = x^2 - 4
      assertStrictEqual(formatDerivativeLatex(1 / 3, 0, -4), 'x^2 - 4');
    });
  });

  // SUITE 2: POLYNOMIAL EVALUATION & DERIVATIVES
  runner.suite('MathEngine: evalCubic & evalDerivative', () => {
    runner.test('evalCubic: Independent polynomial calculation f(x) = ax^3 + bx^2 + cx + d', () => {
      // Function: f(x) = 2x^3 - 3x^2 + 4x - 5
      // Independently verified:
      // f(0) = -5
      assertNear(evalCubic(2, -3, 4, -5, 0), -5, 1e-9);
      // f(1) = 2(1) - 3(1) + 4(1) - 5 = -2
      assertNear(evalCubic(2, -3, 4, -5, 1), -2, 1e-9);
      // f(2) = 2(8) - 3(4) + 4(2) - 5 = 16 - 12 + 8 - 5 = 7
      assertNear(evalCubic(2, -3, 4, -5, 2), 7, 1e-9);
      // f(-1) = 2(-1) - 3(1) + 4(-1) - 5 = -2 - 3 - 4 - 5 = -14
      assertNear(evalCubic(2, -3, 4, -5, -1), -14, 1e-9);
      // Float x = 0.5: f(0.5) = 2(0.125) - 3(0.25) + 4(0.5) - 5 = 0.25 - 0.75 + 2 - 5 = -3.5
      assertNear(evalCubic(2, -3, 4, -5, 0.5), -3.5, 1e-9);
      // Large boundary value: x = 100
      // f(100) = 2(1000000) - 3(10000) + 4(100) - 5 = 1970395
      assertNear(evalCubic(2, -3, 4, -5, 100), 1970395, 1e-6);
    });

    runner.test('evalDerivative: Analytical derivative f\'(x) = 3ax^2 + 2bx + c', () => {
      // f(x) = 2x^3 - 3x^2 + 4x - 5 -> f'(x) = 6x^2 - 6x + 4
      // f'(0) = 4
      assertNear(evalDerivative(2, -3, 4, 0), 4, 1e-9);
      // f'(1) = 6(1) - 6(1) + 4 = 4
      assertNear(evalDerivative(2, -3, 4, 1), 4, 1e-9);
      // f'(2) = 6(4) - 6(2) + 4 = 16
      assertNear(evalDerivative(2, -3, 4, 2), 16, 1e-9);
      // f'(-1) = 6(1) - 6(-1) + 4 = 16
      assertNear(evalDerivative(2, -3, 4, -1), 16, 1e-9);

      // Verify against independent numerical differentiation: [f(x+h) - f(x-h)] / (2h)
      const a = 1.5, b = -2.0, c = 3.5, d = -1.0;
      const testPoints = [-5, -2, 0, 1.5, 3];
      const h = 1e-6;
      for (const x of testPoints) {
        const numericalDeriv = (evalCubic(a, b, c, d, x + h) - evalCubic(a, b, c, d, x - h)) / (2 * h);
        const analyticalDeriv = evalDerivative(a, b, c, x);
        assertNear(analyticalDeriv, numericalDeriv, 1e-5, `Derivative check at x = ${x}`);
      }
    });
  });

  // SUITE 3: CUBIC EQUATION SOLVER
  runner.suite('MathEngine: solveCubic (Cardano & Trigonometric Root Finding)', () => {
    runner.test('Three distinct integer roots: (x - 1)(x - 2)(x - 3) = x^3 - 6x^2 + 11x - 6 = 0', () => {
      // Independent math: roots are x = 1, 2, 3
      const roots = solveCubic(1, -6, 11, -6);
      assertStrictEqual(roots.length, 3, 'Should find 3 real roots');
      assertNear(roots[0].root, 1, 1e-4);
      assertStrictEqual(roots[0].multiplicity, 1);
      assertNear(roots[1].root, 2, 1e-4);
      assertStrictEqual(roots[1].multiplicity, 1);
      assertNear(roots[2].root, 3, 1e-4);
      assertStrictEqual(roots[2].multiplicity, 1);
    });

    runner.test('Symmetric roots around 0: x(x - 2)(x + 2) = x^3 - 4x = 0 (d = 0 branch)', () => {
      // Independent math: roots are -2, 0, 2
      const roots = solveCubic(1, 0, -4, 0);
      assertStrictEqual(roots.length, 3, 'Should find 3 real roots');
      assertNear(roots[0].root, -2, 1e-4);
      assertNear(roots[1].root, 0, 1e-4);
      assertNear(roots[2].root, 2, 1e-4);
    });

    runner.test('Double root + Single root: (x - 1)^2 * (x + 2) = x^3 - 3x + 2 = 0', () => {
      // Independent math: roots are x = -2 (mult 1) and x = 1 (mult 2)
      const roots = solveCubic(1, 0, -3, 2);
      assertStrictEqual(roots.length, 2, 'Should find 2 distinct root groups');
      assertNear(roots[0].root, -2, 1e-4);
      assertStrictEqual(roots[0].multiplicity, 1, 'x = -2 multiplicity 1');
      assertNear(roots[1].root, 1, 1e-4);
      assertStrictEqual(roots[1].multiplicity, 2, 'x = 1 multiplicity 2');
    });

    runner.test('Triple root: (x - 3)^3 = x^3 - 9x^2 + 27x - 27 = 0', () => {
      // Independent math: single root x = 3 with multiplicity 3
      const roots = solveCubic(1, -9, 27, -27);
      assertStrictEqual(roots.length, 1, 'Should group into 1 root');
      assertNear(roots[0].root, 3, 1e-4);
      assertStrictEqual(roots[0].multiplicity, 3, 'Multiplicity should be 3');
    });

    runner.test('Single real root (Cardano D > 0): x^3 - 8 = 0', () => {
      // Independent math: real root x = 2
      const roots = solveCubic(1, 0, 0, -8);
      assertStrictEqual(roots.length, 1, 'Should find 1 real root');
      assertNear(roots[0].root, 2, 1e-4);
      assertStrictEqual(roots[0].multiplicity, 1);
    });

    runner.test('d = 0 with irreducible quadratic: x(x^2 + 4) = x^3 + 4x = 0', () => {
      // Independent math: only root is x = 0
      const roots = solveCubic(1, 0, 4, 0);
      assertStrictEqual(roots.length, 1, 'Should only have x = 0');
      assertNear(roots[0].root, 0, 1e-4);
      assertStrictEqual(roots[0].multiplicity, 1);
    });

    runner.test('Negative leading coefficient a = -1: -(x - 1)^3 = -x^3 + 3x^2 - 3x + 1 = 0', () => {
      // Independent math: x = 1 with mult 3
      const roots = solveCubic(-1, 3, -3, 1);
      assertStrictEqual(roots.length, 1);
      assertNear(roots[0].root, 1, 1e-4);
      assertStrictEqual(roots[0].multiplicity, 3);
    });

    runner.test('Irrational roots: x^3 - 3x = 0 -> roots: -sqrt(3), 0, sqrt(3)', () => {
      const roots = solveCubic(1, 0, -3, 0);
      assertStrictEqual(roots.length, 3);
      assertNear(roots[0].root, -Math.sqrt(3), 1e-4);
      assertNear(roots[1].root, 0, 1e-4);
      assertNear(roots[2].root, Math.sqrt(3), 1e-4);
    });

    runner.test('Boundary case: large constant term x^3 - 1000 = 0 -> root = 10', () => {
      const roots = solveCubic(1, 0, 0, -1000);
      assertStrictEqual(roots.length, 1);
      assertNear(roots[0].root, 10, 1e-4);
    });
  });

  // SUITE 4: FULL CUBIC FUNCTION ANALYSIS (analyzeCubic)
  runner.suite('MathEngine: analyzeCubic Comprehensive Survey', () => {
    runner.test('Invalid input: a = 0 returns isValid = false and error message', () => {
      const result = analyzeCubic({ a: 0, b: 2, c: -3, d: 1 });
      assertFalse(result.isValid, 'Should be invalid when a = 0');
      assertTrue(result.errorMessage !== undefined && result.errorMessage.length > 0, 'Error message present');
    });

    runner.test('Standard Case 1 (a > 0, Delta\' > 0, Two Extrema): y = x^3 - 3x^2 + 2', () => {
      // y = x^3 - 3x^2 + 2
      // a = 1, b = -3, c = 0, d = 2
      // y' = 3x^2 - 6x -> Delta' = (-3)^2 - 3(1)(0) = 9 > 0
      // Roots of y' = 0: x1 = 0, x2 = 2
      // Local Max: (0; 2), Local Min: (2; -2)
      // Inflection point: x_I = -(-3)/(3*1) = 1, y_I = 1 - 3 + 2 = 0 -> I(1; 0)
      const analysis = analyzeCubic({ a: 1, b: -3, c: 0, d: 2 });
      assertTrue(analysis.isValid);
      assertStrictEqual(analysis.extremaCase, 'two_extrema');
      assertTrue(analysis.hasExtrema);

      // Delta'
      assertNear(analysis.deltaPrime, 9, 1e-4);

      // Derivative roots
      assertStrictEqual(analysis.derivativeRoots.length, 2);
      assertNear(analysis.derivativeRoots[0], 0, 1e-4);
      assertNear(analysis.derivativeRoots[1], 2, 1e-4);

      // Local Max & Min
      assertTrue(analysis.localMax !== undefined);
      assertTrue(analysis.localMin !== undefined);
      assertNear(analysis.localMax!.x, 0, 1e-4);
      assertNear(analysis.localMax!.y, 2, 1e-4);
      assertNear(analysis.localMin!.x, 2, 1e-4);
      assertNear(analysis.localMin!.y, -2, 1e-4);

      // Inflection point (Tâm đối xứng)
      assertNear(analysis.inflectionPoint.x, 1, 1e-4);
      assertNear(analysis.inflectionPoint.y, 0, 1e-4);

      // Limits at infinity: a > 0 -> +inf at +inf, -inf at -inf
      assertStrictEqual(analysis.limitPosInf, '+\\infty');
      assertStrictEqual(analysis.limitNegInf, '-\\infty');

      // Monotonicity intervals
      assertStrictEqual(analysis.intervals.length, 3);
      assertStrictEqual(analysis.intervals[0].type, 'dong_bien');
      assertStrictEqual(analysis.intervals[1].type, 'nghich_bien');
      assertStrictEqual(analysis.intervals[2].type, 'dong_bien');

      // Intercepts
      assertNear(analysis.yIntercept.y, 2, 1e-4);
      // x^3 - 3x^2 + 2 = (x - 1)(x^2 - 2x - 2) = 0
      // Roots: x = 1, x = 1 - sqrt(3) ~ -0.732, x = 1 + sqrt(3) ~ 2.732
      assertStrictEqual(analysis.xIntercepts.length, 3);
      assertNear(analysis.xIntercepts[0].root, 1 - Math.sqrt(3), 1e-3);
      assertNear(analysis.xIntercepts[1].root, 1, 1e-3);
      assertNear(analysis.xIntercepts[2].root, 1 + Math.sqrt(3), 1e-3);
    });

    runner.test('Standard Case 2 (a < 0, Delta\' > 0, Two Extrema): y = -x^3 + 3x', () => {
      // y = -x^3 + 3x
      // a = -1, b = 0, c = 3, d = 0
      // y' = -3x^2 + 3 -> Delta' = 0 - 3(-1)(3) = 9 > 0
      // Roots of y' = 0: x1 = -1, x2 = 1
      // Because a < 0:
      // Local Min at x = -1, y = -(-1) + 3(-1) = -2
      // Local Max at x = 1, y = -1 + 3 = 2
      // Inflection point: x_I = 0, y_I = 0
      const analysis = analyzeCubic({ a: -1, b: 0, c: 3, d: 0 });
      assertTrue(analysis.isValid);
      assertStrictEqual(analysis.extremaCase, 'two_extrema');
      assertTrue(analysis.hasExtrema);

      assertNear(analysis.deltaPrime, 9, 1e-4);
      assertNear(analysis.localMin!.x, -1, 1e-4);
      assertNear(analysis.localMin!.y, -2, 1e-4);
      assertNear(analysis.localMax!.x, 1, 1e-4);
      assertNear(analysis.localMax!.y, 2, 1e-4);

      // Limits at infinity: a < 0 -> -inf at +inf, +inf at -inf
      assertStrictEqual(analysis.limitPosInf, '-\\infty');
      assertStrictEqual(analysis.limitNegInf, '+\\infty');

      // Monotonicity: nghich_bien, dong_bien, nghich_bien
      assertStrictEqual(analysis.intervals.length, 3);
      assertStrictEqual(analysis.intervals[0].type, 'nghich_bien');
      assertStrictEqual(analysis.intervals[1].type, 'dong_bien');
      assertStrictEqual(analysis.intervals[2].type, 'nghich_bien');
    });

    runner.test('Case 3 (Delta\' = 0, Inflection Tangent Horizontal): y = x^3 - 3x^2 + 3x - 1', () => {
      // y = (x - 1)^3 = x^3 - 3x^2 + 3x - 1
      // a = 1, b = -3, c = 3, d = -1
      // Delta' = (-3)^2 - 3(1)(3) = 9 - 9 = 0
      // Double root of derivative: x_0 = -(-3)/(3*1) = 1
      const analysis = analyzeCubic({ a: 1, b: -3, c: 3, d: -1 });
      assertTrue(analysis.isValid);
      assertStrictEqual(analysis.extremaCase, 'single_root');
      assertFalse(analysis.hasExtrema, 'Delta\' = 0 has no extrema');
      assertNear(analysis.deltaPrime, 0, 1e-4);

      assertStrictEqual(analysis.derivativeRoots.length, 1);
      assertNear(analysis.derivativeRoots[0], 1, 1e-4);

      // Strictly increasing on R
      assertStrictEqual(analysis.intervals.length, 1);
      assertStrictEqual(analysis.intervals[0].type, 'dong_bien');
      assertStrictEqual(analysis.intervals[0].fromVal, -Infinity);
      assertStrictEqual(analysis.intervals[0].toVal, Infinity);
    });

    runner.test('Case 4 (Delta\' = 0, a < 0): y = -x^3', () => {
      // a = -1, b = 0, c = 0, d = 0
      const analysis = analyzeCubic({ a: -1, b: 0, c: 0, d: 0 });
      assertTrue(analysis.isValid);
      assertStrictEqual(analysis.extremaCase, 'single_root');
      assertFalse(analysis.hasExtrema);
      assertStrictEqual(analysis.intervals.length, 1);
      assertStrictEqual(analysis.intervals[0].type, 'nghich_bien');
    });

    runner.test('Case 5 (Delta\' < 0, a > 0, No Extrema): y = x^3 + 3x + 1', () => {
      // y = x^3 + 3x + 1
      // a = 1, b = 0, c = 3, d = 1
      // Delta' = 0 - 3(1)(3) = -9 < 0
      const analysis = analyzeCubic({ a: 1, b: 0, c: 3, d: 1 });
      assertTrue(analysis.isValid);
      assertStrictEqual(analysis.extremaCase, 'no_extrema');
      assertFalse(analysis.hasExtrema);
      assertNear(analysis.deltaPrime, -9, 1e-4);
      assertStrictEqual(analysis.derivativeRoots.length, 0);

      // Monotonicity: dong_bien on whole R
      assertStrictEqual(analysis.intervals.length, 1);
      assertStrictEqual(analysis.intervals[0].type, 'dong_bien');
    });

    runner.test('Case 6 (Delta\' < 0, a < 0, No Extrema): y = -2x^3 - 4x', () => {
      // a = -2, b = 0, c = -4, d = 0
      // Delta' = 0 - 3(-2)(-4) = -24 < 0
      const analysis = analyzeCubic({ a: -2, b: 0, c: -4, d: 0 });
      assertTrue(analysis.isValid);
      assertStrictEqual(analysis.extremaCase, 'no_extrema');
      assertFalse(analysis.hasExtrema);
      assertStrictEqual(analysis.intervals.length, 1);
      assertStrictEqual(analysis.intervals[0].type, 'nghich_bien');
    });

    runner.test('Special Points array includes inflection, extrema, and intercepts', () => {
      const analysis = analyzeCubic({ a: 1, b: -3, c: 0, d: 2 });
      const types = analysis.specialPoints.map((p) => p.type);
      assertTrue(types.includes('tam_doi_xung'), 'Contains tâm đối xứng');
      assertTrue(types.includes('cuc_dai'), 'Contains cực đại');
      assertTrue(types.includes('cuc_tieu'), 'Contains cực tiểu');
      assertTrue(types.includes('giao_oy'), 'Contains giao Oy');
      assertTrue(types.includes('giao_ox'), 'Contains giao Ox');
    });
  });
}
