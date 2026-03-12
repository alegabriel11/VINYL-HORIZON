import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from 'react-router-dom';

export default function ChatWidget() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  // Check if user is logged in via localStorage
  const [user, setUser] = useState(null);
  useEffect(() => {
    try {
      const u = localStorage.getItem('vinyl_user');
      setUser(u ? JSON.parse(u) : null);
    } catch (e) {
      setUser(null);
    }
  }, [pathname]);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Bienvenido a Vinyl Horizon. Soy el curador residente, ¿en qué te puedo ayudar hoy?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { isDark } = useTheme();
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);

  // Auto-scroll al último mensaje
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
        body: JSON.stringify({ message: userMessage.text, isAdmin: false })
      });
      const data = await response.json();

      if (data.errorType === 'quota') {
        setMessages((prev) => [...prev, { role: 'assistant', text: '🎵 Los créditos de IA de hoy se han agotado. El Curador estará de vuelta mañana — ¡vuelve pronto!' }]);
      } else if (data.errorType === 'auth') {
        setMessages((prev) => [...prev, { role: 'assistant', text: '☕️ Parece que hay un problema con mi identificación (API Key). Por favor, contacta al administrador del sistema.' }]);
      } else if (data.errorType === 'model') {
        setMessages((prev) => [...prev, { role: 'assistant', text: '💎 El modelo solicitado no está disponible para esta llave. Es posible que necesite una actualización en la consola de Google.' }]);
      } else if (!response.ok) {
        throw new Error(data.error || 'Unknown error');
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.text }]);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Lo siento, he perdido la conexión por un momento. ¿Podrías repetir?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAdminRoute || !user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-['Montserrat']">
      {/* Botón Flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#5E1914] rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none"
        aria-label="Open AI Concierge"
      >
        {isOpen ? (
          <span className="material-symbols-outlined text-[#F3F0EC]">close</span>
        ) : (
          <span className="material-symbols-outlined text-[#F3F0EC]">graphic_eq</span>
        )}
      </button>

      {/* Panel del Chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden border border-black/10 dark:border-[#E1C2B3]/20 bg-[#F3F0EC] dark:bg-[#091C2A] flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-[#0B1B2A] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5E1914] flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[#E1C2B3]">album</span>
            </div>
            <div>
              <h3 className="font-['Cormorant_Garamond'] text-[#E1C2B3] font-bold text-lg leading-tight">Vinyl Concierge</h3>
              <p className="text-[10px] text-[#E1C2B3]/70 uppercase tracking-widest">Always Listening</p>
            </div>
          </div>

          {/* Area de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/5 dark:bg-black/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-[#5E1914] text-[#F3F0EC] rounded-br-sm'
                    : 'bg-[#D9D9D9] dark:bg-[#3A2E29] text-[#0B1B2A] dark:text-[#E1C2B3] rounded-bl-sm border border-black/5 dark:border-white/5 shadow-sm'
                    }`}
                >
                  {/* Si necesitamos renderizar un poco de Markdown o líneas lo hacemos sencillo */}
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#D9D9D9] dark:bg-[#3A2E29] p-3 rounded-2xl rounded-bl-sm border border-black/5 dark:border-white/5 flex gap-1 items-center">
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
                placeholder="Pregunta sobre algún vinilo..."
                className="flex-1 bg-black/5 dark:bg-black/20 text-[#0B1B2A] dark:text-[#E1C2B3] text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#5E1914] dark:focus:ring-[#E1C2B3]/50 transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-[#0B1B2A] dark:bg-[#3A2E29] flex items-center justify-center text-[#E1C2B3] disabled:opacity-50 transition-all hover:bg-[#5E1914]"
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
