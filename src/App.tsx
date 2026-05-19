import React, { useState, useEffect } from 'react';
import { 
  Instagram, Facebook, Award, Star 
} from 'lucide-react';
import { Dish, Reservation, Order, Review, RestaurantConfig, OrderItem } from './types';
import { INITIAL_DISHES, INITIAL_REVIEWS, INITIAL_CONFIG } from './data';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Reservations from './components/Reservations';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Admin from './components/Admin';
import Chatbot from './components/Chatbot';

export default function App() {
  // Load and preserve master states in localStorage for autogestión
  const [config, setConfig] = useState<RestaurantConfig>(() => {
    const cached = localStorage.getItem('mb_config');
    return cached ? JSON.parse(cached) : INITIAL_CONFIG;
  });

  const [dishes, setDishes] = useState<Dish[]>(() => {
    const cached = localStorage.getItem('mb_dishes');
    return cached ? JSON.parse(cached) : INITIAL_DISHES;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const cached = localStorage.getItem('mb_reservations');
    return cached ? JSON.parse(cached) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const cached = localStorage.getItem('mb_orders');
    return cached ? JSON.parse(cached) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const cached = localStorage.getItem('mb_reviews');
    return cached ? JSON.parse(cached) : INITIAL_REVIEWS;
  });

  const [cart, setCart] = useState<OrderItem[]>(() => {
    const cached = localStorage.getItem('mb_cart');
    return cached ? JSON.parse(cached) : [];
  });

  const [activeTab, setActiveTab] = useState('inicio');
  const [cartOpen, setCartOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(true); // enabled control view for owner

  // Save states to local storage on change
  useEffect(() => {
    localStorage.setItem('mb_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('mb_dishes', JSON.stringify(dishes));
  }, [dishes]);

  useEffect(() => {
    localStorage.setItem('mb_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('mb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mb_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('mb_cart', JSON.stringify(cart));
  }, [cart]);

  // 1. Cart Handlers
  const handleAddToCart = (dish: Dish, quantity: number) => {
    setCart((prev) => {
      const matchIdx = prev.findIndex((item) => item.dishId === dish.id);
      if (matchIdx > -1) {
        const updated = [...prev];
        updated[matchIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { dishId: dish.id, name: dish.name, quantity, price: dish.price }];
    });
  };

  const handleUpdateCartQty = (dishId: string, delta: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.dishId === dishId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as OrderItem[];
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // 2. Reservation Handlers
  const handleAddReservation = (newRes: Reservation) => {
    setReservations((prev) => [newRes, ...prev]);
  };

  const handleCancelReservation = (resId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status: 'cancelada' as const } : r))
    );
  };

  // 3. Review Handler
  const handleAddReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  // formatting helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price) + ' COP';
  };

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-cream flex flex-col justify-between selection:bg-editorial-gold selection:text-editorial-bg" id="master-app-root">
      
      {/* 1. Header Navigation Bar */}
      <Navbar 
        config={config}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cart={cart}
        setCartOpen={setCartOpen}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
      />

      {/* 2. Primary Page Router Layouts */}
      <main className="flex-1" id="main-content-flow">
        {activeTab === 'inicio' && (
          <div id="view-inicio-group">
            {/* Main Hero Component */}
            <Hero config={config} onNavigate={setActiveTab} />

            {/* Sub-section: Highlighted Chef Recommendations */}
            <section className="bg-editorial-bg py-16 px-6 border-t border-editorial-border" id="recommendations-row">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12" id="rec-header">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block mb-2">Platos de Autor Recomendados</span>
                  <h2 className="font-serif italic text-4xl sm:text-5xl text-editorial-cream tracking-tight">Recomendaciones del Compadre</h2>
                  <p className="font-serif italic text-editorial-cream/60 mt-3 text-sm max-w-lg mx-auto">Prueba nuestros platos insignia mejor valorados de la semana en la sabana de Bogotá.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="rec-dishes-grid">
                  {dishes.slice(0, 3).map((dish) => (
                    <div 
                      key={dish.id} 
                      className="bg-editorial-slate/30 p-5 rounded-sm border border-editorial-border hover:border-editorial-gold/20 transition-all flex flex-col justify-between"
                      id={`rec-item-${dish.id}`}
                    >
                      <div>
                        <div className="h-44 rounded-sm overflow-hidden mb-4 bg-editorial-dark border border-editorial-border-light">
                          <img 
                            src={dish.image} 
                            alt={dish.name}
                            className="w-full h-full object-cover select-none filter brightness-95" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h4 className="font-serif italic text-lg text-editorial-cream text-left">{dish.name}</h4>
                        <p className="font-sans text-xs text-editorial-cream/70 leading-relaxed mt-2 text-left line-clamp-3">{dish.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-editorial-border-light">
                        <span className="font-serif italic text-sm text-editorial-gold">{formatPrice(dish.price)}</span>
                        <button
                          onClick={() => {
                            handleAddToCart(dish, 1);
                            setCartOpen(true);
                          }}
                          className="bg-editorial-gold hover:bg-editorial-gold-dark text-editorial-bg text-[10px] uppercase tracking-wider font-bold py-2 px-4 rounded-sm transition-all cursor-pointer"
                        >
                          Ordenar plato
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-10">
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="px-6 py-3 bg-transparent hover:bg-editorial-slate/50 text-editorial-cream font-sans text-[10px] font-bold uppercase tracking-widest border border-editorial-border hover:border-editorial-cream/45 rounded-sm transition-all cursor-pointer"
                  >
                    Explorar la Carta Completa ({dishes.length} sabores) →
                  </button>
                </div>
              </div>
            </section>

            {/* Sub-section: Quick Testimonial Carousel Overview */}
            <section className="bg-editorial-slate/10 py-16 px-6 border-t border-editorial-border" id="quick-testimonials">
              <div className="max-w-5xl mx-auto text-center">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block mb-2">Libro de Huéspedes</span>
                <h3 className="font-serif italic text-3xl sm:text-4xl text-editorial-cream tracking-tight">La Experiencia en Nuestras Mesas</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto my-8 text-left" id="rec-reviews-grid">
                  {reviews.slice(0, 2).map((rev) => (
                    <div key={rev.id} className="bg-editorial-bg p-6 rounded-sm border border-editorial-border flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-0.5 text-xs text-editorial-gold mb-3">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <Star key={idx} size={11} className="fill-editorial-gold text-editorial-gold" />
                          ))}
                        </div>
                        <p className="text-editorial-cream/80 text-xs italic font-serif leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                      </div>
                      <span className="block text-[9px] uppercase tracking-widest text-[#C5A059] font-bold mt-4 font-sans border-t border-editorial-border-light pt-2">- {rev.name}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('comentarios')}
                  className="text-[10px] uppercase tracking-wider font-bold font-sans text-editorial-gold hover:underline cursor-pointer"
                >
                  Consultar u opinar sobre el servicio →
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'menu' && (
          <Menu 
            dishes={dishes} 
            cart={cart}
            onAddToCart={handleAddToCart}
            onNavigateToCart={() => setCartOpen(true)}
          />
        )}

        {activeTab === 'reservas' && (
          <Reservations 
            reservations={reservations}
            onAddReservation={handleAddReservation}
            onCancelReservation={handleCancelReservation}
            config={config}
          />
        )}

        {activeTab === 'comentarios' && (
          <Reviews 
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        )}

        {activeTab === 'contacto' && (
          <Contact config={config} />
        )}

        {activeTab === 'admin' && (
          <Admin 
            dishes={dishes} 
            setDishes={setDishes}
            reservations={reservations} 
            setReservations={setReservations}
            orders={orders} 
            setOrders={setOrders}
            config={config} 
            setConfig={setConfig}
          />
        )}
      </main>

      {/* 3. Global Legal Compliant Footer (Google Ads Adherence) */}
      <footer className="bg-editorial-bg border-t border-editorial-border px-6 py-12 text-editorial-cream/40 text-xs text-left" id="global-site-footer">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8" id="footer-gird">
          
          {/* Column A: Logo & Bio */}
          <div className="space-y-3">
            <h4 className="font-serif italic text-lg text-editorial-cream">{config.name}</h4>
            <p className="font-serif italic text-xs leading-relaxed text-editorial-cream/60">
              &ldquo;{config.slogan}&rdquo;
            </p>
            <span className="block text-[10px] text-editorial-cream/40 font-mono">NIT. 901.456.789-3 • Bogotá, D.C.</span>
          </div>

          {/* Column B: Fast Contact Information */}
          <div className="space-y-2 text-left" id="foot-contacts-list">
            <h5 className="font-serif text-sm text-editorial-cream font-bold">Reserva de Mesas Gratis</h5>
            <p className="text-[11px] text-editorial-cream/70">📍 Dirección: {config.address}</p>
            <p className="text-[11px] text-editorial-cream/70">📞 Teléfono Fijo: {config.phone}</p>
            <p className="text-[11px] text-editorial-gold font-semibold">📲 Oficial WhatsApp: {config.whatsapp}</p>
          </div>

          {/* Column C: Instant Policy Links for Ads bots */}
          <div className="space-y-2 flex flex-col text-left" id="foot-policy-links">
            <h5 className="font-serif text-sm text-editorial-cream font-bold">Unidad Legal de Transparencia</h5>
            <button
              onClick={() => { setActiveTab('contacto'); document.getElementById('contact-legal-section')?.scrollIntoView(); }}
              className="text-[11px] text-editorial-cream/70 hover:text-editorial-gold text-left transition-colors cursor-pointer"
            >
              • Tratamiento de Datos (SIC Colombia)
            </button>
            <button
              onClick={() => { setActiveTab('contacto'); document.getElementById('contact-legal-section')?.scrollIntoView(); }}
              className="text-[11px] text-editorial-cream/70 hover:text-editorial-gold text-left transition-colors cursor-pointer"
            >
              • Términos de Envío & Políticas de Reembolso
            </button>
            
            {/* Social Medias Container Row */}
            <div className="flex items-center gap-4 pt-3 text-editorial-cream/60" id="foot-socials-row">
              <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-editorial-gold transition-colors text-xs uppercase tracking-widest font-bold">
                Instagram
              </a>
              <span className="text-editorial-cream/15">|</span>
              <a href={config.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-editorial-gold transition-colors text-xs uppercase tracking-widest font-bold">
                Facebook
              </a>
              <span className="text-editorial-cream/15">|</span>
              <a href={config.tripadvisor} target="_blank" rel="noopener noreferrer" className="hover:text-editorial-gold transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-1">
                <Award size={13} className="text-editorial-gold" />
                <span>Advisor</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-editorial-border-light text-center text-[10px] space-y-1 text-editorial-cream/30">
          <p>© 2026 {config.name}. Hecho con pasión por el sabor andino. Reservas reguladas gratuitamente sin costes falsos de pasarela.</p>
          <p>Cumplimos con la Ley Colombiana de Habeas Data 1581 y el Estatuto de Protección al Consumidor Ley 1480.</p>
        </div>
      </footer>

      {/* 4. Global Cartwright Drawer Sidebar */}
      <Cart 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        dishes={dishes}
        onUpdateQty={handleUpdateCartQty}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        config={config}
      />

      {/* 5. Smart AI floating Virtual Advisor */}
      <Chatbot />

    </div>
  );
}
