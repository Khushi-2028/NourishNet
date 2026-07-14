import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { verifyEmail } from "../../features/auth/authSlice";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(verifyEmail(token));
  }, [token, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      {status === "loading" && (
        <>
          <FiLoader size={40} className="animate-spin text-primary-500 mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
            Verifying your email…
          </h2>
        </>
      )}

      {status === "succeeded" && (
        <>
          <div className="w-16 h-16 rounded-2xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle size={32} className="text-accent-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Email verified!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Your account is active. You can now sign in.
          </p>
          <Link to="/login" className="btn-primary mt-6 inline-flex">
            Go to Login
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-4">
            <FiXCircle size={32} className="text-rose-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Verification failed
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            {error || "The verification link is invalid or has expired."}
          </p>
          <Link to="/register" className="btn-outline mt-6 inline-flex">
            Register again
          </Link>
        </>
      )}
    </motion.div>
  );
};

export default VerifyEmailPage;
