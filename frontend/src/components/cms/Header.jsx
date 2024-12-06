import React from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";

const Header = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="tw-flex tw-justify-between tw-items-center tw-p-4">
      <div>
        <h1 className="tw-text-xs">Welcome Back!</h1>
        <p className="tw-text-xl tw-font-semibold">{user.name}</p>
      </div>
      <div className="tw-flex tw-items-center tw-space-x-5">
        <div className="tw-flex tw-items-center tw-space-x-5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="tw-w-full tw-py-2 tw-px-4 tw-bg-gradient-to-r tw-from-red-500 tw-to-red-500 tw-text-white tw-font-bold tw-rounded-lg tw-shadow-lg hover:tw-from-red-600 hover:tw-to-red-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-900 focus:tw-ring-offset-2 focus:tw-ring-offset-gray-900 tw-transition tw-duration-250"
          >
            Logout
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Header;
