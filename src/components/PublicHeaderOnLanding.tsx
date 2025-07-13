"use client";
import HeaderPublic from "@/components/layout/HeaderPublic";
import { usePathname } from "next/navigation";

export default function PublicHeaderOnLanding() {
  const pathname = usePathname();
  // Show header on all public pages (not starting with /app)
  if (!pathname.startsWith("/app")) {
    return <HeaderPublic />;
  }
  return null;
} 