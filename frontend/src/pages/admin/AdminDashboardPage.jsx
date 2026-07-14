import { useEffect } from "react";
import { FiUsers, FiPackage, FiTruck, FiHeart, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAdminDashboard, fetchAdminAnalytics, selectAdminDashboard, selectAdminAnalytics, selectAdminStatus } from "../../features/admin/adminSlice";
import StatCard from "../../components/common/StatCard";
import PageHeader from "../../components/common/PageHeader";
import { SkeletonStatCard } from "../../components/common/Skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AdminDashboardPage = () => {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector(selectAdminDashboard);
  const analytics = useAppSelector(selectAdminAnalytics);
  const status = useAppSelector(selectAdminStatus);
  const isLoading = status.dashboard === "loading";

  useEffect(() => {
    dispatch(fetchAdminDashboard());
    dispatch(fetchAdminAnalytics());
  }, [dispatch]);

  const chartData = analytics ? [
    { name: "This Month", Donations: analytics.donationsThisMonth || 0, Deliveries: analytics.deliveriesThisMonth || 0 }
  ] : [];

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Platform-wide overview and key metrics." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <StatCard icon={FiUsers} label="Total Users" value={dashboard?.totalUsers || 0} color="primary" />
            <StatCard icon={FiHeart} label="Active NGOs" value={analytics?.activeNGOs || dashboard?.totalNGOs|| 0} color="blue" />
            <StatCard icon={FiPackage} label="Total Donations" value={dashboard?.totalDonations || 0} color="accent" />
            <StatCard icon={FiTruck} label="Active Volunteers" value={analytics?.activeVolunteers || dashboard?.totalVolunteers || 0} color="violet" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Analytics chart */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-slate-800 dark:text-slate-100 mb-4">Monthly Activity</h2>
          {analytics ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Donations This Month", value: analytics.donationsThisMonth || 0, color: "text-primary-600" },
                  { label: "Deliveries This Month", value: analytics.deliveriesThisMonth || 0, color: "text-accent-600" },
                  { label: "Food Saved (kg)", value: analytics.foodSavedKg || 0, color: "text-blue-600" },
                  { label: "Meals Served", value: analytics.mealsServed || 0, color: "text-violet-600" }
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <p className={`text-xl font-display font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-40 skeleton rounded-xl" />
          )}
        </div>

        {/* Quick stats */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-slate-800 dark:text-slate-100 mb-4">Platform Stats</h2>
          {dashboard ? (
            <div className="space-y-3">
              {[
                { label: "Total Donations", value: dashboard.totalDonations || 0 },
                { label: "Total Deliveries", value: dashboard.totalDeliveries || 0 },
                { label: "Total NGOs", value: dashboard.totalNGOs || 0 },
                { label: "Total Volunteers", value: dashboard.totalVolunteers || 0 },
                { label: "Total Users", value: dashboard.totalUsers || 0 }
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <span className="text-sm text-slate-600 dark:text-slate-300">{row.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{row.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">{Array.from({length:5}).map((_,i) => <div key={i} className="skeleton h-8 rounded-lg" />)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
