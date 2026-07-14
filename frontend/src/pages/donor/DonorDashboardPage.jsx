import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiCheckCircle, FiTrendingUp, FiPlusCircle } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchDonationStats, fetchDonations, selectDonationStats, selectDonationsList, selectDonationsListStatus } from "../../features/donations/donationsSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import StatCard from "../../components/common/StatCard";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { SkeletonStatCard } from "../../components/common/Skeleton";
import { DonationStatusBadge } from "../../components/common/StatusBadge";
import { formatDate, resolveImageUrl } from "../../utils/formatters";
import { motion } from "framer-motion";
import EmptyState from "../../components/common/EmptyState";

const DonorDashboardPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const stats = useAppSelector(selectDonationStats);
  const donations = useAppSelector(selectDonationsList);
  const listStatus = useAppSelector(selectDonationsListStatus);

  useEffect(() => {
    dispatch(fetchDonationStats());
    dispatch(fetchDonations({ limit: 6 }));
  }, [dispatch]);

  const myDonations = donations.filter((d) => {
    if (!d.donorId) return false;

    if (typeof d.donorId === "string") {
        return d.donorId === user?.id;
    }

    return d.donorId._id === user?.id;
});

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0]} 👋`}
        description="Here's how your donations are making an impact."
        actions={
          <Link to="/donor/create">
            <Button icon={FiPlusCircle}>Create Donation</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {!stats ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <StatCard icon={FiPackage} label="Total Donations" value={stats.totalDonations || 0} color="primary" />
            <StatCard icon={FiCheckCircle} label="Delivered" value={stats.delivered || 0} color="accent" />
            <StatCard icon={FiTrendingUp} label="Food Saved (kg)" value={stats.foodSaved || 0} color="blue" suffix="kg" />
          </>
        )}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-slate-800 dark:text-slate-100">Recent Donations</h2>
          <Link to="/donor/donations" className="text-sm font-semibold text-primary-600 hover:text-primary-700">View all</Link>
        </div>
        {listStatus === "loading" && <div className="space-y-3">{Array.from({length:4}).map((_,i)=><div key={i} className="skeleton h-16 rounded-xl"/>)}</div>}
        {listStatus !== "loading" && myDonations.length === 0 && (
          <EmptyState icon={FiPackage} title="No donations yet" description="Create your first donation to get started." action={<Link to="/donor/create"><Button>Create Donation</Button></Link>} />
        )}
        {listStatus !== "loading" && myDonations.slice(0,6).map((d, i) => (
          <motion.div key={d._id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.05 }}
            className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-emerald-50 dark:from-slate-800 dark:to-slate-800 shrink-0 overflow-hidden">
              {d.images?.[0] ? <img src={resolveImageUrl(d.images[0])} className="w-full h-full object-cover" alt="" /> : <FiPackage className="m-3 text-slate-400" size={24} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{d.title}</p>
              <p className="text-xs text-slate-400">{d.quantity} {d.unit} · {formatDate(d.createdAt)}</p>
            </div>
            <DonationStatusBadge status={d.status} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DonorDashboardPage;
