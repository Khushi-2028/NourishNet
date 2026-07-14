import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectAuth } from "../../features/auth/authSlice";

const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, user, status } = useAppSelector(selectAuth);

  const location = useLocation();

  console.log("========== ProtectedRoute ==========");
  console.log("Current Path:", location.pathname);
  console.log("Authenticated:", isAuthenticated);
  console.log("User:", user);
  console.log("User Role:",user?.role);
  console.log("Allowed Roles:", roles);
console.log("Role Match:", roles?.includes(user?.role));
console.log("Status:", status);
  
if (status === "loading") {
  return null;
// or FullPageSpinner
}

if (!isAuthenticated || !user) {
  return (
    <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />
  );
}

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    console.log("➡ Redirecting to UNAUTHORIZED");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ Access Granted");

  return <Outlet />;
};

export default ProtectedRoute;