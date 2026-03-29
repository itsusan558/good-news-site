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
      className="block py-5 animate-fade-in group"
      style={{ borderBottom: "2px solid var(--color-card-border)" }}
    >
      {category && (
        <span
          className="inline-flex items-center gap-1.5 text-[11px] tracking-wide mb-2"
          style={{ color: `var(--color-cat-${article.category})` }}
        >
          <span>{category.emoji}</span>
          <span style={{ letterSpacing: "0.06em", fontWeight: 500 }}>
            {category.name}
          </span>
        </span>
      )}

      <h2
        className="text-xl sm:text-2xl leading-snug line-clamp-3 group-hover:underline decoration-1 underline-offset-4"
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
          className="text-[13px] mt-2 font-light line-clamp-1"
          style={{ color: "var(--color-tag-text)" }}
        >
          {article.reason}
        </p>
      )}

      <div
        className="flex items-center gap-3 mt-3 text-[11px]"
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
          className="ml-auto text-[11px] tracking-wide"
          style={{ color: "var(--color-text-faintest)" }}
        >
          外部サイトで読む ↗
        </span>
      </div>
    </a>
  );
}
