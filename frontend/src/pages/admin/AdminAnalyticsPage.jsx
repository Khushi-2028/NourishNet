import { useEffect } from "react";
import { FiBarChart2, FiActivity, FiHeart, FiTruck, FiPackage} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAdminAnalytics, fetchAdminEnvironment, selectAdminAnalytics, selectAdminEnvironment, selectAdminStatus } from "../../features/admin/adminSlice";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { SkeletonStatCard } from "../../components/common/Skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

const AdminAnalyticsPage = () => {
  const dispatch = useAppDispatch();
  const analytics = useAppSelector(selectAdminAnalytics);
  const environment = useAppSelector(selectAdminEnvironment);
  const status = useAppSelector(selectAdminStatus);

  useEffect(() => {
    dispatch(fetchAdminAnalytics());
    dispatch(fetchAdminEnvironment());
  }, [dispatch]);

  const isLoading = status.analytics === "loading";

  const barData = analytics ? [
    { name: "This Month", Donations: analytics.donationsThisMonth || 0, Deliveries: analytics.deliveriesThisMonth || 0 }
  ] : [];

  const pieData = analytics ? [
    { name: "Food Saved (kg)", value: analytics.foodSavedKg || 0 },
    { name: "Meals Served", value: analytics.mealsServed || 0 }
  ].filter(d => d.value > 0) : [];

  const envData = environment ? [
    { label: "Food Waste Prevented", value: environment.foodWastePreventedKg || 0, suffix: "kg", icon: FiPackage, color: "accent" },
    { label: "Meals Served", value: environment.mealsServed || 0, suffix: "", icon: FiHeart, color: "primary" },
    { label: "CO₂ Reduced", value: environment.co2ReductionKg || 0, suffix: "kg", icon: FiActivity, color: "blue" },
    { label: "Trees Equivalent", value: environment.treesEquivalent || 0, suffix: "", icon: FiPackage, color: "violet" }
  ] : [];

  return (
    <div>
      <PageHeader title="Analytics" description="Platform performance and environmental impact metrics." />

      {/* Main analytics stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({length:4}).map((_,i) => <SkeletonStatCard key={i} />)
        ) : analytics ? (
          <>
            <StatCard icon={FiPackage} label="Food Saved (kg)" value={analytics.foodSavedKg || 0} color="primary" suffix="kg" />
            <StatCard icon={FiHeart} label="Meals Served" value={analytics.mealsServed || 0} color="accent" />
            <StatCard icon={FiTruck} label="Active Volunteers" value={analytics.activeVolunteers || 0} color="blue" />
            <StatCard icon={FiBarChart2} label="Active NGOs" value={analytics.activeNGOs || 0} color="violet" />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Bar chart */}
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mb-4">Monthly Activity</h3>
          {analytics && barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Donations" fill="#f97316" radius={[4,4,0,0]} />
                <Bar dataKey="Deliveries" fill="#10b981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="skeleton h-48 rounded-xl" />}
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mb-4">Impact Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={e => e.name}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="skeleton h-48 rounded-xl" />}
        </div>
      </div>

      {/* Environmental impact */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <FiActivity className="text-accent-500" size={20} /> Environmental Impact
        </h3>
        {status.environment === "loading" ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({length:4}).map((_,i) => <SkeletonStatCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {envData.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-accent-50 to-emerald-50 dark:from-accent-950/20 dark:to-emerald-950/20 text-center">
                <p className="text-2xl font-display font-extrabold text-accent-700 dark:text-accent-400">
                  {item.value}{item.suffix}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.label}</p>
              </motion.div>
            ))}
            {envData.length === 0 && <p className="text-slate-400 col-span-4 text-sm text-center py-6">No environmental data yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
