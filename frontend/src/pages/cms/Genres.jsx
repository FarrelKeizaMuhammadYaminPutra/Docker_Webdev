import React, { useState, useEffect } from "react";
import axios from "axios";

const Genres = () => {
  const [genreName, setGenreName] = useState("");
  const [editGenreId, setEditGenreId] = useState(null);
  const [allGenres, setAllGenres] = useState([]);
  const [filteredGenres, setFilteredGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const fetchGenres = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/genres", {
        params: { limit: 1000 },
      });
      setAllGenres(response.data.genres || []);
      setFilteredGenres(response.data.genres || []);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    const results = searchTerm
      ? allGenres.filter((genre) =>
          genre.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allGenres;
    setFilteredGenres(results);
    setCurrentPage(1);
  }, [searchTerm, allGenres]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/genres", { name: genreName });
      alert("Genre added successfully!");
      setGenreName("");
      fetchGenres();
    } catch (error) {
      console.error("Error adding genre:", error);
      alert("Failed to add genre.");
    }
  };

  const handleEdit = (genre) => {
    setEditGenreId(genre.id);
    setGenreName(genre.name);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/genres/${editGenreId}`, {
        name: genreName,
      });
      setAllGenres(
        allGenres
          .map((genre) =>
            genre.id === editGenreId ? { ...genre, name: genreName } : genre
          )
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setGenreName("");
      setEditGenreId(null);
      alert("Genre updated successfully!");
    } catch (error) {
      console.error("Error updating genre:", error);
      alert("Failed to update genre.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this genre?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/genres/${id}`);
      setAllGenres(allGenres.filter((genre) => genre.id !== id));
      alert("Genre deleted successfully!");
    } catch (error) {
      console.error("Error deleting genre:", error);
      alert("Failed to delete genre.");
    }
  };

  const indexOfLastGenre = currentPage * itemsPerPage;
  const indexOfFirstGenre = indexOfLastGenre - itemsPerPage;
  const currentGenres = filteredGenres.slice(
    indexOfFirstGenre,
    indexOfLastGenre
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredGenres.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="tw-px-4 tw-flex tw-flex-col tw-justify-start tw-items-center tw-bg-gray-100 tw-min-h-screen tw-w-full">
      <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-overflow-hidden tw-w-full tw-mx-4 sm:tw-mx-6 lg:tw-mx-auto tw-my-4">
        <div className="tw-p-4">
          <h2 className="tw-text-2xl tw-font-bold tw-text-gray-800">
            Page Genres
          </h2>
          <h1 className="tw-text-gray-500 tw-font-semibold tw-text-lg tw-mt-4">
            {editGenreId ? "Edit Genre" : "Insert Genre"}
          </h1>
          <form onSubmit={editGenreId ? handleUpdate : handleSubmit}>
            <div className="tw-flex tw-space-x-4 tw-items-center">
              <input
                type="text"
                placeholder="Enter genre name"
                value={genreName}
                onChange={(e) => setGenreName(e.target.value)}
                className="tw-bg-indigo-100/30 tw-px-4 tw-py-2 tw-rounded-lg tw-border focus:tw-outline-0 focus:tw-ring-2 focus:tw-ring-gray-300"
              />
              <button
                type="submit"
                className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-xl tw-bg-green-600 tw-py-2 tw-px-6 tw-font-dm tw-text-base tw-font-medium tw-text-white tw-shadow-xl tw-shadow-green-100/75 tw-transition-transform tw-duration-200 tw-ease-in-out hover:tw-scale-[1.02]"
              >
                {editGenreId ? "Update" : "Submit"}
              </button>
            </div>
          </form>

          <div className="tw-mt-2 tw-flex tw-justify-end">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="tw-border tw-border-gray-400 focus:tw-outline-0 focus:tw-ring-1 focus:tw-ring-gray-300 tw-rounded-full tw-px-4 tw-py-1 tw-w-full sm:tw-w-auto"
            />
          </div>

          <div className="tw-mt-4">
            <div className="tw-overflow-x-auto tw-max-h-96 tw-overflow-y-auto">
              <table className="tw-min-w-full tw-bg-white tw-border tw-border-gray-300">
                <thead>
                  <tr className="tw-bg-gray-100">
                    <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                      #
                    </th>
                    <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                      Genres
                    </th>
                    <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentGenres.length > 0 ? (
                    currentGenres.map((genre, index) => (
                      <tr
                        key={genre.id}
                        className={
                          index % 2 === 0 ? "tw-bg-white" : "tw-bg-gray-50"
                        }
                      >
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          {indexOfFirstGenre + index + 1}
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          {genre.name}
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          <a
                            onClick={() => handleEdit(genre)}
                            className="tw-text-blue-600 hover:tw-underline tw-cursor-pointer"
                          >
                            Rename
                          </a>
                          <span className="tw-text-gray-500 tw-px-2">|</span>
                          <a
                            onClick={() => handleDelete(genre.id)}
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
                        colSpan="3"
                      >
                        No genres found
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
                    Math.ceil(filteredGenres.length / itemsPerPage)
                  }
                  className="tw-relative tw-ml-3 tw-inline-flex tw-items-center tw-rounded-md tw-border tw-border-gray-300 tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 hover:tw-bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="tw-hidden sm:tw-flex sm:tw-flex-1 sm:tw-items-center sm:tw-justify-between">
                <p className="tw-text-sm tw-text-gray-700">
                  Showing {indexOfFirstGenre + 1} to{" "}
                  {Math.min(indexOfLastGenre, filteredGenres.length)} of{" "}
                  {filteredGenres.length} results
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

                  {/* Single page or dynamic pagination */}
                  {Math.ceil(filteredGenres.length / itemsPerPage) === 1 ? (
                    // If only one page, show page 1 only
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-bg-indigo-600 tw-text-white"
                    >
                      1
                    </button>
                  ) : (
                    <>
                      {/* Always show the first page */}
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

                      {/* Ellipsis for pages beyond the first set */}
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
                            Math.ceil(filteredGenres.length / itemsPerPage) &&
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
                        Math.ceil(filteredGenres.length / itemsPerPage) -
                          10 && (
                        <span className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-gray-700">
                          ...
                        </span>
                      )}

                      {/* Show last page if more than one page */}
                      <button
                        onClick={() =>
                          setCurrentPage(
                            Math.ceil(filteredGenres.length / itemsPerPage)
                          )
                        }
                        className={`tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold ${
                          currentPage ===
                          Math.ceil(filteredGenres.length / itemsPerPage)
                            ? "tw-bg-indigo-600 tw-text-white"
                            : "tw-text-gray-900 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50"
                        }`}
                      >
                        {Math.ceil(filteredGenres.length / itemsPerPage)}
                      </button>
                    </>
                  )}

                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredGenres.length / itemsPerPage)
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
    </div>
  );
};

export default Genres;
