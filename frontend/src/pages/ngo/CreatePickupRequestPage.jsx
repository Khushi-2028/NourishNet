import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import pickupApi from "../../api/pickupApi";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const CreatePickupRequestPage = () => {
  const { donationId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      await pickupApi.createRequest(donationId, formData);

      toast.success("Pickup Request Created Successfully");

      navigate("/ngo/accepted-donations");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to create pickup request"
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Pickup Request"
        description="Provide pickup and delivery details before assigning a volunteer."
      />

      <div className="card p-6 max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <Input
            label="Pickup Date"
            type="date"
            error={errors.pickupDate?.message}
            {...register("pickupDate", {
              required: "Pickup date is required"
            })}
          />

          <Input
            label="Pickup Time"
            type="time"
            error={errors.pickupTime?.message}
            {...register("pickupTime", {
              required: "Pickup time is required"
            })}
          />

          <Input
            label="Delivery Address"
            placeholder="Enter delivery address"
            error={errors.deliveryAddress?.message}
            {...register("deliveryAddress", {
              required: "Delivery address is required"
            })}
          />

          <Input
            label="Contact Person"
            placeholder="Enter contact person's name"
            error={errors.contactPerson?.message}
            {...register("contactPerson", {
              required: "Contact person is required"
            })}
          />

          <Input
            label="Contact Number"
            placeholder="Enter contact number"
            error={errors.contactPhone?.message}
            {...register("contactPhone", {
              required: "Contact number is required"
            })}
          />

          <Input
            label="Landmark"
            placeholder="Nearest landmark"
            {...register("landmark")}
          />

          <Input
            label="Floor / Room Number"
            placeholder="Floor / Room No."
            {...register("floor")}
          />

          <Input
            label="Parking Instructions"
            placeholder="Parking information"
            {...register("parkingInstructions")}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Special Instructions
            </label>

            <textarea
              rows={4}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter any additional instructions..."
              {...register("instructions")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={isSubmitting}
            >
              Create Pickup Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePickupRequestPage;