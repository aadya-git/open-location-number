/**
 * Open Location Number Platform — Minimalist Navbar with Multilingual Switcher.
 * 
 * Purpose:
 *   Horizontal top navigation header with Light / Dark theme switcher and Language dropdown.
 *   Ensures 100% horizontal single-line alignment with whitespace-nowrap.
 *   Brand Badge: Dash Number.
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, MapPin, Github, ArrowRight, Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLanguage, t, LANGUAGES } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeLangConfig = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  const navLinks = [
    { name: t('nav_home'), path: '/' },
    { name: t('nav_why'), path: '/why' },
    { name: t('nav_technology'), path: '/technology' },
    { name: t('nav_docs'), path: '/docs' },
    { name: t('nav_address_maker'), path: '/address-maker' },
    { name: t('nav_support'), path: '/support' },
    { name: t('nav_contact'), path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#202124]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 flex-nowrap">
          
          {/* Brand Logo & Dash Number Badge */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 whitespace-nowrap">
            <div className="w-8 h-8 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-semibold text-[#202124] dark:text-white text-base tracking-tight font-sans whitespace-nowrap">
                {t('nav_brand')}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-medium uppercase bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] border border-blue-200 dark:border-blue-800 rounded-md whitespace-nowrap">
                Dash Number
              </span>
            </div>
          </Link>

          {/* Desktop Horizontal Single-Line Navigation Header */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/90 dark:bg-[#2d2e31]/90 backdrop-blur border border-slate-200/80 dark:border-slate-800 px-3 py-1.5 rounded-full shadow-sm flex-nowrap">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap inline-block ${
                    isActive
                      ? 'bg-[#1a73e8] text-white shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#1a73e8] dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0 whitespace-nowrap">
            {/* Language Switcher Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#202124] border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
              >
                <span>{activeLangConfig.flag}</span>
                <span>{activeLangConfig.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#202124] border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-50 font-sans">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors whitespace-nowrap ${
                        lang === l.code
                          ? 'bg-[#e8f0fe] dark:bg-[#1e293b] text-[#1a73e8] dark:text-[#8ab4f8] font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.name}</span>
                      </span>
                      {lang === l.code && <span className="text-[#1a73e8]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Light / Dark Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-800 shadow-sm shrink-0"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <a
              href="https://github.com/kortexity-labs/open-location-number"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/80 dark:border-slate-800 shadow-sm shrink-0"
              title="GitHub Specification Repository"
            >
              <Github className="w-4 h-4" />
            </a>

            <Link
              to="/try"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl shadow-sm transition-all hover:scale-[1.02] shrink-0 whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t('nav_try')}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 px-4 pb-6 pt-2 bg-white dark:bg-[#202124] border-b border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="flex flex-col gap-1">
            {/* Language Selection Bar for Mobile */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
              <span className="text-xs font-semibold text-slate-500">Language:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-2 py-1 rounded text-[11px] font-medium ${
                      lang === l.code ? 'bg-[#1a73e8] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {l.flag} {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-xs font-medium ${
                  location.pathname === link.path
                    ? 'bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/try"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full py-2.5 rounded-xl bg-[#1a73e8] text-white font-semibold text-xs text-center shadow-sm"
            >
              {t('nav_try')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
