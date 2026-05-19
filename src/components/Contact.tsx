import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, AlertCircle, Check } from 'lucide-react';
import { RestaurantConfig } from '../types';
import Legal from './Legal';

interface ContactProps {
  config: RestaurantConfig;
}

export default function Contact({ config }: ContactProps) {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [subject, setSubject] = useState('Reserva / Grupo especial');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Colombian WhatsApp API link
  const formattedWhatsappNumber = config.whatsapp.replace(/\+/g, '').replace(/\s/g, '');
  const whatsappUrl = `https://wa.me/${formattedWhatsappNumber}?text=Hola%20${encodeURIComponent(config.name)},%20quisiera%20pedir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20eventos%20privados%20o%20servicios.`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    if (!senderName || !senderEmail || !message) {
      setErrorMsg('Por favor completa los campos obligatorios (*).');
      setSubmitting(false);
      return;
    }

    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setSenderName('');
      setSenderEmail('');
      setSenderPhone('');
      setMessage('');
    }, 1200);
  };

  return (
    <section className="bg-editorial-bg border-t border-editorial-border text-editorial-cream py-16 px-6" id="contact-legal-section">
      <div className="max-w-6xl mx-auto">
        
        {/* Contact/Legal Header */}
        <div className="text-center mb-12" id="contact-header">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block mb-2">Canales de Atención Oficiales</span>
          <h2 className="font-serif italic text-4xl sm:text-5xl text-editorial-cream tracking-tight">
            Ubicación, Canales & Políticas
          </h2>
          <p className="font-serif italic text-editorial-cream/60 mt-3 text-sm max-w-lg mx-auto">
            ¿Tienes dudas, deseas cotizar un evento privado o verificar nuestras licencias de publicidad? Estamos a tu disposición transparente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16" id="contact-grid">
          
          {/* Column 1: Contact details and Map */}
          <div className="space-y-8 text-left" id="contact-details-box">
            <div className="bg-editorial-slate/30 p-6 sm:p-8 rounded-sm border border-editorial-border space-y-5" id="essential-contacts">
              <h3 className="font-serif text-lg text-editorial-cream border-b border-editorial-border-light pb-2">Datos de Contacto</h3>
              
              <div className="flex items-start gap-4 text-xs" id="contact-addr">
                <MapPin className="text-editorial-gold mt-1 shrink-0" size={15} />
                <div>
                  <strong className="block text-editorial-cream font-sans uppercase tracking-wider font-bold mb-0.5">Ubicación Física</strong>
                  <span className="text-editorial-cream/70 font-serif italic text-sm">{config.address}</span>
                  <span className="block text-editorial-cream/40 font-mono mt-1">La Candelaria, Bogotá, CP 111711</span>
                </div>
              </div>

              <div className="flex items-start gap-4 text-xs" id="contact-phones">
                <Phone className="text-editorial-gold mt-1 shrink-0" size={15} />
                <div>
                  <strong className="block text-editorial-cream font-sans uppercase tracking-wider font-bold mb-0.5">Líneas de Atención</strong>
                  <span className="text-editorial-cream/70">Teléfono Local: {config.phone}</span>
                  <span className="block text-editorial-gold font-semibold mt-1">
                    WhatsApp Comercial: <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-editorial-cream transition-colors">{config.whatsapp}</a>
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 text-xs" id="contact-mails">
                <Mail className="text-editorial-gold mt-1 shrink-0" size={15} />
                <div>
                  <strong className="block text-editorial-cream font-sans uppercase tracking-wider font-bold mb-0.5">Auditoría & Consultas</strong>
                  <span className="text-editorial-cream/70 font-mono text-xs">{config.email}</span>
                  <span className="block text-editorial-cream/40 mt-1">Garantía de respuesta en un plazo menor a 2 horas.</span>
                </div>
              </div>

              <div className="flex items-start gap-4 text-xs" id="contact-schedule">
                <Clock className="text-editorial-gold mt-1 shrink-0" size={15} />
                <div>
                  <strong className="block text-editorial-cream font-sans uppercase tracking-wider font-bold mb-0.5">Horario Habitual</strong>
                  <span className="text-editorial-cream/90 font-serif italic text-sm leading-relaxed">{config.schedule}</span>
                </div>
              </div>
            </div>

            {/* Simulating Map layout */}
            <div className="bg-editorial-slate/10 p-1 rounded-sm border border-editorial-border" id="google-maps-box">
              <div className="relative h-64 bg-editorial-dark rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                <MapPin size={24} className="text-editorial-gold animate-bounce mb-3" />
                <h4 className="font-serif italic text-lg text-editorial-cream">{config.name} Bogotá</h4>
                <p className="text-xs font-sans text-editorial-cream/60 mt-1 max-w-sm">
                  Calle 11 # 2-15, Bogotá, Colombia. A pocos metros de la Catedral Primada de Bogotá y la Plaza de Bolívar.
                </p>
                <a 
                  id="google-maps-redirect-link"
                  href={`https://maps.google.com/?q=${encodeURIComponent(config.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 px-5 py-2 border border-editorial-border hover:border-editorial-gold hover:text-editorial-gold text-[10px] font-sans font-bold uppercase tracking-wider rounded-sm text-editorial-cream transition-all cursor-pointer"
                >
                  Ver Mapa en Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Contact Form */}
          <div className="bg-editorial-slate/30 p-6 sm:p-8 rounded-sm border border-editorial-border text-left" id="contact-form-box">
            <h3 className="font-serif text-lg text-editorial-cream mb-6 flex items-center gap-2">
              <MessageSquare size={16} className="text-editorial-gold" />
              <span>Enviar Mensaje Corporativo</span>
            </h3>

            {success ? (
              <div className="p-8 text-center bg-editorial-dark border border-editorial-border rounded-sm animate-fade-in" id="contact-success-msg">
                <div className="mx-auto p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Check size={20} />
                </div>
                <h4 className="font-serif italic text-lg text-editorial-cream">Soporte Corporativo</h4>
                <p className="font-sans text-xs text-editorial-cream/60 mt-2 leading-relaxed">
                  Tu mensaje ha sido cifrado y transmitido a nuestra oficina principal. El equipo de atención resolverá tu requerimiento en menos de dos horas por correo.
                </p>
                <button
                  id="reset-contact-btn"
                  onClick={() => setSuccess(false)}
                  className="mt-6 text-[10px] uppercase tracking-widest font-bold text-editorial-gold hover:text-editorial-cream transition-colors cursor-pointer"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" id="business-contact-form">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Ej. Luisa Fernanda"
                    className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Celular o Teléfono</label>
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="Ej. 321..."
                      className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Asunto Comercial</label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                  >
                    <option value="Reserva / Grupo especial" className="bg-editorial-dark text-editorial-cream">Mesa especial / Grupos corporativos</option>
                    <option value="Petición de Evento Corporativo" className="bg-editorial-dark text-editorial-cream">Cotización de catering / Alquiler</option>
                    <option value="Servicio al Cliente / Alergias" className="bg-editorial-dark text-editorial-cream">Sugerencias, dietas y alérgenos</option>
                    <option value="Auditoría / Petición Google Ads" className="bg-editorial-dark text-editorial-cream">Auditoría / Compliance Google Ads</option>
                    <option value="Otra consulta" className="bg-editorial-dark text-editorial-cream">Otras gestiones administrativas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Mensaje Detallado *</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe tu requerimiento para darte una solución rápida..."
                    className="w-full px-4 py-3 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold h-28 resize-none"
                  ></textarea>
                </div>

                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-sm text-xs flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  id="send-contact-form-btn"
                  disabled={submitting}
                  className="w-full py-3 bg-editorial-gold hover:bg-editorial-gold-dark text-editorial-bg font-sans font-bold text-xs uppercase tracking-widest rounded-sm transition-colors disabled:bg-editorial-slate disabled:text-editorial-cream/35 cursor-pointer"
                >
                  {submitting ? 'Transmitiendo...' : 'Enviar Comunicado'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Google Ads Compliance Center (Official Policy Agreements) */}
        <div className="border-t border-editorial-border pt-12 text-center" id="google-ads-compliance-center">
          <span className="text-[10px] uppercase tracking-widest text-editorial-gold font-bold block mb-2">Google Ads Policy Center</span>
          <h3 className="font-serif italic text-2xl text-editorial-cream mb-6">Auditorías, Transparencia & Habeas Data</h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10" id="policy-links-dock">
            <button
              id="privacy-policy-toggler"
              onClick={() => {
                setShowPrivacyPolicy(!showPrivacyPolicy);
                setShowTerms(false);
              }}
              className={`px-5 py-2.5 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all border cursor-pointer ${
                showPrivacyPolicy 
                  ? 'bg-editorial-gold text-editorial-bg border-editorial-gold' 
                  : 'bg-editorial-slate/40 border-editorial-border text-editorial-cream/70 hover:border-editorial-cream/30'
              }`}
            >
              {showPrivacyPolicy ? 'Cerrar Política' : 'Política de Privacidad (Habeas Data)'}
            </button>

            <button
              id="terms-policy-toggler"
              onClick={() => {
                setShowTerms(!showTerms);
                setShowPrivacyPolicy(false);
              }}
              className={`px-5 py-2.5 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all border cursor-pointer ${
                showTerms 
                  ? 'bg-editorial-gold text-editorial-bg border-editorial-gold' 
                  : 'bg-editorial-slate/40 border-editorial-border text-editorial-cream/70 hover:border-editorial-cream/30'
              }`}
            >
              {showTerms ? 'Cerrar Términos' : 'Términos & Condiciones de Reserva'}
            </button>
          </div>

          {/* Render Policies inline perfectly */}
          {showPrivacyPolicy && (
            <div className="bg-editorial-slate/40 p-6 sm:p-8 rounded-sm border border-editorial-border max-w-3xl mx-auto mb-10 text-left animate-fade-in" id="privacy-policy-view-pane">
              <Legal mode="privacy" config={config} />
            </div>
          )}

          {showTerms && (
            <div className="bg-editorial-slate/40 p-6 sm:p-8 rounded-sm border border-editorial-border max-w-3xl mx-auto mb-10 text-left animate-fade-in" id="terms-view-pane">
              <Legal mode="terms" config={config} />
            </div>
          )}

          {/* S.A.S Footnotes */}
          <div className="text-center text-editorial-cream/40 text-[11px] font-sans max-w-3xl mx-auto space-y-2 mt-6 leading-relaxed">
            <p className="font-bold text-editorial-cream/60 text-xs uppercase tracking-wider">{config.name} S.A.S. • NIT 901.456.789-3</p>
            <p>Todos los derechos reservados © 2026. La gastronomía, logotipos, redacciones descriptivas e imágenes pertenecen rigurosamente a la sociedad.</p>
            <p className="text-[10px]">
              Declaramos estricta observancia a las normativas de claridad publicitaria de Google Ads sobre falsas declaraciones de servicios oficiales, enlaces dañinos, cobros no autorizados y transacciones fraudulentas. No capturamos datos bancarios de forma directa para reservar, garantizando un ecosistema offline-first para todos los comensales.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
