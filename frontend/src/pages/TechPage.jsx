/**
 * Open Location Number Platform — Technology Page.
 * 
 * Purpose:
 *   Technical architecture documentation and interactive visualizers for Open Location Number.
 *   Render base-9 sub-cell visualizer, Damm checksum matrix, and precision table.
 */

import React, { useState } from 'react';

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

const PRECISION_TABLE = [
  { digits: 0, size: '~11.1 m', area: '~123 m²', scale: 'Building / Plot Address', form: 'Address Form (No Hyphen)' },
  { digits: 1, size: '~3.7 m', area: '9–14 m²', scale: 'Small Plot / Building Footprint', form: 'Default (15 Digits, 1 Hyphen)' },
  { digits: 2, size: '~1.2 m', area: '~1.5 m²', scale: 'Parking Space / Stall', form: 'Sub-Metre Tier 1' },
  { digits: 3, size: '~0.41 m', area: '~0.17 m²', scale: 'Doorway / Survey Pin', form: 'Sub-Metre Tier 2' },
  { digits: 4, size: '~13.7 cm', area: '~187 cm²', scale: 'Manhole / Meter Box', form: 'Centimetre Grade' },
  { digits: 6, size: '~1.5 cm', area: '~2.3 cm²', scale: 'High-Precision Asset', form: 'Survey Grade' },
  { digits: 8, size: '~1.7 mm', area: '~2.8 mm²', scale: 'Millimetre Pinpoint', form: 'Ultra Survey' },
];

