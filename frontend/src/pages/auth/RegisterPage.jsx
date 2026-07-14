import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, clearAuthError } from "../../features/auth/authSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { cn } from "../../utils/cn";

const ROLES = [
  { value: "donor", label: "Donor", desc: "Share surplus food" },
  { value: "ngo", label: "NGO", desc: "Collect & distribute food" },
  { value: "volunteer", label: "Volunteer", desc: "Help with deliveries" }
];

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((s) => s.auth);
  const [selectedRole, setSelectedRole] = useState("donor");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { role: "donor" } });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const onSubmit = async (data) => {
    const result = await dispatch(
      registerUser({ ...data, role: selectedRole })
    );
    if (registerUser.fulfilled.match(result)) {
      setSuccess(true);
      toast.success("Account created! Please verify your email.");
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center mx-auto mb-4">
          <FiMail size={28} className="text-accent-600" />
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
          Check your email
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          We sent a verification link to your inbox. Click it to activate your
          account, then log in.
        </p>
        <p className="text-xs text-amber-600 mt-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
          Note: In development mode the verification link is logged to the
          server console, not emailed.
        </p>
        <Button
          className="mt-6 w-full"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
        Create your account
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-6">
        Join NourishNet and help reduce food waste.
      </p>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {ROLES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setSelectedRole(r.value)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all",
              selectedRole === r.value
                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300"
            )}
          >
            <span className="text-sm font-semibold">{r.label}</span>
            <span className="text-[10px] leading-tight">{r.desc}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          icon={FiUser}
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name too short" }
          })}
        />
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
        <Input
          label="Password"
          icon={FiLock}
          type="password"
          placeholder="Min 6 characters"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" }
          })}
        />

        <Button
          type="submit"
          fullWidth
          loading={status === "loading"}
          className="mt-2"
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary-600 hover:text-primary-700"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
};

export default RegisterPage;
