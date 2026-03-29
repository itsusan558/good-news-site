import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

interface CategoryTabsProps {
  activeSlug: string;
}

export default function CategoryTabs({ activeSlug }: CategoryTabsProps) {
  return (
    <nav
      role="tablist"
      className="flex gap-0.5 overflow-x-auto pb-1 scrollbar-hide"
      style={{ borderBottom: "1px solid var(--color-card-border)" }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat.slug === activeSlug;
        const href = cat.slug === "all" ? "/" : `/category/${cat.slug}`;
        return (
          <Link
            key={cat.slug}
            href={href}
            role="tab"
            aria-selected={isActive}
            aria-current={isActive ? "page" : undefined}
            className={`
              flex-shrink-0 px-3 py-2 min-h-[36px] text-[13px] transition-colors inline-flex items-center gap-1
              ${isActive ? "font-medium" : "font-light"}
            `}
            style={
              isActive
                ? {
                    color: "var(--color-text-heading)",
                    borderBottom: "2px solid var(--color-hero-accent)",
                  }
                : {
                    color: "var(--color-tab-text)",
                  }
            }
          >
            <span className="text-[12px]">{cat.emoji}</span>
            <span>{cat.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
