import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser, clearAuthError } from "../../features/auth/authSlice";
import { ROLE_HOME } from "../../utils/constants";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, isAuthenticated, user } = useAppSelector((s) => s.auth);

  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

 const onSubmit = async (data) => {
    try {
        const result = await dispatch(loginUser(data)).unwrap();
              navigate(
            ROLE_HOME[result.user.role],
            { replace: true }
        );

    } catch (err) {
        toast.error(err);
    }
}; 
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
        Welcome back
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-6">
        Sign in to your NourishNet account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          icon={FiMail}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
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
          placeholder="Your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          loading={status === "loading"}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Demo accounts
        </p>
        <p>After registering, check the server console for the verify-email link (emails are not sent in dev mode).</p>
      </div>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-primary-600 hover:text-primary-700"
        >
          Create one
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginPage;
