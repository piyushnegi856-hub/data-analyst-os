// Server component — fetches stats server-side, zero client drift
import { getSprintStats } from "@/lib/data";
import { getResourcesByWeek } from "@/lib/resources";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardOverview() {
  const stats = await getSprintStats();
  const weekResources = getResourcesByWeek(stats.currentWeek).slice(0, 3);

  return (
    <DashboardClient
      stats={stats}
      weekResources={weekResources}
    />
  );
}
