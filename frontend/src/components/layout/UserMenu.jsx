import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../features/auth/authSlice";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { initials } from "../../utils/formatters";
import { ROLE_HOME } from "../../utils/constants";

const UserMenu = ({ user }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useAppDispatch();

  useOnClickOutside(ref, () => setOpen(false));

  const profilePath = `${ROLE_HOME[user.role]?.split("/dashboard")[0]}/profile`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center text-xs font-bold">
          {initials(user.name)}
        </div>
        <span className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
          {user.name}
        </span>
        <FiChevronDown size={14} className="text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 card p-2 z-30 animate-fadeUp">
          <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
          <Link
            to={profilePath}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <FiUser size={16} />
            My Profile
          </Link>
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <FiLogOut size={16} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
