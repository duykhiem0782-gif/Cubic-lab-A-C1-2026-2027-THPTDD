import React from 'react';
import {
  Sparkles,
  Award,
  BookOpen,
  FileCheck2,
  TrendingUp,
  ArrowRight,
  PlayCircle,
  Clock,
  Compass,
  CheckCircle2,
  UserCheck,
  Edit3,
  GraduationCap
} from 'lucide-react';
import { LearningProgress } from './LearningProgress';
import { TopicCardsGrid } from './TopicCardsGrid';
import { InteractiveGraphPreviews } from './InteractiveGraphPreviews';
import { NavTab } from './Sidebar';
import { StudentProfile } from '../types/student';

interface DashboardViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenFormulas: () => void;
  onOpenPractice: () => void;
  profile: StudentProfile;
  onOpenProfileModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenFormulas,
  onOpenPractice,
  profile,
  onOpenProfileModal
}) => {
  return (
    <div className="space-y-7">
      {/* 1. WELCOMING HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-lg p-6 sm:p-8">
        {/* Decorative background math graphics */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-60 h-60 rounded-full bg-purple-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          {/* Top badges & Edit profile trigger */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20">
                <GraduationCap className="w-3.5 h-3.5 text-blue-200" />
                <span>Lớp: {profile.className} • {profile.school}</span>
              </span>

              <button
                onClick={onOpenProfileModal}
                className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
                title="Bấm để điều chỉnh mục tiêu điểm"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Mục tiêu: {profile.targetScore.toFixed(1)}/10 • Khối {profile.examGroup.split(' ')[0]}</span>
              </button>
            </div>

            {/* Direct button to enter/edit name & class */}
            <button
              onClick={onOpenProfileModal}
              className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/30 transition-all cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Đổi tên & lớp học</span>
            </button>
          </div>

          {/* Heading */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                Xin chào, {profile.name}! 👋
              </h2>
            </div>
            <p className="text-blue-100 text-xs sm:text-sm mt-1.5 leading-relaxed font-normal">
              Sẵn sàng bứt phá mục tiêu <strong className="text-white font-semibold">{profile.targetScore}+ điểm môn Toán</strong> hôm nay chưa? Hãy cùng khảo sát cực trị hàm bậc ba và mô phỏng toạ độ không gian 3D Oxyz!
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('cubic-lab')}
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer group"
            >
              <PlayCircle className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span>Tiếp tục: Cubic Lab A (Hàm bậc 3)</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onOpenPractice}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Làm bài tập rèn luyện (5 câu mới)</span>
            </button>

            <button
              onClick={onOpenProfileModal}
              className="sm:hidden px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Hồ sơ</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE GRAPH PREVIEWS SHOWCASE */}
      <InteractiveGraphPreviews onNavigateTab={onNavigateTab} />

      {/* 4. LEARNING PROGRESS SECTION */}
      <LearningProgress
        onSelectTopic={(topicId) => {
          if (topicId === 'cubic-lab') onNavigateTab('cubic-lab');
          else if (topicId === 'oxyz') onNavigateTab('oxyz');
          else onNavigateTab('practice');
        }}
      />

      {/* 5. MATHEMATICS TOPIC CARDS GRID */}
      <TopicCardsGrid
        onNavigateTab={onNavigateTab}
        onOpenPracticeWithTopic={() => onOpenPractice()}
      />

      {/* 6. QUICK-ACCESS ACTION BUTTONS (LESSONS, EXERCISES, PRACTICE TESTS) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <span>Khu Vực Truy Cập Nhanh Cho Học Sinh Lớp 12</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Lựa chọn hình thức học tập phù hợp theo nhu cầu ôn tập của bạn.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Button 1: Lessons */}
          <div
            onClick={() => onNavigateTab('cubic-lab')}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                1. Bài Giảng & Khảo Sát Sư Phạm
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Học lý thuyết tương tác với đồ thị động, bảng biến thiên chuẩn và định lý toán học 12.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-blue-300 group-hover:translate-x-1 transition-transform">
              <span>Khám phá ngay</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Button 2: Exercises */}
          <div
            onClick={onOpenPractice}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                2. Bài Tập Rèn Luyện Trắc Nghiệm
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Phân loại theo mức độ Nhận biết, Thông hiểu, Vận dụng và Vận dụng cao kèm giải thích từng bước.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-300 group-hover:translate-x-1 transition-transform">
              <span>Bắt đầu giải</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Button 3: Formula Cheatsheet */}
          <div
            onClick={onOpenFormulas}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                3. Sổ Tay Công Thức Giải Nhanh
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tra cứu công thức đạo hàm, hàm số mũ logarit, hình học không gian Oxyz và công thức xác suất Bayes.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-purple-300 group-hover:translate-x-1 transition-transform">
              <span>Mở sổ tay</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
