import Papa from "papaparse";

export interface OutbreakRecord {
  location: string;
  date: string;
  cases: number;
  deaths: number;
  recovered: number;
}

function normalizeRow(row: any): OutbreakRecord {
  const location = String(row.location || row.country || "").trim();
  const date = String(row.date || "").trim();
  const cases = Number(row.total_cases ?? row.cases ?? row.new_cases ?? 0) || 0;
  const deaths = Number(row.total_deaths ?? row.deaths ?? row.new_deaths ?? 0) || 0;
  const rawRecovered = row.recovered ?? row.total_recovered;
  const recovered = rawRecovered != null && rawRecovered !== ""
    ? Number(rawRecovered) || 0
    : Math.max(cases - deaths, 0);
  return { location, date, cases, deaths, recovered };
}

export function parseCSV(file: File): Promise<OutbreakRecord[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data
          .map((row: any) => normalizeRow(row))
          .filter((d) => d.location && d.date);
        resolve(data);
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

// Country coordinate mapping for heatmap markers
const LOCATION_COORDS: Record<string, [number, number]> = {
  India: [20.5937, 78.9629],
  USA: [37.0902, -95.7129],
  "United States": [37.0902, -95.7129],
  Brazil: [-14.235, -51.9253],
  UK: [55.3781, -3.436],
  "United Kingdom": [55.3781, -3.436],
  China: [35.8617, 104.1954],
  France: [46.6034, 1.8883],
  Germany: [51.1657, 10.4515],
  Italy: [41.8719, 12.5674],
  Spain: [40.4637, -3.7492],
  Russia: [61.524, 105.3188],
  Japan: [36.2048, 138.2529],
  "South Korea": [35.9078, 127.7669],
  Canada: [56.1304, -106.3468],
  Australia: [-25.2744, 133.7751],
  Mexico: [23.6345, -102.5528],
  Indonesia: [-0.7893, 113.9213],
  Turkey: [38.9637, 35.2433],
  "Saudi Arabia": [23.8859, 45.0792],
  "South Africa": [-30.5595, 22.9375],
  Argentina: [-38.4161, -63.6167],
  Colombia: [4.5709, -74.2973],
  Nigeria: [9.082, 8.6753],
  Egypt: [26.8206, 30.8025],
  Pakistan: [30.3753, 69.3451],
  Bangladesh: [23.685, 90.3563],
  Thailand: [15.87, 100.9925],
  Vietnam: [14.0583, 108.2772],
  Iran: [32.4279, 53.688],
  Philippines: [12.8797, 121.774],
  Malaysia: [4.2105, 101.9758],
  Peru: [-9.19, -75.0152],
  Chile: [-35.6751, -71.543],
  Poland: [51.9194, 19.1451],
  Netherlands: [52.1326, 5.2913],
  Belgium: [50.8503, 4.3517],
  Sweden: [60.1282, 18.6435],
  Switzerland: [46.8182, 8.2275],
  Austria: [47.5162, 14.5501],
  Portugal: [39.3999, -8.2245],
  Greece: [39.0742, 21.8243],
  Israel: [31.0461, 34.8516],
  Ukraine: [48.3794, 31.1656],
  Romania: [45.9432, 24.9668],
  Kenya: [-0.0236, 37.9062],
  Ethiopia: [9.145, 40.4897],
  Ghana: [7.9465, -1.0232],
  Tanzania: [-6.369, 34.8888],
  Iraq: [33.2232, 43.6793],
  Afghanistan: [33.9391, 67.71],
  Nepal: [28.3949, 84.124],
  "Sri Lanka": [7.8731, 80.7718],
  Myanmar: [21.9162, 95.956],
  Cuba: [21.5218, -77.7812],
  Morocco: [31.7917, -7.0926],
  Algeria: [28.0339, 1.6596],
  Tunisia: [33.8869, 9.5375],
  Jordan: [30.5852, 36.2384],
  Lebanon: [33.8547, 35.8623],
  "New Zealand": [-40.9006, 174.886],
  Norway: [60.472, 8.4689],
  Denmark: [56.2639, 9.5018],
  Finland: [61.9241, 25.7482],
  Ireland: [53.1424, -7.6921],
  "Czech Republic": [49.8175, 15.473],
  Hungary: [47.1625, 19.5033],
};

const coordsLookup = new Map<string, [number, number]>();
Object.entries(LOCATION_COORDS).forEach(([key, val]) => {
  coordsLookup.set(key.toLowerCase(), val);
});

export function getLocationCoords(location: string): [number, number] | null {
  return coordsLookup.get(location.toLowerCase()) || null;
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
