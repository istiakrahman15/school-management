"use client";

import { motion } from "framer-motion";
import {
  GraduationCap, Users, BookOpen, CalendarCheck,
  CreditCard, Bell, TrendingUp, TrendingDown,
  Clock, AlertCircle,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { DashboardStats, ChartData } from "@/types";

interface DashboardOverviewProps {
  stats: DashboardStats;
  attendanceTrend: ChartData[];
  feeData: ChartData[];
  upcomingExams: Array<{
    id: number;
    name: string;
    date?: string | null;
    type?: string | null;
    maxMarks?: number | null;
  }>;
}

const statCards = (stats: DashboardStats) => [
  {
    title: "Total Students",
    value: stats.totalStudents.toLocaleString(),
    icon: GraduationCap,
    color: "from-blue-500 to-indigo-600",
    glow: "glow-blue",
    trend: "+12 this month",
    trendUp: true,
  },
  {
    title: "Total Teachers",
    value: stats.totalTeachers.toLocaleString(),
    icon: Users,
    color: "from-emerald-500 to-teal-600",
    glow: "glow-green",
    trend: "+2 this month",
    trendUp: true,
  },
  {
    title: "Total Classes",
    value: stats.totalClasses.toLocaleString(),
    icon: BookOpen,
    color: "from-violet-500 to-purple-600",
    glow: "glow-purple",
    trend: "8 active",
    trendUp: true,
  },
  {
    title: "Attendance Today",
    value: `${stats.attendancePercentage}%`,
    icon: CalendarCheck,
    color: stats.attendancePercentage >= 80 ? "from-emerald-500 to-teal-600" : "from-orange-500 to-amber-600",
    glow: "glow-green",
    trend: stats.attendancePercentage >= 80 ? "Good today" : "Below target",
    trendUp: stats.attendancePercentage >= 80,
  },
  {
    title: "Fees Collected",
    value: formatCurrency(stats.feesCollected),
    icon: CreditCard,
    color: "from-blue-500 to-cyan-600",
    glow: "glow-blue",
    trend: "This month",
    trendUp: true,
  },
  {
    title: "Pending Fees",
    value: formatCurrency(stats.pendingFees),
    icon: AlertCircle,
    color: "from-orange-500 to-red-500",
    glow: "glow-orange",
    trend: "Needs attention",
    trendUp: false,
  },
  {
    title: "Upcoming Exams",
    value: stats.upcomingExams.toLocaleString(),
    icon: Clock,
    color: "from-violet-500 to-pink-600",
    glow: "glow-purple",
    trend: "This term",
    trendUp: true,
  },
  {
    title: "Notices",
    value: stats.publishedNotices.toLocaleString(),
    icon: Bell,
    color: "from-amber-500 to-orange-600",
    glow: "glow-orange",
    trend: "Published",
    trendUp: true,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } },
} as const;

const CustomTooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  color: "hsl(var(--foreground))",
  fontSize: "13px",
};

export function DashboardOverview({ stats, attendanceTrend, feeData, upcomingExams }: DashboardOverviewProps) {
  const cards = statCards(stats);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Welcome back! 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening at your school today.
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={item}>
              <Card className={`overflow-hidden ${card.glow} transition-all hover:scale-[1.02]`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${card.trendUp ? "text-emerald-500" : "text-orange-500"}`}>
                      {card.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    </div>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground leading-none">{card.value}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-1">{card.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 opacity-70">{card.trend}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Attendance Trend</CardTitle>
                <Badge variant="success">This Week</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceTrend}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={CustomTooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Area type="monotone" dataKey="present" stroke="hsl(142 76% 36%)" fill="url(#colorPresent)" strokeWidth={2} dot={false} name="Present" />
                    <Area type="monotone" dataKey="absent" stroke="hsl(0 84% 60%)" fill="url(#colorAbsent)" strokeWidth={2} dot={false} name="Absent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fee Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Fee Collection</CardTitle>
                <Badge variant="info">Last 6 Months</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={feeData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={CustomTooltipStyle}
                      formatter={(v: any) => [`৳${Number(v || 0).toLocaleString()}`, "Collected"]}
                    />
                    <Bar dataKey="collected" name="Collected" radius={[6, 6, 0, 0]}>
                      {feeData.map((_, index) => (
                        <rect
                          key={index}
                          fill={`url(#barGrad${index % 2})`}
                        />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="barGrad0" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(220 90% 60%)" />
                        <stop offset="100%" stopColor="hsl(270 80% 60%)" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Exams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingExams.length === 0 ? (
                <p className="text-sm text-muted-foreground px-6 py-4">No upcoming exams scheduled.</p>
              ) : (
                <div className="divide-y divide-border">
                  {upcomingExams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between px-6 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{exam.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {exam.date ? formatDate(exam.date) : "Date TBD"} · Max: {exam.maxMarks ?? 100} marks
                        </p>
                      </div>
                      <Badge variant={exam.type === "final" ? "destructive" : exam.type === "mid_term" ? "warning" : "info"} className="capitalize">
                        {(exam.type ?? "exam").replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">School Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Attendance Rate", value: stats.attendancePercentage, color: "bg-emerald-500" },
                {
                  label: "Fees Collection Rate",
                  value: stats.feesCollected + stats.pendingFees > 0
                    ? Math.round((stats.feesCollected / (stats.feesCollected + stats.pendingFees)) * 100)
                    : 0,
                  color: "bg-blue-500",
                },
                {
                  label: "Teacher Satisfaction",
                  value: 88,
                  color: "bg-violet-500",
                },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-foreground">{metric.label}</p>
                    <p className="text-xs font-bold text-foreground">{metric.value}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${metric.color} transition-all duration-700`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
