import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  FunctionSquare,
  Boxes,
  BookOpen,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import { GRADE_12_TOPICS, FORMULA_HANDBOOK } from '../data/curriculumData';
import { NavTab } from './Sidebar';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTopics = GRADE_12_TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.keyConcepts.some((c) => c.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredFormulas = FORMULA_HANDBOOK.filter(
    (f) =>
      f.title.toLowerCase().includes(query.toLowerCase()) ||
      f.formula.toLowerCase().includes(query.toLowerCase()) ||
      f.meaning.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm chuyên đề, đồ thị, công thức Toán 12 (VD: cực trị, điểm uốn, Oxyz, mũ logarit...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Quick Labs Suggestions */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Phòng Thí Nghiệm & Khảo Sát Trực Quan
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onSelectTab('cubic-lab');
                  onClose();
                }}
                className="p-3 rounded-xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-100 text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <FunctionSquare className="w-4 h-4 text-blue-600" />
                  <span>Cubic Lab A (Hàm bậc 3)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
              </button>

              <button
                onClick={() => {
                  onSelectTab('oxyz');
                  onClose();
                }}
                className="p-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-100 text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <Boxes className="w-4 h-4 text-emerald-600" />
                  <span>Toạ Độ Không Gian Oxyz 3D</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
              </button>
            </div>
          </div>

          {/* Topics matches */}
          {filteredTopics.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Chuyên đề môn Toán 12 ({filteredTopics.length})
              </div>
              <div className="space-y-1.5">
                {filteredTopics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => {
                      if (topic.id === 'cubic-lab') onSelectTab('cubic-lab');
                      else if (topic.id === 'oxyz') onSelectTab('oxyz');
                      else onSelectTab('practice');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-100/80 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{topic.title}</div>
                      <div className="text-[11px] text-slate-400">{topic.chapter}</div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {topic.progress}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formula matches */}
          {filteredFormulas.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Công thức & Định lý ({filteredFormulas.length})
              </div>
              <div className="space-y-2">
                {filteredFormulas.slice(0, 4).map((f) => (
                  <div
                    key={f.id}
                    onClick={() => {
                      onSelectTab('formulas');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{f.title}</span>
                      <span className="text-[10px] text-indigo-600 font-semibold">{f.category}</span>
                    </div>
                    <div className="font-mono text-xs text-indigo-900 font-bold">{f.formula}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
