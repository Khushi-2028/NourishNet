import { forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { cn } from "../../utils/cn";

const Input = forwardRef(
  (
    {
      label,
      error,
      type = "text",
      icon: Icon,
      className = "",
      containerClassName = "",
      hint,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword && showPassword ? "text" : type;

    return (
      <div className={containerClassName}>
        {label && <label className="label">{label}</label>}
        <div className="relative">
          {Icon && (
            <Icon
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          )}
          <input
            ref={ref}
            type={resolvedType}
            className={cn(
              "input",
              Icon && "pl-10",
              isPassword && "pr-10",
              error && "!border-rose-400 focus:!ring-rose-100",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
            </button>
          )}
        </div>
        {hint && !error && (
          <p className="text-xs text-slate-400 mt-1">{hint}</p>
        )}
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
