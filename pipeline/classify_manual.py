"""Claudeが判別した「いいニュース」のインデックスリストからarticles.jsonを生成"""

import json
from datetime import datetime, timedelta, timezone

JST = timezone(timedelta(hours=9))

# Claudeが467件から選別した「いいニュース」のインデックスと理由
POSITIVE_ARTICLES: list[dict] = [
    {"index": 20, "reason": "新サービス開始"},
    {"index": 24, "reason": "将棋の偉業"},
    {"index": 25, "reason": "国際的な評価"},
    {"index": 30, "reason": "人材需要の高まり"},
    {"index": 33, "reason": "AI研究が権威ある学術誌に"},
    {"index": 34, "reason": "創薬の進歩"},
    {"index": 37, "reason": "音楽生成の新機能"},
    {"index": 40, "reason": "便利な新ツール"},
    {"index": 42, "reason": "技術革新"},
    {"index": 44, "reason": "AI活用の新サービス"},
    {"index": 47, "reason": "ユニークなAI活用"},
    {"index": 61, "reason": "AI創薬の進歩"},
    {"index": 65, "reason": "未来のデバイス"},
    {"index": 66, "reason": "医療の迅速化"},
    {"index": 83, "reason": "高齢者の健康貢献"},
    {"index": 95, "reason": "AI活用で中小企業を支援"},
    {"index": 100, "reason": "革新的デバイス"},
    {"index": 113, "reason": "高齢者のウェルビーイング"},
    {"index": 116, "reason": "宇宙観測のチャンス"},
    {"index": 117, "reason": "宇宙観測のチャンス"},
    {"index": 119, "reason": "宇宙科学の進展"},
    {"index": 122, "reason": "学生の受賞"},
    {"index": 126, "reason": "生物の助け合い発見"},
    {"index": 131, "reason": "リハビリ研究の充実"},
    {"index": 132, "reason": "科学館の節目"},
    {"index": 133, "reason": "宇宙ごみ除去の挑戦"},
    {"index": 136, "reason": "産学官連携の研究施設"},
    {"index": 139, "reason": "宇宙事業の支援"},
    {"index": 145, "reason": "科学と伝統の融合"},
    {"index": 146, "reason": "代替肉の研究"},
    {"index": 147, "reason": "月面探査の進展"},
    {"index": 153, "reason": "宇宙と食文化の融合"},
    {"index": 166, "reason": "イメトレの科学的効果"},
    {"index": 190, "reason": "老化研究の進展"},
    {"index": 194, "reason": "子どもの科学教育"},
    {"index": 196, "reason": "F1で19歳が優勝"},
    {"index": 197, "reason": "初制覇の快挙"},
    {"index": 198, "reason": "チーム初優勝"},
    {"index": 199, "reason": "ファンの熱い声援"},
    {"index": 214, "reason": "フィギュア世界王者"},
    {"index": 215, "reason": "バレー優勝"},
    {"index": 216, "reason": "フラッグフット優勝"},
    {"index": 220, "reason": "F1の世代交代"},
    {"index": 229, "reason": "地元で嬉しい初優勝"},
    {"index": 240, "reason": "優勝リングの秘密"},
    {"index": 243, "reason": "バレー2連覇"},
    {"index": 249, "reason": "プロ初優勝"},
    {"index": 256, "reason": "卓球団体優勝"},
    {"index": 258, "reason": "今季チーム1号"},
    {"index": 268, "reason": "3年ぶり優勝"},
    {"index": 271, "reason": "F1最年少記録"},
    {"index": 274, "reason": "開幕3連勝の快挙"},
    {"index": 286, "reason": "スキージャンプW杯初優勝"},
    {"index": 287, "reason": "バスケ大会優勝"},
    {"index": 294, "reason": "ギネス世界記録更新"},
    {"index": 295, "reason": "マリオ映画世界初上映"},
    {"index": 296, "reason": "宝塚合格の喜び"},
    {"index": 298, "reason": "ドラえもん展開幕"},
    {"index": 299, "reason": "被災地を音楽で支援"},
    {"index": 308, "reason": "国際的な映画評価"},
    {"index": 328, "reason": "世界音楽市場の成長"},
    {"index": 336, "reason": "子どもたちの歌声披露"},
    {"index": 347, "reason": "映画興収200億突破"},
    {"index": 363, "reason": "山形交響楽団の体験イベント"},
    {"index": 375, "reason": "最優秀作曲賞受賞"},
    {"index": 391, "reason": "医療複合モール開業"},
    {"index": 394, "reason": "遠隔医療の進展"},
    {"index": 396, "reason": "子どもの目の健康啓発"},
    {"index": 399, "reason": "ロボットで医療効率化"},
    {"index": 402, "reason": "高齢者の健康体操"},
    {"index": 419, "reason": "メンタルヘルス啓発"},
    {"index": 434, "reason": "アレルギーリスク低下"},
    {"index": 436, "reason": "医療サービス拡充"},
    {"index": 437, "reason": "健康増進の連携協定"},
    {"index": 462, "reason": "歩行と健康の科学"},
    {"index": 466, "reason": "AIで医療効率化"},
]


def main() -> None:
    with open("../raw_articles.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    all_articles = data["articles"]
    positive = []

    for item in POSITIVE_ARTICLES:
        idx = item["index"]
        if 0 <= idx < len(all_articles):
            article = dict(all_articles[idx])
            article["reason"] = item["reason"]
            positive.append(article)

    positive.sort(key=lambda a: a.get("raw_date", ""), reverse=True)

    output = {
        "last_updated": datetime.now(JST).isoformat(),
        "total": len(positive),
        "articles": positive,
    }

    output_path = "../web/public/data/articles.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(positive)} positive articles")

    categories: dict[str, int] = {}
    for a in positive:
        cat = a.get("category", "unknown")
        categories[cat] = categories.get(cat, 0) + 1
    for cat, count in sorted(categories.items()):
        print(f"  {cat}: {count}")


if __name__ == "__main__":
    main()
