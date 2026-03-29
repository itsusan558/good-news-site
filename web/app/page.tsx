import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import NewsGrid from "@/components/NewsGrid";
import ScrollToTop from "@/components/ScrollToTop";
import { getAllArticles } from "@/lib/articles";

export default function HomePage() {
  const data = getAllArticles();

  return (
    <>
      <Header />
      <main id="main-content" className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <CategoryTabs activeSlug="all" />
        </div>

        {data.last_updated && (
          <p
            className="text-xs mb-4"
            style={{ color: "var(--color-text-faint)" }}
          >
            最終更新: {new Date(data.last_updated).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
          </p>
        )}

        <NewsGrid articles={data.articles} />

        <footer
          className="text-center text-xs py-10 mt-10 border-t"
          style={{
            color: "var(--color-text-faint)",
            borderColor: "var(--color-footer-border)",
          }}
        >
          <p>Good News Only - AIが選んだいいニュースだけ</p>
          <p className="mt-1">Powered by Gemini + Google News RSS</p>
        </footer>
      </main>

      <ScrollToTop />
    </>
  );
}
