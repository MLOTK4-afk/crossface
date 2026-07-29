import Link from "next/link";

interface LogoProps {
  /** Rendered wordmark height in px (font-size scales with it). */
  height?: number;
  /** Footer/dark-panel variant — adds the tagline underneath. */
  withTagline?: boolean;
  className?: string;
  priority?: boolean;
}

/**
 * Renders the SNAPDOWN wordmark as styled text (stencil font + gold-to-red
 * gradient) rather than an image asset -- there's no dedicated logo mark
 * yet, and this reuses the exact treatment already validated on the hero.
 */
export function Logo({ height = 36, withTagline = false, className }: LogoProps) {
  return (
    <Link href="/" className={className}>
      <span
        className="font-stencil block uppercase leading-none"
        style={{
          fontSize: height * 0.72,
          letterSpacing: "0.01em",
          backgroundImage: "linear-gradient(90deg, #d4a017 0%, #dc2626 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Snapdown
      </span>
      {withTagline && (
        <span className="mt-1 block text-xs text-slate-400">
          New Jersey&apos;s home for wrestling
        </span>
      )}
    </Link>
  );
}
