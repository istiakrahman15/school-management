/**
 * Database Seed Script
 * Run: npx tsx src/db/seed.ts
 *
 * Seeds demo data for all roles and modules.
 */

import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const db = new Database("local.db");
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CREATE TABLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin','teacher','student','parent')),
  avatar TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  section TEXT,
  class_teacher_id INTEGER,
  academic_year TEXT NOT NULL,
  capacity INTEGER DEFAULT 40,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  teacher_id INTEGER,
  capacity INTEGER DEFAULT 40
);

CREATE TABLE IF NOT EXISTS teachers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  teacher_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  photo TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  gender TEXT,
  date_of_birth TEXT,
  qualification TEXT,
  specialization TEXT,
  joining_date TEXT,
  salary REAL DEFAULT 0,
  designation TEXT,
  department TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT,
  class_id INTEGER,
  teacher_id INTEGER,
  is_elective INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT NOT NULL,
  relationship TEXT DEFAULT 'father',
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  occupation TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  student_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  photo TEXT,
  class_id INTEGER,
  section_id INTEGER,
  roll_no INTEGER,
  date_of_birth TEXT,
  gender TEXT,
  blood_group TEXT,
  religion TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  parent_id INTEGER,
  admission_date TEXT,
  admission_no TEXT,
  previous_school TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  student_id INTEGER,
  teacher_id INTEGER,
  class_id INTEGER,
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  marked_by INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'unit_test',
  class_id INTEGER,
  subject_id INTEGER,
  date TEXT,
  start_time TEXT,
  end_time TEXT,
  max_marks REAL DEFAULT 100,
  pass_marks REAL DEFAULT 33,
  instructions TEXT,
  status TEXT DEFAULT 'upcoming',
  created_by INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  marks_obtained REAL DEFAULT 0,
  grade TEXT,
  gpa REAL DEFAULT 0,
  remarks TEXT,
  is_absent INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fee_structures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT DEFAULT 'tuition',
  class_id INTEGER,
  frequency TEXT DEFAULT 'monthly',
  due_day INTEGER DEFAULT 10,
  academic_year TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  fee_structure_id INTEGER,
  amount REAL NOT NULL,
  discount REAL DEFAULT 0,
  fine REAL DEFAULT 0,
  due_date TEXT,
  month TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fee_id INTEGER,
  student_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  method TEXT NOT NULL,
  transaction_id TEXT,
  invoice_no TEXT,
  paid_at TEXT DEFAULT CURRENT_TIMESTAMP,
  note TEXT,
  received_by INTEGER
);

CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  audience TEXT DEFAULT 'all',
  priority TEXT DEFAULT 'medium',
  is_published INTEGER DEFAULT 0,
  published_at TEXT,
  expires_at TEXT,
  created_by INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT,
  isbn TEXT,
  publisher TEXT,
  edition TEXT,
  category TEXT,
  total_quantity INTEGER DEFAULT 1,
  available_quantity INTEGER DEFAULT 1,
  location TEXT,
  cover_image TEXT,
  publish_year TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS library_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER NOT NULL,
  student_id INTEGER,
  teacher_id INTEGER,
  type TEXT NOT NULL,
  issued_at TEXT DEFAULT CURRENT_TIMESTAMP,
  due_date TEXT,
  returned_at TEXT,
  fine REAL DEFAULT 0,
  fine_paid INTEGER DEFAULT 0,
  note TEXT
);

CREATE TABLE IF NOT EXISTS transport_routes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  route_name TEXT NOT NULL,
  description TEXT,
  vehicle_no TEXT,
  vehicle_type TEXT,
  capacity INTEGER,
  driver_name TEXT,
  driver_phone TEXT,
  driver_license TEXT,
  monthly_fee REAL DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hostel_rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_no TEXT NOT NULL UNIQUE,
  floor INTEGER DEFAULT 1,
  type TEXT DEFAULT 'double',
  capacity INTEGER DEFAULT 2,
  occupied INTEGER DEFAULT 0,
  monthly_fee REAL DEFAULT 0,
  amenities TEXT,
  status TEXT DEFAULT 'available',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hostel_allocations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  joining_date TEXT,
  leaving_date TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  label TEXT,
  grp TEXT DEFAULT 'general',
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id INTEGER,
  description TEXT,
  ip_address TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teacher_subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  class_id INTEGER
);

