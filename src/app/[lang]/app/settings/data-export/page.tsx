'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import {
    collection,
    onSnapshot,
    query,
    Timestamp,
    where,
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { db } from '@/lib/firebase/clientApp';

type ExportJob = {
    id: string;
    status: 'queued' | 'processing' | 'ready' | 'failed';
    requestedAt?: Timestamp;
    completedAt?: Timestamp;
    expiresAt?: Timestamp;
    archiveSize?: number;
    filename?: string;
    errorMessage?: string;
};

const STALE_ACTIVE_JOB_MS = 10 * 60 * 1000;

export default function DataExportPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<ExportJob[]>([]);
    const [isRequesting, setIsRequesting] = useState(false);
    const [downloadingJobId, setDownloadingJobId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setJobs([]);
            return;
        }

        const exportJobsQuery = query(
            collection(db, 'exportJobs'),
            where('userId', '==', user.uid),
        );

        return onSnapshot(exportJobsQuery, (snapshot) => {
            const nextJobs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ExportJob[];

            nextJobs.sort((left, right) => getTimestamp(right.requestedAt) - getTimestamp(left.requestedAt));
            setJobs(nextJobs);
        }, (snapshotError) => {
            setError(snapshotError.message);
        });
    }, [user]);

    const activeJob = useMemo(
        () => jobs.find((job) => (job.status === 'queued' || job.status === 'processing') && !isStaleActiveJob(job)) ?? null,
        [jobs],
    );

    const handleRequestExport = async () => {
        if (!user) return;

        setIsRequesting(true);
        setError(null);

        try {
            const idToken = await user.getIdToken(true);
            const response = await fetch('/api/account/export/jobs', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    localPreferences: {
                        selectedLanguage: localStorage.getItem('selectedLanguage'),
                        theme: localStorage.getItem('theme'),
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
                    },
                }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null) as { error?: string } | null;
                throw new Error(payload?.error || 'Unable to queue export.');
            }
        } catch (exportError) {
            setError(exportError instanceof Error ? exportError.message : 'Unable to queue export.');
        } finally {
            setIsRequesting(false);
        }
    };

    const handleRetry = async (job: ExportJob) => {
        if (!user) return;

        setIsRequesting(true);
        setError(null);

        try {
            const idToken = await user.getIdToken(true);
            const response = await fetch('/api/account/export/jobs', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ retryJobId: job.id }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null) as { error?: string } | null;
                throw new Error(payload?.error || 'Unable to retry export.');
            }
        } catch (retryError) {
            setError(retryError instanceof Error ? retryError.message : 'Unable to retry export.');
        } finally {
            setIsRequesting(false);
        }
    };

    const handleDownload = async (job: ExportJob) => {
        if (!user) return;

        setDownloadingJobId(job.id);
        setError(null);

        try {
            const idToken = await user.getIdToken(true);
            const response = await fetch(`/api/account/export/jobs/${job.id}/download`, {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null) as { error?: string } | null;
                throw new Error(payload?.error || 'Unable to download export.');
            }

            const blob = await response.blob();
            const disposition = response.headers.get('Content-Disposition');
            const filename = disposition?.match(/filename="([^"]+)"/)?.[1] ?? 'two-ais-data-export.zip';
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            URL.revokeObjectURL(url);
        } catch (exportError) {
            setError(exportError instanceof Error ? exportError.message : 'Unable to download export.');
        } finally {
            setDownloadingJobId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Data Export</h1>
                <p className="text-muted-foreground">
                    Download a portable archive of the data currently associated with your account.
                </p>
            </div>

            {error && (
                <Alert variant="destructive" role="alert">
                    <AlertTitle>Export failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Request a new export</CardTitle>
                    <CardDescription>
                        The archive is built in the background so you do not need to keep this tab open while it is prepared.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        You can close this tab and come back later; the latest status will appear below. Raw API-key values are not included, and large media files are listed with temporary download links.
                    </p>
                    <Button onClick={handleRequestExport} disabled={!user || isRequesting || Boolean(activeJob)} className="gap-2">
                        <Download className="h-4 w-4" aria-hidden="true" />
                        {activeJob ? 'Export already in progress' : isRequesting ? 'Requesting export...' : 'Request export'}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Export history</CardTitle>
                    <CardDescription>
                        Recent exports stay available here until they expire.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {jobs.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No exports requested yet.</p>
                    ) : (
                        jobs.map((job) => {
                            const expired = job.expiresAt ? job.expiresAt.toDate().getTime() <= Date.now() : false;
                            const retryable = job.status === 'failed' || isStaleActiveJob(job);
                            return (
                                <div key={job.id} className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium">{formatStatus(job.status, expired)}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Requested {formatDate(job.requestedAt)}
                                            {job.completedAt ? ` · Ready ${formatDate(job.completedAt)}` : ''}
                                        </p>
                                        {job.errorMessage && (
                                            <p className="text-sm text-destructive">{job.errorMessage}</p>
                                        )}
                                    </div>
                                    {job.status === 'ready' && !expired && (
                                        <Button
                                            variant="outline"
                                            onClick={() => handleDownload(job)}
                                            disabled={downloadingJobId === job.id}
                                            className="gap-2"
                                        >
                                            <Download className="h-4 w-4" aria-hidden="true" />
                                            {downloadingJobId === job.id ? 'Downloading...' : 'Download'}
                                        </Button>
                                    )}
                                    {retryable && (
                                        <Button
                                            variant="outline"
                                            onClick={() => handleRetry(job)}
                                            disabled={isRequesting}
                                        >
                                            {isRequesting ? 'Retrying...' : 'Retry'}
                                        </Button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function isStaleActiveJob(job: ExportJob): boolean {
    if (job.status !== 'queued' && job.status !== 'processing') return false;
    const timestamp = getTimestamp(job.requestedAt);
    return timestamp > 0 && Date.now() - timestamp > STALE_ACTIVE_JOB_MS;
}

function getTimestamp(value?: Timestamp): number {
    return value ? value.toMillis() : 0;
}

function formatDate(value?: Timestamp): string {
    return value ? value.toDate().toLocaleString() : 'just now';
}

function formatStatus(status: ExportJob['status'], expired: boolean): string {
    if (expired) return 'Expired';
    if (status === 'queued') return 'Queued';
    if (status === 'processing') return 'Preparing';
    if (status === 'ready') return 'Ready to download';
    return 'Failed';
}
