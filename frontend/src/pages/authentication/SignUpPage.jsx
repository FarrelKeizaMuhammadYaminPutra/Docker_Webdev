import { motion } from "framer-motion";
import Input from "../../components/authentication/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../../components/authentication/PasswordStrengthMeter";
import { useAuthStore } from "../../store/authStore";
import { Toaster } from "react-hot-toast";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
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
        className="tw-max-w-md tw-w-full tw-bg-gray-800 tw-bg-opacity-50 tw-backdrop-filter tw-rounded-2xl tw-shadow-xl 
			tw-overflow-hidden"
      >
        <div className="tw-p-8">
          <h2 className="tw-text-3xl tw-font-bold tw-mb-6 tw-text-center tw-bg-gradient-to-l tw-from-red-600 tw-to-red-800 tw-text-transparent tw-bg-clip-text">
            Create Account
          </h2>

          <form onSubmit={handleSignUp}>
            <Input
              icon={User}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p className="tw-text-red-500 tw-font-semibold tw-mt-2">
                {error}
              </p>
            )}
            <PasswordStrengthMeter password={password} />

            <motion.button
              className="tw-mt-5 tw-w-full tw-py-3 tw-px-4 tw-bg-gradient-to-r tw-from-red-600 tw-to-red-800 tw-text-white 
						tw-font-bold tw-rounded-lg tw-shadow-lg hover:tw-from-red-800
						hover:tw-to-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-500 focus:tw-ring-offset-2
						 focus:tw-ring-offset-gray-900 tw-transition tw-duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              role="status"
            >
              {isLoading ? (
                <Loader className="tw-animate-spin tw-mx-auto" size={24} />
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>
        </div>
        <div className="tw-px-8 tw-py-4 tw-bg-gray-900 tw-bg-opacity-50 tw-flex tw-justify-center">
          <p className="tw-text-sm tw-text-gray-400">
            Already have an account?{" "}
            <Link to={"/login"} className="tw-text-white hover:tw-underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
      <Toaster />
    </div>
  );
};
export default SignUpPage;
