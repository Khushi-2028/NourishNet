import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiLock, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { resetPassword, clearAuthError } from "../../features/auth/authSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const onSubmit = async ({ password }) => {
    const result = await dispatch(resetPassword({ token, password }));
    if (resetPassword.fulfilled.match(result)) setDone(true);
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center mx-auto mb-4">
          <FiCheckCircle size={28} className="text-accent-500" />
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Password updated!</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">You can now sign in with your new password.</p>
        <Link to="/login" className="btn-primary mt-6 inline-flex">Go to Login</Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Set new password</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-6">Choose a strong password for your account.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New Password"
          icon={FiLock}
          type="password"
          placeholder="Min 6 characters"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" }
          })}
        />
        <Input
          label="Confirm Password"
          icon={FiLock}
          type="password"
          placeholder="Repeat your password"
          error={errors.confirm?.message}
          {...register("confirm", {
            required: "Please confirm your password",
            validate: (v) => v === watch("password") || "Passwords do not match"
          })}
        />
        <Button type="submit" fullWidth loading={status === "loading"}>Reset Password</Button>
      </form>
    </motion.div>
  );
};

export default ResetPasswordPage;
