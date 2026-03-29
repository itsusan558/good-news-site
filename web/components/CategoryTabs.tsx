import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

interface CategoryTabsProps {
  activeSlug: string;
}

export default function CategoryTabs({ activeSlug }: CategoryTabsProps) {
  return (
    <nav
      role="tablist"
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      style={{ maskImage: "linear-gradient(to right, black 90%, transparent)" }}
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
              flex-shrink-0 px-5 py-2.5 min-h-[44px] rounded-full text-sm transition-all inline-flex items-center
              ${
                isActive
                  ? `${cat.bgColor} ${cat.color} font-medium`
                  : ""
              }
            `}
            style={
              isActive
                ? undefined
                : {
                    backgroundColor: "var(--color-tab-bg)",
                    color: "var(--color-tab-text)",
                  }
            }
          >
            {cat.emoji} {cat.name}
          </Link>
        );
      })}
    </nav>
  );
}
