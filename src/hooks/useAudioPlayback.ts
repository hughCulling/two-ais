// src/hooks/useAudioPlayback.ts
import { useState, useRef, useCallback } from 'react';
import { getVoiceById, findFallbackBrowserVoice } from '@/lib/tts_models';

interface AudioPlaybackState {
    isPlaying: boolean;
    isPaused: boolean;
    currentMessageId: string | null;
}

interface TTSConfig {
    provider: string;
    voice?: string | null;
    selectedTtsModelId?: string;
}

interface UseAudioPlaybackOptions {
    language?: string;
    onAudioEnd?: () => void;
}

export function useAudioPlayback(options: UseAudioPlaybackOptions = {}) {
    const { language = 'en', onAudioEnd } = options;
    
    const [audioState, setAudioState] = useState<AudioPlaybackState>({
        isPlaying: false,
        isPaused: false,
        currentMessageId: null,
    });

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const ttsChunkQueueRef = useRef<string[]>([]);
    const currentChunkIndexRef = useRef<number>(0);

    const handleAudioEnd = useCallback(() => {
        setAudioState({ isPlaying: false, isPaused: false, currentMessageId: null });
        if (onAudioEnd) onAudioEnd();
    }, [onAudioEnd]);

    const stopCurrentAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (utteranceRef.current) {
            window.speechSynthesis.cancel();
            utteranceRef.current = null;
        }
        ttsChunkQueueRef.current = [];
        currentChunkIndexRef.current = 0;
    }, []);

    const pauseAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        } else if (utteranceRef.current) {
            window.speechSynthesis.pause();
        }
        setAudioState(prev => ({ ...prev, isPaused: true }));
    }, []);

    const resumeAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(console.error);
        } else if (utteranceRef.current) {
            window.speechSynthesis.resume();
        }
        setAudioState(prev => ({ ...prev, isPaused: false }));
    }, []);

    const playBrowserTTS = useCallback((
        content: string,
        ttsConfig: TTSConfig,
        messageId: string,
        chunks: string[],
        onChunkStart?: (chunkIndex: number) => void
    ) => {
        stopCurrentAudio();

        ttsChunkQueueRef.current = chunks;
        currentChunkIndexRef.current = 0;

        const playChunk = (chunkIndex: number) => {
            if (chunkIndex >= ttsChunkQueueRef.current.length) {
                handleAudioEnd();
                return;
            }

            const chunk = ttsChunkQueueRef.current[chunkIndex];
            const utterance = new SpeechSynthesisUtterance(chunk);
            utteranceRef.current = utterance;

            utterance.onstart = () => {
                if (onChunkStart) onChunkStart(chunkIndex);
            };

            utterance.onend = () => {
                currentChunkIndexRef.current++;
                if (currentChunkIndexRef.current < ttsChunkQueueRef.current.length) {
                    playChunk(currentChunkIndexRef.current);
                } else {
                    handleAudioEnd();
                }
            };

            utterance.onerror = (event) => {
                if (event.error === 'canceled' || event.error === 'interrupted') {
                    console.debug(`Speech synthesis ${event.error} (expected)`);
                } else if (event.error === 'synthesis-failed') {
                    console.warn('Speech synthesis failed - this may be due to rapid playback attempts');
                } else {
                    console.error('Speech synthesis error:', event.error);
                }
                handleAudioEnd();
            };

            // Set the voice
            if (ttsConfig.voice) {
                const voiceInfo = getVoiceById('browser', ttsConfig.voice);
                let voice = null;

                if (voiceInfo) {
                    const voices = window.speechSynthesis.getVoices();
                    voice = voices.find(v => v.voiceURI === voiceInfo.providerVoiceId);
                }

                if (!voice) {
                    console.warn(`Voice not found for ID: ${ttsConfig.voice}, trying fallback`);
                    voice = findFallbackBrowserVoice(language);
                    if (voice) {
                        console.info(`Using fallback voice: ${voice.name} (${voice.lang})`);
                    }
                }

                if (voice) {
                    try {
                        utterance.voice = voice;
                    } catch (error) {
                        console.warn(`Failed to assign voice ${voice.name}, trying fallback:`, error);
                        const fallbackVoice = findFallbackBrowserVoice(language);
                        if (fallbackVoice) {
                            utterance.voice = fallbackVoice;
                            console.info(`Using fallback voice: ${fallbackVoice.name} (${fallbackVoice.lang})`);
                        }
                    }
                }
            }

            setAudioState({ isPlaying: true, isPaused: false, currentMessageId: messageId });

            // Cancel any pending speech
            if (window.speechSynthesis.speaking) {
                console.debug('Speech synthesis already speaking, cancelling first');
                window.speechSynthesis.cancel();
            }

            window.speechSynthesis.cancel();

            setTimeout(() => {
                if (window.speechSynthesis.speaking) {
                    console.warn('Speech synthesis still speaking after cancel, forcing cancel');
                    window.speechSynthesis.cancel();
                    setTimeout(() => {
                        try {
                            window.speechSynthesis.speak(utterance);
                        } catch (speakErr) {
                            console.error('Error speaking utterance after forced cancel:', speakErr);
                            handleAudioEnd();
                        }
                    }, 100);
                } else {
                    try {
                        window.speechSynthesis.speak(utterance);
                    } catch (speakErr) {
                        console.error('Error speaking utterance:', speakErr);
                        handleAudioEnd();
                    }
                }
            }, 150);
        };

        playChunk(0);
    }, [language, stopCurrentAudio, handleAudioEnd]);

    const playPreRecordedAudio = useCallback((audioUrl: string, messageId: string) => {
        stopCurrentAudio();

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = handleAudioEnd;
        audio.onpause = () => setAudioState(prev => ({ ...prev, isPaused: true }));
        audio.onplay = () => {
            setAudioState({ isPlaying: true, isPaused: false, currentMessageId: messageId });
        };

        audio.play().catch(console.error);
    }, [stopCurrentAudio, handleAudioEnd]);

    return {
        audioState,
        pauseAudio,
        resumeAudio,
        stopCurrentAudio,
        playBrowserTTS,
        playPreRecordedAudio,
        currentChunkIndex: currentChunkIndexRef.current,
    };
}
