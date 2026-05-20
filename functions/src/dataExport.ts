import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { onTaskDispatched } from "firebase-functions/v2/tasks";
import JSZip from "jszip";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

type LocalPreferences = {
  selectedLanguage: string | null;
  theme: string | null;
  timezone: string | null;
};

type ExportJob = {
  userId: string;
  status: "queued" | "processing" | "ready" | "failed";
  requestedAt?: admin.firestore.Timestamp;
  localPreferences?: LocalPreferences;
};

type ExportedMediaFile = {
  archivePath: string;
  storagePath: string;
  contentType: string | null;
  size: number | null;
};

const db = admin.firestore();
const defaultBucketName = process.env.FIREBASE_STORAGE_BUCKET || admin.app().options.storageBucket || "two-ais.appspot.com";
const storageBucket = admin.storage().bucket(defaultBucketName);
const EXPORT_RETENTION_DAYS = 7;

export const processDataExport = onTaskDispatched<{ jobId: string }>(
  {
    region: "us-central1",
    timeoutSeconds: 1800,
    memory: "1GiB",
    retryConfig: {
      maxAttempts: 3,
      minBackoffSeconds: 60,
    },
    rateLimits: {
      maxConcurrentDispatches: 1,
    },
  },
  async (request) => {
    const { jobId } = request.data;
    const jobRef = db.collection("exportJobs").doc(jobId);
    const snapshot = await jobRef.get();
    if (!snapshot.exists) {
      logger.warn("Export job not found.", { jobId });
      return;
    }

    const job = snapshot.data() as ExportJob;
    if (job.status === "ready") {
      logger.info("Export job already completed.", { jobId });
      return;
    }

    await jobRef.update({
      status: "processing",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
      errorMessage: admin.firestore.FieldValue.delete(),
    });

    try {
      const exportedAt = new Date().toISOString();
      const zip = new JSZip();
      const includedFiles: string[] = [];
      const mediaFiles: ExportedMediaFile[] = [];
      const authUser = await admin.auth().getUser(job.userId);
      const userDoc = await db.collection("users").doc(job.userId).get();

      addJson(zip, includedFiles, "account.json", {
        uid: authUser.uid,
        email: authUser.email ?? null,
        emailVerified: authUser.emailVerified,
        displayName: authUser.displayName ?? null,
        photoURL: authUser.photoURL ?? null,
        disabled: authUser.disabled,
        metadata: authUser.metadata,
        providerData: authUser.providerData.map((provider) => ({
          providerId: provider.providerId,
          uid: provider.uid,
          email: provider.email ?? null,
          displayName: provider.displayName ?? null,
          photoURL: provider.photoURL ?? null,
        })),
      });

      addJson(zip, includedFiles, "settings.json", {
        firestoreProfile: sanitizeUserDocument(userDoc.exists ? userDoc.data() : undefined),
        localPreferences: job.localPreferences ?? {
          selectedLanguage: null,
          theme: null,
          timezone: null,
        },
      });

      const conversationsSnapshot = await db.collection("conversations")
        .where("userId", "==", job.userId)
        .get();
      const conversations = await Promise.all(conversationsSnapshot.docs.map(async (conversationDoc) => {
        const messagesSnapshot = await conversationDoc.ref.collection("messages")
          .orderBy("timestamp", "asc")
          .get();

        return {
          id: conversationDoc.id,
          ...toSerializableValue(conversationDoc.data()) as Record<string, unknown>,
          messages: messagesSnapshot.docs.map((messageDoc) => ({
            id: messageDoc.id,
            ...toSerializableValue(messageDoc.data()) as Record<string, unknown>,
          })),
        };
      }));

      conversations
        .sort((left, right) => String(left.id).localeCompare(String(right.id)))
        .forEach((conversation) => {
          addJson(zip, includedFiles, `conversations/${conversation.id}.json`, conversation);
        });

      for (const conversation of conversations) {
        for (const mediaKind of ["images", "audio"] as const) {
          const prefix = `conversations/${conversation.id}/${mediaKind}/`;
          const [files] = await storageBucket.getFiles({ prefix });

          for (const file of files) {
            const relativePath = file.name.slice(prefix.length);
            if (!relativePath) continue;

            const archivePath = `media/${conversation.id}/${mediaKind}/${relativePath}`;
            const [contents] = await file.download();
            const [metadata] = await file.getMetadata();

            zip.file(archivePath, contents);
            includedFiles.push(archivePath);
            mediaFiles.push({
              archivePath,
              storagePath: file.name,
              contentType: metadata.contentType ?? null,
              size: typeof metadata.size === "string" ? Number(metadata.size) : null,
            });
          }
        }
      }

      zip.file("README.txt", buildPrivacySummary(exportedAt));
      includedFiles.push("README.txt");
      const includedFilesWithManifest = [...includedFiles, "manifest.json"];
      addJson(zip, includedFiles, "manifest.json", buildManifest({
        exportedAt,
        includedFiles: includedFilesWithManifest,
        mediaFiles,
      }));

      const archive = await zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
      });
      const fileSafeTimestamp = exportedAt.replace(/[:.]/g, "-");
      const filename = `two-ais-data-export-${fileSafeTimestamp}.zip`;
      const filePath = `exports/${job.userId}/${jobId}.zip`;
      await storageBucket.file(filePath).save(archive, {
        metadata: {
          contentType: "application/zip",
          cacheControl: "private, max-age=0, no-store",
        },
      });

      const expiresAt = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + EXPORT_RETENTION_DAYS * 24 * 60 * 60 * 1000),
      );
      await jobRef.update({
        status: "ready",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt,
        filename,
        filePath,
        archiveSize: archive.length,
        mediaFileCount: mediaFiles.length,
      });

      logger.info("Data export is ready for in-app download.", { jobId, userId: job.userId });
    } catch (error) {
      logger.error("Failed to build data export.", error, { jobId, userId: job.userId });
      await jobRef.update({
        status: "failed",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        errorMessage: error instanceof Error ? error.message : "Unknown export error.",
      });
      throw error;
    }
  },
);

function toSerializableValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return value.toISOString();
  if (isTimestampLike(value)) return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(toSerializableValue);
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
        key,
        toSerializableValue(nestedValue),
      ]),
    );
  }
  return value;
}

function sanitizeUserDocument(input: admin.firestore.DocumentData | undefined): Record<string, unknown> {
  if (!input) {
    return { apiKeys: { configuredProviders: [] } };
  }

  const { apiSecretVersions, ...rest } = input;
  const secretVersions = typeof apiSecretVersions === "object" && apiSecretVersions !== null
    ? apiSecretVersions as Record<string, unknown>
    : {};

  return {
    ...toSerializableValue(rest) as Record<string, unknown>,
    apiKeys: {
      configuredProviders: Object.entries(secretVersions)
        .filter(([, value]) => typeof value === "string" && value.length > 0)
        .map(([provider]) => provider)
        .sort(),
    },
  };
}

function buildPrivacySummary(exportedAt: string): string {
  return [
    "Two AIs data export",
    `Generated: ${exportedAt}`,
    "",
    "This file describes the data included in this export and mirrors the kinds of information commonly explained in a privacy notice. It is not itself a privacy policy.",
    "",
    "Controller and contact",
    "- The operator of Two AIs controls the data represented in this export.",
    "- Contact details are not configured in the application yet.",
    "",
    "Categories of personal data represented here",
    "- Account data: user identifier, email address, display name, profile photo URL, authentication providers, and account timestamps.",
    "- Settings data: saved session preset, configured API-key providers, selected interface language, theme, and browser timezone supplied at export time.",
    "- Conversation data: conversation configuration, prompts, messages, generated media references, status, and timestamps.",
    "- Media data: generated image and audio files stored for the user-owned conversations included in this export.",
    "",
    "Important export notes",
    "- Raw API-key secret values are intentionally not included in this self-serve archive.",
    "- Internal secret-manager version references are also omitted because they are implementation credentials rather than useful portable user data.",
  ].join("\n");
}

function buildManifest(params: {
  exportedAt: string;
  includedFiles: string[];
  mediaFiles: ExportedMediaFile[];
}) {
  return {
    schemaVersion: "1.0",
    exportedAt: params.exportedAt,
    includedFiles: [...params.includedFiles].sort(),
    includedCategories: [
      "account",
      "settings",
      "local_preferences",
      "conversations",
      "messages",
      "generated_media",
    ],
    mediaFiles: params.mediaFiles,
    omissions: [
      "Raw API-key secret values are intentionally excluded from the self-serve archive.",
      "Internal secret-manager version references are intentionally excluded from the self-serve archive.",
    ],
  };
}

function addJson(zip: JSZip, includedFiles: string[], path: string, value: unknown) {
  zip.file(path, `${JSON.stringify(value, null, 2)}\n`);
  includedFiles.push(path);
}

function isTimestampLike(value: unknown): value is { toDate: () => Date } {
  return typeof value === "object"
    && value !== null
    && "toDate" in value
    && typeof (value as { toDate: () => Date }).toDate === "function";
}
