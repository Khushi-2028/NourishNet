import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const TextArea = forwardRef(
  ({ label, error, className = "", containerClassName = "", rows = 4, ...props }, ref) => {
    return (
      <div className={containerClassName}>
        {label && <label className="label">{label}</label>}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            "input resize-none",
            error && "!border-rose-400 focus:!ring-rose-100",
            className
          )}
          {...props}
        />
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
