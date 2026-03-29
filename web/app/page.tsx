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

      <main id="main-content" className="max-w-[1100px] mx-auto px-4">
        {/* Catchphrase — compact */}
        <div className="pt-6 pb-4">
          <p
            className="text-lg sm:text-xl font-light"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              color: "var(--color-text-heading)",
            }}
          >
            世界の良いほうだけをみよう
          </p>
        </div>

        {/* Category navigation */}
        <div className="mb-4">
          <CategoryTabs activeSlug="all" />
        </div>

        {data.last_updated && (
          <p
            className="text-[11px] mb-3 tracking-wide"
            style={{ color: "var(--color-text-faintest)" }}
          >
            最終更新: {new Date(data.last_updated).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
          </p>
        )}

        <NewsGrid articles={data.articles} />

        <footer
          className="text-center py-10 mt-10 border-t"
          style={{ borderColor: "var(--color-footer-border)" }}
        >
          <p
            className="text-sm tracking-wide"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              color: "var(--color-text-faint)",
            }}
          >
            Good News Only
          </p>
          <p
            className="text-xs mt-1.5 font-light tracking-wider"
            style={{ color: "var(--color-text-faintest)" }}
          >
            世界の良いほうだけをみよう
          </p>
        </footer>
      </main>

      <ScrollToTop />
    </>
  );
}
