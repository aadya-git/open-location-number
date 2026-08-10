/**
 * Open Location Number Platform — Ambient Animated Background.
 * 
 * Purpose:
 *   Renders subtle, elegant Google Blue ambient lighting and grid pattern so pages feel alive.
 */

import React from 'react';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Subtle Animated Google Blue Glow Orbs */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-[#1a73e8]/5 dark:bg-[#1a73e8]/10 rounded-full blur-[140px] animate-pulse-slow" />
      <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] animate-float" />
      <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-[160px] animate-pulse-slow" />

      {/* 2. Delicate Grid Mesh Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(#1a73e8 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
}
