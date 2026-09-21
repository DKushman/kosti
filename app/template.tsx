"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { commitRoute } from "@/lib/route-ready";

/** Remounts on navigation — signals when the new page segment is in the DOM. */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    commitRoute(pathname);
  }, [pathname]);

  return children;
}
