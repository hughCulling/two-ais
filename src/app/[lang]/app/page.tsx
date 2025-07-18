// src/app/app/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import AppHome from '@/components/AppHome';

export default function AppHomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/${language.code}`); // Redirect to language landing page if not authenticated
    }
  }, [user, loading, router, language.code]);

  if (loading) return null; // or a loading spinner
  if (!user) return null;

  return <AppHome />;
}
