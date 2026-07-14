import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAdminNGOs, approveAdminNGO, rejectAdminNGO, selectAdminNGOs, selectAdminStatus } from "../../features/admin/adminSlice";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import { NgoStatusBadge } from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import { formatDate } from "../../utils/formatters";

const AdminNGOsPage = () => {
  const dispatch = useAppDispatch();
  const ngos = useAppSelector(selectAdminNGOs);
  const status = useAppSelector(selectAdminStatus);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => { dispatch(fetchAdminNGOs()); }, [dispatch]);

  const handleApprove = async (id) => {
    setActionLoading(p => ({ ...p, [id]: "approve" }));
    const result = await dispatch(approveAdminNGO(id));
    setActionLoading(p => ({ ...p, [id]: null }));
    if (approveAdminNGO.fulfilled.match(result)) toast.success("NGO approved.");
    else toast.error(result.payload || "Failed.");
  };

  const handleReject = async (id) => {
    setActionLoading(p => ({ ...p, [id]: "reject" }));
    const result = await dispatch(rejectAdminNGO(id));
    setActionLoading(p => ({ ...p, [id]: null }));
    if (rejectAdminNGO.fulfilled.match(result)) toast.success("NGO rejected.");
    else toast.error(result.payload || "Failed.");
  };

  const columns = [
    { key: "organisationName", header: "Organisation",
      render: r => <span className="font-semibold text-slate-800 dark:text-slate-100">{r.organisationName || r.userId?.name || "—"}</span> },
    { key: "user", header: "Contact",
      render: r => <span className="text-sm text-slate-500">{r.userId?.email || r.email || "—"}</span> },
    { key: "approvalStatus", header: "Status", render: r => <NgoStatusBadge status={r.approvalStatus} /> },
    { key: "createdAt", header: "Applied", render: r => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
    {
      key: "actions", header: "Actions",
      render: r => (
        <div className="flex gap-2">
          {r.approvalStatus !== "approved" && (
            <Button size="sm" variant="secondary" loading={actionLoading[r._id]==="approve"}
              onClick={() => handleApprove(r._id)}>Approve</Button>
          )}
          {r.approvalStatus !== "rejected" && (
            <Button size="sm" variant="danger" loading={actionLoading[r._id]==="reject"}
              onClick={() => handleReject(r._id)}>Reject</Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader title="NGOs" description="Review and manage NGO registrations." />
      <DataTable columns={columns} data={ngos} isLoading={status.ngos === "loading"}
        pageSize={10} emptyTitle="No NGOs registered" emptyIcon={FiHeart} />
    </div>
  );
};

export default AdminNGOsPage;
