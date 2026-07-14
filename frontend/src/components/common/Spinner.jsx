import { cn } from "../../utils/cn";

export const Spinner = ({ size = 24, className = "" }) => (
  <div
    className={cn("inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-primary-500", className)}
    style={{ width: size, height: size }}
    role="status"
    aria-label="Loading"
  />
);

export const FullPageSpinner = ({ label = "Loading NourishNet..." }) => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 bg-orange-50/40 dark:bg-surface-dark">
    <div className="relative">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 animate-pulseSoft" />
      <Spinner
        size={56}
        className="absolute inset-0 text-white/70 border-white/30"
      />
    </div>
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
      {label}
    </p>
  </div>
);

export const SectionLoader = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
    <Spinner size={22} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default Spinner;
