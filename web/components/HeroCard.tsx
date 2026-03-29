import { type Article } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";

interface HeroCardProps {
  article: Article;
}

export default function HeroCard({ article }: HeroCardProps) {
  const category = getCategoryBySlug(article.category);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${article.title} - ${article.source}（外部サイトで開きます）`}
      className="block rounded-2xl p-6 sm:p-8 transition-all hover:-translate-y-0.5 animate-fade-in-up news-card group"
      style={{
        "--delay": "0ms",
        borderLeft: `3px solid var(--color-hero-accent)`,
      } as React.CSSProperties}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          {category && (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide mb-3"
              style={{ color: "var(--color-tag-text)" }}
            >
              <span>{category.emoji}</span>
              <span className="uppercase" style={{ letterSpacing: "0.08em" }}>
                {category.name}
              </span>
            </span>
          )}
          <h2
            className="text-lg sm:text-xl lg:text-2xl leading-snug line-clamp-3 group-hover:underline decoration-1 underline-offset-4"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontWeight: 500,
              color: "var(--color-text-heading)",
              textDecorationColor: "var(--color-text-faintest)",
            }}
          >
            {article.title}
          </h2>

          {article.reason && (
            <p
              className="text-sm mt-3 font-light"
              style={{ color: "var(--color-tag-text)" }}
            >
              {article.reason}
            </p>
          )}

          <div
            className="flex items-center gap-3 mt-4 text-xs"
            style={{ color: "var(--color-text-faint)" }}
          >
            <span className="font-medium">{article.source}</span>
            {article.date && (
              <>
                <span style={{ color: "var(--color-text-faintest)" }}>|</span>
                <span>{article.date}</span>
              </>
            )}
            <span
              className="ml-auto text-xs tracking-wide"
              style={{ color: "var(--color-text-faintest)" }}
            >
              外部サイトで読む ↗
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
