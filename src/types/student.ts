export interface StudentProfile {
  name: string;
  className: string;
  school: string;
  targetScore: number;
  examGroup: string;
}

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: 'Nguyễn Tuấn Anh',
  className: '12A1',
  school: 'THPT Chuyên',
  targetScore: 9.4,
  examGroup: 'Khối A00 (Toán - Lý - Hóa)'
};

export const getStudentInitials = (name: string): string => {
  if (!name || !name.trim()) return 'HS';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (first + last).toUpperCase();
};
