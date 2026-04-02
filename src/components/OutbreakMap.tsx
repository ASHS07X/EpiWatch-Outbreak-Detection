import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { getLocationCoords, OutbreakRecord } from "@/lib/csv-parser";
import { useData } from "@/context/DataContext";

interface OutbreakMapProps {
  data: OutbreakRecord[];
}

interface LatestRegionRecord {
  location: string;
  date: string;
  cases: number;
  deaths: number;
  recovered: number;
}

function getLatestRegionData(data: OutbreakRecord[]): LatestRegionRecord[] {
  const latestByLocation = new Map<string, LatestRegionRecord>();

  data.forEach((record) => {
    const existing = latestByLocation.get(record.location);
    if (!existing || record.date > existing.date) {
      latestByLocation.set(record.location, record);
    }
  });

  return Array.from(latestByLocation.values()).filter((record) => getLocationCoords(record.location));
}

export default function OutbreakMap({ data }: OutbreakMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { selectedRegion } = useData();

  const regions = useMemo(() => getLatestRegionData(data), [data]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    let center: [number, number] = [20, 0];
    let zoom = 2;

    if (selectedRegion && selectedRegion !== "all") {
      const coords = getLocationCoords(selectedRegion);
      if (coords) {
        center = coords;
        zoom = 5;
      }
    }

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    const maxCases = Math.max(...regions.map((region) => region.cases), 1);

    regions.forEach((region) => {
      const coords = getLocationCoords(region.location);
      if (!coords) return;

      const intensity = region.cases / maxCases;
      const color =
        intensity > 0.7
          ? "hsl(0, 100%, 60%)"
          : intensity > 0.4
            ? "hsl(45, 100%, 55%)"
            : "hsl(150, 100%, 50%)";

      const radius = Math.max(8, Math.min(40, intensity * 40));

      L.circleMarker(coords, {
        radius,
        fillColor: color,
        color,
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.35,
      })
        .bindPopup(
          `<div style="font-family: Rajdhani, sans-serif; color: #1a1a2e;">
            <strong style="font-family: Orbitron, sans-serif; font-size: 14px;">${region.location}</strong><br/>
            <span>Date: <b>${region.date}</b></span><br/>
            <span>Cases: <b>${region.cases.toLocaleString()}</b></span><br/>
            <span>Deaths: <b>${region.deaths.toLocaleString()}</b></span><br/>
            <span>Recovered: <b>${region.recovered.toLocaleString()}</b></span>
          </div>`
        )
        .addTo(map);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [regions, selectedRegion]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card neon-border p-5"
    >
      <h3 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wider">
        Outbreak Heatmap
      </h3>
      <div ref={mapRef} className="h-80 rounded-lg overflow-hidden" />
      <div className="flex items-center gap-4 mt-3 text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-neon-green inline-block" /> Low
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-neon-yellow inline-block" /> Medium
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-neon-red inline-block" /> High
        </span>
      </div>
    </motion.div>
  );
}

