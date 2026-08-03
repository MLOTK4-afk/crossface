function BoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
}

const STATS = [
  {
    icon: BoltIcon,
    value: "Free",
    label: "to build your profile",
    badgeClass: "border-electric-500/30 bg-electric-500/10 text-electric-500",
  },
  {
    icon: LayersIcon,
    value: "4",
    label: "levels supported",
    badgeClass: "border-electric-500/30 bg-electric-500/10 text-electric-500",
  },
  {
    // Tertiary accent: the one orange-flavored touch on the homepage,
    // marking Fit Score as the standout feature rather than adding a third
    // brand hue.
    icon: TargetIcon,
    value: "Fit Score",
    label: "on every profile",
    badgeClass:
      "border-orange-400/40 bg-gradient-to-br from-orange-500/20 to-amber-500/20 text-orange-300",
  },
];

export function HeroStats() {
  return (
    <div className="hero-stats mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
      {STATS.map(({ icon: Icon, value, label, badgeClass }) => (
        <div key={label} className="flex items-center gap-2.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${badgeClass}`}
          >
            <Icon />
          </span>
          <span className="text-left leading-tight">
            <span className="block font-heading text-base text-white">
              {value}
            </span>
            <span className="block text-xs text-slate-400">{label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
