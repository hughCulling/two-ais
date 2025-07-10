"use client";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import LandingPage from "@/components/LandingPage";

const AppHome = dynamic(() => import("@/components/AppHome"), { ssr: false });

export default function Page() {
  const { user, loading } = useAuth();

  if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
            </main>
        );
    }

  if (user) {
    return <AppHome />;
  }

  return <LandingPage />;
}
