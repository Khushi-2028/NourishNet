import { useEffect, useRef, useState } from "react";
import { FiBell, FiCheck, FiTrash2 } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  selectNotifications,
  selectUnreadCount,
  selectNotificationsStatus
} from "../../features/notifications/notificationsSlice";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { formatRelativeTime } from "../../utils/formatters";
import { SectionLoader } from "../common/Spinner";
import EmptyState from "../common/EmptyState";
import { Link } from "react-router-dom";
import { getSocket } from "../../sockets/socket";
const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const status = useAppSelector(selectNotificationsStatus);
  const user = useAppSelector(selectCurrentUser);

  useOnClickOutside(ref, () => setOpen(false));

  useEffect(() => {
    dispatch(fetchUnreadCount());
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (open) {
      dispatch(fetchNotifications());
    }
  }, [open, dispatch]);
useEffect(() => {
  const socket = getSocket();

  if (!socket) return;

  const handleNotification = () => {
    dispatch(fetchUnreadCount());
    dispatch(fetchNotifications());
  };

  socket.on("notification", handleNotification);

  return () => {
    socket.off("notification", handleNotification);
  };
}, [dispatch]);
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-11 h-11 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Notifications"
      >
        <FiBell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 card overflow-hidden z-30 animate-fadeUp">
  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">

  <div className="flex justify-between items-center w-full">

    <h4 className="font-display font-bold text-slate-800 dark:text-slate-100">
      Notifications
    </h4>

    <Link
  to={`/${user.role}/notifications`}
  onClick={() => setOpen(false)}
  className="text-xs font-semibold text-primary-600 hover:text-primary-700"
>
  View All
</Link>
  </div>

  {unreadCount > 0 && (
    <button
      onClick={() => dispatch(markAllNotificationsRead())}
      className="mt-2 text-xs font-semibold text-primary-600 hover:text-primary-700"
    >
      Mark all read
    </button>
  )}

</div>       

          <div className="max-h-96 overflow-y-auto">
            {status === "loading" && <SectionLoader label="Loading..." />}

            {status !== "loading" && notifications.length === 0 && (
              <EmptyState
                icon={FiBell}
                title="You're all caught up"
                description="No notifications yet."
              />
            )}

            {status !== "loading" &&
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`group flex gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-800/60 last:border-0 transition-colors ${
                    !n.read
                      ? "bg-primary-50/40 dark:bg-primary-950/10"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      n.read ? "bg-transparent" : "bg-primary-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {n.message || n.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {!n.read && (
                      <button
                        onClick={() => dispatch(markNotificationRead(n._id))}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-accent-600 hover:bg-accent-50 dark:hover:bg-accent-950/30"
                        title="Mark as read"
                      >
                        <FiCheck size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => dispatch(deleteNotification(n._id))}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Delete"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
