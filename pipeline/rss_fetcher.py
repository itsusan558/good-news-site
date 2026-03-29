"""Google News RSS フィードの取得・パース（MONCA rss.py ベース）"""

import asyncio
import base64
import email.utils
import html as _html
import re
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from urllib.parse import urlparse

import httpx

JST = timezone(timedelta(hours=9))
CONCURRENCY = 10
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; GoodNewsBot/1.0)"}

# Google News カテゴリ別 RSS URL
CATEGORY_FEEDS: dict[str, str] = {
    "general": "https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja",
    "technology": "https://news.google.com/rss/search?q=%E3%83%86%E3%82%AF%E3%83%8E%E3%83%AD%E3%82%B8%E3%83%BC+OR+IT+OR+AI&hl=ja&gl=JP&ceid=JP:ja",
    "science": "https://news.google.com/rss/search?q=%E7%A7%91%E5%AD%A6+OR+%E7%A0%94%E7%A9%B6+OR+%E5%AE%87%E5%AE%99&hl=ja&gl=JP&ceid=JP:ja",
    "sports": "https://news.google.com/rss/search?q=%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84+OR+%E5%84%AA%E5%8B%9D+OR+%E4%B8%96%E7%95%8C%E8%A8%98%E9%8C%B2&hl=ja&gl=JP&ceid=JP:ja",
    "entertainment": "https://news.google.com/rss/search?q=%E3%82%A8%E3%83%B3%E3%82%BF%E3%83%A1+OR+%E6%98%A0%E7%94%BB+OR+%E9%9F%B3%E6%A5%BD&hl=ja&gl=JP&ceid=JP:ja",
    "health": "https://news.google.com/rss/search?q=%E5%81%A5%E5%BA%B7+OR+%E5%8C%BB%E7%99%82+OR+%E6%B2%BB%E7%99%82&hl=ja&gl=JP&ceid=JP:ja",
}


@dataclass(frozen=True)
class Article:
    title: str
    url: str
    source: str
    date: str
    raw_date: str
    category: str


def _decode_google_news_url(gnews_url: str) -> str | None:
    try:
        if "/articles/" not in gnews_url:
            return None
        encoded = gnews_url.split("/articles/")[1].split("?")[0]
        pad = 4 - len(encoded) % 4
        if pad != 4:
            encoded += "=" * pad
        decoded = base64.urlsafe_b64decode(encoded)
        m = re.search(rb"https?://[\x21-\x7e]+", decoded)
        if m:
            url = m.group(0).decode("ascii", errors="ignore")
            if url.startswith("http") and "news.google.com" not in url:
                return url
    except Exception:
        pass
    return None


def _extract_url_from_description(desc_text: str) -> str | None:
    if not desc_text:
        return None
    unescaped = _html.unescape(desc_text)
    for m in re.finditer(r'href=["\']([^"\']+)["\']', unescaped):
        url = m.group(1)
        if url.startswith("http") and "news.google.com" not in url:
            return url
    return None


def _parse_date(s: str) -> datetime | None:
    if not s:
        return None
    try:
        return email.utils.parsedate_to_datetime(s).astimezone(timezone.utc)
    except Exception:
        pass
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(timezone.utc)
    except Exception:
        pass
    return None


def _parse_feed(content: str, category: str) -> list[Article]:
    articles: list[Article] = []
    try:
        root = ET.fromstring(content)
    except ET.ParseError:
        return articles

    channel = root.find("channel")
    items = channel.findall("item") if channel is not None else []

    cutoff = datetime.now(timezone.utc) - timedelta(days=2)

    for item in items:
        title_el = item.find("title")
        title = (title_el.text or "").strip() if title_el is not None else ""

        link_el = item.find("link")
        link = ""
        if link_el is not None:
            link = (link_el.text or "").strip() or link_el.get("href", "").strip()

        if not title or not link:
            continue

        if "news.google.com" in link:
            actual = _decode_google_news_url(link)
            if not actual:
                desc_el = item.find("description")
                desc_text = (desc_el.text or "") if desc_el is not None else ""
                actual = _extract_url_from_description(desc_text)
            if actual:
                link = actual

        pub_el = item.find("pubDate")
        raw_date_str = (pub_el.text or "").strip() if pub_el is not None else ""
        published = _parse_date(raw_date_str)

        if published and published < cutoff:
            continue

        source_el = item.find("source")
        source_name = ""
        if source_el is not None and source_el.text:
            source_name = source_el.text.strip()
        if not source_name:
            source_name = urlparse(link).netloc

        date_str = ""
        if published:
            date_str = published.astimezone(JST).strftime("%Y/%m/%d %H:%M")

        articles.append(Article(
            title=title,
            url=link,
            source=source_name,
            date=date_str,
            raw_date=published.isoformat() if published else "",
            category=category,
        ))

    return articles


async def _fetch(client: httpx.AsyncClient, url: str) -> str | None:
    try:
        resp = await client.get(url, timeout=15)
        if resp.status_code == 200:
            return resp.text
    except Exception:
        pass
    return None


async def fetch_all_categories() -> list[Article]:
    seen_urls: set[str] = set()
    all_articles: list[Article] = []
    sem = asyncio.Semaphore(CONCURRENCY)

    async with httpx.AsyncClient(headers=HEADERS, follow_redirects=True) as client:

        async def fetch_one(category: str, url: str) -> list[Article]:
            async with sem:
                content = await _fetch(client, url)
                if not content:
                    return []
                return _parse_feed(content, category)

        tasks = [
            asyncio.create_task(fetch_one(cat, url))
            for cat, url in CATEGORY_FEEDS.items()
        ]
        results = await asyncio.gather(*tasks)

    for articles in results:
        for a in articles:
            if a.url not in seen_urls:
                seen_urls.add(a.url)
                all_articles.append(a)

    return all_articles
