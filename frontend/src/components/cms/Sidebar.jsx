import React, { useState } from "react";
import { FaLandmark, FaUser, FaComments } from "react-icons/fa";
import { MdLocalMovies } from "react-icons/md";
import { Link } from "react-router-dom";
import { GiDramaMasks } from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi2";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useAuthStore } from "../../store/authStore"; // Assuming role is stored in authStore

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState(0);
  const [isDramaOpen, setIsDramaOpen] = useState(false);
  
  const { user } = useAuthStore();
  const userRole = user?.role;

  const handleLinkClick = (index) => {
    setActiveLink(index);
  };

  const SIDEBAR_LINKS = [
    {
      id: 1,
      path: "/cms",
      name: "Drama",
      icon: MdLocalMovies,
      subItems: [
        { id: 1.1, path: "/cms", name: "Show Drama", visibleTo: "Admin" },
        { id: 1.2, path: "/cms/input-drama", name: "Input New Drama", visibleTo: "User" },
      ],
    },
    { id: 2, path: "/cms/countries", name: "Countries", icon: FaLandmark, visibleTo: "Admin" },
    { id: 3, path: "/cms/genres", name: "Genres", icon: GiDramaMasks, visibleTo: "Admin" },
    { id: 4, path: "/cms/actors", name: "Actors", icon: HiUserGroup, visibleTo: "Admin" },
    { id: 5, path: "/cms/reviews", name: "Reviews", icon: FaComments, visibleTo: "Admin" },
    { id: 6, path: "/cms/users", name: "Users", icon: FaUser, visibleTo: "Admin" },
  ];

  return (
    <div className="tw-w-16 md:tw-w-56 tw-fixed tw-left-0 tw-top-0 tw-z-10 tw-h-screen tw-bg-white tw-border-r md:tw-pl-2 tw-pt-8 tw-px-4 md:tw-px-4">
      <div className="tw-flex tw-justify-center md:tw-justify-start tw-items-center">
        <img src="/logo.png" alt="Logo" className="tw-w-10 md:tw-w-20" />
        <h1 className="tw-font-bold tw-text-xl tw-hidden md:tw-flex">THE FILMS</h1>
      </div>

      <ul className="tw-mt-4 tw-space-y-6">
        {SIDEBAR_LINKS.map((link, index) => (
          (link.visibleTo === userRole || link.visibleTo === "User" || !link.visibleTo) && (
            <li key={index}>
              <div
                className={`tw-font-medium tw-rounded-md tw-py-1 tw-px-5 hover:tw-bg-gray-100 hover:tw-text-red-500 tw-flex tw-justify-between tw-items-center ${
                  activeLink === index ? "tw-bg-red-100 tw-text-red-500" : ""
                }`}
              >
                <Link
                  to={link.path}
                  className="tw-flex tw-justify-center md:tw-justify-start tw-items-center md:tw-space-x-5"
                  onClick={() => {
                    handleLinkClick(index);
                    if (link.subItems) {
                      setIsDramaOpen(!isDramaOpen);
                    }
                  }}
                >
                  <span>{<link.icon size={25} />}</span>
                  <span className="tw-text-m tw-text-gray-500 tw-hidden md:tw-flex tw-font-semibold">
                    {link.name}
                  </span>
                </Link>
                {link.subItems && (
                  <span onClick={() => setIsDramaOpen(!isDramaOpen)} className="tw-cursor-pointer">
                    {isDramaOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                )}
              </div>

              {link.subItems && isDramaOpen && (
                <ul className="tw-ml-6 tw-pl-4 tw-border-l tw-border-gray-300 tw-mt-2 tw-space-y-2">
                  {link.subItems.map(
                    (subItem) =>
                      (subItem.visibleTo === userRole || subItem.visibleTo === "User") && (
                        <li key={subItem.id}>
                          <Link
                            to={subItem.path}
                            className="tw-text-sm tw-text-gray-400 hover:tw-bg-gray-100 hover:tw-text-red-500 tw-block tw-rounded-md tw-py-2 tw-px-4"
                            onClick={() => handleLinkClick(index)}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      )
                  )}
                </ul>
              )}
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
