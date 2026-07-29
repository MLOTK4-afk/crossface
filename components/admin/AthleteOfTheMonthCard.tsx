import { forwardRef } from "react";
import qrcode from "qrcode-generator";
import type { AthleteProfile } from "@/lib/types";
import { getMonthTheme } from "@/lib/monthTheme";

const CARD_SHARE_ORIGIN = "https://statlinesports.net";

/** Small 5-point star, used sparingly next to the month wordmark. */
function Star({ size = 12, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 1.5l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.8 7.1-.7z" />
    </svg>
  );
}

/** "jaquevion young " -> "Jaquevion Young" -- source names come straight
 * from a free-text form field, so casing/whitespace need cleanup for a
 * printed spotlight asset in a way a profile page's normal text doesn't. */
function titleCase(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

/**
 * The monthly spotlight card -- deliberately square (1:1, 1080x1080 once
 * exported) and built around a full-bleed photo moment up top, unlike
 * PlayerCard's small banner-in-a-box + stat-grid layout. Meant for one-off
 * curation (an admin picks the athlete and month), not per-athlete
 * self-service, so it lives under components/admin rather than
 * components/profile.
 */
export const AthleteOfTheMonthCard = forwardRef<
  HTMLDivElement,
  { athlete: AthleteProfile; month: number; year: number; blurb?: string }
>(function AthleteOfTheMonthCard({ athlete, month, year, blurb }, ref) {
  const theme = getMonthTheme(month);
  const name = titleCase(athlete.name);
  const statCards = athlete.scoutingReport?.statCards ?? [];
  const statTiles = statCards.length
    ? statCards.slice(0, 3)
    : Object.entries(athlete.stats)
        .slice(0, 3)
        .map(([label, value]) => ({ label, value: String(value) }));

  const text = blurb || athlete.scoutingReport?.tagline;

  const qr = qrcode(0, "M");
  qr.addData(`${CARD_SHARE_ORIGIN}/athletes/${athlete.id}`);
  qr.make();
  const qrDataUrl = qr.createDataURL(6, 2);

  return (
    <div
      ref={ref}
      style={{
        width: 440,
        height: 440,
        position: "relative",
        zIndex: 0,
        overflow: "hidden",
        fontFamily: "var(--font-inter), sans-serif",
        color: "#fff",
        backgroundColor: "#0F172A",
        borderRadius: 20,
      }}
    >
      {/* Full-bleed photo, not a boxed-in banner -- the card's hero moment. */}
      <div style={{ position: "absolute", inset: 0 }}>
        {athlete.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={athlete.bannerUrl}
            alt=""
            crossOrigin="anonymous"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage:
                "linear-gradient(160deg, #141c33 0%, #0f172a 70%, #0a1224 100%)",
            }}
          />
        )}
      </div>

      {/* Same navy-scrim-plus-diagonal-streak recipe used site-wide on photo
       * banners, but tinted with this month's accent instead of electric-blue
       * so the card reads as "this month's" without breaking brand. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.55) 45%, rgba(15,23,42,0.97) 78%, #0F172A 100%), linear-gradient(115deg, ${theme.accentSoft} 0%, transparent 50%)`,
        }}
      />

      {/* Header: brand lockup + month wordmark, the card's dominant visual
       * signature -- where PlayerCard keeps the logo small and quiet, this
       * is meant to announce "this is a monthly feature" at a glance. */}
      <div style={{ position: "absolute", top: 20, left: 22, right: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/logo-no-tagline.png"
            alt=""
            width={20}
            height={20}
            style={{ objectFit: "contain" }}
          />
          <span
            style={{
              fontFamily: "var(--font-big-shoulders), sans-serif",
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Snapdown
          </span>
        </div>

        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <Star size={13} color={theme.accent} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: theme.accent,
            }}
          >
            Athlete of the Month
          </span>
          <Star size={13} color={theme.accent} />
        </div>
        <div
          style={{
            fontFamily: "var(--font-big-shoulders), sans-serif",
            fontWeight: 800,
            fontSize: 46,
            lineHeight: 1,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            backgroundImage: theme.gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {theme.label} {year}
        </div>
      </div>

      {/* Footer content, sitting on the settled navy at the bottom third. */}
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 18 }}>
        <div
          style={{
            fontFamily: "var(--font-big-shoulders), sans-serif",
            fontWeight: 800,
            fontSize: 26,
            lineHeight: 1.05,
            textTransform: "uppercase",
          }}
        >
          {name}
        </div>
        <div style={{ marginTop: 3, fontSize: 13, color: "#CBD5E1" }}>
          {athlete.sport}
          {athlete.positions ? ` · ${athlete.positions}` : ""}
          {athlete.jerseyNumber ? ` · #${athlete.jerseyNumber}` : ""}
        </div>
        <div style={{ marginTop: 1, fontSize: 12, color: "#64748B" }}>
          {athlete.team || athlete.region}
          {athlete.gradYear ? ` · Class of ${athlete.gradYear}` : ""}
        </div>

        {statTiles.length > 0 && (
          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "stretch",
              borderTop: `1px solid ${theme.accentSoft}`,
              borderBottom: `1px solid ${theme.accentSoft}`,
              padding: "8px 0",
            }}
          >
            {statTiles.map((t, i) => (
              <div
                key={t.label}
                style={{
                  flex: 1,
                  textAlign: "center",
                  borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.12)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-big-shoulders), sans-serif",
                    fontWeight: 800,
                    fontSize: 19,
                    color: theme.accent,
                  }}
                >
                  {t.value}
                </div>
                <div
                  style={{
                    marginTop: 1,
                    fontSize: 9,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "#64748B",
                  }}
                >
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {text && (
          <div
            style={{
              marginTop: 12,
              textAlign: "center",
              fontSize: 13,
              fontStyle: "italic",
              lineHeight: 1.4,
              color: "#E2E8F0",
            }}
          >
            &ldquo;{text}&rdquo;
          </div>
        )}

        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 10, color: "#475569" }}>statlinesports.net</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt=""
            width={28}
            height={28}
            style={{ borderRadius: 4, backgroundColor: "#fff", padding: 2 }}
          />
        </div>
      </div>
    </div>
  );
});
