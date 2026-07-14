export const ROLES = {
  DONOR: "donor",
  NGO: "ngo",
  VOLUNTEER: "volunteer",
  ADMIN: "admin"
};

export const ROLE_LABELS = {
  [ROLES.DONOR]: "Donor",
  [ROLES.NGO]: "NGO",
  [ROLES.VOLUNTEER]: "Volunteer",
  [ROLES.ADMIN]: "Admin"
};

export const ROLE_HOME = {
  [ROLES.DONOR]: "/donor/dashboard",
  [ROLES.NGO]: "/ngo/dashboard",
  [ROLES.VOLUNTEER]: "/volunteer/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard"
};

export const DONATION_STATUS = {
  AVAILABLE: "available",
  ACCEPTED: "accepted",
  PICKED: "picked",
  DELIVERED: "delivered",
  EXPIRED: "expired"
};

export const DONATION_STATUS_LABELS = {
  [DONATION_STATUS.AVAILABLE]: "Available",
  [DONATION_STATUS.ACCEPTED]: "Accepted",
  [DONATION_STATUS.PICKED]: "Picked Up",
  [DONATION_STATUS.DELIVERED]: "Delivered",
  [DONATION_STATUS.EXPIRED]: "Expired"
};

export const DELIVERY_STATUS = {
  ASSIGNED: "assigned",
  ACCEPTED: "accepted_by_volunteer",
  PICKED_UP: "picked_up",
  IN_TRANSIT: "in_transit",
   AWAITING_CONFIRMATION: "awaiting_confirmation",
  DELIVERED: "delivered"
};

export const DELIVERY_STATUS_LABELS = {
  [DELIVERY_STATUS.ASSIGNED]: "Assigned",
  [DELIVERY_STATUS.ACCEPTED]: "Accepted by Volunteer",
  [DELIVERY_STATUS.PICKED_UP]: "Picked Up",
  [DELIVERY_STATUS.IN_TRANSIT]: "In Transit",
  [DELIVERY_STATUS.AWAITING_CONFIRMATION]: "Waiting NGO Confirmation",
  [DELIVERY_STATUS.DELIVERED]: "Delivered"
};

export const DELIVERY_STATUS_ORDER = [
  DELIVERY_STATUS.ASSIGNED,
  DELIVERY_STATUS.ACCEPTED,
  DELIVERY_STATUS.PICKED_UP,
  DELIVERY_STATUS.IN_TRANSIT,
   DELIVERY_STATUS.AWAITING_CONFIRMATION,
  DELIVERY_STATUS.DELIVERED
];

export const NGO_APPROVAL_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected"
};

export const VEHICLE_TYPES = ["bike", "car", "van", "walking"];

export const FOOD_TYPES = [
  "Cooked",
  "Packaged",
  "Fruits & Vegetables",
  "Bakery",
  "Dairy",
  "Grains & Cereals",
  "Beverages",
  "Other"
];

export const REPORT_FORMATS = [
  { value: "pdf", label: "PDF" },
  { value: "excel", label: "Excel" },
  { value: "csv", label: "CSV" }
];

export const SOCKET_EVENTS = {
  NEW_DONATION: "new_donation",
  TASK_ASSIGNED: "task_assigned",
  DASHBOARD_REFRESH: "dashboard_refresh",
  DELIVERY_COMPLETED: "delivery_completed",
  LOCATION_UPDATED: "location_updated"
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "nourishnet_access_token",
  REFRESH_TOKEN: "nourishnet_refresh_token",
  USER: "nourishnet_user",
  THEME: "nourishnet_theme",
  // The backend exposes no "get my NGO/Volunteer profile" endpoint, so
  // we capture these domain IDs client-side at profile-creation time
  // (the create-profile response includes the new document's _id) and
  // persist them locally so the socket layer can join the correct
  // `ngo_<id>` / `volunteer_<id>` rooms on subsequent sessions.
  NGO_ID: "nourishnet_ngo_id",
  VOLUNTEER_ID: "nourishnet_volunteer_id"
};
