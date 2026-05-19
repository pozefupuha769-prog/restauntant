import React from 'react';
import { Calendar, PhoneCall, Gift, Clock, MapPin, Sparkles } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface HeroProps {
  config: RestaurantConfig;
  onNavigate: (tab: string) => void;
}

export default function Hero({ config, onNavigate }: HeroProps) {
  // Safe WhatsApp link builder
  const formattedWhatsappNumber = config.whatsapp.replace(/\+/g, '').replace(/\s/g, '');
  const whatsappUrl = `https://wa.me/${formattedWhatsappNumber}?text=Hola%20Monserrate%20Bistro,%20quisiera%20pedir%2520m%C3%A1s%20informaci%C3%B3n%20sobre%20su%20men%C3%BA%20con%20estilo%20Editorial.`;

  return (
    <div className="relative overflow-hidden bg-editorial-bg text-editorial-cream border-b border-editorial-border" id="hero-section">
      {/* Editorial Layout: Side and center accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full border-l border-editorial-border-light bg-editorial-gold/5 pointer-events-none hide-mobile"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28 relative z-10">
        
        {/* Subtle Category Badge */}
        <div className="inline-flex items-center gap-2 border border-editorial-gold/30 bg-editorial-dark/60 text-editorial-gold px-4 py-1.5 rounded-sm text-[10px] uppercase tracking-[0.2em] mb-8 font-semibold" id="hero-badge">
          <Sparkles size={11} className="animate-pulse" />
          <span>Fusión Andina Contemporánea • Bogotá</span>
        </div>

        {/* Master Typographic Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16" id="hero-typography-layout">
          <div className="lg:col-span-8 text-left">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif tracking-tighter leading-[0.9] text-editorial-cream font-light" id="hero-title">
              Sabores de la <br />
              <span className="italic text-editorial-gold font-normal">{config.name}</span>
            </h1>
            <p className="font-serif italic text-lg sm:text-2xl text-editorial-cream/70 mt-6 max-w-3xl leading-relaxed" id="hero-slogan">
              &ldquo;{config.slogan}&rdquo;
            </p>
          </div>

          <div className="lg:col-span-4 lg:text-right border-l-2 lg:border-l-0 lg:border-r-2 border-editorial-gold/30 pl-4 lg:pl-0 lg:pr-6 py-1" id="hero-mini-showcase">
            <p className="text-[10px] uppercase tracking-[0.3em] text-editorial-gold/80 font-bold">Platillo del Mes</p>
            <p className="text-xl font-serif italic text-editorial-cream mt-1">Ajiaco de la Casa</p>
            <p className="text-xs font-sans text-editorial-cream/50 mt-1">Tradición andina redefinida con ingredientes locales de la sabana.</p>
          </div>
        </div>

        {/* Call To Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-lg mb-16" id="hero-cta-buttons">
          <button
            id="hero-reserve-btn"
            onClick={() => onNavigate('reservas')}
            className="flex-1 px-8 py-4 bg-editorial-gold hover:bg-editorial-gold-dark text-editorial-bg font-sans font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 rounded-sm"
          >
            <Calendar size={14} />
            <span>Reservar Mesa Online</span>
          </button>

          <a
            id="hero-whatsapp-link"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-8 py-4 bg-editorial-slate hover:bg-editorial-card border border-editorial-border text-editorial-cream hover:text-editorial-gold font-sans font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 rounded-sm"
          >
            <PhoneCall size={14} />
            <span>Pedidos WhatsApp</span>
          </a>
        </div>

        {/* Grid Sections of Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-editorial-border divide-y sm:divide-y-0 sm:divide-x divide-editorial-border bg-editorial-dark/40" id="hero-features-grid">
          
          <div className="p-6 text-left flex flex-col justify-between" id="feat-schedule">
            <div className="flex items-center gap-3 text-editorial-gold mb-3">
              <Clock size={16} />
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest">Atención Transparente</h3>
            </div>
            <p className="text-xs font-serif italic text-editorial-cream/75 leading-relaxed">
              Abierto todos los días. Lunes a Sábado hasta las 10:00 PM; Domingos y festivos de 12:00 PM a 6:00 PM.
            </p>
          </div>

          <div className="p-6 text-left flex flex-col justify-between" id="feat-location">
            <div className="flex items-center gap-3 text-editorial-gold mb-3">
              <MapPin size={16} />
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest">En el Corazón Colonial</h3>
            </div>
            <p className="text-xs font-serif italic text-editorial-cream/75 leading-relaxed">
              Ubicados en la mítica calle colonial de Bogotá, Calle 11 # 2-15 (La Candelaria), a pocos pasos de la plaza de Bolívar.
            </p>
          </div>

          <div className="p-6 text-left flex flex-col justify-between" id="feat-refund">
            <div className="flex items-center gap-3 text-editorial-gold mb-3">
              <Gift size={16} />
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest">Garantías Reales</h3>
            </div>
            <p className="text-xs font-serif italic text-editorial-cream/75 leading-relaxed">
              Sin cobros ocultos ni reservas costosas. Cumplimiento absoluto con el estatuto de protección al consumidor en todo despacho.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
