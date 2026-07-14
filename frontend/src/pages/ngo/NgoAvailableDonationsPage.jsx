import { useEffect } from "react";
import { FiPackage,  FiMapPin, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAvailableDonations, selectAvailableDonations,
  selectNgoListStatus } from "../../features/ngo/ngoSlice";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonGrid } from "../../components/common/Skeleton";
import { resolveImageUrl, formatDate } from "../../utils/formatters";
import { useNavigate } from "react-router-dom";

const NgoAvailableDonationsPage = () => {
  const dispatch = useAppDispatch();
  const donations = useAppSelector(selectAvailableDonations);
  const listStatus = useAppSelector(selectNgoListStatus);
const navigate = useNavigate();
  useEffect(() => { dispatch(fetchAvailableDonations()); },
   [dispatch]);

  return (
    <div>
      <PageHeader title="Available Donations" description="Browse and accept food donations ready for pickup." />
      {listStatus === "loading" && <SkeletonGrid count={6} />}
      {listStatus !== "loading" && donations.length === 0 && (
        <EmptyState icon={FiPackage} title="No available donations" description="New donations will appear here in real-time." />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {donations.map((d, i) => (
          <motion.div key={d._id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
            className="card card-hover overflow-hidden">
            <div className="h-36 bg-gradient-to-br from-orange-100 to-emerald-50 dark:from-slate-800 dark:to-slate-800">
              {d.images?.[0]
                ? <img src={resolveImageUrl(d.images[0])} className="w-full h-full object-cover" alt="" />
                : <div className="w-full h-full flex items-center justify-center"><FiPackage size={32} className="text-slate-300" /></div>}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{d.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{d.foodType} · {d.quantity} {d.unit}</p>
              <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                <FiMapPin size={11} />{d.pickupAddress?.slice(0,40)}…
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                <FiClock size={11} />Expires {formatDate(d.expiryTime)}
              </div>
              <div className="mt-4">
  <Button
    size="sm"
    className="w-full"
    onClick={() =>
      navigate(`/ngo/pickup/${d._id}`)
    }
  >
    Create Pickup Request
  </Button>
</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NgoAvailableDonationsPage;
