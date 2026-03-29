"""Claude API を使ったニュース感情分類"""

import json
import logging
import os
import time
from dataclasses import asdict

import anthropic

from rss_fetcher import Article

logger = logging.getLogger(__name__)

BATCH_SIZE = 20
MODEL_NAME = "claude-haiku-4-5-20251001"
RETRY_MAX = 3
RETRY_DELAY = 2  # base delay in seconds; actual = RETRY_DELAY * 2^attempt

# Cost estimation (Haiku 4.5)
COST_PER_MILLION_INPUT = 0.80   # USD
COST_PER_MILLION_OUTPUT = 4.00  # USD

SYSTEM_PROMPT = """あなたは日本語ニュースの感情分類器です。
各ニュースタイトルについて、「いいニュース」かどうかを判定してください。

「いいニュース」の基準:
- 達成・成功・偉業（優勝、新記録、受賞、合格など）
- 科学・技術の進歩（新発見、画期的な治療法、新技術など）
- 社会貢献・善意（寄付、ボランティア、救助など）
- 復興・回復（復旧、回復、再建など）
- 楽しい・ほっこり（動物、子供、感動エピソードなど）
- 経済好調（株高、売上増、雇用増など）

「いいニュース」ではないもの:
- 事件・事故・犯罪
- 災害・被害
- 紛争・戦争
- 批判・スキャンダル
- 値上げ・不況・リストラ
- 病気・死亡（追悼系は除く）

JSON配列で返してください。各要素は:
{"index": 0, "positive": true, "reason": "理由を10文字以内で"}

タイトルだけで判断が難しい場合はpositiveをfalseにしてください。
JSON配列のみを返し、それ以外のテキストは含めないでください。"""


def _init_client() -> anthropic.Anthropic:
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY environment variable is required")
    return anthropic.Anthropic(api_key=api_key)


def _validate_result(result: dict, batch_size: int) -> bool:
    """応答の各要素が必須キーを持つか検証"""
    if not isinstance(result, dict):
        return False
    if "index" not in result or "positive" not in result:
        return False
    idx = result["index"]
    if not isinstance(idx, int) or idx < 0 or idx >= batch_size:
        return False
    return True


def _classify_batch(
    client: anthropic.Anthropic,
    articles: list[Article],
) -> list[dict]:
    titles = "\n".join(
        f"{i}. {a.title}" for i, a in enumerate(articles)
    )
    prompt = f"以下のニュースタイトルを判定してください:\n\n{titles}"

    for attempt in range(RETRY_MAX):
        try:
            response = client.messages.create(
                model=MODEL_NAME,
                max_tokens=2048,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
            )
            text = response.content[0].text.strip()
            # Extract JSON array from response
            start = text.find("[")
            end = text.rfind("]")
            if start != -1 and end != -1:
                text = text[start : end + 1]
            results = json.loads(text)
            if not isinstance(results, list):
                logger.warning("Unexpected response format: %s", text[:200])
            else:
                valid: list[dict] = []
                invalid_count = 0
                for r in results:
                    if _validate_result(r, len(articles)):
                        valid.append(r)
                    else:
                        invalid_count += 1
                if invalid_count > 0:
                    logger.warning(
                        "Dropped %d invalid results from batch (missing index/positive or out of range)",
                        invalid_count,
                    )
                return valid
        except json.JSONDecodeError as e:
            logger.warning("JSON parse error (attempt %d): %s", attempt + 1, e)
        except anthropic.RateLimitError as e:
            logger.warning("Rate limit (attempt %d): %s", attempt + 1, e)
        except Exception as e:
            logger.warning("Claude API error (attempt %d): %s", attempt + 1, e)

        if attempt < RETRY_MAX - 1:
            delay = RETRY_DELAY * (2 ** attempt)
            logger.info("Retrying in %ds...", delay)
            time.sleep(delay)

    logger.warning("Batch failed after %d retries — skipping this batch", RETRY_MAX)
    return []


def _estimate_tokens(articles: list[Article]) -> int:
    """記事タイトル群の入力トークン数を概算"""
    total_chars = len(SYSTEM_PROMPT)
    for a in articles:
        total_chars += len(a.title) + 10
    # Japanese: ~1.5 tokens per character
    return int(total_chars * 1.5)


def classify_articles(articles: list[Article]) -> list[dict]:
    if not articles:
        return []

    client = _init_client()
    positive_articles: list[dict] = []
    total_batches = (len(articles) + BATCH_SIZE - 1) // BATCH_SIZE
    failed_batches = 0

    est_input_tokens = _estimate_tokens(articles)
    est_output_tokens = len(articles) * 30
    est_cost = (
        est_input_tokens / 1_000_000 * COST_PER_MILLION_INPUT
        + est_output_tokens / 1_000_000 * COST_PER_MILLION_OUTPUT
    )
    logger.info(
        "Estimated tokens: ~%d input, ~%d output (est. cost: $%.4f)",
        est_input_tokens,
        est_output_tokens,
        est_cost,
    )

    for i in range(0, len(articles), BATCH_SIZE):
        batch = articles[i : i + BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1
        logger.info(
            "Classifying batch %d/%d (%d-%d of %d)",
            batch_num, total_batches, i, i + len(batch), len(articles),
        )

        results = _classify_batch(client, batch)

        if not results:
            failed_batches += 1
            logger.warning("Batch %d/%d returned no results — continuing", batch_num, total_batches)
            continue

        for result in results:
            idx = result.get("index", -1)
            if not result.get("positive", False):
                continue
            if 0 <= idx < len(batch):
                article = batch[idx]
                article_dict = asdict(article)
                article_dict["reason"] = result.get("reason", "")
                positive_articles.append(article_dict)

        # Small delay between batches to avoid rate limits
        if i + BATCH_SIZE < len(articles):
            time.sleep(1)

    logger.info(
        "Classification complete: %d positive out of %d total (%d/%d batches succeeded)",
        len(positive_articles),
        len(articles),
        total_batches - failed_batches,
        total_batches,
    )
    return positive_articles
