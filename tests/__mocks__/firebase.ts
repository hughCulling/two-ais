import { vi } from 'vitest';

// Mock Firestore
export const mockDb = {
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
};

// Mock Realtime Database
export const mockRtdb = {
  ref: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  onValue: vi.fn(),
  off: vi.fn(),
};

// Mock Auth
export const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
};

// Mock Firebase Timestamp
export const mockTimestamp = {
  now: vi.fn(() => ({
    seconds: Math.floor(Date.now() / 1000),
    nanoseconds: 0,
    toDate: () => new Date(),
  })),
  fromDate: vi.fn((date: Date) => ({
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0,
    toDate: () => date,
  })),
};
