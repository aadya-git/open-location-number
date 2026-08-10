/**
 * Open Location Number Platform — Master Documentation Page.
 * 
 * Purpose:
 *   Official documentation derived strictly from Open-Location-Number-Concept.md.
 *   Styled in Google Plus Codes Blue theme (#1a73e8) with clean alignment.
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  Layers, 
  ShieldCheck, 
  Compass, 
  FileText,
  Copy,
  Check
} from 'lucide-react';

const DOC_TABS = [
  { id: 'overview', name: '1. Overview & Plain Terms', icon: BookOpen },
  { id: 'encoding', name: '2. Encoding Pipeline', icon: Layers },
  { id: 'worked', name: '3. Worked Example', icon: Code2 },
  { id: 'forms', name: '4. Three Code Forms', icon: Compass },
  { id: 'strengths', name: '5. Strengths & Tradeoffs', icon: ShieldCheck },
  { id: 'spec-summary', name: '6. Specification Summary', icon: FileText },
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyWorked = () => {
    navigator.clipboard.writeText('716 5219 2837 466-5');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 font-sans">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-wider bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
          Official Master Documentation
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#202124] dark:text-white mt-3 tracking-tight">
          Open Location Number Specification
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          Standard specification for Open Location Number (Everyday name: Dash Number).
        </p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Tabs */}
        <div className="lg:col-span-4 clean-panel p-3 space-y-1 sticky top-24">
          <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider px-3 py-2">Documentation Index</h4>
          {DOC_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#1a73e8] text-white font-semibold shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8 clean-panel p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              <h2 className="text-2xl font-bold font-display text-[#202124] dark:text-white border-b border-slate-200/80 dark:border-slate-800 pb-3">1. Overview & Plain Terms</h2>
              <p>
                <strong>Open Location Number (Dash Number)</strong> is a pure-numeric open geocoding standard that addresses any location on Earth to sub-metre precision using only digits 0–9.
              </p>
              <p>
                Unlike alphanumeric codes (such as Google Plus Codes or DIGIPIN), Dash Number uses universal digits only — enabling anyone to dictate, write, or text an address across any language, script, or phone device without alphabet literacy barriers.
              </p>
              <div className="p-4 bg-slate-50 dark:bg-[#171717] rounded-xl border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-[#1a73e8] dark:text-[#8ab4f8] space-y-1">
                <div className="font-bold text-[#202124] dark:text-white">Canonical Example Code:</div>
                <div className="text-lg font-bold">716 5219 2837 466-5</div>
                <div className="text-slate-500 text-[11px]">1 Macro Digit + 12 Decimal Digits + 1 Damm Check Digit + Hyphen + Grid Tail</div>
              </div>
            </div>
          )}

          {/* TAB 2: Encoding Pipeline */}
          {activeTab === 'encoding' && (
            <div className="space-y-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <h2 className="text-2xl font-bold font-display text-[#202124] dark:text-white border-b border-slate-200/80 dark:border-slate-800 pb-3">2. Encoding Pipeline</h2>
              
              <div className="space-y-3">
                <h3 className="text-lg font-bold font-display text-[#202124] dark:text-white pt-1">2.1 Coordinate Normalization</h3>
                <p>
                  Latitude [-90, +90] and Longitude [-180, +180] are shifted to positive values:
                </p>
                <div className="p-3 bg-slate-50 dark:bg-[#171717] rounded-lg border font-mono text-xs text-[#1a73e8] dark:text-[#8ab4f8]">
                  LAT' = lat + 90 ∈ [0, 180]<br/>
                  LON' = lon + 180 ∈ [0, 360]
                </div>

                <h3 className="text-lg font-bold font-display text-[#202124] dark:text-white pt-1">2.2 Macro Digit (Position 1)</h3>
                <p>
                  Calculated from the hundreds digits of normalized coordinates:
                </p>
                <div className="p-3 bg-slate-50 dark:bg-[#171717] rounded-lg border font-mono text-xs text-[#1a73e8] dark:text-[#8ab4f8]">
                  macro = 1 + (lat_hundreds x 4 + lon_hundreds) → Digit 1 to 8
                </div>

                <h3 className="text-lg font-bold font-display text-[#202124] dark:text-white pt-1">2.3 Six Decimal Pairs (Positions 2–13)</h3>
                <p>
                  Six pairs of latitude/longitude decimal digits resolve location to an ~11m address cell:
                </p>
                <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  <li>Pair 1: tens (1,113 km)</li>
                  <li>Pair 2: units (111 km)</li>
                  <li>Pair 3: 0.1° (11.1 km)</li>
                  <li>Pair 4: 0.01° (1.1 km)</li>
                  <li>Pair 5: 0.001° (111 m)</li>
                  <li>Pair 6: 0.0001° (11.1 m)</li>
                </ul>

                <h3 className="text-lg font-bold font-display text-[#202124] dark:text-white pt-1">2.4 Damm Check Digit (Position 14)</h3>
                <p>
                  Calculated over the 13 backbone digits only. Zoom-invariant and preserves geographic sorting.
                </p>

                <h3 className="text-lg font-bold font-display text-[#202124] dark:text-white pt-1">2.5 Grid Digits (Positions 15+)</h3>
                <p>
                  Base-9 digits (1–9) refine the ~11m cell by 3x3 nested sub-cells. Digit 0 NEVER appears in the grid tail.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Worked Example */}
          {activeTab === 'worked' && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold font-display text-[#202124] dark:text-white border-b border-slate-200/80 dark:border-slate-800 pb-3">3. Worked Example</h2>
              <p className="text-slate-700 dark:text-slate-300 text-xs">
                Target coordinates: <strong className="font-mono text-[#202124] dark:text-white">25.123456, 82.987654</strong> (Open Farmland)
              </p>

              <div className="bg-slate-50 dark:bg-[#171717] p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-2">
                <div className="text-[#1a73e8] dark:text-[#8ab4f8]">LAT' = 115.123456 → lat_hundreds = 1</div>
                <div className="text-[#1a73e8] dark:text-[#8ab4f8]">LON' = 262.987654 → lon_hundreds = 2</div>
                <div>macro = 1 + (1 x 4 + 2) = 7</div>
                <div>backbone = 7 16 52 19 28 37 46</div>
                <div className="text-[#1a73e8] dark:text-[#8ab4f8] font-bold">Damm Checksum over backbone = 6</div>
                <div>grid digits = 5, 8, 3</div>
                <div className="pt-2 text-[#202124] dark:text-white font-bold flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800">
                  <span className="text-[#1a73e8] dark:text-[#8ab4f8]">Default Code (~3.7m): 716 5219 2837 466-5</span>
                  <button onClick={handleCopyWorked} className="p-1.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#1a73e8] hover:text-white transition-colors">
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-[#1a73e8]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Three Code Forms */}
          {activeTab === 'forms' && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold font-display text-[#202124] dark:text-white border-b border-slate-200/80 dark:border-slate-800 pb-3">4. Three Ways to Use One Code</h2>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <h4 className="text-[#1a73e8] dark:text-[#8ab4f8] font-mono font-bold">1. Full Code (~3.7m default or sub-metre)</h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Includes macro, decimal pairs, check digit, and grid digits. Example: <code className="font-mono text-[#202124] dark:text-white font-bold">716 5219 2837 466-5</code>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <h4 className="text-[#1a73e8] dark:text-[#8ab4f8] font-mono font-bold">2. Address Form (~11m, No Grid, No Hyphen)</h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Backbone plus check digit. Carries no hyphen because there is no base-9 part. Example: <code className="font-mono text-[#202124] dark:text-white font-bold">716 5219 2837 466</code>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <h4 className="text-amber-700 dark:text-amber-400 font-mono font-bold">3. Locality Short Form</h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Replaces an ODD number of leading digits (5, 7, or 9) with a city/locality name. Example: <code className="font-mono text-[#202124] dark:text-white font-bold">Gurugram, Haryana 52 301-4</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Strengths & Limitations */}
          {activeTab === 'strengths' && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold font-display text-[#202124] dark:text-white border-b border-slate-200/80 dark:border-slate-800 pb-3">5. Strengths & Limitations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#e8f0fe]/50 dark:bg-[#172b4d]/30 border border-blue-200 dark:border-blue-800 space-y-2">
                  <h4 className="text-[#1a73e8] dark:text-[#8ab4f8] font-semibold">Key Strengths</h4>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                    <li>100% digit-only: language & script neutral</li>
                    <li>Damm check digit catches 100% single typos</li>
                    <li>Hand-convertible to lat/lon degrees</li>
                    <li>Offline calculation without database</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-2">
                  <h4 className="text-amber-800 dark:text-amber-300 font-semibold">Design Limitations</h4>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                    <li>15 digits vs 11 chars in Plus Codes</li>
                    <li>Base-10 before hyphen, Base-9 after</li>
                    <li>Grid tail is unchecked (only "no 0" rule)</li>
                    <li>2D surface code (WGS84 datum)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Specification Summary */}
          {activeTab === 'spec-summary' && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold font-display text-[#202124] dark:text-white border-b border-slate-200/80 dark:border-slate-800 pb-3">6. Specification Summary</h2>
              <pre className="bg-slate-50 dark:bg-[#171717] p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 font-mono text-[#1a73e8] dark:text-[#8ab4f8] text-xs overflow-x-auto leading-relaxed">
{`Name:        Open Location Number (Dash Number)
Normalize:   LAT' = lat + 90  ∈ [0,180]
             LON' = lon + 180 ∈ [0,360]
Position 1:  macro = 1 + (floor(LAT'/100)*4 + floor(LON'/100)) → digit 1–8
Positions 2–13: 6 decimal pairs (tens, units, .1, .01, .001, .0001)
Position 14: Damm check digit over backbone (zoom-invariant)
Positions 15+: Base-9 grid digits (1–9), 3x3 refinement
Display:     XXX XXXX XXXX XXX - GGG (3-4-4-3 grouping)
Datum:       WGS84 (2D surface)
License:     Public Domain / Open Specification`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
