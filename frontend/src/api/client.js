/**
 * Open Location Number Platform — API Client & Offline Geocoding Helper.
 * 
 * Purpose:
 *   HTTP REST client communicating with FastAPI backend (http://127.0.0.1:8000).
 *   Includes client-side offline JS fallback for encoding, decoding, validation,
 *   shortening, and recovery matching Open-Location-Number-Concept.md.
 * 
 * Related Files:
 *   - backend/main.py: FastAPI REST server implementation.
 *   - backend/dash_number.py: Core reference Python engine.
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Popular Indian & Global preset locations for fast search lookup
const POPULAR_LOCATIONS = [
  { name: 'Varanasi (Kashi Vishwanath)', lat: 25.123456, lon: 82.987654, pin: '221001' },
  { name: 'New Delhi (Connaught Place)', lat: 28.613939, lon: 77.209021, pin: '110001' },
  { name: 'Mumbai (Gateway of India)', lat: 18.921984, lon: 72.834654, pin: '400001' },
  { name: 'Bengaluru (MG Road)', lat: 12.971598, lon: 77.594562, pin: '560001' },
  { name: 'London (Big Ben)', lat: 51.500729, lon: -0.124625, pin: 'SW1A' },
  { name: 'Tokyo (Shibuya Crossing)', lat: 35.659486, lon: 139.700547, pin: '150-0042' },
  { name: 'Nairobi (City Center)', lat: -1.286389, lon: 36.817223, pin: '00100' },
  { name: 'New York (Times Square)', lat: 40.758000, lon: -73.985500, pin: '10036' }
];

/**
 * Encode coordinates into an Open Location Number.
 */
export async function encodeCoordinates(latitude, longitude, gridDigits = 1) {
  try {
    const res = await fetch(`${API_BASE_URL}/encode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude, longitude, grid_digits: gridDigits })
    });
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    // Offline JS Fallback
    return fallbackEncode(latitude, longitude, gridDigits);
  }
}

// Alias for components expecting encodeLocation
export const encodeLocation = encodeCoordinates;

/**
 * Decode an Open Location Number into a bounding box and center point.
 */
export async function decodeCode(codeStr) {
  try {
    const res = await fetch(`${API_BASE_URL}/decode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codeStr })
    });
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    return fallbackDecode(codeStr);
  }
}

/**
 * Validate Damm checksum and format of an Open Location Number.
 */
export async function validateCode(codeStr) {
  try {
    const res = await fetch(`${API_BASE_URL}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codeStr })
    });
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    return fallbackValidate(codeStr);
  }
}

/**
 * Shorten an Open Location Number relative to reference coordinates.
 */
export async function shortenCode(codeStr, latitude, longitude) {
  try {
    const res = await fetch(`${API_BASE_URL}/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codeStr, latitude, longitude })
    });
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    return fallbackShorten(codeStr, latitude, longitude);
  }
}

/**
 * Recover a full Open Location Number from a short code and reference location.
 */
