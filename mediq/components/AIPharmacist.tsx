
import React, { useState } from 'react';
import { MedicineInfo, Language } from '../types';
import { getMedicineDetails } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';

interface AIPharmacistProps {
  language?: Language;
}

const AIPharmacist: React.FC<AIPharmacistProps> = ({ language = Language.EN }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MedicineInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const details = await getMedicineDetails(query, language);
      setResult(details);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve information. Please check the spelling.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 mb-2">{t.pharmacist}</h2>
        <p className="text-slate-500 font-medium">Instant medical insights powered by Gemini AI</p>
      </div>

      <form onSubmit={handleSearch} className="mb-10">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="..."
            className="w-full pl-14 pr-40 py-5 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-xl font-bold text-slate-900 placeholder:text-slate-300"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg"
          >
            {loading ? '...' : t.analyze}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-5 rounded-2xl border border-red-100 mb-10 font-bold flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {loading && !result && (
        <div className="space-y-6 animate-pulse">
          <div className="h-14 bg-slate-200 rounded-2xl w-1/3"></div>
          <div className="h-48 bg-slate-200 rounded-3xl"></div>
          <div className="grid grid-cols-2 gap-6">
             <div className="h-40 bg-slate-200 rounded-3xl"></div>
             <div className="h-40 bg-slate-200 rounded-3xl"></div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 block w-fit">{t.report}</span>
                <h3 className="text-5xl font-black tracking-tight">{result.name}</h3>
              </div>
              <div className="bg-white/10 p-5 rounded-[1.5rem] backdrop-blur-xl border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
              </div>
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-50/50">
            <div className="space-y-8">
              <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="flex items-center gap-3 text-slate-900 font-black text-xl mb-4">
                  <span className="w-10 h-10 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-lg">1</span>
                  {t.uses}
                </h4>
                <ul className="space-y-3">
                  {result.uses.map((use, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></div>
                      {use}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="flex items-center gap-3 text-slate-900 font-black text-xl mb-4">
                  <span className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-lg">2</span>
                  {t.sideEffects}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.sideEffects.map((effect, i) => (
                    <span key={i} className="px-4 py-2 bg-red-50 text-red-700 text-sm font-bold rounded-2xl border border-red-100">
                      {effect}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="flex items-center gap-3 text-slate-900 font-black text-xl mb-4">
                  <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg">3</span>
                  {t.precautions}
                </h4>
                <p className="text-slate-700 font-medium bg-amber-50/50 p-5 rounded-2xl border border-amber-100 leading-relaxed italic">
                  "{result.precautions}"
                </p>
              </section>

              <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="flex items-center gap-3 text-slate-900 font-black text-xl mb-4">
                  <span className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg">4</span>
                  {t.alternatives}
                </h4>
                <ul className="space-y-3">
                  {result.alternatives.map((alt, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M20 6L9 17l-5-5"/></svg>
                      {alt}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
          
          <div className="px-10 py-6 bg-slate-900 text-[11px] text-slate-400 text-center font-medium">
            Disclaimer: This AI report is for informational purposes only and not a substitute for professional medical advice.
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPharmacist;
