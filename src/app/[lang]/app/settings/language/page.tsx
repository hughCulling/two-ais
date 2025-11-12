'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LanguageSettingsPage() {
    const { t, loading: translationLoading } = useTranslation();
    const { language } = useLanguage();
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/');
        }
    }, [user, loading, router]);

    if (loading || translationLoading || !t) return null;
    if (!user) return null;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{t.settings.language.title}</h2>
                <p className="text-muted-foreground">
                    {t.settings.language.description}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t.settings.language.title}</CardTitle>
                    <CardDescription>
                        {t.settings.language.conversationLanguageDescription}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t.settings.language.conversationLanguage}
                        </label>
                        <LanguageSelector showIcon={true} className="w-full" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">{t.settings.language.supportedLanguages}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <div 
                                    key={lang.code}
                                    className={`flex items-center space-x-2 p-2 rounded-md border ${
                                        lang.code === language.code 
                                            ? 'border-primary bg-primary/10' 
                                            : 'border-border'
                                    }`}
                                >
                                    {lang.code === language.code && (
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                    )}
                                    <span className="text-sm">
                                        {lang.nativeName}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 