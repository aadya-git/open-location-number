"""Open Location Number — official reference encoder / decoder.

Everyday name: Dash Number. A purely numeric geocode: a location is encoded as
decimal digits only, so it can be read, spoken, and keyed by anyone numerate,
regardless of alphabet.

Canonical layout (string indices are 0-based; the spec document numbers them 1-based):

====================  =========================================================
position 0            macro digit 1-8, packing the hundreds of
                      ``LAT' = lat + 90`` (0-1) and ``LON' = lon + 180`` (0-3)
positions 1-12        six decimal pairs (one latitude digit, one longitude
                      digit) for tens, units, .1, .01, .001, .0001 -> ~11 m cell
position 13           Damm check digit over the BACKBONE only (positions 0-12).
                      Its scope excludes the grid, so it is identical at every
                      zoom level and, sitting after the location digits, it does
                      not disturb geographic ordering.
positions 14+         base-9 grid digits (1-9), each a 3x3 refinement.
                      Open-ended and unchecked; 0 is never used, so a 0 in the
                      grid tail is invalid.
====================  =========================================================

Grid depth (``grid_len``): 0 -> address form (~11 m), 1 -> default (~3.7 m),
3 -> ~0.41 m, and finer on demand.

Display form: the 14 base-10 digits are grouped 3-4-4-3 and the grid digits in
threes; spaces separate groups and a single hyphen marks the base-10 | base-9
boundary, present only when grid digits exist::

    716 5219 2837 466-5     default, ~3.7 m
    716 5219 2837 466       address form, ~11 m (no hyphen)
    716 5219 2837 466-583   sub-metre, ~0.41 m

The macro is the 1st digit and the check the 14th; the check digit (6 in the
examples above) is identical at every depth.
"""

from __future__ import annotations

import math
from typing import NamedTuple, Optional, Dict, Any, Union

# --- physical constants (WGS84, equatorial best case) ----------------------
LON_M_PER_DEG = 40_075_017.0 / 360   # metres per degree of longitude at equator
LAT_M_PER_DEG = 20_003_931.0 / 180   # metres per degree of latitude

# --- layout constants ------------------------------------------------------
DECIMAL_WEIGHTS = (10, 1, 0.1, 0.01, 0.001, 0.0001)  # the six decimal pairs
BACKBONE_LEN = 13          # macro digit + 12 decimal digits
CHECK_INDEX = 13           # 0-based index of the check digit
GRID_START = 14            # 0-based index where grid digits begin
CELL_DEG = 0.0001          # degrees spanned by the finest decimal pair
REMOVAL_LEVELS = (9, 7, 5)  # locality short form: odd removals, most aggressive first

# Damm algorithm operation table (a totally anti-symmetric quasigroup).
_DAMM_TABLE = (
    (0, 3, 1, 7, 5, 9, 8, 6, 4, 2),
    (7, 0, 9, 2, 1, 5, 4, 8, 6, 3),
    (4, 2, 0, 6, 8, 7, 1, 3, 5, 9),
    (1, 7, 5, 0, 9, 8, 3, 4, 2, 6),
    (6, 1, 2, 3, 0, 4, 5, 9, 7, 8),
    (3, 6, 7, 4, 2, 0, 9, 5, 8, 1),
    (5, 8, 6, 9, 7, 2, 0, 1, 3, 4),
    (8, 9, 4, 5, 3, 6, 2, 0, 1, 7),
    (9, 4, 3, 8, 6, 1, 7, 2, 0, 5),
    (2, 5, 8, 1, 4, 3, 6, 7, 9, 0),
)


class DecodeResult(NamedTuple):
    """Result of decoding a code: the cell-centre coordinates and whether the
    check digit matched."""

    latitude: float
    longitude: float
    valid: bool


class ShortCode(NamedTuple):
    """Result of shortening: how many leading digits were dropped and the
    displayable tail (to be paired with a place name)."""

    removed: int
    tail: str


class CodeArea(NamedTuple):
    """Geographic bounding box for backward compatibility with FastAPI endpoints."""
    south: float
    west: float
    north: float
    east: float
    lat_center: float
    lon_center: float
    grid_digits: int
    code_length: int


def damm_check_digit(digits: str) -> int:
    """Return the Damm check digit (0-9) for a string of digits.

    A single mistyped digit, or any transposition of two adjacent digits,
    changes the result, so it can be used to reject corrupted codes.
    """
    interim = 0
    for char in digits:
        interim = _DAMM_TABLE[interim][int(char)]
    return interim


