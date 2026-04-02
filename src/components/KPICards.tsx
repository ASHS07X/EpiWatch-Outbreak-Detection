import { motion } from "framer-motion";
import { Users, Skull, HeartPulse, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface KPICardsProps {
  totalCases: number;
  totalDeaths: number;
  totalRecoveries: number;
}

function AnimatedCounter({ target, duration = 1.5 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [target, duration]);

  const formatted = count >= 1_000_000
    ? new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(count)
    : count.toLocaleString();
  return <span className="truncate">{formatted}</span>;
}

const cards = [
  { key: "cases", label: "Total Cases", icon: Users, colorClass: "text-neon-cyan", borderClass: "border-neon-cyan/30", bgClass: "bg-neon-cyan/10" },
  { key: "deaths", label: "Total Deaths", icon: Skull, colorClass: "text-neon-red", borderClass: "border-neon-red/30", bgClass: "bg-neon-red/10" },
  { key: "recoveries", label: "Total Recoveries", icon: HeartPulse, colorClass: "text-neon-green", borderClass: "border-neon-green/30", bgClass: "bg-neon-green/10" },
  { key: "rate", label: "Recovery Rate", icon: TrendingUp, colorClass: "text-neon-yellow", borderClass: "border-neon-yellow/30", bgClass: "bg-neon-yellow/10" },
] as const;

export default function KPICards({ totalCases, totalDeaths, totalRecoveries }: KPICardsProps) {
  const recoveryRate = totalCases > 0 ? ((totalRecoveries / totalCases) * 100) : 0;

  const values: Record<string, number> = {
    cases: totalCases,
    deaths: totalDeaths,
    recoveries: totalRecoveries,
    rate: 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`glass-card p-5 border ${card.borderClass} hover:neon-glow transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{card.label}</span>
            <div className={`w-9 h-9 rounded-lg ${card.bgClass} flex items-center justify-center`}>
              <card.icon className={`w-4 h-4 ${card.colorClass}`} />
            </div>
          </div>
          <p className={`text-2xl xl:text-3xl font-display font-bold ${card.colorClass} truncate`}>
            {card.key === "rate" ? (
              <>{recoveryRate.toFixed(1)}%</>
            ) : (
              <AnimatedCounter target={values[card.key]} />
            )}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
