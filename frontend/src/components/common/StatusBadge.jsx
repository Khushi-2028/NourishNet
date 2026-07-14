import { cn } from "../../utils/cn";
import {
  DONATION_STATUS,
  DONATION_STATUS_LABELS,
  DELIVERY_STATUS,
  DELIVERY_STATUS_LABELS,
  NGO_APPROVAL_STATUS
} from "../../utils/constants";

const DONATION_COLORS = {
  [DONATION_STATUS.AVAILABLE]:
    "bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-300",
  [DONATION_STATUS.ACCEPTED]:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  [DONATION_STATUS.PICKED]:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  [DONATION_STATUS.DELIVERED]:
    "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300",
  [DONATION_STATUS.EXPIRED]:
    "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
};

const DELIVERY_COLORS = {
  [DELIVERY_STATUS.ASSIGNED]:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  [DELIVERY_STATUS.ACCEPTED]:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  [DELIVERY_STATUS.PICKED_UP]:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  [DELIVERY_STATUS.IN_TRANSIT]:
    "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  [DELIVERY_STATUS.DELIVERED]:
    "bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-300"
};

const NGO_COLORS = {
  [NGO_APPROVAL_STATUS.PENDING]:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  [NGO_APPROVAL_STATUS.APPROVED]:
    "bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-300",
  [NGO_APPROVAL_STATUS.REJECTED]:
    "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
};

export const DonationStatusBadge = ({ status, className = "" }) => (
  <span
    className={cn(
      "badge",
      DONATION_COLORS[status] || "bg-slate-100 text-slate-500",
      className
    )}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {DONATION_STATUS_LABELS[status] || status}
  </span>
);

export const DeliveryStatusBadge = ({ status, className = "" }) => (
  <span
    className={cn(
      "badge",
      DELIVERY_COLORS[status] || "bg-slate-100 text-slate-500",
      className
    )}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {DELIVERY_STATUS_LABELS[status] || status}
  </span>
);

export const NgoStatusBadge = ({ status, className = "" }) => (
  <span
    className={cn(
      "badge capitalize",
      NGO_COLORS[status] || "bg-slate-100 text-slate-500",
      className
    )}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {status || "pending"}
  </span>
);

export const RoleBadge = ({ role, className = "" }) => {
  const colors = {
    admin: "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
    ngo: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    volunteer:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    donor:
      "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300"
  };
  return (
    <span className={cn("badge capitalize", colors[role], className)}>
      {role}
    </span>
  );
};
