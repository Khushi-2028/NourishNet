import { format, formatDistanceToNow, isValid } from "date-fns";

export const formatDate = (date, pattern = "dd MMM yyyy") => {
  if (!date) return "—";
  const d = new Date(date);
  return isValid(d) ? format(d, pattern) : "—";
};

export const formatDateTime = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  return isValid(d) ? format(d, "dd MMM yyyy, hh:mm a") : "—";
};

export const formatRelativeTime = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : "—";
};

export const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "0";
  return new Intl.NumberFormat("en-IN").format(value);
};

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

/**
 * Donation images are stored server-side as filesystem paths
 * (e.g. "src/uploads/donations/169999-file.jpg") and statically served
 * by Express under "/uploads/donations/<filename>". This normalizes
 * whatever path format comes back from the API into a working URL.
 */
export const resolveImageUrl = (imagePath) => {
  if (!imagePath) return null;

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${SERVER_URL}${imagePath}`;
};

export const truncate = (text, length = 80) => {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length)}...` : text;
};

export const initials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
