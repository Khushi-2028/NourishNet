import { useEffect } from "react";
import { Link,useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import { FiTruck, FiNavigation } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchNgoActiveDeliveries, selectNgoActiveDeliveries, selectDeliveriesListStatus } from "../../features/deliveries/deliveriesSlice";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { DeliveryStatusBadge } from "../../components/common/StatusBadge";
import { SectionLoader } from "../../components/common/Spinner";
import { formatRelativeTime } from "../../utils/formatters";
import { motion } from "framer-motion";

const NgoDeliveriesPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const deliveries = useAppSelector(selectNgoActiveDeliveries);
  const listStatus = useAppSelector(selectDeliveriesListStatus);

  useEffect(() => { dispatch(fetchNgoActiveDeliveries()); }, [dispatch]);

  return(
    <div>
      <PageHeader title="Active Deliveries" description="Track all ongoing deliveries in real-time." />
      {listStatus === "loading" && <SectionLoader />}
      {listStatus !== "loading" && deliveries.length === 0 && (
        <EmptyState icon={FiTruck} title="No active deliveries"
          description="Assign volunteers to accepted donations to see deliveries here."
          action={<Link to="/ngo/accepted-donations" className="btn-primary inline-flex">Go to Accepted Donations</Link>} />
      )}
      <div className="space-y-4">
  {deliveries.map((d, i) => {

  console.log("Delivery:", d);
console.log("Delivery _id:", d._id);
console.log("Proof:", d.proofImage);

  console.log("ngoId =", d.ngoId);

  console.log("pickupRequestId =", d.pickupRequestId);

  return (     
<motion.div
key={d._id} initial={{ opacity: 0, y: 6 }}
animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
 whileHover={{ scale: 1.01 }} onClick={() => {
 if (d.proofImage) {navigate(`/ngo/deliveries/${d._id}/confirm`);
} else {
 toast("Volunteer hasn't uploaded proof yet.");}}}
className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer">  
<div className="flex-1 min-w-0">
<div className="flex items-center gap-3 mb-2 flex-wrap">
<DeliveryStatusBadge status={d.status} />
<span className="text-xs text-slate-400">
 {formatRelativeTime(d.createdAt)} </span>
{d.proofImage ? (
<div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
 Proof Uploaded </div>) : (
 <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
 Waiting for Proof</div>)}
</div>  
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
          {d.pickupRequestId?.donationId?.title || "Donation Delivery"}  
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
               Volunteer:
{d.volunteerId?.userId?.name || "Not Assigned"}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
<Link
to={`/ngo/deliveries/${d._id}/assign`} onClick={(e) => e.stopPropagation()}
className="btn-outline btn-sm">Assign</Link>

<Link
  to={`/ngo/deliveries/${d._id}/track`}
  state={{
      ngoId:
    typeof d.ngoId === "object"
      ? d.ngoId._id
      : d.ngoId
  }}
  onClick={(e) => {
    e.stopPropagation();
    const ngoId =
        typeof d.ngoId === "object"
            ? d.ngoId._id
            : d.ngoId;

    console.log("TRACK CLICK");
    console.log("Delivery:", d._id);
    console.log("Sending ngoId:", ngoId);}}
  className="btn-primary btn-sm gap-1.5"
><FiNavigation size={13} />Track
</Link>  {d.proofImage && (
    <Link
      to={`/ngo/deliveries/${d._id}/confirm`}
      onClick={(e) => e.stopPropagation()}
      className="btn-success btn-sm"
    >
      View Proof
    </Link>
  )}
            </div>
          </motion.div>
  );
        })}
      </div>
    </div>
  );
};

export default NgoDeliveriesPage;
