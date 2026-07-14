import { useAppSelector } from "../store/hooks";
import { selectAuth } from "../features/auth/authSlice";

export const useAuth = () => {
  const { user, isAuthenticated, status, error } = useAppSelector(selectAuth);
  return { user, isAuthenticated, status, error };
};

export default useAuth;
