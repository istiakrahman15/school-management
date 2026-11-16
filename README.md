<div align="center">

# 🎓 SmartSchool OS

**A production-ready, open-source School Management System**

Built with Next.js 16 · TypeScript · Tailwind CSS v4 · Shadcn UI · Drizzle ORM · SQLite/Turso

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://typescriptlang.org)

</div>

---

## ✨ Features

### 🔐 Authentication & RBAC
- Multi-role login: **Admin**, **Teacher**, **Student**, **Parent**
- Secure sessions with NextAuth v5 + JWT
- Role-based route protection middleware
- Password hashing with bcryptjs

### 📊 Admin Dashboard
- Live stats: Students, Teachers, Classes, Attendance %, Fees, Notices
- Attendance trend chart (area chart)
- Fee collection chart (bar chart)
- Upcoming exams & recent activity feed

### 👨‍🎓 Student Management
- Full CRUD with search, filter, pagination
- Student profiles with guardian info
- Admission tracking
- Linked parent accounts

### 👩‍🏫 Teacher Management
- Staff directory with qualifications
- Salary & department info
- Subject assignments

### 📅 Attendance
- Daily bulk attendance marking
- Status: Present / Absent / Late / Half Day / Leave
- Class-wise attendance filtering

### 📝 Exams & Results
- Exam scheduling (unit test, mid-term, final, quiz)
- Mark entry and grade calculation

### 💰 Fee Management
- Fee structure setup (tuition, admission, transport, hostel, etc.)
- Payment tracking (Cash, bKash, Nagad, Bank Transfer)
- Monthly/quarterly/yearly fee cycles

### 📢 Notices
- Notice board for all roles
- Audience targeting (all, students, teachers, parents, admin)
- Priority levels

### 📚 Library
- Book catalog management
- Issue/Return tracking with due dates
- Fine calculation

### 🚌 Transport
- Route & driver management
- Student transport assignment

### 🏠 Hostel
- Room management with capacity
- Student allocation & fees

### 📈 Reports
- Multi-module reporting dashboard
- PDF/Excel export support (jsPDF + xlsx)

### 🌙 Design
- Dark mode + Light mode (next-themes)
- Glassmorphism UI cards
- Framer Motion page transitions
- Fully responsive: Mobile → Tablet → Desktop
- PWA-ready for Android installation
- Bottom navigation on mobile

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/istiakrahman15/school-management.git
cd school-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this

# Local SQLite (default for development)
DATABASE_URL=file:./local.db

# Turso (optional, for production cloud database)
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

### 4. Seed the database

```bash
npx tsx src/db/seed.ts
```

This creates sample data: students, teachers, classes, exams, fees, library books, transport routes, hostel rooms, and notices.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Credentials

| Role    | Email                       | Password     |
|---------|-----------------------------|--------------|
| Admin   | admin@smartschool.com       | admin123     |
| Teacher | teacher@smartschool.com     | teacher123   |
| Student | student@smartschool.com     | student123   |
| Parent  | parent@smartschool.com      | parent123    |

---

## 🗄️ Database

### Local Development (SQLite)
Uses `better-sqlite3` locally. The database file `local.db` is auto-created when you seed.

### Production (Turso Cloud)
Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in `.env.local`. The app automatically switches from SQLite to Turso.

Get a free Turso database at [turso.tech](https://turso.tech).

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create a database
turso db create school-management

# Get credentials
turso db show school-management --url
turso db tokens create school-management
```

### Running Migrations

```bash
npx drizzle-kit push
```

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXTAUTH_URL` → your production URL
   - `NEXTAUTH_SECRET` → a secure random string
   - `TURSO_DATABASE_URL` → your Turso database URL
   - `TURSO_AUTH_TOKEN` → your Turso auth token
4. Deploy!

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/           # All dashboard pages
│   │   ├── dashboard/         # Overview
│   │   ├── students/          # Student management
│   │   ├── teachers/          # Teacher management
│   │   ├── classes/           # Class & section management
│   │   ├── attendance/        # Attendance tracking
│   │   ├── exams/             # Exam scheduling
│   │   ├── fees/              # Fee management
│   │   ├── notices/           # Notice board
│   │   ├── library/           # Library system
│   │   ├── transport/         # Transport routes
│   │   ├── hostel/            # Hostel management
│   │   ├── reports/           # Reports & exports
│   │   └── settings/          # School settings
│   └── api/auth/              # NextAuth API
├── components/
│   ├── ui/                    # Shadcn/Radix UI components
│   ├── layout/                # Sidebar, Navbar, MobileNav
│   ├── dashboard/             # Dashboard overview components
│   └── providers/             # ThemeProvider
├── db/
│   ├── schema.ts              # Drizzle ORM schema (19 tables)
│   ├── index.ts               # DB client (SQLite/Turso)
│   └── seed.ts                # Database seeder
├── actions/                   # Next.js Server Actions
│   ├── students.ts
│   ├── teachers.ts
│   ├── attendance.ts
│   └── dashboard.ts
├── lib/
│   ├── utils.ts               # Utilities & helpers
│   ├── validations.ts         # Zod schemas
│   └── constants.ts           # App constants
├── types/
│   └── index.ts               # TypeScript types
├── auth.ts                    # NextAuth configuration
└── middleware.ts              # Route protection
```

---

## 🛠️ Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Framework   | Next.js 16 (App Router)        |
| Language    | TypeScript 5                   |
| Styling     | Tailwind CSS v4                |
| UI Library  | Shadcn UI + Radix UI           |
| Animation   | Framer Motion                  |
| Icons       | Lucide React                   |
| Database    | SQLite (dev) / Turso (prod)    |
| ORM         | Drizzle ORM                    |
| Auth        | NextAuth v5                    |
| Charts      | Recharts                       |
| Forms       | React Hook Form + Zod          |
| PDF         | jsPDF                          |
| Excel       | xlsx                           |
| Toasts      | Sonner                         |
| Theme       | next-themes                    |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Developer

Built with ❤️ by **Istiak Rahman**

- GitHub: [@istiakrahman15](https://github.com/istiakrahman15)
- Portfolio: [devistiak.eu.cc](https://devistiak.eu.cc/)

---

<div align="center">
  <b>SmartSchool OS is an open-source project.</b><br>
  Star ⭐ the repo if you find it useful!
</div>
