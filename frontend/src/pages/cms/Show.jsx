import React, { useState, useEffect } from "react";
import axios from "axios";

const Show = () => {
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDrama, setSelectedDrama] = useState(null);
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedShowCount, setSelectedShowCount] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/movies");
        setMovies(response.data.movies);

        const uniqueCountries = [
          ...new Set(
            response.data.movies.flatMap((movie) =>
              movie.countries.map((country) => country.name)
            )
          ),
        ].sort((a, b) => a.localeCompare(b)); // Sort countries alphabetically
        setCountries(uniqueCountries);

        const uniqueYears = [
          ...new Set(response.data.movies.map((movie) => movie.year)),
        ].sort((a, b) => b - a); // Sort years in descending order
        setYears(uniqueYears);

        const uniqueGenres = [
          ...new Set(
            response.data.movies.flatMap((movie) =>
              movie.genres.map((genre) => genre.name)
            )
          ),
        ].sort((a, b) => a.localeCompare(b)); // Sort genres alphabetically
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const extractYouTubeVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleDelete = async (movieId) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/movies/${movieId}`);
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      );
      alert("Movie deleted successfully!");
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Failed to delete movie.");
    }
  };

  const handleViewClick = (drama) => {
    setSelectedDrama(drama);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDrama(null);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredMovies.length / selectedShowCount)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesCountry = selectedCountry
      ? movie.countries.some((country) => country.name === selectedCountry)
      : true;
    const matchesYear = selectedYear
      ? movie.year === parseInt(selectedYear)
      : true;
    const matchesGenre = selectedGenre
      ? movie.genres.some((genre) => genre.name === selectedGenre)
      : true;
    const matchesSearchQuery = searchQuery
      ? movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCountry && matchesYear && matchesGenre && matchesSearchQuery;
  });

  const totalMovies = filteredMovies.length;
  const totalPages = Math.ceil(totalMovies / selectedShowCount);
  const startIndex = (currentPage - 1) * selectedShowCount;
  const endIndex = startIndex + selectedShowCount;
  const moviesToShow = filteredMovies.slice(startIndex, endIndex);

  return (
    <div className="tw-flex tw-bg-gray-100 tw-w-full tw-px-4">
      <div className="tw-mt-4 tw-bg-white tw-rounded-lg tw-shadow-lg tw-w-full lg:tw-max-w-6xl tw-overflow-hidden">
        <div className="tw-p-4">
          <h2 className="tw-text-2xl tw-font-bold tw-text-gray-800">
            Page Show Drama
          </h2>
        </div>

        {/* Filter and search section */}
        <div className="tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-center tw-px-4 tw-py-2 tw-border-t tw-border-b tw-border-gray-200">
          <div className="tw-flex tw-space-x-4">
            <div>
              <label className="tw-mr-2">Country:</label>
              <select
                className="tw-border tw-border-gray-300 tw-rounded tw-px-2 tw-py-1"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="tw-mr-2">Genre:</label>
              <select
                className="tw-border tw-border-gray-300 tw-rounded tw-px-2 tw-py-1"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="tw-mr-2">Year:</label>
              <select
                className="tw-border tw-border-gray-300 tw-rounded tw-px-2 tw-py-1"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">All</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="tw-mr-2">Show:</label>
              <select
                className="tw-border tw-border-gray-300 tw-rounded tw-px-2 tw-py-1"
                value={selectedShowCount}
                onChange={(e) => {
                  setSelectedShowCount(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search drama..."
              className="tw-border tw-border-gray-400 focus:tw-outline-0 focus:tw-ring-1 focus:tw-ring-gray-300 tw-rounded-full tw-px-4 tw-py-1 tw-w-full sm:tw-w-auto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Movies Table */}
        <div className="tw-overflow-x-auto tw-max-h-[60vh] tw-overflow-y-auto tw-px-4 tw-py-2">
          <table className="tw-min-w-full tw-bg-white tw-border tw-border-gray-300 tw-text-sm sm:tw-text-base">
            <thead>
              <tr className="tw-bg-gray-100">
                <th className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300 tw-text-left">
                  #
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
                  Actors
                </th>
                <th className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300 tw-text-left">
                  Genres
                </th>
                <th className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300 tw-text-left">
                  Synopsis
                </th>
                <th className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300 tw-text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {moviesToShow.map((movie, index) => (
                <tr
                  key={movie.id}
                  className={index % 2 === 0 ? "tw-bg-white" : "tw-bg-gray-50"}
                >
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    {startIndex + index + 1}
                  </td>
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    {movie.year}
                  </td>
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    {movie.title}
                  </td>
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    {movie.countries.map((country) => country.name).join(", ")}
                  </td>
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    {movie.actors.map((actor) => actor.name).join(", ")}
                  </td>
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    {movie.genres.map((genre) => genre.name).join(", ")}
                  </td>
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    {movie.synopsis}
                  </td>
                  <td className="tw-px-4 tw-py-2 tw-border-b tw-border-gray-300">
                    <a
                      href="#"
                      className="tw-text-blue-600 hover:tw-underline"
                      onClick={() => handleViewClick(movie)}
                    >
                      View
                    </a>
                    <span className="tw-text-gray-500 tw-px-2">|</span>
                    <a
                      href="#"
                      className="tw-text-red-600 hover:tw-underline"
                      onClick={() => handleDelete(movie.id)}
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
              Showing {startIndex + 1} to {Math.min(endIndex, totalMovies)} of{" "}
              {totalMovies} results
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

      {/* Modal */}
      {isModalOpen && selectedDrama && (
        <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-4">
          <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-lg tw-max-w-full tw-w-full md:tw-max-w-4xl lg:tw-max-w-5xl tw-relative tw-overflow-y-auto tw-max-h-screen">
            <button
              className="tw-absolute tw-top-2 tw-right-2 tw-bg-red-600 tw-text-white tw-px-3 tw-py-1 tw-rounded-lg tw-text-lg hover:tw-bg-red-700 focus:tw-outline-none"
              onClick={handleCloseModal}
            >
              X
            </button>

            <div className="tw-flex tw-flex-col md:tw-flex-row tw-space-y-4 md:tw-space-y-0 md:tw-space-x-4">
              <div className="tw-w-full md:tw-w-1/3 tw-mb-4 md:tw-mb-0">
                {selectedDrama.poster && (
                  <img
                    src={
                      selectedDrama.poster.startsWith("uploads")
                        ? `http://localhost:5000/${selectedDrama.poster}`
                        : selectedDrama.poster
                    }
                    alt={selectedDrama.title}
                    className="tw-w-full tw-h-64 tw-object-cover tw-rounded-lg"
                  />
                )}
              </div>

              <div className="tw-flex-grow">
                <h2 className="tw-text-2xl tw-font-bold">
                  {selectedDrama.title}
                </h2>
                <p className="tw-text-gray-500">Year: {selectedDrama.year}</p>
                <p className="tw-mt-4">{selectedDrama.synopsis}</p>
                <p className="tw-mt-4">
                  Genres:{" "}
                  {selectedDrama.genres.map((genre) => genre.name).join(", ")}
                </p>
                <p className="tw-mt-4">
                  Countries:{" "}
                  {selectedDrama.countries
                    .map((country) => country.name)
                    .join(", ")}
                </p>
                <p className="tw-mt-4">
                  Actors:{" "}
                  {selectedDrama.actors.map((actor) => actor.name).join(", ")}
                </p>
                <p className="tw-mt-4">Rating: {selectedDrama.rating}</p>
              </div>
            </div>

            {selectedDrama.trailer && (
              <div className="tw-mt-4 tw-flex tw-justify-center">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeVideoId(
                    selectedDrama.trailer ? selectedDrama.trailer : ""
                  )}?autoplay=1&mute=0&controls=1`}
                  title="YouTube video player"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="tw-w-full tw-h-48 tw-rounded-lg"
                  style={{
                    border: "none",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Show;
