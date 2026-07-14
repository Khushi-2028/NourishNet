import { useEffect } from "react";
import { FiNavigation } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAdminVolunteers, selectAdminVolunteers, selectAdminStatus } from "../../features/admin/adminSlice";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import { formatDate } from "../../utils/formatters";

const AdminVolunteersPage = () => {
  const dispatch = useAppDispatch();
  const volunteers = useAppSelector(selectAdminVolunteers);
  const status = useAppSelector(selectAdminStatus);

  useEffect(() => { dispatch(fetchAdminVolunteers()); }, [dispatch]);

  const columns = [
    { key: "user", header: "Name", render: r => <span className="font-semibold text-slate-800 dark:text-slate-100">{r.userId?.name || "—"}</span> },
    { key: "email", header: "Email", render: r => <span className="text-sm text-slate-500">{r.userId?.email || "—"}</span> },
    { key: "phone", header: "Phone", render: r => <span className="text-sm">{r.phone || "—"}</span> },
    { key: "vehicleType", header: "Vehicle", render: r => <span className="capitalize text-sm">{r.vehicleType || "—"}</span> },
    { key: "createdAt", header: "Joined", render: r => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> }
  ];

  return (
    <div>
      <PageHeader title="Volunteers" description="View all registered delivery volunteers." />
      <DataTable columns={columns} data={volunteers} isLoading={status.volunteers === "loading"}
        pageSize={10} emptyTitle="No volunteers registered" emptyIcon={FiNavigation} />
    </div>
  );
};

export default AdminVolunteersPage;
