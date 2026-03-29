export interface Article {
  title: string;
  url: string;
  source: string;
  date: string;
  raw_date: string;
  category: string;
  reason: string;
}

export interface ArticleData {
  last_updated: string;
  total: number;
  articles: Article[];
}
