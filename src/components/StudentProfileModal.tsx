import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  School,
  Award,
  BookOpen,
  X,
  Check,
  RotateCcw,
  Sparkles,
  LogOut
} from 'lucide-react';
import { StudentProfile, DEFAULT_STUDENT_PROFILE, getStudentInitials } from '../types/student';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  onLogout?: () => void;
}

const CLASS_PRESETS = ['12A1', '12A2', '12A3', '12 Chuyên Toán', '12 Chuyên Tin', '12 Lý', '12 Hóa'];
const EXAM_GROUPS = [
  'Khối A00 (Toán - Lý - Hóa)',
  'Khối A01 (Toán - Lý - Anh)',
  'Khối B00 (Toán - Hóa - Sinh)',
  'Khối D01 (Toán - Văn - Anh)',
  'Khối D07 (Toán - Hóa - Anh)'
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onLogout
}) => {
  const [name, setName] = useState<string>(profile.name);
  const [className, setClassName] = useState<string>(profile.className);
  const [school, setSchool] = useState<string>(profile.school);
  const [targetScore, setTargetScore] = useState<number>(profile.targetScore);
  const [examGroup, setExamGroup] = useState<string>(profile.examGroup);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setClassName(profile.className);
      setSchool(profile.school);
      setTargetScore(profile.targetScore);
      setExamGroup(profile.examGroup);
      setSavedSuccess(false);
      setErrorMessage('');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên học sinh');
      return;
    }
    if (!className.trim()) {
      setErrorMessage('Vui lòng nhập tên lớp học');
      return;
    }

    const updatedProfile: StudentProfile = {
      name: name.trim(),
      className: className.trim(),
      school: school.trim() || 'THPT',
      targetScore: Number(targetScore) || 9.0,
      examGroup
    };

    onSaveProfile(updatedProfile);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleResetDefault = () => {
    setName(DEFAULT_STUDENT_PROFILE.name);
    setClassName(DEFAULT_STUDENT_PROFILE.className);
    setSchool(DEFAULT_STUDENT_PROFILE.school);
    setTargetScore(DEFAULT_STUDENT_PROFILE.targetScore);
    setExamGroup(DEFAULT_STUDENT_PROFILE.examGroup);
    setErrorMessage('');
  };

  const initials = getStudentInitials(name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Hồ Sơ Học Sinh Lớp 12
              </h3>
              <p className="text-xs text-slate-500">
                Nhập tên và lớp của bạn để cá nhân hóa lộ trình học & thi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Badge */}
        <div className="px-6 pt-5 pb-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 truncate">
                  {name.trim() || 'Chưa nhập tên'}
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Award className="w-3.5 h-3.5" /> Mục tiêu {targetScore}đ
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span className="font-semibold text-indigo-600">Lớp: {className.trim() || 'Chưa nhập'}</span>
                <span>•</span>
                <span className="truncate">{school.trim() || 'Trường THPT'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* 1. Họ và tên */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Họ và tên học sinh <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Nguyễn Tuấn Anh, Trần Thu Hà..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          {/* 2. Lớp học */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Lớp <span className="text-rose-500">*</span></span>
              </label>
              <span className="text-[11px] text-slate-400">Chọn nhanh hoặc tự nhập:</span>
            </div>

            <input
              type="text"
              required
              placeholder="Ví dụ: 12A1, 12 Chuyên Toán, 12A2..."
              value={className}
              onChange={(e) => {
                setClassName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            />

            {/* Quick class presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {CLASS_PRESETS.map((cls) => (
                <button
                  type="button"
                  key={cls}
                  onClick={() => setClassName(cls)}
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
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-indigo-600" />
              <span>Trường THPT (Tùy chọn)</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: THPT Chuyên Hà Nội - Amsterdam, THPT Chu Văn An..."
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* 4. Mục tiêu điểm số & Khối thi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {/* Target score */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
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
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tổ hợp / Khối thi</span>
              </label>
              <select
                value={examGroup}
                onChange={(e) => setExamGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
              >
                {EXAM_GROUPS.map((grp) => (
                  <option key={grp} value={grp}>
                    {grp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục mẫu</span>
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer ml-2"
                  title="Nhập lại thông tin ban đầu"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đổi học sinh</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Đã lưu thành công!</span>
                  </>
                ) : (
                  <span>Lưu hồ sơ học sinh</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
