import React, { useState } from 'react';
import { CalendarRange, Users, Sparkles, Clock, Check, AlertCircle, Trash2, Shield } from 'lucide-react';
import { Reservation, RestaurantConfig } from '../types';

interface ReservationsProps {
  reservations: Reservation[];
  onAddReservation: (resSec: Reservation) => void;
  onCancelReservation: (resId: string) => void;
  config: RestaurantConfig;
}

const RESERVATION_TIMES = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
];

export default function Reservations({
  reservations,
  onAddReservation,
  onCancelReservation,
  config
}: ReservationsProps) {
  const [resDate, setResDate] = useState('');
  const [resTime, setResTime] = useState('13:00');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Colombia timezone safe date boundary (Prevent users from booking in the past)
  const todayString = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!resDate || !name || !email || !phone) {
      setErrorMsg('Por favor rellena todos los campos del formulario de reserva.');
      return;
    }

    // Compose Reservation
    const newRes: Reservation = {
      id: 'res-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      date: resDate,
      time: resTime,
      name,
      email,
      phone,
      guests,
      specialRequests,
      status: 'pendiente',
      createdAt: new Date().toISOString()
    };

    onAddReservation(newRes);
    setSuccess(true);
  };

  const handleResetForm = () => {
    setSuccess(false);
    setName('');
    setEmail('');
    setPhone('');
    setSpecialRequests('');
    setGuests(2);
    setResDate('');
  };

  // Safe WhatsApp link builder
  const formattedWhatsappNumber = config.whatsapp.replace(/\+/g, '').replace(/\s/g, '');
  const whatsappUrl = `https://wa.me/${formattedWhatsappNumber}?text=Hola%20${encodeURIComponent(config.name)},%20acabo%20de%20realizar%20mi%20reserva%20online%20bajo%20el%20dise%C3%B1o%20Editorial.%20Me%20encantar%C3%ADa%20confirmar%20mi%20asistencia.`;

  return (
    <section className="bg-editorial-bg border-t border-editorial-border text-editorial-cream py-16 px-6" id="reservations-section">
      <div className="max-w-4xl mx-auto">
        
        {/* Reservation Header */}
        <div className="text-center mb-12" id="reservations-header">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block mb-2">Reserva de Mesas Sin Costo</span>
          <h2 className="font-serif italic text-4xl sm:text-5xl text-editorial-cream tracking-tight">
            Reservar una Mesa en Línea
          </h2>
          <p className="font-serif italic text-editorial-cream/60 mt-3 text-sm max-w-lg mx-auto">
            Disfruta de la mejor experiencia culinaria de Bogotá de forma transparente y sin cobros fraudulentos ni intermediarios.
          </p>
        </div>

        {/* Informative transparency panel */}
        <div className="bg-editorial-slate/50 border border-editorial-border p-5 rounded-sm mb-12 flex flex-col sm:flex-row items-start gap-4 text-left" id="transparency-banner">
          <div className="p-3 bg-editorial-dark border border-editorial-border/30 text-editorial-gold rounded-sm shrink-0">
            <Shield size={18} />
          </div>
          <div>
            <h4 className="font-sans font-bold text-xs text-editorial-gold uppercase tracking-widest">Garantía de Sencillez & Habeas Data</h4>
            <p className="font-sans text-xs text-editorial-cream/70 mt-1 pb-1 leading-relaxed">
              Las reservas en <strong className="text-editorial-cream">{config.name}</strong> son <span className="text-emerald-400 font-bold uppercase tracking-wide text-[11px]">100% gratuitas</span>. No se requieren depósitos anticipados para asegurar su mesa estándar. Cumplimos rigurosamente con la Ley de Protección de Datos de Colombia, garantizando la seguridad absoluta de sus datos personales.
            </p>
          </div>
        </div>

        <div className="bg-editorial-slate/30 rounded-sm border border-editorial-border shadow-xl overflow-hidden" id="reservations-container">
          {success ? (
            /* Success screen */
            <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px] animate-fade-in" id="res-success-card">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full mb-4">
                <Check size={30} />
              </div>
              <h3 className="font-serif italic text-2xl text-editorial-cream">Solicitud de Mesa Registrada</h3>
              <p className="font-sans text-xs text-editorial-cream/60 mt-2 max-w-md">
                Hemos recibido tu solicitud para <strong className="text-editorial-cream font-bold">{guests} personas</strong> el día <strong className="text-editorial-cream font-bold">{resDate}</strong> a las <strong className="text-editorial-gold">{resTime}</strong>. 
              </p>
              
              <div className="bg-editorial-slate/85 border border-editorial-border p-5 rounded-sm mt-8 text-left max-w-sm w-full">
                <h4 className="font-serif text-sm text-editorial-cream">Sincroniza con WhatsApp de una vez</h4>
                <p className="font-sans text-xs text-editorial-cream/60 mt-2 leading-relaxed">
                  Para agilizar tu aprobación y coordinar preferencias de mesa directamente, puedes enviar tu soporte de reserva al administrador del restaurante.
                </p>
                <a 
                  id="wa-sync-reservation-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-editorial-cream text-xs font-sans font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2"
                >
                  Confirmar en WhatsApp
                </a>
              </div>

              <button
                id="make-another-res-btn"
                onClick={handleResetForm}
                className="mt-6 text-[10px] uppercase tracking-widest font-bold text-editorial-gold hover:text-editorial-cream cursor-pointer transition-colors"
              >
                Hacer otra reserva gratis
              </button>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6 text-left" id="reservation-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 1. Date */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-2 flex items-center gap-1.5">
                    <CalendarRange size={13} className="text-editorial-gold" />
                    <span>Fecha de visita *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={todayString}
                    value={resDate}
                    onChange={(e) => setResDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                  />
                </div>

                {/* 2. Hour */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-2 flex items-center gap-1.5">
                    <Clock size={13} className="text-editorial-gold" />
                    <span>Hora seleccionada *</span>
                  </label>
                  <select
                    id="reservation-time-select"
                    value={resTime}
                    onChange={(e) => setResTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                  >
                    {RESERVATION_TIMES.map((time, idx) => (
                      <option key={idx} value={time} className="bg-editorial-dark text-editorial-cream">{time} {parseInt(time.split(':')[0]) < 12 ? 'AM' : 'PM'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 3. Number of guests */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-2 flex items-center gap-1.5">
                    <Users size={13} className="text-editorial-gold" />
                    <span>Número de comensales *</span>
                  </label>
                  <input
                    type="number"
                    id="guests-input"
                    required
                    min="1"
                    max="20"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                  />
                </div>

                {/* 4. Complete Name */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-2">Nombre Completo *</label>
                  <input
                    type="text"
                    id="reservant-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Viviana Gómez"
                    className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 5. Contact Phone */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-2">Celular de Contacto *</label>
                  <input
                    type="tel"
                    id="reservant-phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 321 987 6543"
                    className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                  />
                </div>

                {/* 6. Email */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-2">Email de confirmación *</label>
                  <input
                    type="email"
                    id="reservant-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                  />
                </div>
              </div>

              {/* 7. Special instructions */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-2 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-editorial-gold" />
                  <span>Celebraciones o requerimientos (Opcional)</span>
                </label>
                <textarea
                  id="special-requests-area"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Ej. Celebración de Aniversario (solicito cortesía), mesa interior, silla para niños..."
                  className="w-full px-4 py-3 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold h-20 resize-none"
                ></textarea>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-sm text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Booking CTA Button */}
              <button
                type="submit"
                id="submit-reservation-btn"
                className="w-full py-4 bg-editorial-gold hover:bg-editorial-gold-dark text-editorial-bg font-sans font-bold rounded-sm text-xs tracking-widest uppercase transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Confirmar Reserva Online Gratuita
              </button>
            </form>
          )}
        </div>

        {/* Display Current User Reservations */}
        {reservations.length > 0 && (
          <div className="mt-16 text-left" id="my-active-reservations-block">
            <h3 className="font-serif italic text-2xl text-editorial-cream mb-6 flex items-center gap-2 border-b border-editorial-border pb-3">
              <CalendarRange size={18} className="text-editorial-gold" />
              <span>Mis Reservas Activas ({reservations.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="reservations-history-grid">
              {reservations.map((res) => (
                <div 
                  key={res.id} 
                  id={`reservation-card-${res.id}`}
                  className="bg-editorial-slate/30 p-5 rounded-sm border border-editorial-border flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-mono text-editorial-cream/40 uppercase tracking-widest">Reserva #{res.id}</span>
                      <span className={`text-[9px] uppercase tracking-wider font-sans font-extrabold px-2.5 py-1 rounded-sm border ${
                        res.status === 'pendiente' ? 'bg-editorial-gold/10 border-editorial-gold/30 text-editorial-gold' :
                        res.status === 'confirmada' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                        'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                        {res.status}
                      </span>
                    </div>

                    <h4 className="font-serif italic text-lg text-editorial-cream">{res.name}</h4>
                    <p className="font-serif italic text-xs text-editorial-cream/70 mt-1">
                      📅 {res.date} a las {res.time}
                    </p>
                    <p className="font-sans text-xs text-editorial-cream/50">
                      👥 Grupos de {res.guests} personas
                    </p>
                    {res.specialRequests && (
                      <p className="font-sans text-[11px] text-editorial-cream/60 italic mt-3 leading-relaxed bg-editorial-slate p-3 rounded-sm border border-editorial-border-light">
                        &quot;{res.specialRequests}&quot;
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-editorial-border-light flex items-center justify-between gap-2">
                    <span className="text-[10px] text-editorial-cream/40 font-mono">Hecha: {new Date(res.createdAt).toLocaleDateString('es-CO')}</span>
                    <button
                      id={`cancel-res-btn-${res.id}`}
                      onClick={() => onCancelReservation(res.id)}
                      className="text-editorial-cream/40 hover:text-red-400 flex items-center gap-1.5 text-xs font-sans transition-colors cursor-pointer"
                      title="Cancelar reserva"
                    >
                      <Trash2 size={12} />
                      <span className="text-[10px] uppercase tracking-wider font-semibold">Cancelar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
