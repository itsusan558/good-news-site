import { type Article } from "@/lib/types";
import HeroCard from "./HeroCard";
import NewsCard from "./NewsCard";

interface NewsGridProps {
  articles: Article[];
}

export default function NewsGrid({ articles }: NewsGridProps) {
  if (articles.length === 0) {
    return (
      <div
        className="text-center py-24"
        style={{ color: "var(--color-text-faint)" }}
        aria-label="ニュース読み込み中"
      >
        <p className="text-4xl mb-4">🌤</p>
        <p className="text-base font-light">いいニュースを収集中...</p>
        <p className="text-sm mt-2 font-light">まもなく表示されます</p>
      </div>
    );
  }

  const [hero, ...rest] = articles;

  // Split remaining articles into 2 columns on desktop
  const midpoint = Math.ceil(rest.length / 2);
  const leftCol = rest.slice(0, midpoint);
  const rightCol = rest.slice(midpoint);

  return (
    <div role="feed" aria-live="polite">
      {/* Hero — featured first article */}
      <HeroCard article={hero} />

      {/* 2-column list on desktop, single column on mobile */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10">
          <div>
            {leftCol.map((article, i) => (
              <NewsCard key={article.url} article={article} index={i} />
            ))}
          </div>
          <div
            className="lg:border-l"
            style={{ borderColor: "var(--color-card-border)" }}
          >
            <div className="lg:pl-10">
              {rightCol.map((article, i) => (
                <NewsCard
                  key={article.url}
                  article={article}
                  index={i + midpoint}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
