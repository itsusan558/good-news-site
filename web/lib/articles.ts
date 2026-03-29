import { type ArticleData, type Article } from "./types";
import fs from "fs";
import path from "path";

function loadArticleData(): ArticleData {
  const filePath = path.join(process.cwd(), "public", "data", "articles.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as ArticleData;
    if (!Array.isArray(parsed.articles)) {
      console.warn("[articles] articles.json is missing 'articles' array");
      return { last_updated: "", total: 0, articles: [] };
    }
    return parsed;
  } catch (err) {
    console.warn("[articles] Failed to load articles.json:", err);
    return { last_updated: "", total: 0, articles: [] };
  }
}

export function getAllArticles(): ArticleData {
  return loadArticleData();
}

export function getArticlesByCategory(category: string): Article[] {
  const data = loadArticleData();
  if (category === "all") return data.articles;
  return data.articles.filter((a) => a.category === category);
}
