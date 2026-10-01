export interface CubicCoefficients {
  a: number;
  b: number;
  c: number;
  d: number;
}

export type ExtremaCase = 'two_extrema' | 'single_root' | 'no_extrema';

export interface Point2D {
  x: number;
  y: number;
  label?: string;
  type: 'cuc_dai' | 'cuc_tieu' | 'tam_doi_xung' | 'giao_ox' | 'giao_oy' | 'diem_uon';
  description?: string;
}

export interface MonotonicityInterval {
  from: string; // e.g. "-\\infty", "1", "2"
  to: string;   // e.g. "1", "2", "+\\infty"
  fromVal: number;
  toVal: number;
  type: 'dong_bien' | 'nghich_bien';
  sign: '+' | '-';
}

export interface VariationTableEntry {
  xValues: { val: number | string; label: string; isInf?: boolean }[];
  derivativeSigns: { sign: '+' | '-' | '0'; intervalLabel?: string }[];
  yValues: {
    type: 'val' | 'pos_inf' | 'neg_inf';
    val?: number;
    label: string;
    position: 'top' | 'middle' | 'bottom';
  }[];
}

export interface CubicAnalysis {
  isValid: boolean;
  errorMessage?: string;
  coefficients: CubicCoefficients;
  
  // Math expressions
  functionFormulaLatex: string;
  derivativeFormulaLatex: string;
  secondDerivativeFormulaLatex: string;
  
  // Derivative & Discriminant
  deltaPrime: number;
  deltaPrimeLatex: string;
  extremaCase: ExtremaCase;
  derivativeRoots: number[];
  
  // Extrema
  hasExtrema: boolean;
  localMax?: { x: number; y: number };
  localMin?: { x: number; y: number };
  extremaExplanation: string;
  
  // Monotonicity
  intervals: MonotonicityInterval[];
  monotonicityExplanation: string;
  
  // Limits
  limitPosInf: '+\\infty' | '-\\infty';
  limitNegInf: '+\\infty' | '-\\infty';
  limitExplanation: string;
  
  // Intercepts
  yIntercept: { x: number; y: number };
  xIntercepts: { root: number; multiplicity: number; isApprox?: boolean }[];
  xInterceptExplanation: string;
  
  // Symmetry center / inflection point
  inflectionPoint: { x: number; y: number };
  inflectionExplanation: string;
  
  // Detailed step explanations for Section 5 & 6
  stepByStepNotes: {
    step: string;
    title: string;
    latex?: string;
    content: string;
  }[];
  
  // All critical points for graph markers
  specialPoints: Point2D[];
}
