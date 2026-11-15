"""Автообновление schedule.json сайта KGMU Community.

1. Скачивает Excel-файлы со страницы расписания КГМУ (build.fetch_all).
2. Сам замечает новый семестр: если в шапке файлов КГМУ стоит другой семестр
   («весенний семестр 2026/2027»), вычисляет понедельник 1-й недели и число недель
   (scraper/semester_auto.py) и пересобирает все группы под новый семестр.
3. Собирает расписание в формате kgmu-v8-multigroup.
4. Если занятия и семестр не изменились — ничего не пишет (чтобы не плодить коммиты).
При любой ошибке завершается с кодом 1, а сайт продолжает показывать прошлые данные.
"""
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).parent))
from build import fetch_all  # noqa: E402
import friend_export as FE  # noqa: E402
import semester_auto as SA  # noqa: E402

MIN_SHARE = 0.7      # доля файлов КГМУ, которые уже относятся к новому семестру
MIN_WEEKS, MAX_WEEKS = 18, 26


def summary(text):
    """Строка в отчёт запуска GitHub Actions (вкладка Summary)."""
    print(text)
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if path:
        with open(path, "a", encoding="utf-8") as f:
            f.write(text + "\n")


def last_week(payload):
    return max((w for evs in payload["groups"].values() for e in evs for w in e.get("weeks", [])), default=0)


def switch_semester(raw, manifest, template, out):
    """Новый семестр по файлам КГМУ. Возвращает (payload, semester) или None, если переключаться не нужно."""
    cur = SA.load()
    det = SA.detect(raw, manifest)
    if not det or det["title"] == cur.get("title") or not SA.is_newer(det, cur):
        return None
    if det["share"] < MIN_SHARE:
        summary(f"Похоже, начинается {det['title']}, но новых файлов пока {int(det['share'] * 100)}% — жду остальные.")
        return None
    start = FE.dt.date.fromisoformat(det["week1"])
    sem = {"title": det["title"], "week1": det["week1"], "weeks": MAX_WEEKS,
           "holidays": SA.default_holidays(start, MAX_WEEKS)}
    FE.use_semester(sem)
    probe = FE.export(raw, template, out)          # сначала с запасом, чтобы узнать последнюю неделю
    sem["weeks"] = max(MIN_WEEKS, min(MAX_WEEKS, last_week(probe)))
    sem["holidays"] = SA.default_holidays(start, sem["weeks"])
    FE.use_semester(sem)
    payload = FE.export(raw, template, out)
    summary(f"Новый семестр: {sem['title']}, 1-я неделя с {sem['week1']} ({det['how']}), недель: {sem['weeks']}.")
    return payload, sem


if __name__ == "__main__":
    template = json.loads((ROOT / "schedule.json").read_text("utf-8"))
    raw = ROOT / "raw"
    tmp = raw / "out"
    print("Скачиваю расписание КГМУ…")
    manifest = fetch_all(raw)
    switched = switch_semester(raw, manifest, template, tmp)
    if switched:
        payload, sem = switched
    else:
        payload, sem = FE.export(raw, template, tmp), None
    if payload["groups"] == template["groups"] and payload.get("semester") == template.get("semester"):
        print("Расписание не изменилось — файлы сайта не трогаю.")
        sys.exit(0)
    changed = [g for g in template["groups"] if payload["groups"].get(g) != template["groups"].get(g)]
    print(f"Изменилось расписание групп: {', '.join(changed)}")
    for name in ("schedule.json", "schedule-data.js"):
        (ROOT / name).write_text((tmp / name).read_text("utf-8"), "utf-8")
    import shutil
    shutil.rmtree(ROOT / "data" / "g", ignore_errors=True)
    shutil.copytree(tmp / "data" / "g", ROOT / "data" / "g")
    if sem:
        SA.save(sem)  # настройку семестра сохраняем только вместе с успешно собранным расписанием
    print("✓ schedule.json, schedule-data.js и data/g/ обновлены")
