"""
Batch runner — ადარებს ყველა DWG/Excel წყვილს და ქმნის Excel ანგარიშს.

გამოყენება:
  python3 run_all.py                        # samples/ საქაღალდე, ავტო-წყვილები
  python3 run_all.py saxli14.dwg budget.xlsx # ერთი წყვილი
"""

import sys
import os
import glob
import re
from datetime import datetime

from compare import (
    dwg_to_dxf,
    extract_floor_polygons,
    extract_excel_floors,
    extract_excel_budget,
    _best_polygon,
    _find_budget_item,
    _ratio_status,
    RATIO_CHECKS,
    TOLERANCE_AREA_PCT,
)
from report import build_report


SAMPLES_DIR = os.path.join(os.path.dirname(__file__), "samples")
OUTPUT_DIR  = os.path.join(os.path.dirname(__file__), "output")


# ── Pair discovery ─────────────────────────────────────────────────────────────

def find_pairs(samples_dir: str) -> list:
    """Return [(dwg_or_dxf_path, xlsx_path, label), ...] sorted by label."""
    # Prefer ASCII-named DXF files (saxliN.dxf) over Georgian DWG names
    dxf_files  = glob.glob(os.path.join(samples_dir, "saxli*.dxf"))
    dwg_files  = glob.glob(os.path.join(samples_dir, "*.dwg"))
    xlsx_files = glob.glob(os.path.join(samples_dir, "*.xlsx"))

    def get_num(path):
        m = re.search(r"(\d+)", os.path.basename(path))
        return int(m.group(1)) if m else 0

    # Collect all geometry files (dxf preferred)
    geo_by_num = {}
    for f in dwg_files:
        geo_by_num[get_num(f)] = f
    for f in dxf_files:   # override with DXF if available
        geo_by_num[get_num(f)] = f

    pairs = []
    for num in sorted(geo_by_num.keys()):
        geo = geo_by_num[num]
        matched = [x for x in xlsx_files if get_num(x) == num]
        if matched:
            xlsx = sorted(matched, key=get_num)[0]
            label = f"სახლი {num}"
            pairs.append((geo, xlsx, label))
        else:
            print(f"  ⚠ {os.path.basename(geo)} — Excel ვერ მოიძებნა, გამოტოვება")

    return pairs


# ── Single comparison (returns structured dict) ────────────────────────────────

