import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FullPageSpinner } from "../components/common/Spinner";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AuthLayout from "../components/layout/AuthLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import { ROLES } from "../utils/constants";
import CreatePickupRequestPage from "../pages/ngo/CreatePickupRequestPage";
import ConfirmDeliveryPage from "../pages/ngo/ConfirmDeliveryPage";
// Public pages
const LandingPage = lazy(() => import("../pages/public/LandingPage"));
const PublicDonationsPage = lazy(() => import("../pages/public/PublicDonationsPage"));
const PublicDonationDetailPage = lazy(() => import("../pages/public/PublicDonationDetailPage"));
const NotFoundPage = lazy(() =>
  import("../pages/public/ErrorPages").then((m) => ({ default: m.NotFoundPage }))
);
const UnauthorizedPage = lazy(() =>
  import("../pages/public/ErrorPages").then((m) => ({ default: m.UnauthorizedPage }))
);

// Auth pages
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const VerifyEmailPage = lazy(() => import("../pages/auth/VerifyEmailPage"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));

// Donor pages
const DonorDashboardPage = lazy(() => import("../pages/donor/DonorDashboardPage"));
const CreateDonationPage = lazy(() => import("../pages/donor/CreateDonationPage"));
const MyDonationsPage = lazy(() => import("../pages/donor/MyDonationsPage"));
const DonationDetailPage = lazy(() => import("../pages/donor/DonationDetailPage"));
const EditDonationPage = lazy(() => import("../pages/donor/EditDonationPage"));
const DonorProfilePage = lazy(() => import("../pages/donor/DonorProfilePage"));

// NGO pages
const NgoDashboardPage = lazy(() => import("../pages/ngo/NgoDashboardPage"));
const NgoAvailableDonationsPage = lazy(() => import("../pages/ngo/NgoAvailableDonationsPage"));
const NgoAcceptedDonationsPage = lazy(() => import("../pages/ngo/NgoAcceptedDonationsPage"));
const NgoDeliveriesPage = lazy(() => import("../pages/ngo/NgoDeliveriesPage"));
const NgoProfilePage = lazy(() => import("../pages/ngo/NgoProfilePage"));
const AssignVolunteerPage = lazy(() => import("../pages/ngo/AssignVolunteerPage"));
const TrackDeliveryPage = lazy(() => import("../pages/ngo/TrackDeliveryPage"));
const NotificationsPage = lazy(() => import("../pages/NotificationsPage"));
// Volunteer pages
const VolunteerDashboardPage = lazy(() => import("../pages/volunteer/VolunteerDashboardPage"));
const VolunteerDeliveriesPage = lazy(() => import("../pages/volunteer/VolunteerDeliveriesPage"));
const VolunteerDeliveryDetailPage = lazy(() => import("../pages/volunteer/VolunteerDeliveryDetailPage"));
const VolunteerProfilePage = lazy(() => import("../pages/volunteer/VolunteerProfilePage"));
const UploadProofPage = lazy(
    () => import("../pages/volunteer/UploadProof")
);
// Admin pages
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage"));
const AdminUsersPage = lazy(() => import("../pages/admin/AdminUsersPage"));
const AdminNGOsPage = lazy(() => import("../pages/admin/AdminNGOsPage"));
const AdminVolunteersPage = lazy(() => import("../pages/admin/AdminVolunteersPage"));
const AdminDonationsPage = lazy(() => import("../pages/admin/AdminDonationsPage"));
const AdminDeliveriesPage = lazy(() => import("../pages/admin/AdminDeliveriesPage"));
const AdminAuditLogsPage = lazy(() => import("../pages/admin/AdminAuditLogsPage"));
const AdminAnalyticsPage = lazy(() => import("../pages/admin/AdminAnalyticsPage"));
const AdminReportsPage = lazy(() => import("../pages/admin/AdminReportsPage"));

const S = (el) => <Suspense fallback={<FullPageSpinner />}>{el}</Suspense>;

