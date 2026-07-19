import {
  sqliteTable,
  text,
  integer,
  real,
  blob,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ============================================================
// USERS & ROLES
// ============================================================

export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", {
    enum: ["admin", "teacher", "student", "parent"],
  }).notNull(),
  permissions: text("permissions").default("{}"), // JSON string
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", {
    enum: ["admin", "teacher", "student", "parent"],
  }).notNull(),
  avatar: text("avatar"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================
// CLASSES & SECTIONS
// ============================================================

export const classes = sqliteTable("classes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // e.g., "Class 10"
  section: text("section"), // e.g., "A", "B"
  classTeacherId: integer("class_teacher_id").references(() => teachers.id),
  academicYear: text("academic_year").notNull(),
  capacity: integer("capacity").default(40),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sections = sqliteTable("sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  classId: integer("class_id")
    .notNull()
    .references(() => classes.id),
  name: text("name").notNull(), // A, B, C
  teacherId: integer("teacher_id").references(() => teachers.id),
  capacity: integer("capacity").default(40),
});

export const subjects = sqliteTable("subjects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  code: text("code"),
  classId: integer("class_id").references(() => classes.id),
  teacherId: integer("teacher_id").references(() => teachers.id),
  isElective: integer("is_elective", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================
// STUDENTS
// ============================================================

export const parents = sqliteTable("parents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  relationship: text("relationship", {
    enum: ["father", "mother", "guardian"],
  }).default("father"),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  occupation: text("occupation"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  studentId: text("student_id").notNull().unique(), // e.g., STU-2024-001
  name: text("name").notNull(),
  photo: text("photo"),
  classId: integer("class_id").references(() => classes.id),
  sectionId: integer("section_id").references(() => sections.id),
  rollNo: integer("roll_no"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender", { enum: ["male", "female", "other"] }),
  bloodGroup: text("blood_group"),
  religion: text("religion"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  phone: text("phone"),
  email: text("email"),
  parentId: integer("parent_id").references(() => parents.id),
  admissionDate: text("admission_date"),
  admissionNo: text("admission_no"),
  previousSchool: text("previous_school"),
  status: text("status", {
    enum: ["active", "inactive", "transferred", "graduated"],
  }).default("active"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================
// TEACHERS
// ============================================================

export const teachers = sqliteTable("teachers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  teacherId: text("teacher_id").notNull().unique(), // e.g., TCH-001
  name: text("name").notNull(),
  photo: text("photo"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  gender: text("gender", { enum: ["male", "female", "other"] }),
  dateOfBirth: text("date_of_birth"),
  qualification: text("qualification"),
  specialization: text("specialization"),
  joiningDate: text("joining_date"),
  salary: real("salary").default(0),
  designation: text("designation"),
  department: text("department"),
  status: text("status", { enum: ["active", "inactive"] }).default("active"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const teacherSubjects = sqliteTable("teacher_subjects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teacherId: integer("teacher_id")
    .notNull()
    .references(() => teachers.id),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id),
  classId: integer("class_id").references(() => classes.id),
});

// ============================================================
// ATTENDANCE
// ============================================================

export const attendance = sqliteTable("attendance", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type", { enum: ["student", "teacher"] }).notNull(),
  studentId: integer("student_id").references(() => students.id),
  teacherId: integer("teacher_id").references(() => teachers.id),
  classId: integer("class_id").references(() => classes.id),
  date: text("date").notNull(), // YYYY-MM-DD
  status: text("status", {
    enum: ["present", "absent", "late", "half_day", "leave"],
  }).notNull(),
  note: text("note"),
  markedBy: integer("marked_by").references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================
// EXAMS & RESULTS
// ============================================================

export const exams = sqliteTable("exams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // e.g., "Mid-Term 2024"
  type: text("type", {
    enum: ["unit_test", "mid_term", "final", "assignment", "quiz"],
  }).default("unit_test"),
  classId: integer("class_id").references(() => classes.id),
  subjectId: integer("subject_id").references(() => subjects.id),
  date: text("date"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  maxMarks: real("max_marks").default(100),
  passMarks: real("pass_marks").default(33),
  instructions: text("instructions"),
  status: text("status", {
    enum: ["upcoming", "ongoing", "completed"],
  }).default("upcoming"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const results = sqliteTable("results", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  examId: integer("exam_id")
    .notNull()
    .references(() => exams.id),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id),
  marksObtained: real("marks_obtained").default(0),
  grade: text("grade"), // A+, A, B+, B, C, D, F
  gpa: real("gpa").default(0),
  remarks: text("remarks"),
  isAbsent: integer("is_absent", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================
// FEES & PAYMENTS
// ============================================================

export const feeStructures = sqliteTable("fee_structures", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // e.g., "Monthly Tuition"
  amount: real("amount").notNull(),
  type: text("type", {
    enum: ["tuition", "admission", "exam", "transport", "hostel", "other"],
  }).default("tuition"),
  classId: integer("class_id").references(() => classes.id),
  frequency: text("frequency", {
    enum: ["monthly", "quarterly", "yearly", "one_time"],
  }).default("monthly"),
  dueDay: integer("due_day").default(10), // day of month
  academicYear: text("academic_year"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const fees = sqliteTable("fees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id),
  feeStructureId: integer("fee_structure_id").references(
    () => feeStructures.id
  ),
  amount: real("amount").notNull(),
  discount: real("discount").default(0),
  fine: real("fine").default(0),
  dueDate: text("due_date"),
  month: text("month"), // e.g., "2024-01"
  status: text("status", {
    enum: ["pending", "paid", "overdue", "waived"],
  }).default("pending"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  feeId: integer("fee_id").references(() => fees.id),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id),
  amount: real("amount").notNull(),
  method: text("method", {
    enum: ["cash", "bkash", "nagad", "bank_transfer", "cheque"],
  }).notNull(),
  transactionId: text("transaction_id"),
  invoiceNo: text("invoice_no"),
  paidAt: text("paid_at").default(sql`CURRENT_TIMESTAMP`),
  note: text("note"),
  receivedBy: integer("received_by").references(() => users.id),
});

// ============================================================
// NOTICES
// ============================================================

export const notices = sqliteTable("notices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  audience: text("audience", {
    enum: ["all", "students", "teachers", "parents", "admin"],
  }).default("all"),
  priority: text("priority", { enum: ["low", "medium", "high"] }).default(
    "medium"
  ),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  publishedAt: text("published_at"),
  expiresAt: text("expires_at"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================
// LIBRARY
// ============================================================

export const books = sqliteTable("books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author"),
  isbn: text("isbn"),
  publisher: text("publisher"),
  edition: text("edition"),
  category: text("category"),
  totalQuantity: integer("total_quantity").default(1),
  availableQuantity: integer("available_quantity").default(1),
  location: text("location"), // shelf/rack location
  coverImage: text("cover_image"),
  publishYear: text("publish_year"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const libraryTransactions = sqliteTable("library_transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookId: integer("book_id")
    .notNull()
    .references(() => books.id),
  studentId: integer("student_id").references(() => students.id),
  teacherId: integer("teacher_id").references(() => teachers.id),
  type: text("type", { enum: ["issue", "return"] }).notNull(),
  issuedAt: text("issued_at").default(sql`CURRENT_TIMESTAMP`),
  dueDate: text("due_date"),
  returnedAt: text("returned_at"),
  fine: real("fine").default(0),
  finePaid: integer("fine_paid", { mode: "boolean" }).default(false),
  note: text("note"),
});

// ============================================================
// TRANSPORT
// ============================================================

export const transportRoutes = sqliteTable("transport_routes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  routeName: text("route_name").notNull(),
  description: text("description"),
  vehicleNo: text("vehicle_no"),
  vehicleType: text("vehicle_type"),
  capacity: integer("capacity"),
  driverName: text("driver_name"),
  driverPhone: text("driver_phone"),
  driverLicense: text("driver_license"),
  monthlyFee: real("monthly_fee").default(0),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const studentTransport = sqliteTable("student_transport", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id),
  routeId: integer("route_id")
    .notNull()
    .references(() => transportRoutes.id),
  pickupPoint: text("pickup_point"),
  joiningDate: text("joining_date"),
  status: text("status", { enum: ["active", "inactive"] }).default("active"),
});

// ============================================================
// HOSTEL
// ============================================================

export const hostelRooms = sqliteTable("hostel_rooms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomNo: text("room_no").notNull().unique(),
  floor: integer("floor").default(1),
  type: text("type", {
    enum: ["single", "double", "triple", "dormitory"],
  }).default("double"),
  capacity: integer("capacity").default(2),
  occupied: integer("occupied").default(0),
  monthlyFee: real("monthly_fee").default(0),
  amenities: text("amenities"), // JSON
  status: text("status", { enum: ["available", "full", "maintenance"] }).default(
    "available"
  ),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const hostelAllocations = sqliteTable("hostel_allocations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: integer("room_id")
    .notNull()
    .references(() => hostelRooms.id),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id),
  joiningDate: text("joining_date"),
  leavingDate: text("leaving_date"),
  status: text("status", { enum: ["active", "inactive"] }).default("active"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================
// SETTINGS
// ============================================================

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value"),
  label: text("label"),
  group: text("group").default("general"),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================
// ACTIVITY LOG
// ============================================================

export const activityLogs = sqliteTable("activity_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  entity: text("entity"),
  entityId: integer("entity_id"),
  description: text("description"),
  ipAddress: text("ip_address"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================
// CLASS ROUTINES
// ============================================================

export const classRoutines = sqliteTable("class_routines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  classId: integer("class_id")
    .notNull()
    .references(() => classes.id),
  subjectId: integer("subject_id").references(() => subjects.id),
  teacherId: integer("teacher_id").references(() => teachers.id),
  day: text("day", {
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
  }).notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  room: text("room"),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type Teacher = typeof teachers.$inferSelect;
export type NewTeacher = typeof teachers.$inferInsert;
export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
export type Exam = typeof exams.$inferSelect;
export type Result = typeof results.$inferSelect;
export type Fee = typeof fees.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Notice = typeof notices.$inferSelect;
export type Book = typeof books.$inferSelect;
export type TransportRoute = typeof transportRoutes.$inferSelect;
export type HostelRoom = typeof hostelRooms.$inferSelect;
