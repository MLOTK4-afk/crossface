import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  /** Rendered mark height in px. Wordmark font-size scales with it. */
  height?: number;
  /** Footer/dark-panel variant — adds the tagline underneath. */
  withTagline?: boolean;
  className?: string;
  priority?: boolean;
}

/**
 * Renders the Snapdown mark: the Scout Owl icon (scope-reticle eyes) beside
 * the SNAPDOWN wordmark in the stencil font + gold-to-red gradient.
 */
export function Logo({
  height = 36,
  withTagline = false,
  className,
  priority = true,
}: LogoProps) {
  return (
    <Link href="/" className={className}>
      <span className="flex items-center gap-2">
        <Image
          src="/logos/snapdown-logo.png"
          alt="Snapdown"
          width={height}
          height={height}
          priority={priority}
          className="rounded-md"
        />
        <span
          className="font-stencil block uppercase leading-none"
          style={{
            fontSize: height * 0.62,
            letterSpacing: "0.01em",
            backgroundImage: "linear-gradient(90deg, #d4a017 0%, #dc2626 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Snapdown
        </span>
      </span>
      {withTagline && (
        <span className="mt-1 block text-xs text-slate-400">
          New Jersey&apos;s home for wrestling
        </span>
      )}
    </Link>
  );
}
