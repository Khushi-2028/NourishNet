import { forwardRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "../../utils/cn";

const Select = forwardRef(
  (
    { label, error, options = [], placeholder = "Select...", className = "", containerClassName = "", ...props },
    ref
  ) => {
    return (
      <div className={containerClassName}>
        {label && <label className="label">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "input appearance-none pr-9 cursor-pointer",
              error && "!border-rose-400 focus:!ring-rose-100",
              className
            )}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) =>
              typeof opt === "string" ? (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ) : (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              )
            )}
          </select>
          <FiChevronDown
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
