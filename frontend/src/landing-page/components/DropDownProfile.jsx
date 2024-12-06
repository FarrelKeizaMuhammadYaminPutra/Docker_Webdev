import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../style/landingpage.css";
import "../../style/navbar.css";
import { useAuthStore } from "../../store/authStore";

const DropDownProfile = () => {
  const { isAuthenticated } = useAuthStore(); // Ambil status login

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {!isAuthenticated && (
        <div className="dropdown-profile" onClick={toggleDropdown}>
          <FaUserCircle className="profile-icon" />
          {isOpen && (
            <div className="dropdown-menu-custom">
              <Link to="/login" className="dropdown-item">Login</Link>
              <Link to="/signup" className="dropdown-item">Signup</Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DropDownProfile;
