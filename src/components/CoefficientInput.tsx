import React, { useState, useEffect } from 'react';
import { CubicCoefficients } from '../types';
import { Calculator, RotateCcw, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface CoefficientInputProps {
  initialValues: CubicCoefficients;
  onCalculate: (coeffs: CubicCoefficients) => void;
  isInvalidA: boolean;
}

export const CoefficientInput: React.FC<CoefficientInputProps> = ({
  initialValues,
  onCalculate,
  isInvalidA
}) => {
  const [aStr, setAStr] = useState<string>(initialValues.a.toString());
  const [bStr, setBStr] = useState<string>(initialValues.b.toString());
  const [cStr, setCStr] = useState<string>(initialValues.c.toString());
  const [dStr, setDStr] = useState<string>(initialValues.d.toString());

  // Keep in sync when initialValues change from external presets
  useEffect(() => {
    setAStr(initialValues.a.toString());
    setBStr(initialValues.b.toString());
    setCStr(initialValues.c.toString());
    setDStr(initialValues.d.toString());
  }, [initialValues]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const a = parseFloat(aStr) || 0;
    const b = parseFloat(bStr) || 0;
    const c = parseFloat(cStr) || 0;
    const d = parseFloat(dStr) || 0;

    onCalculate({ a, b, c, d });
  };

  const handleReset = () => {
    const defaults = { a: 1, b: -3, c: 0, d: 2 };
    setAStr(defaults.a.toString());
    setBStr(defaults.b.toString());
    setCStr(defaults.c.toString());
    setDStr(defaults.d.toString());
    onCalculate(defaults);
  };

  const handleApplyPreset = (preset: CubicCoefficients) => {
    setAStr(preset.a.toString());
    setBStr(preset.b.toString());
    setCStr(preset.c.toString());
    setDStr(preset.d.toString());
    onCalculate(preset);
  };

  const quickSamples = [
    { label: 'y = x³ - 3x² + 2', coeffs: { a: 1, b: -3, c: 0, d: 2 }, tag: '2 Cực trị (a > 0)' },
    { label: 'y = -x³ + 3x - 1', coeffs: { a: -1, b: 0, c: 3, d: -1 }, tag: '2 Cực trị (a < 0)' },
    { label: 'y = x³ - 3x² + 3x - 1', coeffs: { a: 1, b: -3, c: 3, d: -1 }, tag: 'Nghiệm kép (Δ\' = 0)' },
    { label: 'y = x³ + 3x + 1', coeffs: { a: 1, b: 0, c: 3, d: 1 }, tag: 'Đồng biến trên R' },
    { label: 'y = -x³ - x + 2', coeffs: { a: -1, b: 0, c: -1, d: 2 }, tag: 'Nghịch biến trên R' }
  ];

  const currentA = parseFloat(aStr);
  const aIsZero = !isNaN(currentA) && currentA === 0;

  return (
    <div id="coefficient-input-card" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
          <h2 className="text-sm font-semibold text-slate-800">1. Nhập hệ số hàm số bậc ba</h2>
        </div>
        <span className="text-xs text-slate-500 font-mono">y = ax³ + bx² + cx + d</span>
      </div>

      <div className="p-4 sm:p-5">
        <form onSubmit={handleSubmit}>
          {/* 4 coefficient inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {/* a */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Hệ số a <span className="text-red-500">*</span></span>
                <span className="text-[11px] text-slate-400 font-normal">(a ≠ 0)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={aStr}
                  onChange={e => {
                    setAStr(e.target.value);
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val !== 0) {
                      onCalculate({
                        a: val,
                        b: parseFloat(bStr) || 0,
                        c: parseFloat(cStr) || 0,
                        d: parseFloat(dStr) || 0
                      });
                    }
                  }}
                  className={`w-full px-3 py-2 text-sm font-medium border rounded-lg focus:outline-hidden focus:ring-2 transition-all ${
                    aIsZero
                      ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-red-400'
                      : 'border-slate-300 bg-white text-slate-900 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Nhập a"
                />
              </div>
            </div>

            {/* b */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Hệ số b
              </label>
              <input
                type="number"
                step="any"
                value={bStr}
                onChange={e => {
                  setBStr(e.target.value);
                  const aVal = parseFloat(aStr);
                  if (!isNaN(aVal) && aVal !== 0) {
                    onCalculate({
                      a: aVal,
                      b: parseFloat(e.target.value) || 0,
                      c: parseFloat(cStr) || 0,
                      d: parseFloat(dStr) || 0
                    });
                  }
                }}
                className="w-full px-3 py-2 text-sm font-medium border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                placeholder="Nhập b"
              />
            </div>

            {/* c */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Hệ số c
              </label>
              <input
                type="number"
                step="any"
                value={cStr}
                onChange={e => {
                  setCStr(e.target.value);
                  const aVal = parseFloat(aStr);
                  if (!isNaN(aVal) && aVal !== 0) {
                    onCalculate({
                      a: aVal,
                      b: parseFloat(bStr) || 0,
                      c: parseFloat(e.target.value) || 0,
                      d: parseFloat(dStr) || 0
                    });
                  }
                }}
                className="w-full px-3 py-2 text-sm font-medium border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                placeholder="Nhập c"
              />
            </div>

            {/* d */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">
                Hệ số d
              </label>
              <input
                type="number"
                step="any"
                value={dStr}
                onChange={e => {
                  setDStr(e.target.value);
                  const aVal = parseFloat(aStr);
                  if (!isNaN(aVal) && aVal !== 0) {
                    onCalculate({
                      a: aVal,
                      b: parseFloat(bStr) || 0,
                      c: parseFloat(cStr) || 0,
                      d: parseFloat(e.target.value) || 0
                    });
                  }
                }}
                className="w-full px-3 py-2 text-sm font-medium border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                placeholder="Nhập d"
              />
            </div>
          </div>

          {/* Validation Warning when a = 0 */}
          {(aIsZero || isInvalidA) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-red-800 text-xs sm:text-sm">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Đây không phải là hàm số bậc ba. Vui lòng nhập a ≠ 0.</p>
                <p className="text-red-700 text-xs mt-0.5">
                  Khi a = 0, đa thức suy biến thành hàm số bậc hai y = bx² + cx + d hoặc bậc nhất/hằng số.
                </p>
              </div>
            </div>
          )}

          {/* Buttons: Khảo sát & Làm mới */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <button
              type="submit"
              disabled={aIsZero}
              className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Khảo sát hàm số</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition-colors border border-slate-300 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm mới</span>
            </button>
          </div>
        </form>

        {/* Quick Sample Presets */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Ví dụ mẫu (nhấn để chọn nhanh):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickSamples.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(sample.coeffs)}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="font-mono font-medium">{sample.label}</span>
                <span className="text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {sample.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
