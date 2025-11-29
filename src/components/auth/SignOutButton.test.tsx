// Feature: comprehensive-testing, Task 9.4: Signout cleanup
// Tests that session state is cleared on signout and redirect to landing page

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignOutButton from './SignOutButton';

// Mock Firebase auth
const mockSignOut = vi.fn();
vi.mock('firebase/auth', () => ({
  signOut: (...args: any[]) => mockSignOut(...args),
}));

// Mock Firebase client app
vi.mock('@/lib/firebase/clientApp', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-123',
      email: 'test@example.com',
    },
  },
}));

// Mock translation hook
const mockUseTranslation = vi.fn();
vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => mockUseTranslation(),
}));

describe('SignOutButton - Signout Cleanup', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseTranslation.mockReturnValue({
      t: {
        header: {
          signOut: 'Sign Out',
        },
      },
      loading: false,
    });
  });

  it('should call signOut when button is clicked', async () => {
    // Arrange: Mock successful signout
    mockSignOut.mockResolvedValue(undefined);

    // Act: Render and click the button
    render(<SignOutButton />);

    const button = screen.getByRole('button', { name: /Sign out/i });
    fireEvent.click(button);

    // Assert: Should call Firebase signOut
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it('should call onSignOut callback after successful signout', async () => {
    // Arrange: Mock successful signout
    mockSignOut.mockResolvedValue(undefined);
    const onSignOutCallback = vi.fn();

    // Act: Render with callback and click
    render(<SignOutButton onSignOut={onSignOutCallback} />);

    const button = screen.getByRole('button', { name: /Sign out/i });
    fireEvent.click(button);

    // Assert: Should call the callback after signout
    await waitFor(() => {
      expect(onSignOutCallback).toHaveBeenCalled();
    });
  });

  it('should show loading state while signing out', async () => {
    // Arrange: Mock signout with delay
    mockSignOut.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    // Act: Render and click
    render(<SignOutButton />);

    const button = screen.getByRole('button', { name: /Sign out/i });
    fireEvent.click(button);

    // Assert: Should show loading text
    await waitFor(() => {
      expect(screen.getByText(/Sign Out\.\.\./i)).toBeInTheDocument();
    });

    // Button should be disabled during loading
    expect(button).toBeDisabled();
  });

  it('should show error message if signout fails', async () => {
    // Arrange: Mock failed signout
    const error = new Error('Network error');
    mockSignOut.mockRejectedValue(error);

    // Act: Render and click
    render(<SignOutButton />);

    const button = screen.getByRole('button', { name: /Sign out/i });
    fireEvent.click(button);

    // Assert: Should show error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to sign out: Network error/i)).toBeInTheDocument();
    });
  });

  it('should handle signout errors gracefully', async () => {
    // Arrange: Mock signout error
    const error = new Error('Auth service error');
    mockSignOut.mockRejectedValue(error);

    const onSignOutCallback = vi.fn();

    // Act: Render and click
    render(<SignOutButton onSignOut={onSignOutCallback} />);

    const button = screen.getByRole('button', { name: /Sign out/i });
    fireEvent.click(button);

    // Assert: Should show error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to sign out/i)).toBeInTheDocument();
    });

    // Callback should not be called on error
    expect(onSignOutCallback).not.toHaveBeenCalled();
  });

  it('should disable button while loading', async () => {
    // Arrange: Mock signout with delay
    mockSignOut.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    // Act: Render and click
    render(<SignOutButton />);

    const button = screen.getByRole('button', { name: /Sign out/i });
    
    // Button should be enabled initially
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    // Assert: Button should be disabled while loading
    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it('should clear session state on successful signout', async () => {
    // Arrange: Mock successful signout
    mockSignOut.mockResolvedValue(undefined);
    const onSignOutCallback = vi.fn();

    // Act: Render and sign out
    render(<SignOutButton onSignOut={onSignOutCallback} />);

    const button = screen.getByRole('button', { name: /Sign out/i });
    fireEvent.click(button);

    // Assert: Firebase signOut should be called (which clears auth state)
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });

    // Callback should be called (which typically triggers redirect)
    expect(onSignOutCallback).toHaveBeenCalled();
  });
});