const router = createBrowserRouter([
  // Public
  { path: "/", element: S(<LandingPage />) },
  { path: "/donations", element: S(<PublicDonationsPage />) },
  { path: "/donations/:id", element: S(<PublicDonationDetailPage />) },
  { path: "/unauthorized", element: S(<UnauthorizedPage />) },

  // Auth
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: S(<LoginPage />) },
      { path: "/register", element: S(<RegisterPage />) },
      { path: "/verify-email/:token", element: S(<VerifyEmailPage />) },
      { path: "/forgot-password", element: S(<ForgotPasswordPage />) },
      { path: "/reset-password/:token", element: S(<ResetPasswordPage />) }
    ]
  },

  // Donor
 {
  element: <ProtectedRoute roles={[ROLES.DONOR, ROLES.ADMIN]} />,
  children: [
    {
      element: <DashboardLayout />,
      children: [
        {
          path: "/donor/dashboard",
          element: S(<DonorDashboardPage />)
        },
        {
          path: "/donor/donations",
          element: S(<MyDonationsPage />)
        },
        {
          path: "/donor/create",
          element: S(<CreateDonationPage />)
        },
        {
          path: "/donor/donations/new",
          element: S(<CreateDonationPage />)
        },
        {
          path: "/donor/donations/:id",
          element: S(<DonationDetailPage />)
        },
        {
          path: "/donor/donations/:id/edit",
          element: S(<EditDonationPage />)
        },
        {
          path: "/donor/profile",
          element: S(<DonorProfilePage />)
        },
        {path: "/donor/notifications",element: S(<NotificationsPage />)
        }
      ]
    }
  ]
},

  // NGO
  {
    element: <ProtectedRoute roles={[ROLES.NGO]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/ngo/dashboard", element: S(<NgoDashboardPage />) },
          { path: "/ngo/available-donations", element: S(<NgoAvailableDonationsPage />) },
          { path: "/ngo/accepted-donations", element: S(<NgoAcceptedDonationsPage />) },
          { path: "/ngo/deliveries", element: S(<NgoDeliveriesPage />) },
          { path:"/ngo/pickup/:donationId",element:S(<CreatePickupRequestPage />)},
          { path: "/ngo/deliveries/:id/assign", element: S(<AssignVolunteerPage />) },
          { path: "/ngo/deliveries/:id/track", element: S(<TrackDeliveryPage />) },
          { path: "/ngo/profile", element: S(<NgoProfilePage />) },
          {path: "ngo/deliveries/:id/confirm",element: S(<ConfirmDeliveryPage />)},
          {path: "/ngo/notifications", element: S(<NotificationsPage />)}
        ]
      }
    ]
  },

  // Volunteer
  {
    element: <ProtectedRoute roles={[ROLES.VOLUNTEER]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/volunteer/dashboard", element: S(<VolunteerDashboardPage />) },
          { path: "/volunteer/deliveries", element: S(<VolunteerDeliveriesPage />) },
          { path: "/volunteer/deliveries/:id", element: S(<VolunteerDeliveryDetailPage />) },
          { path: "/volunteer/profile", element: S(<VolunteerProfilePage />) },
          {path: "/volunteer/upload-proof/:id",element: S(<UploadProofPage />)},
        {path: "/volunteer/notifications",element: S(<NotificationsPage />)}
        ]
      }
    ]
  },

  // Admin
  {
    element: <ProtectedRoute roles={[ROLES.ADMIN]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/admin/dashboard", element: S(<AdminDashboardPage />) },
          { path: "/admin/users", element: S(<AdminUsersPage />) },
          { path: "/admin/ngos", element: S(<AdminNGOsPage />) },
          { path: "/admin/volunteers", element: S(<AdminVolunteersPage />) },
          { path: "/admin/donations", element: S(<AdminDonationsPage />) },
          { path: "/admin/deliveries", element: S(<AdminDeliveriesPage />) },
          { path: "/admin/audit-logs", element: S(<AdminAuditLogsPage />) },
          { path: "/admin/analytics", element: S(<AdminAnalyticsPage />) },
          { path: "/admin/reports", element: S(<AdminReportsPage />) },
        {path: "/admin/notifications",element: S(<NotificationsPage />)}
]
      }
    ]
  },

  { path: "*", element: S(<NotFoundPage />) }
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
