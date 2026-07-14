import { forwardRef } from "react";
import { FiLoader } from "react-icons/fi";
import { cn } from "../../utils/cn";

const VARIANT_CLASSES = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger: "btn-danger"
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      icon: Icon,
      iconPosition = "left",
      className = "",
      type = "button",
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          VARIANT_CLASSES[variant],
          size === "sm" && "btn-sm",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && <FiLoader className="animate-spin" size={16} />}
        {!loading && Icon && iconPosition === "left" && <Icon size={16} />}
        {children}
        {!loading && Icon && iconPosition === "right" && <Icon size={16} />}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
