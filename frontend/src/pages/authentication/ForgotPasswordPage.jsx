import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import Input from "../../components/authentication/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
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
        className="tw-max-w-md tw-w-full tw-bg-gray-800 tw-bg-opacity-50 tw-backdrop-filter tw-rounded-2xl tw-shadow-xl tw-overflow-hidden"
      >
        <div className="tw-p-8">
          <h2 className="tw-text-3xl tw-font-bold tw-mb-6 tw-text-center tw-bg-gradient-to-r tw-from-red-600 tw-to-red-800 tw-text-transparent tw-bg-clip-text">
            Forgot Password
          </h2>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <p className="tw-text-gray-300 tw-mb-6 tw-text-center">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="tw-w-full tw-py-3 tw-px-4 tw-bg-gradient-to-r tw-from-red-600 tw-to-red-800 tw-text-white tw-font-bold tw-rounded-lg tw-shadow-lg hover:tw-from-red-800 hover:tw-to-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-500 focus:tw-ring-offset-2 focus:tw-ring-offset-gray-900 tw-transition tw-duration-200"
                type="submit"
              >
                {isLoading ? (
                  <Loader className="tw-size-6 tw-animate-spin tw-mx-auto" />
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>
            </form>
          ) : (
            <div className="tw-text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="tw-w-16 tw-h-16 tw-bg-red-600 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4"
              >
                <Mail className="tw-h-8 tw-w-8 tw-text-white" />
              </motion.div>
              <p className="tw-text-gray-300 tw-mb-6">
                If an account exists for {email}, you will receive a password
                reset link shortly.
              </p>
            </div>
          )}
        </div>

        <div className="tw-px-8 tw-py-4 tw-bg-gray-900 tw-bg-opacity-50 tw-flex tw-justify-center">
          <Link
            to={"/login"}
            className="tw-text-sm tw-text-white hover:tw-underline tw-flex tw-items-center"
          >
            <ArrowLeft className="tw-h-4 tw-w-4 tw-mr-2" /> Back to Login
          </Link>
        </div>
      </motion.div>
      <Toaster />
    </div>
  );
};
export default ForgotPasswordPage;
