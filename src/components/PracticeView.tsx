import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Award,
  Filter
} from 'lucide-react';
import { PRACTICE_QUESTIONS, PracticeQuestion } from '../data/curriculumData';

export const PracticeView: React.FC = () => {
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});

  const filteredQuestions = selectedTopicFilter === 'all'
    ? PRACTICE_QUESTIONS
    : PRACTICE_QUESTIONS.filter((q) => q.topicId === selectedTopicFilter);

  const handleSelectAnswer = (questionId: number, optionKey: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey
    }));
    // Automatically reveal explanation once answered
    setRevealedExplanations((prev) => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setRevealedExplanations({});
  };

  // Stats
  const totalAnswered = Object.keys(userAnswers).length;
  const totalCorrect = PRACTICE_QUESTIONS.filter(
    (q) => userAnswers[q.id] === q.correctAnswer
  ).length;

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <FileCheck2 className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Luyện Tập Trắc Nghiệm & Đề Thi Chuẩn Cấu Trúc
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bộ câu hỏi chọn lọc phân hóa từ Nhận biết, Thông hiểu đến Vận dụng cao kèm lời giải chi tiết.
          </p>
        </div>

        {/* Score indicator */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Đã làm:</span>
              <span className="font-bold text-slate-700">
                {totalAnswered} / {PRACTICE_QUESTIONS.length} câu
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[10px]">Đúng:</span>
              <span className="font-bold text-emerald-600">
                {totalCorrect} câu ({totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0}%)
              </span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Làm lại tất cả"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Lọc chuyên đề:
        </span>
        {[
          { id: 'all', label: 'Tất cả chuyên đề' },
          { id: 'cubic-lab', label: 'Khảo sát bậc ba' },
          { id: 'derivatives', label: 'Đạo hàm & Khảo sát' },
          { id: 'oxyz', label: 'Toạ độ Oxyz' },
          { id: 'logarithm', label: 'Mũ & Logarit' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTopicFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              selectedTopicFilter === tab.id
                ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const userAnswer = userAnswers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = userAnswer === q.correctAnswer;
          const isExplanationShown = revealedExplanations[q.id];

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl bg-white border transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-200 shadow-xs'
                    : 'border-rose-200 shadow-xs'
                  : 'border-slate-200/80 shadow-2xs'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {q.topicName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.level === 'Nhận biết'
                        ? 'bg-slate-100 text-slate-700'
                        : q.level === 'Thông hiểu'
                        ? 'bg-blue-50 text-blue-700'
                        : q.level === 'Vận dụng'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {q.level}
                  </span>

                  {isAnswered && (
                    <span
                      className={`text-xs font-bold flex items-center gap-1 ${
                        isCorrect ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Chính xác (+0.2đ)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Chưa đúng
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <p className="text-sm font-semibold text-slate-900 leading-relaxed mb-4">
                {q.question}
              </p>

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                {q.options.map((opt) => {
                  const isSelected = userAnswer === opt.key;
                  const isCorrectChoice = opt.key === q.correctAnswer;

                  let btnStyle = 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100';

                  if (isAnswered) {
                    if (isCorrectChoice) {
                      btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-50 border-rose-300 text-rose-800 line-through';
                    } else {
                      btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectAnswer(q.id, opt.key)}
                      disabled={isAnswered}
                      className={`w-full p-3 rounded-xl border text-xs text-left flex items-start gap-2.5 transition-all ${btnStyle}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="font-mono pt-0.5">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Step-by-step Solution Explanation */}
              {isExplanationShown && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Lời giải chi tiết & Phương pháp:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-sans">
                    {q.explanation}
                  </p>
                  {q.formulaNote && (
                    <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-900 font-mono text-[11px]">
                      💡 Công thức áp dụng: {q.formulaNote}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