CREATE TABLE IF NOT EXISTS class_routines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL,
  subject_id INTEGER,
  teacher_id INTEGER,
  day TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  room TEXT
);
`);

console.log("✅ Tables created");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEED DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Check if already seeded
const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get("admin@smartschool.com");
if (existingUser) {
  console.log("⚠️  Database already seeded. Skipping...");
  process.exit(0);
}

// Hash passwords
const adminHash = bcrypt.hashSync("admin123", 10);
const teacherHash = bcrypt.hashSync("teacher123", 10);
const studentHash = bcrypt.hashSync("student123", 10);
const parentHash = bcrypt.hashSync("parent123", 10);

// Users
const insertUser = db.prepare(`
  INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)
`);

insertUser.run("System Admin", "admin@smartschool.com", adminHash, "admin");
insertUser.run("Mr. Karim Rahman", "teacher@smartschool.com", teacherHash, "teacher");
insertUser.run("Rahim Ahmed", "student@smartschool.com", studentHash, "student");
insertUser.run("Mr. Ahmed Sr.", "parent@smartschool.com", parentHash, "parent");

// Additional teacher users
const teacherNames = [
  ["Ms. Fatema Begum", "fatema@smartschool.com"],
  ["Mr. Hasan Ali", "hasan@smartschool.com"],
  ["Ms. Nusrat Jahan", "nusrat@smartschool.com"],
  ["Mr. Rafiqul Islam", "rafiqul@smartschool.com"],
];
for (const [name, email] of teacherNames) {
  insertUser.run(name, email, teacherHash, "teacher");
}
console.log("✅ Users seeded");

// Classes
const insertClass = db.prepare(`
  INSERT INTO classes (name, section, academic_year, capacity) VALUES (?, ?, ?, ?)
