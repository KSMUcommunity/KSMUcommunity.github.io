"""Переключение сайта на новый семестр (весенний или осенний).

Обычно запускается из GitHub Actions: вкладка Actions → «Расписание КГМУ» → Run workflow,
заполнить «Название семестра», «Понедельник 1-й недели» и «Число недель». Вручную:

    python scraper/new_semester.py --title "Весна 2026/27" --week1 2027-02-08 --weeks 18
    python scraper/new_semester.py --auto            # взять семестр из шапки свежих Excel-файлов КГМУ

Скрипт только записывает scraper/semester.json. Расписание затем собирает update_friend.py:
он видит, что семестр сменился, и пересобирает все группы с нуля (группы без занятий в новом
семестре убираются, новые группы добавляются).
"""
import argparse
import datetime as dt
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SEM_FILE = HERE / "semester.json"


def load():
    return json.loads(SEM_FILE.read_text("utf-8"))


def default_holidays(start: dt.date, weeks: int):
    """Нерабочие праздничные дни РФ, попадающие в семестр (+4 недели на сессию)."""
    fixed = ["01-01", "01-02", "01-03", "01-04", "01-05", "01-06", "01-07", "01-08",
             "02-23", "03-08", "05-01", "05-09", "06-12", "11-04", "12-31"]
    end = start + dt.timedelta(weeks=weeks + 4)
    out = []
    for y in range(start.year, end.year + 1):
        for md in fixed:
            d = dt.date.fromisoformat(f"{y}-{md}")
            if start <= d <= end:
                out.append(d.isoformat())
    return sorted(out)


def check(title, week1, weeks):
    try:
        d = dt.date.fromisoformat(week1)
    except ValueError:
        sys.exit(f"Дата «{week1}» не похожа на ГГГГ-ММ-ДД")
    if d.weekday() != 0:
        monday = d - dt.timedelta(days=d.weekday())
        sys.exit(f"{week1} — не понедельник. Понедельник этой недели: {monday.isoformat()}")
    if not 1 <= weeks <= 30:
        sys.exit("Число недель должно быть от 1 до 30")
    if not re.match(r"^(Осень|Весна) \d{4}/\d{2}$", title):
        print(f"! Название «{title}» необычное (ожидается, например, «Весна 2026/27») — записываю как есть")
    return d


def write(title, week1, weeks, holidays=None):
    d = check(title, week1, weeks)
    sem = {"title": title, "week1": week1, "weeks": weeks,
           "holidays": holidays if holidays is not None else default_holidays(d, weeks)}
    old = load() if SEM_FILE.exists() else {}
    SEM_FILE.write_text(json.dumps(sem, ensure_ascii=False, indent=1) + "\n", "utf-8")
    if old.get("week1") != week1:
        print(f"✓ Новый семестр: {title}, неделя 1 = {week1}, недель: {weeks} (было: {old.get('title')}, {old.get('week1')})")
    else:
        print(f"✓ Семестр уточнён: {title}, недель: {weeks}")
    return sem


def auto():
    """Семестр по шапке Excel-файлов КГМУ («весенний семестр 2026/2027»)."""
    sys.path.insert(0, str(HERE))
    from build import fetch_all, semester_start  # noqa: E402
    raw = HERE.parent / "raw"
    manifest = fetch_all(raw)
    start, label = semester_start(raw, manifest)
    m = re.search(r"(осенний|весенний) семестр (\d{4})/(\d{4})", label or "")
    if not m:
        sys.exit("Не удалось определить семестр по файлам КГМУ — укажите --title и --week1 вручную")
    title = ("Осень " if m.group(1) == "осенний" else "Весна ") + m.group(2) + "/" + m.group(3)[2:]
    return title, start


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--title", help="Название, например «Весна 2026/27»")
    ap.add_argument("--week1", help="Понедельник 1-й учебной недели, ГГГГ-ММ-ДД")
    ap.add_argument("--weeks", type=int, help="Число учебных недель (по умолчанию как сейчас)")
    ap.add_argument("--auto", action="store_true", help="Определить название и 1-ю неделю по файлам КГМУ")
    a = ap.parse_args()
    cur = load()
    if a.auto:
        t, w1 = auto()
        a.title, a.week1 = a.title or t, a.week1 or w1
    if not a.week1:
        sys.exit("Укажите --week1 (или --auto)")
    write(a.title or cur["title"], a.week1, a.weeks or cur["weeks"])
