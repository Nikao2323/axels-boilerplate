"""FastAPI app exposing /api/parse for DWG/DXF quantity takeoff (MVP slice).

Run locally:
    uvicorn backend.main:app --reload --port 8000
"""

from __future__ import annotations

import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from backend.parser import (
    DWGSupportUnavailable,
    UnsupportedFileType,
    parse_drawing,
)

app = FastAPI(title="Axels QTO — parser MVP", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/parse")
async def parse(file: UploadFile = File(...)) -> dict:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in {".dxf", ".dwg"}:
        raise HTTPException(status_code=400, detail="ფაილი უნდა იყოს .dxf ან .dwg")

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = Path(tmp.name)

    try:
        return parse_drawing(tmp_path)
    except DWGSupportUnavailable as exc:
        raise HTTPException(status_code=501, detail=str(exc)) from exc
    except UnsupportedFileType as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"პარსინგი ჩავარდა: {exc}") from exc
    finally:
        tmp_path.unlink(missing_ok=True)
