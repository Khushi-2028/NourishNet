import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiUser, FiMail, FiPhone, FiMapPin, FiShield, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createNgoProfile, selectNgoProfileStatus } from "../../features/ngo/ngoSlice";
import { selectCurrentUser, setHasProfile } from "../../features/auth/authSlice";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { RoleBadge } from "../../components/common/StatusBadge";
import { initials } from "../../utils/formatters";

const NgoProfilePage = () => {
  const user = useAppSelector(selectCurrentUser);
  const profileStatus = useAppSelector(selectNgoProfileStatus);
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(createNgoProfile(data));
    if (createNgoProfile.fulfilled.match(result)) {
      toast.success("NGO profile created!");
      dispatch(setHasProfile(true));
      setShowForm(false);
    } else {
      toast.error(result.payload || "Failed to create profile");
    }
  };

  return (
    <div>
      <PageHeader title="NGO Profile" description="Your organisation's NourishNet profile." />
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
            <h3 className="font-display font-bold text-slate-800 dark:text-slate-100">NGO Details</h3>
            <Button size="sm" variant="outline" onClick={() => setShowForm(s => !s)}>
              {showForm ? "Cancel" : "Create / Update Profile"}
            </Button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2">
                Note: The backend only supports profile creation (no update endpoint). Submitting this will create a new NGO profile document.
              </p>
              <Input label="Organisation Name" icon={FiUser} placeholder="Green Meals NGO"
                error={errors.organisationName?.message}
                {...register("organisationName", { required: "Required" })} />
              <Input label="Contact Phone" icon={FiPhone} placeholder="+91 98765 43210"
                error={errors.phone?.message}
                {...register("phone", { required: "Required" })} />
              <Input label="Address" icon={FiMapPin} placeholder="Full address"
                error={errors.address?.message}
                {...register("address", { required: "Required" })} />
              <Button type="submit" loading={profileStatus === "loading"} size="sm">Save Profile</Button>
            </form>
          )}

          <div className="space-y-3">
            <InfoRow icon={FiUser} label="Account Name" value={user?.name} />
            <InfoRow icon={FiMail} label="Email" value={user?.email} />
            <InfoRow icon={FiShield} label="Role" value="NGO" />
            <InfoRow icon={FiShield} label="User ID" value={user?.id} />
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
      <p className="text-sm text-slate-700 dark:text-slate-200 font-medium break-all">{value}</p>
    </div>
  </div>
);

export default NgoProfilePage;
