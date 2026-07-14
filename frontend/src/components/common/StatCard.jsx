import { motion } from "framer-motion";
import { cn } from "../../utils/cn";
import { formatNumber } from "../../utils/formatters";

const COLOR_MAP = {
  primary: "from-primary-500 to-primary-600",
  accent: "from-accent-500 to-accent-600",
  blue: "from-blue-500 to-blue-600",
  violet: "from-violet-500 to-violet-600",
  amber: "from-amber-500 to-amber-600",
  rose: "from-rose-500 to-rose-600"
};

const StatCard = ({ icon: Icon, label, value, color = "primary", suffix = "", trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="stat-card card-hover"
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shrink-0 shadow-glow",
          COLOR_MAP[color]
        )}
      >
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
          {label}
        </p>
        <p className="text-2xl font-display font-bold text-slate-900 dark:text-white mt-0.5">
          {typeof value === "number" ? formatNumber(value) : value}
          {suffix && (
            <span className="text-sm font-medium text-slate-400 ml-1">
              {suffix}
            </span>
          )}
        </p>
        {trend && (
          <p
            className={cn(
              "text-xs font-medium mt-1",
              trend.positive ? "text-accent-600" : "text-rose-500"
            )}
          >
            {trend.label}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
