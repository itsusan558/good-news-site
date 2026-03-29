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
      <main id="main-content" className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <CategoryTabs activeSlug={slug} />
        </div>

        <h2
          className="text-xl font-bold mb-4"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {category.emoji} {category.name}のいいニュース
        </h2>

        <NewsGrid articles={articles} />

        <footer
          className="text-center text-xs py-10 mt-10 border-t"
          style={{
            color: "var(--color-text-faint)",
            borderColor: "var(--color-footer-border)",
          }}
        >
          <p>Good News Only - AIが選んだいいニュースだけ</p>
        </footer>
      </main>
    </>
  );
}
