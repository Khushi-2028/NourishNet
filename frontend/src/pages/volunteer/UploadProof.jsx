import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUpload, FiImage, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

import Button from "../../components/common/Button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  uploadProof,
  selectDeliveriesMutationStatus,
} from "../../features/deliveries/deliveriesSlice";

const UploadProofPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectDeliveriesMutationStatus);

  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState("");

  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select a proof image.");
      return;
    }

    const formData = new FormData();

    formData.append("proofImage", image);
    formData.append("notes", notes);

    const result = await dispatch(
      uploadProof({
        deliveryId: id,
        formData,
      })
    );

    if (uploadProof.fulfilled.match(result)) {
      toast.success("Proof uploaded successfully.");

      navigate("/volunteer/dashboard");
    } else {
      toast.error(result.payload || "Upload failed.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6"
      >
        <FiArrowLeft />
        Back
      </button>

      <div className="card p-8">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-slate-800 flex items-center justify-center">
            <FiUpload
              className="text-primary-600"
              size={24}
            />
          </div>

          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
              Upload Delivery Proof
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Upload a delivery photo along with optional notes.
            </p>
          </div>
        </div>

        {/* Upload Area */}

        <div className="mb-6">

          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Proof Image
          </label>

          <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 hover:border-primary-500 transition">

            <FiImage
              size={42}
              className="text-slate-400 mb-3"
            />

            <span className="text-sm text-slate-500">
              Click to choose an image
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />

          </label>

        </div>

        {/* Preview */}

        {image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <p className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">
              Preview
            </p>

            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="rounded-xl border shadow w-full max-h-96 object-cover"
            />
          </motion.div>
        )}

        {/* Notes */}

        <div className="mb-8">

          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Delivery Notes
          </label>

          <textarea
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Example: Food delivered safely. NGO representative received the package."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

        </div>

        {/* Buttons */}

        <div className="flex gap-4">

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            loading={loading === "loading"}
            icon={FiUpload}
            onClick={handleUpload}
          >
            Upload Proof
          </Button>

        </div>

      </div>
    </motion.div>
  );
};

export default UploadProofPage;