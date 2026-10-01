import React from 'react';
import { CubicAnalysis } from '../types';
import { MathView } from './MathView';
import { formatNumVi } from '../mathEngine';

interface VariationTableProps {
  analysis: CubicAnalysis;
}

export const VariationTable: React.FC<VariationTableProps> = ({ analysis }) => {
  if (!analysis.isValid) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 text-sm">
        Vui lòng nhập hệ số hợp lệ (a ≠ 0) để hiển thị Bảng biến thiên.
      </div>
    );
  }

  const { a } = analysis.coefficients;
  const { extremaCase, derivativeRoots, localMax, localMin, limitPosInf, limitNegInf, inflectionPoint } = analysis;

  return (
    <div id="variation-table-card" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <h3 className="text-sm font-semibold text-slate-800">Bảng biến thiên</h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">Theo chuẩn SGK Toán 12</span>
      </div>

      <div className="p-4 overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Table Container */}
          <div className="border border-slate-300 rounded-lg overflow-hidden bg-white text-sm">
            {/* ROW 1: x */}
            <div className="grid grid-cols-12 border-b border-slate-300 font-serif">
              <div className="col-span-2 sm:col-span-2 px-3 py-2.5 bg-slate-50 border-r border-slate-300 font-bold text-slate-700 flex items-center justify-center italic text-base">
                x
              </div>
              <div className="col-span-10 sm:col-span-10 px-4 py-2.5 flex items-center justify-between text-slate-800">
                <span className="font-serif italic font-medium"><MathView math="-\infty" /></span>

                {extremaCase === 'two_extrema' && (
                  <>
                    <span className="font-semibold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {formatNumVi(derivativeRoots[0])}
                    </span>
                    <span className="font-semibold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {formatNumVi(derivativeRoots[1])}
                    </span>
                  </>
                )}

                {extremaCase === 'single_root' && (
                  <span className="font-semibold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {formatNumVi(derivativeRoots[0])}
                  </span>
                )}

                <span className="font-serif italic font-medium"><MathView math="+\infty" /></span>
              </div>
            </div>

            {/* ROW 2: y' */}
            <div className="grid grid-cols-12 border-b border-slate-300">
              <div className="col-span-2 sm:col-span-2 px-3 py-2 bg-slate-50 border-r border-slate-300 font-bold text-slate-700 flex items-center justify-center italic text-base font-serif">
                y'
              </div>
              <div className="col-span-10 sm:col-span-10 px-6 py-2 flex items-center justify-between font-mono font-bold text-base">
                {extremaCase === 'two_extrema' && (
                  <>
                    <span className={`w-8 text-center ${a > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {a > 0 ? '+' : '-'}
                    </span>
                    <span className="w-8 text-center text-slate-500 font-medium">0</span>
                    <span className={`w-8 text-center ${a > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {a > 0 ? '-' : '+'}
                    </span>
                    <span className="w-8 text-center text-slate-500 font-medium">0</span>
                    <span className={`w-8 text-center ${a > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {a > 0 ? '+' : '-'}
                    </span>
                  </>
                )}

                {extremaCase === 'single_root' && (
                  <>
                    <span className={`w-8 text-center ${a > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {a > 0 ? '+' : '-'}
                    </span>
                    <span className="w-8 text-center text-slate-500 font-medium">0</span>
                    <span className={`w-8 text-center ${a > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {a > 0 ? '+' : '-'}
                    </span>
                  </>
                )}

                {extremaCase === 'no_extrema' && (
                  <div className="w-full flex justify-center">
                    <span className={`text-lg ${a > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {a > 0 ? '+' : '-'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ROW 3: y (Chiều biến thiên & Giới hạn) */}
            <div className="grid grid-cols-12 min-h-[140px]">
              <div className="col-span-2 sm:col-span-2 px-3 py-3 bg-slate-50 border-r border-slate-300 font-bold text-slate-700 flex items-center justify-center italic text-base font-serif">
                y
              </div>
              <div className="col-span-10 sm:col-span-10 p-3 flex flex-col justify-between relative">
                {/* CASE 1: Two Extrema & a > 0 */}
                {extremaCase === 'two_extrema' && a > 0 && (
                  <div className="w-full h-28 relative flex items-center justify-between px-2">
                    {/* -Infinity bottom left */}
                    <div className="absolute left-2 bottom-1 font-serif text-slate-600 text-xs">
                      <MathView math="-\infty" />
                    </div>

                    {/* Arrow 1: up */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 100" preserveAspectRatio="none">
                      <defs>
                        <marker id="arrowUp1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0 0, 6 3, 0 6" fill="#059669" />
                        </marker>
                        <marker id="arrowDown" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0 0, 6 3, 0 6" fill="#e11d48" />
                        </marker>
                        <marker id="arrowUp2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0 0, 6 3, 0 6" fill="#059669" />
                        </marker>
                      </defs>
                      <path d="M 15 80 L 125 20" stroke="#059669" strokeWidth="2" fill="none" markerEnd="url(#arrowUp1)" />
                      <path d="M 145 25 L 255 80" stroke="#e11d48" strokeWidth="2" fill="none" markerEnd="url(#arrowDown)" />
                      <path d="M 275 80 L 385 20" stroke="#059669" strokeWidth="2" fill="none" markerEnd="url(#arrowUp2)" />
                    </svg>

                    {/* Local Maximum Top */}
                    <div className="absolute left-[33%] top-1 -translate-x-1/2 flex flex-col items-center">
                      <span className="text-[11px] font-semibold text-red-600 uppercase tracking-tight">Cực đại</span>
                      <span className="font-bold text-slate-900 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-xs">
                        {formatNumVi(localMax?.y ?? 0)}
                      </span>
                    </div>

                    {/* Local Minimum Bottom */}
                    <div className="absolute left-[66%] bottom-1 -translate-x-1/2 flex flex-col items-center">
                      <span className="font-bold text-slate-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-xs">
                        {formatNumVi(localMin?.y ?? 0)}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-tight">Cực tiểu</span>
                    </div>

                    {/* +Infinity top right */}
                    <div className="absolute right-2 top-1 font-serif text-slate-600 text-xs">
                      <MathView math="+\infty" />
                    </div>
                  </div>
                )}

                {/* CASE 2: Two Extrema & a < 0 */}
                {extremaCase === 'two_extrema' && a < 0 && (
                  <div className="w-full h-28 relative flex items-center justify-between px-2">
                    {/* +Infinity top left */}
                    <div className="absolute left-2 top-1 font-serif text-slate-600 text-xs">
                      <MathView math="+\infty" />
                    </div>

                    {/* Arrows */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 100" preserveAspectRatio="none">
                      <defs>
                        <marker id="arrowDown1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0 0, 6 3, 0 6" fill="#e11d48" />
                        </marker>
                        <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0 0, 6 3, 0 6" fill="#059669" />
                        </marker>
                        <marker id="arrowDown2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0 0, 6 3, 0 6" fill="#e11d48" />
                        </marker>
                      </defs>
                      <path d="M 15 20 L 125 80" stroke="#e11d48" strokeWidth="2" fill="none" markerEnd="url(#arrowDown1)" />
                      <path d="M 145 80 L 255 25" stroke="#059669" strokeWidth="2" fill="none" markerEnd="url(#arrowUp)" />
                      <path d="M 275 25 L 385 80" stroke="#e11d48" strokeWidth="2" fill="none" markerEnd="url(#arrowDown2)" />
                    </svg>

                    {/* Local Minimum Bottom */}
                    <div className="absolute left-[33%] bottom-1 -translate-x-1/2 flex flex-col items-center">
                      <span className="font-bold text-slate-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-xs">
                        {formatNumVi(localMin?.y ?? 0)}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-tight">Cực tiểu</span>
                    </div>

                    {/* Local Maximum Top */}
                    <div className="absolute left-[66%] top-1 -translate-x-1/2 flex flex-col items-center">
                      <span className="text-[11px] font-semibold text-red-600 uppercase tracking-tight">Cực đại</span>
                      <span className="font-bold text-slate-900 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-xs">
                        {formatNumVi(localMax?.y ?? 0)}
                      </span>
                    </div>

                    {/* -Infinity bottom right */}
                    <div className="absolute right-2 bottom-1 font-serif text-slate-600 text-xs">
                      <MathView math="-\infty" />
                    </div>
                  </div>
                )}

                {/* CASE 3: Single root / Double root (Delta' = 0) */}
                {extremaCase === 'single_root' && (
                  <div className="w-full h-28 relative flex items-center justify-between px-3">
                    <div className={`absolute left-3 ${a > 0 ? 'bottom-2' : 'top-2'} font-serif text-slate-600 text-xs`}>
                      <MathView math={a > 0 ? '-\\infty' : '+\\infty'} />
                    </div>

                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 100" preserveAspectRatio="none">
                      <defs>
                        <marker id="monoArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0 0, 6 3, 0 6" fill={a > 0 ? '#059669' : '#e11d48'} />
                        </marker>
                      </defs>
                      <path
                        d={a > 0 ? 'M 20 85 L 380 15' : 'M 20 15 L 380 85'}
                        stroke={a > 0 ? '#059669' : '#e11d48'}
                        strokeWidth="2.5"
                        fill="none"
                        markerEnd="url(#monoArrow)"
                      />
                    </svg>

                    {/* Inflection point label at center */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 px-2 py-1 rounded border border-amber-300 shadow-xs flex flex-col items-center">
                      <span className="text-[10px] text-amber-600 font-semibold uppercase">Điểm uốn</span>
                      <span className="text-xs font-bold text-slate-800">{formatNumVi(inflectionPoint.y)}</span>
                    </div>

                    <div className={`absolute right-3 ${a > 0 ? 'top-2' : 'bottom-2'} font-serif text-slate-600 text-xs`}>
                      <MathView math={a > 0 ? '+\\infty' : '-\\infty'} />
                    </div>
                  </div>
                )}

                {/* CASE 4: No extrema (Delta' < 0) */}
                {extremaCase === 'no_extrema' && (
                  <div className="w-full h-28 relative flex items-center justify-between px-3">
                    <div className={`absolute left-3 ${a > 0 ? 'bottom-2' : 'top-2'} font-serif text-slate-600 text-xs`}>
                      <MathView math={a > 0 ? '-\\infty' : '+\\infty'} />
                    </div>

                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 100" preserveAspectRatio="none">
                      <defs>
                        <marker id="noExtremaArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                          <polygon points="0 0, 6 3, 0 6" fill={a > 0 ? '#059669' : '#e11d48'} />
                        </marker>
                      </defs>
                      <path
                        d={a > 0 ? 'M 20 85 L 380 15' : 'M 20 15 L 380 85'}
                        stroke={a > 0 ? '#059669' : '#e11d48'}
                        strokeWidth="2.5"
                        fill="none"
                        markerEnd="url(#noExtremaArrow)"
                      />
                    </svg>

                    {/* Tag showing always increasing or decreasing */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 px-3 py-1 rounded-full border border-slate-300 shadow-xs">
                      <span className={`text-xs font-semibold ${a > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {a > 0 ? 'Đồng biến trên R' : 'Nghịch biến trên R'}
                      </span>
                    </div>

                    <div className={`absolute right-3 ${a > 0 ? 'top-2' : 'bottom-2'} font-serif text-slate-600 text-xs`}>
                      <MathView math={a > 0 ? '+\\infty' : '-\\infty'} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