def _backbone(latitude: float, longitude: float) -> tuple[str, float, float]:
    """Build the 13 zoom-invariant digits (macro + 12 decimal).

    Returns the backbone string and the leftover latitude/longitude residuals
    within the final 0.0001-degree cell (used to compute grid digits).
    """
    lat = latitude + 90.0    # -> [0, 180]
    lon = longitude + 180.0  # -> [0, 360]
    lat_hundreds = int(lat // 100)   # 0 or 1
    lon_hundreds = int(lon // 100)   # 0..3
    macro = 1 + (lat_hundreds * 4 + lon_hundreds)   # 1..8

    digits = [str(macro)]
    residual_lat = lat - lat_hundreds * 100
    residual_lon = lon - lon_hundreds * 100
    for weight in DECIMAL_WEIGHTS:
        lat_digit = int(residual_lat // weight)
        lon_digit = int(residual_lon // weight)
        residual_lat -= lat_digit * weight
        residual_lon -= lon_digit * weight
        digits.append(str(lat_digit))
        digits.append(str(lon_digit))
    return "".join(digits), residual_lat, residual_lon


def _grid_digits(residual_lat: float, residual_lon: float, depth: int) -> str:
    """Return ``depth`` base-9 grid digits (each 1-9) refining the cell 3x3."""
    frac_lat = residual_lat / CELL_DEG   # in [0, 1)
    frac_lon = residual_lon / CELL_DEG
    digits = []
    for _ in range(depth):
        row = int(frac_lat * 3)
        col = int(frac_lon * 3)
        row = max(0, min(2, row))
        col = max(0, min(2, col))
        digits.append(str(row * 3 + col + 1))   # 1..9 (0 never used)
        frac_lat = frac_lat * 3 - row
        frac_lon = frac_lon * 3 - col
    return "".join(digits)


def encode(latitude: float, longitude: float, grid_len: int = 1,
           *, grouped: bool = True) -> str:
    """Encode coordinates to an Open Location Number.

    Args:
        latitude: WGS84 latitude in degrees, [-90, 90].
        longitude: WGS84 longitude in degrees, [-180, 180].
        grid_len: number of base-9 grid digits. 0 = address (~11 m),
            1 = default (~3.7 m), 3 = sub-metre, and so on.
        grouped: if True, return the spaced/hyphenated display form; otherwise
            return the bare digit string.

    Returns:
        The encoded code, grouped for display by default.
    """
    lat = max(-90.0, min(90.0, latitude))
    lon = max(-180.0, min(180.0, longitude))
    if lat == 90.0:
        lat = 89.99999999
    if lon == 180.0:
        lon = 179.99999999

    backbone, residual_lat, residual_lon = _backbone(lat, lon)
    check = damm_check_digit(backbone)
    raw = f"{backbone}{check}{_grid_digits(residual_lat, residual_lon, grid_len)}"
    return group(raw) if grouped else raw


def group(raw: str) -> str:
    """Format a bare digit string for display.

    The 14 base-10 digits are grouped 3-4-4-3 and the grid digits in threes,
    with a single hyphen at the base-10 | base-9 boundary (only when grid
    digits are present).
    """
    base10 = raw[:GRID_START]
    grid = raw[GRID_START:]
    groups = [base10[0:3], base10[3:7], base10[7:11], base10[11:14]]
    text = " ".join(groups)
    if not grid:
        return text
    grid_groups = " ".join(grid[i:i + 3] for i in range(0, len(grid), 3))
    return f"{text}-{grid_groups}"


def clean_code(code_str: str) -> str:
    """Strips spaces and hyphens from an Open Location Number."""
    return code_str.replace(" ", "").replace("-", "").strip()


def format_code(raw_digits: str) -> str:
    """Helper alias to group raw digits."""
    return group(clean_code(raw_digits))


def decode(code: str) -> DecodeResult:
    """Decode a code (any spacing/hyphen) to the centre of its cell.

    Returns a :class:`DecodeResult`; ``valid`` reports whether the backbone
    check digit matched.
    """
    digits = clean_code(code)
    if len(digits) < BACKBONE_LEN + 1:
        raise ValueError("Code is too short (minimum 14 digits required).")

    backbone = digits[:BACKBONE_LEN]
    check = int(digits[CHECK_INDEX])
    valid = damm_check_digit(backbone) == check

    macro_index = int(digits[0]) - 1
    lat = (macro_index // 4) * 100.0
    lon = (macro_index % 4) * 100.0
    pos = 1
    for weight in DECIMAL_WEIGHTS:
        lat += int(digits[pos]) * weight
        lon += int(digits[pos + 1]) * weight
        pos += 2

    frac_lat = 0.0
    frac_lon = 0.0
    scale = 1.0
    grid = digits[GRID_START:]
    for char in grid:
        cell = int(char) - 1   # grid digits are 1..9
        if cell < 0 or cell > 8:
            raise ValueError("Grid digits must be 1-9 (zero is invalid in grid).")
        scale /= 3
        frac_lat += (cell // 3) * scale
        frac_lon += (cell % 3) * scale
    frac_lat += scale / 2   # centre of the remaining cell
    frac_lon += scale / 2
    lat += frac_lat * CELL_DEG
    lon += frac_lon * CELL_DEG
    return DecodeResult(lat - 90.0, lon - 180.0, valid)


def decode_area(code: str) -> CodeArea:
    """Decodes code into CodeArea bounding box structure for API compatibility."""
    digits = clean_code(code)
    if len(digits) < BACKBONE_LEN + 1:
        raise ValueError("Code is too short (minimum 14 digits required).")

    res = decode(code)
    if not res.valid:
        raise ValueError("Checksum verification failed: Code has mistyped or transposed digits.")

    grid = digits[GRID_START:]
    scale = CELL_DEG
    for _ in grid:
        scale /= 3.0

    lat_center = res.latitude
    lon_center = res.longitude
    south = lat_center - (scale / 2.0)
    north = lat_center + (scale / 2.0)
    west = lon_center - (scale / 2.0)
    east = lon_center + (scale / 2.0)

    return CodeArea(
        south=round(south, 8),
        west=round(west, 8),
        north=round(north, 8),
        east=round(east, 8),
        lat_center=round(lat_center, 8),
        lon_center=round(lon_center, 8),
        grid_digits=len(grid),
        code_length=len(digits)
    )


def validate(code_str: str) -> Dict[str, Any]:
    """Validates an Open Location Number string and provides diagnostic metadata."""
    try:
        digits = clean_code(code_str)
        if len(digits) < 14:
            return {
                "is_valid": False,
                "error_message": "Code is too short (minimum 14 digits required).",
                "is_short": True,
                "grid_depth": 0,
                "total_digits": len(digits)
            }
        
        # Check grid digits for zero
        grid_digits = digits[GRID_START:]
        if '0' in grid_digits:
            return {
                "is_valid": False,
                "error_message": "Invalid grid digit '0' detected. Grid digits must be 1-9.",
                "is_short": False,
                "grid_depth": len(grid_digits),
                "total_digits": len(digits)
            }

        res = decode(code_str)
        if not res.valid:
            return {
                "is_valid": False,
                "error_message": "Checksum verification failed: Code has mistyped or transposed digits.",
                "is_short": False,
                "grid_depth": len(grid_digits),
                "total_digits": len(digits)
            }
            
        return {
            "is_valid": True,
            "error_message": None,
            "is_short": False,
            "grid_depth": len(grid_digits),
            "total_digits": len(digits)
        }
    except Exception as err:
        return {
            "is_valid": False,
            "error_message": str(err),
            "is_short": False,
            "grid_depth": 0,
            "total_digits": len(clean_code(code_str))
        }


# --- Locality Short Form ---------------------------------------------------

def _to_ten_thousandths(degrees: float) -> int:
    """Floor a (already-offset, non-negative) degree value to integer
    ten-thousandths, matching the truncation used by :func:`encode`."""
    return int(degrees * 1e4 + 1e-6)


def _backbone_from_ten_thousandths(lat_tt: int, lon_tt: int) -> str:
    """Rebuild the 13-digit backbone from integer ten-thousandths of LAT'/LON'."""
    macro = 1 + ((lat_tt // 1_000_000) * 4 + (lon_tt // 1_000_000))
    digits = [str(macro)]
    for divisor in (100_000, 10_000, 1_000, 100, 10, 1):
        digits.append(str((lat_tt // divisor) % 10))
        digits.append(str((lon_tt // divisor) % 10))
    return "".join(digits)


def _nearest_congruent(reference: int, low: int, period: int) -> int:
    """Return the value congruent to ``low`` (mod ``period``) nearest ``reference``."""
    return round((reference - low) / period) * period + low


def _format_short(base10_full: str, removed: int, grid: str) -> str:
    """Group a shortened code on the same 3-4-4-3 skeleton as the full code, so
    the kept digits stay in their original slots (the place name fills the
    dropped leading groups)."""
    bounds = ((0, 3), (3, 7), (7, 11), (11, 14))
    parts = [base10_full[max(start, removed):end] for start, end in bounds]
    parts = [part for part in parts if part]
    text = " ".join(parts)
    if grid:
        grid_groups = " ".join(grid[i:i + 3] for i in range(0, len(grid), 3))
        text = f"{text}-{grid_groups}"
    return text


def _ten_thousandths_from_code(raw_digits: str) -> tuple[int, int]:
    """Extract exact integer ten-thousandths of LAT'/LON' directly from backbone digits."""
    macro = int(raw_digits[0]) - 1
    lat_hundreds = macro // 4
    lon_hundreds = macro % 4
    lat_tt = lat_hundreds * 1_000_000
    lon_tt = lon_hundreds * 1_000_000
    for pos, w in zip(range(1, 13, 2), (100_000, 10_000, 1_000, 100, 10, 1)):
        lat_tt += int(raw_digits[pos]) * w
        lon_tt += int(raw_digits[pos + 1]) * w
    return lat_tt, lon_tt


def shorten(
    code_or_lat: Union[str, float],
    lon_or_ref_lat: float,
    ref_lat_or_ref_lon: float,
    ref_longitude: Optional[float] = None,
    grid_len: int = 1
) -> Optional[ShortCode]:
    """Drop the largest safe ODD number of leading digits (5, 7, or 9) that a
    reference point near ``(ref_latitude, ref_longitude)`` can recover.

    Supports both signatures:
        shorten(code_str, ref_latitude, ref_longitude)
        shorten(latitude, longitude, ref_latitude, ref_longitude, grid_len)

    Returns a :class:`ShortCode` (``removed`` count and displayable ``tail``),
    or ``None`` if the reference is too far to shorten (send the full code).
    """
    if isinstance(code_or_lat, str):
        code_str = code_or_lat
        ref_lat = lon_or_ref_lat
        ref_lon = ref_lat_or_ref_lon
        raw = clean_code(code_str)
        res = decode(code_str)
        if not res.valid:
            raise ValueError("Cannot shorten code with invalid checksum.")
        lat_tt, lon_tt = _ten_thousandths_from_code(raw)
    else:
        lat = code_or_lat
        lon = lon_or_ref_lat
        ref_lat = ref_lat_or_ref_lon
        ref_lon = ref_longitude if ref_longitude is not None else 0.0
        raw = encode(lat, lon, grid_len, grouped=False)
        lat_tt = _to_ten_thousandths(lat + 90)
        lon_tt = _to_ten_thousandths(lon + 180)

    base10_full = raw[:GRID_START]
    grid = raw[GRID_START:]

    ref_lat_tt = _to_ten_thousandths(ref_lat + 90)
    ref_lon_tt = _to_ten_thousandths(ref_lon + 180)

    for removed in REMOVAL_LEVELS:
        pairs_dropped = (removed - 1) // 2
        period = 10 ** (6 - pairs_dropped)   # repeat period, ten-thousandths of a degree
        if (abs(lat_tt - ref_lat_tt) < period // 2
                and abs(lon_tt - ref_lon_tt) < period // 2):
            return ShortCode(removed, _format_short(base10_full, removed, grid))
    return None


def recover_nearest(tail: str, ref_latitude: float,
                    ref_longitude: float) -> DecodeResult:
    """Recover full coordinates from a shortened ``tail`` and a nearby reference.

    The reference comes from geocoding the place name that replaced the leading
    digits. ``valid`` in the result reports whether the backbone check digit
    matched after reconstruction (a too-distant reference recovers the wrong
    cell and fails the check).
    """
    base10, _, grid = "".join(tail.split()).partition("-")
    removed = GRID_START - len(base10)
    
    if removed not in REMOVAL_LEVELS and removed != 0:
        raise ValueError(f"Invalid shortening removal level: {removed}. Must be 5, 7, or 9.")

    if removed == 0:
        return decode(f"{base10}{grid}")

    pairs_dropped = (removed - 1) // 2
    period = 10 ** (6 - pairs_dropped)
    decimals = base10[:-1]
    check = base10[-1]

    place = 10 ** (5 - pairs_dropped)
    low_lat = 0
    low_lon = 0
    for i in range(0, len(decimals), 2):
        low_lat += int(decimals[i]) * place
        low_lon += int(decimals[i + 1]) * place
        place //= 10

    ref_lat_tt = _to_ten_thousandths(ref_latitude + 90)
    ref_lon_tt = _to_ten_thousandths(ref_longitude + 180)
    lat_tt = _nearest_congruent(ref_lat_tt, low_lat, period)
    lon_tt = _nearest_congruent(ref_lon_tt, low_lon, period)
    backbone = _backbone_from_ten_thousandths(lat_tt, lon_tt)
    
    reconstructed_full = f"{backbone}{check}{grid}"
    res = decode(reconstructed_full)
    if not res.valid:
        raise ValueError("Recovery failed: Reconstructed backbone failed Damm checksum verification.")
        
    return res
