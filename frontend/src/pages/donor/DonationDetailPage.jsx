import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiMapPin, FiClock, FiPackage, FiCalendar } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchDonationById, selectCurrentDonation } from "../../features/donations/donationsSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { DonationStatusBadge } from "../../components/common/StatusBadge";
import { SectionLoader } from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import { formatDate, formatDateTime, resolveImageUrl } from "../../utils/formatters";
import { motion } from "framer-motion";

const DonationDetailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const donation = useAppSelector(selectCurrentDonation);
  const status = useAppSelector(s => s.donations.detailStatus);
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {

    if (!id || id === "new") return;

    dispatch(fetchDonationById(id));

}, [dispatch, id]);

  if (status === "loading") return <SectionLoader />;
  if (!donation) return null;

  const isOwner = donation.donor?._id === user?.id || donation.donor === user?.id;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-5">
        <FiArrowLeft size={16} /> Back
      </button>
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="card overflow-hidden max-w-3xl">
        {donation.images?.length > 0 && (
          <div className="flex gap-3 p-4 overflow-x-auto bg-slate-50 dark:bg-slate-800/50">
            {donation.images.map((img, i) => (
              <img key={i} src={resolveImageUrl(img)} alt="" className="h-44 w-auto rounded-xl object-cover shrink-0" />
            ))}
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{donation.title}</h1>
            <DonationStatusBadge status={donation.status} />
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-6">{donation.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <InfoRow icon={FiPackage} label="Food Type" value={donation.foodType} />
            <InfoRow icon={FiPackage} label="Quantity" value={`${donation.quantity} ${donation.unit}`} />
            <InfoRow icon={FiMapPin} label="Pickup Address" value={donation.pickupAddress} />
            <InfoRow icon={FiCalendar} label="Prepared" value={formatDateTime(donation.preparationTime)} />
            <InfoRow icon={FiClock} label="Expires" value={formatDateTime(donation.expiryTime)} />
            <InfoRow icon={FiCalendar} label="Posted" value={formatDate(donation.createdAt)} />
          </div>
          {isOwner && donation.status === "available" && (
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link to={`/donor/donations/${id}/edit`}><Button icon={FiEdit2} variant="outline">Edit Donation</Button></Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div>
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
      <Icon size={14} className="text-primary-500 shrink-0" />
      <span className="text-sm">{value}</span>
    </div>
  </div>
);

export default DonationDetailPage;
