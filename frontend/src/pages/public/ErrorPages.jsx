import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiHome } from "react-icons/fi";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { ROLE_HOME } from "../../utils/constants";

export const NotFoundPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const home = user ? ROLE_HOME[user.role] : "/";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-orange-50/40 dark:bg-surface-dark px-4"
    >
      <div className="text-center">
        <p className="text-8xl font-display font-extrabold text-primary-200 dark:text-slate-800">
          404
        </p>
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white mt-2">
          Page not found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link to={home} className="btn-primary mt-6 inline-flex gap-2">
          <FiHome size={16} /> Go Home
        </Link>
      </div>
    </motion.div>
  );
};

export const UnauthorizedPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const home = user ? ROLE_HOME[user.role] : "/";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-orange-50/40 dark:bg-surface-dark px-4"
    >
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mx-auto mb-4">
          <FiAlertTriangle size={28} className="text-rose-500" />
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
          Access Denied
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          You don&apos;t have permission to view this page.
        </p>
        <Link to={home} className="btn-outline mt-6 inline-flex gap-2">
          <FiHome size={16} /> Go to Dashboard
        </Link>
      </div>
    </motion.div>
  );
};
