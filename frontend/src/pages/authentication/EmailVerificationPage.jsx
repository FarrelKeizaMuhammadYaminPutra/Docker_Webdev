import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import toast, { Toaster } from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email verified successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-relative tw-overflow-hidden">
      <img
        src="/bg.jpg"
        alt="background"
        className="tw-absolute tw-inset-0 tw-w-full tw-h-full tw-object-cover tw-z-[-1]"
      />
      <div className="tw-max-w-md tw-w-full tw-bg-gray-800 tw-bg-opacity-50 tw-backdrop-filter tw-rounded-2xl tw-shadow-xl tw-overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="tw-bg-gray-800 tw-bg-opacity-50 tw-backdrop-filter tw-rounded-2xl tw-shadow-2xl tw-p-8 tw-w-full tw-max-w-md"
        >
          <h2 className="tw-text-3xl tw-font-bold tw-mb-6 tw-text-center tw-bg-gradient-to-l tw-from-red-600 tw-to-red-800 tw-text-transparent tw-bg-clip-text">
            Verify Your Email
          </h2>
          <p className="tw-text-center tw-text-gray-300 tw-mb-6">
            Enter the 6-digit code sent to your email address.
          </p>

          <form onSubmit={handleSubmit} className="tw-space-y-6">
            <div className="tw-flex tw-justify-between">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="6"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="tw-w-12 tw-h-12 tw-text-center tw-text-2xl tw-font-bold tw-bg-gray-700 tw-text-white tw-border-2 tw-border-gray-600 tw-rounded-lg focus:tw-border-white focus:tw-outline-none"
                />
              ))}
            </div>
            {error && (
              <p className="tw-text-red-500 tw-font-semibold tw-mt-2">
                {error}
              </p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || code.some((digit) => !digit)}
              className="tw-w-full tw-py-3 tw-px-4 tw-bg-gradient-to-r tw-from-red-600 tw-to-red-800 tw-text-white tw-font-bold tw-rounded-lg tw-shadow-lg hover:tw-from-red-800 hover:tw-to-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-900 focus:tw-ring-offset-2 focus:tw-ring-offset-gray-900 tw-transition tw-duration-250"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </motion.button>
          </form>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
};
export default EmailVerificationPage;
