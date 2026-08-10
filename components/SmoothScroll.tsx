"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIntro } from "@/lib/intro-context";
import { setLenis } from "@/lib/lenis-store";

/**
 * Lenis smooth scrolling wired into GSAP's ticker so ScrollTrigger
 * and Lenis share a single rAF loop. Scrolling is locked until the
 * preloader has finished.
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const { done } = useIntro();

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReduced,
      autoRaf: false,
    });
    lenisRef.current = lenis;
    setLenis(lenis);
    lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (done) {
      lenisRef.current?.start();
      // layout can shift once fonts/images settle behind the preloader
      ScrollTrigger.refresh();
    }
  }, [done]);

  return null;
}
