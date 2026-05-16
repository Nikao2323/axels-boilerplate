"""DWG/DXF layer summary parser.

DXF is read natively by ezdxf. DWG requires the ODA File Converter to be
installed (ezdxf.addons.odafc detects it on PATH).
"""

from __future__ import annotations

import math
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

import ezdxf
from ezdxf.addons import odafc


class UnsupportedFileType(Exception):
    pass


class DWGSupportUnavailable(Exception):
    pass


@dataclass(frozen=True)
class LayerSummary:
    name: str
    entity_count: int
    total_length_m: float
    entity_types: dict[str, int]


def parse_drawing(path: Path) -> dict:
    suffix = path.suffix.lower()
    if suffix == ".dxf":
        doc = ezdxf.readfile(path)
    elif suffix == ".dwg":
        if not odafc.is_installed():
            raise DWGSupportUnavailable(
                "DWG ფაილების წასაკითხად საჭიროა ODA File Converter. "
                "გადააქცია ფაილი DXF-ად, ან დააყენე ODA File Converter."
            )
        doc = odafc.readfile(str(path))
    else:
        raise UnsupportedFileType(f"მხარდაჭერილია მხოლოდ .dxf და .dwg (მიღებულია: {suffix})")

    msp = doc.modelspace()
    counts: dict[str, int] = {}
    lengths: dict[str, float] = {}
    types: dict[str, Counter] = {}

    for entity in msp:
        layer = entity.dxf.layer
        counts[layer] = counts.get(layer, 0) + 1
        lengths[layer] = lengths.get(layer, 0.0) + _safe_length(entity)
        types.setdefault(layer, Counter())[entity.dxftype()] += 1

    layers = [
        LayerSummary(
            name=name,
            entity_count=counts[name],
            total_length_m=round(lengths[name], 3),
            entity_types=dict(types[name]),
        )
        for name in sorted(counts)
    ]

    return {
        "filename": path.name,
        "layer_count": len(layers),
        "entity_count": sum(counts.values()),
        "layers": [layer.__dict__ for layer in layers],
    }


def _safe_length(entity) -> float:
    try:
        dxftype = entity.dxftype()
        if dxftype == "LINE":
            return (entity.dxf.end - entity.dxf.start).magnitude
        if dxftype == "CIRCLE":
            return 2.0 * math.pi * entity.dxf.radius
        if dxftype == "ARC":
            sweep = (entity.dxf.end_angle - entity.dxf.start_angle) % 360.0
            return math.radians(sweep) * entity.dxf.radius
        if dxftype == "LWPOLYLINE":
            points = [(p[0], p[1]) for p in entity.get_points("xy")]
            if entity.closed and len(points) > 2:
                points.append(points[0])
            return sum(
                math.hypot(points[i + 1][0] - points[i][0], points[i + 1][1] - points[i][1])
                for i in range(len(points) - 1)
            )
        if dxftype == "POLYLINE":
            verts = [(v.dxf.location.x, v.dxf.location.y) for v in entity.vertices]
            if entity.is_closed and len(verts) > 2:
                verts.append(verts[0])
            return sum(
                math.hypot(verts[i + 1][0] - verts[i][0], verts[i + 1][1] - verts[i][1])
                for i in range(len(verts) - 1)
            )
    except Exception:
        pass
    return 0.0
