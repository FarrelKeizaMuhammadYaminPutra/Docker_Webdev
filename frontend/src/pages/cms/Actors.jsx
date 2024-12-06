import React, { useState, useEffect } from "react";
import axios from "axios";

const Actors = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [actorName, setActorName] = useState("");
  const [actors, setActors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingActorId, setEditingActorId] = useState(null);
  const [existingProfilePath, setExistingProfilePath] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setActorName(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!actorName || (!selectedFile && !existingProfilePath)) {
      alert("Please provide both a name and a profile picture.");
      return;
    }

    if (selectedFile) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(selectedFile.type)) {
        alert("Only JPG, PNG, and GIF files are allowed.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", actorName);

    if (selectedFile) {
      formData.append("profile_path", selectedFile);
    } else if (existingProfilePath) {
      formData.append("profile_path", existingProfilePath);
    }

    try {
      if (editingActorId) {
        const response = await axios.put(
          `http://localhost:5000/api/actors/${editingActorId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Actor updated successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/actors",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Actor successfully added!");
      }

      setActorName("");
      setSelectedFile(null);
      setExistingProfilePath(null);
      setEditingActorId(null);

      fetchActors();
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Failed to save actor.");
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  const fetchActors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/actors", {
        params: { limit: 5000 },
      });
      const sortedActors = (response.data.actors || []).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setActors(sortedActors);
    } catch (error) {
      console.error("Error fetching actors:", error);
    }
  };

  const handleDelete = async (actorId) => {
    if (!window.confirm("Are you sure you want to delete this actor?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/actors/${actorId}`);
      setActors((prevActors) =>
        prevActors.filter((actor) => actor.id !== actorId)
      );
      alert("Actor deleted successfully!");

      if (editingActorId === actorId) {
        setEditingActorId(null);
        setActorName("");
        setSelectedFile(null);
        setExistingProfilePath(null);
      }
    } catch (error) {
      alert("Failed to delete actor.");
    }
  };

  const handleEdit = (actor) => {
    setActorName(actor.name);
    setEditingActorId(actor.id);
    setExistingProfilePath(actor.profile_path);
    setSelectedFile(null);
  };

  useEffect(() => {
    fetchActors();
  }, []);

  const filteredActors = actors.filter((actor) =>
    actor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastActor = currentPage * itemsPerPage;
  const indexOfFirstActor = indexOfLastActor - itemsPerPage;
  const currentActors = filteredActors.slice(
    indexOfFirstActor,
    indexOfLastActor
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredActors.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="tw-px-4 tw-flex tw-flex-col tw-justify-start tw-items-center tw-bg-gray-100 tw-min-h-screen tw-w-full">
      <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-overflow-hidden tw-w-full tw-mx-4 sm:tw-mx-6 lg:tw-mx-auto lg:tw-max-w-7xl tw-my-4">
        <div className="tw-p-4">
          <h2 className="tw-text-2xl tw-font-bold tw-text-gray-800">
            Page Actors
          </h2>
          <h1 className="tw-text-gray-500 tw-font-semibold tw-text-lg tw-mt-4">
            {editingActorId ? "Edit Actor" : "Insert Actor"}
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="tw-flex tw-flex-col tw-space-y-4 sm:tw-space-y-0 sm:tw-flex-row sm:tw-space-x-4 tw-items-center">
              <input
                type="text"
                placeholder="Enter actor name"
                value={actorName}
                onChange={handleNameChange}
                className="tw-w-full tw-border sm:tw-w-auto tw-bg-indigo-100/30 tw-px-4 tw-py-2 tw-rounded-lg focus:tw-outline-0 focus:tw-ring-2 focus:tw-ring-gray-300"
              />
              <div className="tw-flex tw-items-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="tw-hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="tw-cursor-pointer tw-inline-flex tw-items-center tw-justify-center tw-px-4 tw-py-2 tw-bg-gray-200 tw-border tw-rounded-md tw-text-gray-700 hover:tw-bg-gray-300"
                >
                  Choose File
                </label>
                <span className="tw-ml-2">
                  {selectedFile
                    ? selectedFile.name
                    : existingProfilePath
                    ? existingProfilePath.split("/").pop()
                    : "No file chosen"}
                </span>
              </div>
            </div>

            <div className="tw-mt-2 tw-flex tw-flex-col tw-space-y-2 sm:tw-space-y-0 sm:tw-space-x-4 sm:tw-flex-row tw-items-center">
              <button
                type="submit"
                className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-xl tw-bg-green-600 tw-py-2 tw-px-6 tw-font-medium tw-text-white tw-shadow-xl tw-transition-transform tw-duration-200 tw-ease-in-out hover:tw-scale-[1.02]"
              >
                {editingActorId ? "Save" : "Submit"}
              </button>
            </div>
          </form>

          <div className="tw-mt-2 tw-flex tw-justify-end">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="tw-border tw-border-gray-400 focus:tw-outline-0 focus:tw-ring-1 focus:tw-ring-gray-300 tw-rounded-full tw-px-4 tw-py-1 tw-w-full sm:tw-w-auto"
            />
          </div>

          <div className="tw-mt-4 tw-overflow-x-auto tw-max-h-96 tw-overflow-y-auto">
            <table className="tw-min-w-full tw-bg-white tw-border tw-border-gray-300">
              <thead>
                <tr className="tw-bg-gray-100">
                  <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                    #
                  </th>
                  <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                    Actor Name
                  </th>
                  <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                    Photo
                  </th>
                  <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentActors.length > 0 ? (
                  currentActors.map((actor, index) => (
                    <tr
                      key={actor.id}
                      className={
                        index % 2 === 0 ? "tw-bg-white" : "tw-bg-gray-50"
                      }
                    >
                      <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                        {indexOfFirstActor + index + 1}
                      </td>
                      <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                        {actor.name}
                      </td>
                      <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                        {actor.profile_path ? (
                          <img
                            src={
                              actor.profile_path.startsWith("uploads")
                                ? `http://localhost:5000/${actor.profile_path}`
                                : actor.profile_path
                            }
                            alt={`${actor.name} photo`}
                            className="tw-w-20 tw-h-25 tw-rounded"
                          />
                        ) : (
                          <div className="tw-w-16 tw-h-16 tw-bg-gray-300 tw-rounded"></div>
                        )}
                      </td>
                      <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                        <a
                          onClick={() => handleEdit(actor)}
                          className="tw-text-blue-600 hover:tw-underline tw-cursor-pointer"
                        >
                          Edit
                        </a>
                        <span className="tw-text-gray-500 tw-px-2">|</span>
                        <a
                          onClick={() => handleDelete(actor.id)}
                          className="tw-text-red-600 hover:tw-underline tw-cursor-pointer"
                        >
                          Delete
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300"
                      colSpan="4"
                    >
                      No actors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="tw-flex tw-items-center tw-justify-between tw-border-t tw-border-gray-200 tw-bg-white tw-px-4 tw-py-3 sm:tw-px-6">
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
                  currentPage ===
                  Math.ceil(filteredActors.length / itemsPerPage)
                }
                className="tw-relative tw-ml-3 tw-inline-flex tw-items-center tw-rounded-md tw-border tw-border-gray-300 tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 hover:tw-bg-gray-50"
              >
                Next
              </button>
            </div>

            <div className="tw-hidden sm:tw-flex sm:tw-flex-1 sm:tw-items-center sm:tw-justify-between">
              <p className="tw-text-sm tw-text-gray-700">
                Showing {indexOfFirstActor + 1} to{" "}
                {Math.min(indexOfLastActor, filteredActors.length)} of{" "}
                {filteredActors.length} results
              </p>
              <nav
                className="tw-isolate tw-inline-flex -tw-space-x-px tw-rounded-md tw-shadow-sm"
                aria-label="Pagination"
              >
                {/* Previous Button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="tw-relative tw-inline-flex tw-items-center tw-rounded-l-md tw-px-2 tw-py-2 tw-text-gray-400 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50"
                >
                  Previous
                </button>

                {/* Pagination Buttons */}
                {Math.ceil(filteredActors.length / itemsPerPage) === 1 ? (
                  // Show only page 1 if there's a single page
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

                    {/* Ellipsis for pages beyond first page */}
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
                        page <
                          Math.ceil(filteredActors.length / itemsPerPage) &&
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
                      Math.ceil(filteredActors.length / itemsPerPage) - 10 && (
                      <span className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-gray-700">
                        ...
                      </span>
                    )}

                    {/* Show last page if more than one page */}
                    <button
                      onClick={() =>
                        setCurrentPage(
                          Math.ceil(filteredActors.length / itemsPerPage)
                        )
                      }
                      className={`tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold ${
                        currentPage ===
                        Math.ceil(filteredActors.length / itemsPerPage)
                          ? "tw-bg-indigo-600 tw-text-white"
                          : "tw-text-gray-900 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50"
                      }`}
                    >
                      {Math.ceil(filteredActors.length / itemsPerPage)}
                    </button>
                  </>
                )}

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredActors.length / itemsPerPage)
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
    </div>
  );
};

export default Actors;