export default function TechPage() {
  const [selectedGridDigit, setSelectedGridDigit] = useState(5);

  const gridCells = [
    { digit: 7, row: 2, col: 0, label: 'North-West (7)' },
    { digit: 8, row: 2, col: 1, label: 'North-Centre (8)' },
    { digit: 9, row: 2, col: 2, label: 'North-East (9)' },
    { digit: 4, row: 1, col: 0, label: 'West-Centre (4)' },
    { digit: 5, row: 1, col: 1, label: 'Centre (5)' },
    { digit: 6, row: 1, col: 2, label: 'East-Centre (6)' },
    { digit: 1, row: 0, col: 0, label: 'South-West (1)' },
    { digit: 2, row: 0, col: 1, label: 'South-Centre (2)' },
    { digit: 3, row: 0, col: 2, label: 'South-East (3)' },
  ];

  return (
    <div className="pt-28 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-wider bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
          Technical Architecture & Mathematics
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#202124] dark:text-white mt-4 tracking-tight">
          How Open Location Number Works
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          Detailed breakdown of coordinate normalization, backbone encoding, Damm checksum verification, and base-9 grid refinement.
        </p>
      </div>

      {/* 1. Four Structural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="clean-panel p-5 space-y-2">
          <span className="text-xs font-mono text-[#1a73e8] dark:text-[#8ab4f8] font-bold uppercase">Position 1</span>
          <h4 className="text-slate-900 dark:text-white font-semibold text-base">Macro Digit (1–8)</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Identifies one of 8 global 100° x 100° zones. Eliminates negative signs.
          </p>
        </div>

        <div className="clean-panel p-5 space-y-2">
          <span className="text-xs font-mono text-[#1a73e8] dark:text-[#8ab4f8] font-bold uppercase">Positions 2–13</span>
          <h4 className="text-slate-900 dark:text-white font-semibold text-base">6 Decimal Pairs</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Latitude/Longitude digits interleaved pair-by-pair down to ~11m address accuracy.
          </p>
        </div>

        <div className="clean-panel p-5 space-y-2 border-blue-500/40 bg-[#e8f0fe]/50 dark:bg-[#172b4d]/30">
          <span className="text-xs font-mono text-[#1a73e8] dark:text-[#8ab4f8] font-bold uppercase">Position 14</span>
          <h4 className="text-slate-900 dark:text-white font-semibold text-base">Damm Check Digit</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Zoom-invariant checksum over backbone. Catches 100% single typos and transpositions.
          </p>
        </div>

        <div className="clean-panel p-5 space-y-2">
          <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold uppercase">Positions 15+</span>
          <h4 className="text-slate-900 dark:text-white font-semibold text-base">Base-9 Grid Tail</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Uncapped 3x3 nested cell refinement (digits 1–9). Default: 1 grid digit (~3.7m).
          </p>
        </div>
      </div>

      {/* 2. Interactive Base-9 Grid Layout Visualizer */}
      <div className="clean-panel p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-mono text-[#1a73e8] dark:text-[#8ab4f8] font-bold uppercase tracking-wider">Section 2.5 Visualizer</span>
          <h2 className="text-2xl font-bold font-display text-[#202124] dark:text-white">Base-9 Sub-Cell Layout</h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            Inside each ~11m cell, the base-9 grid divides latitude and longitude into 3 equal parts (3 x 3 = 9 sub-cells).
          </p>
          <div className="bg-slate-50 dark:bg-[#171717] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-[#1a73e8] dark:text-[#8ab4f8] space-y-1">
            <div>Formula: digit = 3 x row + column + 1</div>
            <div className="text-slate-500">row 0 = South, col 0 = West | digit 5 = Centre</div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Selected Sub-Cell: <strong className="text-[#1a73e8] dark:text-[#8ab4f8] font-mono font-bold">Digit {selectedGridDigit}</strong> — {gridCells.find(c => c.digit === selectedGridDigit)?.label}
          </p>
        </div>

        {/* Interactive 3x3 Grid Matrix */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-sm aspect-square bg-slate-50 dark:bg-[#171717] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 grid grid-cols-3 gap-3 shadow-inner">
            {gridCells.map((cell) => (
              <button
                key={cell.digit}
                onClick={() => setSelectedGridDigit(cell.digit)}
                className={`rounded-xl flex flex-col items-center justify-center font-mono transition-all ${
                  selectedGridDigit === cell.digit
                    ? 'bg-[#1a73e8] text-white font-bold shadow scale-105'
                    : 'bg-white dark:bg-[#202124] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <span className="text-xl font-bold">{cell.digit}</span>
                <span className="text-[10px] opacity-80 font-sans">{cell.digit === 5 ? 'Centre' : `r${cell.row} c${cell.col}`}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Damm Checksum Matrix Inspector */}
      <div className="clean-panel p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-[#1a73e8] dark:text-[#8ab4f8] font-bold uppercase tracking-wider">Section 2.4 Mechanics</span>
            <h2 className="text-2xl font-bold font-display text-[#202124] dark:text-white">Damm Quasigroup Checksum Matrix</h2>
          </div>
          <span className="px-3 py-1 text-xs font-mono bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] border border-blue-200 dark:border-blue-800 rounded-full">
            Zoom-Invariant & Order-Preserving
          </span>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed max-w-3xl">
          Position 14 contains a Damm check digit computed over the 13-digit backbone. Because the check excludes the grid tail, adding or removing grid digits never alters the check digit.
        </p>

        {/* Damm Lookup Table */}
        <div className="overflow-x-auto bg-slate-50 dark:bg-[#171717] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-center text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[#1a73e8] dark:text-[#8ab4f8]">
                <th className="p-2 text-slate-400">i \ j</th>
                {[0,1,2,3,4,5,6,7,8,9].map(col => (
                  <th key={col} className="p-2 font-bold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {DAMM_MATRIX.map((row, i) => (
                <tr key={i} className="hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                  <td className="p-2 text-[#1a73e8] dark:text-[#8ab4f8] font-bold bg-slate-100/60 dark:bg-slate-900/60">{i}</td>
                  {row.map((val, j) => (
                    <td 
                      key={j} 
                      className={`p-2 ${
                        val === 0 ? 'text-[#1a73e8] dark:text-[#8ab4f8] font-bold bg-[#e8f0fe]/60 dark:bg-[#172b4d]/60' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Precision Scaling Table */}
      <div className="clean-panel p-6 sm:p-8 space-y-4">
        <div>
          <span className="text-xs font-mono text-[#1a73e8] dark:text-[#8ab4f8] font-bold uppercase tracking-wider">Section 2.5 Reference</span>
          <h2 className="text-2xl font-bold font-display text-[#202124] dark:text-white">Precision Scaling & Cell Sizes</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-700 dark:text-slate-300 min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-500 uppercase">
                <th className="py-3 px-4">Grid Digits</th>
                <th className="py-3 px-4">Cell Width (Equator)</th>
                <th className="py-3 px-4">Approx Area</th>
                <th className="py-3 px-4">Target Scale</th>
                <th className="py-3 px-4">Code Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {PRECISION_TABLE.map((row) => (
                <tr key={row.digits} className={row.digits === 1 ? 'bg-[#e8f0fe] dark:bg-[#172b4d]/40 font-bold text-[#1a73e8] dark:text-[#8ab4f8]' : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'}>
                  <td className="py-3 px-4 font-bold">{row.digits}</td>
                  <td className="py-3 px-4 text-[#1a73e8] dark:text-[#8ab4f8]">{row.size}</td>
                  <td className="py-3 px-4">{row.area}</td>
                  <td className="py-3 px-4 font-sans">{row.scale}</td>
                  <td className="py-3 px-4 text-slate-500">{row.form}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
