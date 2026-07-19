"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { Bell, Plus, Calendar, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function NoticesPage() {
  const [notices] = useState([
    { id: 1, title: "Mid-Term Exam Schedule Released", content: "The mid-term examination schedule for all classes has been published. Please check the exam section for details.", audience: "all", priority: "high", date: "2026-07-19" },
    { id: 2, title: "Parent-Teacher Meeting Notice", content: "A parent-teacher meeting is scheduled for July 30, 2026. Parents are requested to attend to discuss child academic performance.", audience: "parents", priority: "medium", date: "2026-07-18" },
    { id: 3, title: "Library Book Return Reminder", content: "All students who have borrowed library books are requested to return them before the vacation.", audience: "students", priority: "low", date: "2026-07-15" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Notice Board</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Post announcements to students, teachers, or parents</p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Create Notice
        </Button>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id} className="glass-card hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={notice.priority === "high" ? "destructive" : notice.priority === "medium" ? "warning" : "secondary"}>
                    {notice.priority} Priority
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    Audience: {notice.audience}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(notice.date)}</span>
                </div>
              </div>
              <CardTitle className="text-base mt-2">{notice.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{notice.content}</p>
              <div className="flex justify-end pt-2 border-t border-border/50">
                <Button size="sm" variant="ghost" className="text-xs gap-1">
                  <Eye className="h-3.5 w-3.5" /> View Announcement
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
