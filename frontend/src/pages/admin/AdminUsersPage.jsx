import { useEffect, useState } from "react";
import { FiUsers, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAdminUsers, deleteAdminUser, selectAdminUsers, selectAdminStatus } from "../../features/admin/adminSlice";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { RoleBadge } from "../../components/common/StatusBadge";
import { formatDate, initials } from "../../utils/formatters";
import { motion } from "framer-motion";
import useDebounce from "../../hooks/useDebounce";

const AdminUsersPage = () => {
  const dispatch = useAppDispatch();
  const { list: users, total } = useAppSelector(selectAdminUsers);
  const status = useAppSelector(selectAdminStatus);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(fetchAdminUsers({ search: debouncedSearch, role, page, limit: 10 }));
  }, [dispatch, debouncedSearch, role, page]);

  const handleDelete = async () => {
    setDeleting(true);
    const result = await dispatch(deleteAdminUser(deleteId));
    setDeleting(false);
    setDeleteId(null);
    if (deleteAdminUser.fulfilled.match(result)) toast.success("User deleted.");
    else toast.error(result.payload || "Failed to delete user.");
  };

  const columns = [
    {
      key: "name", header: "User",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {initials(row.name)}
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: "role", header: "Role", render: (row) => <RoleBadge role={row.role} /> },
    { key: "isVerified", header: "Verified", render: (row) => (
      <span className={`badge ${row.isVerified ? "bg-accent-50 text-accent-700 dark:bg-accent-950/30 dark:text-accent-300" : "bg-slate-100 text-slate-500"}`}>
        {row.isVerified ? "Verified" : "Pending"}
      </span>
    )},
    { key: "createdAt", header: "Joined", render: (row) => <span className="text-xs text-slate-500">{formatDate(row.createdAt)}</span> },
    {
      key: "actions", header: "",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setDeleteId(row._id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
            <FiTrash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader title="Users" description={`Manage all ${total} platform users.`} />
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input className="input pl-10" placeholder="Search by name or email…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="input w-full sm:w-36" value={role} onChange={e => { setRole(e.target.value); setPage(1); }}>
          <option value="">All Roles</option>
          <option value="donor">Donor</option>
          <option value="ngo">NGO</option>
          <option value="volunteer">Volunteer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={status.users === "loading"}
        serverPagination={{ page, pages: Math.ceil(total / 10) || 1, onPageChange: setPage }}
        emptyTitle="No users found"
        emptyIcon={FiUsers}
      />

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete User" description="This will permanently delete the user account and all associated data."
        confirmLabel="Delete User" loading={deleting} />
    </div>
  );
};

export default AdminUsersPage;
