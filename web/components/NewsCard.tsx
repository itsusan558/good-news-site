import { type Article } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";

interface NewsCardProps {
  article: Article;
  index?: number;
}

export default function NewsCard({ article, index = 0 }: NewsCardProps) {
  const category = getCategoryBySlug(article.category);
  const delay = Math.min(index * 50, 500);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${article.title} - ${article.source}（外部サイトで開きます）`}
      className="block rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 animate-fade-in-up news-card group"
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
    >
      {/* Category accent bar */}
      <div
        className="h-0.5"
        style={{ backgroundColor: category ? `var(--color-cat-${article.category})` : "var(--color-amber-400)" }}
      />

      <div className="p-5">
        {category && (
          <span
            className="inline-flex items-center gap-1 text-[11px] tracking-wide mb-2.5"
            style={{ color: "var(--color-text-faint)" }}
          >
            <span>{category.emoji}</span>
            <span style={{ letterSpacing: "0.06em" }}>{category.name}</span>
          </span>
        )}

        <h3
          className="leading-relaxed line-clamp-3 text-[15px] group-hover:underline decoration-1 underline-offset-4"
          style={{
            fontFamily: "'Noto Serif JP', serif",
            fontWeight: 400,
            color: "var(--color-text-heading)",
            textDecorationColor: "var(--color-text-faintest)",
          }}
        >
          {article.title}
        </h3>

        {article.reason && (
          <p
            className="text-xs mt-3 inline-block px-2.5 py-0.5 rounded"
            style={{
              backgroundColor: "var(--color-tag-bg)",
              color: "var(--color-tag-text)",
            }}
          >
            {article.reason}
          </p>
        )}

        <div
          className="flex items-center gap-2 mt-4 text-[11px]"
          style={{ color: "var(--color-text-faint)" }}
        >
          <span>{article.source}</span>
          {article.date && (
            <>
              <span style={{ color: "var(--color-text-faintest)" }}>/</span>
              <span>{article.date}</span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}
