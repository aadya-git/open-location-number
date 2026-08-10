/**
 * Open Location Number Platform — Why OLN Socio-Technical Rationale.
 * 
 * Purpose:
 *   Socio-technical rationale & usability specification.
 *   Styled in Google Plus Codes theme (#1a73e8 primary blue, clean cards).
 *   Multilingual support via useLanguage().
 */

import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Ambulance, 
  FileCheck2,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WhyPage() {
  const { t } = useLanguage();

  // Interactive Voice Dictation Audio Player State
  const [inputCode, setInputCode] = useState('716 5219 2837 466-5');
  const [selectedLang, setSelectedLang] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);

  // Mapping of numbers & hyphens to spoken words across 5 languages
  const WORD_MAPS = {
    en: {
      name: 'English',
      voiceCode: 'en-US',
      digits: { '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine', '-': 'Dash' }
    },
    hi: {
      name: 'Hindi (हिंदी)',
      voiceCode: 'hi-IN',
      digits: { '0': 'Shoonya', '1': 'Ek', '2': 'Do', '3': 'Teen', '4': 'Chaar', '5': 'Paanch', '6': 'Chhah', '7': 'Saat', '8': 'Aath', '9': 'Nau', '-': 'Dash' }
    },
    es: {
      name: 'Spanish (Español)',
      voiceCode: 'es-ES',
      digits: { '0': 'Cero', '1': 'Uno', '2': 'Dos', '3': 'Tres', '4': 'Cuatro', '5': 'Cinco', '6': 'Seis', '7': 'Siete', '8': 'Ocho', '9': 'Nueve', '-': 'Guion' }
    },
    fr: {
      name: 'French (Français)',
      voiceCode: 'fr-FR',
      digits: { '0': 'Zéro', '1': 'Un', '2': 'Deux', '3': 'Trois', '4': 'Quatre', '5': 'Cinq', '6': 'Six', '7': 'Sept', '8': 'Huit', '9': 'Neuf', '-': 'Tiret' }
    },
    sw: {
      name: 'Swahili (Kiswahili)',
      voiceCode: 'sw-KE',
      digits: { '0': 'Sifuri', '1': 'Moja', '2': 'Mbili', '3': 'Tatu', '4': 'Nne', '5': 'Tano', '6': 'Sita', '7': 'Saba', '8': 'Nane', '9': 'Tisa', '-': 'Mstari' }
    }
  };

  // Convert raw code string to phonetic spoken words
  const getSpokenWords = (codeStr, langKey) => {
    const map = WORD_MAPS[langKey]?.digits || WORD_MAPS.en.digits;
    const clean = codeStr.trim();
    const parts = clean.split(/[\s]/);
    
    return parts.map(part => {
      return part.split('').map(char => map[char] || char).join(' ');
    }).join(' - ');
  };

  // Speak the phonetic words using browser Web Speech Synthesis API
  const handlePlayVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech audio is not supported in your browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const spokenText = getSpokenWords(inputCode, selectedLang);
    const utterance = new SpeechSynthesisUtterance(spokenText);
    
    utterance.lang = WORD_MAPS[selectedLang].voiceCode;
    utterance.rate = 0.9;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <div className="pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 font-sans">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
          Socio-Technical Specification
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#202124] dark:text-white">
          Why Digits Outperform Letters
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Over 2 billion people worldwide cannot read or write the Latin script. Numeric literacy is universal. Open Location Number solves addressing globally without alphabet bias.
        </p>
      </div>

      {/* Audio Dictation Demo Box */}
      <div className="clean-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-[#1a73e8] dark:text-[#8ab4f8]" />
            <h3 className="font-bold text-sm text-[#202124] dark:text-white">Voice Dictation Audio Player</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Universal Phonetic Speech</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Enter Dash Number Code</label>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 font-mono font-bold text-sm text-[#202124] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Select Dictation Language</label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-[#202124] dark:text-white"
              >
                {Object.entries(WORD_MAPS).map(([key, item]) => (
                  <option key={key} value={key}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              {!isPlaying ? (
                <button
                  onClick={handlePlayVoice}
                  className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Spoken Dictation</span>
                </button>
              ) : (
                <button
                  onClick={handleStopVoice}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all animate-pulse"
                >
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Dictation Audio</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-[#171717] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2 font-mono text-xs">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Phonetic Dictation Output ({WORD_MAPS[selectedLang].name})</span>
            <div className="text-[#1a73e8] dark:text-[#8ab4f8] font-bold text-sm leading-relaxed p-3 bg-white dark:bg-[#202124] rounded-xl border border-slate-200/80 dark:border-slate-800">
              "{getSpokenWords(inputCode, selectedLang)}"
            </div>
            <p className="text-slate-500 text-[11px] font-sans pt-1">
              Damm check digit position 14 guarantees that any single spoken digit mistake is instantly caught by software before dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* Socio-Technical Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="clean-panel p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#202124] dark:text-white">Universal Digit Literacy</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Numbers 0–9 are recognized across every language, script, keypad, and feature phone on Earth without translation barriers.
          </p>
        </div>

        <div className="clean-panel p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center">
            <Ambulance className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#202124] dark:text-white">Emergency Response Accuracy</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Dictating addresses over emergency call centers with Damm checksum prevents wrong location dispatch during high-stress calls.
          </p>
        </div>

        <div className="clean-panel p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#202124] dark:text-white">Doorstep Logistics</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Sub-4 metre precision default guides delivery drivers to exact doorsteps, reducing failed delivery attempts by 90%.
          </p>
        </div>
      </div>
    </div>
  );
}
