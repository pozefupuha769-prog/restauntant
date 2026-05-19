import React, { useState } from 'react';
import { Star, MessageSquarePlus, Check } from 'lucide-react';
import { Review } from '../types';

interface ReviewsProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

export default function Reviews({ reviews, onAddReview }: ReviewsProps) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate rating statistics
  const totalReviews = reviews.length;
  const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : '5.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !comment.trim()) {
      setErrorMsg('Por favor completa tu nombre y escribe un comentario valioso.');
      return;
    }

    const newRev: Review = {
      id: 'rev-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      name,
      rating,
      comment,
      date: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    onAddReview(newRev);
    setSuccess(true);
    setName('');
    setComment('');
    setRating(5);
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        size={12}
        className={idx < count ? "text-editorial-gold fill-editorial-gold" : "text-editorial-cream/20"}
      />
    ));
  };

  return (
    <section className="bg-editorial-bg border-t border-editorial-border text-editorial-cream py-16 px-6" id="reviews-section">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-12" id="reviews-header">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block mb-2">Libro de Opiniones Abierto</span>
          <h2 className="font-serif italic text-4xl sm:text-5xl text-editorial-cream tracking-tight">
            Opiniones de Nuestros Clientes
          </h2>
          <p className="font-serif italic text-editorial-cream/60 mt-3 text-sm max-w-lg mx-auto">
            La honestidad de nuestra comunidad es lo más importante para prosperar en Bogotá. Tu testimonio ayuda a otros sibaritas.
          </p>
        </div>

        {/* Multi-column layout: stats and submissions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left" id="reviews-stats-row">
          
          {/* Column 1: Rating Stats Display */}
          <div className="bg-editorial-slate/50 p-6 rounded-sm border border-editorial-border text-center flex flex-col justify-center" id="reviews-avg-box">
            <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Calificación Global</span>
            <span className="text-6xl font-serif italic text-editorial-gold my-4">{averageRating}</span>
            <div className="flex justify-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={16}
                  className={idx < Math.round(Number(averageRating)) ? "text-editorial-gold fill-editorial-gold" : "text-editorial-cream/10"}
                />
              ))}
            </div>
            <p className="text-xs font-sans text-editorial-cream/55">{totalReviews} comentarios verificados</p>
          </div>

          {/* Column 2 & 3: Inline Form to submit a review */}
          <div className="md:col-span-2 bg-editorial-slate/30 p-6 sm:p-8 rounded-sm border border-editorial-border" id="submit-review-box">
            <h3 className="font-serif text-lg text-editorial-cream mb-6 flex items-center gap-2">
              <MessageSquarePlus size={16} className="text-editorial-gold" />
              <span>Cuéntanos tu Experiencia Culinaria</span>
            </h3>

            {success ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-5 rounded-sm text-xs flex items-center justify-between animate-fade-in" id="review-success-msg">
                <div className="flex items-start gap-2 max-w-xs text-left">
                  <Check size={16} className="shrink-0 mt-0.5" />
                  <span>¡Tu valoración ha sido guardada! Gracias por compartir tu honesto paladar.</span>
                </div>
                <button 
                  onClick={() => setSuccess(false)}
                  className="text-editorial-cream hover:text-[#C5A059] font-bold uppercase tracking-widest text-[9px] underline cursor-pointer ml-4"
                >
                  Escribir otro
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" id="add-review-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-editorial-cream/80 mb-1.5">Nombre o Seudónimo *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Santiago Ruiz"
                      className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                    />
                  </div>

                  {/* Rating Selector Block */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-editorial-cream/80 mb-1.5">Valora con Estrellas *</label>
                    <div className="flex items-center gap-1.5 mt-2" id="stars-hover-wrapper">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const starVal = idx + 1;
                        return (
                          <button
                            type="button"
                            key={idx}
                            id={`star-btn-${starVal}`}
                            className="cursor-pointer transition-transform hover:scale-110"
                            onClick={() => setRating(starVal)}
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(null)}
                          >
                            <Star
                              size={18}
                              className={
                                starVal <= (hoverRating ?? rating)
                                  ? 'text-editorial-gold fill-editorial-gold'
                                  : 'text-editorial-cream/20 hover:text-editorial-gold'
                              }
                            />
                          </button>
                        );
                      })}
                      <span className="text-editorial-cream/50 font-mono text-xs ml-3">
                        {hoverRating ?? rating} / 5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment area */}
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-editorial-cream/80 mb-1.5">Opinión Detallada *</label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Sugerencias, sazón, plato preferido, servicio..."
                    className="w-full px-4 py-3 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold h-20 resize-none animate-fade-in"
                  ></textarea>
                </div>

                {errorMsg && (
                  <div className="text-red-400 bg-red-400/5 p-2 rounded-sm text-xs text-left border border-red-500/10">
                    {errorMsg}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    id="submit-review-btn"
                    className="px-6 py-2.5 bg-editorial-gold hover:bg-editorial-gold-dark text-editorial-bg font-sans font-bold text-xs uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
                  >
                    Publicar Opinión
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Testimonials List */}
        <div className="space-y-6 text-left" id="reviews-list-wrapper">
          <h3 className="font-serif italic text-2xl text-editorial-cream border-b border-editorial-border pb-3">Testimonios Recientes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" id="testimonials-feed">
            {reviews.map((rev) => (
              <div 
                key={rev.id} 
                id={`customer-review-${rev.id}`}
                className="bg-editorial-slate/35 p-6 rounded-sm border border-editorial-border hover:border-editorial-gold/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-serif italic text-base text-editorial-cream">{rev.name}</h4>
                      <span className="text-[10px] text-editorial-cream/40 font-mono block mt-0.5">{rev.date}</span>
                    </div>
                    <div className="flex gap-0.5 mt-1 shrink-0">
                      {renderStars(rev.rating)}
                    </div>
                  </div>
                  <p className="font-sans text-xs text-editorial-cream/80 leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
