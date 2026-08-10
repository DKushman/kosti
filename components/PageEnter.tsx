"use client";

import { useEffect, useRef } from "react";
import { onPageEnter } from "@/lib/page-enter";
import { gsap } from "@/lib/gsap";

type PageEnterProps = {
  children: React.ReactNode;
};

export default function PageEnter({ children }: PageEnterProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return onPageEnter(() => {
      const page = root.current;
      if (!page) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const targets = page.querySelectorAll("[data-page-enter]");
      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.07,
          ease: "power3.out",
          clearProps: "transform",
        }
      );
    });
  }, []);

  return (
    <div className="page-transition" ref={root}>
      {children}
    </div>
  );
}
