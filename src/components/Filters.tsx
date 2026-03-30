import { useData } from "@/context/DataContext";
import { getUniqueLocations, getDateRange } from "@/lib/csv-parser";
import { Filter } from "lucide-react";

export default function Filters() {
  const { data, selectedRegion, setSelectedRegion, startDate, setStartDate, endDate, setEndDate } = useData();

  const locations = getUniqueLocations(data);
  const dateRange = getDateRange(data);

  return (
    <div className="glass-card neon-border p-4 flex flex-wrap items-center gap-4">
      <Filter className="w-4 h-4 text-primary shrink-0" />
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Region</label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-secondary border border-border rounded-md px-3 py-1.5 text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Regions</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Start Date</label>
        <input
          type="date"
          value={startDate || dateRange.min}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-secondary border border-border rounded-md px-3 py-1.5 text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">End Date</label>
        <input
          type="date"
          value={endDate || dateRange.max}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-secondary border border-border rounded-md px-3 py-1.5 text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
