export interface Topic {
  id: string;
  title: string;
  category: 'Giải tích' | 'Hình học' | 'Đại số' | 'Xác suất';
  chapter: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  totalExercises: number;
  completedExercises: number;
  badge: 'Trọng tâm THPT' | 'Vận dụng cao' | 'Nền tảng' | 'Dạng toán mới';
  badgeColor: string;
  iconName: string;
  keyConcepts: string[];
}

export interface PracticeQuestion {
  id: number;
  topicId: string;
  topicName: string;
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  question: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  formulaNote?: string;
}

export interface FormulaItem {
  id: string;
  category: string;
  title: string;
  formula: string;
  meaning: string;
  example?: string;
}

export const GRADE_12_TOPICS: Topic[] = [
  {
    id: 'cubic-lab',
    title: 'Khảo sát Hàm số Bậc Ba (Cubic Lab)',
    category: 'Giải tích',
    chapter: 'Chương 1: Ứng dụng đạo hàm',
    description: 'Nghiên cứu hình dạng đồ thị y = ax³ + bx² + cx + d, 3 trường hợp biệt thức Δ\', điểm uốn I là tâm đối xứng.',
    progress: 92,
    totalLessons: 6,
    completedLessons: 6,
    totalExercises: 35,
    completedExercises: 32,
    badge: 'Trọng tâm THPT',
    badgeColor: 'blue',
    iconName: 'FunctionSquare',
    keyConcepts: ['Phân loại Δ\' = b² - 3ac', 'Hai điểm cực trị A, B', 'Tâm đối xứng I(-b/3a; f(-b/3a))', 'Bảng biến thiên']
  },
  {
    id: 'derivatives',
    title: 'Đạo hàm & Cực trị Hàm số',
    category: 'Giải tích',
    chapter: 'Chương 1: Ứng dụng đạo hàm',
    description: 'Tính đơn điệu, cực trị, giá trị lớn nhất - nhỏ nhất, đường tiệm cận ngang, tiệm cận đứng và tiệm cận xiên.',
    progress: 85,
    totalLessons: 8,
    completedLessons: 7,
    totalExercises: 48,
    completedExercises: 41,
    badge: 'Trọng tâm THPT',
    badgeColor: 'indigo',
    iconName: 'TrendingUp',
    keyConcepts: ['Dấu đạo hàm cấp một', 'Cực đại & cực tiểu', 'GTLN - GTNN trên đoạn', 'Đường tiệm cận']
  },
  {
    id: 'oxyz',
    title: 'Phương pháp Toạ độ Oxyz',
    category: 'Hình học',
    chapter: 'Chương 2: Tọa độ trong không gian',
    description: 'Hệ toạ độ Oxyz, tích có hướng của hai vectơ, phương trình mặt phẳng, đường thẳng và mặt cầu trong không gian.',
    progress: 78,
    totalLessons: 9,
    completedLessons: 7,
    totalExercises: 54,
    completedExercises: 42,
    badge: 'Trọng tâm THPT',
    badgeColor: 'emerald',
    iconName: 'Boxes',
    keyConcepts: ['Tích có hướng [u, v]', 'Mặt phẳng: Ax + By + Cz + D = 0', 'Khoảng cách điểm tới mp', 'Mặt cầu (S)']
  },
  {
    id: 'logarithm',
    title: 'Hàm số Luỹ thừa, Mũ & Logarit',
    category: 'Đại số',
    chapter: 'Chương 2: Mũ và Logarit',
    description: 'Quy tắc biến đổi logarit, tập xác định, đồ thị hàm số mũ - logarit, phương trình và bất phương trình chứa tham số m.',
    progress: 74,
    totalLessons: 6,
    completedLessons: 4,
    totalExercises: 38,
    completedExercises: 28,
    badge: 'Vận dụng cao',
    badgeColor: 'amber',
    iconName: 'Sigma',
    keyConcepts: ['Đạo hàm (a^x)\' = a^x·ln a', 'Logarit tích, thương, luỹ thừa', 'Phương pháp đặt ẩn phụ', 'Bất phương trình']
  },
  {
    id: 'probability',
    title: 'Xác suất & Thống kê 12',
    category: 'Xác suất',
    chapter: 'Chương 4: Thống kê & Xác suất',
    description: 'Xác suất có điều kiện, công thức xác suất toàn phần, công thức Bayes, phương sai và độ lệch chuẩn mẫu ghép nhóm.',
    progress: 58,
    totalLessons: 5,
    completedLessons: 3,
    totalExercises: 30,
    completedExercises: 17,
    badge: 'Dạng toán mới',
    badgeColor: 'rose',
    iconName: 'PieChart',
    keyConcepts: ['P(A|B) = P(AB)/P(B)', 'Công thức xác suất toàn phần', 'Công thức Bayes', 'Bảng tần số ghép nhóm']
  }
];

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 1,
    topicId: 'cubic-lab',
    topicName: 'Khảo sát hàm số bậc ba',
    level: 'Thông hiểu',
    question: 'Cho hàm số y = x³ - 3x² + 2. Toạ độ điểm uốn (tâm đối xứng của đồ thị) là:',
    options: [
      { key: 'A', text: 'I(1; 0)' },
      { key: 'B', text: 'I(2; -2)' },
      { key: 'C', text: 'I(0; 2)' },
      { key: 'D', text: 'I(-1; -2)' }
    ],
    correctAnswer: 'A',
    explanation: 'Hàm số có y\' = 3x² - 6x, y\'\' = 6x - 6. Giải y\'\' = 0 ⇔ 6x - 6 = 0 ⇔ x = 1. Thay x = 1 vào y ta được y(1) = 1³ - 3(1)² + 2 = 0. Do đó điểm uốn I(1; 0) chính là tâm đối xứng của đồ thị.',
    formulaNote: 'Hoành độ tâm đối xứng: x_I = -b / (3a)'
  },
  {
    id: 2,
    topicId: 'cubic-lab',
    topicName: 'Khảo sát hàm số bậc ba',
    level: 'Vận dụng',
    question: 'Tìm tất cả các giá trị của tham số m để hàm số y = x³ - 3mx² + 3(m² - 1)x + 1 có hai điểm cực trị:',
    options: [
      { key: 'A', text: 'm ∈ ℝ (mọi m)' },
      { key: 'B', text: 'm > 1 hoặc m < -1' },
      { key: 'C', text: 'm = 0' },
      { key: 'D', text: '-1 < m < 1' }
    ],
    correctAnswer: 'A',
    explanation: 'Ta có y\' = 3x² - 6mx + 3(m² - 1). Để hàm số có 2 điểm cực trị thì y\' = 0 phải có 2 nghiệm phân biệt, tức là Δ\' = (-3m)² - 3 · 3(m² - 1) = 9m² - 9m² + 9 = 9 > 0. Biệt thức Δ\' = 9 luôn dương với mọi m ∈ ℝ. Do đó hàm số luôn có 2 cực trị với mọi giá trị của m.',
    formulaNote: 'Hàm bậc ba có 2 cực trị ⇔ Δ\'_y\' > 0'
  },
  {
    id: 3,
    topicId: 'derivatives',
    topicName: 'Giá trị lớn nhất - nhỏ nhất',
    level: 'Thông hiểu',
    question: 'Giá trị lớn nhất của hàm số f(x) = x³ - 3x + 2 trên đoạn [0; 2] bằng:',
    options: [
      { key: 'A', text: 'max f(x) = 4' },
      { key: 'B', text: 'max f(x) = 2' },
      { key: 'C', text: 'max f(x) = 0' },
      { key: 'D', text: 'max f(x) = 6' }
    ],
    correctAnswer: 'A',
    explanation: 'Ta có f\'(x) = 3x² - 3. Cho f\'(x) = 0 ⇔ 3x² = 3 ⇔ x = 1 (nhận vì x ∈ [0; 2]) hoặc x = -1 (loại). Tính các giá trị: f(0) = 2; f(1) = 1 - 3 + 2 = 0; f(2) = 8 - 6 + 2 = 4. Do đó giá trị lớn nhất trên đoạn [0; 2] là 4 tại x = 2.',
    formulaNote: 'So sánh giá trị f(a), f(b) và f(xᵢ) với xᵢ là nghiệm đạo hàm trên [a; b]'
  },
  {
    id: 4,
    topicId: 'oxyz',
    topicName: 'Hình học toạ độ Oxyz',
    level: 'Nhận biết',
    question: 'Trong không gian Oxyz, vectơ nào dưới đây là một vectơ pháp tuyến của mặt phẳng (P): 2x - 3y + z - 5 = 0?',
    options: [
      { key: 'A', text: 'n⃗ = (2; -3; 1)' },
      { key: 'B', text: 'n⃗ = (2; 3; 1)' },
      { key: 'C', text: 'n⃗ = (2; -3; -5)' },
      { key: 'D', text: 'n⃗ = (-2; -3; 1)' }
    ],
    correctAnswer: 'A',
    explanation: 'Mặt phẳng có dạng tổng quát Ax + By + Cz + D = 0 thì vectơ pháp tuyến n⃗ = (A; B; C). Với (P): 2x - 3y + z - 5 = 0, ta có n⃗ = (2; -3; 1).',
    formulaNote: 'Mặt phẳng Ax + By + Cz + D = 0 có VTPT n⃗ = (A; B; C)'
  },
  {
    id: 5,
    topicId: 'logarithm',
    topicName: 'Hàm số Mũ & Logarit',
    level: 'Thông hiểu',
    question: 'Tập xác định D của hàm số y = log₂(2x - 4) là:',
    options: [
      { key: 'A', text: 'D = (2; +∞)' },
      { key: 'B', text: 'D = [2; +∞)' },
      { key: 'C', text: 'D = ℝ \\ {2}' },
      { key: 'D', text: 'D = (-∞; 2)' }
    ],
    correctAnswer: 'A',
    explanation: 'Hàm số logarit y = log_a(u(x)) xác định khi và chỉ khi biểu thức dưới dấu logarit dương: u(x) > 0. Ta có: 2x - 4 > 0 ⇔ 2x > 4 ⇔ x > 2. Vậy tập xác định là D = (2; +∞).',
    formulaNote: 'Điều kiện xác định log_a(u): u > 0 (với a > 0, a ≠ 1)'
  }
];

