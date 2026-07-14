import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchNgoDashboard, selectNgoDashboard, selectNgoDashboardStatus } from "../../features/dashboard/dashboardSlice";
import { fetchNgoStats, selectNgoStats } from "../../features/ngo/ngoSlice";
import { fetchNgoActiveDeliveries, selectNgoActiveDeliveries } from "../../features/deliveries/deliveriesSlice";
import StatCard from "../../components/common/StatCard";
import PageHeader from "../../components/common/PageHeader";
import { SkeletonStatCard } from "../../components/common/Skeleton";
import { DeliveryStatusBadge } from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import { formatRelativeTime } from "../../utils/formatters";
import { motion } from "framer-motion";

const NgoDashboardPage = () => {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector(selectNgoDashboard);
  const dashStatus = useAppSelector(selectNgoDashboardStatus);
  const stats = useAppSelector(selectNgoStats);
  const activeDeliveries = useAppSelector(selectNgoActiveDeliveries);

  useEffect(() => {
    dispatch(fetchNgoDashboard());
    dispatch(fetchNgoStats());
    dispatch(fetchNgoActiveDeliveries());
  }, [dispatch]);

  const isLoading = dashStatus === "loading";

  return (
    <div>
      <PageHeader title="NGO Dashboard" description="Overview of your food distribution operations." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array.from({length:4}).map((_,i) => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <StatCard icon={FiPackage} label="Accepted Donations" value={stats?.acceptedDonations || dashboard?.acceptedDonations || 0} color="primary" />
            <StatCard icon={FiClock} label="Pending Pickups" value={dashboard?.pendingPickups || stats?.pickupRequests || 0} color="amber" />
            <StatCard icon={FiTruck} label="Active Deliveries" value={dashboard?.activeDeliveries || 0} color="blue" />
            <StatCard icon={FiCheckCircle} label="Completed Deliveries" value={dashboard?.completedDeliveries || 0} color="accent" />
          </>
        )}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-slate-800 dark:text-slate-100">Active Deliveries</h2>
          <Link to="/ngo/deliveries" className="text-sm font-semibold text-primary-600 hover:text-primary-700">View all</Link>
        </div>
        {activeDeliveries.length === 0 && !isLoading && (
          <EmptyState icon={FiTruck} title="No active deliveries" description="Accept donations and assign volunteers to see deliveries here." />
        )}
        <div className="space-y-3">
          {activeDeliveries.slice(0,5).map((d, i) => (
            <motion.div key={d._id} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{d.pickupRequest?.donation?.title || "Donation"}</p>
                <p className="text-xs text-slate-400 mt-0.5">{formatRelativeTime(d.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <DeliveryStatusBadge status={d.status} />
                <Link to={`/ngo/deliveries/${d._id}/track`} className="btn-ghost btn-sm text-xs">Track</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NgoDashboardPage;
