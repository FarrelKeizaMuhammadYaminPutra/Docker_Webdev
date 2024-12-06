import React, { useState, useEffect } from "react";
import axios from "axios";

const Countries = () => {
  const [countryName, setCountryName] = useState("");
  const [editCountryId, setEditCountryId] = useState(null);
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const fetchCountries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/countries", {
        params: { limit: 1000 },
      });
      setAllCountries(response.data.countries || []);
      setFilteredCountries(response.data.countries || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    const results = searchTerm
      ? allCountries.filter((country) =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allCountries;

    setFilteredCountries(results);
    setCurrentPage(1);
  }, [searchTerm, allCountries]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/countries", {
        name: countryName,
      });
      alert("Country added successfully!");
      setCountryName("");
      fetchCountries();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Display the specific error message from the backend
        alert(error.response.data.message);
      } else {
        console.error("Error adding country:", error);
        alert("Failed to add country.");
      }
    }
  };

  const handleEdit = (country) => {
    setEditCountryId(country.id);
    setCountryName(country.name);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/countries/${editCountryId}`, {
        name: countryName,
      });
      setAllCountries(
        allCountries
          .map((country) =>
            country.id === editCountryId
              ? { ...country, name: countryName }
              : country
          )
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setCountryName("");
      setEditCountryId(null);
      alert("Country updated successfully!");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Display the specific error message from the backend
        alert(error.response.data.message);
      } else {
        console.error("Error updating country:", error);
        alert("Failed to update country.");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this country?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/countries/${id}`);
      setAllCountries(allCountries.filter((country) => country.id !== id));
      alert("Country deleted successfully!");
    } catch (error) {
      console.error("Error deleting country:", error);
      alert("Failed to delete country.");
    }
  };

  const indexOfLastCountry = currentPage * itemsPerPage;
  const indexOfFirstCountry = indexOfLastCountry - itemsPerPage;
  const currentCountries = filteredCountries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredCountries.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="tw-px-4 tw-flex tw-flex-col tw-justify-start tw-items-center tw-bg-gray-100 tw-min-h-screen tw-w-full">
      <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-overflow-hidden tw-w-full tw-mx-4 sm:tw-mx-6 lg:tw-mx-auto tw-my-4">
        <div className="tw-p-4">
          <h2 className="tw-text-2xl tw-font-bold tw-text-gray-800">
            Page Countries
          </h2>
          <h1 className="tw-text-gray-500 tw-font-semibold tw-text-lg tw-mt-4">
            {editCountryId ? "Edit Country" : "Insert Country"}
          </h1>
          <form onSubmit={editCountryId ? handleUpdate : handleSubmit}>
            <div className="tw-flex tw-space-x-4 tw-items-center">
              <input
                type="text"
                placeholder="Enter country name"
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                className="tw-bg-indigo-100/30 tw-border tw-px-4 tw-py-2 tw-rounded-lg focus:tw-outline-0 focus:tw-ring-2 focus:tw-ring-gray-300"
              />
              <button
                type="submit"
                className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-xl tw-bg-green-600 tw-py-2 tw-px-6 tw-font-dm tw-text-base tw-font-medium tw-text-white tw-shadow-xl tw-shadow-green-100/75 tw-transition-transform tw-duration-200 tw-ease-in-out hover:tw-scale-[1.02]"
              >
                {editCountryId ? "Update" : "Submit"}
              </button>
            </div>
          </form>

          {/* Search Input */}
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
                      Countries
                    </th>
                    <th className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300 tw-text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentCountries.length > 0 ? (
                    currentCountries.map((country, index) => (
                      <tr
                        key={country.id}
                        className={
                          index % 2 === 0 ? "tw-bg-white" : "tw-bg-gray-50"
                        } data-testid={`country-row-${index + 1}`}
                      >
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          {indexOfFirstCountry + index + 1}
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          {country.name}
                        </td>
                        <td className="tw-py-2 tw-px-4 tw-border-b tw-border-gray-300">
                          <a
                            onClick={() => handleEdit(country)}
                            className="tw-text-blue-600 hover:tw-underline tw-cursor-pointer"
                          >
                            Rename
                          </a>
                          <span className="tw-text-gray-500 tw-px-2">|</span>
                          <a
                            onClick={() => handleDelete(country.id)}
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
                        No countries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="tw-px-6 tw-py-3 tw-border-t tw-border-gray-200 tw-bg-white tw-flex tw-items-center tw-justify-between">
              <div className="tw-flex tw-flex-1 tw-justify-between sm:tw-hidden">
                <button
                  data-testid="pagination-prev-mobile"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="tw-relative tw-inline-flex tw-items-center tw-rounded-md tw-border tw-border-gray-300 tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 hover:tw-bg-gray-50"
                >
                  Previous
                </button>
                <button
                  data-testid="pagination-next-mobile"
                  onClick={handleNextPage}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredCountries.length / itemsPerPage)
                  }
                  className="tw-relative tw-ml-3 tw-inline-flex tw-items-center tw-rounded-md tw-border tw-border-gray-300 tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 hover:tw-bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="tw-hidden sm:tw-flex sm:tw-flex-1 sm:tw-items-center sm:tw-justify-between">
                <p className="tw-text-sm tw-text-gray-700">
                  Showing {indexOfFirstCountry + 1} to{" "}
                  {Math.min(indexOfLastCountry, filteredCountries.length)} of{" "}
                  {filteredCountries.length} results
                </p>
                <nav
                  className="tw-isolate tw-inline-flex -tw-space-x-px tw-rounded-md tw-shadow-sm"
                  aria-label="Pagination"
                >
                  {/* Previous Button */}
                  <button
                    data-testid="pagination-prev"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="tw-relative tw-inline-flex tw-items-center tw-rounded-l-md tw-px-2 tw-py-2 tw-text-gray-400 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50"
                  >
                    Previous
                  </button>

                  {/* Single page or dynamic pagination */}
                  {Math.ceil(filteredCountries.length / itemsPerPage) === 1 ? (
                    // If only one page, show page 1 only
                    <button
                      data-testid="pagination-page-1"
                      onClick={() => setCurrentPage(1)}
                      className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-bg-indigo-600 tw-text-white"
                    >
                      1
                    </button>
                  ) : (
                    <>
                      {/* Always show the first page */}
                      <button
                        data-testid="pagination-page-1"
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
                        <span
                          data-testid="pagination-ellipsis-start"
                          className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-gray-700"
                        >
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
                            Math.ceil(
                              filteredCountries.length / itemsPerPage
                            ) &&
                          page > 1 && (
                            <button
                              key={page}
                              data-testid={`pagination-page-${page}`}
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
                        Math.ceil(filteredCountries.length / itemsPerPage) -
                          10 && (
                        <span
                          data-testid="pagination-ellipsis-end"
                          className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-gray-700"
                        >
                          ...
                        </span>
                      )}

                      {/* Last page button if more than one page */}
                      <button
                        data-testid={`pagination-page-${Math.ceil(
                          filteredCountries.length / itemsPerPage
                        )}`}
                        onClick={() =>
                          setCurrentPage(
                            Math.ceil(filteredCountries.length / itemsPerPage)
                          )
                        }
                        className={`tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold ${
                          currentPage ===
                          Math.ceil(filteredCountries.length / itemsPerPage)
                            ? "tw-bg-indigo-600 tw-text-white"
                            : "tw-text-gray-900 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50"
                        }`}
                      >
                        {Math.ceil(filteredCountries.length / itemsPerPage)}
                      </button>
                    </>
                  )}

                  {/* Next Button */}
                  <button
                    data-testid="pagination-next"
                    onClick={handleNextPage}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredCountries.length / itemsPerPage)
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

export default Countries;
