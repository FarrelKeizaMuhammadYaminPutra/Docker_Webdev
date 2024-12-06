import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import { useAuthStore } from '../store/authStore';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SignUpPage from '../pages/authentication/SignUpPage'; // Adjust the path if needed

// Mocking the necessary store and components
jest.mock('../store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('../components/authentication/Input', () => ({
  __esModule: true,
  default: ({ value, onChange, placeholder, icon }) => (
    <input value={value} onChange={onChange} placeholder={placeholder} />
  ),
}));

describe('SignUpPage', () => {
  let signupMock;

  beforeEach(() => {
    signupMock = jest.fn();
    useAuthStore.mockReturnValue({
      signup: signupMock,
      error: null,
      isLoading: false,
    });
  });

  test('should render SignUpPage correctly', () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    // Check if the form and elements are rendered
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });

  test('should handle input change for name, email, and password', () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    // Get input elements
    const nameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');

    // Simulate user typing into the fields
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Assert the input values
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john.doe@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('should call signup function when form is submitted', async () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    // Get input elements
    const nameInput = screen.getByPlaceholderText('Full Name');
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Sign Up');

    // Fill in the form fields
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for the signup function to be called
    await waitFor(() => expect(signupMock).toHaveBeenCalledTimes(1));
    expect(signupMock).toHaveBeenCalledWith('john.doe@example.com', 'password123', 'John Doe');
  });

  test('should display loading spinner when signup is in progress', () => {
    // Simulate loading state
    useAuthStore.mockReturnValue({
      signup: signupMock,
      error: null,
      isLoading: true,
    });

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    // Ensure the loading spinner is displayed
    expect(screen.getByRole('status')).toBeInTheDocument(); // Check if the loader is visible
  });

  test('should display error message if signup fails', async () => {
    const errorMessage = 'Email already exists';
    useAuthStore.mockReturnValue({
      signup: signupMock,
      error: errorMessage,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText(errorMessage)).toBeInTheDocument());
  });

  test('should navigate to verify-email page after successful signup', async () => {
    // Mock a successful signup
    signupMock.mockResolvedValueOnce(); // Mock the resolved signup function

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          <Route path="/verify-email" element={<div>Verify Email Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Fill in the form and submit
    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign Up'));

    // Wait for the Verify Email Page to render
    await waitFor(() => expect(screen.getByText('Verify Email Page')).toBeInTheDocument());
  });
});

