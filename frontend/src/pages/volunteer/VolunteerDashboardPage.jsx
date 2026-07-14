import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiTruck, FiCheckCircle, FiNavigation, FiStar } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchVolunteerDashboard, selectVolunteerDashboard, selectVolunteerDashboardStatus } from "../../features/volunteer/volunteerSlice";
import { fetchVolunteerActiveDeliveries, selectVolunteerActiveDeliveries } from "../../features/deliveries/deliveriesSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import StatCard from "../../components/common/StatCard";
import PageHeader from "../../components/common/PageHeader";
import { SkeletonStatCard } from "../../components/common/Skeleton";
import { DeliveryStatusBadge } from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import { formatRelativeTime } from "../../utils/formatters";
import { motion } from "framer-motion";

const VolunteerDashboardPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const dashboard = useAppSelector(selectVolunteerDashboard);
  const dashStatus = useAppSelector(selectVolunteerDashboardStatus);
  const activeDeliveries = useAppSelector(selectVolunteerActiveDeliveries);
console.log("Volunteer Deliveries");
console.log(activeDeliveries);
  useEffect(() => {
    dispatch(fetchVolunteerDashboard());
    dispatch(fetchVolunteerActiveDeliveries());
  }, [dispatch]);

  return (
    <div>
      <PageHeader
        title={`Hey, ${user?.name?.split(" ")[0]} 🚴`}
        description="Your delivery overview and active assignments."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {dashStatus === "loading" ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <StatCard icon={FiCheckCircle} label="Completed Deliveries" value={dashboard?.completedDeliveries || 0} color="accent" />
            <StatCard icon={FiNavigation} label="Distance Covered" value={dashboard?.distanceCovered || 0} color="blue" suffix="km" />
            <StatCard icon={FiStar} label="Rating" value={dashboard?.rating ? dashboard.rating.toFixed(1) : "N/A"} color="amber" />
            <StatCard icon={FiTruck}label="Today's Tasks"value={activeDeliveries.length}color="primary"/>
          </>
        )}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-slate-800 dark:text-slate-100">Active Deliveries</h2>
          <Link to="/volunteer/deliveries" className="text-sm font-semibold text-primary-600 hover:text-primary-700">View all</Link>
        </div>
        {activeDeliveries.length === 0 && dashStatus !== "loading" && (
          <EmptyState icon={FiTruck} title="No active deliveries" description="You'll see assigned deliveries here. Stay ready!" />
        )}
        <div className="space-y-3">
          {activeDeliveries.slice(0, 5).map((d, i) => (
            <motion.div key={d._id} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                  {d.pickupRequestId?.donationId?.title || "Delivery Task"}
                </p>
                <p className="text-xs text-slate-400">{formatRelativeTime(d.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <DeliveryStatusBadge status={d.status} />
                <Link to={`/volunteer/deliveries/${d._id}`} className="btn-primary btn-sm">Open</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboardPage;
