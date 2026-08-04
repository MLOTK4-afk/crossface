"use client";

import { ScoutSearch } from "@/components/scout/ScoutSearch";

export default function ScoutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-white sm:text-4xl">Scout</h1>
      <p className="mt-2 text-slate-400">
        Look up any wrestler on Crossface — their record, weight class, and
        whether anyone here has already faced them.
      </p>
      <div className="mt-6">
        <ScoutSearch />
      </div>
    </div>
  );
}
