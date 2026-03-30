import React, { createContext, useContext, useState, useCallback } from "react";
import { OutbreakRecord } from "@/lib/csv-parser";

interface DataContextType {
  data: OutbreakRecord[];
  setData: (data: OutbreakRecord[]) => void;
  clearData: () => void;
  isLoaded: boolean;
  selectedRegion: string;
  setSelectedRegion: (r: string) => void;
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setDataState] = useState<OutbreakRecord[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const setData = useCallback((d: OutbreakRecord[]) => setDataState(d), []);
  const clearData = useCallback(() => {
    setDataState([]);
    setSelectedRegion("all");
    setStartDate("");
    setEndDate("");
  }, []);

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        clearData,
        isLoaded: data.length > 0,
        selectedRegion,
        setSelectedRegion,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
