import { Activity, Database, BarChart3, Map, Shield, Upload } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Upload, title: "CSV Data Upload", desc: "Upload disease outbreak data in CSV format for instant analysis." },
  { icon: BarChart3, title: "Interactive Charts", desc: "Line and bar charts visualize daily trends and regional distribution." },
  { icon: Map, title: "Outbreak Heatmap", desc: "Geographic visualization with color-coded intensity markers." },
  { icon: Shield, title: "Alert System", desc: "Automatic detection of high-risk regions and sudden case surges." },
  { icon: Database, title: "Data Processing", desc: "Client-side data parsing and aggregation for instant results." },
  { icon: Activity, title: "Real-time KPIs", desc: "Animated counters for total cases, deaths, and recoveries." },
];

const stack = [
  { name: "React", desc: "UI framework" },
  { name: "TypeScript", desc: "Type safety" },
  { name: "Tailwind CSS", desc: "Styling" },
  { name: "Recharts", desc: "Charts & graphs" },
  { name: "Leaflet", desc: "Interactive maps" },
  { name: "Framer Motion", desc: "Animations" },
  { name: "PapaParse", desc: "CSV parsing" },
  { name: "Vite", desc: "Build tool" },
];

export default function AboutSection() {
  return (
    <div className="space-y-6">
      <div className="glass-card neon-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground tracking-wider">EpiWatch</h2>
            <p className="text-xs font-mono text-muted-foreground">Disease Outbreak Prediction & Monitoring System</p>
          </div>
        </div>
        <p className="font-body text-secondary-foreground leading-relaxed">
          EpiWatch is a healthcare Big Data analytics dashboard designed to visualize and analyze disease outbreak data. 
          Users can upload CSV datasets containing location-based case data, and the system generates comprehensive 
          visualizations including trend charts, regional comparisons, geographic heatmaps, and automated alerts for 
          high-risk regions. Built as a demonstration of modern web technologies for health data analytics.
        </p>
      </div>

      <div>
        <h3 className="font-display text-sm font-semibold text-foreground tracking-wider mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card neon-border p-5 hover:neon-glow transition-all duration-300"
            >
              <f.icon className="w-6 h-6 text-primary mb-3" />
              <h4 className="font-display text-xs font-semibold text-foreground mb-1">{f.title}</h4>
              <p className="text-xs font-body text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-card neon-border p-6">
        <h3 className="font-display text-sm font-semibold text-foreground tracking-wider mb-4">Technology Stack</h3>
        <div className="flex flex-wrap gap-2">
          {stack.map((t) => (
            <span
              key={t.name}
              className="px-3 py-1.5 rounded-full bg-secondary border border-border text-xs font-mono text-secondary-foreground"
              title={t.desc}
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
