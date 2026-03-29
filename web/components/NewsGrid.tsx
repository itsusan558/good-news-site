import { type Article } from "@/lib/types";
import NewsCard from "./NewsCard";

interface NewsGridProps {
  articles: Article[];
}

export default function NewsGrid({ articles }: NewsGridProps) {
  if (articles.length === 0) {
    return (
      <div
        className="text-center py-20"
        style={{ color: "var(--color-text-faint)" }}
        aria-label="ニュース読み込み中"
      >
        <p className="text-4xl mb-4">🌤</p>
        <p className="text-lg">いいニュースを収集中...</p>
        <p className="text-sm mt-2">まもなく表示されます</p>
      </div>
    );
  }

  return (
    <div
      role="feed"
      aria-live="polite"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {articles.map((article, i) => (
        <NewsCard key={article.url} article={article} index={i} />
      ))}
    </div>
  );
}
