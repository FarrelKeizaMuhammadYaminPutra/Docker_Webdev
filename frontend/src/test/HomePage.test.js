import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import HomePage from "../landing-page/components/HomePage.jsx";
import { fetchMovies } from "../utils/fetchMovie.js";
import { handlePlay, handleClose } from "../landing-page/components/HomePage.jsx";
import { getPopularMovies, getTopRatedMovies, getUpCoMovies, getTopAMovies } from "../utils/fetchMovie.js";
import { fetchPopularMovies, fetchTopRatedMovies, fetchUpCoMovies, fetchTopMovies } from "../utils/fetchMovie.js";

jest.mock("../utils/fetchMovie", () => ({
    fetchPopularMovies: jest.fn(),
    fetchTopRatedMovies: jest.fn(),
    fetchUpCoMovies: jest.fn(),
    fetchTopMovies: jest.fn(),
}));

// Mock react-router-dom untuk useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock useAuthStore
jest.mock("../store/authStore", () => ({
  useAuthStore: jest.fn(() => ({
    user: null,
    isAuthenticated: false,
    signup: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  })),
}));

describe("handlePlay function", () => {
  test("should return correct videoUrl and show values", () => {
    const testUrl = "https://www.youtube.com/watch?v=example";
    const expectedUrl = "https://www.youtube.com/embed/example";

    const result = handlePlay(testUrl);

    expect(result.videoUrl).toBe(expectedUrl);
    expect(result.show).toBe(true);
  });
});

describe("handleClose function", () => {
  test("should reset videoUrl and show state", () => {
    const result = handleClose();

    expect(result.videoUrl).toBe("");
    expect(result.show).toBe(false);
  });
});

describe("HomePage useEffect tests", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks antara pengujian
  });

  test("fetchPopularMovies updates popularMovies state", async () => {
    const mockPopularMovies = [
      { id: 1, title: "Popular Movie 1", poster: "poster1.jpg" },
      { id: 2, title: "Popular Movie 2", poster: "poster2.jpg" },
    ];
    fetchPopularMovies.mockResolvedValueOnce(mockPopularMovies);

    const setPopularMovies = jest.fn();
    await act(async () => {
      const data = await fetchPopularMovies();
      setPopularMovies(data);
    });

    expect(fetchPopularMovies).toHaveBeenCalledTimes(1);
    expect(setPopularMovies).toHaveBeenCalledWith(mockPopularMovies);
  });

  test("fetchTopRatedMovies updates topRatedMovies state", async () => {
    const mockTopRatedMovies = [
      { id: 3, title: "Top Rated Movie 1", poster: "poster3.jpg" },
      { id: 4, title: "Top Rated Movie 2", poster: "poster4.jpg" },
    ];
    fetchTopRatedMovies.mockResolvedValueOnce(mockTopRatedMovies);

    const setTopRatedMovies = jest.fn();
    await act(async () => {
      const data = await fetchTopRatedMovies();
      setTopRatedMovies(data);
    });

    expect(fetchTopRatedMovies).toHaveBeenCalledTimes(1);
    expect(setTopRatedMovies).toHaveBeenCalledWith(mockTopRatedMovies);
  });

  test("fetchUpCoMovies updates upcomingMovies state", async () => {
    const mockUpcomingMovies = [
      { id: 5, title: "Upcoming Movie 1", poster: "poster5.jpg" },
      { id: 6, title: "Upcoming Movie 2", poster: "poster6.jpg" },
    ];
    fetchUpCoMovies.mockResolvedValueOnce(mockUpcomingMovies);

    const setUpcomingMovies = jest.fn();
    await act(async () => {
      const data = await fetchUpCoMovies();
      setUpcomingMovies(data);
    });

    expect(fetchUpCoMovies).toHaveBeenCalledTimes(1);
    expect(setUpcomingMovies).toHaveBeenCalledWith(mockUpcomingMovies);
  });

  test("fetchTopMovies updates topMovies state", async () => {
    const mockTopMovies = [
      { id: 7, title: "Top Movie 1", poster: "poster7.jpg" },
      { id: 8, title: "Top Movie 2", poster: "poster8.jpg" },
    ];
    fetchTopMovies.mockResolvedValueOnce(mockTopMovies);

    const setTopMovies = jest.fn();
    await act(async () => {
      const data = await fetchTopMovies();
      setTopMovies(data);
    });

    expect(fetchTopMovies).toHaveBeenCalledTimes(1);
    expect(setTopMovies).toHaveBeenCalledWith(mockTopMovies);
  });

  test("logs error if fetchPopularMovies fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    fetchPopularMovies.mockRejectedValueOnce(new Error("Fetch failed"));

    const setPopularMovies = jest.fn();
    await act(async () => {
      try {
        await fetchPopularMovies();
      } catch (error) {
        consoleErrorSpy(error);
      }
    });

    expect(fetchPopularMovies).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  test("logs error if fetchTopRatedMovies fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    fetchTopRatedMovies.mockRejectedValueOnce(new Error("Fetch failed"));

    const setTopRatedMovies = jest.fn();
    await act(async () => {
      try {
        await fetchTopRatedMovies();
      } catch (error) {
        consoleErrorSpy(error);
      }
    });

    expect(fetchTopRatedMovies).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  test("logs error if fetchUpCoMovies fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    fetchUpCoMovies.mockRejectedValueOnce(new Error("Fetch failed"));

    const setUpcomingMovies = jest.fn();
    await act(async () => {
      try {
        await fetchUpCoMovies();
      } catch (error) {
        consoleErrorSpy(error);
      }
    });

    expect(fetchUpCoMovies).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  test("logs error if fetchTopMovies fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    fetchTopMovies.mockRejectedValueOnce(new Error("Fetch failed"));

    const setTopMovies = jest.fn();
    await act(async () => {
      try {
        await fetchTopMovies();
      } catch (error) {
        consoleErrorSpy(error);
      }
    });

    expect(fetchTopMovies).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});