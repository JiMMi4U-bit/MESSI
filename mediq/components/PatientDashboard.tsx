
import React, { useState } from 'react';
import { User, Appointment, PatientStatus, Language } from '../types';
import { DOCTORS, STATUS_COLORS, TRANSLATIONS } from '../constants';
import AIPharmacist from './AIPharmacist';
import ChatWindow from './ChatWindow';

interface PatientDashboardProps {
  user: User;
  appointments: Appointment[];
  onAddAppointment: (appt: Appointment) => void;
  onSendMessage: (apptId: string, text: string) => void;
  language: Language;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, appointments, onAddAppointment, onSendMessage, language }) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'ai'>('appointments');
  const [showModal, setShowModal] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
  const [doctorId, setDoctorId] = useState(DOCTORS[0].id);
  const [symptoms, setSymptoms] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const t = TRANSLATIONS[language];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const doctor = DOCTORS.find(d => d.id === doctorId);
    
    const newAppt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: user.id,
      patientName: user.name,
      doctorId: doctorId,
      doctorName: doctor?.name || 'Unknown',
      date,
      time,
      symptoms,
      status: PatientStatus.GOOD,
      createdAt: Date.now(),
      messages: []
    };

    onAddAppointment(newAppt);
    setShowModal(false);
    setSymptoms('');
    setDate('');
    setTime('');
  };

  const activeChatAppt = appointments.find(a => a.id === activeChatId);
  const lastAppt = appointments.length > 0 ? appointments[0] : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Tab Switcher */}
      <div className="flex space-x-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'appointments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {t.myAppts}
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'ai' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {t.pharmacist}
        </button>
      </div>

      {activeTab === 'appointments' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-slate-900">{t.myAppts}</h2>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                {t.bookAppt}
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <h3 className="text-slate-900 font-bold mb-2">{t.noAppts}</h3>
              </div>
            ) : (
              appointments.map((appt) => (
                <div key={appt.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 text-lg">{appt.doctorName}</h3>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${STATUS_COLORS[appt.status]}`}>
                        {appt.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 flex items-center gap-2 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {appt.date} <span className="text-slate-300">|</span> {appt.time}
                    </p>
                    <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl italic font-medium">
                      "{appt.symptoms}"
                    </div>
                  </div>
                  <div className="flex gap-4 items-center w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => setActiveChatId(appt.id)}
                      className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all relative group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                      {appt.messages && appt.messages.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-3xl shadow-xl shadow-blue-100 border border-blue-500">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                {t.healthTip}
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed font-medium">
                Remember to stay hydrated and keep your medical records updated for better diagnostic accuracy.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2 uppercase tracking-wider text-xs text-slate-400">
                {t.quickStats}
              </h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm font-medium">{t.lastCheckup}</span>
                  <span className="text-slate-900 font-bold text-sm">
                    {lastAppt ? lastAppt.date : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm font-medium">{t.activePrescriptions}</span>
                  <span className="text-slate-900 font-bold text-sm">0 Items</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AIPharmacist language={language} />
      )}

      {activeChatAppt && (
        <ChatWindow 
          appointment={activeChatAppt} 
          currentUser={user} 
          onSendMessage={onSendMessage} 
          onClose={() => setActiveChatId(null)} 
          language={language}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">{t.bookAppt}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleBooking} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.doctor}</label>
                <select 
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                >
                  {DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.date}</label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.time}</label>
                  <input 
                    type="time" 
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none font-bold" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.symptoms}</label>
                <textarea 
                  required
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none h-32 font-medium"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] mt-2"
              >
                {t.bookAppt}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
