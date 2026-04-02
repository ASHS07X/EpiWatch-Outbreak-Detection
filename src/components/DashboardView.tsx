import { useData } from "@/context/DataContext";
import { filterData, aggregateByDate, aggregateByRegion } from "@/lib/csv-parser";
import KPICards from "./KPICards";
import Charts from "./Charts";
import OutbreakMap from "./OutbreakMap";
import Filters from "./Filters";
import { Database } from "lucide-react";

export default function DashboardView() {
  const { data, isLoaded, selectedRegion, startDate, endDate } = useData();

  if (!isLoaded) {
    return (
      <div className="glass-card neon-border p-16 text-center">
        <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-pulse-glow" />
        <p className="text-foreground font-display text-lg mb-2">No Dataset Loaded</p>
        <p className="text-muted-foreground font-mono text-sm">
          Please upload a dataset to view analytics.
        </p>
      </div>
    );
  }

  const filtered = filterData(data, selectedRegion, startDate, endDate);
  const dailyData = aggregateByDate(filtered);
  const regionData = aggregateByRegion(filtered);

  const totalCases = filtered.reduce((s, d) => s + d.cases, 0);
  const totalDeaths = filtered.reduce((s, d) => s + d.deaths, 0);
  const totalRecoveries = filtered.reduce((s, d) => s + d.recovered, 0);
  const recoveryRate = totalCases > 0 ? (totalRecoveries / totalCases) * 100 : 0;

  return (
    <div className="space-y-4">
      <Filters />
      <KPICards totalCases={totalCases} totalDeaths={totalDeaths} totalRecoveries={totalRecoveries} />
      <Charts dailyData={dailyData} regionData={regionData} />
      <OutbreakMap data={filtered} />
    </div>
  );
}
