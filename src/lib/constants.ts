import type { NavItem } from "@/types";

export const APP_NAME = "SmartSchool OS";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION =
  "A modern, open-source school management system for the digital age.";

export const ACADEMIC_YEARS = [
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export const RELIGIONS = ["Islam", "Hinduism", "Christianity", "Buddhism", "Others"];

export const GENDERS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export const GRADE_POINTS: Record<string, number> = {
  "A+": 5.0,
  A: 4.0,
  "B+": 3.5,
  B: 3.0,
  "C+": 2.5,
  C: 2.0,
  D: 1.0,
  F: 0.0,
};

export const FEE_TYPES = [
  { label: "Tuition", value: "tuition" },
  { label: "Admission", value: "admission" },
  { label: "Exam", value: "exam" },
  { label: "Transport", value: "transport" },
  { label: "Hostel", value: "hostel" },
  { label: "Other", value: "other" },
];

export const PAYMENT_METHODS = [
  { label: "Cash", value: "cash", icon: "💵" },
  { label: "bKash", value: "bkash", icon: "📱" },
  { label: "Nagad", value: "nagad", icon: "📲" },
  { label: "Bank Transfer", value: "bank_transfer", icon: "🏦" },
  { label: "Cheque", value: "cheque", icon: "📝" },
];

export const EXAM_TYPES = [
  { label: "Unit Test", value: "unit_test" },
  { label: "Mid Term", value: "mid_term" },
  { label: "Final Exam", value: "final" },
  { label: "Assignment", value: "assignment" },
  { label: "Quiz", value: "quiz" },
];

export const DAYS_OF_WEEK = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["admin", "teacher", "student", "parent"],
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: "GraduationCap",
    roles: ["admin", "teacher"],
  },
  {
    title: "Teachers",
    href: "/dashboard/teachers",
    icon: "Users",
    roles: ["admin"],
  },
  {
    title: "Classes",
    href: "/dashboard/classes",
    icon: "BookOpen",
    roles: ["admin", "teacher"],
  },
  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: "CalendarCheck",
    roles: ["admin", "teacher"],
  },
  {
    title: "Exams",
    href: "/dashboard/exams",
    icon: "ClipboardList",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Fees",
    href: "/dashboard/fees",
    icon: "CreditCard",
    roles: ["admin"],
  },
  {
    title: "Notices",
    href: "/dashboard/notices",
    icon: "Bell",
    roles: ["admin", "teacher", "student", "parent"],
  },
  {
    title: "Library",
    href: "/dashboard/library",
    icon: "Library",
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Transport",
    href: "/dashboard/transport",
    icon: "Bus",
    roles: ["admin"],
  },
  {
    title: "Hostel",
    href: "/dashboard/hostel",
    icon: "Building2",
    roles: ["admin"],
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: "BarChart3",
    roles: ["admin"],
  },
];

export const ITEMS_PER_PAGE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const LIBRARY_FINE_PER_DAY = 5; // BDT per day
export const DEFAULT_DUE_DAYS = 14; // Library book due in 14 days
