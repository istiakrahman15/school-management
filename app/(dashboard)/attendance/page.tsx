"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock, AlertCircle, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { markAttendance, getAttendanceByDate } from "@/actions/attendance";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";

const statusConfig = {
  present: { label: "Present", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/30" },
  absent: { label: "Absent", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10 border-red-500/30" },
  late: { label: "Late", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/30" },
  half_day: { label: "Half Day", icon: AlertCircle, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/30" },
  leave: { label: "Leave", icon: AlertCircle, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/30" },
};

type AttendanceStatus = keyof typeof statusConfig;

interface AttendanceRecord {
  studentId: number | null;
  studentName: string;
  rollNo: number | null;
  status: string;
  date: string;
}

export default function AttendancePage() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedClass, setSelectedClass] = useState(5);
  const [records, setRecords] = useState<Record<number, AttendanceStatus>>({});
  const [existingRecords, setExistingRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Mock student data for display
  const mockStudents = [
    { id: 1, name: "Rahim Ahmed", rollNo: 1 },
    { id: 2, name: "Fatema Khatun", rollNo: 2 },
    { id: 3, name: "Karim Hossain", rollNo: 3 },
    { id: 4, name: "Nasrin Akter", rollNo: 4 },
    { id: 5, name: "Imran Khan", rollNo: 5 },
  ];

  useEffect(() => {
    // Initialize all as present
    const init: Record<number, AttendanceStatus> = {};
    mockStudents.forEach(s => { init[s.id] = "present"; });
    setRecords(init);
  }, [selectedClass, selectedDate]);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: AttendanceStatus) => {
    const all: Record<number, AttendanceStatus> = {};
    mockStudents.forEach(s => { all[s.id] = status; });
    setRecords(all);
  };

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.set("date", selectedDate);
    formData.set("classId", String(selectedClass));
    formData.set("markedBy", "1");
    for (const [id, status] of Object.entries(records)) {
      formData.set(`status_${id}`, status);
    }
    const result = await markAttendance(formData);
    if (result.success) toast.success(result.message);
    else toast.error(result.error);
    setSaving(false);
  };

  const stats = {
    present: mockStudents.filter(s => records[s.id] === "present").length,
    absent: mockStudents.filter(s => records[s.id] === "absent").length,
    late: mockStudents.filter(s => records[s.id] === "late").length,
    total: mockStudents.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Mark and track student attendance</p>
      </div>

      {/* Date & Class selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={today}
              className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(Number(e.target.value))}
              className="w-full h-9 rounded-lg border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            >
              {[1,2,3,4,5,6,7,8].map(i => <option key={i} value={i}>Class {i+5}</option>)}
            </select>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Quick Mark All</label>
            <div className="flex gap-1">
              <button onClick={() => markAll("present")} className="flex-1 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-medium border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors">Present</button>
              <button onClick={() => markAll("absent")} className="flex-1 h-9 rounded-lg bg-red-500/10 text-red-600 text-xs font-medium border border-red-500/30 hover:bg-red-500/20 transition-colors">Absent</button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Present", value: stats.present, color: "text-emerald-500" },
          { label: "Absent", value: stats.absent, color: "text-red-500" },
          { label: "Late", value: stats.late, color: "text-amber-500" },
          { label: "Total", value: stats.total, color: "text-foreground" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Class Attendance — {selectedDate}</CardTitle>
            <Badge variant="info">{mockStudents.length} students</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground w-10">#</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground">Student Name</th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockStudents.map((student, idx) => {
                  const currentStatus = records[student.id] ?? "present";
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-3 text-sm text-muted-foreground">{student.rollNo}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-foreground">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {(Object.keys(statusConfig) as AttendanceStatus[]).map(status => {
                            const config = statusConfig[status];
                            const isSelected = currentStatus === status;
                            return (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(student.id, status)}
                                className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all ${
                                  isSelected
                                    ? `${config.bg} ${config.color} scale-105`
                                    : "border-border text-muted-foreground hover:border-primary/30"
                                }`}
                              >
                                {config.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving} className="gap-2">
          <Save className="h-4 w-4" />
          Save Attendance
        </Button>
      </div>
    </div>
  );
}
