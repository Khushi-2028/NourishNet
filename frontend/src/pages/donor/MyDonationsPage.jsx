import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlusCircle, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchDonations, deleteDonation, selectDonationsList, selectDonationsListStatus, selectDonationsMeta } from "../../features/donations/donationsSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import SearchInput from "../../components/common/SearchInput";
import { DonationStatusBadge } from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonGrid } from "../../components/common/Skeleton";
import { formatDate, resolveImageUrl, truncate } from "../../utils/formatters";
import { motion } from "framer-motion";
import useDebounce from "../../hooks/useDebounce";

const MyDonationsPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const allDonations = useAppSelector(selectDonationsList);
  const listStatus = useAppSelector(selectDonationsListStatus);
  const { page, pages } = useAppSelector(selectDonationsMeta);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(fetchDonations({ page: currentPage, limit: 12, search: debouncedSearch }));
  }, [dispatch, currentPage, debouncedSearch]);

  // Filter client-side to show only the current user's donations
  const donations = allDonations.filter(
    d => {
        if (!d.donorId) return false;

        if (typeof d.donorId === "string") {
            return d.donorId === user?.id;
        }

        return d.donorId._id === user?.id;
    }
);

  const handleDelete = async () => {
    setDeleting(true);
    const result = await dispatch(deleteDonation(deleteId));
    setDeleting(false);
    setDeleteId(null);
    if (deleteDonation.fulfilled.match(result)) toast.success("Donation deleted.");
    else toast.error(result.payload || "Failed to delete.");
  };

  return (
    <div>
      <PageHeader title="My Donations" description="Manage all your food donations."
        actions={<Link to="/donor/create"><Button icon={FiPlusCircle}>New Donation</Button></Link>} />

      <div className="mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search your donations..." className="max-w-sm" />
      </div>

      {listStatus === "loading" && <SkeletonGrid count={6} />}
      {listStatus !== "loading" && donations.length === 0 && (
        <EmptyState icon={FiPackage} title="No donations yet" description="Create your first donation and help reduce food waste."
          action={<Link to="/donor/create"><Button>Create Donation</Button></Link>} />
      )}

      {listStatus !== "loading" && donations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {donations.map((d, i) => (
            <motion.div key={d._id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.04 }}
              className="card card-hover overflow-hidden">
              <div className="h-36 bg-gradient-to-br from-orange-100 to-emerald-50 dark:from-slate-800 dark:to-slate-800 relative">
                {d.images?.[0]
                  ? <img src={resolveImageUrl(d.images[0])} className="w-full h-full object-cover" alt="" />
                  : <div className="w-full h-full flex items-center justify-center"><FiPackage size={32} className="text-slate-300" /></div>}
                <div className="absolute top-2 right-2"><DonationStatusBadge status={d.status} /></div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{d.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{truncate(d.description, 60)}</p>
                <p className="text-xs text-slate-400 mt-1">{d.quantity} {d.unit} · {formatDate(d.createdAt)}</p>
                <div className="flex gap-2 mt-3">
                  <Link to={`/donor/donations/${d._id}`} className="btn-outline btn-sm flex-1 text-center">View</Link>
                  {(d.status === "available") && (
                    <Link to={`/donor/donations/${d._id}/edit`} className="btn-ghost btn-sm p-2"><FiEdit2 size={15} /></Link>
                  )}
                  <button onClick={() => setDeleteId(d._id)} className="btn-ghost btn-sm p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"><FiTrash2 size={15} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Pagination page={page} pages={pages} onPageChange={setCurrentPage} />

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Donation" description="This will permanently remove the donation. This action cannot be undone."
        confirmLabel="Delete" loading={deleting} />
    </div>
  );
};

export default MyDonationsPage;
