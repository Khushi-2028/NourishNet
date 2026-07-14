import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiFilter } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchDonations, selectDonationsList, selectDonationsListStatus, selectDonationsMeta } from "../../features/donations/donationsSlice";
import { DonationStatusBadge } from "../../components/common/StatusBadge";
import { SkeletonGrid } from "../../components/common/Skeleton";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import { resolveImageUrl, formatRelativeTime } from "../../utils/formatters";
import { FOOD_TYPES } from "../../utils/constants";
import { FiPackage } from "react-icons/fi";

const PublicDonationsPage = () => {
  const dispatch = useAppDispatch();
  const donations = useAppSelector(selectDonationsList);
  const status = useAppSelector(selectDonationsListStatus);
  const { page, pages } = useAppSelector(selectDonationsMeta);
  const [search, setSearch] = useState("");
  const [foodType, setFoodType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchDonations({ page: currentPage, limit: 12, search, foodType, status: "available" }));
  }, [dispatch, currentPage, search, foodType]);

  return (
    <div className="min-h-screen bg-orange-50/40 dark:bg-surface-dark">
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-12 px-6 text-center">
        <h1 className="text-3xl font-display font-extrabold mb-2">Available Donations</h1>
        <p className="text-white/80">Browse food donations available for pickup near you.</p>
      </div>
      <div className="page-container py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input className="input pl-10" placeholder="Search donations..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
          </div>
          <select className="input w-full sm:w-48" value={foodType} onChange={e => { setFoodType(e.target.value); setCurrentPage(1); }}>
            <option value="">All Types</option>
            {FOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {status === "loading" && <SkeletonGrid count={12} />}
        {status !== "loading" && donations.length === 0 && (
          <EmptyState icon={FiPackage} title="No donations found" description="Try adjusting your search filters." />
        )}
        {status !== "loading" && donations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {donations.map(d => (
              <motion.div key={d._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card card-hover overflow-hidden">
                <div className="h-36 bg-gradient-to-br from-orange-100 to-emerald-50 dark:from-slate-800 dark:to-slate-800 relative">
                  {d.images?.[0] ? (
                    <img src={resolveImageUrl(d.images[0])} alt={d.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                      <FiPackage size={36} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <DonationStatusBadge status={d.status} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{d.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{d.foodType} · {d.quantity} {d.unit}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatRelativeTime(d.createdAt)}</p>
                  <Link to={`/donations/${d._id}`} className="btn-outline w-full mt-3 text-sm btn-sm">View Details</Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <Pagination page={page} pages={pages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default PublicDonationsPage;
