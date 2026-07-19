"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus, Search, Filter, Download, Eye,
  Edit, Trash2, GraduationCap, ChevronLeft, ChevronRight,
  X, Save, Loader2, Phone, Mail, MapPin, User, Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { getStudents, createStudent, deleteStudent } from "@/actions/students";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Avatar, Skeleton } from "@/components/ui";
import { formatDate, getInitials } from "@/lib/utils";
import type { StudentWithDetails } from "@/types";

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentWithDetails[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const result = await getStudents(page, 10, search);
    setStudents(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this student?")) return;
    setDeletingId(id);
    const result = await deleteStudent(id);
    if (result.success) {
      toast.success(result.message);
      fetchStudents();
    } else {
      toast.error(result.error);
    }
    setDeletingId(null);
  };

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await createStudent(formData);
    if (result.success) {
      toast.success(result.message);
      setShowAddModal(false);
      fetchStudents();
    } else {
      toast.error(result.error);
    }
    setSubmitting(false);
  };

  const statusColors: Record<string, "success" | "secondary" | "warning" | "destructive"> = {
    active: "success",
    inactive: "secondary",
    transferred: "warning",
    graduated: "info" as "success",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} students enrolled
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name or ID..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Student Grid / Table */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">No students found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {search ? "Try a different search term." : "Add your first student to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {students.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar
                      src={student.photo ?? undefined}
                      fallback={getInitials(student.name)}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm text-foreground truncate">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.studentId}</p>
                        </div>
                        <Badge variant={statusColors[student.status] ?? "secondary"} className="flex-shrink-0 capitalize">
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{student.className ?? "No class assigned"}</span>
                      {student.rollNo && <span className="ml-auto text-xs font-medium text-foreground">Roll #{student.rollNo}</span>}
                    </div>
                    {student.phone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{student.phone}</span>
                      </div>
                    )}
                    {student.parentName && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">Guardian: {student.parentName}</span>
                      </div>
                    )}
                    {student.admissionDate && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>Admitted: {formatDate(student.admissionDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 pt-2 border-t border-border">
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={() => handleDelete(student.id)}
                      disabled={deletingId === student.id}
                    >
                      {deletingId === student.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-3 font-medium text-foreground">{page} / {totalPages}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">Add New Student</h2>
                <p className="text-xs text-muted-foreground">Fill in the student information below</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1.5 hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">Full Name *</label>
                    <Input name="name" required placeholder="Student's full name" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Class *</label>
                    <select name="classId" required className="mt-1 flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Select Class</option>
                      {[1,2,3,4,5,6,7,8].map(i => <option key={i} value={i}>Class {i+5}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Roll Number</label>
                    <Input name="rollNo" type="number" placeholder="Roll number" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Date of Birth</label>
                    <Input name="dateOfBirth" type="date" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Gender</label>
                    <select name="gender" className="mt-1 flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Phone</label>
                    <Input name="phone" placeholder="+880..." className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Email</label>
                    <Input name="email" type="email" placeholder="student@email.com" className="mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">Address</label>
                    <Input name="address" placeholder="Full address" className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Guardian Info */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Guardian / Parent Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">Guardian Name *</label>
                    <Input name="parentName" required placeholder="Guardian's full name" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Phone *</label>
                    <Input name="parentPhone" required placeholder="Guardian's phone" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Relationship</label>
                    <select name="parentRelationship" className="mt-1 flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="guardian">Guardian</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Guardian Email</label>
                    <Input name="parentEmail" type="email" placeholder="guardian@email.com" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Occupation</label>
                    <Input name="parentOccupation" placeholder="e.g., Business" className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Admission Info */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Admission Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-foreground">Admission Date</label>
                    <Input name="admissionDate" type="date" className="mt-1" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Previous School</label>
                    <Input name="previousSchool" placeholder="Previous school name" className="mt-1" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" loading={submitting} className="flex-1">
                  <Save className="h-4 w-4" />
                  Add Student
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
