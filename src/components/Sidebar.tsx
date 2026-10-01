import React from 'react';
import {
  LayoutDashboard,
  FunctionSquare,
  Boxes,
  FileCheck2,
  BookOpen,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  X,
  UserCheck,
  Edit3
} from 'lucide-react';
import { StudentProfile, getStudentInitials } from '../types/student';

export type NavTab = 
  | 'dashboard'
  | 'cubic-lab'
  | 'oxyz'
  | 'practice'
  | 'formulas';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  profile: StudentProfile;
  onOpenProfileModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  profile,
  onOpenProfileModal
}) => {
  const menuItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Tổng quan & Lộ trình',
      icon: LayoutDashboard,
      badge: 'Lớp 12'
    },
    {
      id: 'cubic-lab' as NavTab,
      label: 'Khảo sát Hàm số Bậc 3',
      icon: FunctionSquare,
      badge: 'Cubic Lab A',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'oxyz' as NavTab,
      label: 'Không gian Toạ độ Oxyz',
      icon: Boxes,
      badge: '3D Lab',
      badgeColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: 'practice' as NavTab,
      label: 'Luyện đề & Bài tập',
      icon: FileCheck2,
      badge: '5 câu hot',
      badgeColor: 'bg-amber-100 text-amber-700'
    },
    {
      id: 'formulas' as NavTab,
      label: 'Sổ tay Công thức 12',
      icon: BookOpen
    }
  ];

  const initials = getStudentInitials(profile.name);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <span className="font-serif font-black text-xl tracking-tight">C³</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 tracking-tight text-base font-sans">
                  EDUMATH 12
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Toán Học THPT 2026</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Chuyên đề & Thí nghiệm
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick study alert banner inside sidebar */}
          <div className="pt-4 px-2">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/70 text-xs">
              <div className="flex items-center gap-2 text-indigo-900 font-semibold mb-1">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Mẹo điểm 9+ THPT</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Đồ thị bậc ba luôn nhận điểm uốn <span className="font-serif italic font-semibold">I(-b/3a; f(-b/3a))</span> làm tâm đối xứng!
              </p>
            </div>
          </div>
        </div>

        {/* Student Profile Card (Bottom) */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div
            onClick={onOpenProfileModal}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
            title="Bấm để đổi tên và lớp học"
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] text-white font-bold border-2 border-white">
                <Flame className="w-2.5 h-2.5 fill-current" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                  {profile.name}
                </h4>
                <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span className="font-semibold text-indigo-600">Lớp {profile.className}</span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">{profile.targetScore}+ đ</span>
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
