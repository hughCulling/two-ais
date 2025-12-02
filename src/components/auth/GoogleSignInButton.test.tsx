import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GoogleSignInButton from './GoogleSignInButton';
import { signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Mock Firebase Auth
vi.mock('firebase/auth', async () => {
    const actual = await vi.importActual('firebase/auth');
    return {
        ...actual,
        GoogleAuthProvider: vi.fn(),
        signInWithPopup: vi.fn(),
        signInWithRedirect: vi.fn(),
        getRedirectResult: vi.fn(),
    };
});

vi.mock('firebase/app', async () => {
    // Mock Firebase App (for FirebaseError)
    class MockFirebaseError extends Error {
        code: string;
        constructor(code: string, message: string) {
            super(message);
            this.code = code;
            this.name = 'FirebaseError';
        }
    }
    return {
        FirebaseError: MockFirebaseError,
        initializeApp: vi.fn(),
        getApps: vi.fn(() => []),
        getApp: vi.fn(),
    };
});

// Mock Firebase Firestore
vi.mock('firebase/firestore', async () => {
    const actual = await vi.importActual('firebase/firestore');
    return {
        ...actual,
        doc: vi.fn(),
        getDoc: vi.fn(),
        setDoc: vi.fn(),
        serverTimestamp: vi.fn(),
    };
});

// Mock Firebase Client App
vi.mock('@/lib/firebase/clientApp', () => ({
    auth: { currentUser: null },
    db: {},
}));

// Mock Translations
vi.mock('@/hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: {
            auth: {
                login: {
                    signingIn: 'Signing in...',
                    signInWithGoogle: 'Sign in with Google',
                },
                errors: {
                    initialization: 'Init Error',
                    unknownGoogleSignInError: 'Unknown Error',
                    googleSignInFailedPrefix: 'Sign In Failed: ',
                    profileSaveFailedPrefix: 'Profile Save Failed: ',
                    profileCheckSaveFailedPrefix: 'Profile Check Failed: ',
                    accountExistsWithDifferentCredential: 'Account exists with different credential',
                },
            },
        },
        loading: false,
    }),
}));

describe('GoogleSignInButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: getRedirectResult returns null (no redirect happened)
        vi.mocked(getRedirectResult).mockResolvedValue(null);
    });

    it('should handle successful popup sign-in (Desktop flow)', async () => {
        const mockUser = { uid: 'test-uid', email: 'test@example.com' };
        vi.mocked(signInWithPopup).mockResolvedValue({ user: mockUser } as any);
        vi.mocked(getDoc).mockResolvedValue({ exists: () => true } as any); // User exists

        render(<GoogleSignInButton />);

        const button = screen.getByRole('button', { name: /sign in with google/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(signInWithPopup).toHaveBeenCalled();
            expect(signInWithRedirect).not.toHaveBeenCalled();
            expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', 'test-uid');
        });
    });

    it('should fallback to redirect when popup is blocked (iPhone 7 flow)', async () => {
        // Simulate popup blocked error using the mock class
        // We import the mock class from the mocked module to ensure it matches
        const { FirebaseError } = await import('firebase/app');
        const popupError = new FirebaseError('auth/popup-blocked', 'Popup blocked');
        vi.mocked(signInWithPopup).mockRejectedValue(popupError);

        render(<GoogleSignInButton />);

        const button = screen.getByRole('button', { name: /sign in with google/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(signInWithPopup).toHaveBeenCalled();
            expect(signInWithRedirect).toHaveBeenCalled(); // Should fallback to redirect
        });
    });

    it('should handle redirect result on mount (Mobile return flow)', async () => {
        const mockUser = { uid: 'redirect-uid', email: 'redirect@example.com' };
        // Simulate returning from redirect with a user
        vi.mocked(getRedirectResult).mockResolvedValue({ user: mockUser } as any);
        vi.mocked(getDoc).mockResolvedValue({ exists: () => true } as any);

        render(<GoogleSignInButton />);

        await waitFor(() => {
            expect(getRedirectResult).toHaveBeenCalled();
            expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', 'redirect-uid');
        });
    });

    it('should create user document if it does not exist', async () => {
        const mockUser = { uid: 'new-user', email: 'new@example.com' };
        vi.mocked(signInWithPopup).mockResolvedValue({ user: mockUser } as any);

        // Simulate user doc NOT existing
        vi.mocked(getDoc).mockResolvedValue({ exists: () => false } as any);

        render(<GoogleSignInButton />);

        const button = screen.getByRole('button', { name: /sign in with google/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(setDoc).toHaveBeenCalled(); // Should create new doc
        });
    });
});
