"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { Plus, Search, Edit, Trash2, Calendar, ClipboardCheck } from "lucide-react";

export default function ExamsPage() {
  const [exams] = useState([
    { id: 1, name: "Mid-Term Exam 2026", type: "mid_term", date: "2026-07-25", class: "Class 10", subject: "All Subjects", status: "upcoming" },
    { id: 2, name: "Mathematics Quiz 1", type: "quiz", date: "2026-07-22", class: "Class 10", subject: "Mathematics", status: "upcoming" },
    { id: 3, name: "English Oral Test", type: "assignment", date: "2026-07-20", class: "Class 8", subject: "English", status: "completed" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Exams & Grading</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Schedule exams and manage grade submission</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Add Exam
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <Card key={exam.id} className="glass-card hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant={exam.status === "completed" ? "secondary" : "info"} className="capitalize">
                  {exam.status}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {exam.type.replace("_", " ")}
                </Badge>
              </div>
              <CardTitle className="text-base mt-2">{exam.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Class: <span className="text-foreground font-medium">{exam.class}</span></p>
                <p>Subject: <span className="text-foreground font-medium">{exam.subject}</span></p>
                <p>Date: <span className="text-foreground font-medium">{exam.date}</span></p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button size="sm" variant="outline" className="flex-1 text-xs gap-1">
                  <ClipboardCheck className="h-3.5 w-3.5" /> Enter Marks
                </Button>
                <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
