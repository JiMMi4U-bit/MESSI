
import React, { useState, useRef, useEffect } from 'react';
import { Appointment, User, Message, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ChatWindowProps {
  appointment: Appointment;
  currentUser: User;
  onSendMessage: (apptId: string, text: string) => void;
  onClose: () => void;
  language: Language;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ appointment, currentUser, onSendMessage, onClose, language }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [appointment.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(appointment.id, inputText.trim());
    setInputText('');
  };

  const partnerName = currentUser.id === appointment.patientId ? appointment.doctorName : appointment.patientName;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {partnerName.charAt(0)}
            </div>
            <div>
              <div className="font-bold truncate max-w-[180px]">{partnerName}</div>
              <div className="flex items-center gap-1.5 text-[10px] text-blue-100 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                {t.secureConsultation}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {(!appointment.messages || appointment.messages.length === 0) && (
            <div className="text-center py-20 px-6">
              <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
              </div>
              <p className="text-slate-500 font-bold">{t.noMessages}</p>
            </div>
          )}
          {appointment.messages?.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative ${
                  isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                  <div className={`text-[9px] mt-1 text-right opacity-70`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              autoFocus
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.typeMessage}
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 transition-all shadow-lg shadow-blue-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
