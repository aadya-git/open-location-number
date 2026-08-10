/**
 * Open Location Number Platform — Plus Codes Styled Support Page.
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: 'How does Open Location Number differ from Google Plus Codes?',
    a: 'Plus Codes use 20 alphanumeric symbols including Latin letters (C, F, G, H, J, M, P, Q, R, V, W, X). Open Location Number (Dash Number) uses ONLY digits 0–9, enabling universal literacy and dictation across feature phones and spoken calls.'
  },
  {
    q: 'What is the Damm algorithm and why is it used?',
    a: 'The Damm algorithm is a 10x10 totally anti-symmetric quasigroup checksum method. Position 14 of an Open Location Number contains a Damm check digit that catches 100% of single-digit typos and adjacent-digit transpositions.'
  },
  {
    q: 'Why is the check digit zoom-invariant?',
    a: 'The Damm check digit is calculated strictly over the 13 backbone digits (~11m address). Because it excludes the base-9 grid tail, adding or removing grid digits to increase precision never alters the check digit.'
  },
  {
    q: 'Why does the grid tail use base-9 digits 1–9?',
    a: 'The base-9 grid divides the 0.0001° cell into a 3x3 sub-cell matrix. Digits 1–9 represent the sub-cells. The digit 0 NEVER appears in the grid tail, providing a free validity check.'
  },
  {
    q: 'Is Open Location Number free and open-source?',
    a: 'Yes. The algorithm is pure arithmetic based on WGS84 coordinates and contains zero proprietary components. It is published under an open public-domain standard.'
  }
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 font-sans">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-wider bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#202124] dark:text-white mt-3 tracking-tight">
          Support & FAQ Center
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          Find answers to common questions about adopting and integrating Open Location Number.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="clean-panel overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              className="w-full p-5 text-left font-display font-semibold text-[#202124] dark:text-white flex justify-between items-center text-sm hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] transition-colors"
            >
              <span>{faq.q}</span>
              {openIndex === idx ? <ChevronUp className="w-4 h-4 text-[#1a73e8]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5 text-slate-600 dark:text-slate-300 text-xs leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
