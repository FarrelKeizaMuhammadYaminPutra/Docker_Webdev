import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Actors from "../pages/cms/Actors";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { response } from "express";
const fetch = require('node-fetch');

// Create a mock instance of axios
const mockAxios = new MockAdapter(axios);

describe("Actors Component", () => {
  beforeEach(() => {
    // Reset mock before each test
    mockAxios.reset();
    // Mock alert to prevent it from interrupting the tests
    global.alert = jest.fn();
  });

  it("should render the actor form", () => {
    render(<Actors />);

    // Check if the form elements are rendered
    expect(screen.getByPlaceholderText("Enter actor name")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByLabelText("Choose File")).toBeInTheDocument();
  });

  
  it("should show actors after fetching from the API", async () => {
      const actors = [
      { id: 1, name: "John Doe", profile_path: "path/to/photo.jpg" },
      { id: 2, name: "Jane Smith", profile_path: "path/to/photo.jpg" },
    ];

    // Mock API response for fetching actors
    mockAxios.onGet("http://localhost:5000/api/actors").reply(200, { actors });

    render(<Actors />);

    // Wait for actors to be rendered
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("should handle deleting an actor", async () => {
    const actors = [
      { id: 1, name: "John Doe", profile_path: "path/to/photo.jpg" },
    ];

    // Mock API response for fetching actors
    mockAxios.onGet("http://localhost:5000/api/actors").reply(200, { actors });

    // Mock API response for deleting an actor
    mockAxios.onDelete("http://localhost:5000/api/actors/1").reply(200);

    render(<Actors />);

    // Wait for actors to be rendered
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Simulate delete action
    fireEvent.click(screen.getByText("Delete"));

    // Wait for async actions
    await waitFor(() => {
      expect(mockAxios.history.delete.length).toBe(1); // Ensure DELETE request is called
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument(); // Ensure actor is removed
    });
  });

  it("should filter actors based on search query", async () => {
    const actors = [
      { id: 1, name: "John Doe", profile_path: "path/to/photo.jpg" },
      { id: 2, name: "Jane Smith", profile_path: "path/to/photo.jpg" },
    ];

    // Mock API response for fetching actors
    await mockAxios.onGet("http://localhost:5000/api/actors").reply(200, { actors });

    render(<Actors />);

    // Wait for actors to be rendered
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    // Simulate typing in the search box
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "John" },
    });

    // Check if only "John Doe" is displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });
});

  