export async function recoverCode(shortCode, refLatitude, refLongitude) {
  try {
    const res = await fetch(`${API_BASE_URL}/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ short_code: shortCode, ref_latitude: refLatitude, ref_longitude: refLongitude })
    });
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    return fallbackRecover(shortCode, refLatitude, refLongitude);
  }
}

/**
 * Robust Multi-Tier Geocoding Function.
 */
export async function geocodePlaceOrPin(query) {
  if (!query || !query.trim()) {
    throw new Error('Please enter a place name, locality, or PIN code.');
  }

  const rawQuery = query.trim();
  const cleanQuery = rawQuery.toLowerCase();

  // 1. Check local fast dictionary
  const localMatch = POPULAR_LOCATIONS.find(loc => 
    loc.name.toLowerCase().includes(cleanQuery) || 
    loc.pin.toLowerCase().includes(cleanQuery)
  );
  if (localMatch) {
    return { name: localMatch.name, lat: localMatch.lat, lon: localMatch.lon, source: 'Preset' };
  }

  // Helper fetch function for Nominatim
  const fetchNominatim = async (searchStr) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchStr)}&addressdetails=1&limit=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'OpenLocationNumberApp/2.0' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        return {
          name: data[0].display_name.split(',').slice(0, 2).join(','),
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          source: 'Nominatim'
        };
      }
    }
    return null;
  };

  // 2. Try exact query first
  try {
    const exactResult = await fetchNominatim(rawQuery);
    if (exactResult) return exactResult;
  } catch (e) {
    // Continue to fallbacks
  }

  // 3. Fallback: Extract key locality words
  const words = rawQuery.split(/\s+/).filter(w => w.length > 2);
  if (words.length > 1) {
    const subQuery = words.slice(-2).join(' ');
    try {
      const subResult = await fetchNominatim(subQuery);
      if (subResult) {
        return {
          ...subResult,
          name: `${rawQuery} (${subResult.name})`
        };
      }
    } catch (e) {
      // Ignore
    }
  }

  // 4. City-level fallbacks
  if (cleanQuery.includes('saket')) {
    return { name: `${rawQuery} (Saket, New Delhi)`, lat: 28.5244, lon: 77.2066, source: 'Locality Fallback' };
  }
  if (cleanQuery.includes('delhi')) {
    return { name: `${rawQuery} (Delhi, India)`, lat: 28.613939, lon: 77.209021, source: 'City Fallback' };
  }
  if (cleanQuery.includes('mumbai')) {
    return { name: `${rawQuery} (Mumbai, India)`, lat: 19.075983, lon: 72.877655, source: 'City Fallback' };
  }

  throw new Error(`Could not pinpoint '${query}'. Try adding city name (e.g. '${query} Delhi') or click '📍 Use My GPS Location'.`);
}

export { POPULAR_LOCATIONS };

// ============================================================================
// Damm Checksum Lookup Matrix & Offline Calculation Logic
// ============================================================================
const DAMM_MATRIX = [
  [0, 3, 1, 7, 5, 9, 8, 6, 4, 2],
  [7, 0, 9, 2, 1, 5, 4, 8, 6, 3],
  [4, 2, 0, 6, 8, 7, 1, 3, 5, 9],
  [1, 7, 5, 0, 9, 8, 3, 4, 2, 6],
  [6, 1, 2, 3, 0, 4, 5, 9, 7, 8],
  [3, 6, 7, 4, 2, 0, 9, 5, 8, 1],
  [5, 8, 6, 9, 7, 2, 0, 1, 3, 4],
  [8, 9, 4, 5, 3, 6, 2, 0, 1, 7],
  [9, 4, 3, 8, 6, 1, 7, 2, 0, 5],
  [2, 5, 8, 1, 4, 3, 6, 7, 9, 0],
];

const DECIMAL_WEIGHTS = [10, 1, 0.1, 0.01, 0.001, 0.0001];

function dammChecksum(digitsStr) {
  let interim = 0;
  for (let i = 0; i < digitsStr.length; i++) {
    interim = DAMM_MATRIX[interim][parseInt(digitsStr[i], 10)];
  }
  return interim;
}

function cleanDigits(str) {
  return str.replace(/[\s-]/g, '');
}

function groupDigits(raw) {
  const base10 = raw.slice(0, 14);
  const grid = raw.slice(14);
  const groups = [base10.slice(0, 3), base10.slice(3, 7), base10.slice(7, 11), base10.slice(11, 14)];
  const text = groups.join(' ');
  if (!grid) return text;
  const gridGroups = [];
  for (let i = 0; i < grid.length; i += 3) {
    gridGroups.push(grid.slice(i, i + 3));
  }
  return `${text}-${gridGroups.join(' ')}`;
}

function fallbackEncode(latitude, longitude, gridDigits = 1) {
  let lat = Math.max(-90.0, Math.min(90.0, latitude));
  let lon = Math.max(-180.0, Math.min(180.0, longitude));

  if (lat === 90.0) lat = 89.99999999;
  if (lon === 180.0) lon = 179.99999999;

  const latNorm = lat + 90.0;
  const lonNorm = lon + 180.0;

  const latHundreds = Math.min(1, Math.max(0, Math.floor(latNorm / 100.0)));
  const lonHundreds = Math.min(3, Math.max(0, Math.floor(lonNorm / 100.0)));

  const macro = 1 + (latHundreds * 4 + lonHundreds);

  let latRem = latNorm - latHundreds * 100.0;
  let lonRem = lonNorm - lonHundreds * 100.0;

  const digits = [macro.toString()];

  for (const weight of DECIMAL_WEIGHTS) {
    const latDigit = Math.floor(latRem / weight);
    const lonDigit = Math.floor(lonRem / weight);
    latRem -= latDigit * weight;
    lonRem -= lonDigit * weight;
    digits.push(latDigit.toString(), lonDigit.toString());
  }

  const backboneStr = digits.join('');
  const check = dammChecksum(backboneStr);
  let raw = `${backboneStr}${check}`;

  if (gridDigits > 0) {
    let fracLat = latRem / 0.0001;
    let fracLon = lonRem / 0.0001;
    for (let i = 0; i < gridDigits; i++) {
      const row = Math.min(2, Math.max(0, Math.floor(fracLat * 3.0)));
      const col = Math.min(2, Math.max(0, Math.floor(fracLon * 3.0)));
      const digit = 3 * row + col + 1;
      raw += digit.toString();
      fracLat = fracLat * 3.0 - row;
      fracLon = fracLon * 3.0 - col;
    }
  }

  const formatted = groupDigits(raw);

  return {
    code: formatted,
    cleaned: raw,
    grid_digits: gridDigits,
    cell_size_meters: gridDigits === 0 ? 11.1 : 3.7 / (3 ** (gridDigits - 1)),
    macro_digit: macro,
    check_digit: check,
    latitude,
    longitude
  };
}

function fallbackDecode(codeStr) {
  const cleaned = cleanDigits(codeStr);
  if (cleaned.length < 14) throw new Error('Code must be at least 14 digits');

  const backbone = cleaned.slice(0, 13);
  const check = parseInt(cleaned[13], 10);
  const valid = dammChecksum(backbone) === check;

  const macro = parseInt(cleaned[0], 10);
  const macroIdx = macro - 1;
  const latHundreds = Math.floor(macroIdx / 4);
  const lonHundreds = macroIdx % 4;

  let lat = latHundreds * 100.0;
  let lon = lonHundreds * 100.0;
  let pos = 1;

  for (const weight of DECIMAL_WEIGHTS) {
    lat += parseInt(cleaned[pos], 10) * weight;
    lon += parseInt(cleaned[pos + 1], 10) * weight;
    pos += 2;
  }

  let fracLat = 0.0;
  let fracLon = 0.0;
  let scale = 1.0;
  const grid = cleaned.slice(14);
  for (let i = 0; i < grid.length; i++) {
    const cell = parseInt(grid[i], 10) - 1;
    scale /= 3.0;
    fracLat += Math.floor(cell / 3) * scale;
    fracLon += (cell % 3) * scale;
  }

  fracLat += scale / 2.0;
  fracLon += scale / 2.0;
  lat += fracLat * 0.0001;
  lon += fracLon * 0.0001;

  const south = lat - 90.0 - (0.0001 * scale / 2.0);
  const west = lon - 180.0 - (0.0001 * scale / 2.0);

  return {
    code: groupDigits(cleaned),
    south: Number(south.toFixed(8)),
    west: Number(west.toFixed(8)),
    north: Number((south + 0.0001 * scale).toFixed(8)),
    east: Number((west + 0.0001 * scale).toFixed(8)),
    lat_center: Number((lat - 90.0).toFixed(8)),
    lon_center: Number((lon - 180.0).toFixed(8)),
    grid_digits: grid.length,
    code_length: cleaned.length,
    macro_digit: macro,
    check_digit: check,
    valid
  };
}

function fallbackValidate(codeStr) {
  const cleaned = cleanDigits(codeStr);
  if (cleaned.length < 14) {
    return { is_valid: false, error_message: 'Minimum 14 digits required' };
  }
  const backbone = cleaned.slice(0, 13);
  const check = parseInt(cleaned[13], 10);
  const isValid = dammChecksum(backbone) === check;
  return {
    is_valid: isValid,
    error_message: isValid ? null : 'Checksum verification failed',
    is_short: false,
    grid_depth: Math.max(0, cleaned.length - 14),
    total_digits: cleaned.length
  };
}

function toTenThousandths(degrees) {
  return Math.floor(degrees * 1e4 + 1e-6);
}

function nearestCongruent(reference, low, period) {
  return Math.round((reference - low) / period) * period + low;
}

function backboneFromTenThousandths(latTt, lonTt) {
  const latHundreds = Math.floor(latTt / 1000000);
  const lonHundreds = Math.floor(lonTt / 1000000);
  const macro = 1 + (latHundreds * 4 + lonHundreds);
  const digits = [macro.toString()];
  for (const divisor of [100000, 10000, 1000, 100, 10, 1]) {
    digits.push(Math.floor(latTt / divisor) % 10);
    digits.push(Math.floor(lonTt / divisor) % 10);
  }
  return digits.join('');
}

function formatShort(base10Full, removed, grid) {
  const bounds = [[0, 3], [3, 7], [7, 11], [11, 14]];
  const parts = bounds.map(([start, end]) => base10Full.slice(Math.max(start, removed), end)).filter(Boolean);
  let text = parts.join(' ');
  if (grid) {
    const gridGroups = [];
    for (let i = 0; i < grid.length; i += 3) {
      gridGroups.push(grid.slice(i, i + 3));
    }
    text += `-${gridGroups.join(' ')}`;
  }
  return text;
}

function tenThousandthsFromCode(rawDigits) {
  const macro = parseInt(rawDigits[0], 10) - 1;
  const latHundreds = Math.floor(macro / 4);
  const lonHundreds = macro % 4;

  let latTt = latHundreds * 1000000;
  let lonTt = lonHundreds * 1000000;

  const weights = [100000, 10000, 1000, 100, 10, 1];
  let pos = 1;
  for (const w of weights) {
    latTt += parseInt(rawDigits[pos], 10) * w;
    lonTt += parseInt(rawDigits[pos + 1], 10) * w;
    pos += 2;
  }
  return { latTt, lonTt };
}

function fallbackShorten(codeStr, refLatitude, refLongitude) {
  const raw = cleanDigits(codeStr);
  if (raw.length < 14) throw new Error('Code must be at least 14 digits');

  const base10Full = raw.slice(0, 14);
  const grid = raw.slice(14);

  const { latTt, lonTt } = tenThousandthsFromCode(raw);
  const refLatTt = toTenThousandths(refLatitude + 90);
  const refLonTt = toTenThousandths(refLongitude + 180);

  for (const removed of [9, 7, 5]) {
    const pairsDropped = Math.floor((removed - 1) / 2);
    const period = Math.pow(10, 6 - pairsDropped);
    if (Math.abs(latTt - refLatTt) < period / 2 && Math.abs(lonTt - refLonTt) < period / 2) {
      const shortText = formatShort(base10Full, removed, grid);
      return {
        full_code: groupDigits(raw),
        short_code: shortText,
        removed_digits: removed,
        ref_latitude: refLatitude,
        ref_longitude: refLongitude
      };
    }
  }

  return {
    full_code: groupDigits(raw),
    short_code: groupDigits(raw),
    removed_digits: 0,
    ref_latitude: refLatitude,
    ref_longitude: refLongitude
  };
}

function fallbackRecover(shortCode, refLatitude, refLongitude) {
  const cleanShort = cleanDigits(shortCode);
  const base10Part = cleanShort.includes('-') ? cleanShort.split('-')[0] : (cleanShort.length <= 14 ? cleanShort : cleanShort.slice(0, 14));
  const grid = cleanShort.includes('-') ? cleanShort.split('-')[1] : (cleanShort.length > 14 ? cleanShort.slice(14) : '');

  const removed = 14 - base10Part.length;
  if (removed <= 0) {
    const area = fallbackDecode(shortCode);
    return {
      short_code: shortCode,
      recovered_code: area.code,
      lat_center: area.lat_center,
      lon_center: area.lon_center
    };
  }

  const pairsDropped = Math.floor((removed - 1) / 2);
  const period = Math.pow(10, 6 - pairsDropped);
  const decimals = base10Part.slice(0, -1);
  const check = base10Part.slice(-1);

  let place = Math.pow(10, 5 - pairsDropped);
  let lowLat = 0;
  let lowLon = 0;
  for (let i = 0; i < decimals.length; i += 2) {
    lowLat += parseInt(decimals[i], 10) * place;
    lowLon += parseInt(decimals[i + 1], 10) * place;
    place /= 10;
  }

  const refLatTt = toTenThousandths(refLatitude + 90);
  const refLonTt = toTenThousandths(refLongitude + 180);
  const latTt = nearestCongruent(refLatTt, lowLat, period);
  const lonTt = nearestCongruent(refLonTt, lowLon, period);

  const backbone = backboneFromTenThousandths(latTt, lonTt);
  const fullRaw = `${backbone}${check}${grid}`;
  const area = fallbackDecode(fullRaw);

  return {
    short_code: shortCode,
    recovered_code: area.code,
    lat_center: area.lat_center,
    lon_center: area.lon_center
  };
}
