
import React, { useState } from 'react';
import { User, UserRole, Language } from '../types';
import { DOCTORS, TRANSLATIONS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, currentLang, onLangChange }) => {
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(DOCTORS[0].id);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[currentLang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (role === UserRole.PATIENT) {
      if (!name.trim()) return;
      // Use a deterministic ID for patients based on their name for demo persistence
      const patientId = 'p-' + name.trim().toLowerCase().replace(/\s+/g, '-');
      onLogin({
        id: patientId,
        name: name.trim(),
        role
      });
    } else {
      if (password !== '0000') {
        setError('Invalid access code. Please use the default staff password (0000).');
        return;
      }
      const doc = DOCTORS.find(d => d.id === selectedDoctorId);
      if (doc) {
        onLogin(doc);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      {/* Absolute Language Selector for Login */}
      <div className="absolute top-8 right-8 flex gap-2">
        {Object.values(Language).map((lang) => (
          <button
            key={lang}
            onClick={() => onLangChange(lang)}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${currentLang === lang ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.51 4.05 3 5.5l7 7Z"/></svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">{t.loginTitle}</h2>
          <p className="text-center text-slate-500 mb-8 font-medium">{t.loginSub}</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => { setRole(UserRole.PATIENT); setError(null); }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
                  role === UserRole.PATIENT 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.patient}
              </button>
              <button
                type="button"
                onClick={() => { setRole(UserRole.DOCTOR); setError(null); }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
                  role === UserRole.DOCTOR 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.doctor}
              </button>
            </div>

            <div className="space-y-5 animate-in fade-in duration-300">
              {role === UserRole.PATIENT ? (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.fullName}</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t.staffProfile}</label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    >
                      {DOCTORS.map(doc => (
                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t.passcode}</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="****"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </div>
                    </div>
                    {error && <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>}
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] mt-4"
            >
              {role === UserRole.PATIENT ? t.enterPortal : t.authenticate}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
