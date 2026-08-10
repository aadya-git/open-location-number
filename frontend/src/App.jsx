/**
 * Open Location Number Platform — Main App Container.
 * 
 * Purpose:
 *   Root application component managing ThemeContext, LanguageContext (Multilingual i18n),
 *   global ambient background, routing, Navbar, and Footer.
 * 
 * Section Breakdown:
 *   - ThemeProvider & LanguageProvider wrappers
 *   - AmbientBackground component
 *   - Streamlined React Router routes
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import AmbientBackground from './components/AmbientBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import WhyPage from './pages/WhyPage';
import TechPage from './pages/TechPage';
import DocsPage from './pages/DocsPage';
import AddressMakerPage from './pages/AddressMakerPage';
import SupportPage from './pages/SupportPage';
import ContactPage from './pages/ContactPage';
import TryPage from './pages/TryPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#f8f9fa] dark:bg-[#171717] text-[#202124] dark:text-[#e8eaed] font-sans antialiased selection:bg-[#1a73e8] selection:text-white transition-colors duration-200 relative">
            {/* Subtle Ambient Background Orbs & Grid Animation */}
            <AmbientBackground />

            {/* Sticky Navbar Header */}
            <Navbar />

            {/* Main Router Content */}
            <main className="flex-grow z-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/why" element={<WhyPage />} />
                <Route path="/technology" element={<TechPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/address-maker" element={<AddressMakerPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/try" element={<TryPage />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <Footer />
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}
