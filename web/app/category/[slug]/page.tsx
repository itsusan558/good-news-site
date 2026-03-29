import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import NewsGrid from "@/components/NewsGrid";
import { getArticlesByCategory } from "@/lib/articles";
import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.filter((c) => c.slug !== "all").map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  const title = `${category.emoji} ${category.name} - Good News Only`;
  const description = `${category.name}のいいニュースだけを集めました。AIが選んだポジティブなニュースをチェックしよう。`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(slug);

  return (
    <>
      <Header />
      <main id="main-content" className="max-w-[1100px] mx-auto px-4">
        <div className="pt-6 pb-4">
          <h2
            className="text-lg sm:text-xl"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontWeight: 400,
              color: "var(--color-text-heading)",
            }}
          >
            {category.emoji} {category.name}のいいニュース
          </h2>
        </div>

        <div className="mb-4">
          <CategoryTabs activeSlug={slug} />
        </div>

        <NewsGrid articles={articles} />

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
    </>
  );
}
