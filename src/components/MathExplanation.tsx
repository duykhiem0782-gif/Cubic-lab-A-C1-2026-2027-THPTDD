import React, { useState } from 'react';
import { CubicAnalysis } from '../types';
import { MathView } from './MathView';
import { formatNumVi } from '../mathEngine';
import { GraduationCap, HelpCircle, CheckCircle, ChevronDown, ChevronUp, BookOpenCheck } from 'lucide-react';

interface MathExplanationProps {
  analysis: CubicAnalysis;
}

export const MathExplanation: React.FC<MathExplanationProps> = ({ analysis }) => {
  const [openCard, setOpenCard] = useState<number | null>(null);

  if (!analysis.isValid) return null;

  const { a, b, c, d } = analysis.coefficients;
  const { deltaPrime, extremaCase, derivativeRoots, limitPosInf, limitNegInf, inflectionPoint } = analysis;

  const toggleCard = (idx: number) => {
    setOpenCard(openCard === idx ? null : idx);
  };

  const explanations = [
    {
      id: 1,
      title: '1. Tại sao hàm số có (hoặc không có) cực trị?',
      badge: extremaCase === 'two_extrema' ? '2 Cực trị (Δ\' > 0)' : extremaCase === 'single_root' ? 'Nghiệm kép (Δ\' = 0)' : 'Vô nghiệm (Δ\' < 0)',
      color: extremaCase === 'two_extrema' ? 'emerald' : extremaCase === 'single_root' ? 'amber' : 'rose',
      content: (
        <div className="space-y-2 text-slate-700 text-xs sm:text-sm">
          <p>
            Đạo hàm bậc nhất của hàm số bậc ba là một tam thức bậc hai:
          </p>
          <div className="bg-slate-100 p-2 rounded font-serif text-center">
            <MathView math={`y' = 3ax^2 + 2bx + c, \\quad \\Delta' = b^2 - 3ac = (${formatNumVi(b)})^2 - 3(${formatNumVi(a)})(${formatNumVi(c)}) = ${formatNumVi(deltaPrime)}`} />
          </div>

          {extremaCase === 'two_extrema' && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-900">
              <p className="font-semibold mb-1">
                Vì Δ' = b² − 3ac &gt; 0 nên phương trình y' = 0 có hai nghiệm phân biệt:
              </p>
              <p className="font-serif">
                <MathView math={`x_1 = \\frac{-b - \\sqrt{\\Delta'}}{3a} = ${formatNumVi(derivativeRoots[0])}, \\quad x_2 = \\frac{-b + \\sqrt{\\Delta'}}{3a} = ${formatNumVi(derivativeRoots[1])}`} />
              </p>
              <p className="mt-1.5 text-xs text-emerald-800">
                Theo định lý về dấu của tam thức bậc hai ("trong trái dấu a, ngoài cùng dấu a"), y' đổi dấu hai lần khi x đi qua x₁ và x₂. Do đó hàm số luôn có hai điểm cực trị phân biệt (một cực đại và một cực tiểu).
              </p>
            </div>
          )}

          {extremaCase === 'single_root' && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900">
              <p className="font-semibold mb-1">
                Vì Δ' = 0 nên phương trình y' = 0 có nghiệm kép:
              </p>
              <p className="font-serif">
                <MathView math={`x_0 = -\\frac{b}{3a} = ${formatNumVi(derivativeRoots[0])}`} />
              </p>
              <p className="mt-1.5 text-xs text-amber-800">
                Phương trình y' = 0 có nghiệm kép. Đạo hàm y' = 3a(x - x₀)² không đổi dấu khi x đi qua nghiệm này (y' cùng dấu với hệ số a với mọi x ≠ x₀). Vì vậy hàm số không có hai cực trị phân biệt (không có điểm cực trị).
              </p>
            </div>
          )}

          {extremaCase === 'no_extrema' && (
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg text-rose-900">
              <p className="font-semibold mb-1">
                Vì Δ' &lt; 0 nên phương trình y' = 0 vô nghiệm trên R:
              </p>
              <p className="mt-1.5 text-xs text-rose-800">
                Do 3a = {formatNumVi(3 * a)} là hệ số của x² trong y', tam thức bậc hai y' luôn mang cùng dấu với hệ số a với mọi x ∈ R. Vì đạo hàm không bao giờ bằng 0 hay đổi dấu, hàm số hoàn toàn đơn điệu trên R và không có điểm cực trị.
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 2,
      title: '2. Cách xác định khoảng đồng biến, nghịch biến',
      badge: 'Định lý dấu đạo hàm',
      color: 'blue',
      content: (
        <div className="space-y-2 text-slate-700 text-xs sm:text-sm">
          <p>
            Theo Định lý dấu của đạo hàm (Toán 12):
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
            <li>Nếu <MathView math="y' > 0" /> trên khoảng K thì hàm số <strong>đồng biến</strong> trên khoảng K.</li>
            <li>Nếu <MathView math="y' < 0" /> trên khoảng K thì hàm số <strong>nghịch biến</strong> trên khoảng K.</li>
          </ul>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed">
            <span className="font-semibold text-slate-900">Với hàm số hiện tại: </span>
            {extremaCase === 'two_extrema' ? (
              a > 0 ? (
                <span>
                  Vì <MathView math="a > 0" />, y' mang dấu dương ở hai khoảng ngoài <MathView math={`(-\\infty;\\, ${formatNumVi(derivativeRoots[0])})`} /> và <MathView math={`(${formatNumVi(derivativeRoots[1])};\\, +\\infty)`} /> (đồng biến), mang dấu âm ở khoảng trong <MathView math={`(${formatNumVi(derivativeRoots[0])};\\, ${formatNumVi(derivativeRoots[1])})`} /> (nghịch biến).
                </span>
              ) : (
                <span>
                  Vì <MathView math="a < 0" />, y' mang dấu âm ở hai khoảng ngoài <MathView math={`(-\\infty;\\, ${formatNumVi(derivativeRoots[0])})`} /> và <MathView math={`(${formatNumVi(derivativeRoots[1])};\\, +\\infty)`} /> (nghịch biến), mang dấu dương ở khoảng trong <MathView math={`(${formatNumVi(derivativeRoots[0])};\\, ${formatNumVi(derivativeRoots[1])})`} /> (đồng biến).
                </span>
              )
            ) : a > 0 ? (
              <span>Hàm số đồng biến trên toàn bộ R vì <MathView math="y' \ge 0 \;\forall x \in \mathbb{R}" /> (dấu bằng chỉ tại hữu hạn điểm).</span>
            ) : (
              <span>Hàm số nghịch biến trên toàn bộ R vì <MathView math="y' \le 0 \;\forall x \in \mathbb{R}" /> (dấu bằng chỉ tại hữu hạn điểm).</span>
            )}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: '3. Vì sao điểm uốn I là tâm đối xứng của đồ thị?',
      badge: 'Tính chất hình học',
      color: 'amber',
      content: (
        <div className="space-y-2 text-slate-700 text-xs sm:text-sm">
          <p>
            Điểm uốn I của đồ thị hàm số bậc ba là nghiệm của phương trình đạo hàm cấp hai:
          </p>
          <div className="bg-slate-100 p-2 rounded font-serif text-center">
            <MathView math={`y'' = 6ax + 2b = 0 \\iff x_I = -\\frac{b}{3a} = ${formatNumVi(inflectionPoint.x)}`} />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nếu thực hiện phép tịnh tiến hệ trục tọa độ về gốc I(x_I; y_I) bằng công thức đổi biến <MathView math="X = x - x_I" />, phương trình hàm số trở thành hàm lẻ <MathView math="Y = aX^3 + pX" /> (không còn số hạng bậc hai và hệ số tự do). Vì hàm lẻ có đồ thị nhận gốc tọa độ làm tâm đối xứng, suy ra đồ thị hàm số bậc ba luôn nhận điểm uốn I làm tâm đối xứng!
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: '4. Giới hạn tại vô cực được tính như thế nào?',
      badge: 'Quy tắc dấu của a',
      color: 'indigo',
      content: (
        <div className="space-y-2 text-slate-700 text-xs sm:text-sm">
          <p>
            Khi x tiến ra vô cực, số hạng bậc cao nhất <MathView math="ax^3" /> sẽ hoàn toàn chi phối giá trị của hàm số:
          </p>
          <div className="bg-slate-100 p-2 rounded font-serif text-center">
            <MathView math={`\\lim_{x \\to \\pm\\infty} y = \\lim_{x \\to \\pm\\infty} x^3 \\left( a + \\frac{b}{x} + \\frac{c}{x^2} + \\frac{d}{x^3} \\right) = \\lim_{x \\to \\pm\\infty} (a \\cdot x^3)`} />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vì bậc 3 là bậc lẻ:
            <br />• Nếu <MathView math="a > 0" />: nhánh phải đi lên <MathView math="+\\infty" />, nhánh trái đi xuống <MathView math="-\\infty" />.
            <br />• Nếu <MathView math="a < 0" />: nhánh phải đi xuống <MathView math="-\\infty" />, nhánh trái đi lên <MathView math="+\\infty" />.
          </p>
        </div>
      )
    }
  ];

  return (
    <div id="math-explanation-card" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-semibold text-slate-800">5. Giải thích Toán học chi tiết (Kiến thức lớp 12)</h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">Bản chất Toán học đằng sau kết quả</span>
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        {explanations.map((exp, idx) => {
          const isOpen = openCard === idx || openCard === null; // open all or expand
          return (
            <div
              key={exp.id}
              className="border border-slate-200 rounded-lg overflow-hidden transition-all bg-white"
            >
              <button
                type="button"
                onClick={() => toggleCard(idx)}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpenCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-xs sm:text-sm text-slate-900">{exp.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-2xs">
                    {exp.badge}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="p-4 border-t border-slate-200 bg-white">
                  {exp.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
