/**
 * Test utilities and custom assertion library for Math 12 website test suite.
 * Follows strict mathematical tolerance requirements and independent verification.
 */

export interface TestResult {
  suiteName: string;
  testName: string;
  passed: boolean;
  error?: string;
  expected?: any;
  actual?: any;
  durationMs: number;
}

export interface SuiteResult {
  suiteName: string;
  total: number;
  passed: number;
  failed: number;
  tests: TestResult[];
}

export class AssertionError extends Error {
  expected: any;
  actual: any;
  constructor(message: string, expected?: any, actual?: any) {
    super(message);
    this.name = 'AssertionError';
    this.expected = expected;
    this.actual = actual;
  }
}

/**
 * Asserts that two real numbers are equal within a specified relative or absolute tolerance.
 */
export function assertNear(
  actual: number,
  expected: number,
  tolerance: number = 1e-4,
  message: string = 'Numbers should be approximately equal'
): void {
  if (isNaN(actual) || isNaN(expected)) {
    throw new AssertionError(
      `${message}: NaN encountered. Expected ${expected}, got ${actual}`,
      expected,
      actual
    );
  }
  const diff = Math.abs(actual - expected);
  // Support both absolute and relative tolerance for small vs large numbers
  const maxMagnitude = Math.max(Math.abs(actual), Math.abs(expected), 1.0);
  if (diff > tolerance * maxMagnitude && diff > tolerance) {
    throw new AssertionError(
      `${message}: Expected ${expected} ± ${tolerance}, but received ${actual} (diff: ${diff.toExponential(4)})`,
      expected,
      actual
    );
  }
}

export function assertStrictEqual<T>(actual: T, expected: T, message: string = 'Values should be strictly equal'): void {
  if (actual !== expected) {
    throw new AssertionError(
      `${message}: Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
      expected,
      actual
    );
  }
}

export function assertTrue(condition: boolean, message: string = 'Expected condition to be true'): void {
  if (!condition) {
    throw new AssertionError(message, true, false);
  }
}

export function assertFalse(condition: boolean, message: string = 'Expected condition to be false'): void {
  if (condition) {
    throw new AssertionError(message, false, true);
  }
}

export function assertDeepEqual(actual: any, expected: any, message: string = 'Objects should be deeply equal'): void {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new AssertionError(
      `${message}:\nExpected: ${expectedStr}\nActual:   ${actualStr}`,
      expected,
      actual
    );
  }
}

export class TestRunner {
  private suites: { name: string; fn: () => void | Promise<void> }[] = [];
  private currentSuiteName: string = '';
  private currentSuiteResults: TestResult[] = [];
  public allSuiteResults: SuiteResult[] = [];

  suite(name: string, fn: () => void | Promise<void>) {
    this.suites.push({ name, fn });
  }

  async test(name: string, fn: () => void | Promise<void>) {
    const start = performance.now();
    try {
      await fn();
      const durationMs = performance.now() - start;
      this.currentSuiteResults.push({
        suiteName: this.currentSuiteName,
        testName: name,
        passed: true,
        durationMs
      });
    } catch (err: any) {
      const durationMs = performance.now() - start;
      this.currentSuiteResults.push({
        suiteName: this.currentSuiteName,
        testName: name,
        passed: false,
        error: err.message || String(err),
        expected: err.expected,
        actual: err.actual,
        durationMs
      });
    }
  }

  async run(): Promise<SuiteResult[]> {
    this.allSuiteResults = [];
    for (const s of this.suites) {
      this.currentSuiteName = s.name;
      this.currentSuiteResults = [];
      await s.fn();
      const passed = this.currentSuiteResults.filter((t) => t.passed).length;
      const failed = this.currentSuiteResults.filter((t) => !t.passed).length;
      this.allSuiteResults.push({
        suiteName: s.name,
        total: this.currentSuiteResults.length,
        passed,
        failed,
        tests: [...this.currentSuiteResults]
      });
    }
    return this.allSuiteResults;
  }
}
