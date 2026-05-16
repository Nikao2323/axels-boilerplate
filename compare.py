"""
DWG vs Excel Comparison Tool
გამოყენება: python3 compare.py <dwg_file> <excel_file>
"""
import sys
import os
import subprocess
import tempfile
import openpyxl
import ezdxf
from collections import defaultdict


AUTOCAD_CONSOLE = r"C:\Program Files\Autodesk\AutoCAD 2021\accoreconsole.exe"
AUTOCAD_CONSOLE_WSL = "/mnt/c/Program Files/Autodesk/AutoCAD 2021/accoreconsole.exe"


def dwg_to_dxf(dwg_path: str) -> str:
    """Converts DWG to DXF via AutoCAD Core Console. Returns DXF path."""
    dwg_win = dwg_path.replace("/mnt/c/", "C:\\").replace("/", "\\")
    dxf_out = tempfile.mktemp(suffix=".dxf")
    dxf_win = dxf_out.replace("/mnt/c/", "C:\\").replace("/", "\\")
    if dxf_out.startswith("/tmp"):
        dxf_win = "C:\\Users\\Nika\\AppData\\Local\\Temp\\" + os.path.basename(dxf_out)

    scr = tempfile.NamedTemporaryFile(suffix=".scr", mode="w", delete=False)
    scr.write(f"DXFOUT\n{dxf_win}\n16\n\n")
    scr.close()

    scr_win = scr.name.replace("/mnt/c/", "C:\\").replace("/", "\\")
    if scr.name.startswith("/tmp"):
        scr_win = "C:\\Users\\Nika\\AppData\\Local\\Temp\\" + os.path.basename(scr.name)

    subprocess.run(
        [AUTOCAD_CONSOLE_WSL, "/i", dwg_win, "/s", scr_win, "/l", "en-US"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        timeout=120,
    )
    os.unlink(scr.name)

    if not os.path.exists(dxf_out):
        # Try alternate path
        alt = "/mnt/c/Users/Nika/AppData/Local/Temp/" + os.path.basename(dxf_out)
        if os.path.exists(alt):
            return alt
        raise FileNotFoundError(f"DXF conversion failed: {dxf_out}")
    return dxf_out


def extract_dxf_areas(dxf_path: str) -> dict:
    """Returns dict: layer -> total closed-polyline area (m²)."""
    doc = ezdxf.readfile(dxf_path)
    msp = doc.modelspace()
    areas = defaultdict(float)

    for ent in msp:
        if ent.dxftype() == "LWPOLYLINE" and ent.is_closed:
            pts = list(ent.vertices())
            if len(pts) < 3:
                continue
            x = [p[0] for p in pts]
            y = [p[1] for p in pts]
            n = len(x)
            area = abs(sum(x[i] * y[(i+1)%n] - x[(i+1)%n] * y[i] for i in range(n))) / 2
            areas[ent.dxf.layer] += area

    return dict(areas)


def extract_excel_areas(xlsx_path: str) -> dict:
    """Returns floor areas from ფართები sheet."""
    wb = openpyxl.load_workbook(xlsx_path, data_only=True)
    result = {}

    if "ფართები" not in wb.sheetnames:
        return result

    ws = wb["ფართები"]
    for row in ws.iter_rows(min_row=4, values_only=True):
        idx, floor, total, useful = row[0], row[1], row[2], row[3]
        if floor is None or total is None:
            continue
        if isinstance(floor, str) and "jami" in floor.lower():
            result["სულ"] = total
            continue
        label = str(floor) if not isinstance(floor, (int, float)) else f"სართული {int(floor)}"
        if isinstance(floor, str) and "Zirk" in floor:
            label = "საძირკველი"
        elif isinstance(floor, str) and "xuravi" in floor:
            label = "სახურავი"
        result[label] = total
    return result


def extract_excel_budget(xlsx_path: str) -> list:
    """Returns list of (description, unit, quantity) from ბიუჯეტი sheet."""
    wb = openpyxl.load_workbook(xlsx_path, data_only=True)
    items = []

    if "ბიუჯეტი" not in wb.sheetnames:
        return items

    ws = wb["ბიუჯეტი"]
    header_found = False
    for row in ws.iter_rows(min_row=1, values_only=True):
        if not header_found:
            if row[0] == "#" or row[1] == "samuSaos dasaxeleba":
                header_found = True
            continue
        idx, desc, unit, qty = row[0], row[1], row[2], row[3]
        if desc and isinstance(desc, str) and qty and isinstance(qty, (int, float)) and qty > 0:
            items.append({"desc": desc, "unit": unit or "", "qty": float(qty)})
    return items


def compare(dwg_path: str, xlsx_path: str):
    print(f"\n{'='*60}")
    print(f"DWG:   {os.path.basename(dwg_path)}")
    print(f"Excel: {os.path.basename(xlsx_path)}")
    print("="*60)

    # Convert DWG -> DXF
    print("\n⏳ DWG → DXF კონვერტაცია...")
    if dwg_path.endswith(".dxf"):
        dxf_path = dwg_path
    else:
        dxf_path = dwg_to_dxf(dwg_path)
    print(f"   ✓ {dxf_path}")

    # Extract data
    print("\n📐 DXF layer areas:")
    dxf_areas = extract_dxf_areas(dxf_path)
    for layer, area in sorted(dxf_areas.items(), key=lambda x: -x[1])[:15]:
        if area > 10:
            print(f"   [{layer[:50]}]: {area:.1f} m²")

    print("\n📊 Excel floor areas (ფართები):")
    xl_areas = extract_excel_areas(xlsx_path)
    for floor, area in xl_areas.items():
        area_val = float(area) if isinstance(area, (int, float)) else 0
        print(f"   {floor}: {area_val:.2f} m²")

    print("\n📋 Excel budget items (ბიუჯეტი) — top 20:")
    budget = extract_excel_budget(xlsx_path)
    for item in budget[:20]:
        print(f"   {item['desc'][:45]:45s} | {item['unit']:4s} | {item['qty']:.2f}")

    total_excel = xl_areas.get("სულ", sum(float(v) for k, v in xl_areas.items() if k != "სულ" and isinstance(v, (int, float))))
    print(f"\n📌 Excel სულ ფართი: {total_excel:.2f} m²")
    print(f"📌 DXF სულ closed-polyline area: {sum(dxf_areas.values()):.1f} m²")
    print("\n⚠️  Layer mapping საჭიროა — იხ. NIKAO_README.md")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("გამოყენება: python3 compare.py <dwg_or_dxf> <excel.xlsx>")
        sys.exit(1)
    compare(sys.argv[1], sys.argv[2])
