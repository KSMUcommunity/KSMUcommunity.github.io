"""Автоматическое определение семестра по файлам КГМУ.

Название берётся из шапки Excel («РАСПИСАНИЕ ЗАНЯТИЙ на весенний семестр 2026/2027 уч.г.»).
Понедельник 1-й недели — неделя самой ранней даты в файлах циклов старших курсов
(в осеннем семестре 2026/27 это 1 сентября → неделя с 31 августа). Если файлов циклов нет
или дата странная, берётся правило: осень — неделя с 1 сентября, весна — неделя с 9 февраля.
Число недель — последняя неделя, в которой есть занятия (от 18 до 26).
"""
import datetime as dt
import json
import re
from collections import Counter
from pathlib import Path

import openpyxl

HERE = Path(__file__).resolve().parent
SEM_FILE = HERE / "semester.json"
LABEL_RE = re.compile(r"(осенний|весенний)\s+семестр\s+(\d{4})\s*/\s*(\d{4})", re.I)
FIXED_HOLIDAYS = ["01-01", "01-02", "01-03", "01-04", "01-05", "01-06", "01-07", "01-08",
                  "02-23", "03-08", "05-01", "05-09", "06-12", "11-04", "12-31"]


def load():
    return json.loads(SEM_FILE.read_text("utf-8"))


def save(sem):
    SEM_FILE.write_text(json.dumps(sem, ensure_ascii=False, indent=1) + "\n", "utf-8")


def monday(d):
    return d - dt.timedelta(days=d.weekday())


def default_holidays(start, weeks):
    """Нерабочие праздничные дни РФ внутри семестра и сессии (+6 недель)."""
    end = start + dt.timedelta(weeks=weeks + 6)
    out = []
    for y in range(start.year, end.year + 1):
        for md in FIXED_HOLIDAYS:
            d = dt.date.fromisoformat(f"{y}-{md}")
            if start <= d <= end:
                out.append(d.isoformat())
    return sorted(out)


def title_of(season, y1, y2):
    return ("Осень " if season.lower() == "осенний" else "Весна ") + f"{y1}/{str(y2)[2:]}"


def _cell_date(v):
    if isinstance(v, dt.datetime):
        return v.date()
    if isinstance(v, dt.date):
        return v
    if isinstance(v, str):
        m = re.search(r"\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b", v)
        if m:
            try:
                return dt.date(int(m.group(3)), int(m.group(2)), int(m.group(1)))
            except ValueError:
                return None
    return None


def detect(raw: Path, manifest):
    """{'title', 'week1', 'share', 'how'} по скачанным файлам или None."""
    labels, cycle_dates = Counter(), []
    xl = [m for m in manifest if m["fn"].lower().endswith(".xlsx")]
    for m in xl:
        try:
            wb = openpyxl.load_workbook(raw / m["fn"], read_only=True)
        except Exception:  # noqa: BLE001
            continue
        ws = wb.worksheets[0]
        head = " ".join(str(v) for row in ws.iter_rows(min_row=1, max_row=6, values_only=True) for v in row if v)
        lm = LABEL_RE.search(head)
        if lm:
            labels[(lm.group(1).lower(), int(lm.group(2)), int(lm.group(3)))] += 1
        if "ЦИКЛ" in str(ws["B2"].value or "").upper():
            for row in ws.iter_rows(values_only=True):
                for v in row:
                    d = _cell_date(v)
                    if d and 2020 < d.year < 2100:
                        cycle_dates.append(d)
        wb.close()
    if not labels:
        return None
    (season, y1, y2), n = labels.most_common(1)[0]
    share = n / max(1, sum(labels.values()))
    # окно, в котором может начаться семестр
    if season == "осенний":
        lo, hi, rule = dt.date(y1, 8, 15), dt.date(y1, 9, 20), dt.date(y1, 9, 1)
    else:
        lo, hi, rule = dt.date(y2, 1, 20), dt.date(y2, 3, 10), dt.date(y2, 2, 9)
    in_window = [d for d in cycle_dates if lo <= d <= hi]
    if in_window and abs((monday(min(in_window)) - monday(rule)).days) <= 7:
        start, how = monday(min(in_window)), f"по первой дате циклов ({min(in_window).isoformat()})"
    elif in_window:
        # одна ранняя дата (пересдача, хвост прошлого цикла) сдвинула бы все недели — берём правило
        start, how = monday(rule), (f"по правилу: первая дата циклов {min(in_window).isoformat()} дальше недели "
                                    "от обычного начала — проверьте и при необходимости задайте дату вручную")
    else:
        start, how = monday(rule), "по правилу (файлов циклов с датами нет)"
    return {"title": title_of(season, y1, y2), "week1": start.isoformat(), "share": round(share, 2), "how": how}


def is_newer(det, cur):
    """Определённый семестр начинается позже текущего (не откатываемся назад)."""
    return det["week1"] > cur.get("week1", "")
