import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

interface CategoryTabsProps {
  activeSlug: string;
}

export default function CategoryTabs({ activeSlug }: CategoryTabsProps) {
  return (
    <nav
      role="tablist"
      className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide"
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
              flex-shrink-0 px-4 py-2 min-h-[44px] rounded-lg text-sm transition-all inline-flex items-center gap-1.5
              ${isActive ? "font-medium" : "font-light"}
            `}
            style={
              isActive
                ? {
                    backgroundColor: "var(--color-card-bg)",
                    color: "var(--color-text-heading)",
                    boxShadow: "0 1px 3px var(--color-card-shadow)",
                  }
                : {
                    color: "var(--color-tab-text)",
                  }
            }
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
