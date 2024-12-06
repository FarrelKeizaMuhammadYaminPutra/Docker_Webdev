import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    email: "",
    password: "",
    retypePassword: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        const usersWithStatus = response.data.users.map((user) => ({
          ...user,
          status: user.isVerified ? "Active" : "Inactive",
        }));
        setUsers(usersWithStatus);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      setError(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };

  const toggleStatus = async (userId) => {
    try {
      const user = users.find((user) => user.id === userId);
      const newStatus = !user.isVerified;

      await axios.put(`http://localhost:5000/api/users/${userId}/status`, {
        isVerified: newStatus,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                isVerified: newStatus,
                status: newStatus ? "Active" : "Inactive",
              }
            : user
        )
      );
      setError(null);
    } catch (error) {
      console.error("Error updating user status:", error);
      setError("Failed to update user status");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/role`, {
        role: newRole,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      setRoleDropdownOpen(null);
      setError(null);
    } catch (error) {
      console.error("Error updating user role:", error);
      setError("Failed to update user role");
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewUserInput = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/users", {
        name: newUser.username,
        email: newUser.email,
        password: newUser.password,
      });
      setUsers([...users, response.data.user]); // Add the new user to the list
      setNewUser({ username: "", email: "", password: "" });
      setError(null);
      alert("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to add user";
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const openEditModal = (user) => {
    setEditData({
      id: user.id,
      username: user.name,
      email: user.email,
      password: "",
      retypePassword: "",
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData({ username: "", email: "", password: "", retypePassword: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (editData.password !== editData.retypePassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/users/${editData.id}`, {
        name: editData.username,
        email: editData.email,
        password: editData.password || undefined,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editData.id
            ? { ...user, name: editData.username, email: editData.email }
            : user
        )
      );
      alert("User updated successfully!");
      closeEditModal();
      setError(null); // Clear previous errors
    } catch (error) {
      console.error("Error updating user:", error);

      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to update user";
      setError(errorMessage); // Display error without resetting form data
    }
  };

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="tw-px-4 tw-flex tw-flex-col tw-justify-start tw-items-center tw-bg-gray-100 tw-min-h-screen tw-w-full">
      <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-overflow-hidden tw-w-full tw-mx-4 sm:tw-mx-6 lg:tw-mx-auto tw-my-4">
        <div className="tw-p-4">
          <h2 className="tw-text-2xl tw-font-bold tw-text-gray-800">
            Page Users
          </h2>

          {/* Insert Users Section */}
          <div>
            <h1 className="tw-text-gray-500 tw-font-semibold tw-text-lg tw-mt-4">
              Insert Users
            </h1>
            <div className="tw-flex tw-space-x-4 tw-items-center">
              <input
                type="text"
                placeholder="Enter username"
                name="username"
                value={newUser.username}
                onChange={handleNewUserInput}
                className="tw-bg-indigo-100/30 tw-border tw-px-4 tw-py-2 tw-rounded-lg focus:tw-outline-0 focus:tw-ring-2 focus:tw-ring-gray-300"
              />
              <input
                type="text"
                placeholder="Enter email"
                name="email"
                value={newUser.email}
                onChange={handleNewUserInput}
                className="tw-bg-indigo-100/30 tw-border tw-px-4 tw-py-2 tw-rounded-lg focus:tw-outline-0 focus:tw-ring-2 focus:tw-ring-gray-300"
              />
              <input
                type="password"
                placeholder="Enter password"
                name="password"
                value={newUser.password}
                onChange={handleNewUserInput}
                className="tw-bg-indigo-100/30 tw-border tw-px-4 tw-py-2 tw-rounded-lg focus:tw-outline-0 focus:tw-ring-2 focus:tw-ring-gray-300"
              />
            </div>
            <div className="tw-mt-2">
              <button
                onClick={handleAddUser}
                className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-xl tw-bg-green-600 tw-py-2 tw-px-6 tw-font-medium tw-text-white"
              >
                Submit
              </button>
            </div>

            {/* Search Bar */}
            <div className="tw-mt-2 tw-flex tw-justify-end">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="tw-border tw-border-gray-400 focus:tw-outline-0 focus:tw-ring-1 focus:tw-ring-gray-300 tw-rounded-full tw-px-4 tw-py-1 tw-w-full sm:tw-w-auto"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="tw-mt-4">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <>
              <div className="tw-overflow-x-auto">
                <table className="tw-min-w-full tw-bg-white tw-border tw-border-gray-300">
                  <thead>
                    <tr className="tw-bg-gray-100">
                      <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                        #
                      </th>
                      <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                        Username
                      </th>
                      <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                        Email
                      </th>
                      <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                        Status
                      </th>
                      <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                        Role
                      </th>
                      <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className={
                          index % 2 === 0 ? "tw-bg-white" : "tw-bg-gray-50"
                        }
                      >
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          {user.name}
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          {user.email}
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          <button
                            onClick={() => toggleStatus(user.id)}
                            className={`tw-px-4 tw-py-1 tw-rounded-full tw-text-white ${
                              user.isVerified
                                ? "tw-bg-green-500"
                                : "tw-bg-red-500"
                            }`}
                          >
                            {user.isVerified ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 relative">
                          <button
                            onClick={() =>
                              setRoleDropdownOpen(
                                roleDropdownOpen === user.id ? null : user.id
                              )
                            }
                            className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-1 tw-rounded-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                          >
                            {user.role || "User"}
                          </button>
                          {roleDropdownOpen === user.id && (
                            <div className="tw-absolute tw-bg-white tw-border tw-rounded-lg tw-shadow-lg tw-mt-1 tw-z-10">
                              <button
                                onClick={() =>
                                  handleRoleChange(user.id, "User")
                                }
                                className="tw-block tw-w-full tw-px-4 tw-py-2 tw-text-left hover:tw-bg-blue-100"
                              >
                                User
                              </button>
                              <button
                                onClick={() =>
                                  handleRoleChange(user.id, "Admin")
                                }
                                className="tw-block tw-w-full tw-px-4 tw-py-2 tw-text-left hover:tw-bg-blue-100"
                              >
                                Admin
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          <a
                            href="#"
                            className="tw-text-blue-600 hover:tw-underline tw-mr-2"
                            onClick={() => openEditModal(user)}
                          >
                            Edit
                          </a>
                          <span className="tw-text-gray-500">|</span>
                          <a
                            href="#"
                            className="tw-text-red-600 hover:tw-underline tw-ml-2"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </>
            ) : (
              <div className="tw-overflow-x-auto">
                <table className="tw-min-w-full tw-bg-white tw-border tw-border-gray-300">
                  <thead>
                    <tr className="tw-bg-gray-100">
                      <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                        #
                      </th>
                      <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                        Username
                      </th>
                      <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                        Email
                      </th>
                      <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                        Status
                      </th>
                      <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                        Role
                      </th>
                      <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className={
                          index % 2 === 0 ? "tw-bg-white" : "tw-bg-gray-50"
                        }
                      >
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          {user.name}
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          {user.email}
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          <button
                            onClick={() => toggleStatus(user.id)}
                            className={`tw-px-4 tw-py-1 tw-rounded-full tw-text-white ${
                              user.isVerified
                                ? "tw-bg-green-500"
                                : "tw-bg-red-500"
                            }`}
                          >
                            {user.isVerified ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 relative">
                          <button
                            onClick={() =>
                              setRoleDropdownOpen(
                                roleDropdownOpen === user.id ? null : user.id
                              )
                            }
                            className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-1 tw-rounded-full focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                          >
                            {user.role || "User"}
                          </button>
                          {roleDropdownOpen === user.id && (
                            <div className="tw-absolute tw-bg-white tw-border tw-rounded-lg tw-shadow-lg tw-mt-1 tw-z-10">
                              <button
                                onClick={() =>
                                  handleRoleChange(user.id, "User")
                                }
                                className="tw-block tw-w-full tw-px-4 tw-py-2 tw-text-left hover:tw-bg-blue-100"
                              >
                                User
                              </button>
                              <button
                                onClick={() =>
                                  handleRoleChange(user.id, "Admin")
                                }
                                className="tw-block tw-w-full tw-px-4 tw-py-2 tw-text-left hover:tw-bg-blue-100"
                              >
                                Admin
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          <a
                            href="#"
                            className="tw-text-blue-600 hover:tw-underline tw-mr-2"
                            onClick={() => openEditModal(user)}
                          >
                            Edit
                          </a>
                          <span className="tw-text-gray-500">|</span>
                          <a
                            href="#"
                            className="tw-text-red-600 hover:tw-underline tw-ml-2"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="tw-px-6 tw-py-3 tw-border-t tw-border-gray-200 tw-bg-white tw-flex tw-items-center tw-justify-between">
            <div className="tw-flex tw-flex-1 tw-justify-between sm:tw-hidden">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="tw-relative tw-inline-flex tw-items-center tw-rounded-md tw-border tw-border-gray-300 tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 hover:tw-bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={
                  currentPage === Math.ceil(filteredUsers.length / itemsPerPage)
                }
                className="tw-relative tw-ml-3 tw-inline-flex tw-items-center tw-rounded-md tw-border tw-border-gray-300 tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 hover:tw-bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="tw-hidden sm:tw-flex sm:tw-flex-1 sm:tw-items-center sm:tw-justify-between">
              <p className="tw-text-sm tw-text-gray-700">
                Showing {indexOfFirstUser + 1} to{" "}
                {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                {filteredUsers.length} results
              </p>
              <nav
                className="tw-isolate tw-inline-flex -tw-space-x-px tw-rounded-md tw-shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="tw-relative tw-inline-flex tw-items-center tw-rounded-l-md tw-px-2 tw-py-2 tw-text-gray-400 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50"
                >
                  Previous
                </button>

                {/* Conditional logic to show page numbers */}
                {Math.ceil(filteredUsers.length / itemsPerPage) === 1 ? (
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-bg-indigo-600 tw-text-white"
                  >
                    1
                  </button>
                ) : (
                  <>
                    {/* Always show first page */}
                    <button
                      onClick={() => setCurrentPage(1)}
                      className={`tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold ${
                        currentPage === 1
                          ? "tw-bg-indigo-600 tw-text-white"
                          : "tw-text-gray-900 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50"
                      }`}
                    >
                      1
                    </button>

                    {/* Ellipsis for pages beyond the first page */}
                    {currentPage > 10 && (
                      <span className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-gray-700">
                        ...
                      </span>
                    )}

                    {/* Dynamic pages around the current page */}
                    {Array.from({ length: 10 }, (_, i) => {
                      const page =
                        currentPage <= 10
                          ? i + 2
                          : Math.floor((currentPage - 1) / 10) * 10 + i + 1;
                      return (
                        page < Math.ceil(filteredUsers.length / itemsPerPage) &&
                        page > 1 && (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold ${
                              page === currentPage
                                ? "tw-bg-indigo-600 tw-text-white"
                                : "tw-text-gray-900 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      );
                    })}

                    {/* Ellipsis for pages before the last page */}
                    {currentPage <=
                      Math.ceil(filteredUsers.length / itemsPerPage) - 10 && (
                      <span className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-gray-700">
                        ...
                      </span>
                    )}

                    {/* Show last page if more than one page */}
                    <button
                      onClick={() =>
                        setCurrentPage(
                          Math.ceil(filteredUsers.length / itemsPerPage)
                        )
                      }
                      className={`tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold ${
                        currentPage ===
                        Math.ceil(filteredUsers.length / itemsPerPage)
                          ? "tw-bg-indigo-600 tw-text-white"
                          : "tw-text-gray-900 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50"
                      }`}
                    >
                      {Math.ceil(filteredUsers.length / itemsPerPage)}
                    </button>
                  </>
                )}

                <button
                  onClick={handleNextPage}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredUsers.length / itemsPerPage)
                  }
                  className="tw-relative tw-inline-flex tw-items-center tw-rounded-r-md tw-px-2 tw-py-2 tw-text-gray-400 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="tw-fixed tw-inset-0 tw-bg-black/30 tw-flex tw-justify-center tw-items-center tw-z-50">
          <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-w-full sm:tw-w-3/4 lg:tw-w-1/2 tw-p-6">
            <h3 className="tw-text-xl tw-font-bold tw-text-gray-800">
              Edit User
            </h3>
            <form onSubmit={handleEditSubmit} className="tw-space-y-4 tw-mt-4">
              {error && <p className="tw-text-red-500">{error}</p>}
              <input
                type="text"
                name="username"
                value={editData.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="tw-w-full tw-bg-indigo-100/30 tw-border tw-px-4 tw-py-2 tw-rounded-lg focus:tw-outline-0 focus:tw-ring-2 focus:tw-ring-gray-300"
              />
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="tw-w-full tw-bg-indigo-100/30 tw-border tw-px-4 tw-py-2 tw-rounded-lg focus:tw-outline-0 focus:tw-ring-2 focus:tw-ring-gray-300"
              />
              <input
                type="password"
                name="password"
                value={editData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="tw-w-full tw-bg-indigo-100/30 tw-border tw-px-4 tw-py-2 tw-rounded-lg focus:tw-outline-0 focus:tw-ring-2 focus:tw-ring-gray-300"
              />
              <input
                type="password"
                name="retypePassword"
                value={editData.retypePassword}
                onChange={handleInputChange}
                placeholder="Re-type Password"
                className="tw-w-full tw-bg-indigo-100/30 tw-border tw-px-4 tw-py-2 tw-rounded-lg focus:tw-outline-0 focus:tw-ring-2 focus:tw-ring-gray-300"
              />
              <div className="tw-flex tw-justify-end tw-space-x-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="tw-bg-gray-500 tw-px-4 tw-py-2 tw-rounded-lg tw-text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tw-bg-green-600 tw-px-4 tw-py-2 tw-rounded-lg tw-text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
