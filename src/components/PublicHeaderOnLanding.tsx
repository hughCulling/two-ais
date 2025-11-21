"use client";
import HeaderUnified from "@/components/layout/HeaderUnified";
import { usePathname } from "next/navigation";
import { useLanguage } from '@/context/LanguageContext';

export default function PublicHeaderOnLanding() {
  const pathname = usePathname();
  const { language } = useLanguage();
  // Show header on all public pages (not starting with /app)
  if (!pathname.startsWith(`/${language.code}/app`)) {
    return <HeaderUnified />;
  }
  return null;
} 