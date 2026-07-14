import { useEffect } from "react";
import { FiTruck } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAdminDeliveries, selectAdminDeliveries, selectAdminStatus } from "../../features/admin/adminSlice";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import { DeliveryStatusBadge } from "../../components/common/StatusBadge";
import { formatDate } from "../../utils/formatters";

const AdminDeliveriesPage = () => {
  const dispatch = useAppDispatch();
  const deliveries = useAppSelector(selectAdminDeliveries);
  const status = useAppSelector(selectAdminStatus);

  useEffect(() => { dispatch(fetchAdminDeliveries()); }, [dispatch]);

  const columns = [
    { key: "donation", header: "Donation", render: r => <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{r.donationId?.title || "Deleted Donation"}</span> },
    { key: "volunteer", header: "Volunteer", render: r => <span className="text-sm text-slate-500">{r.volunteerId?.userId?.name || "Deleted Volunteer"}</span> },
    { key: "status", header: "Status", render: r => <DeliveryStatusBadge status={r.status} /> },
    { key: "createdAt", header: "Assigned", render: r => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
    { key: "updatedAt", header: "Last Update", render: r => <span className="text-xs text-slate-500">{formatDate(r.updatedAt)}</span> }
  ];

  return (
    <div>
      <PageHeader title="Deliveries" description="All delivery records across the platform." />
      <DataTable columns={columns} data={deliveries} isLoading={status.deliveries === "loading"}
        pageSize={10} emptyTitle="No deliveries found" emptyIcon={FiTruck} />
    </div>
  );
};

export default AdminDeliveriesPage;
