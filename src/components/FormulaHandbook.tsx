import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Sparkles,
  Filter,
  Bookmark
} from 'lucide-react';
import { FORMULA_HANDBOOK, FormulaItem } from '../data/curriculumData';

export const FormulaHandbook: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['all', 'Giải tích - Đạo hàm', 'Đại số - Mũ & Logarit', 'Hình học Oxyz', 'Xác suất 12'];

  const filteredFormulas = FORMULA_HANDBOOK.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (formula: string, id: string) => {
    navigator.clipboard?.writeText(formula);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Sổ Tay Công Thức Toán 12 Trọng Tâm
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tổng hợp đầy đủ công thức giải nhanh, định lý và ví dụ minh họa phục vụ kỳ thi Tốt nghiệp THPT.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm công thức, định lý..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'Tất cả các phần' : cat}
          </button>
        ))}
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-600 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100">
                    {item.category}
                  </span>

                  <button
                    onClick={() => handleCopy(item.formula, item.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Sao chép công thức"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  {item.title}
                </h3>

                {/* Formula Box */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-sm text-indigo-950 font-bold tracking-wide overflow-x-auto">
                  {item.formula}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {item.meaning}
                </p>
              </div>

              {item.example && (
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-[11px] text-amber-900 font-mono">
                  <span className="font-bold font-sans">Ví dụ: </span>
                  {item.example}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