export const FORMULA_HANDBOOK: FormulaItem[] = [
  {
    id: 'f1',
    category: 'Giải tích - Đạo hàm',
    title: 'Đạo hàm hàm đa thức bậc ba',
    formula: 'y = ax³ + bx² + cx + d  ⇒  y\' = 3ax² + 2bx + c',
    meaning: 'Phương trình y\' = 0 có biệt thức thu gọn Δ\' = b² - 3ac quyết định số cực trị của hàm số.',
    example: 'y = x³ - 3x² + 2 ⇒ y\' = 3x² - 6x, Δ\' = (-3)² - 3(1)(0) = 9 > 0 (2 cực trị)'
  },
  {
    id: 'f2',
    category: 'Giải tích - Đạo hàm',
    title: 'Đường tiệm cận ngang và tiệm cận đứng',
    formula: 'Tiệm cận đứng: x = x₀ nếu lim (x→x₀) y = ±∞;  Tiệm cận ngang: y = y₀ nếu lim (x→±∞) y = y₀',
    meaning: 'Xác định đường tiệm cận của đồ thị hàm phân thức y = (ax + b) / (cx + d) và hàm số giải tích.',
    example: 'y = (2x + 1)/(x - 1) ⇒ TCĐ: x = 1; TCN: y = 2'
  },
  {
    id: 'f3',
    category: 'Giải tích - Đạo hàm',
    title: 'Toạ độ tâm đối xứng đồ thị bậc ba',
    formula: 'x_I = -b / (3a),  y_I = f(x_I)',
    meaning: 'Điểm uốn I(x_I, y_I) là nghiệm của phương trình đạo hàm cấp hai y\'\' = 0 và là tâm đối xứng của toàn bộ đồ thị.',
    example: 'y = 2x³ - 6x² + 1 ⇒ x_I = -(-6)/(3*2) = 1, y_I = 2(1) - 6(1) + 1 = -3 ⇒ I(1; -3)'
  },
  {
    id: 'f4',
    category: 'Đại số - Mũ & Logarit',
    title: 'Công thức đạo hàm Mũ & Logarit',
    formula: '(eˣ)\' = eˣ;  (aˣ)\' = aˣ·ln a;  (ln x)\' = 1/x;  (logₐ x)\' = 1 / (x·ln a)',
    meaning: 'Bảng đạo hàm của các hàm số luỹ thừa, mũ và logarit cơ bản với a > 0, a ≠ 1.',
    example: '(2ˣ)\' = 2ˣ·ln 2;  (ln(3x + 1))\' = 3 / (3x + 1)'
  },
  {
    id: 'f5',
    category: 'Đại số - Mũ & Logarit',
    title: 'Các tính chất biến đổi logarit',
    formula: 'logₐ(x·y) = logₐ x + logₐ y;  logₐ(x/y) = logₐ x - logₐ y;  logₐ(xᵃ) = α·logₐ x',
    meaning: 'Quy tắc đưa tích, thương, luỹ thừa về tổng, hiệu các logarit cùng cơ số.',
    example: 'log₂(8·x) = log₂ 8 + log₂ x = 3 + log₂ x'
  },
  {
    id: 'f6',
    category: 'Hình học Oxyz',
    title: 'Khoảng cách từ điểm M₀ tới mặt phẳng (α)',
    formula: 'd(M₀, (α)) = |A x₀ + B y₀ + C z₀ + D| / √(A² + B² + C²)',
    meaning: 'Đo khoảng cách vuông góc từ điểm M₀(x₀, y₀, z₀) tới mặt phẳng (α): Ax + By + Cz + D = 0.',
    example: 'M(1; 2; 3) tới (P): x + 2y - 2z + 5 = 0 ⇒ d = |1 + 4 - 6 + 5| / √(1 + 4 + 4) = 4/3'
  },
  {
    id: 'f7',
    category: 'Hình học Oxyz',
    title: 'Phương trình mặt cầu tâm I, bán kính R',
    formula: '(x - a)² + (y - b)² + (z - c)² = R²',
    meaning: 'Tâm I(a, b, c) và bán kính R > 0. Dạng khai triển: x² + y² + z² - 2ax - 2by - 2cz + d = 0 với R = √(a² + b² + c² - d).',
    example: 'Tâm I(1, -2, 3), R = 4 ⇒ (x - 1)² + (y + 2)² + (z - 3)² = 16'
  },
  {
    id: 'f8',
    category: 'Xác suất 12',
    title: 'Công thức xác suất có điều kiện & Công thức Bayes',
    formula: 'P(A|B) = P(A ∩ B) / P(B) ;  P(Aᵢ|B) = [P(Aᵢ)·P(B|Aᵢ)] / ∑ [P(Aₖ)·P(B|Aₖ)]',
    meaning: 'Tính xác suất của biến cố A khi biết biến cố B đã xảy ra.',
    example: 'Dùng trong xét nghiệm y tế, phân loại thư rác, chẩn đoán xác suất.'
  }
];
