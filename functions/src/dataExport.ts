import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { onTaskDispatched } from "firebase-functions/v2/tasks";
import type archiver from "archiver";

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
  conversationId: string;
  mediaKind: "images" | "audio";
  relativePath: string;
  storagePath: string;
  contentType: string | null;
  size: number | null;
  downloadUrl?: string;
  downloadUrlSource?: "firebase_storage_token";
};

type ZipArchiveConstructor = new (options?: archiver.ArchiverOptions) => archiver.Archiver;

const db = admin.firestore();
const defaultBucketName = process.env.FIREBASE_STORAGE_BUCKET || admin.app().options.storageBucket || "two-ais.appspot.com";
const storageBucket = admin.storage().bucket(defaultBucketName);
const EXPORT_RETENTION_DAYS = 7;
const MEDIA_STORAGE_PREFIX = "conversations/";
const MEDIA_LIST_PAGE_SIZE = 500;

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
      const includedFiles: string[] = [];
      const mediaFiles: ExportedMediaFile[] = [];
      const fileSafeTimestamp = exportedAt.replace(/[:.]/g, "-");
      const filename = `two-ais-data-export-${fileSafeTimestamp}.zip`;
      const filePath = `exports/${job.userId}/${jobId}.zip`;
      const outputFile = storageBucket.file(filePath);
      const outputStream = outputFile.createWriteStream({
        metadata: {
          contentType: "application/zip",
          cacheControl: "private, max-age=0, no-store",
        },
        resumable: false,
      });
      const { ZipArchive } = await import("archiver") as unknown as { ZipArchive: ZipArchiveConstructor };
      const archive = new ZipArchive({
        store: true,
        zlib: { level: 0 },
      });
      const archiveComplete = new Promise<void>((resolve, reject) => {
        outputStream.on("finish", resolve);
        outputStream.on("error", reject);
        archive.on("error", reject);
      });
      archive.pipe(outputStream);

      const authUser = await admin.auth().getUser(job.userId);
      const userDoc = await db.collection("users").doc(job.userId).get();

      appendJson(archive, includedFiles, "account.json", {
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

      appendJson(archive, includedFiles, "settings.json", {
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
          appendJson(archive, includedFiles, `conversations/${conversation.id}.json`, conversation);
        });

      const conversationIds = new Set(conversations.map((conversation) => String(conversation.id)));
      let mediaInventoryError: string | null = null;
      try {
        let pageToken: string | undefined;
        do {
          const [files, nextQuery] = await storageBucket.getFiles({
            prefix: MEDIA_STORAGE_PREFIX,
            autoPaginate: false,
            maxResults: MEDIA_LIST_PAGE_SIZE,
            pageToken,
            fields: "items(name,size,contentType,metadata),nextPageToken",
          });

          for (const file of files) {
            const parsedPath = parseConversationMediaPath(file.name);
            if (!parsedPath || !conversationIds.has(parsedPath.conversationId)) continue;

            const metadata = file.metadata as StorageObjectMetadata | undefined;
            const downloadToken = getFirebaseDownloadToken(metadata);
            const downloadUrl = downloadToken
              ? buildFirebaseStorageDownloadUrl(storageBucket.name, file.name, downloadToken)
              : undefined;

            mediaFiles.push({
              ...parsedPath,
              storagePath: file.name,
              contentType: metadata?.contentType ?? null,
              size: normalizeStorageSize(metadata?.size),
              downloadUrl,
              downloadUrlSource: downloadUrl ? "firebase_storage_token" : undefined,
            });
          }

          pageToken = nextQuery && typeof nextQuery.pageToken === "string" ? nextQuery.pageToken : undefined;
        } while (pageToken);
      } catch (error) {
        mediaInventoryError = error instanceof Error ? error.message : "Unable to list media files.";
        logger.warn("Continuing data export without a complete media inventory.", {
          jobId,
          userId: job.userId,
          error: mediaInventoryError,
        });
      }

      appendJson(archive, includedFiles, "media-manifest.json", {
        note: "Large generated media files are not embedded in this ZIP. Existing Firebase Storage download-token URLs are included when available; otherwise the storage path is listed for account-owned media.",
        status: mediaInventoryError ? "partial_or_unavailable" : "complete",
        error: mediaInventoryError,
        files: mediaFiles,
      });
      archive.append(buildPrivacySummary(exportedAt), { name: "README.txt" });
      includedFiles.push("README.txt");
      const includedFilesWithManifest = [...includedFiles, "manifest.json"];
      appendJson(archive, includedFiles, "manifest.json", buildManifest({
        exportedAt,
        includedFiles: includedFilesWithManifest,
        mediaFiles,
      }));

      await archive.finalize();
      await archiveComplete;
      const [outputMetadata] = await outputFile.getMetadata();
      const archiveSize = typeof outputMetadata.size === "string" ? Number(outputMetadata.size) : null;

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
        archiveSize,
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
    "- Media data: generated image and audio files are listed in media-manifest.json with direct download URLs when Firebase Storage tokens already exist.",
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
      "generated_media_manifest",
    ],
    mediaFiles: params.mediaFiles,
    omissions: [
      "Raw API-key secret values are intentionally excluded from the self-serve archive.",
      "Internal secret-manager version references are intentionally excluded from the self-serve archive.",
      "Large generated media binaries are referenced in media-manifest.json instead of embedded in the ZIP.",
      "Some server-generated media may not have direct download URLs if no Firebase Storage download token exists for that object.",
    ],
  };
}

function appendJson(archive: archiver.Archiver, includedFiles: string[], path: string, value: unknown) {
  archive.append(`${JSON.stringify(value, null, 2)}\n`, { name: path });
  includedFiles.push(path);
}

function isTimestampLike(value: unknown): value is { toDate: () => Date } {
  return typeof value === "object"
    && value !== null
    && "toDate" in value
    && typeof (value as { toDate: () => Date }).toDate === "function";
}

type StorageObjectMetadata = {
  contentType?: string;
  size?: string | number;
  metadata?: {
    firebaseStorageDownloadTokens?: string;
  };
};

function parseConversationMediaPath(storagePath: string): Pick<ExportedMediaFile, "conversationId" | "mediaKind" | "relativePath"> | null {
  const match = /^conversations\/([^/]+)\/(images|audio)\/(.+)$/.exec(storagePath);
  if (!match) return null;
  return {
    conversationId: match[1],
    mediaKind: match[2] as "images" | "audio",
    relativePath: match[3],
  };
}

function normalizeStorageSize(size: string | number | undefined): number | null {
  if (typeof size === "number") return size;
  if (typeof size === "string" && size.trim()) {
    const parsed = Number(size);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getFirebaseDownloadToken(metadata: StorageObjectMetadata | undefined): string | undefined {
  const tokens = metadata?.metadata?.firebaseStorageDownloadTokens;
  return tokens?.split(",").map((token) => token.trim()).find(Boolean);
}

function buildFirebaseStorageDownloadUrl(bucketName: string, storagePath: string, token: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(storagePath)}?alt=media&token=${encodeURIComponent(token)}`;
}
