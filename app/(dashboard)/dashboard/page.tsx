import { Suspense } from "react";
import { getDashboardStats, getAttendanceTrend, getFeeCollectionData, getUpcomingExams } from "@/actions/dashboard";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { Skeleton } from "@/components/ui";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const [stats, attendanceTrend, feeData, upcomingExams] = await Promise.all([
    getDashboardStats(),
    getAttendanceTrend(),
    getFeeCollectionData(),
    getUpcomingExams(),
  ]);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardOverview
        stats={stats}
        attendanceTrend={attendanceTrend}
        feeData={feeData}
        upcomingExams={upcomingExams}
      />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}
