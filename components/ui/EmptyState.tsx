import type { ReactNode } from "react";
import { NJOutline } from "@/components/brand/NJOutline";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/5 px-6 py-16 text-center">
      <NJOutline className="pointer-events-none absolute -bottom-8 -right-6 h-40 w-auto text-skyline-300 opacity-[0.07] sm:h-52" />
      <h3 className="relative text-2xl text-white">{title}</h3>
      <p className="relative mt-2 max-w-md text-sm text-slate-400">
        {description}
      </p>
      {action && <div className="relative mt-6">{action}</div>}
    </div>
  );
}
