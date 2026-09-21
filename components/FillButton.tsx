"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { setFillOrigin } from "@/lib/set-fill-origin";
import TransitionLink from "@/components/TransitionLink";

type LinkProps = ComponentPropsWithoutRef<typeof TransitionLink> & {
  href: string;
};

type NativeButtonProps = ComponentPropsWithoutRef<"button"> & {
  href?: undefined;
};

type Props = LinkProps | NativeButtonProps;

function handleFillEnter(
  e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>
) {
  setFillOrigin(e.currentTarget, e.clientX, e.clientY);
}

/** Transparent pill button; navy fill expands from the hover entry side. */
export default function FillButton(props: Props) {
  const extra = props.className ?? "";
  const className = [
    extra.includes("btn-fill") ? null : "btn-fill",
    extra,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    const { href, onMouseEnter, ...rest } = props;
    return (
      <TransitionLink
        href={href}
        className={className}
        onMouseEnter={(e) => {
          handleFillEnter(e);
          onMouseEnter?.(e);
        }}
        {...rest}
      />
    );
  }

  const { onMouseEnter, type = "button", ...rest } = props as NativeButtonProps;
  return (
    <button
      type={type}
      className={className}
      onMouseEnter={(e) => {
        handleFillEnter(e);
        onMouseEnter?.(e);
      }}
      {...rest}
    />
  );
}
