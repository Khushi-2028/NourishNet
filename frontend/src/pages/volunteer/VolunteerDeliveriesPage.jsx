import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiTruck } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchVolunteerActiveDeliveries, selectVolunteerActiveDeliveries, selectDeliveriesListStatus } from "../../features/deliveries/deliveriesSlice";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { DeliveryStatusBadge } from "../../components/common/StatusBadge";
import { SectionLoader } from "../../components/common/Spinner";
import { formatRelativeTime } from "../../utils/formatters";
import { motion } from "framer-motion";
import { DELIVERY_STATUS_ORDER } from "../../utils/constants";

const VolunteerDeliveriesPage = () => {
  const dispatch = useAppDispatch();
  const deliveries = useAppSelector(selectVolunteerActiveDeliveries);
  const listStatus = useAppSelector(selectDeliveriesListStatus);

  useEffect(() => { dispatch(fetchVolunteerActiveDeliveries()); }, [dispatch]);

  // Sort by status order
  const sorted = [...deliveries].sort((a, b) =>
    DELIVERY_STATUS_ORDER.indexOf(a.status) - DELIVERY_STATUS_ORDER.indexOf(b.status)
  );

  return (
    <div>
      <PageHeader title="My Deliveries" description="All your assigned deliveries and their current status." />
      {listStatus === "loading" && <SectionLoader />}
      {listStatus !== "loading" && sorted.length === 0 && (
        <EmptyState icon={FiTruck} title="No deliveries yet" description="When an NGO assigns you a delivery, it will appear here." />
      )}
      <div className="space-y-4">
        {sorted.map((d, i) => (
          <motion.div key={d._id} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
            className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <DeliveryStatusBadge status={d.status} />
                <span className="text-xs text-slate-400">{formatRelativeTime(d.createdAt)}</span>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                {d.pickupRequestId?.donationId?.title || "Delivery Task"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pickup: { d.pickupRequestId?.donationId?.pickupAddress || "—"}
              </p>
            </div>
            <Link to={`/volunteer/deliveries/${d._id}`} className="btn-primary btn-sm shrink-0">
              Manage Delivery
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerDeliveriesPage;
