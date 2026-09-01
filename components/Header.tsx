import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function Header() {
  return (
    <header className="border-b border-line bg-surface/85 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-5 py-3">
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-display text-xl font-semibold tracking-tight">{site.nameNepali}</span>
          <span className="font-display text-sm font-medium text-muted">{site.name}</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-surface-sunk hover:text-ink sm:px-3"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
