
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Appointment, PatientStatus, Message, Language } from './types';
import Login from './components/Login';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import Header from './components/Header';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem('mediq_lang') as Language) || Language.EN
  );

  const t = TRANSLATIONS[language];

  // Initial Load: appointments from localStorage (shared), user from sessionStorage (tab-specific)
  useEffect(() => {
    const savedUser = sessionStorage.getItem('mediq_user');
    const savedAppointments = localStorage.getItem('mediq_appointments');
    
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
  }, []);

  // Sync state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mediq_appointments' && e.newValue) {
        setAppointments(JSON.parse(e.newValue));
      }
      if (e.key === 'mediq_lang' && e.newValue) {
        setLanguage(e.newValue as Language);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update localStorage whenever appointments change locally
  useEffect(() => {
    localStorage.setItem('mediq_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('mediq_lang', lang);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('mediq_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('mediq_user');
  };

  const addAppointment = useCallback((newAppt: Appointment) => {
    setAppointments(prev => [newAppt, ...prev]);
  }, []);

  const updateAppointmentStatus = useCallback((apptId: string, status: PatientStatus) => {
    setAppointments(prev => prev.map(appt => 
      appt.id === apptId ? { ...appt, status } : appt
    ));
  }, []);

  const sendMessage = useCallback((apptId: string, text: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: Date.now()
    };

    setAppointments(prev => prev.map(appt => 
      appt.id === apptId ? { 
        ...appt, 
        messages: [...(appt.messages || []), newMessage] 
      } : appt
    ));
  }, [currentUser]);

  if (!currentUser) {
    return <Login onLogin={handleLogin} currentLang={language} onLangChange={handleLanguageChange} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        user={currentUser} 
        onLogout={handleLogout} 
        currentLang={language} 
        onLangChange={handleLanguageChange} 
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser.role === UserRole.PATIENT ? (
          <PatientDashboard 
            user={currentUser} 
            appointments={appointments.filter(a => a.patientId === currentUser.id)} 
            onAddAppointment={addAppointment}
            onSendMessage={sendMessage}
            language={language}
          />
        ) : (
          <DoctorDashboard 
            user={currentUser} 
            appointments={appointments.filter(a => a.doctorId === currentUser.id)}
            onUpdateStatus={updateAppointmentStatus}
            onSendMessage={sendMessage}
            language={language}
          />
        )}
      </main>
    </div>
  );
};

export default App;
