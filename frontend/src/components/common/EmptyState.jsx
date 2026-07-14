import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";

const EmptyState = ({
  icon: Icon = FiInbox,
  title = "Nothing here yet",
  description = "",
  action = null
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-slate-800 dark:to-slate-800 flex items-center justify-center mb-4">
        <Icon size={28} className="text-primary-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