`);
const classes = [
  ["Class 6", "A", "2025-2026", 45],
  ["Class 7", "A", "2025-2026", 45],
  ["Class 8", "A", "2025-2026", 40],
  ["Class 9", "A", "2025-2026", 40],
  ["Class 10", "A", "2025-2026", 40],
  ["Class 10", "B", "2025-2026", 40],
  ["Class 11", "Science", "2025-2026", 35],
  ["Class 12", "Science", "2025-2026", 35],
];
for (const [name, section, year, capacity] of classes) {
  insertClass.run(name, section, year, capacity);
}
console.log("✅ Classes seeded");

// Teachers
const insertTeacher = db.prepare(`
  INSERT INTO teachers (user_id, teacher_id, name, phone, email, gender, qualification, specialization, joining_date, salary, designation, department, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const teacherData = [
  [2, "TCH-001", "Mr. Karim Rahman", "01712345678", "teacher@smartschool.com", "male", "M.Sc. Mathematics", "Mathematics", "2020-01-15", 35000, "Senior Teacher", "Mathematics", "active"],
  [5, "TCH-002", "Ms. Fatema Begum", "01712345679", "fatema@smartschool.com", "female", "M.A. English", "English", "2019-06-01", 32000, "Senior Teacher", "English", "active"],
  [6, "TCH-003", "Mr. Hasan Ali", "01712345680", "hasan@smartschool.com", "male", "M.Sc. Physics", "Physics", "2021-03-10", 30000, "Teacher", "Science", "active"],
  [7, "TCH-004", "Ms. Nusrat Jahan", "01712345681", "nusrat@smartschool.com", "female", "M.A. Bangla", "Bangla", "2018-08-01", 33000, "Senior Teacher", "Language", "active"],
  [8, "TCH-005", "Mr. Rafiqul Islam", "01712345682", "rafiqul@smartschool.com", "male", "M.Sc. Chemistry", "Chemistry", "2022-01-05", 28000, "Teacher", "Science", "active"],
];
for (const t of teacherData) {
  insertTeacher.run(...t);
}
console.log("✅ Teachers seeded");

// Subjects
const insertSubject = db.prepare(`
  INSERT INTO subjects (name, code, class_id, teacher_id) VALUES (?, ?, ?, ?)
`);
const subjects = [
  ["Mathematics", "MATH", 1, 1],
  ["English", "ENG", 1, 2],
  ["Bangla", "BAN", 1, 4],
  ["Science", "SCI", 1, 3],
  ["Social Studies", "SOC", 1, null],
  ["Mathematics", "MATH", 5, 1],
  ["English", "ENG", 5, 2],
  ["Physics", "PHY", 5, 3],
  ["Chemistry", "CHEM", 5, 5],
  ["Biology", "BIO", 5, null],
];
for (const [name, code, classId, teacherId] of subjects) {
  insertSubject.run(name, code, classId, teacherId);
}
console.log("✅ Subjects seeded");

// Parents
const insertParent = db.prepare(`
  INSERT INTO parents (user_id, name, relationship, phone, email, address, occupation)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
insertParent.run(4, "Mr. Ahmed Sr.", "father", "01812345678", "parent@smartschool.com", "123 Dhanmondi, Dhaka", "Business");
const parent2 = insertParent.run(null, "Mrs. Begum", "mother", "01812345679", null, "456 Gulshan, Dhaka", "Housewife");
const parent3 = insertParent.run(null, "Mr. Khan", "father", "01812345680", null, "789 Mirpur, Dhaka", "Service");
console.log("✅ Parents seeded");

// Students
const insertStudent = db.prepare(`
  INSERT INTO students (student_id, name, class_id, section_id, roll_no, date_of_birth, gender, blood_group, religion, address, phone, parent_id, admission_date, admission_no, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const studentData = [
  ["STU-2025-0001", "Rahim Ahmed", 5, null, 1, "2008-03-15", "male", "B+", "Islam", "123 Dhanmondi, Dhaka", "01912345678", 1, "2023-01-15", "ADM-2023-001", "active"],
  ["STU-2025-0002", "Fatema Khatun", 5, null, 2, "2008-06-20", "female", "A+", "Islam", "456 Gulshan, Dhaka", "01912345679", 2, "2023-01-15", "ADM-2023-002", "active"],
  ["STU-2025-0003", "Karim Hossain", 5, null, 3, "2008-09-10", "male", "O+", "Islam", "789 Mirpur, Dhaka", "01912345680", 3, "2023-01-15", "ADM-2023-003", "active"],
  ["STU-2025-0004", "Nasrin Akter", 4, null, 1, "2009-01-25", "female", "AB+", "Islam", "321 Banani, Dhaka", "01912345681", 1, "2024-01-10", "ADM-2024-001", "active"],
  ["STU-2025-0005", "Imran Khan", 4, null, 2, "2009-04-12", "male", "B-", "Islam", "654 Uttara, Dhaka", "01912345682", 2, "2024-01-10", "ADM-2024-002", "active"],
  ["STU-2025-0006", "Sadia Islam", 3, null, 1, "2010-07-30", "female", "A-", "Islam", "987 Mohammadpur, Dhaka", "01912345683", 3, "2024-01-10", "ADM-2024-003", "active"],
  ["STU-2025-0007", "Arif Billah", 3, null, 2, "2010-11-05", "male", "O-", "Islam", "147 Rayer Bazar, Dhaka", "01912345684", 1, "2024-01-10", "ADM-2024-004", "active"],
  ["STU-2025-0008", "Riya Das", 2, null, 1, "2011-02-18", "female", "B+", "Hinduism", "258 Shankhari Bazar, Dhaka", "01912345685", 2, "2025-01-15", "ADM-2025-001", "active"],
  ["STU-2025-0009", "Tanvir Hasan", 2, null, 2, "2011-08-22", "male", "A+", "Islam", "369 Lalbagh, Dhaka", "01912345686", 3, "2025-01-15", "ADM-2025-002", "active"],
  ["STU-2025-0010", "Mitu Roy", 1, null, 1, "2012-05-14", "female", "O+", "Hinduism", "741 Wari, Dhaka", "01912345687", 1, "2025-01-15", "ADM-2025-003", "active"],
];

for (const s of studentData) {
  insertStudent.run(...s);
}
console.log("✅ Students seeded");

// Attendance (last 30 days)
const insertAttendance = db.prepare(`
  INSERT INTO attendance (type, student_id, class_id, date, status, marked_by)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const today = new Date();
const statuses = ["present", "present", "present", "present", "absent", "late"];
for (let d = 30; d >= 1; d--) {
  const date = new Date(today);
  date.setDate(date.getDate() - d);
  const dateStr = date.toISOString().split("T")[0];
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

  for (let s = 1; s <= 10; s++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    insertAttendance.run("student", s, 5, dateStr, status, 1);
  }
}
console.log("✅ Attendance seeded");

// Exams
const insertExam = db.prepare(`
  INSERT INTO exams (name, type, class_id, subject_id, date, max_marks, pass_marks, status, created_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const exams = [
  ["Mid-Term Exam 2025", "mid_term", 5, null, "2025-07-25", 100, 33, "upcoming", 1],
  ["Math Unit Test", "unit_test", 5, 6, "2025-07-20", 50, 17, "upcoming", 1],
  ["English Final 2025", "final", 5, 7, "2025-08-15", 100, 33, "upcoming", 1],
  ["Physics Practical", "unit_test", 5, 8, "2025-07-22", 25, 10, "upcoming", 1],
  ["Class 9 Mid-Term", "mid_term", 4, null, "2025-07-28", 100, 33, "upcoming", 1],
];

for (const e of exams) {
  insertExam.run(...e);
}
console.log("✅ Exams seeded");

// Results (for past exams - let's add some)
const insertResult = db.prepare(`
  INSERT INTO results (exam_id, student_id, marks_obtained, grade, gpa, remarks)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const gradesMap = [
  [85, "A+", 5.0, "Excellent"],
  [78, "A", 4.0, "Very Good"],
  [65, "B+", 3.5, "Good"],
  [55, "B", 3.0, "Satisfactory"],
  [45, "C+", 2.5, "Average"],
  [38, "C", 2.0, "Pass"],
  [75, "A", 4.0, "Good"],
  [92, "A+", 5.0, "Outstanding"],
  [60, "B+", 3.5, "Good"],
  [35, "C", 2.0, "Pass"],
];

for (let s = 1; s <= 10; s++) {
  const g = gradesMap[s - 1];
  insertResult.run(1, s, g[0], g[1], g[2], g[3]);
}
console.log("✅ Results seeded");

// Fee structures
const insertFeeStructure = db.prepare(`
  INSERT INTO fee_structures (name, amount, type, class_id, frequency, due_day, academic_year)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
insertFeeStructure.run("Monthly Tuition - Class 10", 2500, "tuition", 5, "monthly", 10, "2025-2026");
insertFeeStructure.run("Exam Fee", 500, "exam", null, "one_time", 15, "2025-2026");
insertFeeStructure.run("Transport Fee", 1500, "transport", null, "monthly", 10, "2025-2026");
console.log("✅ Fee structures seeded");

// Fees and payments
const insertFee = db.prepare(`
  INSERT INTO fees (student_id, fee_structure_id, amount, due_date, month, status)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const insertPayment = db.prepare(`
  INSERT INTO payments (fee_id, student_id, amount, method, transaction_id, invoice_no, received_by)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const months = ["2025-04", "2025-05", "2025-06", "2025-07"];
let feeId = 1;
for (let s = 1; s <= 10; s++) {
  for (let m = 0; m < months.length; m++) {
    const isPaid = m < 3; // Last 3 months paid, current pending
    const feeResult = insertFee.run(s, 1, 2500, `${months[m]}-10`, months[m], isPaid ? "paid" : "pending");
    if (isPaid) {
      insertPayment.run(feeResult.lastInsertRowid, s, 2500, "cash", null, `INV-${feeResult.lastInsertRowid}`, 1);
    }
    feeId++;
  }
}
console.log("✅ Fees & payments seeded");

// Notices
const insertNotice = db.prepare(`
  INSERT INTO notices (title, content, audience, priority, is_published, published_at, created_by)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
insertNotice.run("Mid-Term Exam Schedule Released", "The mid-term examination schedule for all classes has been published. Please check the exam section for details.", "all", "high", 1, new Date().toISOString(), 1);
insertNotice.run("Annual Sports Day Announcement", "The Annual Sports Day will be held on August 5, 2025. All students are encouraged to participate.", "students", "medium", 1, new Date().toISOString(), 1);
insertNotice.run("Parent-Teacher Meeting", "A parent-teacher meeting is scheduled for July 30, 2025. Parents are requested to attend.", "parents", "high", 1, new Date().toISOString(), 1);
insertNotice.run("Library Book Return Reminder", "All students who have borrowed library books are requested to return them before July 25.", "students", "medium", 1, new Date().toISOString(), 1);
insertNotice.run("Staff Meeting Notice", "A staff meeting will be held on July 22, 2025 at 3 PM in the conference room.", "teachers", "medium", 1, new Date().toISOString(), 1);
console.log("✅ Notices seeded");

// Books
const insertBook = db.prepare(`
  INSERT INTO books (title, author, isbn, publisher, category, total_quantity, available_quantity, publish_year)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
const books = [
  ["Higher Mathematics", "S.L. Loney", "978-0-07-066943-9", "McGraw Hill", "Mathematics", 5, 3, "2020"],
  ["Advanced Physics", "H.C. Verma", "978-81-7764-003-8", "Bharati Bhawan", "Physics", 4, 4, "2019"],
  ["English Grammar", "Wren & Martin", "978-93-5098-041-3", "S. Chand", "English", 8, 6, "2021"],
  ["Chemistry Concepts", "P. Bahadur", "978-93-5107-456-2", "GRB Publishers", "Chemistry", 3, 2, "2022"],
  ["Bangladesh History", "Dr. Rafiqul Islam", "978-984-70123-0", "Bangla Academy", "History", 6, 5, "2023"],
  ["Computer Science Basics", "Seymour Lipschutz", "978-0-07-059-9", "Tata McGraw", "Computer", 4, 3, "2021"],
];
for (const b of books) {
  insertBook.run(...b);
}
console.log("✅ Books seeded");

// Transport routes
const insertRoute = db.prepare(`
  INSERT INTO transport_routes (route_name, vehicle_no, vehicle_type, capacity, driver_name, driver_phone, monthly_fee, is_active)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
insertRoute.run("Dhanmondi Route", "DHA-1234", "Bus", 45, "Mr. Alam", "01712345690", 1500, 1);
insertRoute.run("Gulshan Route", "GUL-5678", "Bus", 40, "Mr. Bashir", "01712345691", 1800, 1);
insertRoute.run("Mirpur Route", "MIR-9012", "Minibus", 30, "Mr. Jabbar", "01712345692", 1200, 1);
console.log("✅ Transport routes seeded");

// Hostel rooms
const insertRoom = db.prepare(`
  INSERT INTO hostel_rooms (room_no, floor, type, capacity, occupied, monthly_fee, status)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const rooms = [
  ["101", 1, "double", 2, 2, 3000, "full"],
  ["102", 1, "double", 2, 1, 3000, "available"],
  ["103", 1, "single", 1, 1, 4000, "full"],
  ["201", 2, "triple", 3, 2, 2500, "available"],
  ["202", 2, "double", 2, 0, 3000, "available"],
  ["203", 2, "dormitory", 6, 4, 1500, "available"],
];
for (const r of rooms) {
  insertRoom.run(...r);
}
console.log("✅ Hostel rooms seeded");

// Settings
const insertSetting = db.prepare(`
  INSERT INTO settings (key, value, label, grp)
  VALUES (?, ?, ?, ?)
`);
const settingsData = [
  ["school_name", "SmartSchool Academy", "School Name", "general"],
  ["school_address", "123 Education Road, Dhaka-1215", "School Address", "general"],
  ["school_phone", "02-9123456", "School Phone", "general"],
  ["school_email", "info@smartschool.com", "School Email", "general"],
  ["academic_year", "2025-2026", "Current Academic Year", "academic"],
  ["exam_grade_scale", "5.0", "GPA Scale", "exam"],
  ["attendance_required", "75", "Required Attendance %", "attendance"],
  ["library_fine_per_day", "5", "Library Fine Per Day (BDT)", "library"],
  ["currency", "BDT", "Currency", "finance"],
];
for (const s of settingsData) {
  insertSetting.run(...s);
}
console.log("✅ Settings seeded");

console.log("\n🎉 Database seeded successfully!");
console.log("\n📋 Demo credentials:");
console.log("  Admin:   admin@smartschool.com   / admin123");
console.log("  Teacher: teacher@smartschool.com / teacher123");
console.log("  Student: student@smartschool.com / student123");
console.log("  Parent:  parent@smartschool.com  / parent123");

db.close();
