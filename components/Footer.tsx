"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import Marquee from "@/components/Marquee";
import { scrollToTarget } from "@/lib/lenis-store";

/**
 * Cobalt footer: ticker, giant mailto CTA whose characters roll in
 * from below, meta bar with address / socials / back-to-top.
 */
export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const cta = SplitText.create("[data-footer-cta]", {
        type: "chars",
        charsClass: "char",
        aria: "auto",
      });

      gsap.from(cta.chars, {
        yPercent: 115,
        duration: 1,
        stagger: 0.035,
        ease: "power4.out",
        scrollTrigger: {
          trigger: "[data-footer-cta]",
          start: "top 85%",
        },
      });

      gsap.from("[data-footer-meta] > *", {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.08,
        clearProps: "all",
        scrollTrigger: {
          trigger: "[data-footer-meta]",
          start: "top 95%",
        },
      });

      return () => cta.revert();
    },
    { scope: root }
  );

  const toTop = () => {
    scrollToTarget(0);
  };

  return (
    <footer className="footer" id="contact" ref={root}>
      <div className="footer__marquee">
        <Marquee
          text="Have a space in mind? Let’s build something people remember"
          speed={18}
        />
      </div>

      <a className="footer__cta" href="mailto:hello@halle.studio">
        <span className="display" data-footer-cta aria-hidden="true">
          Let’s talk
        </span>
        <span className="visually-hidden">Write us: hello@halle.studio</span>
        <span className="footer__cta-mail" aria-hidden="true">
          hello@halle.studio
        </span>
      </a>

      <div className="footer__meta" data-footer-meta>
        <address>Halle Studio GmbH · Köpenicker Str. 154 · 10997 Berlin</address>
        <nav aria-label="Social media">
          <ul className="footer__social" role="list">
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://behance.net" target="_blank" rel="noreferrer">
                Behance
              </a>
            </li>
          </ul>
        </nav>
        <button type="button" className="to-top" onClick={toTop}>
          Back to top ↑
        </button>
        <p>© 2026 Konstantin Patsalides. All rights reserved.</p>
      </div>
    </footer>
  );
}
