import { FiMenu } from "react-icons/fi";
import { useAppDispatch } from "../../store/hooks";
import { toggleMobileSidebar } from "../../features/ui/uiSlice";
import NotificationBell from "../notifications/NotificationBell";
import ThemeToggle from "../common/ThemeToggle";
import UserMenu from "./UserMenu";

const Topbar = ({ user }) => {
  const dispatch = useAppDispatch();

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 flex items-center px-4 sm:px-6 gap-3">
      <button
        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        onClick={() => dispatch(toggleMobileSidebar())}
        aria-label="Open menu"
      >
        <FiMenu size={20} />
      </button>

      <div className="flex-1" />

      <ThemeToggle />
      <NotificationBell />
      {user && <UserMenu user={user} />}
    </header>
  );
};

export default Topbar;
