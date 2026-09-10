"use client";

import { useRouter } from "next/navigation";
import { addDaysISO, formatDateDisplay, todayISO } from "@/lib/date";

export default function DateNav({
  date,
  basePath,
}: {
  date: string;
  basePath: string;
}) {
  const router = useRouter();

  function go(newDate: string) {
    router.push(`${basePath}?date=${newDate}`);
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={() => go(addDaysISO(date, -1))}
        className="rounded-md border border-black/15 dark:border-white/15 px-3 py-1.5 text-sm"
        aria-label="Vorheriger Tag"
      >
        ←
      </button>
      <div className="text-center">
        <p className="text-sm font-medium">{formatDateDisplay(date)}</p>
        {date !== todayISO() && (
          <button
            type="button"
            onClick={() => go(todayISO())}
            className="text-xs underline underline-offset-2 text-black/60 dark:text-white/60"
          >
            Zu heute springen
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => go(addDaysISO(date, 1))}
        className="rounded-md border border-black/15 dark:border-white/15 px-3 py-1.5 text-sm"
        aria-label="Nächster Tag"
      >
        →
      </button>
    </div>
  );
}
