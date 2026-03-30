import { motion } from "framer-motion";
import { Activity, Shield, BarChart3 } from "lucide-react";

interface LandingProps {
  onEnter: () => void;
}

export default function Landing({ onEnter }: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-cyan/5 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-purple/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(hsla(190, 100%, 50%, 0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-8"
        >
          <Activity className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-display font-bold tracking-wider mb-4 neon-text text-primary">
          EpiWatch
        </h1>

        <p className="text-xl md:text-2xl font-body font-light text-secondary-foreground mb-2 tracking-wide">
          Disease Outbreak Prediction & Monitoring System
        </p>

        <p className="text-muted-foreground font-mono text-sm mb-12 tracking-widest uppercase">
          Tracking Health. Preventing Outbreaks.
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsla(190, 100%, 50%, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="px-10 py-4 rounded-lg gradient-primary text-primary-foreground font-display font-semibold text-lg tracking-wider neon-glow transition-all duration-300"
        >
          Open Dashboard
        </motion.button>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: BarChart3, label: "Real-time Analytics", desc: "Live data visualization" },
            { icon: Shield, label: "Outbreak Detection", desc: "AI-powered alerts" },
            { icon: Activity, label: "Trend Monitoring", desc: "Predictive insights" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="glass-card neon-border p-6 text-center"
            >
              <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-display text-sm font-semibold text-foreground mb-1">{item.label}</h3>
              <p className="text-muted-foreground text-xs font-body">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
