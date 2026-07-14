import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiUpload, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createDonation, selectDonationsMutationStatus } from "../../features/donations/donationsSlice";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import TextArea from "../../components/common/TextArea";
import { FOOD_TYPES } from "../../utils/constants";

const CreateDonationPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const mutStatus = useAppSelector(selectDonationsMutationStatus);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const fileRef = useRef();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
} = useForm();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter(f => f.type.startsWith("image/")).slice(0, 5 - imageFiles.length);
    setImageFiles(prev => [...prev, ...valid].slice(0, 5));
    valid.forEach(f => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImages(prev => [...prev, ev.target.result].slice(0, 5));
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  };

  const removeImage = (idx) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviewImages(prev => prev.filter((_, i) => i !== idx));
  };

 const getCurrentLocation = () => {

    if (!navigator.geolocation) {
        toast.error("Geolocation is not supported.");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        (position) => {

            setValue(
                "latitude",
                position.coords.latitude
            );

            setValue(
                "longitude",
                position.coords.longitude
            );

            toast.success("Location captured successfully.");

        },

        () => {

            toast.error("Unable to fetch location.");

        }

    );

};
    const onSubmit = async (data) => {
  const fd = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    fd.append(key, value);
  });

  imageFiles.forEach((file) => {
    fd.append("images", file);
  });

  const result = await dispatch(createDonation(fd));

  if (createDonation.fulfilled.match(result)) {
    toast.success("Donation created successfully!");
    navigate("/donor/donations");
  } else {
    toast.error(result.payload || "Failed to create donation");
  }
};
  

  return (
    <div>
      <PageHeader title="Create Donation" description="List surplus food for NGOs to collect." />
      <div className="card p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="Title" placeholder="e.g. Fresh vegetable surplus" error={errors.title?.message}
            {...register("title", { required: "Title is required" })} />
          <TextArea label="Description" placeholder="Describe the food, quantity, condition..." rows={3}
            error={errors.description?.message}
            {...register("description", { required: "Description is required" })} />

          <div className="grid grid-cols-2 gap-4">
            <Select label="Food Type" options={FOOD_TYPES} error={errors.foodType?.message}
              {...register("foodType", { required: "Food type is required" })} />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Quantity" type="number" min="1" error={errors.quantity?.message}
                {...register("quantity", { required: "Required", min: { value: 1, message: "Min 1" } })} />
              <Input label="Unit" placeholder="kg / pcs" error={errors.unit?.message}
                {...register("unit", { required: "Required" })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Preparation Time" type="datetime-local" error={errors.preparationTime?.message}
              {...register("preparationTime", { required: "Required" })} />
            <Input label="Expiry Time" type="datetime-local" error={errors.expiryTime?.message}
              {...register("expiryTime", { required: "Required" })} />
          </div>

          <Input label="Pickup Address" placeholder="Full address for pickup"
            error={errors.pickupAddress?.message}
            {...register("pickupAddress", { required: "Pickup address is required" })} />
            <Button
    type="button"
    variant="secondary"
    onClick={getCurrentLocation}
>
    Use Current Location
</Button>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Latitude (optional)" type="number" step="any" placeholder="e.g. 28.6139"
              {...register("latitude")} />
            <Input label="Longitude (optional)" type="number" step="any" placeholder="e.g. 77.2090"
              {...register("longitude")} />
          </div>

          {/* Image upload */}
          <div>
            <label className="label">Photos (up to 5)</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"
            >
              <FiUpload size={24} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">Click to upload images</p>
              <p className="text-xs text-slate-400 mt-1">Max 5 images, 5MB each</p>
              <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            {previewImages.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {previewImages.map((src, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img src={src} className="w-full h-full object-cover rounded-xl" alt="" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center">
                      <FiX size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={mutStatus === "loading"}>Create Donation</Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/donor/donations")}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDonationPage;
