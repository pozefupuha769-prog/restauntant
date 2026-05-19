import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import { OrderItem, Dish, Order, RestaurantConfig } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: OrderItem[];
  dishes: Dish[];
  onUpdateQty: (dishId: string, delta: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Order) => void;
  config: RestaurantConfig;
}

export default function Cart({
  isOpen,
  onClose,
  cart,
  dishes,
  onUpdateQty,
  onClearCart,
  onPlaceOrder,
  config
}: CartProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo');
  const [notes, setNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  // Helpers to calculate prices
  const getDishPrice = (dishId: string) => {
    return dishes.find(d => d.id === dishId)?.price || 0;
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (getDishPrice(item.dishId) * item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price) + ' COP';
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (cart.length === 0) {
      setValidationError('El carrito está vacío.');
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setValidationError('Por favor completa todos los datos obligatorios para la entrega.');
      return;
    }

    // Phone structure checks for Colombia
    if (customerPhone.replace(/\D/g, '').length < 7) {
      setValidationError('Digita un número telefónico o celular válido.');
      return;
    }

    const orderId = 'order-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      total: calculateSubtotal(),
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      paymentMethod,
      notes,
      status: 'pendiente',
      createdAt: new Date().toISOString()
    };

    // Save order locally
    onPlaceOrder(newOrder);
    setOrderSuccess(true);
  };

  // Launch compiled WhatsApp message
  const launchWhatsAppOrder = () => {
    const subtotalText = formatPrice(calculateSubtotal());
    const itemsFormatted = cart.map(item => {
      const p = getDishPrice(item.dishId);
      return `• ${item.quantity}x ${item.name} (${formatPrice(p * item.quantity)})`;
    }).join('%0A');

    const paymentLabel = 
      paymentMethod === 'efectivo' ? 'Efectivo contra entrega' :
      paymentMethod === 'transferencia' ? 'Transferencia (Nequi/Daviplata)' : 'Tarjeta de Crédito en local';

    const cleanPhone = config.whatsapp.replace(/\+/g, '').replace(/\s/g, '');
    const message = `¡Hola! Quisiera confirmar mi pedido con diseño Editorial en ${config.name}:%0A%0A` +
      `*DETALLE DEL PEDIDO*:%0A${itemsFormatted}%0A%0A` +
      `*Total:* ${subtotalText}%0A%0A` +
      `*CLIENTE:*%0A` +
      `• Nombre: ${customerName}%0A` +
      `• Teléfono: ${customerPhone}%0A` +
      `• Dirección de entrega: ${customerAddress}%0A` +
      `• Método de Pago: ${paymentLabel}%0A` +
      `• Notas: ${notes || 'Ninguna'}%0A%0A` +
      `Por favor contáctenme de vuelta para el envío.`;

    const waLink = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(waLink, '_blank');
  };

  const handleResetCheckout = () => {
    setOrderSuccess(false);
    onClearCart();
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCustomerAddress('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" id="cart-drawer-overlay">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-editorial-slate/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Cart Drawer content */}
      <div className="relative w-full max-w-lg bg-editorial-bg text-editorial-cream h-full shadow-2xl flex flex-col z-10 border-l border-editorial-border" id="cart-drawer-panel">
        
        {/* Header Indicator */}
        <div className="p-6 border-b border-editorial-border flex items-center justify-between" id="cart-drawer-header">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-editorial-gold" />
            <h2 className="font-serif italic text-xl tracking-tight">Tu Selección</h2>
          </div>
          <button 
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="p-1.5 rounded-sm hover:bg-editorial-slate text-editorial-cream/60 hover:text-editorial-cream transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {orderSuccess ? (
          /* Order success animation interface */
          <div className="flex-1 overflow-y-auto p-8 text-center flex flex-col items-center justify-center animate-fade-in" id="cart-success-view">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full mb-6">
              <CheckCircle size={36} />
            </div>
            <h3 className="font-serif italic text-2xl text-editorial-cream">Pedido Registrado</h3>
            <p className="font-sans text-xs text-editorial-cream/60 mt-2 max-w-sm">
              Tu orden ha sido registrada en el sistema de autogestión local del restaurante.
            </p>

            <div className="w-full bg-editorial-slate/50 p-6 rounded-sm border border-editorial-border my-6 text-left">
              <span className="text-[10px] font-mono tracking-widest uppercase text-editorial-gold block mb-1">MÉTODO RECOMENDADO</span>
              <h4 className="font-serif text-base text-editorial-cream">Sincroniza por WhatsApp</h4>
              <p className="font-sans text-xs text-editorial-cream/70 mt-2 leading-relaxed">
                Para coordinar el despacho inmediato de tu domicilio en Bogotá, envía tu orden formateada al administrador con un solo clic.
              </p>
              <button
                id="send-order-whatsapp-btn"
                onClick={launchWhatsAppOrder}
                className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-editorial-cream text-xs font-sans font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={12} />
                <span>Confirmar y Enviar a WhatsApp</span>
              </button>
            </div>

            <button
              id="new-order-btn"
              onClick={handleResetCheckout}
              className="px-6 py-2.5 border border-editorial-border hover:border-editorial-cream/40 text-editorial-cream/80 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-colors cursor-pointer"
            >
              Hacer otro Pedido
            </button>
          </div>
        ) : (
          /* Standard cart flow view */
          <div className="flex-1 flex flex-col overflow-hidden" id="cart-flow-view">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-editorial-cream/50 text-center" id="empty-cart-state">
                <ShoppingBag size={38} className="text-editorial-cream/20 mb-3 animate-pulse" />
                <p className="font-serif italic text-base">La bandeja está vacía.</p>
                <p className="font-sans text-xs text-editorial-cream/40 mt-1">Explora nuestro catálogo y añade deliciosos sabores andinos.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col" id="cart-drawer-scrollable">
                {/* 1. Item listings */}
                <div className="p-6 space-y-4" id="cart-items-list">
                  <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-editorial-gold">Artículos Seleccionados</h3>
                  <div className="space-y-3">
                    {cart.map((item) => {
                      const price = getDishPrice(item.dishId);
                      return (
                        <div 
                          key={item.dishId} 
                          id={`cart-item-${item.dishId}`}
                          className="bg-editorial-slate/30 p-4 rounded-sm border border-editorial-border flex items-center gap-4 justify-between"
                        >
                          <div className="flex-1 text-left">
                            <h4 className="font-serif italic text-base text-editorial-cream">{item.name}</h4>
                            <span className="font-serif italic text-xs text-editorial-gold block mt-0.5">{formatPrice(price)} c/u</span>
                          </div>

                          {/* Quantity controller */}
                          <div className="flex items-center space-x-2">
                            <button
                              id={`qty-dec-${item.dishId}`}
                              onClick={() => onUpdateQty(item.dishId, -1)}
                              className="p-1 rounded bg-editorial-slate border border-editorial-border text-editorial-cream/60 hover:text-editorial-cream cursor-pointer"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="font-serif text-sm font-semibold text-editorial-cream text-center w-6">{item.quantity}</span>
                            <button
                              id={`qty-inc-${item.dishId}`}
                              onClick={() => onUpdateQty(item.dishId, 1)}
                              className="p-1 rounded bg-editorial-slate border border-editorial-border text-editorial-cream/60 hover:text-editorial-cream cursor-pointer"
                            >
                              <Plus size={10} />
                            </button>
                            <button
                              id={`qty-del-${item.dishId}`}
                              onClick={() => onUpdateQty(item.dishId, -item.quantity)}
                              className="p-1 text-editorial-cream/40 hover:text-red-400 transition-colors ml-2 cursor-pointer"
                              title="Eliminar artículo"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Customer checkout delivery form */}
                <form onSubmit={handleCheckout} className="p-6 border-t border-editorial-border space-y-4" id="checkout-form">
                  <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-editorial-gold mb-3">Datos de Entrega & Domicilio</h3>
                  
                  <div className="text-left">
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. Andrés Felipe"
                      className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1">Celular *</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Ej. 3001234567"
                        className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                      />
                    </div>
                  </div>

                  <div className="text-left">
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1">Dirección Estricta en Bogotá *</label>
                    <input
                      type="text"
                      required
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Ej. Cl. 11 # 2-15, Chapinero / Candelaria"
                      className="w-full px-3 py-2.5 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold"
                    />
                  </div>

                  {/* Payment Methods */}
                  <div className="text-left">
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Método de Pago *</label>
                    <div className="grid grid-cols-3 gap-2" id="payment-methods-grid">
                      <button
                        type="button"
                        id="pay-cash-btn"
                        onClick={() => setPaymentMethod('efectivo')}
                        className={`py-2 px-1 text-center rounded-sm border text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                          paymentMethod === 'efectivo'
                            ? 'bg-editorial-gold text-editorial-bg border-editorial-gold'
                            : 'bg-editorial-slate/40 border-editorial-border text-editorial-cream/60 hover:text-editorial-cream'
                        }`}
                      >
                        Efectivo
                      </button>
                      <button
                        type="button"
                        id="pay-transfer-btn"
                        onClick={() => setPaymentMethod('transferencia')}
                        className={`py-2 px-1 text-center rounded-sm border text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                          paymentMethod === 'transferencia'
                            ? 'bg-editorial-gold text-editorial-bg border-editorial-gold'
                            : 'bg-editorial-slate/40 border-editorial-border text-editorial-cream/60 hover:text-editorial-cream'
                        }`}
                      >
                        Nequi
                      </button>
                      <button
                        type="button"
                        id="pay-card-btn"
                        onClick={() => setPaymentMethod('tarjeta')}
                        className={`py-2 px-1 text-center rounded-sm border text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                          paymentMethod === 'tarjeta'
                            ? 'bg-editorial-gold text-editorial-bg border-editorial-gold'
                            : 'bg-editorial-slate/40 border-editorial-border text-editorial-cream/60 hover:text-editorial-cream'
                        }`}
                      >
                        Datáfono
                      </button>
                    </div>

                    {/* Explanatory visual banner based on chosen payment system (Google Ads Transparency) */}
                    {paymentMethod === 'transferencia' && (
                      <div className="bg-editorial-slate p-3 rounded-sm text-[10px] text-editorial-cream/70 mt-3 font-serif italic border border-editorial-border-light leading-relaxed">
                        🏦 Transfiere al Nequi/Daviplata oficial <strong className="text-editorial-gold">{config.whatsapp}</strong> antes de despachar. El domiciliario verificará el comprobante digital.
                      </div>
                    )}
                    {paymentMethod === 'efectivo' && (
                      <div className="bg-editorial-slate p-3 rounded-sm text-[10px] text-editorial-cream/70 mt-3 font-serif italic border border-editorial-border-light leading-relaxed">
                        💵 Pagas al recibir en tu dirección de Bogotá. ¡Agradecemos facilitar el cambio exacto!
                      </div>
                    )}
                    {paymentMethod === 'tarjeta' && (
                      <div className="bg-editorial-slate p-3 rounded-sm text-[10px] text-editorial-cream/70 mt-3 font-serif italic border border-editorial-border-light leading-relaxed">
                        💳 El domiciliario llevará un datafono inalámbrico compatible con tarjetas débito/crédito nacionales e internacionales.
                      </div>
                    )}
                  </div>

                  <div className="text-left">
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1">Notas especiales o Alergias</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ej. Alergia a nueces, sin cubiertos, llamar antes..."
                      className="w-full px-3 py-2 bg-editorial-slate/50 text-editorial-cream border border-editorial-border rounded-sm text-xs focus:outline-none focus:border-editorial-gold h-16 resize-none"
                    ></textarea>
                  </div>

                  {validationError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-sm text-xs text-left">
                      {validationError}
                    </div>
                  )}

                  {/* Pricing Sum and Action Trigger */}
                  <div className="pt-4 border-t border-editorial-border space-y-2 text-left">
                    <div className="flex items-center justify-between text-xs text-editorial-cream/60">
                      <span>Costo de Platos</span>
                      <span className="font-mono">{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-editorial-cream/60 pb-2">
                      <span>Envío en Bogotá</span>
                      <span className="font-serif italic text-editorial-gold">¡Bonificado Gratis!</span>
                    </div>
                    <div className="flex items-center justify-between font-serif text-sm border-t border-editorial-border pt-3 text-editorial-cream">
                      <span>Total (IVA incluido)</span>
                      <span className="font-serif text-lg text-editorial-gold font-bold">{formatPrice(calculateSubtotal())}</span>
                    </div>

                    <button
                      type="submit"
                      id="submit-checkout-btn"
                      className="w-full py-3.5 bg-editorial-gold hover:bg-editorial-gold-dark text-editorial-bg font-sans font-bold text-xs uppercase tracking-widest rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
                    >
                      <ShieldCheck size={14} />
                      <span>Registrar Orden Oficial</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
