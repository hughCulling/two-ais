"use client";
import { usePathname } from "next/navigation";
import HeaderUnified from "@/components/layout/HeaderUnified";

export default function RootHeaderWrapper() {
  const pathname = usePathname();
  const isAppRoute = pathname?.startsWith("/app");
  return !isAppRoute ? <HeaderUnified /> : null;
} 