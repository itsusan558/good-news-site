import json

with open("../raw_articles.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for i, a in enumerate(data["articles"]):
    title = a["title"][:70]
    cat = a["category"]
    print(f"{i:3d} [{cat:>15s}] {title}")
