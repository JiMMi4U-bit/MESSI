
import React from 'react';
import { User, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentLang, onLangChange }) => {
  const t = TRANSLATIONS[currentLang];
  
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="m3.34 19 8.59-8.59a2 2 0 0 1 2.82 0l8.59 8.59"/><path d="m3.34 5 8.59 8.59a2 2 0 0 0 2.82 0l8.59-8.59"/></svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">MediQ</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span className="text-sm font-medium hidden md:inline">{currentLang}</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="py-1">
                  {Object.values(Language).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => onLangChange(lang)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${currentLang === lang ? 'text-blue-600 font-bold' : 'text-slate-700'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-900">{user.name}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">{user.role}</span>
            </div>
            <button 
              onClick={onLogout}
              className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
