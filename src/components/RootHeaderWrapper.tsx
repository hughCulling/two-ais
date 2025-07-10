"use client";
import { usePathname } from "next/navigation";
import HeaderPublic from "@/components/layout/HeaderPublic";

export default function RootHeaderWrapper() {
  const pathname = usePathname();
  const isAppRoute = pathname?.startsWith("/app");
  return !isAppRoute ? <HeaderPublic /> : null;
} 