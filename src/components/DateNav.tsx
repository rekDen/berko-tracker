"use client";

import { useRouter } from "next/navigation";
import { addDaysISO, formatDateDisplay, todayISO } from "@/lib/date";

export default function DateNav({
  date,
  basePath,
  prevEntryDate,
  nextEntryDate,
}: {
  date: string;
  basePath: string;
  /** Optional: nächster früherer/späterer Tag mit Einträgen; blendet Sprung-Buttons ein. */
  prevEntryDate?: string | null;
  nextEntryDate?: string | null;
}) {
  const router = useRouter();

  function go(newDate: string) {
    router.push(`${basePath}?date=${newDate}`);
  }

  const showEntryJump = prevEntryDate !== undefined || nextEntryDate !== undefined;
  const jumpClass =
    "rounded-md border border-black/15 dark:border-white/15 px-3 py-1.5 text-xs disabled:opacity-40";

  return (
    <div className="flex flex-col gap-2">
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
      {showEntryJump && (
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={!prevEntryDate}
            onClick={() => prevEntryDate && go(prevEntryDate)}
            className={jumpClass}
          >
            ← Letzter Trainingstag
          </button>
          <button
            type="button"
            disabled={!nextEntryDate}
            onClick={() => nextEntryDate && go(nextEntryDate)}
            className={jumpClass}
          >
            Nächster Trainingstag →
          </button>
        </div>
      )}
    </div>
  );
}
