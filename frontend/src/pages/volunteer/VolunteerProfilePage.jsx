import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { FiUser, FiPhone, FiTruck, FiLock, FiBell } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createVolunteerProfile, selectVolunteerProfileStatus } from "../../features/volunteer/volunteerSlice";
import { selectCurrentUser, setHasProfile } from "../../features/auth/authSlice";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { RoleBadge } from "../../components/common/StatusBadge";
import { initials } from "../../utils/formatters";
import { VEHICLE_TYPES } from "../../utils/constants";

const VolunteerProfilePage = () => {
  const user = useAppSelector(selectCurrentUser);
  const profileStatus = useAppSelector(selectVolunteerProfileStatus);
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(createVolunteerProfile(data));
    if (createVolunteerProfile.fulfilled.match(result)) {
      toast.success("Volunteer profile created!");
      dispatch(setHasProfile(true));
      setShowForm(false);
    } else {
      toast.error(result.payload || "Failed to create profile");
    }
  };

  return (
    <div>
      <PageHeader title="My Profile" description="Your volunteer profile and account details." />
      <div className="max-w-lg space-y-4">
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="card p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center text-xl font-bold shrink-0">
            {initials(user?.name)}
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <RoleBadge role={user?.role} className="mt-2" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100">Volunteer Details</h3>
            <Button size="sm" variant="outline" onClick={() => setShowForm(s => !s)}>
              {showForm ? "Cancel" : "Create Profile"}
            </Button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2">
                Note: Profile creation only. There is no backend update endpoint for volunteer profiles.
              </p>
              <Input label="Phone Number" icon={FiPhone} placeholder="+91 98765 43210"
                error={errors.phone?.message}
                {...register("phone", { required: "Phone is required" })} />
              <Select label="Vehicle Type" options={VEHICLE_TYPES}
                error={errors.vehicleType?.message}
                {...register("vehicleType", { required: "Required" })} />
              <Input label="FCM Device Token (optional)" icon={FiBell}
                placeholder="Firebase push notification token"
                hint="For receiving push notifications on this device."
                {...register("deviceToken")} />
              <Button type="submit" loading={profileStatus === "loading"} size="sm">Save Profile</Button>
            </form>
          )}

          <div className="space-y-3">
            <InfoRow icon={FiUser} label="Full Name" value={user?.name} />
            <InfoRow icon={FiUser} label="Email" value={user?.email} />
            <InfoRow icon={FiTruck} label="Role" value="Volunteer" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }} className="card p-5">
          <h3 className="font-display font-bold text-slate-800 dark:text-slate-100 mb-3">Security</h3>
          <Link to="/forgot-password" className="btn-outline inline-flex gap-2 text-sm"><FiLock size={15} />Change Password</Link>
        </motion.div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
      <Icon size={15} className="text-primary-500" />
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{value}</p>
    </div>
  </div>
);

export default VolunteerProfilePage;
