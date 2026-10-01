import React from 'react';
import {
  Menu,
  Search,
  BookOpen,
  Flame,
  FileCheck2,
  Sparkles,
  User,
  GraduationCap
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { StudentProfile, getStudentInitials } from '../types/student';

interface TopNavbarProps {
  currentTab: NavTab;
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  onOpenFormulas: () => void;
  onOpenPractice: () => void;
  profile: StudentProfile;
  onOpenProfileModal: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onOpenMobileSidebar,
  onOpenSearch,
  onOpenFormulas,
  onOpenPractice,
  profile,
  onOpenProfileModal
}) => {
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'Bảng Điều Khiển Tổng Quan',
          subtitle: 'Chương trình Toán 12 & Luyện thi THPT Quốc Gia'
        };
      case 'cubic-lab':
        return {
          title: 'Cubic Lab A – Khảo Sát Hàm Bậc Ba',
          subtitle: 'y = ax³ + bx² + cx + d (a ≠ 0)'
        };
      case 'oxyz':
        return {
          title: 'Phòng Thí Nghiệm Toạ Độ Không Gian Oxyz',
          subtitle: 'Mô hình 3D: Mặt phẳng, Vectơ pháp tuyến & Khoảng cách'
        };
      case 'practice':
        return {
          title: 'Ngân Hàng Bài Tập & Luyện Đề Chuẩn',
          subtitle: 'Phân loại theo mức độ: Nhận biết, Thông hiểu, Vận dụng'
        };
      case 'formulas':
        return {
          title: 'Sổ Tay Công Thức Toán 12 Siêu Tốc',
          subtitle: 'Hệ thống hoá toàn bộ công thức trọng tâm lớp 12'
        };
    }
  };

  const currentInfo = getTabTitle(currentTab);
  const initials = getStudentInitials(profile.name);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Mở menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate flex items-center gap-2">
              <span>{currentInfo.title}</span>
            </h1>
            <p className="text-xs text-slate-500 truncate hidden sm:block">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Center/Right: Search Bar, Student Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-slate-500 text-xs transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Tìm kiếm chuyên đề, công thức...</span>
            <span className="md:hidden">Tìm kiếm</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white rounded border border-slate-200 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Quick Action: Formula Book */}
          <button
            onClick={onOpenFormulas}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sổ tay</span>
          </button>

          {/* Student Profile Quick Button */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 transition-all cursor-pointer group"
            title="Nhập/Đổi tên và lớp học"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {initials}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                {profile.name}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                Lớp {profile.className}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
