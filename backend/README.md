# 🏗️ Backend — Parser MVP

FastAPI + ezdxf-ზე აგებული DWG/DXF parser. ეს არის **MVP slice** —
ერთი endpoint, რომელიც ფაილში layer-ებს და მათ entity-ებს კითხულობს.

## დაყენება

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## გაშვება

რეპოს root-დან:

```bash
uvicorn backend.main:app --reload --port 8000
```

გახსენი http://localhost:8000/docs Swagger-ისთვის.

## Endpoint-ები

### `GET /health`

```json
{"status": "ok"}
```

### `POST /api/parse`

ფაილის ატვირთვა (`multipart/form-data`, ველი: `file`).

**პასუხის მაგალითი:**

```json
{
  "filename": "house6.dxf",
  "layer_count": 12,
  "entity_count": 1843,
  "layers": [
    {
      "name": "WALL",
      "entity_count": 124,
      "total_length_m": 287.451,
      "entity_types": {"LINE": 90, "LWPOLYLINE": 34}
    }
  ]
}
```

## DWG vs DXF

- **DXF** — ezdxf-ით პირდაპირ იკითხება ✅
- **DWG** — საჭიროა [ODA File Converter](https://www.opendesign.com/guestfiles/oda_file_converter)
  დაყენებული PATH-ზე. თუ არ არის, parser ბრუნებს `501 Not Implemented`.
  ალტერნატივა — AutoCAD-დან DXF-ად ექსპორტი.

## ტესტი

```bash
backend/.venv/bin/pytest backend/tests/ -v
```

## შემდეგი ნაბიჯები (post-MVP)

- მასალის გადათარგმნა (Nika-ს `NIKAO_README.md` layer→material ცხრილით)
- მოცულობების გამოთვლა (closed polyline → area × thickness)
- Excel ექსპორტი (Kote-ს ფორმატით — `KTODU_README.md`)
- Frontend upload + dashboard (Davit-ის #3)
