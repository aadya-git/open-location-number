/**
 * Open Location Number Platform — Plus Codes Styled Contact Page.
 */

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', organization: '', topic: 'Institutional Deployment', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 font-sans">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-wider bg-[#e8f0fe] dark:bg-[#172b4d] text-[#1a73e8] dark:text-[#8ab4f8] border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#202124] dark:text-white mt-3 tracking-tight">
          Contact Platform Team
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          Inquire about institutional deployment, postal partnerships, or mapping integrations.
        </p>
      </div>

      <div className="max-w-xl mx-auto clean-panel p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-10 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#1a73e8] dark:text-[#8ab4f8] mx-auto animate-bounce" />
            <h3 className="text-xl font-bold font-display text-[#202124] dark:text-white">Message Sent Successfully!</h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs">Thank you for reaching out. A platform architect will respond shortly.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-3 px-5 py-2 rounded-xl bg-[#1a73e8] text-white font-bold text-xs shadow-sm"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white focus:outline-none focus:border-[#1a73e8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 mb-1">Organization</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Inquiry Topic</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white focus:outline-none focus:border-[#1a73e8]"
                >
                  <option>Institutional Deployment</option>
                  <option>Postal & Logistics Integration</option>
                  <option>Standard Specification Feedback</option>
                  <option>Media & Research</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Message</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#171717] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-[#202124] dark:text-white focus:outline-none focus:border-[#1a73e8]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
