# 📊 Excel რეპორტის სტრუქტურა — ktodu2015-rgb

## 1. სათაური

```
სამშენებლო მასალების ცხრილი
პროექტი: [პროექტის სახელი]    თარიღი: [DD.MM.YYYY]
```

მერჯ: A1:G1 — ცენტრში, Bold, შრიფტი 16px

---

## 2. სვეტები

| სვეტი | სახელი (ქართ.) | key | სიგანე |
|-------|----------------|-----|--------|
| A | კატეგორია | category | 20 |
| B | მასალა | material | 30 |
| C | ზომა/სპეციფიკაცია | specification | 20 |
| D | ერთეული | unit | 12 |
| E | რაოდენობა | quantity | 14 |
| F | ერთ. ფასი (₾) | unitPrice | 14 |
| G | სულ (₾) | total | 14 |

---

## 3. ფერები

| ელემენტი | ფერი | ARGB კოდი |
|----------|------|-----------|
| Header (სათაური) | მუქი ლურჯი | `FF1E3A5F` |
| Header ტექსტი | თეთრი | `FFFFFFFF` |
| კენტი სტრიქონები | ღია ნაცრისფერი | `FFF2F4F7` |
| ლუწი სტრიქონები | თეთრი | `FFFFFFFF` |
| კატეგორიის სტრიქონი | ღია ლურჯი | `FFD6E4F0` |
| სულ-ის სტრიქონი | ღია მწვანე | `FFE2F0E4` |

> **მაგალითი:** Worklenz-ის `reporting-members-controller.ts`-ში გამოყენებულ lavender `#E6E6FA`-ს ნაცვლად ვიყენებთ `#1E3A5F` (კონსტრუქციის პროექტისთვის მძიმე ლურჯი).

---

## 4. კატეგორიები

| კატეგორია | შემადგენლობა |
|-----------|-------------|
| 🧱 კედლები | აგური, ბლოკი, გამწყვეტი, შტუკატური |
| 🏠 ჭერი | გირდი, ფიცარი, სახურავი, საიზოლაციო |
| 🚪 კარ-ფანჯარა | კარი, ჩარჩო, საკეტი, მინა, ფანჯარა |
| 🔧 სანტექნიკა | მილი, შლანგი, ონკანი, ბაქანი |
| ⚡ ელექტრო | კაბელი, გამჭრელი, როზეტი, ამომრთველი |
| 🪵 სხვა | ინსტრუმენტი, სარეზერვო, სხვადასხვა |

---

## 5. დამატებითი პარამეტრები

- **თარიღი გამოჩნდეს?** ✅ — ზედა მარჯვენა კუთხე (B2)
- **ნახაზის სახელი გამოჩნდეს?** ✅ — A2 უჯრა
- **სულ ჯამი?** ✅ — ბოლო სტრიქონი, G სვეტი, Bold + მწვანე ფონი
- **სვეტების ავტო-სიგანე?** ✅ — `column.width = Math.max(header.length, 12)`
- **ჩაკეტილი header?** ✅ — `worksheet.views = [{ state: 'frozen', ySplit: 3 }]`
- **შრიფტი:** Calibri, 11px ძირითადი / 16px სათაური

---

## 6. ExcelJS სტრუქტურის მინიშნება

```typescript
// სათაური — გამყიდველ Worklenz/BizzAI პატერნებზე დაყრდნობით
worksheet.mergeCells('A1:G1');
worksheet.getCell('A1').value = 'სამშენებლო მასალების ცხრილი';
worksheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
worksheet.getCell('A1').alignment = { horizontal: 'center' };

// Header სტრიქონი (მე-3 სტრიქონი)
worksheet.getRow(3).font = { bold: true, color: { argb: 'FFFFFFFF' } };
worksheet.getRow(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };

// კენტი სტრიქონების ალტერნატიული ფერი
rows.forEach((row, i) => {
  if (i % 2 === 0) {
    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F4F7' } };
  }
});
```

---

## 7. Pull Request

**Branch:** `feature/reports`
**Reviewer:** `davitbuchukuri`
**სტატუსი:** მზადაა დასამტკიცებლად ✅

---
*Branch: ktodu2015-rgb | განახლებულია: 2026-05-16*