def run_one(dwg_path: str, xlsx_path: str, label: str) -> dict:
    print(f"\n  [{label}] DWG → DXF...")
    dxf_path = dwg_to_dxf(dwg_path)

    dxf_polys = extract_floor_polygons(dxf_path)
    xl_floors  = extract_excel_floors(xlsx_path)
    xl_budget  = extract_excel_budget(xlsx_path)
    total_xl   = xl_floors.get("სულ")

    # ── Floor area results ────────────────────────────────────────────────
    area_floors = {}
    failures    = []
    dxf_sum     = 0

    for floor_lbl, ea in xl_floors.items():
        if floor_lbl == "სულ":
            continue
        da, dp, ok = _best_polygon(ea, dxf_polys)
        area_floors[floor_lbl] = {
            "excel": ea,
            "dwg":   round(da, 1) if da else None,
            "diff_pct": round(dp, 1) if dp is not None else None,
            "ok": ok,
        }
        if da:
            dxf_sum += da
        if not ok:
            failures.append(f"{floor_lbl}: {ea:.1f} vs {da:.1f if da else '—'} m²")

    # Total row
    if total_xl:
        dp_total = (dxf_sum - total_xl) / total_xl * 100
        ok_total = abs(dp_total) <= 10
        area_floors["სულ"] = {
            "excel": total_xl,
            "dwg":   round(dxf_sum, 1),
            "diff_pct": round(dp_total, 1),
            "ok": ok_total,
        }
        if not ok_total:
            failures.append(f"სულ: {total_xl:.1f} vs {dxf_sum:.1f} m²")

    # ── Budget ratio results ──────────────────────────────────────────────
    budget_ratios = {}
    for r in RATIO_CHECKS:
        item = _find_budget_item(r["key"], r["unit"], xl_budget)
        if item is None:
            budget_ratios[r["key"].replace(" ", "_")] = {
                "label": r["label"], "unit": r["unit"],
                "qty": None, "ok": False,
                "warn_only": r["warn_only"],
                "exp_min": round(total_xl * r["min"], 1) if total_xl else None,
                "exp_max": round(total_xl * r["max"], 1) if total_xl else None,
            }
            if not r["warn_only"]:
                failures.append(f"{r['label']}: ვერ მოიძებნა")
            continue

        qty   = item["qty"]
        ok, _ = _ratio_status(qty, total_xl, r) if total_xl else (None, "")
        rk    = r["key"].replace(" ", "_").replace("-", "_")
        budget_ratios[rk] = {
            "label":    r["label"],
            "unit":     r["unit"],
            "qty":      qty,
            "ok":       ok,
            "warn_only": r["warn_only"],
            "exp_min":  round(total_xl * r["min"], 1) if total_xl else None,
            "exp_max":  round(total_xl * r["max"], 1) if total_xl else None,
        }
        if ok is False and not r["warn_only"]:
            failures.append(f"{r['label']}: {qty:.1f} {r['unit']}")

    # Friendly keys for summary sheet
    KEY_MAP = {
        "rkinabetonis_karkasi": "karkasi",
        "betoni_b_25":          "betoni_b25",
        "armatura_a500":        "armatura_a500",
        "qvabulis_amoreba":     "qvabuli_amoreba",
    }
    budget_ratios_clean = {}
    for k, v in budget_ratios.items():
        friendly = KEY_MAP.get(k, k)
        budget_ratios_clean[friendly] = v

    ok_overall = len(failures) == 0
    status = "✓" if ok_overall else "✗"
    print(f"  [{label}] {status}  failures={len(failures)}")
    for f in failures:
        print(f"    • {f}")

    return {
        "name":         label,
        "dwg_path":     dwg_path,
        "xlsx_path":    xlsx_path,
        "ok":           ok_overall,
        "failures":     failures,
        "area_floors":  area_floors,
        "budget_ratios": budget_ratios_clean,
        "full_budget":  xl_budget,
        # For summary sheet
        "area_floors": {
            **area_floors,
            "სულ_excel":    total_xl,
            "სულ_dwg":      round(dxf_sum, 1),
            "სულ_diff_pct": round((dxf_sum - total_xl) / total_xl * 100, 1) if total_xl else 0,
        },
        "budget_ratios": budget_ratios_clean,
    }


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Single pair mode
    if len(sys.argv) == 3:
        dwg, xlsx = sys.argv[1], sys.argv[2]
        label = os.path.splitext(os.path.basename(dwg))[0]
        pairs = [(dwg, xlsx, label)]
    else:
        print(f"შენობების ძებნა: {SAMPLES_DIR}")
        pairs = find_pairs(SAMPLES_DIR)
        print(f"  {len(pairs)} წყვილი ნაპოვნი")

    if not pairs:
        print("ფაილები ვერ მოიძებნა.")
        sys.exit(1)

    print(f"\n{'='*60}")
    print(f"  BATCH COMPARISON — {len(pairs)} შენობა")
    print("="*60)

    results = []
    for dwg, xlsx, label in pairs:
        try:
            res = run_one(dwg, xlsx, label)
            results.append(res)
        except Exception as e:
            print(f"  ✗ [{label}] ERROR: {e}")
            results.append({
                "name": label, "ok": False,
                "failures": [str(e)],
                "area_floors": {}, "budget_ratios": {},
                "full_budget": [],
            })

    # ── Generate report ────────────────────────────────────────────────────
    ts    = datetime.now().strftime("%Y%m%d_%H%M")
    fname = f"comparison_report_{ts}.xlsx"
    out   = os.path.join(OUTPUT_DIR, fname)

    print(f"\n{'='*60}")
    print("  EXCEL REPORT გენერაცია...")
    build_report(results, out)

    # ── Print summary ──────────────────────────────────────────────────────
    ok_count = sum(1 for r in results if r["ok"])
    print(f"\n{'='*60}")
    print(f"  შეჯამება: {ok_count}/{len(results)} შენობა ✓")
    for r in results:
        tag = "✓" if r["ok"] else "✗"
        print(f"    {tag} {r['name']}")
    print(f"\n  ანგარიში: {out}")
    print("="*60)

    return 0 if ok_count == len(results) else 1


if __name__ == "__main__":
    sys.exit(main())
