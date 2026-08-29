"use client";

import Link from "next/link";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";

const PRESS =
  "relative isolate flex min-h-[3.15rem] items-center justify-center overflow-hidden rounded-full bg-[#140e0a] bg-cover bg-center text-center font-semibold uppercase tracking-[0.16em] text-[#f6ead7] shadow-[0_12px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,220,160,0.35)] transition-[transform,filter] duration-150 hover:brightness-110 active:scale-[0.96] active:brightness-90 disabled:opacity-60";

function PhotoFill() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/food/box.jpg)" }}
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-[#3a1c0c]/70 to-black/65" />
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[#e8a317]/50" />
    </>
  );
}

type Shared = {
  children: ReactNode;
  className?: string;
};

export function OrderButton({
  children,
  className = "",
  onClick,
  ...props
}: Shared & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${PRESS} ${className}`}
      {...props}
    >
      <PhotoFill />
      <span className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
        {children}
      </span>
    </button>
  );
}

export function OrderLink({
  children,
  href,
  className = "",
}: Shared & { href: string }) {
  return (
    <Link href={href} className={`${PRESS} ${className}`}>
      <PhotoFill />
      <span className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
        {children}
      </span>
    </Link>
  );
}

export function OrderSubmit({
  children,
  className = "",
  disabled,
}: Shared & { disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${PRESS} w-full py-4 text-sm ${className}`}
    >
      <PhotoFill />
      <span className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
        {children}
      </span>
    </button>
  );
}

export function useOrderPulse() {
  const [added, setAdded] = useState(false);

  function pulse() {
    setAdded(true);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(18);
    }
    window.setTimeout(() => setAdded(false), 1600);
  }

  return { added, pulse };
}
