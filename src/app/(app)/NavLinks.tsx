"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/calories", label: "Kalorien" },
  { href: "/fitness", label: "Fitness" },
  { href: "/productivity", label: "Produktivität" },
  { href: "/kpis", label: "KPIs" },
];

const FITNESS_LINKS = [
  { href: "/fitness", label: "Übersicht", exact: true },
  { href: "/fitness/auswertung", label: "Auswertung", exact: false },
  { href: "/fitness/tipps", label: "Tipps", exact: false },
];

export default function NavLinks() {
  const pathname = usePathname();
  const inFitness = pathname?.startsWith("/fitness");

  return (
    <div className="flex flex-col gap-2">
      <nav className="flex gap-1 overflow-x-auto">
        {LINKS.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-md px-3 py-1.5 text-sm ${
                active
                  ? "bg-foreground text-background"
                  : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {inFitness && (
        <nav className="flex gap-1 overflow-x-auto pl-3 border-l-2 border-black/10 dark:border-white/10">
          {FITNESS_LINKS.map((link) => {
            const active = link.exact ? pathname === link.href : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-md px-3 py-1 text-xs ${
                  active
                    ? "bg-black/10 dark:bg-white/15 font-medium"
                    : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
