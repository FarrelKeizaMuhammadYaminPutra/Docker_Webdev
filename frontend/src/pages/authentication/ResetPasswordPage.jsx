import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/authentication/Input";
import { Lock } from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token, password);

      toast.success(
        "Password reset successfully, redirecting to login page..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-relative tw-overflow-hidden">
      <img
        src="/bg.jpg"
        alt="background"
        className="tw-absolute tw-inset-0 tw-w-full tw-h-full tw-object-cover tw-z-[-1]"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="tw-max-w-md tw-w-full tw-bg-gray-900 tw-bg-opacity-50 tw-backdrop-filter tw-rounded-2xl tw-shadow-xl tw-overflow-hidden"
      >
        <div className="tw-p-8">
          <h2 className="tw-text-3xl tw-font-bold tw-mb-6 tw-text-center tw-bg-gradient-to-l tw-from-red-600 tw-to-red-800 tw-text-transparent tw-bg-clip-text">
            Reset Password
          </h2>
          {error && (
            <p className="tw-text-red-500 tw-text-sm tw-mb-4">{error}</p>
          )}
          {message && (
            <p className="tw-text-green-500 tw-text-sm tw-mb-4">{message}</p>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              icon={Lock}
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="tw-w-full tw-py-3 tw-px-4 tw-bg-gradient-to-r tw-from-red-600 tw-to-red-800 tw-text-white tw-font-bold tw-rounded-lg tw-shadow-lg hover:tw-from-red-800 hover:tw-to-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-900 focus:tw-ring-offset-2 focus:tw-ring-offset-gray-900 tw-transition tw-duration-250"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Set New Password"}
            </motion.button>
          </form>
        </div>
      </motion.div>
      <Toaster />
    </div>
  );
};
export default ResetPasswordPage;
