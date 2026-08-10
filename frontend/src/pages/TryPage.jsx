/**
 * Open Location Number Platform — Interactive Product Application.
 * 
 * Purpose:
 *   - Complete working interactive product application for Open Location Number.
 *   - Styled in Google Plus Codes theme (#1a73e8 primary blue, clean cards).
 *   - Multilingual support via useLanguage().
 * 
 * Related Files:
 *   - frontend/src/api/client.js: Handles REST API calls & geocoding helper.
 *   - frontend/src/context/LanguageContext.jsx: Translation context.
 */

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Copy, 
  Check, 
  Share2, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  Search,
  Zap,
  Navigation,
  Compass,
  ArrowRight
} from 'lucide-react';
import { 
  encodeLocation, 
  decodeCode, 
  validateCode, 
  shortenCode, 
  recoverCode, 
  geocodePlaceOrPin, 
  POPULAR_LOCATIONS 
} from '../api/client';
import { useLanguage } from '../context/LanguageContext';

// Leaflet Marker Icon Setup
const pinIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Map View Auto-Center Helper Component
function MapFlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, Math.max(map.getZoom(), 16), { duration: 1 });
    }
  }, [center, map]);
  return null;
}

export default function TryPage() {
  const { t } = useLanguage();

  // Navigation Engine Tab State: ENCODE (First), DECODE, VALIDATE, SHORTEN, RECOVER
  const [activeTab, setActiveTab] = useState('encode');

  // Search State
  const [searchQuery, setSearchQuery] = useState('Delhi');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [statusNotice, setStatusNotice] = useState(null);

  // Map Tile Provider State: 'streets' | 'satellite' | 'dark'
  const [tileProvider, setTileProvider] = useState('streets');

  // Active Location & Coordinate State
  const [lat, setLat] = useState(28.613939);
  const [lon, setLon] = useState(77.209021);
  const [placeTitle, setPlaceTitle] = useState('Delhi, India');
  const [gridDigits, setGridDigits] = useState(1);
  
  // Dynamic Synchronized Code Inputs
  const [generatedCode, setGeneratedCode] = useState('');
  const [decodedArea, setDecodedArea] = useState(null);
  const [validationReport, setValidationReport] = useState(null);
  
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeError, setDecodeError] = useState(null);
  
  const [validateInput, setValidateInput] = useState('');
  const [shortenCodeInput, setShortenCodeInput] = useState('');
  const [shortenRefLat, setShortenRefLat] = useState(28.61);
  const [shortenRefLon, setShortenRefLon] = useState(77.20);
  const [shortenResult, setShortenResult] = useState('');
  
  const [recoverShortInput, setRecoverShortInput] = useState('');
  const [recoverRefLat, setRecoverRefLat] = useState(28.613939);
  const [recoverRefLon, setRecoverRefLon] = useState(77.209021);
  const [recoverResult, setRecoverResult] = useState('');

  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Tile Provider Layer Configs
  const TILE_LAYERS = {
    streets: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CartoDB &copy; OpenStreetMap'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping'
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CartoDB &copy; OpenStreetMap'
    }
  };

  // Synchronize generated active code to all tool inputs dynamically
  const syncActiveCodeToTools = (code, currentLat, currentLon) => {
    setDecodeInput(code);
    setValidateInput(code);
    setShortenCodeInput(code);
    setShortenRefLat(Number(currentLat.toFixed(2)));
    setShortenRefLon(Number(currentLon.toFixed(2)));
    setRecoverRefLat(currentLat);
    setRecoverRefLon(currentLon);
  };

  // Helper for Reverse Geocoding Lat/Lon to Full Detailed Building / Street Address (for Encode Engine)
  const fetchReverseGeocodeName = async (latitude, longitude) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      const res = await fetch(url, { headers: { 'User-Agent': 'OpenLocationNumberApp/2.0' } });
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          const parts = data.display_name.split(',');
          return parts.slice(0, 3).map(p => p.trim()).join(', ');
        }
      }
    } catch (e) {
      // Fallback
    }
    return `Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
  };

  // Helper to ensure shortened numeric tail ALWAYS preserves original 3-4-4-3 slots and hyphen
  const ensureShortCodeFormatting = (rawShortStr, removedDigits) => {
    if (!rawShortStr) return '';
    const str = typeof rawShortStr === 'string' ? rawShortStr : (rawShortStr.tail || rawShortStr.short_code || '');
    
    // If already formatted with space or hyphen (e.g. "52 301-4" or "7952 301-4"), RETURN DIRECTLY!
    if (str.includes(' ') || str.includes('-')) {
      return str;
    }
    
    // Only format raw flat digits (e.g. "523014")
    const clean = str.replace(/[\s-]/g, '');
    const detectedRemoved = (removedDigits !== undefined && removedDigits !== null) ? removedDigits : 9;
    const base10Len = Math.max(0, 14 - detectedRemoved);
    const base10 = clean.slice(0, base10Len);
    const grid = clean.slice(base10Len);
    
    const bounds = [[0, 3], [3, 7], [7, 11], [11, 14]];
    const fullDummy = '0'.repeat(detectedRemoved) + base10;
    const parts = bounds.map(([start, end]) => fullDummy.slice(Math.max(start, detectedRemoved), end)).filter(Boolean);
    let text = parts.join(' ');
    if (grid) {
      text += `-${grid}`;
    }
    return text || str;
  };

  // Helper ONLY for Shorten Tab: Formats strictly 1-2 Locality Levels (e.g. "Gurugram, Haryana" or "Gurugram")
  const getShortenLocalityContext = (fullAddressStr) => {
    if (!fullAddressStr) return 'Gurugram, Haryana';
    
    const rawParts = fullAddressStr.split(',').map(p => p.trim());
    const KNOWN_COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Kenya', 'Japan', 'Germany', 'France'];
    const STREET_KEYWORDS = ['sector', 'block', 'phase', 'road', 'street', 'building', 'tower', 'apartment', 'house', 'plot', 'lane', 'marg', 'colony', 'flat', 'no.', 'h.no'];
    
    // Filter out postcodes, countries, street/sector level noise, and house/building/unit codes (like "A-48")
    const filtered = rawParts.filter(part => {
      const pLower = part.toLowerCase();
      if (/^\d{3,6}$/.test(part)) return false;
      if (KNOWN_COUNTRIES.includes(part)) return false;
      if (STREET_KEYWORDS.some(kw => pLower.includes(kw))) return false;
      // Exclude house/unit/plot numbers like "A-48", "A48", "H-12", "Flat 4", "No. 10"
      if (/^([a-z]?\s*[-/]?\s*\d+|\d+[\s-/]*[a-z]?)$/i.test(part.trim())) return false;
      if (/^[a-z]\s*[-/]\s*\d+/i.test(part.trim())) return false;
      return true;
    });

    if (filtered.length >= 2) {
      const city = filtered[filtered.length - 2];
      const state = filtered[filtered.length - 1];
      if (city.toLowerCase() !== state.toLowerCase()) {
        return `${city}, ${state}`;
      }
      return state;
    }
    
    if (filtered.length === 1) {
      return filtered[0];
    }

    return 'Gurugram, Haryana';
  };

  // Map Click Handler Component
  function MapClickHandler() {
    useMapEvents({
      click: async (e) => {
        const clickedLat = Number(e.latlng.lat.toFixed(6));
        const clickedLon = Number(e.latlng.lng.toFixed(6));
        setLat(clickedLat);
        setLon(clickedLon);
        
        const realName = await fetchReverseGeocodeName(clickedLat, clickedLon);
        setPlaceTitle(realName);
        
        const data = await encodeLocation(clickedLat, clickedLon, gridDigits);
        setGeneratedCode(data.code);
        syncActiveCodeToTools(data.code, clickedLat, clickedLon);
        
        const area = await decodeCode(data.code);
        setDecodedArea(area);
      },
    });
    return null;
  }

  // Initial Sync Effect on Load / Location Change
  useEffect(() => {
    async function init() {
      const data = await encodeLocation(lat, lon, gridDigits);
      setGeneratedCode(data.code);
      syncActiveCodeToTools(data.code, lat, lon);
      const area = await decodeCode(data.code);
      setDecodedArea(area);
    }
    init();
  }, [lat, lon, gridDigits]);

  // SECTION: One-Tap High Accuracy Device GPS Geolocation with Reverse Geocoding
  const handleUseGPSLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setStatusNotice('Accessing device high-precision GPS & fetching street address...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLat = Number(pos.coords.latitude.toFixed(6));
        const userLon = Number(pos.coords.longitude.toFixed(6));
        setLat(userLat);
        setLon(userLon);
        
        const realAddressName = await fetchReverseGeocodeName(userLat, userLon);
        setPlaceTitle(realAddressName);
        
        const data = await encodeLocation(userLat, userLon, gridDigits);
        setGeneratedCode(data.code);
        syncActiveCodeToTools(data.code, userLat, userLon);
        
        const area = await decodeCode(data.code);
        setDecodedArea(area);
        setIsLocating(false);
        setStatusNotice(`📍 GPS Address Located: ${realAddressName}`);
        setTimeout(() => setStatusNotice(null), 4000);
      },
      (err) => {
        setIsLocating(false);
        setStatusNotice('Unable to access GPS location. Please check browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // SECTION: Place Name / PIN Search Handler
  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setStatusNotice(null);

    try {
      const geo = await geocodePlaceOrPin(searchQuery);
      setLat(geo.lat);
      setLon(geo.lon);
      setPlaceTitle(geo.name);
      
      const data = await encodeLocation(geo.lat, geo.lon, gridDigits);
      setGeneratedCode(data.code);
      syncActiveCodeToTools(data.code, geo.lat, geo.lon);
      
      const area = await decodeCode(data.code);
      setDecodedArea(area);
    } catch (err) {
      setStatusNotice(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  // SECTION: Select Preset Location Button
  const handleSelectPreset = async (preset) => {
    setSearchQuery(preset.name);
    setLat(preset.lat);
    setLon(preset.lon);
    setPlaceTitle(`${preset.name} (PIN: ${preset.pin})`);
    setStatusNotice(null);
    
    const data = await encodeLocation(preset.lat, preset.lon, gridDigits);
    setGeneratedCode(data.code);
    syncActiveCodeToTools(data.code, preset.lat, preset.lon);
    
    const area = await decodeCode(preset.code || data.code);
    setDecodedArea(area);
  };

  // SECTION: Manual Encode Click
  const handleEncodeClick = async () => {
    const data = await encodeLocation(lat, lon, gridDigits);
    setGeneratedCode(data.code);
    syncActiveCodeToTools(data.code, lat, lon);
    const area = await decodeCode(data.code);
    setDecodedArea(area);
  };

  // SECTION: Decode Submit Handler
  const handleDecodeSubmit = async () => {
    setDecodeError(null);
    try {
      const area = await decodeCode(decodeInput);
      setDecodedArea(area);
      setLat(area.lat_center);
      setLon(area.lon_center);
      
      const realName = await fetchReverseGeocodeName(area.lat_center, area.lon_center);
      setPlaceTitle(realName);
    } catch (err) {
      setDecodeError(err.message || 'Invalid Dash Number code.');
    }
  };

  // SECTION: Validate Submit Handler
  const handleValidateSubmit = async () => {
    const report = await validateCode(validateInput);
    setValidationReport(report);
  };

  // SECTION: Shorten Submit Handler
  const handleShortenSubmit = async () => {
    try {
      const res = await shortenCode(shortenCodeInput, shortenRefLat, shortenRefLon);
      const rawShort = res.short_code || res;
      const removed = res.removed_digits !== undefined ? res.removed_digits : (res.removed !== undefined ? res.removed : 9);
      const formattedShort = ensureShortCodeFormatting(rawShort, removed);
      setShortenResult(formattedShort);
      setRecoverShortInput(formattedShort);
      setRecoverRefLat(shortenRefLat);
      setRecoverRefLon(shortenRefLon);
    } catch (err) {
      alert(err.message);
    }
  };

  // SECTION: Recover Submit Handler
  const handleRecoverSubmit = async () => {
    try {
      const res = await recoverCode(recoverShortInput, recoverRefLat, recoverRefLon);
      const recoveredStr = res.recovered_code || res;
      setRecoverResult(recoveredStr);
      
      const area = await decodeCode(recoveredStr);
      setDecodedArea(area);
      setLat(area.lat_center);
      setLon(area.lon_center);
    } catch (err) {
      alert(`Recovery Failed: ${err.message || 'Reference location is too far from original code locality.'}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/try?lat=${lat}&lon=${lon}`;
    navigator.clipboard.writeText(shareUrl);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 font-sans">
      
      {/* Product Console Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
            {t('nav_badge')} Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#202124] dark:text-white mt-2">
            {t('hero_title')}
          </h1>
        </div>

        {/* Engine Tabs Bar */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#202124] p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto">
          {[
            { id: 'encode', label: t('tab_encode') },
            { id: 'decode', label: t('tab_decode') },
            { id: 'validate', label: t('tab_validate') },
            { id: 'shorten', label: t('tab_shorten') },
            { id: 'recover', label: t('tab_recover') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#1a73e8] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location Acquisition Bar */}
      <div className="clean-panel p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          <form onSubmit={handleSearchSubmit} className="flex-grow flex gap-2">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={t('hero_search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-[#1a73e8]"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              {isSearching ? <Zap className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>{t('search')}</span>
            </button>
          </form>

          <button
            onClick={handleUseGPSLocation}
            disabled={isLocating}
            className="px-4 py-2.5 bg-[#e8f0fe] dark:bg-[#1e293b] text-[#1a73e8] dark:text-[#8ab4f8] hover:bg-[#d2e3fc] dark:hover:bg-[#334155] font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <Navigation className={`w-3.5 h-3.5 text-[#1a73e8] dark:text-[#8ab4f8] ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : t('hero_gps_button')}</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-mono font-semibold">Presets:</span>
            {POPULAR_LOCATIONS.slice(0, 5).map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleSelectPreset(preset)}
                className="px-2 py-0.5 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-[#1a73e8] hover:text-white font-mono font-semibold transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
          <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
            Tap map to pick exact doorstep
          </span>
        </div>

        {statusNotice && (
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[#1a73e8] dark:text-[#8ab4f8] text-xs font-mono flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#1a73e8] animate-pulse" />
            <span>{statusNotice}</span>
          </div>
        )}
      </div>

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Control Panel */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* TAB 1: ENCODE */}
          {activeTab === 'encode' && (
            <div className="clean-panel p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <h3 className="text-[#202124] dark:text-white font-display font-bold text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1a73e8] dark:text-[#8ab4f8]" />
                  <span>{t('encode_title')}</span>
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] px-2 py-0.5 rounded">
                  {t('encode_sub')}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#171717] rounded-xl border border-slate-200/80 dark:border-slate-800 font-mono text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">{t('encode_active_location')}</span>
                <span className="text-[#202124] dark:text-white font-bold">{placeTitle}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="block text-slate-500 mb-1">{t('encode_lat_label')}</label>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">{t('encode_lon_label')}</label>
                  <input
                    type="number"
                    step="any"
                    value={lon}
                    onChange={(e) => setLon(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-1">
                  <label className="text-slate-500">{t('encode_precision_label')}</label>
                  <span className="text-[#1a73e8] dark:text-[#8ab4f8] font-bold">
                    {gridDigits === 0 ? '0 (~11m Address)' : `${gridDigits} (${gridDigits===1?'~3.7m Default':gridDigits===3?'~0.41m Doorway':'~'+(3.7/(3**(gridDigits-1))).toFixed(2)+'m'})`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={gridDigits}
                  onChange={(e) => setGridDigits(parseInt(e.target.value))}
                  className="w-full accent-[#1a73e8] bg-slate-200 dark:bg-slate-800 rounded cursor-pointer h-1.5"
                />
              </div>

              <button
                onClick={handleEncodeClick}
                className="w-full py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t('encode_btn')}</span>
              </button>

              <div className="bg-slate-50 dark:bg-[#171717] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{t('encode_dash_num_label')}</span>
                  <div className="flex gap-2">
                    <button onClick={handleCopy} className="text-[#1a73e8] dark:text-[#8ab4f8] font-semibold flex items-center gap-1">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? t('copied') : t('copy')}</span>
                    </button>
                    <button onClick={handleShare} className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{shared ? t('shared') : t('share')}</span>
                    </button>
                  </div>
                </div>

                <div className="font-mono text-xl sm:text-2xl font-bold text-[#1a73e8] dark:text-[#8ab4f8] tracking-wider">
                  {generatedCode}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DECODE */}
          {activeTab === 'decode' && (
            <div className="clean-panel p-5 space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <h3 className="text-[#202124] dark:text-white font-display font-bold text-base font-sans">{t('decode_title')}</h3>
                <span className="text-[10px] font-mono font-bold uppercase bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] px-2 py-0.5 rounded">
                  {t('decode_sub')}
                </span>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold">{t('decode_input_label')}</label>
                <input
                  type="text"
                  value={decodeInput}
                  onChange={(e) => setDecodeInput(e.target.value)}
                  placeholder="e.g. 715 8752 1075 140-6"
                  className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white font-mono font-bold"
                />
              </div>

              <button onClick={handleDecodeSubmit} className="w-full py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all">
                <Compass className="w-4 h-4" />
                <span>{t('decode_btn')}</span>
              </button>

              {decodeError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{decodeError}</span>
                </div>
              )}

              {/* Rich Decoded Result Output Card */}
              {decodedArea && (
                <div className="p-4 bg-slate-50 dark:bg-[#171717] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
                    <span className="font-bold text-[#1a73e8] dark:text-[#8ab4f8] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#1a73e8]" />
                      <span>{t('decode_result_title')}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Precision: ~{(decodedArea.grid_digits === 0 ? 11.1 : 3.7 / (3 ** (decodedArea.grid_digits - 1))).toFixed(2)}m
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase">{t('decode_center_label')}</span>
                    <div className="text-[#202124] dark:text-white font-bold text-sm">
                      {decodedArea.lat_center?.toFixed(6)}, {decodedArea.lon_center?.toFixed(6)}
                    </div>
                    <div className="text-slate-500 text-[11px] truncate">{placeTitle}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 bg-white dark:bg-[#202124] rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-slate-400 block text-[9px]">{t('decode_sw_label')}</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{decodedArea.south?.toFixed(5)}, {decodedArea.west?.toFixed(5)}</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-[#202124] rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span className="text-slate-400 block text-[9px]">{t('decode_ne_label')}</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{decodedArea.north?.toFixed(5)}, {decodedArea.east?.toFixed(5)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VALIDATE */}
          {activeTab === 'validate' && (
            <div className="clean-panel p-5 space-y-3 text-xs font-mono">
              <h3 className="text-[#202124] dark:text-white font-display font-semibold text-base font-sans">{t('validate_title')}</h3>
              <p className="text-slate-500 font-sans">{t('validate_sub')}</p>
              <div>
                <label className="block text-slate-500 mb-1">{t('validate_input_label')}</label>
                <input
                  type="text"
                  value={validateInput}
                  onChange={(e) => setValidateInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white font-bold"
                />
              </div>
              <button onClick={handleValidateSubmit} className="w-full py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition-all shadow-sm">
                {t('validate_btn')}
              </button>

              {validationReport && (
                <div className={`p-3 rounded-xl border text-xs space-y-1 ${validationReport.is_valid ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-[#1a73e8] dark:text-[#8ab4f8]' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'}`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    {validationReport.is_valid ? <CheckCircle2 className="w-4 h-4 text-[#1a73e8]" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                    <span>{validationReport.is_valid ? t('validate_valid_msg') : t('validate_invalid_msg')}</span>
                  </div>
                  <p>{validationReport.error_message || 'Damm checksum verified. Code structure is valid.'}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SHORTEN */}
          {activeTab === 'shorten' && (
            <div className="clean-panel p-5 space-y-3 text-xs font-mono">
              <h3 className="text-[#202124] dark:text-white font-display font-semibold text-base font-sans">{t('shorten_title')}</h3>
              <p className="text-slate-500 font-sans">{t('shorten_sub')}</p>
              <div>
                <label className="block text-slate-500 mb-1">{t('shorten_input_label')}</label>
                <input
                  type="text"
                  value={shortenCodeInput}
                  onChange={(e) => setShortenCodeInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">{t('shorten_ref_lat')}</label>
                  <input
                    type="number"
                    step="any"
                    value={shortenRefLat}
                    onChange={(e) => setShortenRefLat(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-2 py-1.5 text-[#202124] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">{t('shorten_ref_lon')}</label>
                  <input
                    type="number"
                    step="any"
                    value={shortenRefLon}
                    onChange={(e) => setShortenRefLon(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-2 py-1.5 text-[#202124] dark:text-white"
                  />
                </div>
              </div>
              <button onClick={handleShortenSubmit} className="w-full py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition-all shadow-sm">
                {t('shorten_btn')}
              </button>

              {shortenResult && (
                <div className="p-4 bg-slate-50 dark:bg-[#171717] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-mono space-y-1.5">
                    <span className="text-slate-500 text-[10px] uppercase font-semibold block">{t('shorten_output_label')}</span>
                    <div className="p-3 bg-white dark:bg-[#202124] rounded-xl border border-slate-200/80 dark:border-slate-800 font-mono space-y-1">
                      <div className="text-slate-600 dark:text-slate-400 font-sans text-xs font-bold">{getShortenLocalityContext(placeTitle)}</div>
                      <div className="text-[#1a73e8] dark:text-[#8ab4f8] font-bold text-lg tracking-wider font-mono">{shortenResult}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans flex items-center justify-between pt-1">
                    <span>1–2 Locality levels + 3-4-4-3 positional tail</span>
                    <span className="font-mono text-[#1a73e8] dark:text-[#8ab4f8] font-semibold">Tail: {shortenResult}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: RECOVER */}
          {activeTab === 'recover' && (
            <div className="clean-panel p-5 space-y-3 text-xs font-mono">
              <h3 className="text-[#202124] dark:text-white font-display font-semibold text-base font-sans">{t('recover_title')}</h3>
              <p className="text-slate-500 font-sans">{t('recover_sub')}</p>
              <div>
                <label className="block text-slate-500 mb-1">{t('recover_input_label')}</label>
                <input
                  type="text"
                  placeholder="e.g. 52 301-4"
                  value={recoverShortInput}
                  onChange={(e) => setRecoverShortInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">{t('recover_ref_lat')}</label>
                  <input
                    type="number"
                    step="any"
                    value={recoverRefLat}
                    onChange={(e) => setRecoverRefLat(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-2 py-1.5 text-[#202124] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">{t('recover_ref_lon')}</label>
                  <input
                    type="number"
                    step="any"
                    value={recoverRefLon}
                    onChange={(e) => setRecoverRefLon(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-2 py-1.5 text-[#202124] dark:text-white"
                  />
                </div>
              </div>
              <button onClick={handleRecoverSubmit} className="w-full py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs transition-all shadow-sm">
                {t('recover_btn')}
              </button>
              {recoverResult && (
                <div className="p-3 bg-slate-50 dark:bg-[#171717] rounded-xl border border-slate-200/80 dark:border-slate-800 text-[#1a73e8] dark:text-[#8ab4f8] font-bold space-y-1">
                  <div>{t('recover_output_label')} <span className="text-[#202124] dark:text-white">{recoverResult}</span></div>
                  <div className="text-[10px] text-slate-500 font-sans">Verified Damm Checksum Matched</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Map Box */}
        <div className="lg:col-span-7 space-y-4">
          <div className="clean-panel p-3 overflow-hidden relative">
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">Interactive Map View</span>
              </div>

              {/* Layer Provider Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-mono">
                {['streets', 'satellite', 'dark'].map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setTileProvider(layer)}
                    className={`px-2 py-0.5 rounded-lg capitalize transition-all ${
                      tileProvider === layer ? 'bg-[#1a73e8] text-white font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>

            {/* Leaflet Interactive Map Container */}
            <div className="w-full h-[520px] rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 relative z-0">
              <MapContainer
                center={[lat, lon]}
                zoom={16}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <MapFlyTo center={[lat, lon]} />
                <MapClickHandler />
                
                <TileLayer
                  url={TILE_LAYERS[tileProvider].url}
                  attribution={TILE_LAYERS[tileProvider].attribution}
                />

                <Marker position={[lat, lon]} icon={pinIcon} />

                {/* Bounding Box Polygon overlay if decoded area is active */}
                {decodedArea && (
                  <Polygon
                    positions={[
                      [decodedArea.south, decodedArea.west],
                      [decodedArea.north, decodedArea.west],
                      [decodedArea.north, decodedArea.east],
                      [decodedArea.south, decodedArea.east]
                    ]}
                    pathOptions={{ color: '#1a73e8', fillColor: '#1a73e8', fillOpacity: 0.25, weight: 2 }}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
