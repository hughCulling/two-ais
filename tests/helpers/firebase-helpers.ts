// tests/helpers/firebase-helpers.ts
// Firebase test utilities and helpers

import { Timestamp } from 'firebase/firestore';

/**
 * Creates a mock Firestore Timestamp from a Date
 */
export const createMockTimestamp = (date: Date = new Date()): Timestamp => {
  return Timestamp.fromDate(date);
};

/**
 * Creates a mock Firestore Timestamp from milliseconds
 */
export const createMockTimestampFromMillis = (millis: number): Timestamp => {
  return Timestamp.fromMillis(millis);
};

/**
 * Creates a sequence of timestamps with incremental time differences
 */
export const createTimestampSequence = (
  count: number,
  startDate: Date = new Date(),
  incrementMs: number = 1000
): Timestamp[] => {
  const timestamps: Timestamp[] = [];
  let currentTime = startDate.getTime();
  
  for (let i = 0; i < count; i++) {
    timestamps.push(Timestamp.fromMillis(currentTime));
    currentTime += incrementMs;
  }
  
  return timestamps;
};

/**
 * Mock Firestore document reference
 */
export const createMockDocRef = (collectionPath: string, docId: string) => {
  return {
    id: docId,
    path: `${collectionPath}/${docId}`,
    collection: collectionPath,
  };
};

/**
 * Mock Firestore collection reference
 */
export const createMockCollectionRef = (path: string) => {
  return {
    path,
    id: path.split('/').pop() || path,
  };
};

/**
 * Helper to create a mock Firebase user
 */
export const createMockUser = (overrides?: Partial<{
  uid: string;
  email: string;
  displayName: string;
}>) => {
  return {
    uid: overrides?.uid || 'test-user-123',
    email: overrides?.email || 'test@example.com',
    displayName: overrides?.displayName || 'Test User',
    getIdToken: async () => 'mock-id-token',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: 'mock-refresh-token',
    tenantId: null,
    delete: async () => {},
    getIdTokenResult: async () => ({
      token: 'mock-id-token',
      expirationTime: new Date(Date.now() + 3600000).toISOString(),
      authTime: new Date().toISOString(),
      issuedAtTime: new Date().toISOString(),
      signInProvider: 'password',
      signInSecondFactor: null,
      claims: {},
    }),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    photoURL: null,
    providerId: 'firebase',
  };
};

/**
 * Helper to wait for a condition to be true
 */
export const waitFor = async (
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> => {
  const startTime = Date.now();
  
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
};

/**
 * Helper to create a delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Mock Firebase Auth instance
 */
export const createMockAuth = () => {
  return {
    currentUser: null,
    onAuthStateChanged: (callback: (user: any) => void) => {
      // Return unsubscribe function
      return () => {};
    },
    signInWithEmailAndPassword: async (email: string, password: string) => {
      return {
        user: createMockUser({ email }),
      };
    },
    signOut: async () => {},
    createUserWithEmailAndPassword: async (email: string, password: string) => {
      return {
        user: createMockUser({ email }),
      };
    },
  };
};

/**
 * Mock Firestore instance
 */
export const createMockFirestore = () => {
  const data = new Map<string, any>();
  
  return {
    collection: (path: string) => createMockCollectionRef(path),
    doc: (path: string) => createMockDocRef(path.split('/')[0], path.split('/')[1]),
    setDoc: async (ref: any, data: any) => {
      data.set(ref.path, data);
    },
    getDoc: async (ref: any) => {
      const docData = data.get(ref.path);
      return {
        exists: () => !!docData,
        data: () => docData,
        id: ref.id,
      };
    },
    updateDoc: async (ref: any, updates: any) => {
      const existing = data.get(ref.path) || {};
      data.set(ref.path, { ...existing, ...updates });
    },
    deleteDoc: async (ref: any) => {
      data.delete(ref.path);
    },
  };
};

/**
 * Mock Realtime Database instance
 */
export const createMockRTDB = () => {
  const data = new Map<string, any>();
  
  return {
    ref: (path: string) => ({
      path,
      set: async (value: any) => {
        data.set(path, value);
      },
      get: async () => ({
        exists: () => data.has(path),
        val: () => data.get(path),
      }),
      update: async (updates: any) => {
        const existing = data.get(path) || {};
        data.set(path, { ...existing, ...updates });
      },
      remove: async () => {
        data.delete(path);
      },
      on: (eventType: string, callback: (snapshot: any) => void) => {
        // Return unsubscribe function
        return () => {};
      },
      off: () => {},
    }),
  };
};

/**
 * Helper to generate a random conversation ID
 */
export const generateConversationId = (): string => {
  return `conv-${Date.now()}-${Math.random().toString(36).substring(7)}`;
};

/**
 * Helper to generate a random message ID
 */
export const generateMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`;
};

/**
 * Helper to generate a random user ID
 */
export const generateUserId = (): string => {
  return `user-${Date.now()}-${Math.random().toString(36).substring(7)}`;
};
