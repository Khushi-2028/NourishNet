import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { selectTheme } from "../../features/ui/uiSlice";
import useSocket from "../../hooks/useSocket";

const DashboardLayout = () => {
  const user = useAppSelector(selectCurrentUser);
  const theme = useAppSelector(selectTheme);

  // Apply dark mode class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Connect Socket.IO and wire all live events
  useSocket(user);

  return (
    <div className="flex h-screen overflow-hidden bg-orange-50/40 dark:bg-surface-dark">
      <Sidebar role={user?.role} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto">
          <div className="page-container py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
