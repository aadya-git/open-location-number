/**
 * Open Location Number Platform — Plus Codes Styled Address Badge Generator.
 * 
 * Purpose:
 *   Generates physical door plaques, metallic address badges, SMS delivery cards,
 *   and real-time Web Speech dictation guides for unaddressed premises, commercial hubs, and rural holdings.
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Home, 
  Tractor, 
  Printer, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX
} from 'lucide-react';
import { encodeLocation } from '../api/client';

export default function AddressMakerPage() {
  const [selectedCategory, setSelectedCategory] = useState('commercial');
  const [premiseName, setPremiseName] = useState('Apex Logistics & Fulfillment Hub');
  const [streetAddress, setStreetAddress] = useState('Block B, Industrial Estate, New Delhi 110020');
  const [lat, setLat] = useState(28.613939);
  const [lon, setLon] = useState(77.209021);
  const [gridDigits] = useState(1);
  
  const [codeData, setCodeData] = useState(null);
  const [copiedSms, setCopiedSms] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSelectCategory = (catKey) => {
    setSelectedCategory(catKey);
    if (catKey === 'commercial') {
      setPremiseName('Apex Logistics & Fulfillment Hub');
      setStreetAddress('Block B, Industrial Estate, New Delhi 110020');
      setLat(28.613939);
      setLon(77.209021);
    } else if (catKey === 'residential') {
      setPremiseName('Villa 14, Green Valley Estate');
      setStreetAddress('Road No. 4, Bandra West, Mumbai 400050');
      setLat(19.075983);
      setLon(72.877655);
    } else if (catKey === 'rural') {
      setPremiseName('Plot 88, Khasra 142 Holding');
      setStreetAddress('Agricultural Sector 4, Varanasi 221001');
      setLat(25.123456);
      setLon(82.987654);
    }
  };

  useEffect(() => {
    async function update() {
      const data = await encodeLocation(lat, lon, gridDigits);
      setCodeData(data);
    }
    update();
  }, [lat, lon, gridDigits]);

  const getDynamicSpokenWords = (codeStr) => {
    if (!codeStr) return '';
    const digitsMap = { '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine', '-': 'Dash' };
    const parts = codeStr.trim().split(/[\s]/);
    return parts.map(part => {
      return part.split('').map(char => digitsMap[char] || char).join(' ');
    }).join(' - ');
  };

  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window) || !codeData?.code) return;
    window.speechSynthesis.cancel();
    const spokenText = getDynamicSpokenWords(codeData.code);
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 0.9;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
  };

  const handleCopySms = () => {
    if (!codeData?.code) return;
    const smsContent = `Doorstep Address: ${premiseName}, ${streetAddress}\nOLN Code: ${codeData.code}`;
    navigator.clipboard.writeText(smsContent);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2000);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 font-sans">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
          Physical & Digital Door Signage
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#202124] dark:text-white">
          Enterprise Address Badge Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Generate door plaques, delivery cards, and speech dictation guides for unaddressed premises, commercial hubs, and rural holdings.
        </p>
      </div>

      {/* Category Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { key: 'commercial', name: 'Commercial Hub', icon: Building2 },
          { key: 'residential', name: 'Residential Villa', icon: Home },
          { key: 'rural', name: 'Rural / Unmapped Holding', icon: Tractor },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = selectedCategory === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleSelectCategory(item.key)}
              className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3 ${
                isSelected
                  ? 'bg-[#e8f0fe] dark:bg-[#172b4d] border-[#1a73e8] text-[#1a73e8] dark:text-[#8ab4f8] shadow-sm font-bold'
                  : 'bg-white dark:bg-[#202124] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#1a73e8] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form & Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-5 clean-panel p-6 space-y-4 text-xs font-mono">
          <h3 className="text-sm font-bold text-[#202124] dark:text-white font-sans border-b border-slate-200/80 dark:border-slate-800 pb-2">Premise Metadata Inputs</h3>
          
          <div>
            <label className="block text-slate-500 mb-1">Building / Holding Name</label>
            <input
              type="text"
              value={premiseName}
              onChange={(e) => setPremiseName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Locality / Street Description</label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-500 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={lon}
                onChange={(e) => setLon(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Right Badge Preview Box */}
        <div className="lg:col-span-7 space-y-4">
          <div className="clean-panel p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-[#1a73e8] dark:text-[#8ab4f8] uppercase">Generated Door Signage Badge</span>
              <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                <Printer className="w-3.5 h-3.5" />
                <span>Print Door Plate</span>
              </button>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl shadow-xl border border-slate-800 space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-[#8ab4f8] uppercase tracking-wider block">Official Open Location Number Address</span>
                  <h3 className="text-lg font-bold mt-1 text-white">{premiseName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{streetAddress}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center font-bold text-xs font-mono">
                  OLN
                </div>
              </div>

              <div className="py-3 px-4 bg-slate-800/80 rounded-xl border border-slate-700 font-mono text-2xl font-bold text-[#8ab4f8] tracking-widest text-center">
                {codeData?.code || '716 5219 2837 466-5'}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
                <span>Damm Checksum Validated</span>
                <span>WGS84 Datum</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleCopySms} className="w-full py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all">
                {copiedSms ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSms ? 'Copied SMS Text!' : 'Copy SMS Address Card'}</span>
              </button>

              {!isPlayingAudio ? (
                <button onClick={handlePlayAudio} className="w-full py-2.5 bg-[#e8f0fe] dark:bg-[#1e293b] text-[#1a73e8] dark:text-[#8ab4f8] font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all">
                  <Volume2 className="w-4 h-4" />
                  <span>Test Voice Audio</span>
                </button>
              ) : (
                <button onClick={handleStopAudio} className="w-full py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all animate-pulse">
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Audio</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
