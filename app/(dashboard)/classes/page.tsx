"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { Settings, Plus, BookOpen, User, Clock } from "lucide-react";

export default function ClassesPage() {
  const [classes] = useState([
    { id: 1, name: "Class 10", section: "A", teacher: "Mr. Karim Rahman", capacity: 40, year: "2026-2027" },
    { id: 2, name: "Class 10", section: "B", teacher: "Ms. Fatema Begum", capacity: 40, year: "2026-2027" },
    { id: 3, name: "Class 9", section: "A", teacher: "Mr. Hasan Ali", capacity: 45, year: "2026-2027" },
    { id: 4, name: "Class 8", section: "A", teacher: "Ms. Nusrat Jahan", capacity: 45, year: "2026-2027" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Class Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage class sections, capacity, and assigned class teachers</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {classes.map((cls) => (
          <Card key={cls.id} className="glass-card hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline">Section {cls.section}</Badge>
                <span className="text-[10px] text-muted-foreground font-mono">{cls.year}</span>
              </div>
              <CardTitle className="text-xl mt-2">{cls.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-muted-foreground space-y-1.5">
                <p className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Advisor: <span className="text-foreground font-semibold">{cls.teacher}</span></p>
                <p className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Capacity: <span className="text-foreground font-semibold">{cls.capacity} Students</span></p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-border/50">
                <Button size="sm" className="flex-1 text-xs">Timetable</Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs">Subjects</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
