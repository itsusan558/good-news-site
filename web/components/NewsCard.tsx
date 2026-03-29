import { type Article } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";

interface NewsCardProps {
  article: Article;
  index?: number;
}

export default function NewsCard({ article, index = 0 }: NewsCardProps) {
  const category = getCategoryBySlug(article.category);
  const delay = Math.min(index * 60, 600);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${article.title} - ${article.source}（外部サイトで開きます）`}
      className="block rounded-xl p-5 sm:p-6 transition-all hover:-translate-y-0.5 animate-fade-in-up news-card"
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
    >
      <div className="flex items-start gap-3">
        {category && (
          <span className="text-2xl flex-shrink-0 mt-0.5">
            {category.emoji}
          </span>
        )}
        <div className="min-w-0">
          <h3
            className="font-medium leading-snug line-clamp-3 text-sm sm:text-base"
            style={{ color: "var(--color-text-heading)" }}
          >
            {article.title}
          </h3>

          {article.reason && (
            <p
              className="text-xs mt-2.5 inline-block px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: "var(--color-tag-bg)",
                color: "var(--color-tag-text)",
              }}
            >
              {article.reason}
            </p>
          )}

          <div
            className="flex items-center gap-3 mt-3 text-xs"
            style={{ color: "var(--color-text-faint)" }}
          >
            <span>{article.source}</span>
            {article.date && (
              <>
                <span>-</span>
                <span>{article.date}</span>
                <span style={{ color: "var(--color-text-faintest)" }}>↗</span>
              </>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
