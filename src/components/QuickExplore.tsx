import React from 'react';
import { CubicCoefficients, ExtremaCase } from '../types';
import { Compass, ArrowUpRight, ArrowDownRight, Layers, Check } from 'lucide-react';
import { MathView } from './MathView';

interface QuickExploreProps {
  currentCoeffs: CubicCoefficients;
  currentCase: ExtremaCase;
  onSelectPreset: (coeffs: CubicCoefficients) => void;
}

export const QuickExplore: React.FC<QuickExploreProps> = ({
  currentCoeffs,
  currentCase,
  onSelectPreset
}) => {
  const exploreOptions = [
    {
      id: 'A',
      title: 'A. Hàm số có hai cực trị',
      deltaCondition: '\\Delta\' = b^2 - 3ac > 0',
      description: 'Phương trình y\' = 0 có hai nghiệm phân biệt. Đồ thị có 1 điểm cực đại và 1 điểm cực tiểu (dạng chữ N hoặc N ngược).',
      variants: [
        {
          label: 'Trường hợp a > 0',
          coeffs: { a: 1, b: -3, c: 0, d: 2 },
          formula: 'y = x^3 - 3x^2 + 2',
          icon: <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
        },
        {
          label: 'Trường hợp a < 0',
          coeffs: { a: -1, b: 0, c: 3, d: -1 },
          formula: 'y = -x^3 + 3x - 1',
          icon: <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
        }
      ]
    },
    {
      id: 'B',
      title: 'B. Không có hai cực trị phân biệt',
      deltaCondition: '\\Delta\' = b^2 - 3ac = 0',
      description: 'Phương trình y\' = 0 có nghiệm kép. Đạo hàm không đổi dấu qua nghiệm kép. Đồ thị có điểm uốn với tiếp tuyến nằm ngang.',
      variants: [
        {
          label: 'Trường hợp a > 0',
          coeffs: { a: 1, b: -3, c: 3, d: -1 },
          formula: 'y = x^3 - 3x^2 + 3x - 1',
          icon: <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
        },
        {
          label: 'Trường hợp a < 0',
          coeffs: { a: -1, b: 3, c: -3, d: 2 },
          formula: 'y = -x^3 + 3x^2 - 3x + 2',
          icon: <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
        }
      ]
    },
    {
      id: 'C',
      title: 'C. Hàm số đơn điệu trên R',
      deltaCondition: '\\Delta\' = b^2 - 3ac < 0',
      description: 'Phương trình y\' = 0 vô nghiệm. Đạo hàm giữ nguyên một dấu trên R. Đồ thị luôn đồng biến hoặc luôn nghịch biến.',
      variants: [
        {
          label: 'Đồng biến (a > 0)',
          coeffs: { a: 1, b: 0, c: 3, d: 1 },
          formula: 'y = x^3 + 3x + 1',
          icon: <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
        },
        {
          label: 'Nghịch biến (a < 0)',
          coeffs: { a: -1, b: 0, c: -2, d: 3 },
          formula: 'y = -x^3 - 2x + 3',
          icon: <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
        }
      ]
    }
  ];

  const isMatching = (coeffs: CubicCoefficients) => {
    return (
      currentCoeffs.a === coeffs.a &&
      currentCoeffs.b === coeffs.b &&
      currentCoeffs.c === coeffs.c &&
      currentCoeffs.d === coeffs.d
    );
  };

  return (
    <div id="quick-explore-card" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-slate-800">4. Khám phá nhanh (3 Dạng Hình Học Cốt Lõi)</h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">So sánh trực quan 3 trường hợp</span>
      </div>

      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {exploreOptions.map(opt => {
          const isCaseActive =
            (opt.id === 'A' && currentCase === 'two_extrema') ||
            (opt.id === 'B' && currentCase === 'single_root') ||
            (opt.id === 'C' && currentCase === 'no_extrema');

          return (
            <div
              key={opt.id}
              className={`rounded-lg border p-3.5 flex flex-col justify-between transition-all ${
                isCaseActive
                  ? 'border-indigo-400 bg-indigo-50/30 shadow-xs ring-1 ring-indigo-300'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <h3 className="text-sm font-bold text-slate-900">{opt.title}</h3>
                  {isCaseActive && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700">
                      <Check className="w-3 h-3" /> Đang xem
                    </span>
                  )}
                </div>

                <div className="text-xs text-indigo-900 bg-indigo-50/60 rounded px-2 py-1 mb-2 font-mono border border-indigo-100/80">
                  <MathView math={opt.deltaCondition} />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {opt.description}
                </p>
              </div>

              {/* Variant buttons */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                {opt.variants.map((v, vIdx) => {
                  const active = isMatching(v.coeffs);
                  return (
                    <button
                      key={vIdx}
                      type="button"
                      onClick={() => onSelectPreset(v.coeffs)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        active
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {v.icon}
                        <span>{v.label}</span>
                      </div>
                      <span className={`text-[11px] font-mono ${active ? 'text-blue-100' : 'text-slate-500'}`}>
                        {v.formula}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
