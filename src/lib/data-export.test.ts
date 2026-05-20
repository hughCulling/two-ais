import { describe, expect, it } from 'vitest';
import {
    buildManifest,
    buildPrivacySummary,
    sanitizeLocalPreferences,
    sanitizeUserDocument,
    toSerializableValue,
} from './data-export';

describe('data export helpers', () => {
    it('serializes timestamp-like values recursively', () => {
        const result = toSerializableValue({
            createdAt: {
                toDate: () => new Date('2026-05-15T10:00:00.000Z'),
            },
            nested: [new Date('2026-05-15T11:00:00.000Z')],
        });

        expect(result).toEqual({
            createdAt: '2026-05-15T10:00:00.000Z',
            nested: ['2026-05-15T11:00:00.000Z'],
        });
    });

    it('keeps useful user settings while omitting secret references', () => {
        const result = sanitizeUserDocument({
            email: 'person@example.com',
            sessionPreset: { agentA_llm: 'mistral-large' },
            apiSecretVersions: {
                mistral: 'projects/example/secrets/mistral/versions/1',
                empty: '',
            },
        });

        expect(result).toEqual({
            email: 'person@example.com',
            sessionPreset: { agentA_llm: 'mistral-large' },
            apiKeys: {
                configuredProviders: ['mistral'],
            },
        });
    });

    it('sanitizes browser preferences from unknown input', () => {
        expect(sanitizeLocalPreferences({
            selectedLanguage: ' en ',
            theme: 'dark',
            timezone: '',
        })).toEqual({
            selectedLanguage: 'en',
            theme: 'dark',
            timezone: null,
        });
    });

    it('documents omissions in the manifest and readme', () => {
        const manifest = buildManifest({
            exportedAt: '2026-05-15T12:00:00.000Z',
            includedFiles: ['account.json'],
            mediaFiles: [],
            storageAvailable: false,
        });

        expect(manifest.omissions).toContain('Media files were not included because Firebase Storage is not configured on the server.');
        expect(buildPrivacySummary('2026-05-15T12:00:00.000Z')).toContain('Raw API-key secret values are intentionally not included');
    });
});
