export interface Category {
  slug: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export const CATEGORIES: Category[] = [
  { slug: "all", name: "すべて", emoji: "🌈", color: "text-amber-700", bgColor: "bg-amber-100" },
  { slug: "general", name: "総合", emoji: "📰", color: "text-amber-700", bgColor: "bg-amber-50" },
  { slug: "technology", name: "テクノロジー", emoji: "🚀", color: "text-blue-700", bgColor: "bg-blue-50" },
  { slug: "science", name: "科学", emoji: "🔬", color: "text-purple-700", bgColor: "bg-purple-50" },
  { slug: "sports", name: "スポーツ", emoji: "🏆", color: "text-green-700", bgColor: "bg-green-50" },
  { slug: "entertainment", name: "エンタメ", emoji: "✨", color: "text-pink-700", bgColor: "bg-pink-50" },
  { slug: "health", name: "健康", emoji: "💚", color: "text-emerald-700", bgColor: "bg-emerald-50" },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
