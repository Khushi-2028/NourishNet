import { motion } from "framer-motion";
import { FiUser, FiMail, FiShield, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../features/auth/authSlice";
import PageHeader from "../../components/common/PageHeader";
import { ROLE_LABELS } from "../../utils/constants";
import { initials } from "../../utils/formatters";
import { RoleBadge } from "../../components/common/StatusBadge";

const DonorProfilePage = () => {
  const user = useAppSelector(selectCurrentUser);
  if (!user) return null;

  return (
    <div>
      <PageHeader title="My Profile" description="Your account information." />
      <div className="max-w-lg space-y-4">
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="card p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center text-xl font-bold shrink-0">
            {initials(user.name)}
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">{user.name}</h2>
            <p className="text-slate-500 text-sm">{user.email}</p>
            <RoleBadge role={user.role} className="mt-2" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }} className="card p-5 space-y-4">
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-100">Account Details</h3>
          <InfoRow icon={FiUser} label="Full Name" value={user.name} />
          <InfoRow icon={FiMail} label="Email" value={user.email} />
          <InfoRow icon={FiShield} label="Role" value={ROLE_LABELS[user.role]} />
          <InfoRow icon={FiShield} label="Account ID" value={user.id} />
        </motion.div>

        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }} className="card p-5">
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mb-3">Security</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            To change your password, use the Forgot Password flow.
          </p>
          <Link to="/forgot-password" className="btn-outline inline-flex gap-2 text-sm"><FiLock size={15}/>Change Password</Link>
        </motion.div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
      <Icon size={15} className="text-primary-500" />
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className="text-sm text-slate-700 dark:text-slate-200 font-medium break-all">{value}</p>
    </div>
  </div>
);

export default DonorProfilePage;
