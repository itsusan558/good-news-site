import { type Article } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";

interface NewsCardProps {
  article: Article;
  index?: number;
}

export default function NewsCard({ article, index = 0 }: NewsCardProps) {
  const category = getCategoryBySlug(article.category);
  const delay = Math.min(index * 30, 300);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${article.title} - ${article.source}（外部サイトで開きます）`}
      className="block py-4 transition-colors animate-fade-in-up news-list-item group"
      style={{
        "--delay": `${delay}ms`,
        borderBottom: "1px solid var(--color-card-border)",
      } as React.CSSProperties}
    >
      <div className="flex items-start gap-3">
        {/* Category accent dot */}
        <span
          className="mt-[9px] flex-shrink-0 w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: category
              ? `var(--color-cat-${article.category})`
              : "var(--color-amber-400)",
          }}
        />

        <div className="flex-1 min-w-0">
          <h3
            className="text-[15px] leading-relaxed line-clamp-2 group-hover:underline decoration-1 underline-offset-4"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontWeight: 400,
              color: "var(--color-text-heading)",
              textDecorationColor: "var(--color-text-faintest)",
            }}
          >
            {article.title}
          </h3>

          <div
            className="flex items-center gap-2 mt-1.5 text-[11px] flex-wrap"
            style={{ color: "var(--color-text-faint)" }}
          >
            {category && (
              <>
                <span
                  className="inline-flex items-center gap-0.5"
                  style={{ color: `var(--color-cat-${article.category})` }}
                >
                  <span className="text-[10px]">{category.emoji}</span>
                  <span style={{ letterSpacing: "0.04em" }}>{category.name}</span>
                </span>
                <span style={{ color: "var(--color-text-faintest)" }}>|</span>
              </>
            )}
            <span>{article.source}</span>
            {article.date && (
              <>
                <span style={{ color: "var(--color-text-faintest)" }}>|</span>
                <span>{article.date}</span>
              </>
            )}
          </div>

          {article.reason && (
            <p
              className="text-[11px] mt-1.5 line-clamp-1"
              style={{ color: "var(--color-tag-text)" }}
            >
              {article.reason}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
