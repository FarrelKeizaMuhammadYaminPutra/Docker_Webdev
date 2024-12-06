import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import LoginPage from '../pages/authentication/LoginPage';  // Adjust the path of LoginPage
import { useAuthStore } from '../store/authStore';  // Adjust the path of your auth store
import { MemoryRouter, Routes, Route } from 'react-router-dom';  // Use MemoryRouter for routing simulation
import React from 'react';

// Mocking the store and components
jest.mock('../store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('../components/authentication/Input', () => ({
  __esModule: true,
  default: ({ value, onChange, placeholder }) => (
    <input value={value} onChange={onChange} placeholder={placeholder} />
  ),
}));

describe('LoginPage', () => {
  let loginMock;

  beforeEach(() => {
    loginMock = jest.fn();
    useAuthStore.mockReturnValue({
      login: loginMock,
      isLoading: false,
      error: null,
    });
  });

  test('should render LoginPage correctly', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Check if the page title and form fields are rendered
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText('Don\'t have an account?')).toBeInTheDocument();
  });

  test('should handle input change for email and password', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Get email and password input elements
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');

    // Simulate user typing in the email and password fields
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Assert that the input values have been updated
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('should call login function when form is submitted', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Get email and password input elements
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Login');

    // Fill in the form fields
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for login to be called
    await waitFor(() => expect(loginMock).toHaveBeenCalledTimes(1));
    expect(loginMock).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  test('should display loading spinner when login is in progress', () => {
    // Simulate loading state
    useAuthStore.mockReturnValue({
      login: loginMock,
      isLoading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Ensure the loader is present
    expect(screen.getByRole('status')).toBeInTheDocument();  // Check if the loader is displayed
  });

  test('should display error message if login fails', async () => {
    const errorMessage = 'Invalid credentials';
    useAuthStore.mockReturnValue({
      login: loginMock,
      isLoading: false,
      error: errorMessage,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText(errorMessage)).toBeInTheDocument());
  });

  test('should navigate to signup page on "Sign up" link click', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<div>Sign Up Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  
    // Get the "Sign up" link
    const signUpLink = screen.getByText(/Sign up/i);
  
    // Simulate clicking the "Sign up" link
    fireEvent.click(signUpLink);
  
    // Check if the Sign Up page component is rendered
    expect(screen.getByText('Sign Up Page')).toBeInTheDocument();
  });

  test('should navigate to forgot password page on "Forgot password" link click', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  
    // Get the "Forgot password?" link
    const forgotPasswordLink = screen.getByText(/Forgot password?/i);
  
    // Simulate clicking the "Forgot Password" link
    fireEvent.click(forgotPasswordLink);
  
    // Check if the Forgot Password page component is rendered
    expect(screen.getByText('Forgot Password Page')).toBeInTheDocument();
  });
});


