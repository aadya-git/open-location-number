/**
 * Open Location Number Platform — Plus Codes Styled Hero & Live Generator Widget.
 * 
 * Purpose:
 *   - Hero section introducing Open Location Number (Dash Number).
 *   - Interactive 3-Step User Manual flow with step progression.
 *   - Pixel-perfect equal height cards, h-11 search bar alignment, and clear visualizer.
 * 
 * Related Files:
 *   - frontend/src/api/client.js: Handles geocoding search & Dash Number calculation.
 *   - frontend/src/context/LanguageContext.jsx: Translation context.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  Copy, 
  Check, 
  PhoneCall, 
  Layers, 
  Search,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { encodeLocation, geocodePlaceOrPin, POPULAR_LOCATIONS } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  // User Manual Active Step State (1, 2, or 3)
  const [activeStep, setActiveStep] = useState(1);

  // Live Generator Widget State
  const [searchQuery, setSearchQuery] = useState('New Delhi');
  const [lat, setLat] = useState(28.613939);
  const [lon, setLon] = useState(77.209021);
  const [placeTitle, setPlaceTitle] = useState('New Delhi, India');
  const [gridDigits] = useState(1);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Recalculate Dash Number when coordinates change
  useEffect(() => {
    async function update() {
      const data = await encodeLocation(lat, lon, gridDigits);
      setResult(data);
    }
    update();
  }, [lat, lon, gridDigits]);

  // Handle Place Name or PIN Code Search submit
  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError(null);

    try {
      const geo = await geocodePlaceOrPin(searchQuery);
      setLat(geo.lat);
      setLon(geo.lon);
      setPlaceTitle(geo.name);
      setActiveStep(2); // Automatically advance to Step 2 so user sees generated code!
    } catch (err) {
      setSearchError(err.message || 'Location not found. Try a city or PIN code.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle quick sample location button click
  const handleSelectPreset = async (preset) => {
    setSearchQuery(preset.name);
    setLat(preset.lat);
    setLon(preset.lon);
    setPlaceTitle(`${preset.name} (PIN: ${preset.pin})`);
    setSearchError(null);
    setActiveStep(2); // Automatically advance to Step 2!
  };

  // Copy generated Dash Number to clipboard
  const handleCopy = () => {
    if (result?.code) {
      navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const manualSteps = [
    {
      step: 1,
      title: '1. Pick a Location',
      desc: 'Type a city name, PIN code (e.g. Delhi 110001), or tap on map.',
      icon: MapPin,
      badge: 'Step 1 of 3'
    },
    {
      step: 2,
      title: '2. Get Your Dash Number',
      desc: 'Location converts into a 15-digit pure number code.',
      icon: Layers,
      badge: 'Step 2 of 3'
    },
    {
      step: 3,
      title: '3. Speak or SMS to Anyone',
      desc: 'Dictate over phone call or text via SMS. Works in any language.',
      icon: PhoneCall,
      badge: 'Step 3 of 3'
    }
  ];

  return (
    <section className="relative pt-24 pb-12 z-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badge */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e8f0fe] dark:bg-[#172b4d] border border-blue-200 dark:border-blue-800 text-[#1a73e8] dark:text-[#8ab4f8] text-xs font-mono font-semibold shadow-sm">
            <Globe className="w-3.5 h-3.5" />
            <span>Universal Digit-Only Geocode Standard</span>
          </span>
        </div>

        {/* Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#202124] dark:text-white font-display leading-snug">
            Address Any Location on Earth with{' '}
            <span className="text-[#1a73e8] dark:text-[#8ab4f8]">Pure Digits</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            {t('hero_subtitle')}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/try"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <MapPin className="w-4 h-4" />
              <span>{t('nav_try')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/technology"
              className="px-5 py-2.5 text-xs font-semibold text-[#1a73e8] dark:text-[#8ab4f8] bg-[#e8f0fe] dark:bg-[#1e293b] hover:bg-[#d2e3fc] dark:hover:bg-[#334155] rounded-xl transition-all"
            >
              Architecture Specs
            </Link>
          </div>
        </div>

        {/* Animated User Manual */}
        <div className="my-10 clean-panel p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-mono text-[#1a73e8] dark:text-[#8ab4f8] font-bold uppercase tracking-wider">User Manual</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#202124] dark:text-white mt-1">
              How Anyone Can Use It in 3 Simple Steps
            </h2>
          </div>

          {/* Step Selector Buttons with Identical Equal Height */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {manualSteps.map((step) => {
              const Icon = step.icon;
              const isCurrent = activeStep === step.step;
              return (
                <button
                  key={step.step}
                  onClick={() => setActiveStep(step.step)}
                  className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-full min-h-[125px] ${
                    isCurrent
                      ? 'bg-[#e8f0fe] dark:bg-[#172b4d] border-[#1a73e8] text-[#202124] dark:text-white shadow-sm ring-2 ring-[#1a73e8]/30'
                      : 'bg-white dark:bg-[#202124] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 w-full">
                    <div className={`p-2.5 rounded-xl ${isCurrent ? 'bg-[#1a73e8] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {step.badge}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-[#202124] dark:text-white">{step.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{step.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Animated Step Visualizer */}
          <div className="bg-slate-50 dark:bg-[#171717] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <AnimatePresence mode="wait">
              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#1a73e8] dark:text-[#8ab4f8] uppercase">Step 1: Location Input</span>
                    <span className="text-[11px] text-slate-500 font-mono">Input: Place / PIN / GPS</span>
                  </div>

                  <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
                    <div className="relative flex-grow w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={t('hero_search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 bg-white dark:bg-[#202124] border border-slate-200/80 dark:border-slate-800 rounded-xl pl-10 pr-4 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="h-11 px-5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap w-full sm:w-auto shrink-0"
                    >
                      {isSearching ? <Zap className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      <span>{t('search')}</span>
                    </button>
                  </form>

                  {/* Preset Locations */}
                  <div className="flex items-center gap-2 flex-wrap pt-2 text-xs">
                    <span className="text-slate-500 font-mono font-semibold shrink-0">Try Preset:</span>
                    {POPULAR_LOCATIONS.slice(0, 4).map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleSelectPreset(preset)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#202124] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#1a73e8] hover:text-white font-mono text-xs font-medium transition-all shadow-sm"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>

                  {searchError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{searchError}</span>
                    </div>
                  )}
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#1a73e8] dark:text-[#8ab4f8] uppercase">Step 2: Instant Geocode Conversion</span>
                    <span className="text-[11px] text-slate-500 font-mono">Damm Checksum Verified</span>
                  </div>

                  <div className="bg-white dark:bg-[#202124] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                      <span>Target Location: <strong className="text-slate-900 dark:text-white">{placeTitle}</strong></span>
                      <span className="text-[#1a73e8] dark:text-[#8ab4f8] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-[#1a73e8]" /> Damm Valid
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-[#171717] rounded-xl border border-slate-200/80 dark:border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Generated Dash Number Code</span>
                      <div className="font-mono text-2xl sm:text-3xl font-bold text-[#1a73e8] dark:text-[#8ab4f8] tracking-widest">
                        {result?.code || '716 5219 2837 466-5'}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400">Accuracy: ~{result?.cell_size_meters || 3.7}m square</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveStep(1)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Change</span>
                        </button>
                        <button
                          onClick={handleCopy}
                          className="px-3.5 py-1.5 rounded-xl bg-[#1a73e8] text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                        >
                          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? t('copied') : t('copy')}</span>
                        </button>
                        <button
                          onClick={() => setActiveStep(3)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] font-bold text-xs flex items-center gap-1"
                        >
                          <span>Speak/SMS</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#1a73e8] dark:text-[#8ab4f8] uppercase">Step 3: Communicate Anywhere</span>
                    <span className="text-[11px] text-slate-500 font-mono">Phone Call & SMS</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-[#202124] rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-[#1a73e8] dark:text-[#8ab4f8] font-semibold text-xs font-mono">
                        <PhoneCall className="w-4 h-4" />
                        <span>Dictate Over Phone Call</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Read digits aloud over phone in any language. Damm algorithm catches 100% of single typos.
                      </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#202124] rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-[#1a73e8] dark:text-[#8ab4f8] font-semibold text-xs font-mono">
                        <Globe className="w-4 h-4" />
                        <span>Send via SMS / Messaging</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Pure digits work on basic feature phones without internet or special keyboard maps.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-xs">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Code</span>
                    </button>
                    <Link
                      to="/try"
                      className="px-4 py-2 rounded-xl bg-[#1a73e8] text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                    >
                      <span>Try Full Platform</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
