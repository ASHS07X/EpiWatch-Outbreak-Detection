import Papa from "papaparse";

export interface OutbreakRecord {
  location: string;
  date: string;
  cases: number;
  deaths: number;
  recovered: number;
}

export function parseCSV(file: File): Promise<OutbreakRecord[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data: OutbreakRecord[] = results.data.map((row: any) => ({
          location: String(row.location || "").trim(),
          date: String(row.date || "").trim(),
          cases: parseInt(row.cases) || 0,
          deaths: parseInt(row.deaths) || 0,
          recovered: parseInt(row.recovered) || 0,
        }));
        resolve(data.filter((d) => d.location && d.date));
      },
      error: (err) => reject(err),
    });
  });
}

export function getUniqueLocations(data: OutbreakRecord[]): string[] {
  return [...new Set(data.map((d) => d.location))].sort();
}

export function getDateRange(data: OutbreakRecord[]): { min: string; max: string } {
  const dates = data.map((d) => d.date).sort();
  return { min: dates[0] || "", max: dates[dates.length - 1] || "" };
}

export function filterData(
  data: OutbreakRecord[],
  region?: string,
  startDate?: string,
  endDate?: string
): OutbreakRecord[] {
  return data.filter((d) => {
    if (region && region !== "all" && d.location !== region) return false;
    if (startDate && d.date < startDate) return false;
    if (endDate && d.date > endDate) return false;
    return true;
  });
}

export function aggregateByDate(data: OutbreakRecord[]) {
  const map = new Map<string, { cases: number; deaths: number; recovered: number }>();
  data.forEach((d) => {
    const existing = map.get(d.date) || { cases: 0, deaths: 0, recovered: 0 };
    existing.cases += d.cases;
    existing.deaths += d.deaths;
    existing.recovered += d.recovered;
    map.set(d.date, existing);
  });
  return Array.from(map.entries())
    .map(([date, vals]) => ({ date, ...vals }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function aggregateByRegion(data: OutbreakRecord[]) {
  const map = new Map<string, { cases: number; deaths: number; recovered: number }>();
  data.forEach((d) => {
    const existing = map.get(d.location) || { cases: 0, deaths: 0, recovered: 0 };
    existing.cases += d.cases;
    existing.deaths += d.deaths;
    existing.recovered += d.recovered;
    map.set(d.location, existing);
  });
  return Array.from(map.entries())
    .map(([location, vals]) => ({ location, ...vals }))
    .sort((a, b) => b.cases - a.cases);
}

// Geocode locations (approximate coordinates for demo)
const LOCATION_COORDS: Record<string, [number, number]> = {
  "New York": [40.7128, -74.006],
  "Los Angeles": [34.0522, -118.2437],
  Chicago: [41.8781, -87.6298],
  Houston: [29.7604, -95.3698],
  Phoenix: [33.4484, -112.074],
  Philadelphia: [39.9526, -75.1652],
  "San Antonio": [29.4241, -98.4936],
  "San Diego": [32.7157, -117.1611],
  Dallas: [32.7767, -96.797],
  "San Jose": [37.3382, -121.8863],
  Mumbai: [19.076, 72.8777],
  Delhi: [28.7041, 77.1025],
  Bangalore: [12.9716, 77.5946],
  London: [51.5074, -0.1278],
  Paris: [48.8566, 2.3522],
  Tokyo: [35.6762, 139.6503],
  Berlin: [52.52, 13.405],
  Sydney: [-33.8688, 151.2093],
  Toronto: [43.6532, -79.3832],
  Beijing: [39.9042, 116.4074],
  "São Paulo": [-23.5505, -46.6333],
  Moscow: [55.7558, 37.6173],
  Seoul: [37.5665, 126.978],
  Singapore: [1.3521, 103.8198],
  Dubai: [25.2048, 55.2708],
  Cairo: [30.0444, 31.2357],
  Lagos: [6.5244, 3.3792],
  "Mexico City": [19.4326, -99.1332],
  Bangkok: [13.7563, 100.5018],
  Istanbul: [41.0082, 28.9784],
};

export function getLocationCoords(location: string): [number, number] | null {
  return LOCATION_COORDS[location] || null;
}

export function getAlerts(data: OutbreakRecord[]) {
  const byRegion = aggregateByRegion(data);
  const avgCases = byRegion.reduce((s, r) => s + r.cases, 0) / (byRegion.length || 1);

  return byRegion
    .filter((r) => r.cases > avgCases * 1.5)
    .map((r) => ({
      location: r.location,
      cases: r.cases,
      deaths: r.deaths,
      severity: r.cases > avgCases * 3 ? "critical" as const : r.cases > avgCases * 2 ? "high" as const : "medium" as const,
      message: `${r.location} reports ${r.cases.toLocaleString()} cases — ${
        r.cases > avgCases * 3
          ? "CRITICAL outbreak level"
          : r.cases > avgCases * 2
          ? "High outbreak activity"
          : "Elevated case count"
      }`,
    }));
}
