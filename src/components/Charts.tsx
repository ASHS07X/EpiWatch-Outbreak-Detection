import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

interface ChartsProps {
  dailyData: { date: string; cases: number; deaths: number; recovered: number }[];
  regionData: { location: string; cases: number; deaths: number; recovered: number }[];
}

const tooltipStyle = {
  contentStyle: {
    background: "hsla(222, 40%, 10%, 0.95)",
    border: "1px solid hsla(220, 30%, 22%, 1)",
    borderRadius: "8px",
    fontFamily: "Rajdhani, sans-serif",
    color: "hsl(200, 100%, 95%)",
  },
};

export default function Charts({ dailyData, regionData }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card neon-border p-5"
      >
        <h3 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wider">
          Daily Cases Trend
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(220,30%,22%,0.5)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(210,20%,55%)", fontSize: 11, fontFamily: "Share Tech Mono" }} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fill: "hsl(210,20%,55%)", fontSize: 11, fontFamily: "Share Tech Mono" }} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="cases" stroke="hsl(190,100%,50%)" strokeWidth={2} dot={false} name="Cases" />
              <Line type="monotone" dataKey="deaths" stroke="hsl(0,100%,60%)" strokeWidth={2} dot={false} name="Deaths" />
              <Line type="monotone" dataKey="recovered" stroke="hsl(150,100%,50%)" strokeWidth={2} dot={false} name="Recovered" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card neon-border p-5"
      >
        <h3 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wider">
          Region-wise Cases
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(220,30%,22%,0.5)" />
              <XAxis dataKey="location" tick={{ fill: "hsl(210,20%,55%)", fontSize: 11, fontFamily: "Share Tech Mono" }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fill: "hsl(210,20%,55%)", fontSize: 11, fontFamily: "Share Tech Mono" }} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              <Bar dataKey="cases" fill="hsl(190,100%,50%)" radius={[4, 4, 0, 0]} name="Cases" />
              <Bar dataKey="deaths" fill="hsl(0,100%,60%)" radius={[4, 4, 0, 0]} name="Deaths" />
              <Bar dataKey="recovered" fill="hsl(150,100%,50%)" radius={[4, 4, 0, 0]} name="Recovered" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
