"""
DWG vs Excel Comparison Web Server
გაშვება: python3 server.py
შემდეგ გახსენი: http://localhost:8000
"""

import os
import shutil
import tempfile
import traceback
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

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

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI(title="DWG vs Excel Checker")
app.mount("/static", StaticFiles(directory="static"), name="static")


# ── Core comparison logic (returns dict) ─────────────────────────────────────

def run_comparison(dwg_path: str, xlsx_path: str) -> dict:
    dxf_path  = dwg_to_dxf(dwg_path)
    dxf_polys = extract_floor_polygons(dxf_path)
    xl_floors  = extract_excel_floors(xlsx_path)
    xl_budget  = extract_excel_budget(xlsx_path)
    total_xl   = xl_floors.get("სულ")

    # ── Floor areas ───────────────────────────────────────────────────────
    floor_results = []
    dxf_sum = 0
    all_floors_ok = True

    for label, ea in sorted(xl_floors.items(), key=lambda x: -x[1]):
        if label == "სულ":
            continue
        da, dp, ok = _best_polygon(ea, dxf_polys)
        floor_results.append({
            "label":    label,
            "excel":    round(ea, 1),
            "dwg":      round(da, 1) if da else None,
            "diff_pct": round(dp, 1) if dp is not None else None,
            "ok":       ok,
        })
        if da:
            dxf_sum += da
        if not ok:
            all_floors_ok = False

    # Total
    total_ok = True
    total_diff = None
    if total_xl:
        total_diff = round((dxf_sum - total_xl) / total_xl * 100, 1)
        total_ok = abs(total_diff) <= 10
        floor_results.append({
            "label": "სულ",
            "excel": round(total_xl, 1),
            "dwg":   round(dxf_sum, 1),
            "diff_pct": total_diff,
            "ok": total_ok,
            "is_total": True,
        })
        if not total_ok:
            all_floors_ok = False

    # ── Budget ratios ─────────────────────────────────────────────────────
    ratio_results = []
    all_ratios_ok = True

    for r in RATIO_CHECKS:
        item = _find_budget_item(r["key"], r["unit"], xl_budget)
        if item is None:
            ratio_results.append({
                "label": r["label"], "unit": r["unit"],
                "qty": None, "ok": False,
                "warn_only": r["warn_only"],
                "exp_min": round(total_xl * r["min"], 1) if total_xl else None,
                "exp_max": round(total_xl * r["max"], 1) if total_xl else None,
                "msg": "ვერ მოიძებნა ბიუჯეტში",
            })
            if not r["warn_only"]:
                all_ratios_ok = False
            continue

        qty   = item["qty"]
        ok, msg = _ratio_status(qty, total_xl, r) if total_xl else (None, "")
        ratio_results.append({
            "label": r["label"], "unit": r["unit"],
            "qty": round(qty, 2),
            "ok": ok,
            "warn_only": r["warn_only"],
            "exp_min": round(total_xl * r["min"], 1) if total_xl else None,
            "exp_max": round(total_xl * r["max"], 1) if total_xl else None,
            "msg": msg,
        })
        if ok is False and not r["warn_only"]:
            all_ratios_ok = False

    # ── Full budget list ──────────────────────────────────────────────────
    budget_list = [
        {"desc": it["desc"], "unit": it["unit"], "qty": round(it["qty"], 2)}
        for it in xl_budget
    ]

    overall_ok = all_floors_ok and all_ratios_ok

    return {
        "ok": overall_ok,
        "total_excel": round(total_xl, 1) if total_xl else None,
        "total_dwg":   round(dxf_sum, 1),
        "floors": floor_results,
        "ratios": ratio_results,
        "budget": budget_list,
    }


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/", response_class=HTMLResponse)
async def index():
    html_path = Path(__file__).parent / "static" / "index.html"
    return HTMLResponse(html_path.read_text(encoding="utf-8"))


@app.post("/compare")
async def compare_endpoint(
    dwg:   UploadFile = File(...),
    excel: UploadFile = File(...),
):
    # Save uploads with safe ASCII filenames
    tmp_dir = Path(tempfile.mkdtemp(dir=UPLOAD_DIR))
    try:
        dwg_path   = tmp_dir / f"upload{Path(dwg.filename).suffix.lower()}"
        excel_path = tmp_dir / "upload.xlsx"

        with open(dwg_path, "wb") as f:
            shutil.copyfileobj(dwg.file, f)
        with open(excel_path, "wb") as f:
            shutil.copyfileobj(excel.file, f)

        result = run_comparison(str(dwg_path), str(excel_path))
        # Sanitize numpy/non-standard types for JSON
        import json as _json
        safe = _json.loads(_json.dumps(result, default=lambda o: bool(o) if hasattr(o, '__bool__') else str(o)))
        return JSONResponse(safe)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


if __name__ == "__main__":
    import uvicorn
    print("\n  http://localhost:8000  გახსენი ბრაუზერში\n")
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)
