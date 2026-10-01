import React from 'react';
import {
  FunctionSquare,
  TrendingUp,
  Binary,
  Boxes,
  Sigma,
  PieChart,
  ArrowRight,
  BookOpen,
  FileCheck2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { GRADE_12_TOPICS, Topic } from '../data/curriculumData';
import { NavTab } from './Sidebar';

interface TopicCardsGridProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenPracticeWithTopic?: (topicId: string) => void;
}

export const TopicCardsGrid: React.FC<TopicCardsGridProps> = ({
  onNavigateTab,
  onOpenPracticeWithTopic
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FunctionSquare':
        return <FunctionSquare className="w-5 h-5 text-blue-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-indigo-600" />;
      case 'Binary':
        return <Binary className="w-5 h-5 text-purple-600" />;
      case 'Boxes':
        return <Boxes className="w-5 h-5 text-emerald-600" />;
      case 'Sigma':
        return <Sigma className="w-5 h-5 text-amber-600" />;
      case 'PieChart':
        return <PieChart className="w-5 h-5 text-rose-600" />;
      default:
        return <FunctionSquare className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBadgeStyle = (badgeColor: string) => {
    switch (badgeColor) {
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCardClick = (topicId: string) => {
    if (topicId === 'cubic-lab') {
      onNavigateTab('cubic-lab');
    } else if (topicId === 'oxyz') {
      onNavigateTab('oxyz');
    } else {
      onNavigateTab('practice');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Chuyên Đề Trọng Tâm Kỳ Thi THPT Quốc Gia
          </h3>
          <p className="text-xs text-slate-500">
            Học lý thuyết, làm bài tập phân mức độ và khảo sát tương tác trực quan từng dạng toán.
          </p>
        </div>

        <span className="text-xs text-slate-400">
          6 chuyên đề chuẩn cấu trúc Bộ Giáo dục
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {GRADE_12_TOPICS.map((topic) => {
          return (
            <div
              key={topic.id}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Top */}
              <div className="p-5 space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getIcon(topic.iconName)}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(
                      topic.badgeColor
                    )}`}
                  >
                    {topic.badge}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
                    {topic.chapter}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                {/* Key concept pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {topic.keyConcepts.slice(0, 3).map((concept, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                    >
                      {concept}
                    </span>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Tiến độ bài học</span>
                    <span className="font-bold text-slate-700 font-mono">
                      {topic.progress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      style={{ width: `${topic.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Bottom Quick Actions */}
              <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => handleCardClick(topic.id)}
                  className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <span>Mở thí nghiệm & bài học</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    if (onOpenPracticeWithTopic) {
                      onOpenPracticeWithTopic(topic.id);
                    } else {
                      onNavigateTab('practice');
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-[11px] flex items-center gap-1 shadow-2xs"
                >
                  <FileCheck2 className="w-3 h-3 text-slate-400" />
                  <span>Luyện tập</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
