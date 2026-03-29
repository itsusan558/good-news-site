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

      {/* Hero section with catchphrase */}
      <section
        className="border-b"
        style={{ borderColor: "var(--color-header-border)" }}
      >
        <div className="max-w-6xl mx-auto px-5 py-10 sm:py-14">
          <p
            className="text-2xl sm:text-3xl lg:text-4xl leading-relaxed font-light"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              color: "var(--color-text-heading)",
            }}
          >
            世界の良いほうだけをみよう
          </p>
          <p
            className="text-sm mt-3 font-light"
            style={{ color: "var(--color-text-faint)" }}
          >
            AIが選んだポジティブなニュースをお届けします
          </p>
        </div>
      </section>

      <main id="main-content" className="max-w-6xl mx-auto px-5 py-8">
        <div className="mb-8">
          <CategoryTabs activeSlug="all" />
        </div>

        {data.last_updated && (
          <p
            className="text-[11px] mb-6 tracking-wide"
            style={{ color: "var(--color-text-faintest)" }}
          >
            最終更新: {new Date(data.last_updated).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
          </p>
        )}

        <NewsGrid articles={data.articles} />

        <footer
          className="text-center py-14 mt-16 border-t"
          style={{
            borderColor: "var(--color-footer-border)",
          }}
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
            className="text-xs mt-2 font-light tracking-wider"
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
