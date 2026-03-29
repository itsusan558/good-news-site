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
      <main id="main-content" className="max-w-6xl mx-auto px-5 py-8">
        <div className="mb-8">
          <CategoryTabs activeSlug="all" />
        </div>

        {data.last_updated && (
          <p
            className="text-xs mb-6"
            style={{ color: "var(--color-text-faint)" }}
          >
            最終更新: {new Date(data.last_updated).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
          </p>
        )}

        <NewsGrid articles={data.articles} />

        <footer
          className="text-center text-xs py-12 mt-14 border-t"
          style={{
            color: "var(--color-text-faint)",
            borderColor: "var(--color-footer-border)",
          }}
        >
          <p className="font-light tracking-wide">Good News Only</p>
          <p className="mt-1.5 font-light" style={{ color: "var(--color-text-faintest)" }}>
            世界の良いほうだけをみよう
          </p>
        </footer>
      </main>

      <ScrollToTop />
    </>
  );
}
