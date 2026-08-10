/**
 * Open Location Number Platform — Plus Codes Styled Footer.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Terminal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#202124] text-slate-600 dark:text-slate-400 py-12 transition-colors duration-200 z-10 relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#1a73e8] text-white flex items-center justify-center">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-[#202124] dark:text-white">{t('nav_brand')}</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Universal digit-only geocode standard for metre-scale location addressing.
            </p>
          </div>

          <div>
            <h4 className="font-mono uppercase font-semibold text-[#202124] dark:text-white mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-[#1a73e8] dark:hover:text-[#8ab4f8]">{t('nav_home')}</Link></li>
              <li><Link to="/why" className="hover:text-[#1a73e8] dark:hover:text-[#8ab4f8]">{t('nav_why')}</Link></li>
              <li><Link to="/technology" className="hover:text-[#1a73e8] dark:hover:text-[#8ab4f8]">{t('nav_comparison')}</Link></li>
              <li><Link to="/try" className="text-[#1a73e8] dark:text-[#8ab4f8] font-medium">{t('nav_try')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono uppercase font-semibold text-[#202124] dark:text-white mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/docs" className="hover:text-[#1a73e8] dark:hover:text-[#8ab4f8]">{t('nav_docs')}</Link></li>
              <li><a href="https://github.com/kortexity-labs/open-location-number" target="_blank" rel="noreferrer" className="hover:text-[#1a73e8] dark:hover:text-[#8ab4f8]">GitHub Repository</a></li>
              <li><Link to="/address-maker" className="hover:text-[#1a73e8] dark:hover:text-[#8ab4f8]">{t('nav_address_maker')}</Link></li>
              <li><Link to="/contact" className="hover:text-[#1a73e8] dark:hover:text-[#8ab4f8]">{t('nav_contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono uppercase font-semibold text-[#202124] dark:text-white mb-3">Specification</h4>
            <div className="p-3 bg-slate-50 dark:bg-[#171717] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between"><span className="text-slate-400">Datum</span><span className="text-[#1a73e8] dark:text-[#8ab4f8] font-bold">WGS84</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Checksum</span><span className="text-[#1a73e8] dark:text-[#8ab4f8] font-bold">Damm Algorithm</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Default Precision</span><span>~3.7m</span></div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Open Location Number Standard. Public domain open specification.</p>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-[#1a73e8] dark:text-[#8ab4f8]" />
            <span>React + Vite + FastAPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
