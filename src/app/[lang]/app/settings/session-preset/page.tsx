'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { loadSessionPreset, deleteSessionPreset, SessionPreset } from '@/lib/firebase/sessionPreset';
import { getLLMInfoById } from '@/lib/models';
import { getTTSProviderInfoById } from '@/lib/tts_models';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

export default function SessionPresetPage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const { toast } = useToast();
    const [preset, setPreset] = useState<SessionPreset | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        const loadPreset = async () => {
            if (user) {
                try {
                    const loadedPreset = await loadSessionPreset(user.uid);
                    setPreset(loadedPreset);
                } catch (error) {
                    console.error('Error loading preset:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadPreset();
    }, [user]);

    const handleDelete = async () => {
        if (!user) return;

        try {
            await deleteSessionPreset(user.uid);
            setPreset(null);
            setShowDeleteDialog(false);
            toast({
                title: t?.sessionSetupForm?.presetDeleted || "Preset deleted",
                description: "Your session preset has been deleted",
            });
        } catch (error) {
            console.error('Error deleting preset:', error);
            toast({
                title: "Error",
                description: "Failed to delete preset",
            });
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">{t?.settings?.sessionPreset?.title || 'Session Preset'}</h1>
                    <p className="text-muted-foreground mt-2">
                        {t?.settings?.sessionPreset?.description || 'Manage your saved session configuration preset.'}
                    </p>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">{t?.common?.loading || 'Loading...'}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!preset) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">{t?.settings?.sessionPreset?.title || 'Session Preset'}</h1>
                    <p className="text-muted-foreground mt-2">
                        {t?.settings?.sessionPreset?.description || 'Manage your saved session configuration preset.'}
                    </p>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">{t?.settings?.sessionPreset?.noPreset || 'No preset saved'}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            You can save a preset from the session setup form by clicking the "Save Preset" button.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const agentAModel = getLLMInfoById(preset.agentA_llm);
    const agentBModel = getLLMInfoById(preset.agentB_llm);
    const agentAProvider = getTTSProviderInfoById(preset.agentA_tts.provider as any);
    const agentBProvider = getTTSProviderInfoById(preset.agentB_tts.provider as any);

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">{t?.settings?.sessionPreset?.title || 'Session Preset'}</h1>
                    <p className="text-muted-foreground mt-2">
                        {t?.settings?.sessionPreset?.description || 'Manage your saved session configuration preset.'}
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Saved Configuration</CardTitle>
                        {preset.savedAt && (
                            <CardDescription>
                                {t?.settings?.sessionPreset?.savedAt || 'Saved on'}: {new Date(preset.savedAt).toLocaleString()}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold text-sm mb-1">{t?.settings?.sessionPreset?.agentAModel || 'Agent A Model'}</h3>
                                <p className="text-sm text-muted-foreground">{agentAModel?.name || preset.agentA_llm}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm mb-1">{t?.settings?.sessionPreset?.agentBModel || 'Agent B Model'}</h3>
                                <p className="text-sm text-muted-foreground">{agentBModel?.name || preset.agentB_llm}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-sm mb-1">{t?.settings?.sessionPreset?.ttsEnabled || 'TTS Enabled'}</h3>
                            <p className="text-sm text-muted-foreground">{preset.ttsEnabled ? 'Yes' : 'No'}</p>
                        </div>

                        {preset.ttsEnabled && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-sm mb-1">{t?.settings?.sessionPreset?.agentATTS || 'Agent A TTS'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {agentAProvider?.name || preset.agentA_tts.provider}
                                        {preset.agentA_tts.voice && ` - ${preset.agentA_tts.voice}`}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm mb-1">{t?.settings?.sessionPreset?.agentBTTS || 'Agent B TTS'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {agentBProvider?.name || preset.agentB_tts.provider}
                                        {preset.agentB_tts.voice && ` - ${preset.agentB_tts.voice}`}
                                    </p>
                                </div>
                            </div>
                        )}

                        {preset.initialSystemPrompt && (
                            <div>
                                <h3 className="font-semibold text-sm mb-1">{t?.settings?.sessionPreset?.initialPrompt || 'Initial System Prompt'}</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{preset.initialSystemPrompt}</p>
                            </div>
                        )}

                        <div className="pt-4">
                            <Button
                                variant="destructive"
                                onClick={() => setShowDeleteDialog(true)}
                                className="flex items-center gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                {t?.settings?.sessionPreset?.deletePreset || 'Delete Preset'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t?.settings?.sessionPreset?.deletePreset || 'Delete Preset'}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t?.settings?.sessionPreset?.confirmDelete || 'Are you sure you want to delete your saved preset?'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t?.common?.cancel || 'Cancel'}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            {t?.common?.delete || 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
