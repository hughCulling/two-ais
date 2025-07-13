"use client";
import HeaderPublic from "@/components/layout/HeaderPublic";
import { usePathname } from "next/navigation";

export default function PublicHeaderOnLanding() {
  const pathname = usePathname();
  if (pathname === "/") {
    return <HeaderPublic />;
  }
  return null;
} 