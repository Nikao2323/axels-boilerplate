"""
Phase 1 — DWG vs Excel Volume Comparison
გამოყენება: python3 compare.py <dwg_or_dxf_file> <excel_file>
"""

import sys
import os
import subprocess
import tempfile
import openpyxl
import ezdxf
from collections import defaultdict


AUTOCAD_WSL = "/mnt/c/Program Files/Autodesk/AutoCAD 2021/accoreconsole.exe"

# Calibrated ratios from 6 reference buildings
RATIOS = {
    "karkasi":      {"min": 1.22, "max": 1.28, "label": "კარკასი / სულ ფართი"},
    "qvabuli_min":  {"ratio": 0.60, "label": "ქვაბული min კოეფ."},
    "qvabuli_max":  {"ratio": 0.85, "label": "ქვაბული max კოეფ."},
}
TOLERANCE_AREA_PCT = 8   # % floor area match tolerance DXF vs Excel
TOLERANCE_RATIO_PCT = 10  # % tolerance for ratio-based checks


# ── DWG → DXF ────────────────────────────────────────────────────────────────

def dwg_to_dxf(dwg_path: str) -> str:
    ext = os.path.splitext(dwg_path)[1].lower()
    if ext == ".dxf":
        return dwg_path

    # Build Windows paths
    def to_win(p):
        if p.startswith("/mnt/"):
            drive = p[5].upper()
            return drive + ":\\" + p[7:].replace("/", "\\")
        return p

    dwg_win = to_win(dwg_path)
    dxf_tmp = tempfile.mktemp(suffix=".dxf", dir="/tmp")
    dxf_win = "C:\\Users\\Nika\\AppData\\Local\\Temp\\" + os.path.basename(dxf_tmp)

    scr = tempfile.NamedTemporaryFile(
        suffix=".scr", mode="w", dir="/tmp", delete=False, encoding="utf-8"
    )
    scr.write(f"DXFOUT\n{dxf_win}\n16\n\n")
    scr.close()
    scr_win = "C:\\Users\\Nika\\AppData\\Local\\Temp\\" + os.path.basename(scr.name)

    subprocess.run(
        [AUTOCAD_WSL, "/i", dwg_win, "/s", scr_win, "/l", "en-US"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        timeout=120,
    )
    os.unlink(scr.name)

    # accoreconsole writes to Windows temp, find it in WSL
    wsl_path = "/mnt/c/Users/Nika/AppData/Local/Temp/" + os.path.basename(dxf_tmp)
    if os.path.exists(wsl_path):
        return wsl_path
    if os.path.exists(dxf_tmp):
        return dxf_tmp
    raise FileNotFoundError(f"DXF conversion failed for: {dwg_path}")


# ── DXF extraction ───────────────────────────────────────────────────────────

def polygon_area(pts):
    x = [p[0] for p in pts]
    y = [p[1] for p in pts]
    n = len(x)
    return abs(sum(x[i] * y[(i+1)%n] - x[(i+1)%n] * y[i] for i in range(n))) / 2


def extract_floor_polygons(dxf_path: str, min_area=200, max_area=3000):
    """Return sorted list of distinct closed-polygon areas (m²) in building range."""
    doc = ezdxf.readfile(dxf_path)
    msp = doc.modelspace()

    raw = []
    for ent in msp:
        if ent.dxftype() == "LWPOLYLINE" and ent.is_closed:
            pts = list(ent.vertices())
            if len(pts) >= 4:
                area = polygon_area(pts)
                if min_area < area < max_area:
                    raw.append(round(area, 1))

    # Cluster areas within 2m² of each other → pick median
    raw.sort()
    clusters = []
    for a in raw:
        if clusters and abs(a - clusters[-1][0]) < 3:
            clusters[-1].append(a)
        else:
            clusters.append([a])

    # Return unique cluster representatives with count
    result = []
    for c in clusters:
        rep = sorted(c)[len(c)//2]   # median
        result.append({"area": rep, "count": len(c)})
    return sorted(result, key=lambda x: -x["area"])


# ── Excel extraction ─────────────────────────────────────────────────────────

def extract_excel_floors(xlsx_path: str):
    """Return {label: area_m2} from ფართები sheet."""
    wb = openpyxl.load_workbook(xlsx_path, data_only=True)
    if "ფართები" not in wb.sheetnames:
        return {}
    ws = wb["ფართები"]
    floors = {}
    for row in ws.iter_rows(min_row=4, values_only=True):
        if len(row) < 3:
            continue
        idx, floor, total = row[0], row[1], row[2]
        if not (floor and isinstance(total, (int, float)) and total > 0):
            continue
        label = str(floor)
        if "jami" in label.lower():
            floors["სულ"] = float(total)
        elif "Zirk" in label or "zirk" in label:
            floors["საძირკველი"] = float(total)
        elif "xuravi" in label or "saxuravi" in label:
            floors["სახურავი"] = float(total)
        elif isinstance(floor, (int, float)):
            floors[f"სართ.{int(floor)}"] = float(total)
    return floors


def extract_excel_budget(xlsx_path: str):
    """Return list of {desc, unit, qty} from ბიუჯეტი sheet."""
    wb = openpyxl.load_workbook(xlsx_path, data_only=True)
    if "ბიუჯეტი" not in wb.sheetnames:
        return []
    ws = wb["ბიუჯეტი"]
    items = []
    header_found = False
    for row in ws.iter_rows(min_row=1, values_only=True):
        if not header_found:
            if row[1] == "samuSaos dasaxeleba" or row[0] == "#":
                header_found = True
            continue
        desc, unit, qty = row[1], row[2], row[3]
        if isinstance(desc, str) and isinstance(qty, (int, float)) and qty > 0:
            items.append({"desc": desc, "unit": str(unit or ""), "qty": float(qty)})
    return items


# ── Comparison logic ─────────────────────────────────────────────────────────

def match_floor(excel_area, dxf_polygons, tol_pct=TOLERANCE_AREA_PCT):
    """Find best matching DXF polygon for an Excel floor area."""
    best = None
    best_diff = 1e9
    for p in dxf_polygons:
        diff = abs(p["area"] - excel_area)
        if diff < best_diff:
            best_diff = diff
            best = p
    if best is None:
        return None, None, None
    diff_pct = (best["area"] - excel_area) / excel_area * 100
    ok = abs(diff_pct) <= tol_pct
    return best["area"], diff_pct, ok


def check_ratio(qty, total_area, ratio_min, ratio_max):
    if not total_area:
        return None
    expected_min = total_area * ratio_min
    expected_max = total_area * ratio_max
    ok = expected_min * 0.9 <= qty <= expected_max * 1.1
    return {"expected_min": expected_min, "expected_max": expected_max, "ok": ok}


# ── Main report ──────────────────────────────────────────────────────────────

def compare(dwg_path: str, xlsx_path: str):
    name = os.path.splitext(os.path.basename(dwg_path))[0]
    print(f"\n{'='*65}")
    print(f"  შედარება: {name}")
    print(f"  DWG:   {os.path.basename(dwg_path)}")
    print(f"  Excel: {os.path.basename(xlsx_path)}")
    print("="*65)

    # Convert DWG
    print("\n[1] DWG → DXF...")
    dxf_path = dwg_to_dxf(dwg_path)
    print(f"    OK: {os.path.basename(dxf_path)}")

    # Extract
    dxf_polys = extract_floor_polygons(dxf_path)
    xl_floors  = extract_excel_floors(xlsx_path)
    xl_budget  = extract_excel_budget(xlsx_path)

    total_excel = xl_floors.get("სულ")

    # ── Section A: Floor areas ────────────────────────────────────────────
    print("\n[A] სართულების ფართები — Excel vs DWG")
    print(f"  {'სართული':<15} {'Excel m²':>10}  {'DXF m²':>10}  {'სხვაობა':>9}  სტატ.")
    print("  " + "-"*58)
    all_ok = True
    for label, excel_area in sorted(xl_floors.items(), key=lambda x: -x[1]):
        if label == "სულ":
            continue
        dxf_area, diff_pct, ok = match_floor(excel_area, dxf_polys)
        status = "✓" if ok else "✗ განსხვავება!"
        if not ok:
            all_ok = False
        dxf_str = f"{dxf_area:.1f}" if dxf_area else "—"
        diff_str = f"{diff_pct:+.1f}%" if diff_pct is not None else "—"
        print(f"  {label:<15} {excel_area:>10.1f}  {dxf_str:>10}  {diff_str:>9}  {status}")

    if total_excel:
        # Sum one matched DXF area per Excel floor (not count × area)
        dxf_matched_sum = 0
        for label, excel_area in xl_floors.items():
            if label == "სულ":
                continue
            dxf_area, _, _ = match_floor(excel_area, dxf_polys)
            if dxf_area:
                dxf_matched_sum += dxf_area
        diff_pct = (dxf_matched_sum - total_excel) / total_excel * 100
        ok = abs(diff_pct) <= 10
        status = "✓" if ok else "✗ განსხვავება!"
        print(f"  {'სულ (ჯამი)':<15} {total_excel:>10.1f}  {dxf_matched_sum:>10.1f}  {diff_pct:+.1f}%  {status}")
        if not ok:
            all_ok = False

    # ── Section B: Key budget quantities ─────────────────────────────────
    print("\n[B] ბიუჯეტის მოცულობები — raod. სვეტი")
    print(f"  {'სამუშაო':<42} {'ერთ.':>5} {'raod.':>10}  სტატ.")
    print("  " + "-"*65)

    key_items = [
        ("karkasi",   "კარკასი"),
        ("qvabulis mowyoba", "ქვაბ. მოწყობა"),
        ("qvabulis amoReba", "ქვაბ. ამოღება"),
        ("betoni b-25", "ბეტონი B25"),
        ("armatura a500", "არმატ. A500"),
        ("inertuli", "ინერტული"),
        ("hidroizolacia", "ჰიდრ-ია"),
    ]
    for key, display in key_items:
        for item in xl_budget:
            if key in item["desc"].lower():
                qty  = item["qty"]
                unit = item["unit"]
                status = "–"
                # Ratio check for karkasi
                if "karkasi" in key and total_excel:
                    r = check_ratio(qty, total_excel, RATIOS["karkasi"]["min"], RATIOS["karkasi"]["max"])
                    if r:
                        status = "✓" if r["ok"] else f"✗ მოსალოდნელი {r['expected_min']:.0f}–{r['expected_max']:.0f}"
                print(f"  {display:<42} {unit:>5} {qty:>10.2f}  {status}")
                break

    # ── Summary ───────────────────────────────────────────────────────────
    print("\n" + "="*65)
    if all_ok:
        print("  ᲨᲔᲓᲔᲒᲘ: ✓ ყველა სართულის ფართი Excel-DWG-ს ემთხვევა")
    else:
        print("  ᲨᲔᲓᲔᲒᲘ: ✗ განსხვავებები აღმოჩენილია — შეამოწმე ზემოთ!")
    print("="*65 + "\n")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("გამოყენება: python3 compare.py <dwg_ან_dxf> <excel.xlsx>")
        sys.exit(1)
    compare(sys.argv[1], sys.argv[2])
