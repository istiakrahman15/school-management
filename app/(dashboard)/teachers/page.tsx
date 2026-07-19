"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus, Search, Edit, Trash2, Users, Download,
  Phone, Mail, BookOpen, ChevronLeft, ChevronRight,
  X, Save, Loader2, Briefcase, DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { getTeachers, createTeacher, deleteTeacher } from "@/actions/teachers";
import { Card, CardContent, Button, Badge, Input, Avatar, Skeleton } from "@/components/ui";
import { formatCurrency, getInitials } from "@/lib/utils";
import type { TeacherWithDetails } from "@/types";



export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherWithDetails[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    const result = await getTeachers(page, 10, search);
    setTeachers(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(fetchTeachers, 300);
    return () => clearTimeout(timer);
  }, [fetchTeachers]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await createTeacher(new FormData(e.currentTarget));
    if (result.success) { toast.success(result.message); setShowModal(false); fetchTeachers(); }
    else toast.error(result.error);
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this teacher?")) return;
    const result = await deleteTeacher(id);
    if (result.success) { toast.success(result.message); fetchTeachers(); }
    else toast.error(result.error);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{total} teaching staff</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4" />Export</Button>
          <Button size="sm" onClick={() => setShowModal(true)}><Plus className="h-4 w-4" />Add Teacher</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search teachers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((teacher, i) => (
            <motion.div key={teacher.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar src={teacher.photo ?? undefined} fallback={getInitials(teacher.name)} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{teacher.name}</p>
                      <p className="text-xs text-muted-foreground">{(teacher as unknown as { teacherId: string }).teacherId}</p>
                      <Badge variant="info" className="mt-1 capitalize text-xs">{teacher.designation ?? "Teacher"}</Badge>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {teacher.phone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" /><span>{teacher.phone}</span>
                      </div>
                    )}
                    {teacher.email && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" /><span className="truncate">{teacher.email}</span>
                      </div>
                    )}
                    {(teacher as unknown as { department: string }).department && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Briefcase className="h-3.5 w-3.5" /><span>{(teacher as unknown as { department: string }).department}</span>
                      </div>
                    )}
                    {teacher.salary != null && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <DollarSign className="h-3.5 w-3.5" /><span>{formatCurrency(teacher.salary)} / month</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 pt-2 border-t border-border">
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs"><Edit className="h-3 w-3" />Edit</Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => handleDelete(teacher.id)}>
                      <Trash2 className="h-3 w-3" />Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card">
              <h2 className="font-display text-lg font-bold">Add New Teacher</h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 hover:bg-muted text-muted-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><label className="text-xs font-medium">Full Name *</label><Input name="name" required placeholder="Teacher name" className="mt-1" /></div>
                <div><label className="text-xs font-medium">Phone</label><Input name="phone" placeholder="01712345678" className="mt-1" /></div>
                <div><label className="text-xs font-medium">Email</label><Input name="email" type="email" placeholder="teacher@school.com" className="mt-1" /></div>
                <div><label className="text-xs font-medium">Gender</label>
                  <select name="gender" className="mt-1 flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select</option><option value="male">Male</option><option value="female">Female</option>
                  </select>
                </div>
                <div><label className="text-xs font-medium">Qualification</label><Input name="qualification" placeholder="e.g., M.Sc. Math" className="mt-1" /></div>
                <div><label className="text-xs font-medium">Specialization</label><Input name="specialization" placeholder="e.g., Mathematics" className="mt-1" /></div>
                <div><label className="text-xs font-medium">Designation</label><Input name="designation" placeholder="e.g., Senior Teacher" className="mt-1" /></div>
                <div><label className="text-xs font-medium">Department</label><Input name="department" placeholder="e.g., Science" className="mt-1" /></div>
                <div><label className="text-xs font-medium">Salary (BDT)</label><Input name="salary" type="number" placeholder="30000" className="mt-1" /></div>
                <div><label className="text-xs font-medium">Joining Date</label><Input name="joiningDate" type="date" className="mt-1" defaultValue={new Date().toISOString().split("T")[0]} /></div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                <Button type="submit" loading={submitting} className="flex-1"><Save className="h-4 w-4" />Add Teacher</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
