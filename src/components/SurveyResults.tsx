import React from 'react';
import { CubicAnalysis } from '../types';
import { MathView } from './MathView';
import { formatNumVi, formatPointVi } from '../mathEngine';
import {
  BookOpen,
  Activity,
  TrendingUp,
  Award,
  Infinity as InfinityIcon,
  Compass,
  Crosshair,
  CheckCircle2
} from 'lucide-react';

interface SurveyResultsProps {
  analysis: CubicAnalysis;
}

export const SurveyResults: React.FC<SurveyResultsProps> = ({ analysis }) => {
  if (!analysis.isValid) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500 shadow-xs">
        Chưa có kết quả khảo sát do hệ số chưa hợp lệ.
      </div>
    );
  }

  const {
    coefficients: { a, b, c, d },
    functionFormulaLatex,
    derivativeFormulaLatex,
    deltaPrime,
    deltaPrimeLatex,
    extremaCase,
    derivativeRoots,
    hasExtrema,
    localMax,
    localMin,
    intervals,
    limitPosInf,
    limitNegInf,
    yIntercept,
    xIntercepts,
    inflectionPoint
  } = analysis;

  return (
    <div id="survey-results-card" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-800">2. Kết quả khảo sát toàn diện</h2>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
          {hasExtrema ? '2 Cực trị' : extremaCase === 'single_root' ? 'Nghiệm kép (Δ\' = 0)' : 'Đơn điệu trên R'}
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Function header banner */}
        <div className="p-3 bg-slate-900 text-white rounded-lg flex flex-wrap items-center justify-between gap-2 shadow-xs">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Hàm số đang xét</div>
            <div className="text-base sm:text-lg font-serif mt-0.5">
              <MathView math={functionFormulaLatex} />
            </div>
          </div>
          <div className="text-xs text-slate-300 font-mono bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
            Hệ số: a = {formatNumVi(a)}, b = {formatNumVi(b)}, c = {formatNumVi(c)}, d = {formatNumVi(d)}
          </div>
        </div>

        {/* 8 core items organized in a clean 2-column or list grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 1. Tập xác định */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Tập xác định</h3>
            </div>
            <p className="text-sm font-serif text-slate-900 ml-7">
              <MathView math="D = \mathbb{R}" />
            </p>
            <p className="text-xs text-slate-500 ml-7 mt-0.5">Hàm số đa thức xác định với mọi x thuộc R.</p>
          </div>

          {/* 2. Đạo hàm */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Đạo hàm bậc nhất</h3>
            </div>
            <div className="text-sm font-serif text-slate-900 ml-7">
              <MathView math={derivativeFormulaLatex} />
            </div>
            <p className="text-xs text-slate-500 ml-7 mt-0.5">
              Đạo hàm là tam thức bậc hai với hệ số bậc cao nhất là 3a = {formatNumVi(3 * a)}.
            </p>
          </div>

          {/* 3. Giải y' = 0 & Biệt thức Delta' */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Phương trình y' = 0 & Biệt thức Δ'</h3>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold ${
                deltaPrime > 0 ? 'bg-emerald-100 text-emerald-800' : deltaPrime === 0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
              }`}>
                Δ' = {formatNumVi(deltaPrime)} ({deltaPrime > 0 ? '> 0' : deltaPrime === 0 ? '= 0' : '< 0'})
              </span>
            </div>

            <div className="ml-7 space-y-1 text-xs text-slate-700">
              <div className="text-sm font-serif text-slate-900">
                <MathView math={deltaPrimeLatex} />
              </div>
              <div className="mt-1 text-slate-600">
                {extremaCase === 'two_extrema' && (
                  <p className="font-medium text-emerald-700">
                    Vì Δ' &gt; 0 nên phương trình y' = 0 có hai nghiệm phân biệt: x₁ = {formatNumVi(derivativeRoots[0])} và x₂ = {formatNumVi(derivativeRoots[1])}. Hàm số có hai điểm cực trị.
                  </p>
                )}
                {extremaCase === 'single_root' && (
                  <p className="font-medium text-amber-700">
                    Vì Δ' = 0 nên phương trình y' = 0 có nghiệm kép x₀ = {formatNumVi(derivativeRoots[0])}. Đạo hàm không đổi dấu, hàm số không có hai cực trị phân biệt.
                  </p>
                )}
                {extremaCase === 'no_extrema' && (
                  <p className="font-medium text-slate-700">
                    Vì Δ' &lt; 0 nên phương trình y' = 0 vô nghiệm. Đạo hàm cùng dấu với 3a trên toàn R. Hàm số đơn điệu trên R.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 4. Khoảng đồng biến, nghịch biến */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">4</div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Khoảng đồng biến & nghịch biến</h3>
            </div>
            <div className="ml-7 text-xs text-slate-700 space-y-1">
              {intervals.map((it, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${it.type === 'dong_bien' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  <span className="font-semibold text-slate-800">
                    {it.type === 'dong_bien' ? 'Đồng biến trên:' : 'Nghịch biến trên:'}
                  </span>
                  <span className="font-serif">
                    <MathView math={`(${it.from};\\, ${it.to})`} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Cực đại, cực tiểu */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">5</div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Cực đại & Cực tiểu</h3>
            </div>
            <div className="ml-7 text-xs text-slate-700">
              {hasExtrema && localMax && localMin ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                    <span className="font-semibold text-slate-900">Điểm cực đại:</span>
                    <span className="font-mono bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                      CĐ{formatPointVi(localMax.x, localMax.y)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                    <span className="font-semibold text-slate-900">Điểm cực tiểu:</span>
                    <span className="font-mono bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-200">
                      CT{formatPointVi(localMin.x, localMin.y)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-600 italic">
                  Hàm số không có hai cực trị phân biệt (không có điểm cực trị) vì phương trình y' = 0 {extremaCase === 'single_root' ? 'có nghiệm kép' : 'vô nghiệm'}.
                </p>
              )}
            </div>
          </div>

          {/* 6. Giới hạn tại vô cực */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">6</div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Giới hạn tại vô cực</h3>
            </div>
            <div className="ml-7 text-xs text-slate-800 space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-serif"><MathView math={`\\lim_{x \\to +\\infty} y = ${limitPosInf}`} /></span>
                <span className="text-slate-300">|</span>
                <span className="font-serif"><MathView math={`\\lim_{x \\to -\\infty} y = ${limitNegInf}`} /></span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                (Dựa trên dấu của hệ số a = {formatNumVi(a)}: do a {a > 0 ? '> 0' : '< 0'} nên lim khi x tiến tới +∞ cùng dấu với a).
              </p>
            </div>
          </div>

          {/* 7. Giao điểm với các trục */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">7</div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Giao điểm với các trục</h3>
            </div>
            <div className="ml-7 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900">Với Oy (x = 0):</span>
                <span className="font-mono bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                  A(0; {formatNumVi(d)})
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Với Ox (y = 0): </span>
                <span className="text-slate-600">
                  {xIntercepts.length === 1 ? '1 nghiệm thực:' : xIntercepts.length === 2 ? '2 nghiệm thực:' : '3 nghiệm thực phân biệt:'}
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {xIntercepts.map((r, idx) => (
                    <span key={idx} className="font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200 text-xs">
                      M{idx + 1}({formatNumVi(r.root)}; 0) {r.multiplicity > 1 && `[bội ${r.multiplicity}]`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 8. Tâm đối xứng của đồ thị */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors md:col-span-2">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">8</div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Tâm đối xứng của đồ thị (Điểm uốn I)</h3>
            </div>
            <div className="ml-7 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
              <div>
                <p className="text-sm font-serif text-slate-900">
                  <MathView math={`I\\left(-\\frac{b}{3a};\\, f\\left(-\\frac{b}{3a}\\right)\\right) = I\\left(${formatNumVi(inflectionPoint.x)};\\, ${formatNumVi(inflectionPoint.y)}\\right)`} />
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Hoành độ điểm uốn là nghiệm của đạo hàm cấp hai: y'' = 6ax + 2b = 0 ⇔ x = -b/(3a). Đồ thị hàm bậc ba luôn nhận I làm tâm đối xứng.
                </p>
              </div>
              <span className="font-mono bg-amber-50 text-amber-800 px-2.5 py-1 rounded border border-amber-200 font-semibold text-xs">
                Tâm đối xứng: {formatPointVi(inflectionPoint.x, inflectionPoint.y)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
