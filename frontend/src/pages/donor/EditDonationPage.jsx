import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchDonationById, updateDonation, selectCurrentDonation } from "../../features/donations/donationsSlice";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import TextArea from "../../components/common/TextArea";
import { SectionLoader } from "../../components/common/Spinner";
import { FOOD_TYPES } from "../../utils/constants";

const EditDonationPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const donation = useAppSelector(selectCurrentDonation);
  const mutStatus = useAppSelector(s => s.donations.mutationStatus);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {

    if (!id || id === "new") return;

    dispatch(fetchDonationById(id));

}, [dispatch, id]);
  useEffect(() => {
    if (donation) {
      reset({ title: donation.title, description: donation.description, foodType: donation.foodType,
        quantity: donation.quantity, unit: donation.unit, pickupAddress: donation.pickupAddress });
    }
  }, [donation, reset]);

  const onSubmit = async (data) => {
    const result = await dispatch(updateDonation({ id, payload: data }));
    if (updateDonation.fulfilled.match(result)) {
      toast.success("Donation updated!");
      navigate(`/donor/donations/${id}`);
    } else toast.error(result.payload || "Failed to update");
  };

  if (!donation) return <SectionLoader />;

  return (
    <div>
      <PageHeader title="Edit Donation" description="Update your donation details." />
      <div className="card p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="Title" error={errors.title?.message} {...register("title", { required: "Required" })} />
          <TextArea label="Description" rows={3} error={errors.description?.message} {...register("description", { required: "Required" })} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Food Type" options={FOOD_TYPES} error={errors.foodType?.message} {...register("foodType", { required: "Required" })} />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Quantity" type="number" error={errors.quantity?.message} {...register("quantity", { required: "Required" })} />
              <Input label="Unit" error={errors.unit?.message} {...register("unit", { required: "Required" })} />
            </div>
          </div>
          <Input label="Pickup Address" error={errors.pickupAddress?.message} {...register("pickupAddress", { required: "Required" })} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={mutStatus === "loading"}>Save Changes</Button>
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDonationPage;
