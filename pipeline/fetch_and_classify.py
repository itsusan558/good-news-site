"""メインパイプライン: RSS取得 → 事前フィルタ → Claude分類 → JSON出力"""

import asyncio
import json
import logging
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from rss_fetcher import fetch_all_categories
from prefilter import prefilter_articles
from gemini_classifier import classify_articles

JST = timezone(timedelta(hours=9))
MIN_ARTICLES_THRESHOLD = 5

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)


def merge_with_existing(
    new_articles: list[dict],
    output_path: Path,
    max_age_days: int = 3,
) -> list[dict]:
    existing: list[dict] = []
    if output_path.exists():
        try:
            data = json.loads(output_path.read_text(encoding="utf-8"))
            existing = data.get("articles", [])
        except (json.JSONDecodeError, KeyError):
            pass

    cutoff = datetime.now(timezone.utc) - timedelta(days=max_age_days)
    seen_urls: set[str] = set()
    merged: list[dict] = []

    for article in new_articles:
        url = article["url"]
        if url not in seen_urls:
            seen_urls.add(url)
            merged.append(article)

    for article in existing:
        url = article.get("url", "")
        if url in seen_urls:
            continue
        raw_date = article.get("raw_date", "")
        if raw_date:
            try:
                dt = datetime.fromisoformat(raw_date)
                if dt < cutoff:
                    continue
            except ValueError:
                pass
        seen_urls.add(url)
        merged.append(article)

    merged.sort(key=lambda a: a.get("raw_date", ""), reverse=True)
    return merged


def main() -> None:
    output_path = Path(
        os.environ.get(
            "OUTPUT_PATH",
            str(Path(__file__).resolve().parent.parent / "web" / "public" / "data" / "articles.json"),
        )
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        _run_pipeline(output_path)
    except Exception:
        logger.exception("Pipeline failed with unhandled exception")
        sys.exit(1)


def _run_pipeline(output_path: Path) -> None:
    # --- Fetch ---
    logger.info("Fetching RSS feeds...")
    articles = asyncio.run(fetch_all_categories())
    logger.info("Fetched %d articles from all categories", len(articles))

    if not articles:
        logger.warning("No articles fetched — keeping existing data intact")
        return

    # --- Pre-filter ---
    filtered, removed_count = prefilter_articles(articles)
    logger.info(
        "Pre-filter: %d removed, %d remaining (of %d fetched)",
        removed_count,
        len(filtered),
        len(articles),
    )

    if not filtered:
        logger.warning("All articles removed by pre-filter — keeping existing data intact")
        return

    # --- Classify ---
    logger.info("Classifying %d articles with Claude...", len(filtered))
    positive = classify_articles(filtered)
    logger.info("Found %d positive articles", len(positive))

    # --- Merge ---
    merged = merge_with_existing(positive, output_path)

    if len(merged) < MIN_ARTICLES_THRESHOLD:
        logger.warning(
            "Only %d articles after merge (threshold=%d) — keeping existing data intact",
            len(merged),
            MIN_ARTICLES_THRESHOLD,
        )
        return

    # --- Write ---
    now = datetime.now(JST)
    output = {
        "last_updated": now.isoformat(),
        "total": len(merged),
        "articles": merged,
    }

    output_path.write_text(
        json.dumps(output, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    logger.info("Saved %d articles to %s", len(merged), output_path)

    # --- Summary statistics ---
    categories: dict[str, int] = {}
    for a in merged:
        cat = a.get("category", "unknown")
        categories[cat] = categories.get(cat, 0) + 1

    logger.info("=== Pipeline Summary ===")
    logger.info("  Fetched:      %d", len(articles))
    logger.info("  Pre-filtered: %d removed", removed_count)
    logger.info("  Classified:   %d sent to Claude", len(filtered))
    logger.info("  Positive:     %d", len(positive))
    logger.info("  Final output: %d (after merge with existing)", len(merged))
    for cat, count in sorted(categories.items()):
        logger.info("  [%s] %d articles", cat, count)


if __name__ == "__main__":
    main()
