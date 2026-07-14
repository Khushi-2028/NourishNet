import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { forgotPassword, clearAuthError } from "../../features/auth/authSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const ForgotPasswordPage = () => {
  const dispatch = useAppDispatch();
  const { status, error, lastActionMessage } = useAppSelector((s) => s.auth);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const onSubmit = async ({ email }) => {
    const result = await dispatch(forgotPassword(email));
    if (forgotPassword.fulfilled.match(result)) {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
          <FiMail size={28} className="text-primary-500" />
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Check your inbox</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          {lastActionMessage || "If an account exists, a reset link has been sent."}
        </p>
        <p className="text-xs text-amber-600 mt-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
          In development mode, the reset link is logged to the server console.
        </p>
        <Link to="/login" className="btn-outline mt-6 inline-flex">Back to Login</Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Reset your password</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-6">
        Enter your email and we&apos;ll send a reset link.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          icon={FiMail}
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" }
          })}
        />
        <Button type="submit" fullWidth loading={status === "loading"}>Send Reset Link</Button>
      </form>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Back to Login</Link>
      </p>
    </motion.div>
  );
};

export default ForgotPasswordPage;
