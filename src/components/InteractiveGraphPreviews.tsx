import React, { useState, useMemo } from 'react';
import {
  FunctionSquare,
  Boxes,
  ArrowUpRight,
  Sparkles,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { formatNumVi } from '../mathEngine';

interface InteractiveGraphPreviewsProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const InteractiveGraphPreviews: React.FC<InteractiveGraphPreviewsProps> = ({
  onNavigateTab
}) => {
  const [activePreview, setActivePreview] = useState<'cubic' | 'oxyz'>('cubic');

  // Full cubic coefficients state for y = ax³ + bx² + cx + d (a ≠ 0)
  const [cubicA, setCubicA] = useState<number>(1);
  const [cubicB, setCubicB] = useState<number>(-3);
  const [cubicC, setCubicC] = useState<number>(0);
  const [cubicD, setCubicD] = useState<number>(2);

  // Common textbook presets
  const presets = [
    { label: 'y = x³ - 3x² + 2', a: 1, b: -3, c: 0, d: 2 },
    { label: 'y = -x³ + 3x', a: -1, b: 0, c: 3, d: 0 },
    { label: 'y = x³ - 3x² + 3x', a: 1, b: -3, c: 3, d: 0 },
    { label: 'y = x³ + 3x + 1', a: 1, b: 0, c: 3, d: 1 },
  ];

  // Mathematical analysis of current coefficients
  const deltaPrime = cubicB * cubicB - 3 * cubicA * cubicC;
  const xInflection = -cubicB / (3 * cubicA);
  const yInflection = cubicA * Math.pow(xInflection, 3) + cubicB * Math.pow(xInflection, 2) + cubicC * xInflection + cubicD;

  let localMax: { x: number; y: number } | null = null;
  let localMin: { x: number; y: number } | null = null;

  if (deltaPrime > 0) {
    const sqrtD = Math.sqrt(deltaPrime);
    const r1 = (-cubicB - sqrtD) / (3 * cubicA);
    const r2 = (-cubicB + sqrtD) / (3 * cubicA);
    const y1 = cubicA * Math.pow(r1, 3) + cubicB * Math.pow(r1, 2) + cubicC * r1 + cubicD;
    const y2 = cubicA * Math.pow(r2, 3) + cubicB * Math.pow(r2, 2) + cubicC * r2 + cubicD;

    if (cubicA > 0) {
      localMax = { x: r1, y: y1 };
      localMin = { x: r2, y: y2 };
    } else {
      localMin = { x: r1, y: y1 };
      localMax = { x: r2, y: y2 };
    }
  }

  // Nicely formatted Vietnamese algebraic representation
  const formattedEquation = useMemo(() => {
    const parts: string[] = [];
    if (cubicA === 1) parts.push('x³');
    else if (cubicA === -1) parts.push('-x³');
    else parts.push(`${cubicA}x³`);

    if (cubicB !== 0) {
      const sign = cubicB > 0 ? '+ ' : '- ';
      const absB = Math.abs(cubicB);
      parts.push(`${sign}${absB === 1 ? '' : absB}x²`);
    }

    if (cubicC !== 0) {
      const sign = cubicC > 0 ? '+ ' : '- ';
      const absC = Math.abs(cubicC);
      parts.push(`${sign}${absC === 1 ? '' : absC}x`);
    }

    if (cubicD !== 0 || parts.length === 0) {
      if (cubicD > 0 && parts.length > 0) parts.push(`+ ${cubicD}`);
      else if (cubicD < 0 && parts.length > 0) parts.push(`- ${Math.abs(cubicD)}`);
      else parts.push(`${cubicD}`);
    }

    return `y = ${parts.join(' ')}`;
  }, [cubicA, cubicB, cubicC, cubicD]);

  const formattedDerivative = useMemo(() => {
    const da = 3 * cubicA;
    const db = 2 * cubicB;
    const dc = cubicC;
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
  }, [cubicA, cubicB, cubicC]);

  // Generate SVG path points dynamically
  const svgPoints = useMemo(() => {
    const originX = 160;
    const originY = 100;
    const scaleX = 26; // pixels per math unit
    const scaleY = 16; // pixels per math unit

    const pts: { x: number; y: number; sx: number; sy: number }[] = [];
    const step = 0.08;
    for (let x = -4.5; x <= 4.5; x += step) {
      const y = cubicA * Math.pow(x, 3) + cubicB * Math.pow(x, 2) + cubicC * x + cubicD;
      const sx = originX + x * scaleX;
      const sy = originY - y * scaleY;
      // Clamp sy to [-30, 230] to keep svg rendering well
      const clampedSy = Math.max(-30, Math.min(230, sy));
      pts.push({ x, y, sx, sy: clampedSy });
    }
    return pts;
  }, [cubicA, cubicB, cubicC, cubicD]);

  const pathD = useMemo(() => {
    if (svgPoints.length === 0) return '';
    return svgPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');
  }, [svgPoints]);

  // Screen coordinates for critical points
  const originX = 160;
  const originY = 100;
  const scaleX = 26;
  const scaleY = 16;

  const infScreenX = originX + xInflection * scaleX;
  const infScreenY = originY - yInflection * scaleY;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Phòng Thí Nghiệm Đồ Thị Trực Quan (Interactive Lab Preview)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mô phỏng đồ thị hàm số và không gian 3 chiều tương tác trực tiếp dành cho học sinh lớp 12.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap p-1 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActivePreview('cubic')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activePreview === 'cubic'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FunctionSquare className="w-3.5 h-3.5" />
            <span>Đồ Thị Hàm Bậc Ba</span>
          </button>

          <button
            onClick={() => setActivePreview('oxyz')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activePreview === 'oxyz'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Không Gian Oxyz 3D</span>
          </button>
        </div>
      </div>

      {/* Preview Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60">
        {/* Left: Graphic display */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs p-3 sm:p-4 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden">
          {activePreview === 'cubic' && (
            <div className="w-full flex flex-col items-center">
              <svg viewBox="0 0 320 200" className="w-full h-52 select-none">
                <defs>
                  <clipPath id="cubic-preview-clip">
                    <rect x="10" y="10" width="300" height="180" rx="8" />
                  </clipPath>
                </defs>

                {/* Grid Lines */}
                <line x1="20" y1="100" x2="300" y2="100" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="160" y1="15" x2="160" y2="185" stroke="#cbd5e1" strokeWidth="1.5" />
                
                {/* Axes tick marks */}
                {[-3, -2, -1, 1, 2, 3].map((tick) => (
                  <g key={`x-tick-${tick}`}>
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

                {/* Dynamic mathematical cubic curve */}
                <g clipPath="url(#cubic-preview-clip)">
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

              {/* Legend bar */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                  <span>Đồ thị hàm số</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
                  <span>Tâm đối xứng I</span>
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
          )}

          {activePreview === 'oxyz' && (
            <div className="w-full flex flex-col items-center">
              <svg viewBox="0 0 320 200" className="w-full h-52">
                {/* 3D Axes */}
                <line x1="160" y1="110" x2="70" y2="170" stroke="#ef4444" strokeWidth="2.5" />
                <line x1="160" y1="110" x2="280" y2="110" stroke="#22c55e" strokeWidth="2.5" />
                <line x1="160" y1="110" x2="160" y2="20" stroke="#3b82f6" strokeWidth="2.5" />

                <text x="60" y="180" fill="#ef4444" fontSize="11" fontWeight="bold">Ox</text>
                <text x="285" y="115" fill="#22c55e" fontSize="11" fontWeight="bold">Oy</text>
                <text x="165" y="25" fill="#3b82f6" fontSize="11" fontWeight="bold">Oz</text>

                {/* Plane (α) */}
                <polygon
                  points="110,70 230,50 210,150 90,170"
                  fill="rgba(99, 102, 241, 0.25)"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                />
                <text x="220" y="65" fill="#4338ca" fontSize="10" fontWeight="bold">(α)</text>

                {/* Normal vector */}
                <line x1="150" y1="110" x2="180" y2="60" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="180" cy="60" r="3" fill="#f59e0b" />
                <text x="185" y="60" fill="#b45309" fontSize="10" fontWeight="bold">n⃗</text>
              </svg>

              <div className="text-[11px] text-slate-500 text-center mt-2">
                Mặt phẳng (α): 2x - y + 2z - 4 = 0 có vectơ pháp tuyến n⃗ = (2; -1; 2)
              </div>
            </div>
          )}
        </div>

        {/* Right: Interactive mini-controls & direct jump */}
        <div className="lg:col-span-5 space-y-3.5 text-xs">
          {activePreview === 'cubic' && (
            <div className="space-y-3">
              {/* Header Title Standardized to Vietnamese Curriculum */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-800 text-sm">
                    Hàm số bậc ba: y = ax³ + bx² + cx + d (a ≠ 0)
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Khảo sát dạng tổng quát đầy đủ các hệ số a, b, c, d với đạo hàm y' = 3ax² + 2bx + c và biệt thức Δ' = b² - 3ac:
                </p>
              </div>

              {/* Equation & Status Card */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 font-mono">
                    {formattedEquation}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      deltaPrime > 0
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : deltaPrime === 0
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {deltaPrime > 0
                      ? 'Có 2 cực trị (Δ\' > 0)'
                      : deltaPrime === 0
                      ? 'Nghiệm kép (Δ\' = 0)'
                      : 'Đơn điệu trên ℝ (Δ\' < 0)'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono pt-1 border-t border-slate-100">
                  <span>{formattedDerivative}</span>
                  <span>Δ' = {deltaPrime}</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                  <span>Mẫu hàm số tiêu biểu:</span>
                  <button
                    onClick={() => {
                      setCubicA(1);
                      setCubicB(-3);
                      setCubicC(0);
                      setCubicD(2);
                    }}
                    className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Mặc định</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {presets.map((p) => {
                    const isSelected =
                      cubicA === p.a && cubicB === p.b && cubicC === p.c && cubicD === p.d;
                    return (
                      <button
                        key={p.label}
                        onClick={() => {
                          setCubicA(p.a);
                          setCubicB(p.b);
                          setCubicC(p.c);
                          setCubicD(p.d);
                        }}
                        className={`px-2 py-1.5 rounded-lg border text-left font-mono text-[10px] transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Sliders for a, b, c, d */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>Điều chỉnh hệ số a, b, c, d:</span>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-1 text-[11px]">
                  {/* Slider a */}
                  <div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>a: <strong className="text-slate-800">{cubicA}</strong></span>
                      <span className="text-[10px] text-slate-400">(a ≠ 0)</span>
                    </div>
                    <input
                      type="range"
                      min={-3}
                      max={3}
                      step={1}
                      value={cubicA}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        // Prevent a = 0
                        if (val === 0) {
                          setCubicA(cubicA > 0 ? -1 : 1);
                        } else {
                          setCubicA(val);
                        }
                      }}
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>

                  {/* Slider b */}
                  <div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>b: <strong className="text-slate-800">{cubicB}</strong></span>
                    </div>
                    <input
                      type="range"
                      min={-4}
                      max={4}
                      step={1}
                      value={cubicB}
                      onChange={(e) => setCubicB(parseInt(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>

                  {/* Slider c */}
                  <div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>c: <strong className="text-slate-800">{cubicC}</strong></span>
                    </div>
                    <input
                      type="range"
                      min={-6}
                      max={6}
                      step={1}
                      value={cubicC}
                      onChange={(e) => setCubicC(parseInt(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>

                  {/* Slider d */}
                  <div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>d: <strong className="text-slate-800">{cubicD}</strong></span>
                    </div>
                    <input
                      type="range"
                      min={-5}
                      max={5}
                      step={1}
                      value={cubicD}
                      onChange={(e) => setCubicD(parseInt(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Main Action Button */}
              <button
                onClick={() => onNavigateTab('cubic-lab')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Mở đầy đủ Cubic Lab A (Đồ thị + Bảng biến thiên)</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activePreview === 'oxyz' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="font-bold text-slate-800 text-sm">Không gian Toạ độ Oxyz 3D</span>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Mô hình 3 chiều tương tác: xoay chuột 360°, mặt phẳng, vectơ pháp tuyến n⃗ và tính khoảng cách từ điểm tới mặt phẳng.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-slate-600">
                (α): 2x - y + 2z - 4 = 0  ⇒  n⃗ = (2; -1; 2)
              </div>

              <button
                onClick={() => onNavigateTab('oxyz')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Mở phòng thí nghiệm Oxyz 3D xoay chuột</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

