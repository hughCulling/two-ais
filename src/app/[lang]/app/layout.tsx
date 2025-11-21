// src/app/app/layout.tsx
'use client';
import { AuthProvider } from '@/context/AuthContext';
import HeaderUnified from '@/components/layout/HeaderUnified';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex flex-col h-full">
        <HeaderUnified />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
