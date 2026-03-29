"""事前フィルタ: 明らかにネガティブなニュースをAPI送信前に除外"""

from __future__ import annotations

import logging

from rss_fetcher import Article

logger = logging.getLogger(__name__)

NEGATIVE_KEYWORDS: list[str] = [
    "死亡", "殺人", "逮捕", "容疑", "事故", "事件",
    "火災", "地震", "津波", "災害", "被害",
    "戦争", "紛争", "攻撃", "爆撃", "空爆",
    "詐欺", "横領", "不正", "汚職", "贈賄",
    "虐待", "暴行", "強盗", "窃盗",
    "リストラ", "倒産", "破産",
    "訃報", "死去", "急死",
]


def prefilter_articles(articles: list[Article]) -> tuple[list[Article], int]:
    """ネガティブキーワードを含む記事を除外。(filtered, removed_count)を返す"""
    filtered: list[Article] = []
    removed: int = 0
    for article in articles:
        title: str = article.title if hasattr(article, "title") else ""
        if any(kw in title for kw in NEGATIVE_KEYWORDS):
            removed += 1
            logger.debug("Pre-filtered: %s", title)
            continue
        filtered.append(article)
    return filtered, removed
