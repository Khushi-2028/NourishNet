import { useEffect, useState } from "react";
import { FiActivity } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAdminAuditLogs, selectAdminAuditLogs, selectAdminStatus } from "../../features/admin/adminSlice";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { formatDateTime } from "../../utils/formatters";

const AdminAuditLogsPage = () => {
  const dispatch = useAppDispatch();
  const logs = useAppSelector(selectAdminAuditLogs);
  const status = useAppSelector(selectAdminStatus);
  const [filters, setFilters] = useState({ userId: "", action: "", entityType: "", startDate: "", endDate: "" });

  useEffect(() => { dispatch(fetchAdminAuditLogs()); }, [dispatch]);

  const applyFilters = () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    dispatch(fetchAdminAuditLogs(params));
  };

  const columns = [
    {key: "user",header: "User",render: (r) => { const user = r.user || r.userId;return (<span className="text-sm font-medium">
    {typeof user === "object"? `${user.name} (${user.role})` : user || "System"}</span>);}},
    { key: "action", header: "Action", render: r => <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{r.action}</code> },
    { key: "entityType", header: "Entity", render: r => <span className="text-sm text-slate-600 dark:text-slate-300">{r.entityType || "—"}</span> },
    { key: "entityId", header: "Entity ID", render: r => <span className="text-xs text-slate-400 font-mono">{r.entityId?.slice(-8) || "—"}</span> },
    { key: "createdAt", header: "Timestamp", render: r => <span className="text-xs text-slate-500">{formatDateTime(r.createdAt)}</span> }
  ];

  return (
    <div>
      <PageHeader title="Audit Logs" description="Full activity trail across the platform." />
      <div className="card p-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <input className="input text-sm" placeholder="User ID" value={filters.userId}
            onChange={e => setFilters(p => ({ ...p, userId: e.target.value }))} />
          <input className="input text-sm" placeholder="Action" value={filters.action}
            onChange={e => setFilters(p => ({ ...p, action: e.target.value }))} />
          <input className="input text-sm" placeholder="Entity Type" value={filters.entityType}
            onChange={e => setFilters(p => ({ ...p, entityType: e.target.value }))} />
          <input className="input text-sm" type="date" value={filters.startDate}
            onChange={e => setFilters(p => ({ ...p, startDate: e.target.value }))} />
          <Button onClick={applyFilters} size="sm">Apply Filters</Button>
        </div>
      </div>
      <DataTable columns={columns} data={logs} isLoading={status.auditLogs === "loading"}
        pageSize={15} emptyTitle="No audit logs found" emptyIcon={FiActivity} />
    </div>
  );
};

export default AdminAuditLogsPage;
