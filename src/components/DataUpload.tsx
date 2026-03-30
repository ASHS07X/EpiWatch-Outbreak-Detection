import { useRef, useState } from "react";
import { useData } from "@/context/DataContext";
import { parseCSV, OutbreakRecord } from "@/lib/csv-parser";
import { Upload, Trash2, Play, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function DataUpload() {
  const { data, setData, clearData } = useData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rawData, setRawData] = useState<OutbreakRecord[]>([]);
  const [fileName, setFileName] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await parseCSV(file);
      setRawData(parsed);
      setFileName(file.name);
      toast.success(`Loaded ${parsed.length} records from ${file.name}`);
    } catch {
      toast.error("Failed to parse CSV file");
    }
  };

  const processData = () => {
    if (rawData.length === 0) {
      toast.error("No data to process. Upload a CSV first.");
      return;
    }
    setData(rawData);
    toast.success("Data processed! Dashboard updated.");
  };

  const deleteData = () => {
    setRawData([]);
    setFileName("");
    clearData();
    if (fileRef.current) fileRef.current.value = "";
    toast.info("All data cleared.");
  };

  const displayData = rawData.length > 0 ? rawData : data;

  return (
    <div className="space-y-6">
      <div className="glass-card neon-border p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-1 tracking-wider">Data Upload</h2>
        <p className="text-xs font-mono text-muted-foreground mb-6">
          CSV Format: location, date, cases, deaths, recovered
        </p>

        <div className="flex flex-wrap gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-primary text-primary-foreground font-display text-sm font-semibold tracking-wider hover:opacity-90 transition-opacity">
            <Upload className="w-4 h-4" />
            Upload CSV
            <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
          </label>

          <button
            onClick={processData}
            disabled={rawData.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neon-green/20 border border-neon-green/30 text-neon-green font-display text-sm font-semibold tracking-wider hover:bg-neon-green/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            Process Data
          </button>

          <button
            onClick={deleteData}
            disabled={rawData.length === 0 && data.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neon-red/20 border border-neon-red/30 text-neon-red font-display text-sm font-semibold tracking-wider hover:bg-neon-red/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Delete Data
          </button>
        </div>

        {fileName && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <FileSpreadsheet className="w-4 h-4 text-primary" />
            {fileName} — {rawData.length} records
          </div>
        )}
      </div>

      {displayData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card neon-border overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <h3 className="font-display text-sm font-semibold text-foreground tracking-wider">
              Data Preview ({displayData.length} records)
            </h3>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="px-4 py-2 text-left font-mono text-xs text-muted-foreground uppercase">#</th>
                  <th className="px-4 py-2 text-left font-mono text-xs text-muted-foreground uppercase">Location</th>
                  <th className="px-4 py-2 text-left font-mono text-xs text-muted-foreground uppercase">Date</th>
                  <th className="px-4 py-2 text-right font-mono text-xs text-muted-foreground uppercase">Cases</th>
                  <th className="px-4 py-2 text-right font-mono text-xs text-muted-foreground uppercase">Deaths</th>
                  <th className="px-4 py-2 text-right font-mono text-xs text-muted-foreground uppercase">Recovered</th>
                </tr>
              </thead>
              <tbody>
                {displayData.slice(0, 100).map((row, i) => (
                  <tr key={i} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-2 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-2 text-foreground">{row.location}</td>
                    <td className="px-4 py-2 text-muted-foreground font-mono text-xs">{row.date}</td>
                    <td className="px-4 py-2 text-right text-neon-cyan">{row.cases.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-neon-red">{row.deaths.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-neon-green">{row.recovered.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
