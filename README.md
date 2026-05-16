# 📐 Arsi — DWG vs Excel Checker

DWG/DXF architectural drawings + Excel ბიუჯეტი → ავტომატური შემოწმება
(სართულების ფართები, ბიუჯეტის რაოდენობები, ratio-checks კალიბრებული
6 საცნობარო პროექტზე).

## სტრუქტურა

| ფაილი | რა აკეთებს |
| --- | --- |
| `server.py` | FastAPI server — UI + `POST /compare` endpoint |
| `compare.py` | DWG→DXF (AutoCAD-ის accoreconsole-ით), polygon extraction, Excel parsing, ratio checks |
| `report.py` | Excel ანგარიშების გენერაცია (KTODU ფორმატით) |
| `run_all.py` | CLI batch runner — `samples/` საქაღალდე → Excel ანგარიში |
| `static/index.html` | Vanilla HTML/CSS/JS UI — drag-and-drop, verdict, ცხრილები |
| `samples/` | 6 DWG + 6 Excel წყვილი საცნობარო პროექტებისთვის |

## გაშვება

```bash
pip install -r requirements.txt
python3 server.py
```

გახსენი http://localhost:8000

CLI batch:

```bash
python3 run_all.py                       # ყველა წყვილი samples/-დან
python3 run_all.py სახლი14.dwg budget.xlsx  # ერთი წყვილი
```

## Environment variables

| Variable | Default | რას აკეთებს |
| --- | --- | --- |
| `ARSI_UPLOAD_DIR` | OS temp dir | სად დააროლოს ატვირთული ფაილები. AutoCAD-ის გამოყენებისას — Windows-accessible path |
| `ARSI_AUTOCAD_EXE` | `/mnt/c/Program Files/Autodesk/AutoCAD 2021/accoreconsole.exe` | AutoCAD-ის accoreconsole.exe-ის გზა (DWG→DXF-სთვის) |

DWG ფაილების კონვერსიისთვის საჭიროა AutoCAD დაყენებული. DXF ფაილები
პირდაპირ მუშაობს, AutoCAD-ის გარეშე.

## Team docs

- [`NIKAO_README.md`](NIKAO_README.md) — ნიკას სამუშაო სივრცე (layer→material specs)
- [`KTODU_README.md`](KTODU_README.md) — კოტეს Excel ფორმატის სპეციფიკაცია
- [`IDEAS.md`](IDEAS.md) — გუნდის იდეების სია (davitbuchukuri ამტკიცებს)
