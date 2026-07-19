"use server";

import { db } from "@/db";
import { attendance, students } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { attendanceSchema } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getAttendanceByDate(date: string, classId?: number) {
  try {
    const conditions = [eq(attendance.date, date), eq(attendance.type, "student")];
    if (classId) conditions.push(eq(attendance.classId, classId));

    const records = await (db as any)
      .select({
        id: attendance.id,
        studentId: attendance.studentId,
        studentName: sql<string>`(SELECT name FROM students WHERE id = ${attendance.studentId})`,
        rollNo: sql<number>`(SELECT roll_no FROM students WHERE id = ${attendance.studentId})`,
        date: attendance.date,
        status: attendance.status,
        note: attendance.note,
      })
      .from(attendance)
      .where(and(...conditions))
      .orderBy(sql`roll_no ASC`);

    return records;
  } catch {
    return [];
  }
}

export async function markAttendance(formData: FormData): Promise<ActionResult> {
  try {
    const date = formData.get("date") as string;
    const classId = Number(formData.get("classId"));
    const markedBy = Number(formData.get("markedBy") ?? 1);

    const classStudents = await (db as any)
      .select({ id: students.id })
      .from(students)
      .where(and(eq(students.classId, classId), eq(students.status, "active")));

    for (const s of classStudents) {
      const status = formData.get(`status_${s.id}`) as string ?? "absent";
      const note = formData.get(`note_${s.id}`) as string ?? undefined;

      // Check if already marked
      const existing = await db.query.attendance.findFirst({
        where: and(
          eq(attendance.studentId, s.id),
          eq(attendance.date, date),
          eq(attendance.type, "student")
        ),
      });

      if (existing) {
        await db.update(attendance).set({ status: status as any, note }).where(eq(attendance.id, existing.id));
      } else {
        await db.insert(attendance).values({
          type: "student",
          studentId: s.id,
          classId,
          date,
          status: status as any,
          note,
          markedBy,
        });
      }
    }

    revalidatePath("/dashboard/attendance");
    return { success: true, message: `Attendance marked for ${classStudents.length} students.` };
  } catch (error) {
    console.error("Attendance error:", error);
    return { success: false, error: "Failed to save attendance." };
  }
}

export async function getAttendanceSummary(studentId: number, month?: string) {
  try {
    const currentMonth = month ?? new Date().toISOString().slice(0, 7);
    const records = await (db as any)
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.studentId, studentId),
          eq(attendance.type, "student"),
          sql`strftime('%Y-%m', date) = ${currentMonth}`
        )
      );

    const present = (records as any[]).filter((r: any) => r.status === "present").length;
    const absent = (records as any[]).filter((r: any) => r.status === "absent").length;
    const late = (records as any[]).filter((r: any) => r.status === "late").length;
    const total = records.length;

    return { present, absent, late, total, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
  } catch {
    return { present: 0, absent: 0, late: 0, total: 0, percentage: 0 };
  }
}

export async function getMonthlyAttendanceStats() {
  try {
    const result = await (db as any).execute(sql`
      SELECT 
        date,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent,
        COUNT(*) as total
      FROM attendance
      WHERE type = 'student'
        AND date >= date('now', '-30 days')
      GROUP BY date
      ORDER BY date DESC
    `);
    return result.rows;
  } catch {
    return [];
  }
}
