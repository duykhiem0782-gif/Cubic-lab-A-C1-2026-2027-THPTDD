import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  School,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { StudentProfile, getStudentInitials } from '../types/student';

interface WelcomeGateProps {
  onComplete: (profile: StudentProfile) => void;
}

const CLASS_PRESETS = ['12A1', '12A2', '12A3', '12 Chuyên Toán', '12 Chuyên Tin', '12 Lý', '12 Hóa'];
const EXAM_GROUPS = [
  'Khối A00 (Toán - Lý - Hóa)',
  'Khối A01 (Toán - Lý - Anh)',
  'Khối B00 (Toán - Hóa - Sinh)',
  'Khối D01 (Toán - Văn - Anh)',
  'Khối D07 (Toán - Hóa - Anh)'
];

export const WelcomeGate: React.FC<WelcomeGateProps> = ({ onComplete }) => {
  const [name, setName] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [school, setSchool] = useState<string>('THPT');
  const [targetScore, setTargetScore] = useState<number>(9.4);
  const [examGroup, setExamGroup] = useState<string>('Khối A00 (Toán - Lý - Hóa)');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn để bắt đầu sử dụng.');
      return;
    }
    if (!className.trim()) {
      setErrorMessage('Vui lòng nhập lớp học của bạn để tiếp tục.');
      return;
    }

    const newProfile: StudentProfile = {
      name: name.trim(),
      className: className.trim(),
      school: school.trim() || 'THPT',
      targetScore: Number(targetScore) || 9.0,
      examGroup
    };

    onComplete(newProfile);
  };

  const initials = getStudentInitials(name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/40 to-purple-50/50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden animate-fadeIn">
        {/* Top Hero Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-serif font-black text-lg border border-white/20 shadow-xs">
                C³
              </div>
              <span className="font-extrabold text-sm tracking-wide uppercase">
                EDUMATH 12 PRO
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/40 border border-purple-300/30 text-purple-100">
                Lớp 12 THPT
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
              Chào Mừng Bạn Đến Với Không Gian Học Tập Toán 12!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Vui lòng nhập <strong className="text-white font-semibold">Tên</strong> và <strong className="text-white font-semibold">Lớp học</strong> của bạn để kích hoạt hệ thống khảo sát đồ thị, luyện đề thi và theo dõi tiến độ học tập.
            </p>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="px-6 pt-5 pb-1">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 truncate">
                  {name.trim() || 'Họ và tên của bạn'}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Award className="w-3.5 h-3.5" /> Mục tiêu {targetScore}đ
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span className="font-semibold text-indigo-600">
                  Lớp: {className.trim() || 'Chưa nhập lớp'}
                </span>
                <span>•</span>
                <span className="truncate">{school.trim() || 'Trường THPT'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Mandatory Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <Lock className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Họ và tên (Bắt buộc) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>1. Họ và tên học sinh</span>
              </span>
              <span className="text-rose-500 text-[11px] font-semibold">* Bắt buộc</span>
            </label>
            <input
              type="text"
              autoFocus
              required
              placeholder="Nhập đầy đủ họ và tên (VD: Nguyễn Tuấn Anh, Trần Thu Hà...)"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          {/* 2. Lớp học (Bắt buộc) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>2. Lớp học</span>
              </label>
              <span className="text-rose-500 text-[11px] font-semibold">* Bắt buộc</span>
            </div>

            <input
              type="text"
              required
              placeholder="Nhập tên lớp của bạn (VD: 12A1, 12 Chuyên Toán, 12A2...)"
              value={className}
              onChange={(e) => {
                setClassName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            />

            {/* Quick class presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 self-center mr-1">Gợi ý nhanh:</span>
              {CLASS_PRESETS.map((cls) => (
                <button
                  type="button"
                  key={cls}
                  onClick={() => {
                    setClassName(cls);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    className === cls
                      ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Trường THPT (Tùy chọn) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-indigo-600" />
              <span>3. Trường THPT (Tùy chọn)</span>
            </label>
            <input
              type="text"
              placeholder="VD: THPT Chuyên Hà Nội - Amsterdam, THPT Chu Văn An..."
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* 4. Mục tiêu điểm số & Khối thi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {/* Target score */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Mục tiêu điểm Toán</span>
                </span>
                <span className="font-mono text-emerald-600 text-sm font-extrabold">
                  {targetScore.toFixed(1)} / 10
                </span>
              </div>
              <input
                type="range"
                min={7.0}
                max={10.0}
                step={0.2}
                value={targetScore}
                onChange={(e) => setTargetScore(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>7.0</span>
                <span>8.0</span>
                <span>9.0</span>
                <span>10.0</span>
              </div>
            </div>

            {/* Exam Group */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Khối thi dự kiến</span>
              </label>
              <select
                value={examGroup}
                onChange={(e) => setExamGroup(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
              >
                {EXAM_GROUPS.map((grp) => (
                  <option key={grp} value={grp}>
                    {grp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Big Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-extrabold shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Vào Khám Phá & Học Tập Ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2.5">
              Thông tin của bạn được lưu an toàn trên trình duyệt để ghi nhận kết quả bài tập và lộ trình học.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
