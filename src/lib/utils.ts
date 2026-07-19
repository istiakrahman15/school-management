import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, fmt = "MMM dd, yyyy") {
  if (!date) return "N/A";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, fmt);
}

export function formatCurrency(amount: number, currency = "BDT") {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: currency === "BDT" ? "BDT" : currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function calculateGrade(
  marks: number,
  maxMarks: number
): { grade: string; gpa: number } {
  const percentage = (marks / maxMarks) * 100;

  if (percentage >= 80) return { grade: "A+", gpa: 5.0 };
  if (percentage >= 70) return { grade: "A", gpa: 4.0 };
  if (percentage >= 60) return { grade: "B+", gpa: 3.5 };
  if (percentage >= 50) return { grade: "B", gpa: 3.0 };
  if (percentage >= 40) return { grade: "C+", gpa: 2.5 };
  if (percentage >= 33) return { grade: "C", gpa: 2.0 };
  return { grade: "F", gpa: 0.0 };
}

export function generateStudentId(sequence: number): string {
  const year = new Date().getFullYear();
  return `STU-${year}-${String(sequence).padStart(4, "0")}`;
}

export function generateTeacherId(sequence: number): string {
  return `TCH-${String(sequence).padStart(3, "0")}`;
}

export function generateInvoiceNo(): string {
  const now = new Date();
  const timestamp = now.getTime().toString(36).toUpperCase();
  return `INV-${timestamp}`;
}

export function getAttendancePercentage(present: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(text: string, length = 50): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "text-green-500",
    inactive: "text-gray-500",
    pending: "text-yellow-500",
    paid: "text-green-500",
    overdue: "text-red-500",
    present: "text-green-500",
    absent: "text-red-500",
    late: "text-yellow-500",
    passed: "text-green-500",
    failed: "text-red-500",
    upcoming: "text-blue-500",
    completed: "text-gray-500",
  };
  return colors[status.toLowerCase()] || "text-gray-500";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
