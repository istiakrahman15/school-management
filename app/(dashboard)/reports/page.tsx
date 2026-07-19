"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { BarChart3, Download, FileSpreadsheet, FileJson, Clock } from "lucide-react";

export default function ReportsPage() {
  const [reports] = useState([
    { id: 1, name: "Student Enrolment Summary", type: "enrolment", format: "PDF / Excel", lastGenerated: "2026-07-19" },
    { id: 2, name: "Attendance Monthly Statistics", type: "attendance", format: "PDF / Excel", lastGenerated: "2026-07-18" },
    { id: 3, name: "Fees Collection Overview", type: "finance", format: "PDF / Excel", lastGenerated: "2026-07-19" },
    { id: 4, name: "Examination Grade Analytics", type: "exam", format: "PDF", lastGenerated: "2026-07-15" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Report Generator</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Export academic, attendance, and finance summaries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="glass-card hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">
                  {report.type}
                </Badge>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Last: {report.lastGenerated}</span>
                </div>
              </div>
              <CardTitle className="text-base mt-2">{report.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">Supported format: {report.format}</p>
              <div className="flex gap-2 pt-2 border-t border-border/50">
                <Button size="sm" variant="outline" className="flex-1 text-xs gap-1">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Export Excel
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs gap-1">
                  <FileJson className="h-4 w-4 text-red-500" /> Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
