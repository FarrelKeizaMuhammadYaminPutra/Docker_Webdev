import React, { useState, useEffect } from "react";
import axios from "axios";

const Reviews = () => {
  const [allReviews, setAllReviews] = useState([]); // Store all reviews
  const [filteredReviews, setFilteredReviews] = useState([]); // Store filtered reviews
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [show, setShow] = useState(25);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);

  // Fetch all reviews once when the component mounts
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reviews");
        setAllReviews(response.data);

        const uniqueCountries = [
          ...new Set(
            response.data.flatMap((review) =>
              review.movie?.countries.map((c) => c.name)
            )
          ),
        ].sort((a, b) => a.localeCompare(b));
        setCountries(uniqueCountries);

        const uniqueYears = [
          ...new Set(response.data.map((review) => review.movie?.year)),
        ].sort((a, b) => b - a);
        setYears(uniqueYears);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchAllReviews();
  }, []);

  // Apply filters and search when any of them change
  useEffect(() => {
    const applyFilters = () => {
      let filtered = allReviews;

      if (country) {
        filtered = filtered.filter((review) =>
          review.movie?.countries.some((c) => c.name === country)
        );
      }

      if (year) {
        filtered = filtered.filter(
          (review) => review.movie?.year === parseInt(year)
        );
      }

      if (rating) {
        filtered = filtered.filter(
          (review) => Math.round(review.rating) === parseInt(rating)
        );
      }

      if (search) {
        filtered = filtered.filter((review) =>
          review.movie?.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      setFilteredReviews(filtered);
    };

    applyFilters();
  }, [allReviews, country, year, rating, search]);

  // Pagination calculations
  const totalReviews = filteredReviews.length;
  const totalPages = Math.ceil(totalReviews / show);
  const startIndex = (currentPage - 1) * show;
  const endIndex = startIndex + show;
  const reviewsToShow = filteredReviews.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      // Send delete request to the server
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`);

      // Update the state to remove the deleted review
      setAllReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );

      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review.");
    }
  };


  return (
    <div className="tw-flex tw-bg-gray-100 tw-w-full tw-px-4">
      <div className="tw-mt-4 tw-bg-white tw-rounded-lg tw-shadow-lg tw-w-full lg:tw-max-w-6xl tw-overflow-hidden">
        <div className="tw-p-4">
          <h2 className="tw-text-2xl tw-font-bold tw-text-gray-800">
            Page Reviews
          </h2>
        </div>

        {/* Filter and search section */}
        <div className="tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-center tw-px-4 tw-py-2 tw-border-t tw-border-b tw-border-gray-200">
          <div className="tw-flex tw-space-x-4">
            {/* Country Filter */}
            <div>
              <label className="tw-mr-2">Country:</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="tw-border tw-border-gray-300 tw-rounded tw-px-2 tw-py-1"
              >
                <option value="">All Countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="tw-mr-2">Year:</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="tw-border tw-border-gray-300 tw-rounded tw-px-2 tw-py-1"
              >
                <option value="">All</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="tw-mr-2">Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="tw-border tw-border-gray-300 tw-rounded tw-px-2 tw-py-1"
              >
                <option value="">All</option>
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Show Filter */}
            <div>
              <label className="tw-mr-2">Show:</label>
              <select
                value={show}
                onChange={(e) => {
                  setShow(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="tw-border tw-border-gray-300 tw-rounded tw-px-2 tw-py-1"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div>
            <input
              type="text"
              placeholder="Search drama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="tw-border tw-border-gray-400 focus:tw-outline-0 focus:tw-ring-1 focus:tw-ring-gray-300 tw-rounded-full tw-px-4 tw-py-1 tw-w-full sm:tw-w-auto"
            />
          </div>
        </div>

        {/* Reviews Table */}
        <div className="tw-overflow-x-auto tw-max-h-[60vh] tw-overflow-y-auto tw-px-4 tw-py-2">
          <table className="tw-min-w-full tw-bg-white tw-border tw-border-gray-300 tw-text-sm sm:tw-text-base">
            <thead>
              <tr className="tw-bg-gray-100">
                <th className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300 tw-text-left">
                  Name
                </th>
                <th className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300 tw-text-left">
                  Rate
                </th>
                <th className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300 tw-text-left">
                  Year
                </th>
                <th className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300 tw-text-left">
                  Drama
                </th>
                <th className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300 tw-text-left">
                  Countries
                </th>
                <th className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300 tw-text-left">
                  Reviews
                </th>
                <th className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300 tw-text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {reviewsToShow.map((review, index) => (
                <tr
                  key={review.id}
                  className={index % 2 === 0 ? "tw-bg-white" : "tw-bg-gray-50"}
                >
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    {review.author}
                  </td>
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    <span className="tw-text-red-600">
                      {"★".repeat(Math.round(review.rating))}
                    </span>
                  </td>
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    {review.movie?.year}
                  </td>
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    {review.movie?.title}
                  </td>
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    {review.movie?.countries
                      .map((country) => country.name)
                      .join(", ")}
                  </td>
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    {review.content}
                  </td>
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    <a
                      href="#"
                      className="tw-text-red-600 hover:tw-underline"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="tw-px-4 tw-py-2 tw-border-t tw-border-gray-200 tw-bg-white tw-flex tw-items-center tw-justify-between">
          <div className="tw-flex tw-flex-1 tw-justify-between sm:tw-hidden">
            <button
              onClick={handlePreviousPage}
              className="tw-relative tw-inline-flex tw-items-center tw-rounded-md tw-border tw-border-gray-300 tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 hover:tw-bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="tw-relative tw-ml-3 tw-inline-flex tw-items-center tw-rounded-md tw-border tw-border-gray-300 tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 hover:tw-bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="tw-hidden sm:tw-flex sm:tw-flex-1 sm:tw-items-center sm:tw-justify-between">
            <p className="tw-text-sm tw-text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, totalReviews)} of{" "}
              {totalReviews} results
            </p>
            <nav
              className="tw-isolate tw-inline-flex -tw-space-x-px tw-rounded-md tw-shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={handlePreviousPage}
                className="tw-relative tw-inline-flex tw-items-center tw-rounded-l-md tw-px-2 tw-py-2 tw-text-gray-400 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50 focus:tw-z-20"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  onClick={() => setCurrentPage(pageIndex + 1)}
                  className={`tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold ${
                    pageIndex + 1 === currentPage
                      ? "tw-bg-indigo-600 tw-text-white"
                      : "tw-text-gray-900 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50"
                  }`}
                >
                  {pageIndex + 1}
                </button>
              ))}
              <button
                onClick={handleNextPage}
                className="tw-relative tw-inline-flex tw-items-center tw-rounded-r-md tw-px-2 tw-py-2 tw-text-gray-400 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50 focus:tw-z-20"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
