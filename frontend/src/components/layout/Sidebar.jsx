import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiPackage,
  FiPlusCircle,
  FiUser,
  FiTruck,
  FiCheckCircle,
  FiUsers,
  FiHeart,
  FiNavigation,
  FiFileText,
  FiBarChart2,
  FiActivity,
  FiX
} from "react-icons/fi";
import { ROLES } from "../../utils/constants";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectMobileSidebarOpen,
  closeMobileSidebar
} from "../../features/ui/uiSlice";
import { cn } from "../../utils/cn";

const NAV_ITEMS = {
  [ROLES.DONOR]: [
    { to: "/donor/dashboard", label: "Dashboard", icon: FiGrid },
    { to: "/donor/donations/new", label: "Create Donation", icon: FiPlusCircle },
    { to: "/donor/donations", label: "My Donations", icon: FiPackage },
    { to: "/donor/profile", label: "Profile", icon: FiUser }
  ],
  [ROLES.NGO]: [
    { to: "/ngo/dashboard", label: "Dashboard", icon: FiGrid },
    { to: "/ngo/available-donations", label: "Available Donations", icon: FiPackage },
    { to: "/ngo/accepted-donations", label: "Accepted Donations", icon: FiCheckCircle },
    { to: "/ngo/deliveries", label: "Active Deliveries", icon: FiTruck },
    { to: "/ngo/profile", label: "Profile", icon: FiUser }
  ],
  [ROLES.VOLUNTEER]: [
    { to: "/volunteer/dashboard", label: "Dashboard", icon: FiGrid },
    { to: "/volunteer/deliveries", label: "My Deliveries", icon: FiTruck },
    { to: "/volunteer/profile", label: "Profile", icon: FiUser }
  ],
  [ROLES.ADMIN]: [
    { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
    { to: "/admin/users", label: "Users", icon: FiUsers },
    { to: "/admin/ngos", label: "NGOs", icon: FiHeart },
    { to: "/admin/volunteers", label: "Volunteers", icon: FiNavigation },
    { to: "/admin/donations", label: "Donations", icon: FiPackage },
    { to: "/admin/deliveries", label: "Deliveries", icon: FiTruck },
    { to: "/admin/audit-logs", label: "Audit Logs", icon: FiActivity },
    { to: "/admin/analytics", label: "Analytics", icon: FiBarChart2 },
    { to: "/admin/reports", label: "Reports", icon: FiFileText }
  ]
};

const Sidebar = ({ role }) => {
  const items = NAV_ITEMS[role] || [];
  const dispatch = useAppDispatch();
  const mobileOpen = useAppSelector(selectMobileSidebarOpen);

  const content = (
    <>
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 dark:border-slate-800">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
            <FiHeart className="text-white" size={17} />
          </div>
          <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
            NourishNet
          </span>
        </NavLink>
        <button
          className="lg:hidden text-slate-400 hover:text-slate-600"
          onClick={() => dispatch(closeMobileSidebar())}
        >
          <FiX size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => dispatch(closeMobileSidebar())}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                isActive
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs text-slate-400">
          NourishNet &copy; {new Date().getFullYear()}
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
        {content}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => dispatch(closeMobileSidebar())}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "tween", duration: 0.25 }}
            className="relative flex flex-col w-72 h-full bg-white dark:bg-slate-900 shadow-2xl"
          >
            {content}
          </motion.aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
