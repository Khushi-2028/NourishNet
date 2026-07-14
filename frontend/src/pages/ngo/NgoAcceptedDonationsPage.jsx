import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiTruck,
  FiCalendar,
  FiUser
} from "react-icons/fi";
import { motion } from "framer-motion";

import {
  useAppDispatch,
  useAppSelector
} from "../../store/hooks";

import {
  fetchPickupRequests,
  selectPickupRequests,
  selectPickupStatus
} from "../../features/ngo/ngoSlice";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonGrid } from "../../components/common/Skeleton";

const NgoAcceptedDonationsPage = () => {

  const dispatch = useAppDispatch();

  const pickupRequests =
    useAppSelector(selectPickupRequests);

  const pickupStatus =
    useAppSelector(selectPickupStatus);

  useEffect(() => {

    dispatch(fetchPickupRequests());

  }, [dispatch]);

  return (

    <div>

      <PageHeader
        title="My Pickup Requests"
        description="Manage all pickup requests created by your NGO."
      />

      {pickupStatus === "loading" && (
        <SkeletonGrid count={6} />
      )}

      {pickupStatus !== "loading" &&
        pickupRequests.length === 0 && (

        <EmptyState

          icon={FiPackage}

          title="No Pickup Requests"

          description="Create a pickup request from Available Donations."

          action={

            <Link to="/ngo/available-donations">

              <Button>

                Browse Donations

              </Button>

            </Link>

          }

        />

      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {pickupRequests.map((pickup, index) => (

          <motion.div

            key={pickup._id}

            initial={{ opacity: 0, y: 10 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: index * 0.05 }}

            className="card p-5"

          >

            <div className="flex justify-between items-start">

              <div>

                <h2 className="font-semibold text-lg">

                  {pickup.donationId?.title || "Donation"}

                </h2>

                <p className="text-sm text-slate-500">

                  {pickup.requestedQuantity}{" "}
                  {pickup.donationId?.unit}

                </p>

              </div>

              <span className="badge">

                {pickup.status}

              </span>

            </div>

            <div className="mt-4 space-y-2 text-sm">

              <div className="flex items-center gap-2">

                <FiCalendar />

                <span>

                  {pickup.pickupDate
                    ? new Date(
                        pickup.pickupDate
                      ).toLocaleDateString()
                    : "Not Scheduled"}

                </span>

              </div>

              <div className="flex items-center gap-2">

                <FiTruck />

                <span>

                  {pickup.deliveryAddress}

                </span>

              </div>

              <div className="flex items-center gap-2">

                <FiUser />

                <span>

                  {pickup.contactPerson}

                </span>

              </div>

            </div>

            <div className="mt-5">

              <Link

                to={`/ngo/deliveries/${pickup._id}/assign`}

              >

                <Button
                  className="w-full"
                >
                  Assign Volunteer
                </Button>

              </Link>

            </div>

          </motion.div>

        ))}

      </div>

    </div>

  );

};

export default NgoAcceptedDonationsPage;