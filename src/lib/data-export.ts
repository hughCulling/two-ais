export interface LocalPreferences {
    selectedLanguage: string | null;
    theme: string | null;
    timezone: string | null;
}

export interface ExportedMediaFile {
    archivePath: string;
    storagePath: string;
    contentType: string | null;
    size: number | null;
}

export interface ExportManifest {
    schemaVersion: string;
    exportedAt: string;
    includedFiles: string[];
    includedCategories: string[];
    mediaFiles: ExportedMediaFile[];
    omissions: string[];
}

type TimestampLike = {
    toDate: () => Date;
};

export function toSerializableValue(value: unknown): unknown {
    if (value === null || value === undefined) return value;

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (isTimestampLike(value)) {
        return value.toDate().toISOString();
    }

    if (Array.isArray(value)) {
        return value.map(toSerializableValue);
    }

    if (typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
                key,
                toSerializableValue(nestedValue),
            ]),
        );
    }

    return value;
}

export function sanitizeLocalPreferences(input: unknown): LocalPreferences {
    const candidate = typeof input === 'object' && input !== null
        ? input as Record<string, unknown>
        : {};

    return {
        selectedLanguage: asOptionalString(candidate.selectedLanguage),
        theme: asOptionalString(candidate.theme),
        timezone: asOptionalString(candidate.timezone),
    };
}

export function sanitizeUserDocument(input: Record<string, unknown> | undefined): Record<string, unknown> {
    if (!input) {
        return {
            apiKeys: {
                configuredProviders: [],
            },
        };
    }

    const { apiSecretVersions, ...rest } = input;
    const secretVersions = typeof apiSecretVersions === 'object' && apiSecretVersions !== null
        ? apiSecretVersions as Record<string, unknown>
        : {};

    return {
        ...toSerializableValue(rest) as Record<string, unknown>,
        apiKeys: {
            configuredProviders: Object.entries(secretVersions)
                .filter(([, value]) => typeof value === 'string' && value.length > 0)
                .map(([provider]) => provider)
                .sort(),
        },
    };
}

export function buildPrivacySummary(exportedAt: string): string {
    return [
        'Two AIs data export',
        `Generated: ${exportedAt}`,
        '',
        'This file describes the data included in this export and mirrors the kinds of information commonly explained in a privacy notice. It is not itself a privacy policy.',
        '',
        'Controller and contact',
        '- The operator of Two AIs controls the data represented in this export.',
        '- Contact details are not configured in the application yet.',
        '',
        'Categories of personal data represented here',
        '- Account data: user identifier, email address, display name, profile photo URL, authentication providers, and account timestamps.',
        '- Settings data: saved session preset, configured API-key providers, selected interface language, theme, and browser timezone supplied at export time.',
        '- Conversation data: conversation configuration, prompts, messages, generated media references, status, and timestamps.',
        '- Media data: generated image and audio files stored for the user-owned conversations included in this export.',
        '',
        'Purposes',
        '- Account data is used to authenticate users and associate saved content with the correct account.',
        '- Settings data is used to remember user preferences and conversation defaults.',
        '- Conversation and media data is used to provide, resume, and display conversations and generated outputs.',
        '',
        'Lawful basis',
        '- The application does not currently store a configured lawful-basis register in code, so this export does not assert one.',
        '',
        'Recipients and transfers',
        '- The application uses Firebase / Google Cloud services for authentication, database, storage, and secret storage.',
        '- Any additional recipient or international-transfer detail is not configured in the application code and is not asserted here.',
        '',
        'Retention',
        '- The current application code does not define a complete retention schedule for each data category.',
        '',
        'Rights',
        '- Depending on applicable law, users may have rights to access, correct, delete, restrict, object to processing, and receive portable copies of personal data.',
        '',
        'Source of data',
        '- Account, settings, prompts, and API-key configuration are supplied by the user.',
        '- Conversation outputs and generated media are created through the service during use.',
        '',
        'Automated decision-making',
        '- The application generates AI conversation outputs, but this export does not identify any separate legal profiling or solely automated decision process affecting user rights.',
        '',
        'Important export notes',
        '- Raw API-key secret values are intentionally not included in this self-serve archive.',
        '- Internal secret-manager version references are also omitted because they are implementation credentials rather than useful portable user data.',
    ].join('\n');
}

export function buildManifest(params: {
    exportedAt: string;
    includedFiles: string[];
    mediaFiles: ExportedMediaFile[];
    storageAvailable: boolean;
}): ExportManifest {
    const omissions = [
        'Raw API-key secret values are intentionally excluded from the self-serve archive.',
        'Internal secret-manager version references are intentionally excluded from the self-serve archive.',
    ];

    if (!params.storageAvailable) {
        omissions.push('Media files were not included because Firebase Storage is not configured on the server.');
    }

    return {
        schemaVersion: '1.0',
        exportedAt: params.exportedAt,
        includedFiles: [...params.includedFiles].sort(),
        includedCategories: [
            'account',
            'settings',
            'local_preferences',
            'conversations',
            'messages',
            'generated_media',
        ],
        mediaFiles: params.mediaFiles,
        omissions,
    };
}

function isTimestampLike(value: unknown): value is TimestampLike {
    return typeof value === 'object'
        && value !== null
        && 'toDate' in value
        && typeof (value as TimestampLike).toDate === 'function';
}

function asOptionalString(value: unknown): string | null {
    return typeof value === 'string' && value.trim().length > 0
        ? value.trim()
        : null;
}
