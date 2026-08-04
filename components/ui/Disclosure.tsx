"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "shrink-0 text-slate-500 transition-transform duration-200",
        open && "rotate-180"
      )}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/**
 * Headless collapse: `summary` is always visible and clickable, `children`
 * expands/collapses beneath it. Animates `max-height` against the content's
 * measured `scrollHeight` rather than the CSS grid-template-rows 0fr/1fr
 * trick -- the grid technique depends on a fairly recent bit of browser
 * support for animating `fr` tracks that isn't reliably available
 * everywhere, where a measured max-height works universally.
 */
export function Disclosure({
  summary,
  defaultOpen = false,
  children,
}: {
  summary: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0
  );

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (open) {
      setMaxHeight(el.scrollHeight);
    } else {
      setMaxHeight(0);
    }
  }, [open, children]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        {summary}
        <ChevronIcon open={open} />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{ maxHeight: maxHeight === undefined ? "none" : maxHeight }}
      >
        {children}
      </div>
    </div>
  );
}
