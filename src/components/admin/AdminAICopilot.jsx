import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

export default function AdminAICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Panel de Copiloto IA iniciado. ¿En qué te puedo asistir, Administrador?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { role: 'user', text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, isAdmin: true })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', text: data.text }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Error de conexión con el Copiloto.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-['Montserrat']">
      {/* Botón Flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#0B1B2A] dark:bg-[#E1C2B3] rounded-xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none"
        aria-label="Open Admin Copilot"
      >
        {isOpen ? (
          <span className="material-symbols-outlined text-[#F3F0EC] dark:text-[#0B1B2A]">close</span>
        ) : (
          <span className="material-symbols-outlined text-[#F3F0EC] dark:text-[#0B1B2A]">smart_toy</span>
        )}
      </button>

      {/* Panel del Chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden border border-black/10 dark:border-[#E1C2B3]/20 bg-[#F3F0EC] dark:bg-[#091C2A] flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-[#122838] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B2A] flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[#E1C2B3]">psychology</span>
            </div>
            <div>
              <h3 className="font-['Montserrat'] text-[#E1C2B3] font-bold text-lg leading-tight uppercase tracking-widest text-sm">AI Copilot</h3>
              <p className="text-[10px] text-[#E1C2B3]/70 uppercase tracking-widest">Admin Assistance</p>
            </div>
          </div>

          {/* Area de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#EFEFEF] dark:bg-black/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#0B1B2A] dark:bg-[#E1C2B3] text-[#F3F0EC] dark:text-[#0B1B2A]' 
                      : 'bg-white dark:bg-[#3A2E29] text-[#0B1B2A] dark:text-[#E1C2B3] border border-black/5 dark:border-white/5 shadow-sm'
                  }`}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br/>
                    </span>
                  ))}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#3A2E29] p-3 rounded-xl border border-black/5 dark:border-white/5 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-[#0B1B2A]/50 dark:bg-[#E1C2B3]/50 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#0B1B2A]/50 dark:bg-[#E1C2B3]/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-[#0B1B2A]/50 dark:bg-[#E1C2B3]/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-[#1A2A38] border-t border-black/10 dark:border-white/10">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Solicita ayuda de gestión..."
                className="flex-1 bg-black/5 dark:bg-black/20 text-[#0B1B2A] dark:text-[#E1C2B3] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#0B1B2A] dark:focus:ring-[#E1C2B3]/50 transition-all"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-[#0B1B2A] dark:bg-[#E1C2B3] flex items-center justify-center text-[#F3F0EC] dark:text-[#0B1B2A] disabled:opacity-50 transition-all hover:scale-105"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
