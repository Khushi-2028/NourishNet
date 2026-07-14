import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../store/hooks";
import { connectSocket, getSocket, joinRoom } from "../sockets/socket";
import { ROLES, SOCKET_EVENTS } from "../utils/constants";
import { getNgoId, getVolunteerId } from "../utils/storage";
import { prependDonation } from "../features/donations/donationsSlice";
import { fetchNgoDashboard } from "../features/dashboard/dashboardSlice";
import {
  fetchNgoActiveDeliveries,
  fetchVolunteerActiveDeliveries,
  removeCompletedDelivery
} from "../features/deliveries/deliveriesSlice";
import { setLiveLocationFromSocket } from "../features/tracking/trackingSlice";
import { fetchUnreadCount,fetchNotifications} from "../features/notifications/notificationsSlice";

export const useSocket = (user) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) return undefined;

    const socket = connectSocket();

    if (user.role === ROLES.NGO) {
      const ngoId = getNgoId();
      if (ngoId) joinRoom(`ngo_${ngoId}`);
    }

    if (user.role === ROLES.VOLUNTEER) {
      const volunteerId = getVolunteerId();
      if (volunteerId) joinRoom(`volunteer_${volunteerId}`);
    }

    const handleNewDonation = (donation) => {
      dispatch(prependDonation(donation));
      if (user.role === ROLES.NGO) {
        toast("A new donation just became available!", { icon: "🍱" });
      }
    };

    const handleTaskAssigned = () => {
      toast.success("You have a new delivery task assigned!");
      dispatch(fetchVolunteerActiveDeliveries());
      dispatch(fetchUnreadCount());
    };

    const handleDashboardRefresh = () => {
      if (user.role === ROLES.NGO) {
        dispatch(fetchNgoDashboard());
        dispatch(fetchNgoActiveDeliveries());
      }
      dispatch(fetchUnreadCount());
    };

    const handleDeliveryCompleted = (delivery) => {
      toast.success("A delivery was completed successfully!");
      if (delivery?._id) {
        dispatch(removeCompletedDelivery(delivery._id));
      }
      if (user.role === ROLES.NGO) {
        dispatch(fetchNgoDashboard());
      }
    };

    const handleLocationUpdated = (payload) => {
      dispatch(setLiveLocationFromSocket(payload));
    };
  const handleNotification = () => {
  dispatch(fetchUnreadCount());
  dispatch(fetchNotifications());
  toast("New notification received!", {icon: "🔔"});};

    socket.on(SOCKET_EVENTS.NEW_DONATION, handleNewDonation);
    socket.on(SOCKET_EVENTS.TASK_ASSIGNED, handleTaskAssigned);
    socket.on(SOCKET_EVENTS.DASHBOARD_REFRESH, handleDashboardRefresh);
    socket.on(SOCKET_EVENTS.DELIVERY_COMPLETED, handleDeliveryCompleted);
    socket.on(SOCKET_EVENTS.LOCATION_UPDATED, handleLocationUpdated);
    socket.on("notification", handleNotification);
    return () => {
      socket.off(SOCKET_EVENTS.NEW_DONATION, handleNewDonation);
      socket.off(SOCKET_EVENTS.TASK_ASSIGNED, handleTaskAssigned);
      socket.off(SOCKET_EVENTS.DASHBOARD_REFRESH, handleDashboardRefresh);
      socket.off(SOCKET_EVENTS.DELIVERY_COMPLETED, handleDeliveryCompleted);
      socket.off(SOCKET_EVENTS.LOCATION_UPDATED, handleLocationUpdated);
      socket.off("notification", handleNotification);
    };
  }, [user, dispatch]);
};

export { getSocket };
export default useSocket;
