# Dash Number vs. Open Location Code (Plus Codes) & DIGIPIN — Technical Comparison

[![Specification: Public Domain](https://img.shields.io/badge/Specification-Public%20Domain-emerald.svg)](https://creativecommons.org/publicdomain/zero/1.0/)
[![Checksum: Damm Algorithm](https://img.shields.io/badge/Checksum-Damm%20Quasigroup-purple.svg)](https://en.wikipedia.org/wiki/Damm_algorithm)
[![Validation: 100% Passed](https://img.shields.io/badge/Validation-7%2F7%20Tests%20Passed-brightgreen.svg)](#validation)

---

## 📌 Executive Summary

**Dash Number** (technically *Open Location Number*) is an open geocoding standard similar in purpose to Google's Open Location Code (Plus Codes) and India Post's DIGIPIN, but built **entirely from decimal digits 0–9**. 

While Plus Codes and DIGIPIN rely on alphanumeric symbol sets containing Latin letters (`C, F, G, H, J, M, P...`), Dash Number's core thesis is that **digit-only character sets are universally accessible across humanity**. Almost everyone on Earth—regardless of spoken language, dialect, or alphabetic literacy—can read, dictate over voice calls, and key the numbers 0–9 on basic feature phones.

A standard Dash Number looks like this:
```text
716 5219 2837 466-5
```

---

## 📐 Structural Architecture Breakdown

| Component | Length | Character Set | Purpose & Mathematical Engine |
| :--- | :--- | :--- | :--- |
| **Macro Digit** | 1 digit | `1–8` | Identifies one of 8 global geographic zones. Prevents leading `0` or `9`. |
| **Location Digits** | 12 digits | `0–9` | Six alternating latitude/longitude decimal degree pairs (tens to $0.0001^\circ$). Hand-decodable without lookup tables. |
| **Check Digit** | 1 digit | `0–9` | Position 14 Damm quasigroup checksum. Catches 100% of single typos & adjacent swaps. |
| **Grid Digits** | Open-ended | `1–9` | 3x3 nested sub-cell refinement ($\times 3$ scale reduction per digit). Digit `0` never appears in grid tail. |

> **Backbone Structure**: Positions 1–14 (Macro + Location + Check) = 14 digits, always present.  
> **Grid Tail**: Separated by a single hyphen (`-`), added for sub-metre precision scaling.

---

## 📊 Comprehensive Comparison Matrix

| Feature / Metric | Google Plus Codes | DIGIPIN (India Post) | Open Location Number (Dash) |
| :--- | :--- | :--- | :--- |
| **Character Set** | 20 symbols (incl. 12 letters) | 16 symbols (incl. 8 letters) | **Digits 0–9 Only** |
| **Alphabet Literacy Required** | Yes (Latin Alphabet) | Yes (Latin Alphabet) | **None (Pure Decimal Numerals)** |
| **Spoken Voice Dictation** | Requires spelling (*"C as in Charlie"*) | Requires spelling | **Native counting numerals in all languages** |
| **Error Detection System** | None | None | **Damm Quasigroup Checksum (Position 14)** |
| **Precision Scaling Engine** | $\times 20$ per pair, fixed | Hierarchical bounding grid | **Base-9 3x3 sub-cells, $\times 3$ per digit, uncapped** |
| **Default Precision Scale** | ~14 m² | ~4 m | **~3.7 m (15 digits)** |
| **Hand-Decodable to Lat/Lon** | No (Requires lookup table) | No (Requires lookup table) | **Yes (Direct decimal degree pairs)** |
| **Shortening Rule** | Drops **even** digits (4, 6, 8) | Locality prefix lookup | **Drops ODD digits (5, 7, 9) due to 1-digit macro** |
| **Zoom-Invariant Checksum** | N/A | N/A | **Yes (Checksum excludes grid tail)** |
| **Ecosystem Status** | Widely adopted in Google Maps | Official Indian postal standard | **Open reference specification (Adoption Phase)** |

---

## 💡 Why This Difference Matters

### 1. Removing the Literacy Barrier
Plus Codes and DIGIPIN solve the problem of addressing unmapped places. Dash Number solves that same problem while removing a secondary, critical barrier: **needing to read a specific alphabet**. A phone-number-style, digits-only code can be dictated over a voice call, texted via feature phone SMS, and read back aloud in any regional language using nothing more than basic numeral fluency.

### 2. Guaranteed Transmission Error Detection
Because Plus Codes contain no built-in checksum, a mistyped letter over a phone call silently points to an incorrect location hundreds of kilometres away. Dash Number includes a **position-14 Damm checksum digit** that instantly flags any single-digit substitution or adjacent digit swap as invalid before navigation begins.

---

## 🧪 Verification & Test Results

The reference Python engine (`dash_number.py`) has been verified against an automated specification test suite (`test_spec.py`):

```bash
python test_spec.py
.......
----------------------------------------------------------------------
Ran 7 tests in 0.001s

OK
```

### Verified Test Assertions:
1. **Worked Example Test**: Encoding `(25.123456, 82.987654)` produces `716 5219 2837 466-5`. Decoding returns to the exact centre of the ~3.7m cell, with the Damm check digit (`6`) confirmed valid.
2. **Single-Digit Typo Catch**: Modifying any single digit (e.g. `716 5319 2837 466-5`) causes Damm evaluation to fail (`is_valid = False`).
3. **Adjacent Transposition Catch**: Swapping adjacent digits (e.g. `761 5219 2837 466-5`) is 100% caught by the quasigroup matrix.
4. **Base-9 Grid Tail Zero Exclusion**: Evaluated across global coordinate quadrants; grid digits 15+ contain digits `1–9` only (`0` never occurs in grid tail).
5. **Roundtrip Decode Boundary**: Coordinates across all 4 hemispheres decode cleanly into bounding boxes containing the original target coordinates.
6. **Shortening & Recovery**: Dropping 5, 7, or 9 leading digits relative to a local reference point recovers the full canonical code accurately.

---

## ⚠️ Known Limitation & Ecosystem Outlook

Unlike Google Plus Codes, Dash Number currently has no pre-existing ecosystem—there is no native button in third-party commercial mapping software yet. 

This represents an **adoption gap, not a flaw in the underlying mathematics**. Because the algorithm is released under a **Public Domain (CC0)** specification, any enterprise, postal service, logistics provider, or municipality can integrate the self-contained reference code into their existing GIS stack with zero licensing fees.
