import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { jest } from "@jest/globals";
import InputDrama from "../pages/cms/InputDrama"; // Path to your InputDrama component
import { useAuthStore } from "../store/authStore";
import axios from "axios";

// Mocking axios and the necessary store
jest.mock("axios");
jest.mock("../store/authStore", () => ({
  useAuthStore: jest.fn(),
}));

describe("InputDrama", () => {
  let submitMovieMock;

  beforeEach(() => {
    global.alert = jest.fn(); // Mock alert
    submitMovieMock = jest.fn();
    useAuthStore.mockReturnValue({
      submitMovie: submitMovieMock, // Mock the submitMovie function
      error: null,
      isLoading: false,
    });
    
    axios.post.mockResolvedValue({ data: { message: "Movie created successfully!" } })
    // Mocking API responses for countries, genres, and actors
    axios.get.mockResolvedValueOnce({
      data: { countries: [{ id: 1, name: "USA" }] },
    });
    axios.get.mockResolvedValueOnce({
      data: { genres: [{ id: 1, name: "Action" }] },
    });
    axios.get.mockResolvedValueOnce({
      data: { actors: [{ id: 48802, name: "Alban Lenoir", profile_path: "" }] },
    });
  });

  test("should render InputDrama correctly", async () => {
    await act(async () => {
      render(<InputDrama />);
    });

    expect(screen.getByText("Page Input Drama")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter synopsis")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter year")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter trailer link")).toBeInTheDocument();
  });

  test("should handle input changes for title, synopsis, and year", async () => {
    await act(async () => {
      render(<InputDrama />);
    });

    const titleInput = screen.getByPlaceholderText("Enter title");
    const synopsisInput = screen.getByPlaceholderText("Enter synopsis");
    const yearInput = screen.getByPlaceholderText("Enter year");

    fireEvent.change(titleInput, { target: { value: "Test Movie" } });
    fireEvent.change(synopsisInput, { target: { value: "Test Synopsis" } });
    fireEvent.change(yearInput, { target: { value: "2024" } });

    expect(titleInput.value).toBe("Test Movie");
    expect(synopsisInput.value).toBe("Test Synopsis");
    expect(yearInput.value).toBe("2024");
  });

  test("should handle genre selection", async () => {
    await act(async () => {
      render(<InputDrama />);
    });

    // Test that the genres are fetched
    expect(screen.getByText("Action")).toBeInTheDocument();

    const genreCheckbox = screen.getByLabelText("Action");
    fireEvent.click(genreCheckbox);

    expect(genreCheckbox.checked).toBe(true);
  });

  test("should handle dynamic actor selection", async () => {
    await act(async () => {
      render(<InputDrama />);
    });
  
    // Ensure the actor select input is available and focus it to open the dropdown
    const actorSelectInput = screen.getByLabelText(/select actors/i);
  
    // Open the dropdown by focusing and clicking the select input
    fireEvent.focus(actorSelectInput);
    fireEvent.mouseDown(actorSelectInput);
  
    // Wait for the dropdown options to appear and select "Alban Lenoir"
    await waitFor(() => screen.getByText("Alban Lenoir"));
  
    const actorOption = screen.getByText("Alban Lenoir");
    fireEvent.click(actorOption);
  
    // Wait for the actor selection to be reflected in the selected actors list
    const selectedActors = screen.queryAllByText("Alban Lenoir");
  
    // Make sure there are multiple "Alban Lenoir" elements, and we are targeting the correct one
    expect(selectedActors.length).toBeGreaterThan(0);
  
    // Find the correct actor in the selected list
    const selectedActor = selectedActors.find(actor =>
      actor.closest('div.tw-relative') // Make sure it is in the selected list
    );
  
    expect(selectedActor).toBeInTheDocument(); // Ensure the actor name is in the selected actors list
  
    // Verify the actor's photo is displayed alongside the name (if applicable)
    const actorImage = screen.getByAltText("Alban Lenoir");
    expect(actorImage).toBeInTheDocument();

  });
  
  test('should handle image upload', async() => {
    await act(async () => {
      render(<InputDrama />);
    });

    const imageInput = screen.getByLabelText('Drop files to Attach');
    const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(imageInput, { target: { files: [file] } });

    expect(imageInput.files[0].name).toBe('test.jpg');
  });


});



