import React, { useState, useMemo, useEffect } from 'react';
import { CubicCoefficients } from './types';
import { analyzeCubic } from './mathEngine';
import { CoefficientInput } from './components/CoefficientInput';
import { SurveyResults } from './components/SurveyResults';
import { CubicGraph } from './components/CubicGraph';
import { VariationTable } from './components/VariationTable';
import { CubicSimulationPanel } from './components/CubicSimulationPanel';
import { MathExplanation } from './components/MathExplanation';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { DashboardView } from './components/DashboardView';
import { OxyzLab } from './components/OxyzLab';
import { PracticeView } from './components/PracticeView';
import { FormulaHandbook } from './components/FormulaHandbook';
import { SearchModal } from './components/SearchModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { WelcomeGate } from './components/WelcomeGate';
import { StudentProfile, DEFAULT_STUDENT_PROFILE } from './types/student';
import {
  FunctionSquare,
  Sparkles,
  Info,
  GraduationCap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const STORAGE_PROFILE_KEY = 'edumath_student_profile';
const STORAGE_REGISTERED_KEY = 'edumath_student_registered';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Student Profile state loaded from localStorage
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name && parsed?.className) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved profile:', e);
    }
    return DEFAULT_STUDENT_PROFILE;
  });

  // User must register name & class upon first entering the website
  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    try {
      const hasRegistered = localStorage.getItem(STORAGE_REGISTERED_KEY);
      const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (hasRegistered === 'true' && savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed?.name?.trim() && parsed?.className?.trim()) {
          return true;
        }
      }
    } catch (e) {
      console.error('Failed to read registration state:', e);
    }
    return false;
  });

  const handleRegisterComplete = (newProfile: StudentProfile) => {
    setStudentProfile(newProfile);
    setIsRegistered(true);
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
      localStorage.setItem(STORAGE_REGISTERED_KEY, 'true');
    } catch (e) {
      console.error('Failed to save registration state:', e);
    }
  };

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setStudentProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
  };

  const handleLogout = () => {
    setIsRegistered(false);
    try {
      localStorage.removeItem(STORAGE_REGISTERED_KEY);
    } catch (e) {
      console.error('Failed to clear registration state:', e);
    }
  };

  // Default cubic coefficients for Cubic Lab A: y = x^3 - 3x^2 + 2
  const [coefficients, setCoefficients] = useState<CubicCoefficients>({
    a: 1,
    b: -3,
    c: 0,
    d: 2
  });

  const analysis = useMemo(() => {
    return analyzeCubic(coefficients);
  }, [coefficients]);

  const handleUpdateCoefficients = (newCoeffs: CubicCoefficients) => {
    setCoefficients(newCoeffs);
  };

  // 1. MANDATORY WELCOME GATE: Users must enter Name and Class before using
  if (!isRegistered) {
    return <WelcomeGate onComplete={handleRegisterComplete} />;
  }

  // 2. FULL APPLICATION WORKSPACE
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. SIDEBAR NAVIGATION */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        profile={studentProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR */}
        <TopNavbar
          currentTab={currentTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenFormulas={() => setCurrentTab('formulas')}
          onOpenPractice={() => setCurrentTab('practice')}
          profile={studentProfile}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
        />

        {/* MAIN BODY PER TAB */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
          {/* TAB 1: DASHBOARD */}
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenFormulas={() => setCurrentTab('formulas')}
              onOpenPractice={() => setCurrentTab('practice')}
              profile={studentProfile}
              onOpenProfileModal={() => setIsProfileModalOpen(true)}
            />
          )}

          {/* TAB 2: CUBIC LAB A (Flagship Interactive Lab) */}
          {currentTab === 'cubic-lab' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top Bar for Cubic Lab */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                    <FunctionSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        CUBIC LAB A – Khảo Sát Hàm Số Bậc Ba
                      </h2>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        y = ax³ + bx² + cx + d (a ≠ 0)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Nhập tùy ý các hệ số để tự động tính đạo hàm, cực trị, tâm đối xứng, bảng biến thiên và vẽ đồ thị Oxy.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-mono border border-slate-200">
                    <span className="text-slate-400">Trạng thái:</span>
                    <span className="font-semibold text-blue-700">
                      {analysis.isValid
                        ? analysis.hasExtrema
                          ? '2 Cực trị (Δ\' > 0)'
                          : analysis.extremaCase === 'single_root'
                          ? 'Nghiệm kép (Δ\' = 0)'
                          : 'Đơn điệu trên ℝ (Δ\' < 0)'
                        : 'Hệ số a = 0 (Không hợp lệ)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* BẢNG ĐIỀU KHIỂN MÔ PHỎNG TRỰC QUAN HÀM SỐ BẬC BA */}
              <CubicSimulationPanel
                coefficients={coefficients}
                onUpdateCoefficients={handleUpdateCoefficients}
                analysis={analysis}
              />

              {/* 2-Column Primary Interactive Studio */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Column 1: Coefficient Inputs & Variation Table */}
                <div className="lg:col-span-5 space-y-6 order-1">
                  {/* Coefficient Inputs */}
                  <CoefficientInput
                    initialValues={coefficients}
                    onCalculate={handleUpdateCoefficients}
                    isInvalidA={!analysis.isValid}
                  />

                  {/* Variation Table on Desktop */}
                  <div className="hidden lg:block">
                    <VariationTable analysis={analysis} />
                  </div>
                </div>

                {/* Column 2: Prominent Interactive Cubic Graph */}
                <div className="lg:col-span-7 space-y-6 order-2 lg:sticky lg:top-20">
                  <div className="h-[460px] sm:h-[520px] lg:h-[560px]">
                    <CubicGraph analysis={analysis} />
                  </div>

                  {/* Variation Table on Mobile (shown right after Graph) */}
                  <div className="block lg:hidden">
                    <VariationTable analysis={analysis} />
                  </div>
                </div>
              </div>

              {/* Comprehensive Pedagogical Survey & Explanations */}
              <div className="space-y-6 pt-2">
                {/* Comprehensive Results */}
                <SurveyResults analysis={analysis} />

                {/* Mathematical Pedagogical Explanations */}
                <MathExplanation analysis={analysis} />
              </div>
            </div>
          )}

          {/* TAB 3: OXYZ 3D SPATIAL LAB */}
          {currentTab === 'oxyz' && (
            <div className="animate-fadeIn">
              <OxyzLab />
            </div>
          )}

          {/* TAB 4: PRACTICE EXERCISES */}
          {currentTab === 'practice' && (
            <div className="animate-fadeIn">
              <PracticeView />
            </div>
          )}

          {/* TAB 5: FORMULA HANDBOOK */}
          {currentTab === 'formulas' && (
            <div className="animate-fadeIn">
              <FormulaHandbook />
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-slate-200/80 mt-12 py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                C³
              </div>
              <span className="font-bold text-slate-800">EduMath 12 • Cubic Lab A</span>
              <span>•</span>
              <span>Website học tập & luyện thi THPT Quốc Gia</span>
            </div>

            <div className="text-slate-400 text-[11px]">
              Đang học: <strong className="text-slate-700">{studentProfile.name}</strong> (Lớp {studentProfile.className}) • Mục tiêu: {studentProfile.targetScore} điểm
            </div>
          </div>
        </footer>
      </div>

      {/* SEARCH COMMAND PALETTE MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* STUDENT PROFILE (NAME & CLASS) MODAL */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={studentProfile}
        onSaveProfile={handleSaveProfile}
        onLogout={handleLogout}
      />
    </div>
  );
}
