// ============================================================
// Global TypeScript Types for SmartSchool OS
// ============================================================

export type Role = "admin" | "teacher" | "student" | "parent";

export type AttendanceStatus = "present" | "absent" | "late" | "half_day" | "leave";

export type PaymentMethod = "cash" | "bkash" | "nagad" | "bank_transfer" | "cheque";

export type Grade = "A+" | "A" | "B+" | "B" | "C" | "D" | "F";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendancePercentage: number;
  feesCollected: number;
  pendingFees: number;
  upcomingExams: number;
  publishedNotices: number;
}

export interface StudentWithDetails {
  id: number;
  studentId: string;
  name: string;
  photo?: string;
  className?: string;
  section?: string;
  rollNo?: number;
  gender?: string;
  phone?: string;
  email?: string;
  status: string;
  parentName?: string;
  parentPhone?: string;
  admissionDate?: string;
}

export interface TeacherWithDetails {
  id: number;
  teacherId: string;
  name: string;
  photo?: string;
  phone?: string;
  email?: string;
  qualification?: string;
  designation?: string;
  salary?: number;
  status: string;
  subjects?: string[];
  joiningDate?: string;
}

export interface AttendanceSummary {
  date: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

export interface FeeStatus {
  studentId: number;
  studentName: string;
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  overdueFees: number;
  lastPaymentDate?: string;
}

export interface ExamResult {
  studentId: number;
  studentName: string;
  rollNo?: number;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  isAbsent: boolean;
  remarks?: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  filter?: Record<string, string>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
  roles?: Role[];
}
