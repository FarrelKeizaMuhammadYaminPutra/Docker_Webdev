import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Countries from "../pages/cms/Countries";

// Mock axios dengan Jest
jest.mock("axios");

describe("Countries Component", () => {
  const mockCountries = [
    { id: 1, name: "USA" },
    { id: 2, name: "Canada" },
    { id: 3, name: "Germany" },
  ];

  beforeEach(() => {
    // Mock axios dengan Jest
    axios.get.mockResolvedValue({ data: { countries: mockCountries } });
    axios.post.mockResolvedValue({});
    axios.put.mockResolvedValue({});
    axios.delete.mockResolvedValue({});
  });

  afterEach(() => {
    // Bersihkan mock setelah setiap pengujian
    jest.clearAllMocks();
  });

  it("renders the component and fetches countries", async () => {
    render(<Countries />);
    expect(screen.getByText("Page Countries")).toBeInTheDocument();

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByText("USA")).toBeInTheDocument();
      expect(screen.getByText("Canada")).toBeInTheDocument();
      expect(screen.getByText("Germany")).toBeInTheDocument();
    });
  });

  it("allows adding a new country", async () => {
    render(<Countries />);

    // Simulate adding a country
    fireEvent.change(screen.getByPlaceholderText("Enter country name"), {
      target: { value: "France" },
    });
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/countries",
        { name: "France" }
      );
    });
  });

  it("allows editing an existing country", async () => {
    render(<Countries />);

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByText("USA")).toBeInTheDocument();
    });

    // Simulate editing a country
    fireEvent.click(screen.getAllByText("Rename")[0]);
    fireEvent.change(screen.getByPlaceholderText("Enter country name"), {
      target: { value: "United States" },
    });
    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:5000/api/countries/1",
        { name: "United States" }
      );
    });
  });

  it("allows deleting a country", async () => {
    global.confirm = jest.fn(() => true); // Mock confirmation dialog
    render(<Countries />);

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByText("USA")).toBeInTheDocument();
    });

    // Simulate deleting a country
    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:5000/api/countries/1"
      );
    });
  });

  it("filters countries based on search input", async () => {
    render(<Countries />);

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.getByText("USA")).toBeInTheDocument();
    });

    // Simulate search
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "Canada" },
    });

    await waitFor(() => {
      expect(screen.getByText("Canada")).toBeInTheDocument();
      expect(screen.queryByText("USA")).not.toBeInTheDocument();
    });
  });

  
  
  
});
