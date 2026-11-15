"""Пересобрать данные сайта (schedule-data.js + data/g/) из текущего schedule.json без скачивания Excel.
    python scraper/split_groups.py
"""
import json, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scraper"))
import friend_export as FE

payload = json.loads((ROOT / "schedule.json").read_text("utf-8"))
FE.write_site_data(payload, ROOT)
print(f"✓ {len(payload['groups'])} групп → data/g/, schedule-data.js")
