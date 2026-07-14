import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiUser, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import deliveriesApi from "../../api/deliveriesApi";
import Button from "../../components/common/Button";
import { SectionLoader } from "../../components/common/Spinner";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  confirmDelivery,
  selectDeliveriesMutationStatus,
} from "../../features/deliveries/deliveriesSlice";

const ConfirmDeliveryPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectDeliveriesMutationStatus);

  const [delivery, setDelivery] = useState(null);

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadDelivery = async () => {
      try {
        const { data } = await deliveriesApi.getDeliveryById(id);

        setDelivery(data.delivery);
        console.log(data.delivery);
      } catch (err) {
        toast.error("Unable to load delivery.");
      } finally {
        setPageLoading(false);
      }
    };

    loadDelivery();
  }, [id]);

  const handleConfirm = async () => {
    const result = await dispatch(confirmDelivery(id));

    if (confirmDelivery.fulfilled.match(result)) {
      toast.success("Delivery confirmed successfully.");

      navigate("/ngo/deliveries");
    } else {
      toast.error(result.payload || "Confirmation failed.");
    }
  };

  if (pageLoading) {
    return <SectionLoader />;
  }

  if (!delivery) {
    return (
      <div className="text-center py-20">
        Delivery not found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6"
      >
        <FiArrowLeft />
        Back
      </button>

      <div className="card p-8">

        <h1 className="text-2xl font-display font-bold mb-2">
          Delivery Proof
        </h1>

        <p className="text-slate-500 mb-8">
          Review the uploaded proof before confirming delivery.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="flex items-center gap-3">

            <FiUser className="text-primary-600" />

            <div>

              <p className="text-xs text-slate-500">
                Volunteer
              </p>

              <p className="font-medium">
                {delivery.volunteerId?.userId?.name || "Volunteer"}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <FiCalendar className="text-primary-600" />

            <div>

              <p className="text-xs text-slate-500">
                Uploaded
              </p>

              <p className="font-medium">
                {delivery.proofUploadedAt
                  ? new Date(
                      delivery.proofUploadedAt
                    ).toLocaleString()
                  : "-"}
              </p>

            </div>

          </div>

        </div>

       <div className="mb-8">

  <h3 className="font-semibold mb-3">
    Proof Image
  </h3>

  {delivery.proofImage ? (

    <img
      src={`http://localhost:5000${delivery.proofImage}`}
      alt="Proof"
      className="rounded-xl border w-full max-h-[500px] object-cover"
    />

  ) : (

    <div className="rounded-xl border p-6 text-center text-slate-500">
      Volunteer hasn't uploaded proof yet.
    </div>

  )}

</div>
        <div className="mb-8">

          <h3 className="font-semibold mb-3">
            Volunteer Notes
          </h3>

          <div className="rounded-xl border p-5 bg-slate-50 dark:bg-slate-900">

            {delivery.proofNotes || "No notes provided."}

          </div>

        </div>

       <Button
  variant="primary"
  icon={FiCheckCircle}
  loading={loading === "loading"}
  disabled={!delivery.proofImage}
  onClick={handleConfirm}
>
  Confirm Delivery
</Button>

      </div>

    </motion.div>
  );
};

export default ConfirmDeliveryPage;