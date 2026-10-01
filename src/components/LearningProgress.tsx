import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { GRADE_12_TOPICS } from '../data/curriculumData';

interface LearningProgressProps {
  onSelectTopic: (topicId: string) => void;
}

export const LearningProgress: React.FC<LearningProgressProps> = ({ onSelectTopic }) => {
  // Compute overall progress
  const totalWeight = GRADE_12_TOPICS.length;
  const avgProgress = Math.round(
    GRADE_12_TOPICS.reduce((acc, t) => acc + t.progress, 0) / totalWeight
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Tiến Độ Học Tập & Mục Tiêu Kỳ Thi THPT 2026
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi tỷ lệ hoàn thành lý thuyết, bài tập trắc nghiệm và đề thi thử theo chuẩn Bộ GD&ĐT.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Mục tiêu: 9.4 điểm
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> 7 ngày streak
          </span>
        </div>
      </div>

      {/* Main Overall Progress Bar */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/70 to-purple-50/70 border border-indigo-100/70 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <span>Tổng tiến độ toàn diện chương trình 12</span>
            <span className="text-[11px] font-normal text-slate-500">(Giải tích, Hình học, Xác suất)</span>
          </span>
          <span className="font-extrabold text-indigo-700 text-sm">{avgProgress}%</span>
        </div>

        <div className="w-full h-3 bg-white/80 rounded-full overflow-hidden p-0.5 border border-indigo-200/50">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${avgProgress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
          <span>Đã hoàn thành 29/37 bài học lý thuyết</span>
          <span className="text-indigo-600 font-semibold">Còn 8 bài để cán mốc 100%</span>
        </div>
      </div>

      {/* Progress Breakdown by Topic */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Phân bố theo chuyên đề trọng tâm
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {GRADE_12_TOPICS.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className="p-3.5 rounded-xl border border-slate-200/70 hover:border-indigo-300 hover:bg-slate-50/80 transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      topic.progress >= 85
                        ? 'bg-emerald-500'
                        : topic.progress >= 70
                        ? 'bg-indigo-500'
                        : 'bg-amber-500'
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                    {topic.title}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-600 font-mono">
                  {topic.progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    topic.progress >= 85
                      ? 'bg-emerald-500'
                      : topic.progress >= 70
                      ? 'bg-indigo-600'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${topic.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Lý thuyết: {topic.completedLessons}/{topic.totalLessons} bài
                </span>
                <span>
                  Bài tập: {topic.completedExercises}/{topic.totalExercises} câu
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
