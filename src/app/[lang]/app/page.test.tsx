// Feature: comprehensive-testing, Task 9.1: Authentication redirects
// Tests authentication redirect behavior for the app page

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import AppHomePage from './page';

// Mock the AuthContext
const mockUseAuth = vi.fn();
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the LanguageContext
const mockUseLanguage = vi.fn();
vi.mock('@/context/LanguageContext', () => ({
  useLanguage: () => mockUseLanguage(),
}));

// Mock AppHome component
vi.mock('@/components/AppHome', () => ({
  default: () => <div data-testid="app-home">App Home</div>,
}));

// Mock next/navigation
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    forward: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/en/app',
  useParams: () => ({ lang: 'en' }),
}));

describe('AppHomePage - Authentication Redirects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLanguage.mockReturnValue({
      language: { code: 'en', name: 'English' },
    });
  });

  it('should redirect unauthenticated users to landing page', async () => {
    // Arrange: User is not authenticated
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    // Act: Render the page
    const { container } = render(<AppHomePage />);

    // Assert: Should redirect to language-specific landing page
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/en');
    });

    // Should not render AppHome
    expect(container.querySelector('[data-testid="app-home"]')).not.toBeInTheDocument();
  });

  it('should allow authenticated users to access app', async () => {
    // Arrange: User is authenticated
    const mockUser = {
      uid: 'test-user-123',
      email: 'test@example.com',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    });

    // Act: Render the page
    const { getByTestId } = render(<AppHomePage />);

    // Assert: Should not redirect
    expect(mockReplace).not.toHaveBeenCalled();

    // Should render AppHome
    expect(getByTestId('app-home')).toBeInTheDocument();
  });

  it('should show nothing while loading authentication state', () => {
    // Arrange: Authentication is loading
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    // Act: Render the page
    const { container } = render(<AppHomePage />);

    // Assert: Should not redirect yet
    expect(mockReplace).not.toHaveBeenCalled();

    // Should not render anything
    expect(container.firstChild).toBeNull();
  });

  it('should redirect to correct language landing page based on user language', async () => {
    // Arrange: User is not authenticated, language is Spanish
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    mockUseLanguage.mockReturnValue({
      language: { code: 'es', name: 'Español' },
    });

    // Act: Render the page
    render(<AppHomePage />);

    // Assert: Should redirect to Spanish landing page
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/es');
    });
  });

  it('should not redirect if user becomes authenticated after loading', async () => {
    // Arrange: Start with loading state
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    const { rerender, queryByTestId } = render(<AppHomePage />);

    // Assert: No redirect during loading
    expect(mockReplace).not.toHaveBeenCalled();

    // Act: User becomes authenticated
    const mockUser = {
      uid: 'test-user-456',
      email: 'authenticated@example.com',
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    });

    rerender(<AppHomePage />);

    // Assert: Should not redirect, should show app
    await waitFor(() => {
      expect(queryByTestId('app-home')).toBeInTheDocument();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
