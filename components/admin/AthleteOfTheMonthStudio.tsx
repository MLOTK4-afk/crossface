"use client";

import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { AthleteProfile } from "@/lib/types";
import { AthleteOfTheMonthCard } from "@/components/admin/AthleteOfTheMonthCard";
import { Button } from "@/components/ui/Button";
import { Label, Select, Textarea } from "@/components/ui/Field";

const EXPORT_PIXEL_RATIO = 2.45; // 440 on-screen -> ~1080 square PNG

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function AthleteOfTheMonthStudio({
  athletes,
  defaultAthleteId,
  defaultMonth,
  defaultYear,
}: {
  athletes: AthleteProfile[];
  defaultAthleteId: string;
  defaultMonth: number;
  defaultYear: number;
}) {
  const [athleteId, setAthleteId] = useState(defaultAthleteId);
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);
  const [blurb, setBlurb] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const athlete = useMemo(
    () => athletes.find((a) => a.id === athleteId) ?? athletes[0],
    [athletes, athleteId]
  );

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    setError(null);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: EXPORT_PIXEL_RATIO,
        cacheBust: true,
      });
      const link = document.createElement("a");
      const monthSlug = MONTH_NAMES[month - 1].toLowerCase();
      link.download = `statline-athlete-of-the-month-${monthSlug}-${year}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setError("Couldn't generate the image. Try again.");
    } finally {
      setDownloading(false);
    }
  }

  if (!athlete) {
    return (
      <p className="text-slate-400">No athletes available to feature yet.</p>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <div className="space-y-5">
        <div>
          <Label htmlFor="athlete-select">Athlete</Label>
          <Select
            id="athlete-select"
            value={athleteId}
            onChange={(e) => setAthleteId(e.target.value)}
          >
            {athletes.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name.trim()} — {a.sport}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="month-select">Month</Label>
            <Select
              id="month-select"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="year-input">Year</Label>
            <Select
              id="year-input"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {[year - 1, year, year + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="blurb-input">
            Custom blurb <span className="text-slate-500">(optional)</span>
          </Label>
          <Textarea
            id="blurb-input"
            rows={3}
            value={blurb}
            onChange={(e) => setBlurb(e.target.value)}
            placeholder="Leave blank to use their AI scouting tagline instead."
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button
          variant="primary"
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="w-full"
        >
          {downloading ? "Preparing…" : "Download PNG"}
        </Button>
      </div>

      <div className="flex justify-center overflow-x-auto rounded-2xl border border-white/10 bg-navy-950/60 p-8">
        <AthleteOfTheMonthCard
          ref={cardRef}
          athlete={athlete}
          month={month}
          year={year}
          blurb={blurb || undefined}
        />
      </div>
    </div>
  );
}
