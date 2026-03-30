import { useData } from "@/context/DataContext";
import { getAlerts } from "@/lib/csv-parser";
import { AlertTriangle, ShieldAlert, Siren } from "lucide-react";
import { motion } from "framer-motion";

const SEVERITY_CONFIG = {
  critical: { icon: Siren, colorClass: "text-neon-red", borderClass: "border-neon-red/40", bgClass: "bg-neon-red/10", label: "CRITICAL" },
  high: { icon: ShieldAlert, colorClass: "text-neon-yellow", borderClass: "border-neon-yellow/40", bgClass: "bg-neon-yellow/10", label: "HIGH" },
  medium: { icon: AlertTriangle, colorClass: "text-primary", borderClass: "border-primary/40", bgClass: "bg-primary/10", label: "MEDIUM" },
};

export default function AlertsPanel() {
  const { data, isLoaded } = useData();

  if (!isLoaded) {
    return (
      <div className="glass-card neon-border p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-body text-lg">No data loaded.</p>
        <p className="text-muted-foreground/60 font-mono text-xs mt-1">Upload a dataset to view alerts.</p>
      </div>
    );
  }

  const alerts = getAlerts(data);

  if (alerts.length === 0) {
    return (
      <div className="glass-card neon-border p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-neon-green/10 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8 text-neon-green" />
        </div>
        <p className="text-neon-green font-display text-lg font-semibold">All Clear</p>
        <p className="text-muted-foreground font-mono text-xs mt-1">No high-risk regions detected.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass-card neon-border p-5">
        <h2 className="font-display text-lg font-semibold text-foreground tracking-wider mb-1">Outbreak Alerts</h2>
        <p className="text-xs font-mono text-muted-foreground">{alerts.length} region(s) flagged</p>
      </div>

      {alerts.map((alert, i) => {
        const config = SEVERITY_CONFIG[alert.severity];
        return (
          <motion.div
            key={alert.location}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card border ${config.borderClass} p-5`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg ${config.bgClass} flex items-center justify-center shrink-0`}>
                <config.icon className={`w-5 h-5 ${config.colorClass}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-sm font-semibold text-foreground">{alert.location}</span>
                  <span className={`text-[10px] font-mono ${config.colorClass} ${config.bgClass} px-2 py-0.5 rounded-full`}>
                    {config.label}
                  </span>
                </div>
                <p className="text-sm font-body text-muted-foreground">{alert.message}</p>
                <div className="flex gap-4 mt-2 text-xs font-mono text-muted-foreground">
                  <span>Cases: <span className="text-neon-cyan">{alert.cases.toLocaleString()}</span></span>
                  <span>Deaths: <span className="text-neon-red">{alert.deaths.toLocaleString()}</span></span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
