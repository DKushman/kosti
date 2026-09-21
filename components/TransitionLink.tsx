"use client";

import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { setFillOrigin } from "@/lib/set-fill-origin";
import { useNavigation } from "@/lib/navigation";
import { withBasePath } from "@/lib/site-path";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  source?: "page" | "menu";
};

/**
 * Anchor that routes through the colour curtain. Plain <a> semantics
 * (real href, works without JS, middle-click opens a tab).
 */
const TransitionLink = forwardRef<HTMLAnchorElement, Props>(function TransitionLink(
  {
  href,
  source = "page",
  onClick,
  onMouseEnter,
  className,
  children,
  ...rest
  },
  ref
) {
  const { navigate } = useNavigation();
  const isFill =
    typeof className === "string" && className.includes("btn-fill");

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    navigate(href, source);
  };

  return (
    <a
      ref={ref}
      href={withBasePath(href)}
      className={className}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (isFill) setFillOrigin(e.currentTarget, e.clientX, e.clientY);
        onMouseEnter?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
});

export default TransitionLink;
