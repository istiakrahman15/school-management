"use server";

import { db } from "@/db";
import { students, parents, users } from "@/db/schema";
import { eq, like, and, sql, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { studentSchema } from "@/lib/validations";
import { generateStudentId } from "@/lib/utils";
import type { ActionResult, PaginatedResult, StudentWithDetails } from "@/types";

export async function getStudents(
  page = 1,
  limit = 10,
  search = "",
  classFilter?: number,
  statusFilter?: string
): Promise<PaginatedResult<StudentWithDetails>> {
  try {
    const offset = (page - 1) * limit;

    const baseQuery = (db as any)
      .select({
        id: students.id,
        studentId: students.studentId,
        name: students.name,
        photo: students.photo,
        className: sql<string>`(SELECT name FROM classes WHERE id = ${students.classId})`,
        rollNo: students.rollNo,
        gender: students.gender,
        phone: students.phone,
        email: students.email,
        status: students.status,
        admissionDate: students.admissionDate,
        parentName: sql<string>`(SELECT name FROM parents WHERE id = ${students.parentId})`,
        parentPhone: sql<string>`(SELECT phone FROM parents WHERE id = ${students.parentId})`,
      })
      .from(students);

    // Apply filters
    const conditions = [];
    if (search) {
      conditions.push(
        sql`(${students.name} LIKE ${"%" + search + "%"} OR ${students.studentId} LIKE ${"%" + search + "%"})`
      );
    }
    if (classFilter) conditions.push(eq(students.classId, classFilter));
    if (statusFilter) conditions.push(eq(students.status, statusFilter as any));

    const query = conditions.length > 0
      ? baseQuery.where(and(...conditions))
      : baseQuery;

    const [countResult] = await (db as any)
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const data = await query
      .orderBy(desc(students.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: data as StudentWithDetails[],
      total: countResult.count,
      page,
      limit,
      totalPages: Math.ceil(countResult.count / limit),
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { data: [], total: 0, page, limit, totalPages: 0 };
  }
}

export async function getStudentById(id: number) {
  try {
    const student = await db.query.students.findFirst({
      where: eq(students.id, id),
    });
    return student;
  } catch {
    return null;
  }
}

export async function createStudent(formData: FormData): Promise<ActionResult> {
  try {
    const raw = Object.fromEntries(formData.entries());
    const parsed = studentSchema.safeParse({
      ...raw,
      classId: raw.classId ? Number(raw.classId) : undefined,
      sectionId: raw.sectionId ? Number(raw.sectionId) : undefined,
      rollNo: raw.rollNo ? Number(raw.rollNo) : undefined,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;

    const [countResult] = await (db as any)
      .select({ count: sql<number>`count(*)` })
      .from(students);
    const studentId = generateStudentId(countResult.count + 1);

    // Create parent record
    const [newParent] = await db
      .insert(parents)
      .values({
        name: data.parentName,
        relationship: data.parentRelationship,
        phone: data.parentPhone,
        email: data.parentEmail || undefined,
        occupation: data.parentOccupation || undefined,
        address: data.address || undefined,
      })
      .returning();

    // Create user account for student
    const passwordHash = await bcrypt.hash(studentId + "@123", 10);
    const [newUser] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email || `${studentId.toLowerCase()}@smartschool.com`,
        passwordHash,
        role: "student",
      })
      .returning();

    // Create student record
    await db.insert(students).values({
      userId: newUser.id,
      studentId,
      name: data.name,
      classId: data.classId,
      sectionId: data.sectionId || undefined,
      rollNo: data.rollNo || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      gender: data.gender || undefined,
      bloodGroup: data.bloodGroup || undefined,
      religion: data.religion || undefined,
      address: data.address || undefined,
      city: data.city || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
      parentId: newParent.id,
      admissionDate: data.admissionDate || new Date().toISOString().split("T")[0],
      admissionNo: `ADM-${new Date().getFullYear()}-${String(countResult.count + 1).padStart(3, "0")}`,
      previousSchool: data.previousSchool || undefined,
    });

    revalidatePath("/dashboard/students");
    return { success: true, message: `Student ${data.name} added successfully! ID: ${studentId}` };
  } catch (error) {
    console.error("Error creating student:", error);
    return { success: false, error: "Failed to create student. Please try again." };
  }
}

export async function updateStudent(id: number, formData: FormData): Promise<ActionResult> {
  try {
    const raw = Object.fromEntries(formData.entries());
    const parsed = studentSchema.safeParse({
      ...raw,
      classId: raw.classId ? Number(raw.classId) : undefined,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await db
      .update(students)
      .set({
        name: parsed.data.name,
        classId: parsed.data.classId,
        gender: parsed.data.gender,
        dateOfBirth: parsed.data.dateOfBirth,
        address: parsed.data.address,
        phone: parsed.data.phone,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(students.id, id));

    revalidatePath("/dashboard/students");
    return { success: true, message: "Student updated successfully!" };
  } catch (error) {
    console.error("Error updating student:", error);
    return { success: false, error: "Failed to update student." };
  }
}

export async function deleteStudent(id: number): Promise<ActionResult> {
  try {
    await db.update(students).set({ status: "inactive" }).where(eq(students.id, id));
    revalidatePath("/dashboard/students");
    return { success: true, message: "Student removed successfully." };
  } catch {
    return { success: false, error: "Failed to delete student." };
  }
}
