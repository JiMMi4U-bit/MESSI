
import React, { useState } from 'react';
import { User, Appointment, PatientStatus, Language } from '../types';
import { STATUS_COLORS, STATUS_DOT_COLORS, TRANSLATIONS } from '../constants';
import ChatWindow from './ChatWindow';

interface DoctorDashboardProps {
  user: User;
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: PatientStatus) => void;
  onSendMessage: (apptId: string, text: string) => void;
  language: Language;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user, appointments, onUpdateStatus, onSendMessage, language }) => {
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  const stats = {
    total: appointments.length,
    critical: appointments.filter(a => a.status === PatientStatus.CRITICAL).length,
    serious: appointments.filter(a => a.status === PatientStatus.SERIOUS).length,
  };

  const activeChatAppt = appointments.find(a => a.id === activeChatId);

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">{t.totalPatients}</p>
          <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
          <p className="text-amber-600 text-xs uppercase tracking-wider font-semibold mb-1">{t.seriousCases}</p>
          <p className="text-3xl font-bold text-amber-700">{stats.serious}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
          <p className="text-red-600 text-xs uppercase tracking-wider font-semibold mb-1">{t.criticalCases}</p>
          <p className="text-3xl font-bold text-red-700">{stats.critical}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{t.patientQueue}</h2>
        </div>
        
        {appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 italic">
            {t.noAppts}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.patient}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.schedule}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">{t.triageStatus}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {appt.patientName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{appt.patientName}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]">{appt.symptoms}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 font-medium">{appt.date}</div>
                      <div className="text-xs text-slate-500">{appt.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${STATUS_DOT_COLORS[appt.status]}`}></div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase ${STATUS_COLORS[appt.status]}`}>
                          {appt.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => setActiveChatId(appt.id)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors relative"
                          title={t.openChat}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                          {appt.messages && appt.messages.length > 0 && appt.messages[appt.messages.length - 1].senderId !== user.id && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                          )}
                        </button>
                        <button 
                          onClick={() => setSelectedAppt(appt)}
                          className="text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors"
                        >
                          {t.review}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeChatAppt && (
        <ChatWindow 
          appointment={activeChatAppt} 
          currentUser={user} 
          onSendMessage={onSendMessage} 
          onClose={() => setActiveChatId(null)}
          language={language}
        />
      )}

      {selectedAppt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center text-2xl font-bold">
                    {selectedAppt.patientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{selectedAppt.patientName}</h3>
                    <p className="text-slate-500 text-sm">ID: #{selectedAppt.id.toUpperCase()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAppt(null)} 
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t.patientSymptoms}</h4>
                  <div className="bg-slate-50 p-5 rounded-2xl text-slate-700 leading-relaxed border border-slate-100">
                    {selectedAppt.symptoms}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t.updateTriage}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.values(PatientStatus).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          onUpdateStatus(selectedAppt.id, status);
                          setSelectedAppt({ ...selectedAppt, status });
                        }}
                        className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border-2 ${
                          selectedAppt.status === status 
                          ? `${STATUS_COLORS[status]} border-current` 
                          : 'border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => {
                      setActiveChatId(selectedAppt.id);
                      setSelectedAppt(null);
                    }}
                    className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                  >
                    {t.openChat}
                  </button>
                  <button 
                    onClick={() => setSelectedAppt(null)}
                    className="px-6 py-3 text-slate-600 font-bold bg-slate-100 rounded-xl hover:bg-slate-200"
                  >
                    {t.close}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
