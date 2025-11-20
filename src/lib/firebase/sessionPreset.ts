// src/lib/firebase/sessionPreset.ts
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './clientApp';

export interface SessionPreset {
    agentA_llm: string;
    agentB_llm: string;
    ttsEnabled: boolean;
    agentA_tts: {
        provider: string;
        voice: string | null;
        selectedTtsModelId?: string;
        ttsApiModelId?: string;
    };
    agentB_tts: {
        provider: string;
        voice: string | null;
        selectedTtsModelId?: string;
        ttsApiModelId?: string;
    };
    initialSystemPrompt: string;
    savedAt?: number; // timestamp
    collapseStates?: {
        cardDescription?: boolean;
        initialPromptDescription?: boolean;
        ollamaDetails?: boolean;
    };
}

/**
 * Save a session preset for a user
 */
export async function saveSessionPreset(userId: string, preset: SessionPreset): Promise<void> {
    if (!userId) {
        throw new Error('User ID is required to save preset');
    }

    const userRef = doc(db, 'users', userId);
    const presetWithTimestamp = {
        ...preset,
        savedAt: Date.now()
    };

    await updateDoc(userRef, {
        sessionPreset: presetWithTimestamp
    });
}

/**
 * Load a session preset for a user
 */
export async function loadSessionPreset(userId: string): Promise<SessionPreset | null> {
    if (!userId) {
        throw new Error('User ID is required to load preset');
    }

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        return null;
    }

    const data = userDoc.data();
    return data.sessionPreset || null;
}

/**
 * Delete a session preset for a user
 */
export async function deleteSessionPreset(userId: string): Promise<void> {
    if (!userId) {
        throw new Error('User ID is required to delete preset');
    }

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        sessionPreset: null
    });
}

/**
 * Check if a user has a saved preset
 */
export async function hasSessionPreset(userId: string): Promise<boolean> {
    const preset = await loadSessionPreset(userId);
    return preset !== null;
}
