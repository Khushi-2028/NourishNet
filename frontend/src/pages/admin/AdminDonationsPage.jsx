import { useEffect, useState } from "react";
import { FiPackage, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAdminDonations, deleteAdminDonation, selectAdminDonations, selectAdminStatus } from "../../features/admin/adminSlice";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { DonationStatusBadge } from "../../components/common/StatusBadge";
import { formatDate } from "../../utils/formatters";

const AdminDonationsPage = () => {
  const dispatch = useAppDispatch();
  const donations = useAppSelector(selectAdminDonations);
  const status = useAppSelector(selectAdminStatus);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { dispatch(fetchAdminDonations()); }, [dispatch]);

  const handleDelete = async () => {
    setDeleting(true);
    const result = await dispatch(deleteAdminDonation(deleteId));
    setDeleting(false);
    setDeleteId(null);
    if (deleteAdminDonation.fulfilled.match(result)) toast.success("Donation deleted.");
    else toast.error(result.payload || "Failed.");
  };

  const columns = [
    { key: "title", header: "Title", render: r => <span className="font-semibold text-slate-800 dark:text-slate-100">{r.title}</span> },
    { key: "foodType", header: "Type", render: r => <span className="text-sm">{r.foodType}</span> },
    { key: "quantity", header: "Qty", render: r => <span className="text-sm">{r.quantity} {r.unit}</span> },
    { key: "status", header: "Status", render: r => <DonationStatusBadge status={r.status} /> },
    { key: "donor", header: "Donor", render: r => <span className="text-xs text-slate-500">{r.donorId?.name || "—"}</span> },
    { key: "createdAt", header: "Date", render: r => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
    { key: "actions", header: "", render: r => (
      <button onClick={() => setDeleteId(r._id)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
        <FiTrash2 size={14} />
      </button>
    )}
  ];

  return (
    <div>
      <PageHeader title="Donations" description="All platform donations." />
      <DataTable columns={columns} data={donations} isLoading={status.donations === "loading"}
        pageSize={10} emptyTitle="No donations found" emptyIcon={FiPackage} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Donation" description="This action cannot be undone." loading={deleting} />
    </div>
  );
};

export default AdminDonationsPage;
