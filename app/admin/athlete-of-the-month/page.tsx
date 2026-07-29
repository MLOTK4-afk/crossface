import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { store } from "@/lib/storage";
import { AthleteOfTheMonthStudio } from "@/components/admin/AthleteOfTheMonthStudio";

export const metadata: Metadata = {
  title: "Athlete of the Month | Snapdown Admin",
};

export const dynamic = "force-dynamic";

export default async function AthleteOfTheMonthPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "admin") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-3xl text-white">Access Restricted</h1>
        <p className="mt-2 text-slate-400">
          The admin dashboard is only available to administrator accounts.
        </p>
      </div>
    );
  }

  const allAthletes = await store.listAthletes();
  const athletes = allAthletes
    .filter((a) => a.published && !a.isExample)
    .sort((a, b) => a.name.trim().localeCompare(b.name.trim()));

  const now = new Date();
  const featured = athletes.find((a) =>
    a.name.trim().toLowerCase().startsWith("jaquevion")
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-white">Athlete of the Month</h1>
      <p className="mt-1 text-slate-400">
        Pick an athlete and month, then export the card to post.
      </p>

      <div className="mt-8">
        <AthleteOfTheMonthStudio
          athletes={athletes}
          defaultAthleteId={featured?.id ?? athletes[0]?.id ?? ""}
          defaultMonth={now.getMonth() + 1}
          defaultYear={now.getFullYear()}
        />
      </div>
    </div>
  );
}
