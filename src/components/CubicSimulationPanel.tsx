import React, { useMemo } from 'react';
import {
  FunctionSquare,
  Sparkles,
  Sliders,
  RotateCcw,
  Compass,
  Layers
} from 'lucide-react';
import { CubicCoefficients, CubicAnalysis } from '../types';
import { formatNumVi } from '../mathEngine';

interface CubicSimulationPanelProps {
  coefficients: CubicCoefficients;
  onUpdateCoefficients: (newCoeffs: CubicCoefficients) => void;
  analysis: CubicAnalysis;
}

export const CubicSimulationPanel: React.FC<CubicSimulationPanelProps> = ({
  coefficients,
  onUpdateCoefficients,
  analysis
}) => {
  const { a, b, c, d } = coefficients;

  // 4 standard textbook presets requested
  const presets = [
    { label: 'y = x³ - 3x² + 2', a: 1, b: -3, c: 0, d: 2, desc: '2 Cực trị (a > 0)' },
    { label: 'y = -x³ + 3x', a: -1, b: 0, c: 3, d: 0, desc: '2 Cực trị (a < 0)' },
    { label: 'y = x³ - 3x² + 3x', a: 1, b: -3, c: 3, d: 0, desc: 'Nghiệm kép (Δ\' = 0)' },
    { label: 'y = x³ + 3x + 1', a: 1, b: 0, c: 3, d: 1, desc: 'Đơn điệu trên ℝ (Δ\' < 0)' },
  ];

  // Mathematical discriminant and critical points
  const deltaPrime = b * b - 3 * a * c;
  const xInflection = -b / (3 * a);
  const yInflection = a * Math.pow(xInflection, 3) + b * Math.pow(xInflection, 2) + c * xInflection + d;

  let localMax: { x: number; y: number } | null = null;
  let localMin: { x: number; y: number } | null = null;

  if (deltaPrime > 0 && Math.abs(a) > 1e-9) {
    const sqrtD = Math.sqrt(deltaPrime);
    const r1 = (-b - sqrtD) / (3 * a);
    const r2 = (-b + sqrtD) / (3 * a);
    const y1 = a * Math.pow(r1, 3) + b * Math.pow(r1, 2) + c * r1 + d;
    const y2 = a * Math.pow(r2, 3) + b * Math.pow(r2, 2) + c * r2 + d;

    if (a > 0) {
      localMax = { x: r1, y: y1 };
      localMin = { x: r2, y: y2 };
    } else {
      localMin = { x: r1, y: y1 };
      localMax = { x: r2, y: y2 };
    }
  }

  // Format polynomial formula in clean Vietnamese textbook notation
  const formattedEquation = useMemo(() => {
    const parts: string[] = [];
    if (a === 1) parts.push('x³');
    else if (a === -1) parts.push('-x³');
    else parts.push(`${a}x³`);

    if (b !== 0) {
      const sign = b > 0 ? '+ ' : '- ';
      const absB = Math.abs(b);
      parts.push(`${sign}${absB === 1 ? '' : absB}x²`);
    }

    if (c !== 0) {
      const sign = c > 0 ? '+ ' : '- ';
      const absC = Math.abs(c);
      parts.push(`${sign}${absC === 1 ? '' : absC}x`);
    }

    if (d !== 0 || parts.length === 0) {
      if (d > 0 && parts.length > 0) parts.push(`+ ${d}`);
      else if (d < 0 && parts.length > 0) parts.push(`- ${Math.abs(d)}`);
      else parts.push(`${d}`);
    }

    return `y = ${parts.join(' ')}`;
  }, [a, b, c, d]);

  // Format derivative formula
  const formattedDerivative = useMemo(() => {
    const da = 3 * a;
    const db = 2 * b;
    const dc = c;
    const parts: string[] = [];

    if (da === 1) parts.push('x²');
    else if (da === -1) parts.push('-x²');
    else parts.push(`${da}x²`);

    if (db !== 0) {
      const sign = db > 0 ? '+ ' : '- ';
      const absDb = Math.abs(db);
      parts.push(`${sign}${absDb === 1 ? '' : absDb}x`);
    }

    if (dc !== 0 || parts.length === 0) {
      if (dc > 0 && parts.length > 0) parts.push(`+ ${dc}`);
      else if (dc < 0 && parts.length > 0) parts.push(`- ${Math.abs(dc)}`);
      else parts.push(`${dc}`);
    }

    return `y' = ${parts.join(' ')}`;
  }, [a, b, c]);

  // Dynamic SVG path calculation
  const originX = 160;
  const originY = 100;
  const scaleX = 26; // pixels per math unit
  const scaleY = 16; // pixels per math unit

  const pathD = useMemo(() => {
    const pts: string[] = [];
    const step = 0.08;
    let started = false;

    for (let xVal = -4.5; xVal <= 4.5; xVal += step) {
      const yVal = a * Math.pow(xVal, 3) + b * Math.pow(xVal, 2) + c * xVal + d;
      const sx = originX + xVal * scaleX;
      const sy = originY - yVal * scaleY;
      const clampedSy = Math.max(-30, Math.min(230, sy));

      if (!started) {
        pts.push(`M ${sx.toFixed(1)},${clampedSy.toFixed(1)}`);
        started = true;
      } else {
        pts.push(`L ${sx.toFixed(1)},${clampedSy.toFixed(1)}`);
      }
    }
    return pts.join(' ');
  }, [a, b, c, d]);

  const infScreenX = originX + xInflection * scaleX;
  const infScreenY = originY - yInflection * scaleY;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-5">
      {/* 1. Header with Standardized Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Hàm số bậc ba: y = ax³ + bx² + cx + d (a ≠ 0)
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Mô phỏng trực quan chuẩn Toán 12
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Bảng điều khiển mô phỏng trực quan: điều chỉnh 4 hệ số, chọn mẫu hàm số tiêu biểu và quan sát đồ thị SVG động.
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
              deltaPrime > 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : deltaPrime === 0
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>
              {deltaPrime > 0
                ? 'Có 2 cực trị (Δ\' > 0)'
                : deltaPrime === 0
                ? 'Nghiệm kép (Δ\' = 0)'
                : 'Đơn điệu trên ℝ (Δ\' < 0)'}
            </span>
          </span>
        </div>
      </div>

      {/* 2. Main Content Grid: SVG Graph on Left, Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70">
        {/* Left: Dynamic SVG Graph */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs p-3 sm:p-4 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden">
          <svg viewBox="0 0 320 200" className="w-full h-56 select-none">
            <defs>
              <clipPath id="cubic-sim-clip">
                <rect x="10" y="10" width="300" height="180" rx="8" />
              </clipPath>
            </defs>

            {/* Coordinate Grid Lines */}
            <line x1="20" y1="100" x2="300" y2="100" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="160" y1="15" x2="160" y2="185" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Axes tick marks */}
            {[-3, -2, -1, 1, 2, 3].map((tick) => (
              <g key={`sim-tick-${tick}`}>
                <line
                  x1={160 + tick * 26}
                  y1={97}
                  x2={160 + tick * 26}
                  y2={103}
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                <text
                  x={160 + tick * 26}
                  y={113}
                  fill="#94a3b8"
                  fontSize="8"
                  textAnchor="middle"
                >
                  {tick}
                </text>
              </g>
            ))}

            <text x="296" y="95" fill="#64748b" fontSize="10" fontWeight="bold">x</text>
            <text x="165" y="24" fill="#64748b" fontSize="10" fontWeight="bold">y</text>
            <text x="148" y="112" fill="#64748b" fontSize="9" fontWeight="medium">O</text>

            {/* Dynamic Mathematical Cubic Curve */}
            <g clipPath="url(#cubic-sim-clip)">
              <path
                d={pathD}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Symmetry Center / Inflection Point I */}
              {infScreenX >= 15 && infScreenX <= 305 && infScreenY >= 15 && infScreenY <= 185 && (
                <g>
                  <circle cx={infScreenX} cy={infScreenY} r="4.5" fill="#9333ea" stroke="#ffffff" strokeWidth="1.5" />
                  <text
                    x={infScreenX + 7}
                    y={infScreenY - 4}
                    fill="#7e22ce"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    I({formatNumVi(xInflection, 1)}; {formatNumVi(yInflection, 1)})
                  </text>
                </g>
              )}

              {/* Extrema Points if Δ' > 0 */}
              {localMax && (() => {
                const sx = originX + localMax.x * scaleX;
                const sy = originY - localMax.y * scaleY;
                if (sx < 15 || sx > 305 || sy < 15 || sy > 185) return null;
                return (
                  <g>
                    <circle cx={sx} cy={sy} r="4.5" fill="#16a34a" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={sx - 8} y={sy - 7} fill="#15803d" fontSize="9" fontWeight="bold">
                      CĐ
                    </text>
                  </g>
                );
              })()}

              {localMin && (() => {
                const sx = originX + localMin.x * scaleX;
                const sy = originY - localMin.y * scaleY;
                if (sx < 15 || sx > 305 || sy < 15 || sy > 185) return null;
                return (
                  <g>
                    <circle cx={sx} cy={sy} r="4.5" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={sx + 6} y={sy + 12} fill="#c2410c" fontSize="9" fontWeight="bold">
                      CT
                    </text>
                  </g>
                );
              })()}
            </g>
          </svg>

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              <span>Đồ thị hàm số</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
              <span>Tâm đối xứng I({formatNumVi(xInflection, 1)}; {formatNumVi(yInflection, 1)})</span>
            </span>
            {deltaPrime > 0 && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                  <span>Cực đại (CĐ)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                  <span>Cực tiểu (CT)</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Controls, 4 Sliders & 4 Presets */}
        <div className="lg:col-span-5 space-y-3.5 text-xs">
          {/* Active Equation and Derivative Card */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-blue-700 font-mono">
                {formattedEquation}
              </span>
              <span className="text-[11px] font-mono font-semibold text-slate-500">
                Δ' = {deltaPrime}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono pt-1.5 border-t border-slate-100">
              <span>Đạo hàm: {formattedDerivative}</span>
              <span>I({formatNumVi(xInflection, 1)}; {formatNumVi(yInflection, 1)})</span>
            </div>
          </div>

          {/* Quick Selection Buttons for 4 Textbook Presets */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
              <span>4 Mẫu hàm số tiêu biểu:</span>
              <button
                onClick={() => onUpdateCoefficients({ a: 1, b: -3, c: 0, d: 2 })}
                className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Mặc định</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {presets.map((p) => {
                const isSelected = a === p.a && b === p.b && c === p.c && d === p.d;
                return (
                  <button
                    key={p.label}
                    onClick={() => onUpdateCoefficients({ a: p.a, b: p.b, c: p.c, d: p.d })}
                    className={`px-2.5 py-1.5 rounded-lg border text-left font-mono text-[10px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title={p.desc}
                  >
                    <div>{p.label}</div>
                    <div className="text-[9px] text-slate-400 font-sans truncate">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4 Interactive Sliders for a, b, c, d */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Thanh trượt điều chỉnh đầy đủ 4 hệ số:</span>
            </div>

            <div className="grid grid-cols-2 gap-x-3.5 gap-y-2 text-[11px]">
              {/* Slider a */}
              <div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>a: <strong className="text-slate-800">{a}</strong></span>
                  <span className="text-[10px] text-slate-400 font-mono">(a ≠ 0)</span>
                </div>
                <input
                  type="range"
                  min={-3}
                  max={3}
                  step={1}
                  value={a}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    const newA = val === 0 ? (a > 0 ? -1 : 1) : val;
                    onUpdateCoefficients({ ...coefficients, a: newA });
                  }}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg mt-1"
                />
              </div>

              {/* Slider b */}
              <div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>b: <strong className="text-slate-800">{b}</strong></span>
                </div>
                <input
                  type="range"
                  min={-4}
                  max={4}
                  step={1}
                  value={b}
                  onChange={(e) => onUpdateCoefficients({ ...coefficients, b: parseInt(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg mt-1"
                />
              </div>

              {/* Slider c */}
              <div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>c: <strong className="text-slate-800">{c}</strong></span>
                </div>
                <input
                  type="range"
                  min={-6}
                  max={6}
                  step={1}
                  value={c}
                  onChange={(e) => onUpdateCoefficients({ ...coefficients, c: parseInt(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg mt-1"
                />
              </div>

              {/* Slider d */}
              <div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>d: <strong className="text-slate-800">{d}</strong></span>
                </div>
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={1}
                  value={d}
                  onChange={(e) => onUpdateCoefficients({ ...coefficients, d: parseInt(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
