import { Outlet } from "react-router-dom";
import { useState,useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { useAppSelector } from "../../store/hooks";
import { selectTheme } from "../../features/ui/uiSlice";
import ThemeToggle from "../common/ThemeToggle";
import publicApi from "../../api/publicApi";
const AuthLayout = () => {
  const [stats, setStats] = useState(null);

useEffect(() => {
  const loadStats = async () => {
    try {
      const { data } = await publicApi.getPublicStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load public stats", err);
    }
  };

  loadStats();
}, []);
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Left branding panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12 bg-gradient-to-br from-primary-600 to-accent-600">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/30"
              style={{
                width: 60 + i * 40,
                height: 60 + i * 40,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center text-white">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <FiHeart size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-display font-extrabold mb-4">
            NourishNet
          </h1>
          <p className="text-lg text-white/80 max-w-sm mx-auto leading-relaxed">
            Connecting donors, NGOs, and volunteers to eliminate food waste
            and nourish communities.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-8 text-center">
            {[
  {
    label: "Donations",
    value: stats ? stats.totalDonations : "..."
  },
  {
    label: "NGOs",
    value: stats ? stats.totalNGOs : "..."
  },
  {
    label: "Meals Served",
    value: stats ? stats.mealsDelivered : "..."
  },
  {
    label: "CO₂ Saved",
    value: stats ? stats.co2Saved : "..."
  }
].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-display font-bold">{s.value}</p>
                <p className="text-sm text-white/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <FiHeart className="text-white" size={15} />
            </div>
            <span className="font-display font-bold text-slate-900 dark:text-white">
              NourishNet
            </span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
