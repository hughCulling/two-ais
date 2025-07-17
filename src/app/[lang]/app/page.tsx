// src/app/app/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AppHome from '@/components/AppHome';

export default function AppHomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/'); // Redirect to landing page if not authenticated
    }
  }, [user, loading, router]);

  if (loading) return null; // or a loading spinner
  if (!user) return null;

  return <AppHome />;
}
