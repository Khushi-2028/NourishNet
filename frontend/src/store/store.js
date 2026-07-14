import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import uiReducer from "../features/ui/uiSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import donationsReducer from "../features/donations/donationsSlice";
import ngoReducer from "../features/ngo/ngoSlice";
import volunteerReducer from "../features/volunteer/volunteerSlice";
import deliveriesReducer from "../features/deliveries/deliveriesSlice";
import trackingReducer from "../features/tracking/trackingSlice";
import adminReducer from "../features/admin/adminSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import volunteersReducer from "../features/volunteers/volunteersSlice";
import ngoTrackingReducer from "../features/tracking/ngoTrackingSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    notifications: notificationsReducer,
    donations: donationsReducer,
    ngo: ngoReducer,
    volunteer: volunteerReducer,
    deliveries: deliveriesReducer,
    tracking: trackingReducer,
    ngoTracking: ngoTrackingReducer,
    admin: adminReducer,
    dashboard: dashboardReducer,
    volunteers: volunteersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
