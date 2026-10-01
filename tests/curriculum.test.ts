import { TestRunner, assertNear, assertStrictEqual, assertTrue } from './testUtils';
import { PRACTICE_QUESTIONS, FORMULA_HANDBOOK } from '../src/data/curriculumData';

export function registerCurriculumTests(runner: TestRunner) {
  runner.suite('Curriculum: Practice Questions Mathematical Verification', () => {
    runner.test('Question 1: Inflection point of y = x^3 - 3x^2 + 2', () => {
      const q = PRACTICE_QUESTIONS.find((item) => item.id === 1);
      assertTrue(q !== undefined, 'Question 1 exists');

      // Independent Math:
      // y' = 3x^2 - 6x
      // y'' = 6x - 6 = 0 <=> x = 1
      // y(1) = 1^3 - 3(1)^2 + 2 = 0
      // Expected: I(1; 0)
      const expectedAnswer = 'A';
      assertStrictEqual(q!.correctAnswer, expectedAnswer);
      const chosenOption = q!.options.find((o) => o.key === q!.correctAnswer);
      assertTrue(chosenOption !== undefined && chosenOption.text.includes('I(1; 0)'));
    });

    runner.test('Question 2: Parameter m condition for 2 extrema of y = x^3 - 3mx^2 + 3(m^2 - 1)x + 1', () => {
      const q = PRACTICE_QUESTIONS.find((item) => item.id === 2);
      assertTrue(q !== undefined, 'Question 2 exists');

      // Independent Math:
      // y' = 3x^2 - 6mx + 3(m^2 - 1)
      // Delta' = (-3m)^2 - 3 * 3(m^2 - 1) = 9m^2 - 9m^2 + 9 = 9 > 0 for all m in R
      const expectedAnswer = 'A';
      assertStrictEqual(q!.correctAnswer, expectedAnswer);
      const chosenOption = q!.options.find((o) => o.key === q!.correctAnswer);
      assertTrue(chosenOption !== undefined && (chosenOption.text.includes('mọi m') || chosenOption.text.includes('m ∈ ℝ')));
    });

    runner.test('Question 3: Maximum value of f(x) = x^3 - 3x + 2 on [0; 2]', () => {
      const q = PRACTICE_QUESTIONS.find((item) => item.id === 3);
      assertTrue(q !== undefined, 'Question 3 exists');

      // Independent Math:
      // f'(x) = 3x^2 - 3 = 0 <=> x = 1 (in [0; 2]) or x = -1 (not in [0; 2])
      // f(0) = 2
      // f(1) = 1 - 3 + 2 = 0
      // f(2) = 8 - 6 + 2 = 4
      // max = 4 at x = 2
      const f = (x: number) => x * x * x - 3 * x + 2;
      const valuesOnInterval = [f(0), f(1), f(2)];
      const maxVal = Math.max(...valuesOnInterval);
      assertStrictEqual(maxVal, 4);

      assertStrictEqual(q!.correctAnswer, 'A');
      const chosenOption = q!.options.find((o) => o.key === q!.correctAnswer);
      assertTrue(chosenOption !== undefined && chosenOption.text.includes('4'));
    });

    runner.test('Question 4: Normal vector of plane (P): 2x - 3y + z - 5 = 0', () => {
      const q = PRACTICE_QUESTIONS.find((item) => item.id === 4);
      assertTrue(q !== undefined, 'Question 4 exists');

      // Independent Math:
      // Ax + By + Cz + D = 0 -> normal vector n = (A, B, C) = (2, -3, 1)
      assertStrictEqual(q!.correctAnswer, 'A');
      const chosenOption = q!.options.find((o) => o.key === q!.correctAnswer);
      assertTrue(chosenOption !== undefined && chosenOption.text.includes('(2; -3; 1)'));
    });

    runner.test('Question 5: Domain of y = log_2(2x - 4)', () => {
      const q = PRACTICE_QUESTIONS.find((item) => item.id === 5);
      assertTrue(q !== undefined, 'Question 5 exists');

      // Independent Math:
      // Condition: 2x - 4 > 0 <=> 2x > 4 <=> x > 2
      // Domain: D = (2; +inf)
      assertStrictEqual(q!.correctAnswer, 'A');
      const chosenOption = q!.options.find((o) => o.key === q!.correctAnswer);
      assertTrue(chosenOption !== undefined && chosenOption.text.includes('(2; +∞)'));
    });
  });

  runner.suite('Curriculum: Formula Handbook Numerical Examples Verification', () => {
    runner.test('Formula f1: Delta\' calculation for y = x^3 - 3x^2 + 2', () => {
      const f1 = FORMULA_HANDBOOK.find((item) => item.id === 'f1');
      assertTrue(f1 !== undefined);
      // y' = 3x^2 - 6x -> a = 1, b = -3, c = 0
      // Delta' = b^2 - 3ac = (-3)^2 - 3(1)(0) = 9
      const b = -3, a = 1, c = 0;
      const deltaPrime = b * b - 3 * a * c;
      assertStrictEqual(deltaPrime, 9);
      assertTrue(f1!.example!.includes('9 > 0'));
    });

    runner.test('Formula f3: Inflection point of y = 2x^3 - 6x^2 + 1', () => {
      const f3 = FORMULA_HANDBOOK.find((item) => item.id === 'f3');
      assertTrue(f3 !== undefined);
      // x_I = -b / (3a) = -(-6) / (3 * 2) = 6 / 6 = 1
      // y_I = 2(1)^3 - 6(1)^2 + 1 = 2 - 6 + 1 = -3
      // I(1; -3)
      const a = 2, b = -6, d = 1;
      const xI = -b / (3 * a);
      const yI = a * xI * xI * xI + b * xI * xI + d;
      assertNear(xI, 1, 1e-9);
      assertNear(yI, -3, 1e-9);
      assertTrue(f3!.example!.includes('I(1; -3)'));
    });

    runner.test('Formula f6: Distance M(1; 2; 3) to plane x + 2y - 2z + 5 = 0', () => {
      const f6 = FORMULA_HANDBOOK.find((item) => item.id === 'f6');
      assertTrue(f6 !== undefined);
      // d = |1 + 2(2) - 2(3) + 5| / sqrt(1^2 + 2^2 + (-2)^2) = |1 + 4 - 6 + 5| / 3 = 4 / 3
      const num = Math.abs(1 + 2 * 2 - 2 * 3 + 5);
      const den = Math.sqrt(1 + 4 + 4);
      assertStrictEqual(num, 4);
      assertStrictEqual(den, 3);
      assertNear(num / den, 4 / 3, 1e-4);
      assertTrue(f6!.example!.includes('4/3'));
    });
  });
}
