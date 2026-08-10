/**
 * Open Location Number Platform — Home Page.
 * 
 * Purpose:
 *   Main homepage featuring Hero, User Manual, and Comparison matrix.
 *   Styled in Google Blue theme (#1a73e8) with clean alignment.
 */

import React from 'react';
import Hero from '../components/Hero';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 font-sans">
      {/* 1. Hero & Animated User Manual Flow */}
      <Hero />

      {/* 2. Comparison Table Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono text-[#1a73e8] dark:text-[#8ab4f8] font-semibold uppercase tracking-wider bg-[#e8f0fe] dark:bg-[#172b4d] border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
            Comparative Benchmark
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#202124] dark:text-white mt-3">
            Why Digits Outperform Letters
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
            Over 2 billion people cannot read the Latin alphabet. Open Location Number eliminates literacy barriers.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="clean-panel p-6 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 uppercase">
                <th className="py-3 px-4">Feature / Property</th>
                <th className="py-3 px-4 bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] font-bold rounded-t-lg">
                  Open Location Number (Dash)
                </th>
                <th className="py-3 px-4">Google Plus Codes</th>
                <th className="py-3 px-4">DIGIPIN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-xs">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#202124] dark:text-white">Character Set</td>
                <td className="py-3.5 px-4 bg-[#e8f0fe]/40 dark:bg-[#172b4d]/30 text-[#1a73e8] dark:text-[#8ab4f8] font-bold">Digits 0–9 Only</td>
                <td className="py-3.5 px-4 text-slate-500">20 symbols (incl. letters)</td>
                <td className="py-3.5 px-4 text-slate-500">16 symbols (8 letters)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#202124] dark:text-white">Literacy Required</td>
                <td className="py-3.5 px-4 bg-[#e8f0fe]/40 dark:bg-[#172b4d]/30 text-[#1a73e8] dark:text-[#8ab4f8] font-bold">Numeric Only (0–9)</td>
                <td className="py-3.5 px-4 text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-500" /> Latin Alphabet
                </td>
                <td className="py-3.5 px-4 text-rose-600 dark:text-rose-400">Latin Alphabet</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#202124] dark:text-white">Built-in Error Detection</td>
                <td className="py-3.5 px-4 bg-[#e8f0fe]/40 dark:bg-[#172b4d]/30 text-[#1a73e8] dark:text-[#8ab4f8] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1a73e8] dark:text-[#8ab4f8]" /> Damm Check Digit
                </td>
                <td className="py-3.5 px-4 text-slate-500">None</td>
                <td className="py-3.5 px-4 text-slate-500">None</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#202124] dark:text-white">Hand-Convertible to Coordinates</td>
                <td className="py-3.5 px-4 bg-[#e8f0fe]/40 dark:bg-[#172b4d]/30 text-[#1a73e8] dark:text-[#8ab4f8] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1a73e8] dark:text-[#8ab4f8]" /> Yes (Decimal degrees)
                </td>
                <td className="py-3.5 px-4 text-slate-500">No (Needs lookup table)</td>
                <td className="py-3.5 px-4 text-slate-500">No (Needs lookup table)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#202124] dark:text-white">Default Precision</td>
                <td className="py-3.5 px-4 bg-[#e8f0fe]/40 dark:bg-[#172b4d]/30 text-[#1a73e8] dark:text-[#8ab4f8] font-bold">~3.7 m (15 digits)</td>
                <td className="py-3.5 px-4 text-slate-500">~14 m² (11 chars)</td>
                <td className="py-3.5 px-4 text-slate-500">4 m (10 chars)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
