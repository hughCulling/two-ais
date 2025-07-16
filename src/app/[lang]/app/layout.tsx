// src/app/app/layout.tsx
'use client';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      {children}
    </AuthProvider>
  );
}
