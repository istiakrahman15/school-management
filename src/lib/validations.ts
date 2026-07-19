import { z } from "zod";

// ============================================================
// Auth Validations
// ============================================================

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "teacher", "student", "parent"]).default("admin"),
});

// ============================================================
// Student Validations
// ============================================================

export const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  classId: z.number({ message: "Class is required" }),
  sectionId: z.number().optional(),
  rollNo: z.number().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  bloodGroup: z.string().optional(),
  religion: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  admissionDate: z.string().optional(),
  admissionNo: z.string().optional(),
  previousSchool: z.string().optional(),
  // Parent/Guardian
  parentName: z.string().min(2, "Guardian name required"),
  parentPhone: z.string().min(10, "Valid phone number required"),
  parentRelationship: z.enum(["father", "mother", "guardian"]).default("father"),
  parentEmail: z.string().email().optional().or(z.literal("")),
  parentOccupation: z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;

// ============================================================
// Teacher Validations
// ============================================================

export const teacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.string().optional(),
  qualification: z.string().optional(),
  specialization: z.string().optional(),
  joiningDate: z.string().optional(),
  salary: z.number().min(0).default(0),
  designation: z.string().optional(),
  department: z.string().optional(),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;

// ============================================================
// Class Validations
// ============================================================

export const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  section: z.string().optional(),
  classTeacherId: z.number().optional(),
  academicYear: z.string().min(4, "Academic year is required"),
  capacity: z.number().min(1).default(40),
});

export const subjectSchema = z.object({
  name: z.string().min(2, "Subject name required"),
  code: z.string().optional(),
  classId: z.number().optional(),
  teacherId: z.number().optional(),
  isElective: z.boolean().default(false),
});

// ============================================================
// Attendance Validations
// ============================================================

export const attendanceSchema = z.object({
  date: z.string(),
  classId: z.number(),
  records: z.array(
    z.object({
      studentId: z.number(),
      status: z.enum(["present", "absent", "late", "half_day", "leave"]),
      note: z.string().optional(),
    })
  ),
});

// ============================================================
// Exam Validations
// ============================================================

export const examSchema = z.object({
  name: z.string().min(2, "Exam name required"),
  type: z.enum(["unit_test", "mid_term", "final", "assignment", "quiz"]).default("unit_test"),
  classId: z.number({ message: "Class is required" }),
  subjectId: z.number().optional(),
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  maxMarks: z.number().min(1).default(100),
  passMarks: z.number().min(1).default(33),
  instructions: z.string().optional(),
});

// ============================================================
// Fee Validations
// ============================================================

export const feeStructureSchema = z.object({
  name: z.string().min(2, "Fee name required"),
  amount: z.number().min(0, "Amount must be positive"),
  type: z.enum(["tuition", "admission", "exam", "transport", "hostel", "other"]),
  classId: z.number().optional(),
  frequency: z.enum(["monthly", "quarterly", "yearly", "one_time"]).default("monthly"),
  dueDay: z.number().min(1).max(31).default(10),
  academicYear: z.string().optional(),
});

export const paymentSchema = z.object({
  studentId: z.number(),
  feeId: z.number().optional(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  method: z.enum(["cash", "bkash", "nagad", "bank_transfer", "cheque"]),
  transactionId: z.string().optional(),
  note: z.string().optional(),
});

// ============================================================
// Notice Validations
// ============================================================

export const noticeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  audience: z.enum(["all", "students", "teachers", "parents", "admin"]).default("all"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

// ============================================================
// Library Validations
// ============================================================

export const bookSchema = z.object({
  title: z.string().min(2, "Title required"),
  author: z.string().optional(),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  edition: z.string().optional(),
  category: z.string().optional(),
  totalQuantity: z.number().min(1).default(1),
  location: z.string().optional(),
  publishYear: z.string().optional(),
});

export const libraryTransactionSchema = z.object({
  bookId: z.number({ message: "Book is required" }),
  studentId: z.number().optional(),
  teacherId: z.number().optional(),
  type: z.enum(["issue", "return"]),
  dueDate: z.string().optional(),
  note: z.string().optional(),
});
