import { useState } from "react";
import { FiDownload, FiFileText, FiTruck, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import adminApi from "../../api/adminApi";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { downloadBlob, reportFilename } from "../../utils/fileDownload";
import { REPORT_FORMATS } from "../../utils/constants";

const REPORT_TYPES = [
  { key: "donations", label: "Donations Report", icon: FiPackage, description: "Export all donation records with status, quantity, donor info, and timestamps." },
  { key: "deliveries", label: "Deliveries Report", icon: FiTruck, description: "Export all delivery records with volunteer, NGO, status, and location data." }
];

const AdminReportsPage = () => {
  const [loading, setLoading] = useState({});

  const handleDownload = async (type, format) => {
    const key = `${type}-${format}`;
    setLoading(p => ({ ...p, [key]: true }));
    try {
      const response = type === "donations"
        ? await adminApi.getDonationReport(format)
        : await adminApi.getDeliveryReport(format);

      downloadBlob(response.data, reportFilename(type, format));
      toast.success(`${type} report downloaded as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setLoading(p => ({ ...p, [key]: false }));
    }
  };

  return (
    <div>
      <PageHeader title="Reports" description="Download platform data as PDF, Excel, or CSV." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {REPORT_TYPES.map((report, i) => (
          <motion.div key={report.key}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }}
            className="card p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
                <report.icon size={22} />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 dark:text-white">{report.label}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{report.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {REPORT_FORMATS.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={value === "pdf" ? "primary" : value === "excel" ? "secondary" : "outline"}
                  size="sm"
                  icon={FiDownload}
                  loading={loading[`${report.key}-${value}`]}
                  onClick={() => handleDownload(report.key, value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card p-5 mt-6">
        <div className="flex gap-3">
          <FiFileText size={20} className="text-slate-400 shrink-0 mt-0.5" />
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">About Reports</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Reports are generated in real-time from live database data.</li>
              <li>PDF reports include formatted tables suitable for printing.</li>
              <li>Excel (.xlsx) reports include all fields and are sortable.</li>
              <li>CSV reports are raw data, importable into any spreadsheet tool.</li>
              <li>Large datasets may take a few seconds to generate.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
