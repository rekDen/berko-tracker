"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/calories", label: "Kalorien" },
  { href: "/fitness", label: "Fitness" },
  { href: "/productivity", label: "Produktivität" },
  { href: "/kpis", label: "KPIs" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
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
  );
}
