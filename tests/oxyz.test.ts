import { TestRunner, assertNear, assertStrictEqual, assertTrue } from './testUtils';

/**
 * Mathematical formulas used in OxyzLab.tsx:
 * 1. Distance from point M(x0, y0, z0) to plane (α): Ax + By + Cz + D = 0
 *    d(M, (α)) = |A*x0 + B*y0 + C*z0 + D| / sqrt(A^2 + B^2 + C^2)
 * 2. 3D Projective transformation:
 *    Rotation around Y axis (yaw), then around X axis (pitch), then screen projection.
 */

// Function extracted directly from OxyzLab calculation logic for testing
export function calcDistanceOxyz(
  A: number,
  B: number,
  C: number,
  D: number,
  mx: number,
  my: number,
  mz: number
): number {
  const numerator = Math.abs(A * mx + B * my + C * mz + D);
  const denominator = Math.sqrt(A * A + B * B + C * C);
  return denominator === 0 ? 0 : numerator / denominator;
}

export function project3DMath(
  x: number,
  y: number,
  z: number,
  yaw: number,
  pitch: number,
  cx: number,
  cy: number,
  scale: number
) {
  // Rotate around Y axis (yaw)
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const x1 = x * cosY - y * sinY;
  const y1 = x * sinY + y * cosY;
  const z1 = z;

  // Rotate around X axis (pitch)
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const x2 = x1;
  const y2 = y1 * cosP - z1 * sinP;
  const z2 = y1 * sinP + z1 * cosP;

  // Screen coords (Z axis points up)
  return {
    x: cx + x2 * scale,
    y: cy - z2 * scale,
    depth: y2,
    // 3D rotated point coordinates for rotation matrix verification
    rotX: x2,
    rotY: y2,
    rotZ: z2
  };
}

export function registerOxyzTests(runner: TestRunner) {
  runner.suite('Oxyz 3D Lab: Distance & Projection Mathematics', () => {
    runner.test('Distance: Point on plane yields distance = 0', () => {
      // Plane: 2x - y + 2z - 4 = 0.
      // Point M(1, 0, 1): 2(1) - 0 + 2(1) - 4 = 0 -> lies on plane
      const d = calcDistanceOxyz(2, -1, 2, -4, 1, 0, 1);
      assertNear(d, 0, 1e-9, 'Distance of point on plane should be 0');
    });

    runner.test('Distance: Distance from origin O(0,0,0) to plane x + 2y - 2z + 6 = 0', () => {
      // Independent formula: |6| / sqrt(1^2 + 2^2 + (-2)^2) = 6 / sqrt(9) = 6 / 3 = 2.0
      const d = calcDistanceOxyz(1, 2, -2, 6, 0, 0, 0);
      assertNear(d, 2.0, 1e-9);
    });

    runner.test('Distance: Preset 1 in app: x + y + z - 3 = 0, M(1, 2, 3)', () => {
      // Independent formula: |1 + 2 + 3 - 3| / sqrt(1 + 1 + 1) = 3 / sqrt(3) = sqrt(3) ~ 1.73205
      const d = calcDistanceOxyz(1, 1, 1, -3, 1, 2, 3);
      assertNear(d, Math.sqrt(3), 1e-4);
    });

    runner.test('Distance: Preset 2 in app: 2x - y + 2z - 4 = 0, M(1, 2, 3)', () => {
      // Independent formula: |2(1) - 2 + 2(3) - 4| / sqrt(4 + 1 + 4) = |2 - 2 + 6 - 4| / 3 = 2 / 3 ~ 0.66667
      const d = calcDistanceOxyz(2, -1, 2, -4, 1, 2, 3);
      assertNear(d, 2 / 3, 1e-4);
    });

    runner.test('Distance: Oxy plane: z = 0 (0x + 0y + 1z + 0 = 0), M(1, 2, 3)', () => {
      // Independent formula: |0 + 0 + 3 + 0| / sqrt(1) = 3
      const d = calcDistanceOxyz(0, 0, 1, 0, 1, 2, 3);
      assertNear(d, 3.0, 1e-9);
    });

    runner.test('Distance: Degenerate plane (A=0, B=0, C=0) edge case handles division by zero', () => {
      // Denominator is 0. Guard code should return 0 safely without throwing or returning NaN/Infinity
      const d = calcDistanceOxyz(0, 0, 0, -4, 1, 2, 3);
      assertStrictEqual(d, 0, 'Degenerate plane should yield 0 without NaN');
    });

    runner.test('Distance: Large coordinates and negative coefficients', () => {
      // (P): -3x + 4y - 12z + 26 = 0, M(10, 20, 30)
      // Denominator: sqrt((-3)^2 + 4^2 + (-12)^2) = sqrt(9 + 16 + 144) = sqrt(169) = 13
      // Numerator: |-3(10) + 4(20) - 12(30) + 26| = |-30 + 80 - 360 + 26| = |-284| = 284
      // d = 284 / 13 ~ 21.8461538
      const d = calcDistanceOxyz(-3, 4, -12, 26, 10, 20, 30);
      assertNear(d, 284 / 13, 1e-4);
    });

    runner.test('3D Projection: Origin (0,0,0) projects to canvas center regardless of rotation', () => {
      const cx = 320;
      const cy = 240;
      const scale = 38;
      const pt = project3DMath(0, 0, 0, 0.75, 0.45, cx, cy, scale);
      assertNear(pt.x, cx, 1e-9);
      assertNear(pt.y, cy, 1e-9);
    });

    runner.test('3D Projection: Orthogonal rotation preserves Euclidean distance to origin', () => {
      // 3D rotation matrix must be isometric: length(R * v) == length(v)
      const x = 3, y = -4, z = 5;
      const initialNorm = Math.hypot(x, y, z);

      const rotated = project3DMath(x, y, z, 1.2, -0.6, 0, 0, 1);
      const rotatedNorm = Math.hypot(rotated.rotX, rotated.rotY, rotated.rotZ);

      assertNear(rotatedNorm, initialNorm, 1e-6, 'Rotation must preserve Euclidean norm');
    });

    runner.test('3D Projection: Screen coordinate mapping at zero rotation', () => {
      const cx = 300, cy = 200, scale = 40;
      // At yaw = 0, pitch = 0: x2 = x, y2 = y, z2 = z
      // Screen: x = cx + x*scale, y = cy - z*scale
      const pt = project3DMath(2, 3, 4, 0, 0, cx, cy, scale);
      assertNear(pt.x, cx + 2 * scale, 1e-9);
      assertNear(pt.y, cy - 4 * scale, 1e-9);
    });
  });
}
