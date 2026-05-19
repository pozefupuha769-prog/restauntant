import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { ChatMessage } from '../types';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: '¡Hola! Soy el asistente virtual del Bistro. Estoy capacitado para responder dudas sobre nuestro menú andino, reservas online, despacho de domicilios y horarios en Bogotá. ¿En qué puedo colaborarte hoy?',
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll utility
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = 'msg-' + Math.random().toString(36).substring(2, 9);
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Gather conversation history in type-safe format
      const history = [...messages, userMsg].map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });

      if (!res.ok) {
        throw new Error('Network error calling chatbot API');
      }

      const data = await res.json();
      const botMsgId = 'msg-' + Math.random().toString(36).substring(2, 9);
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'bot',
        text: data.text || 'Lamento no poder responder en este momento. Escríbenos directamente a nuestro WhatsApp oficial.',
        timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {
      console.error(err);
      // Fallback response inside the chat feed
      const errorBotMsg: ChatMessage = {
        id: 'error-msg',
        sender: 'bot',
        text: '¡Hola! Estoy experimentando una breve saturación técnica, pero te respondo con gusto: El Bistro está ubicado en la Calle 11 # 2-15 (La Candelaria, Bogotá). Atendemos de Lunes a Sábado de 12:00 PM a 10:00 PM. Puedes escribir también por WhatsApp al +57 321 987 6543 para un contacto humano e instantáneo.',
        timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const suggestions = [
    '¿Cuál es el menú?',
    '¿Cómo reservo mesa?',
    '¿Tienen vegetarianos?',
    'Ubicación y horarios'
  ];

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start" id="floating-chatbot-container">
      {/* 1. Chat window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-editorial-bg border border-editorial-border rounded-sm shadow-2xl flex flex-col mb-4 overflow-hidden animate-fade-in-up" id="chatbot-window">
          {/* Chat Window Titlebar */}
          <div className="bg-editorial-slate/50 p-4 border-b border-editorial-border flex items-center justify-between" id="cb-header">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-editorial-gold/10 text-editorial-gold rounded-sm border border-editorial-gold/20">
                <Bot size={16} />
              </div>
              <div className="text-left">
                <h4 className="font-serif italic text-xs text-editorial-cream">Concierge Virtual</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-editorial-cream/40">Asistente Activo</span>
                </div>
              </div>
            </div>
            <button
              id="close-chatbot-btn"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-sm text-editorial-cream/50 hover:text-editorial-cream hover:bg-editorial-slate/50 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Window Core Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-editorial-border" id="cb-messages-feed text-left">
            {messages.map((m) => (
              <div
                key={m.id}
                id={`cb-msg-${m.id}`}
                className={`flex flex-col max-w-[85%] ${m.sender === 'user' ? 'ml-auto items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-sm text-[11px] leading-relaxed text-left ${
                    m.sender === 'user'
                      ? 'bg-editorial-gold text-editorial-bg font-semibold'
                      : 'bg-editorial-slate/30 text-editorial-cream border border-editorial-border'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[8px] font-mono text-editorial-cream/30 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {/* Loading / Writing bubble */}
            {isLoading && (
              <div className="flex flex-col items-start max-w-[85%]" id="cb-loader-bubble">
                <div className="bg-editorial-slate/30 border border-editorial-border p-3 rounded-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-editorial-gold rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-editorial-gold rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-editorial-gold rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion buttons */}
          <div className="p-2 border-t border-editorial-border bg-editorial-slate/10 flex flex-wrap gap-1.5" id="cb-suggestions-dock">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                id={`sug-btn-${idx}`}
                onClick={() => handleSuggestionClick(sug)}
                className="px-2.5 py-1 text-[9px] font-sans uppercase tracking-wider font-semibold text-editorial-cream/70 bg-editorial-slate/40 hover:bg-editorial-gold hover:text-editorial-bg border border-editorial-border rounded-sm transition-all cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Chat Window Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 border-t border-editorial-border bg-editorial-slate/40 flex items-center gap-2"
            id="cb-input-form"
          >
            <input
              type="text"
              id="cb-text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu consulta o haz clic en un botón sugerido..."
              className="flex-1 px-3 py-2 bg-editorial-slate border border-editorial-border rounded-sm text-xs font-sans text-editorial-cream focus:outline-none focus:border-editorial-gold"
            />
            <button
              type="submit"
              id="cb-send-btn"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 bg-editorial-gold text-editorial-bg hover:bg-editorial-gold-dark disabled:bg-editorial-slate disabled:text-editorial-cream/30 rounded-sm transition-colors cursor-pointer"
              title="Transmitir mensaje"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      )}

      {/* 2. Floating activator Button */}
      {!isOpen && (
        <button
          id="cb-toggle-activator"
          onClick={() => setIsOpen(true)}
          className="bg-editorial-gold text-editorial-bg p-4 rounded-sm border border-editorial-border shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
          title="Abrir chat virtual"
        >
          <Bot size={20} />
        </button>
      )}
    </div>
  );
}
