"use server";

import { db } from "@/db";
import { teachers, users } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { teacherSchema } from "@/lib/validations";
import { generateTeacherId } from "@/lib/utils";
import type { ActionResult, PaginatedResult, TeacherWithDetails } from "@/types";

export async function getTeachers(
  page = 1,
  limit = 10,
  search = "",
): Promise<PaginatedResult<TeacherWithDetails>> {
  try {
    const offset = (page - 1) * limit;

    const data = await (db as any)
      .select()
      .from(teachers)
      .where(search ? sql`${teachers.name} LIKE ${"%" + search + "%"}` : undefined)
      .orderBy(desc(teachers.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await (db as any)
      .select({ count: sql<number>`count(*)` })
      .from(teachers)
      .where(search ? sql`${teachers.name} LIKE ${"%" + search + "%"}` : undefined);

    return {
      data: data as unknown as TeacherWithDetails[],
      total: countResult.count,
      page,
      limit,
      totalPages: Math.ceil(countResult.count / limit),
    };
  } catch {
    return { data: [], total: 0, page, limit, totalPages: 0 };
  }
}

export async function createTeacher(formData: FormData): Promise<ActionResult> {
  try {
    const raw = Object.fromEntries(formData.entries());
    const parsed = teacherSchema.safeParse({
      ...raw,
      salary: raw.salary ? Number(raw.salary) : 0,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;

    const [countResult] = await (db as any).select({ count: sql<number>`count(*)` }).from(teachers);
    const teacherId = generateTeacherId(countResult.count + 1);

    const passwordHash = await bcrypt.hash("teacher123", 10);
    const [newUser] = await db.insert(users).values({
      name: data.name,
      email: data.email || `${teacherId.toLowerCase()}@smartschool.com`,
      passwordHash,
      role: "teacher",
    }).returning();

    await db.insert(teachers).values({
      userId: newUser.id,
      teacherId,
      name: data.name,
      phone: data.phone || undefined,
      email: data.email || undefined,
      address: data.address || undefined,
      gender: data.gender || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      qualification: data.qualification || undefined,
      specialization: data.specialization || undefined,
      joiningDate: data.joiningDate || new Date().toISOString().split("T")[0],
      salary: data.salary,
      designation: data.designation || undefined,
      department: data.department || undefined,
    });

    revalidatePath("/dashboard/teachers");
    return { success: true, message: `Teacher added successfully! ID: ${teacherId}` };
  } catch (error) {
    console.error("Error creating teacher:", error);
    return { success: false, error: "Failed to add teacher." };
  }
}

export async function updateTeacher(id: number, formData: FormData): Promise<ActionResult> {
  try {
    const raw = Object.fromEntries(formData.entries());
    const parsed = teacherSchema.safeParse({ ...raw, salary: Number(raw.salary) });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

    await db.update(teachers).set({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      salary: parsed.data.salary,
      designation: parsed.data.designation,
      department: parsed.data.department,
      updatedAt: new Date().toISOString(),
    }).where(eq(teachers.id, id));

    revalidatePath("/dashboard/teachers");
    return { success: true, message: "Teacher updated successfully!" };
  } catch {
    return { success: false, error: "Failed to update teacher." };
  }
}

export async function deleteTeacher(id: number): Promise<ActionResult> {
  try {
    await db.update(teachers).set({ status: "inactive" }).where(eq(teachers.id, id));
    revalidatePath("/dashboard/teachers");
    return { success: true, message: "Teacher removed." };
  } catch {
    return { success: false, error: "Failed to remove teacher." };
  }
}
