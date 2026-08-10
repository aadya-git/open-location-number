"""
Open Location Number (Dash Number) API Server.

===============================================================================
Purpose:
    FastAPI backend web service wrapping the reference implementation dash_number.py.

Responsibility:
    - Expose HTTP REST endpoints for encoding, decoding, validation, shortening,
      and recovery of Open Location Numbers.
    - Provide CORS support for local and web client consumption.
    - Handle parameter validation and return clear diagnostic API error responses.

Related Files:
    - backend/dash_number.py: Core geocoding algorithm engine.
    - frontend/src/api/client.js: Frontend HTTP client consuming these endpoints.
===============================================================================
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

from dash_number import (
    encode as dash_encode,
    decode as dash_decode,
    decode_area as dash_decode_area,
    validate as dash_validate,
    shorten as dash_shorten,
    recover_nearest as dash_recover,
    clean_code,
    format_code,
    CodeArea
)

app = FastAPI(
    title="Open Location Number (Dash Number) API",
    description="Official API for encoding, decoding, and validating pure-numeric Dash Numbers.",
    version="1.0.0"
)

# Enable CORS for local frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request & Response Models
class EncodeRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude in degrees WGS84")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude in degrees WGS84")
    grid_digits: int = Field(default=1, ge=0, le=8, description="Base-9 grid refinement digits (0 for ~11m address form, 1 for ~3.7m default)")

class DecodeRequest(BaseModel):
    code: str = Field(..., description="Open Location Number string (with or without spaces/hyphen)")

class ValidateRequest(BaseModel):
    code: str = Field(..., description="Open Location Number string to validate")

class ShortenRequest(BaseModel):
    code: str = Field(..., description="Full Open Location Number string")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Reference latitude")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Reference longitude")

class RecoverRequest(BaseModel):
    short_code: str = Field(..., description="Locality-shortened Open Location Number")
    ref_latitude: float = Field(..., ge=-90.0, le=90.0, description="Reference locality latitude")
    ref_longitude: float = Field(..., ge=-180.0, le=180.0, description="Reference locality longitude")


@app.get("/")
def root():
    return {
        "service": "Open Location Number (Dash Number) Platform API",
        "status": "online",
        "documentation": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "engine": "dash_number.py reference implementation"}

@app.post("/api/encode")
def api_encode(req: EncodeRequest):
    """
    Encodes latitude and longitude into an Open Location Number.
    """
    try:
        code = dash_encode(req.latitude, req.longitude, grid_len=req.grid_digits)
        cleaned = clean_code(code)
        
        # Calculate estimated accuracy scale
        cell_size_m = 3.7
        if req.grid_digits == 0:
            cell_size_m = 11.1
        elif req.grid_digits > 1:
            cell_size_m = 3.7 / (3 ** (req.grid_digits - 1))

        return {
            "code": code,
            "cleaned": cleaned,
            "grid_digits": req.grid_digits,
            "cell_size_meters": round(cell_size_m, 4),
            "macro_digit": int(cleaned[0]),
            "check_digit": int(cleaned[13]) if len(cleaned) >= 14 else None,
            "latitude": req.latitude,
            "longitude": req.longitude
        }
    except Exception as err:
        raise HTTPException(status_code=400, detail=str(err))

@app.post("/api/decode")
def api_decode(req: DecodeRequest):
    """
    Decodes an Open Location Number into a bounding box and center coordinate.
    """
    try:
        area: CodeArea = dash_decode_area(req.code)
        cleaned = clean_code(req.code)
        
        return {
            "code": format_code(cleaned),
            "south": area.south,
            "west": area.west,
            "north": area.north,
            "east": area.east,
            "lat_center": area.lat_center,
            "lon_center": area.lon_center,
            "grid_digits": area.grid_digits,
            "code_length": area.code_length,
            "macro_digit": int(cleaned[0]),
            "check_digit": int(cleaned[13])
        }
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))

@app.post("/api/validate")
def api_validate(req: ValidateRequest):
    """
    Validates an Open Location Number string.
    """
    report = dash_validate(req.code)
    cleaned = clean_code(req.code)
    
    analysis = {
        **report,
        "formatted": format_code(cleaned) if len(cleaned) >= 14 else req.code,
        "has_hyphen": "-" in req.code,
        "macro_valid": (1 <= int(cleaned[0]) <= 8) if len(cleaned) > 0 and cleaned[0].isdigit() else False,
    }
    return analysis

@app.post("/api/shorten")
def api_shorten(req: ShortenRequest):
    """
    Shortens an Open Location Number relative to reference coordinates.
    """
    try:
        short_res = dash_shorten(req.code, req.latitude, req.longitude)
        short_code_str = short_res.tail if short_res else format_code(clean_code(req.code))
        return {
            "full_code": format_code(clean_code(req.code)),
            "short_code": short_code_str,
            "removed_digits": short_res.removed if short_res else 0,
            "ref_latitude": req.latitude,
            "ref_longitude": req.longitude
        }
    except Exception as err:
        raise HTTPException(status_code=400, detail=str(err))

@app.post("/api/recover")
def api_recover(req: RecoverRequest):
    """
    Recovers a full Open Location Number from a shortened code and reference location.
    """
    try:
        res = dash_recover(req.short_code, req.ref_latitude, req.ref_longitude)
        recovered_full_code = dash_encode(res.latitude, res.longitude, grid_len=1)
        area = dash_decode_area(recovered_full_code)
        
        return {
            "short_code": req.short_code,
            "recovered_code": recovered_full_code,
            "valid_checksum": res.valid,
            "lat_center": area.lat_center,
            "lon_center": area.lon_center,
            "area": area._asdict()
        }
    except Exception as err:
        raise HTTPException(status_code=400, detail=str(err))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
