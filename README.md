# Open Location Number (Dash Number) — Official Reference Specification

[![License: Public Domain](https://img.shields.io/badge/License-Public%20Domain-emerald.svg)](https://creativecommons.org/publicdomain/zero/1.0/)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI Engine](https://img.shields.io/badge/API-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg)](https://vitejs.dev/)
[![Checksum: Damm Algorithm](https://img.shields.io/badge/Checksum-Damm%20Quasigroup-purple.svg)](https://en.wikipedia.org/wiki/Damm_algorithm)
[![Datum: WGS84](https://img.shields.io/badge/Datum-WGS84-orange.svg)](https://en.wikipedia.org/wiki/World_Geodetic_System)

**Open Location Number (Everyday name: Dash Number)** is a purely numeric, language-neutral open geocoding standard for metre-scale location addressing. Inspired by Google's Open Location Code (Plus Codes), Dash Number eliminates the Latin alphabet literacy barrier by using **digits 0–9 only**.

---

## 🌟 Key Features & Innovations

- **100% Digit-Only (0–9)**: Universal numeral fluency across all cultures, dialects, and devices.
- **Position-14 Damm Checksum**: Catches 100% of single typos and adjacent transposition errors over voice calls.
- **1-Tap High-Accuracy Device GPS Geolocation**: Captures exact device GPS coordinates with real street/colony reverse geocoding.
- **Web Speech Audio Dictation**: Native spoken voice transmission in English, Hindi, Spanish, French, Swahili.
- **Base-9 Sub-Cell Grid Tail**: Open-ended precision scaling ($\sim 3.7\text{m}$ default building scale, uncapped sub-metre depth). Zero never appears in grid tail.
- **Hand-Decodable**: Six alternating decimal degree pairs are directly visible as latitude and longitude degrees.

---

## 📐 Mathematical Architecture & Pipeline

```
  LATITUDE / LONGITUDE (WGS84)
               │
               ▼
   [ 1. Coordinate Normalization ] ────► LAT' = LAT + 90 ∈ [0,180], LON' = LON + 180 ∈ [0,360]
               │
               ▼
   [ 2. Macro Zone Digit (Pos 1) ] ────► 1 + (lat_hundreds × 4 + lon_hundreds) → Digit 1–8
               │
               ▼
   [ 3. 6 Decimal Pairs (Pos 2-13)] ───► Interleaved decimal degree pairs (~11m address cell)
               │
               ▼
   [ 4. Damm Checksum (Pos 14) ] ──────► Zoom-invariant anti-symmetric quasigroup check digit
               │
               ▼
   [ 5. Base-9 Grid Tail (Pos 15+)] ──► 3x3 nested cell refinement (Digits 1–9, zero never appears)
               │
               ▼
    FORMATTED DASH NUMBER: 716 5219 2837 466-5  (~3.7m Default Building Precision)
```

---

## 🧪 Worked Example

- **Target Coordinates**: `25.123456` N, `82.987654` E
- **Normalized Coordinates**: `LAT' = 115.123456`, `LON' = 262.987654`
- **Macro Zone Digit**: `1 + (1 × 4 + 2) = 7`
- **Interleaved Backbone**: `7 16 52 19 28 37 46`
- **Damm Checksum Digit**: `6`
- **Base-9 Sub-Cell Digit**: `5`
- **Formatted Dash Number**: **`716 5219 2837 466-5`**

---

## 📁 Repository Structure

```
open-location-number/
├── backend/
│   ├── dash_number.py      # Official Python reference engine & core algorithm
│   ├── main.py             # FastAPI REST service wrapper (/api/encode, /api/decode, etc.)
│   ├── test_spec.py        # Specification verification unit test suite (7/7 tests passed)
│   └── requirements.txt    # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── api/client.js   # REST API client & geocoding helper
│   │   ├── components/     # UI components (Navbar, Hero, Footer, AmbientBackground)
│   │   ├── context/        # ThemeContext (Light / Dark mode state)
│   │   └── pages/          # Web pages (Home, Why, Tech, Docs, Address Maker, Support, Contact, Try)
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── Comparison.md           # Master Technical Comparison vs Plus Codes & DIGIPIN
└── README.md               # Master Repository Specification Document
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Python 3.10 or higher
- Node.js 18.0 or higher & npm

### 1. Launch FastAPI Backend REST Server
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```
- Interactive Swagger API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/api/health`

### 2. Launch Vite React Frontend Platform
```bash
cd frontend
npm install
npm run dev
```
- Open Web Platform: `http://localhost:5173`

### 3. Run Automated Specification Test Suite
```bash
cd backend
python test_spec.py
```
Output:
```text
.......
----------------------------------------------------------------------
Ran 7 tests in 0.001s

OK
```

---

## 🐍 Python SDK Code Examples

The Python reference engine ([dash_number.py](file:///C:/Users/Aadya/Downloads/open-location-number/backend/dash_number.py)) is self-contained with zero external dependencies beyond Python standard library `math`.

```python
from dash_number import encode, decode, validate, shorten, recover_nearest

# 1. Encode Coordinates -> Dash Number
code = encode(28.613939, 77.209021, grid_digits=1)
print(code)
# Output: "715 8762 1039 906-4"

# 2. Decode Dash Number -> Geographic Bounding Box
area = decode("716 5219 2837 466-5")
print(f"Center Lat: {area.lat_center}, Center Lon: {area.lon_center}")
print(f"South: {area.south}, West: {area.west}, North: {area.north}, East: {area.east}")

# 3. Validate Damm Checksum
report = validate("716 5219 2837 466-5")
print(f"Is Valid: {report['is_valid']}") # Output: True

# 4. Shorten relative to local reference point
short_code = shorten("716 5219 2837 466-5", 25.123, 82.987)
print(short_code)
# Output: "8374665"

# 5. Recover full canonical code from shortened form
full_code = recover_nearest("8374665", 25.123, 82.987)
print(full_code)
# Output: "716 5219 2837 466-5"
```

---

## 🔌 REST API & cURL Reference

The backend exposes full HTTP REST endpoints at `http://localhost:8000`:

| Method | Endpoint | Description | JSON Request Body Example |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/encode` | Convert lat/lon to Dash Number | `{"latitude": 28.613939, "longitude": 77.209021, "grid_digits": 1}` |
| `POST` | `/api/decode` | Parse Dash Number to Bounding Box | `{"code": "716 5219 2837 466-5"}` |
| `POST` | `/api/validate` | Run Damm checksum test | `{"code": "716 5219 2837 466-5"}` |
| `POST` | `/api/shorten` | Compute locality short code | `{"code": "716 5219 2837 466-5", "latitude": 25.123, "longitude": 82.987}` |
| `POST` | `/api/recover` | Reconstruct full code from short form | `{"short_code": "8374665", "ref_latitude": 25.123, "ref_longitude": 82.987}` |

### cURL Terminal Example (Encoding Coordinates)
```bash
curl -X POST "http://localhost:8000/api/encode" \
     -H "Content-Type: application/json" \
     -d '{"latitude": 28.613939, "longitude": 77.209021, "grid_digits": 1}'
```
Response:
```json
{
  "code": "715 8762 1039 906-4",
  "cleaned": "715876210399064",
  "grid_digits": 1,
  "cell_size_meters": 3.7,
  "macro_digit": 7,
  "check_digit": 6,
  "latitude": 28.613939,
  "longitude": 77.209021
}
```

---

## 📄 License & Status

This specification and reference code are released under the **[Creative Commons CC0 1.0 Universal (Public Domain Dedication)](https://creativecommons.org/publicdomain/zero/1.0/)**. Free to implement, modify, and deploy for commercial, civil, and governmental applications worldwide.
