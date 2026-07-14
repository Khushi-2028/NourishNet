import { FiMoon, FiSun } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectTheme, toggleTheme } from "../../features/ui/uiSlice";

const ThemeToggle = ({ className = "" }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={`relative w-11 h-11 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      {isDark ? <FiSun size={19} /> : <FiMoon size={19} />}
    </button>
  );
};

export default ThemeToggle;
