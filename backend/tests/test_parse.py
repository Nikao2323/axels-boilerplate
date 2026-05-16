"""End-to-end test: generate a tiny DXF, parse it, assert layer summary.

Uses ezdxf to synthesize a DXF (because Nika's samples are DWG and ODA isn't
installed on CI). When ODA is available, the parser also reads DWG.
"""

from __future__ import annotations

from pathlib import Path

import ezdxf
import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.parser import parse_drawing


@pytest.fixture
def sample_dxf(tmp_path: Path) -> Path:
    doc = ezdxf.new(dxfversion="R2018")
    msp = doc.modelspace()

    doc.layers.add("WALL")
    doc.layers.add("FLOOR")
    doc.layers.add("WINDOW")

    msp.add_line((0, 0), (10, 0), dxfattribs={"layer": "WALL"})
    msp.add_line((10, 0), (10, 5), dxfattribs={"layer": "WALL"})
    msp.add_line((10, 5), (0, 5), dxfattribs={"layer": "WALL"})
    msp.add_line((0, 5), (0, 0), dxfattribs={"layer": "WALL"})

    msp.add_lwpolyline([(0, 0), (10, 0), (10, 5), (0, 5)], close=True, dxfattribs={"layer": "FLOOR"})

    msp.add_circle((3, 2.5), radius=0.4, dxfattribs={"layer": "WINDOW"})
    msp.add_circle((7, 2.5), radius=0.4, dxfattribs={"layer": "WINDOW"})

    path = tmp_path / "test_house.dxf"
    doc.saveas(path)
    return path


def test_parse_returns_expected_layers(sample_dxf: Path) -> None:
    result = parse_drawing(sample_dxf)

    assert result["filename"] == "test_house.dxf"
    assert result["entity_count"] == 7
    assert result["layer_count"] == 3

    layers = {layer["name"]: layer for layer in result["layers"]}
    assert set(layers) == {"WALL", "FLOOR", "WINDOW"}

    assert layers["WALL"]["entity_count"] == 4
    assert layers["WALL"]["total_length_m"] == pytest.approx(30.0, abs=0.001)
    assert layers["WALL"]["entity_types"] == {"LINE": 4}

    assert layers["FLOOR"]["entity_count"] == 1
    assert layers["FLOOR"]["total_length_m"] == pytest.approx(30.0, abs=0.001)

    assert layers["WINDOW"]["entity_count"] == 2
    assert layers["WINDOW"]["entity_types"] == {"CIRCLE": 2}


def test_parse_endpoint(sample_dxf: Path) -> None:
    client = TestClient(app)
    with sample_dxf.open("rb") as f:
        response = client.post("/api/parse", files={"file": ("test_house.dxf", f, "application/dxf")})
    assert response.status_code == 200
    body = response.json()
    assert body["layer_count"] == 3
    assert body["entity_count"] == 7


def test_rejects_unsupported_extension() -> None:
    client = TestClient(app)
    response = client.post("/api/parse", files={"file": ("foo.txt", b"hello", "text/plain")})
    assert response.status_code == 400


def test_dwg_without_oda_returns_501(tmp_path: Path) -> None:
    """If ODA is missing, DWG upload should fail with 501, not crash."""
    from ezdxf.addons import odafc

    if odafc.is_installed():
        pytest.skip("ODA installed — this is the 'missing' path")

    fake_dwg = tmp_path / "fake.dwg"
    fake_dwg.write_bytes(b"AC1032" + b"\0" * 100)

    client = TestClient(app)
    with fake_dwg.open("rb") as f:
        response = client.post("/api/parse", files={"file": ("fake.dwg", f, "application/octet-stream")})
    assert response.status_code == 501
