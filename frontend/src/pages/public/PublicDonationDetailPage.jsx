import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiMapPin, FiClock } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchDonationById, selectCurrentDonation } from "../../features/donations/donationsSlice";
import { DonationStatusBadge } from "../../components/common/StatusBadge";
import { SectionLoader } from "../../components/common/Spinner";
import { formatDate, resolveImageUrl } from "../../utils/formatters";

const PublicDonationDetailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const donation = useAppSelector(selectCurrentDonation);
  const status = useAppSelector(s => s.donations.detailStatus);

  useEffect(() => {

    if (!id || id === "new") return;

    dispatch(fetchDonationById(id));

}, [dispatch, id]);

  if (status === "loading") return <SectionLoader />;
  if (!donation) return null;

  return (
    <div className="min-h-screen bg-orange-50/40 dark:bg-surface-dark py-8">
      <div className="page-container">
        <Link to="/donations" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6">
          <FiArrowLeft size={16} /> Back to Donations
        </Link>
        <div className="card overflow-hidden">
          <div className="h-56 sm:h-72 bg-gradient-to-br from-orange-100 to-emerald-50 dark:from-slate-800 dark:to-slate-800">
            {donation.images?.[0] ? (
              <img src={resolveImageUrl(donation.images[0])} alt={donation.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><FiPackage size={56} className="text-slate-300" /></div>
            )}
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{donation.title}</h1>
              <DonationStatusBadge status={donation.status} />
            </div>
            <p className="text-slate-600 dark:text-slate-300">{donation.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><FiPackage size={16} className="text-primary-500" /> {donation.quantity} {donation.unit}</div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><FiMapPin size={16} className="text-primary-500" /> {donation.pickupAddress}</div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><FiClock size={16} className="text-primary-500" /> Expires {formatDate(donation.expiryTime)}</div>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link to="/register" className="btn-primary">Register to Accept This Donation</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDonationDetailPage;
