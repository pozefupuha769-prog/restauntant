import React, { useState } from 'react';
import { 
  Settings, ChefHat, CalendarCheck, ClipboardList, Plus, Trash2, 
  Check, X, Save 
} from 'lucide-react';
import { Dish, Reservation, Order, RestaurantConfig } from '../types';

interface AdminProps {
  dishes: Dish[];
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  config: RestaurantConfig;
  setConfig: React.Dispatch<React.SetStateAction<RestaurantConfig>>;
}

export default function Admin({
  dishes,
  setDishes,
  reservations,
  setReservations,
  orders,
  setOrders,
  config,
  setConfig
}: AdminProps) {
  const [activeSubTab, setActiveSubTab] = useState<'config' | 'menu' | 'reservas' | 'pedidos'>('config');

  // New dish form fields
  const [newDishName, setNewDishName] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishPrice, setNewDishPrice] = useState(25000);
  const [newDishCat, setNewDishCat] = useState<Dish['category']>('fuertes');
  const [newDishImg, setNewDishImg] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');
  const [newDishTags, setNewDishTags] = useState('Delicia, Premium');

  // General config editing fields
  const [cfgName, setCfgName] = useState(config.name);
  const [cfgSlogan, setCfgSlogan] = useState(config.slogan);
  const [cfgAddress, setCfgAddress] = useState(config.address);
  const [cfgWhatsapp, setCfgWhatsapp] = useState(config.whatsapp);
  const [cfgEmail, setCfgEmail] = useState(config.email);
  const [cfgPhone, setCfgPhone] = useState(config.phone);
  const [cfgSchedule, setCfgSchedule] = useState(config.schedule);
  const [cfgAlert, setCfgAlert] = useState(config.alertBanner || '');
  const [configSaved, setConfigSaved] = useState(false);

  // Colombian Pesos locale format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price) + ' COP';
  };

  // 1. CONFIGURATION ACTION
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig({
      name: cfgName,
      slogan: cfgSlogan,
      address: cfgAddress,
      whatsapp: cfgWhatsapp,
      email: cfgEmail,
      phone: cfgPhone,
      schedule: cfgSchedule,
      alertBanner: cfgAlert || undefined,
      instagram: config.instagram,
      facebook: config.facebook,
      tripadvisor: config.tripadvisor
    });
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  // 2. DISH ACTIONS
  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || !newDishDesc.trim()) return;

    const tagsArr = newDishTags.split(',').map(t => t.trim()).filter(Boolean);
    const newId = 'dish-' + (dishes.length + 1) + '-' + Math.floor(Math.random() * 100);

    const createdDish: Dish = {
      id: newId,
      name: newDishName,
      description: newDishDesc,
      price: Number(newDishPrice) || 20000,
      category: newDishCat,
      image: newDishImg,
      available: true,
      tags: tagsArr.length > 0 ? tagsArr : undefined
    };

    setDishes((prev) => [createdDish, ...prev]);

    // Reset Form
    setNewDishName('');
    setNewDishDesc('');
    setNewDishPrice(25000);
    setNewDishTags('Delicia, Premium');
  };

  const handleToggleAvailability = (dishId: string) => {
    setDishes((prev) => prev.map(d => {
      if (d.id === dishId) {
        return { ...d, available: !d.available };
      }
      return d;
    }));
  };

  const handleDeleteDish = (dishId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar permanentemente este platillo del catálogo?')) {
      setDishes((prev) => prev.filter(d => d.id !== dishId));
    }
  };

  // 3. RESERVATION ACTIONS
  const handleUpdateResStatus = (resId: string, formatStatus: Reservation['status']) => {
    setReservations((prev) => prev.map(r => {
      if (r.id === resId) {
        return { ...r, status: formatStatus };
      }
      return r;
    }));
  };

  const handleDeleteReservation = (resId: string) => {
    if (confirm('¿Eliminar registro de reserva?')) {
      setReservations((prev) => prev.filter(r => r.id !== resId));
    }
  };

  // 4. ORDER LIST ACTIONS
  const handleUpdateOrderStatus = (orderId: string, stat: Order['status']) => {
    setOrders((prev) => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: stat };
      }
      return o;
    }));
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('¿Eliminar este registro de pedido de domicilio?')) {
      setOrders((prev) => prev.filter(o => o.id !== orderId));
    }
  };

  // Calculate stats
  const totalCompletedSales = orders
    .filter(o => o.status === 'completado')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <section className="bg-editorial-bg border-t border-editorial-border text-editorial-cream py-16 px-6" id="admin-workspace-section">
      <div className="max-w-6xl mx-auto">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-editorial-border/30 pb-8 mb-12 gap-6" id="admin-header">
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold block mb-2">Panel Autogestionable Owner</span>
            <h2 className="font-serif italic text-3xl sm:text-4xl text-editorial-cream flex items-center gap-3">
              <Settings size={20} className="text-editorial-gold" />
              <span>Gestión {config.name}</span>
            </h2>
            <p className="font-sans text-xs text-editorial-cream/60 mt-2">
              Administración local instantánea de platos del menú, estados de mesas reservadas, pedidos a domicilio y datos generales de publicidad.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs font-mono" id="admin-quick-stats">
            <div className="bg-editorial-slate/50 p-4 rounded-sm border border-editorial-border text-left" id="stat-sales">
              <span className="text-editorial-cream/40 block text-[9px] uppercase tracking-wider font-bold">Ventas Completadas</span>
              <span className="text-emerald-400 font-serif italic text-lg font-bold block mt-1">{formatPrice(totalCompletedSales)}</span>
            </div>
            <div className="bg-editorial-slate/50 p-4 rounded-sm border border-editorial-border text-left" id="stat-res">
              <span className="text-editorial-cream/40 block text-[9px] uppercase tracking-wider font-bold">Reservas de Mesa</span>
              <span className="text-editorial-gold font-serif italic text-lg font-bold block mt-1">{reservations.length}</span>
            </div>
          </div>
        </div>

        {/* Admin sub-navigation tabs */}
        <div className="flex items-center space-x-2 border-b border-editorial-border pb-4 mb-10 overflow-x-auto scrollbar-none" id="admin-tabs">
          {[
            { id: 'config', label: 'Datos Generales', icon: <Settings size={13} /> },
            { id: 'menu', label: `Menú & Carta (${dishes.length})`, icon: <ChefHat size={13} /> },
            { id: 'reservas', label: `Reservas Gratuites (${reservations.length})`, icon: <CalendarCheck size={13} /> },
            { id: 'pedidos', label: `Despachos (${orders.length})`, icon: <ClipboardList size={13} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-sm text-[10px] uppercase tracking-widest font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap border ${
                activeSubTab === tab.id
                  ? 'bg-editorial-gold text-editorial-bg border-editorial-gold font-bold'
                  : 'bg-editorial-slate/30 text-editorial-cream/70 border-editorial-cream/10 hover:border-editorial-cream/30 hover:text-editorial-cream'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* -----------------------------------------------------------------
          SUB_FLOW 1: GENERAL RESTAURANT CONFIGS
        ------------------------------------------------------------------ */}
        {activeSubTab === 'config' && (
          <form onSubmit={handleSaveConfig} className="bg-editorial-slate/30 p-6 sm:p-8 rounded-sm border border-editorial-border space-y-6 text-left animate-fade-in" id="form-config-admin">
            <h3 className="font-serif text-lg text-editorial-cream border-b border-editorial-border-light pb-2">Editar Marca & Datos del Negocio</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Nombre Comercial *</label>
                <input
                  type="text"
                  required
                  value={cfgName}
                  onChange={(e) => setCfgName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Slogan del Bistro</label>
                <input
                  type="text"
                  value={cfgSlogan}
                  onChange={(e) => setCfgSlogan(e.target.value)}
                  className="w-full px-3 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">WhatsApp Oficial (Con prefijo) *</label>
                <input
                  type="text"
                  required
                  value={cfgWhatsapp}
                  onChange={(e) => setCfgWhatsapp(e.target.value)}
                  className="w-full px-3 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Teléfono Fijo</label>
                <input
                  type="text"
                  value={cfgPhone}
                  onChange={(e) => setCfgPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Correo de Auditoría y Clientes *</label>
                <input
                  type="email"
                  required
                  value={cfgEmail}
                  onChange={(e) => setCfgEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Horario Detallado *</label>
                <input
                  type="text"
                  required
                  value={cfgSchedule}
                  onChange={(e) => setCfgSchedule(e.target.value)}
                  className="w-full px-3 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Dirección Física en Bogotá *</label>
              <input
                type="text"
                required
                value={cfgAddress}
                onChange={(e) => setCfgAddress(e.target.value)}
                className="w-full px-3 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Frase de Alerta / Campaña Superior</label>
              <input
                type="text"
                value={cfgAlert}
                onChange={(e) => setCfgAlert(e.target.value)}
                placeholder="Ej. ¡Campañas de Reservas Abiertas sin coste!"
                className="w-full px-3 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs"
              />
            </div>

            {configSaved && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-sm text-xs text-left animate-fade-in">
                ¡Módulos actualizados con éxito! El público ya visualiza los nuevos datos.
              </div>
            )}

            <button
              type="submit"
              id="save-business-config-btn"
              className="px-6 py-3 bg-editorial-gold hover:bg-editorial-gold-dark text-editorial-bg font-sans font-bold text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save size={13} />
              <span>Guardar Configuración General</span>
            </button>
          </form>
        )}

        {/* -----------------------------------------------------------------
          SUB_FLOW 2: MENU CATALOG MANAGER
        ------------------------------------------------------------------ */}
        {activeSubTab === 'menu' && (
          <div className="space-y-8 text-left animate-fade-in" id="admin-menu-container">
            {/* Adding a new Food item */}
            <form onSubmit={handleAddDish} className="bg-editorial-slate/30 p-6 sm:p-8 rounded-sm border border-editorial-border space-y-5" id="form-add-dish">
              <h3 className="font-serif text-lg text-editorial-cream border-b border-editorial-border-light pb-2 flex items-center gap-2">
                <Plus size={16} className="text-editorial-gold" />
                <span>Agregar Platillo o Bebida al Menú</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Nombre del Plato *</label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="Ej. Postre Helado de Feijoa"
                    className="w-full px-3 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Categoría *</label>
                    <select
                      id="new-dish-category"
                      value={newDishCat}
                      onChange={(e) => setNewDishCat(e.target.value as Dish['category'])}
                      className="w-full px-3 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs focus:outline-none"
                    >
                      <option value="entradas" className="bg-editorial-dark">Entradas</option>
                      <option value="fuertes" className="bg-editorial-dark">Platos Fuertes</option>
                      <option value="bebidas" className="bg-editorial-dark">Bebidas</option>
                      <option value="postres" className="bg-editorial-dark">Postres</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Precio COP *</label>
                    <input
                      type="number"
                      required
                      value={newDishPrice}
                      onChange={(e) => setNewDishPrice(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Imagen URL *</label>
                  <input
                    type="url"
                    required
                    value={newDishImg}
                    onChange={(e) => setNewDishImg(e.target.value)}
                    className="w-full px-3 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Etiquetas (comas)</label>
                  <input
                    type="text"
                    value={newDishTags}
                    onChange={(e) => setNewDishTags(e.target.value)}
                    placeholder="Ej. Boyacá, Orgánico"
                    className="w-full px-3 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-editorial-cream/80 mb-1.5">Descripción de Ingredientes *</label>
                <textarea
                  required
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="Ej. Sabor de hogar..."
                  className="w-full px-4 py-2.5 bg-editorial-slate/50 border border-editorial-border text-editorial-cream rounded-sm text-xs h-16 resize-none focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                id="submit-add-dish-btn"
                className="px-6 py-3 bg-editorial-gold hover:bg-editorial-gold-dark text-editorial-bg font-sans font-bold text-xs uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
              >
                Agregar al Catálogo
              </button>
            </form>

            {/* List and manage current menu array */}
            <div className="bg-editorial-slate/20 p-6 sm:p-8 rounded-sm border border-editorial-border space-y-4" id="admin-dishes-list">
              <h3 className="font-serif text-lg text-editorial-cream pb-3 border-b border-editorial-border">Menú Publicado ({dishes.length} platillos)</h3>
              
              <div className="divide-y divide-editorial-border-light" id="dishes-admin-rows">
                {dishes.map((dish) => (
                  <div 
                    key={dish.id} 
                    id={`dish-admin-row-${dish.id}`}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <img 
                        src={dish.image} 
                        alt={dish.name}
                        className="w-14 h-14 rounded-sm object-cover border border-editorial-border shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-serif italic text-base text-editorial-cream">{dish.name}</h4>
                        <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold mr-3">{dish.category}</span>
                        <span className="font-serif italic text-sm text-editorial-cream/70">{formatPrice(dish.price)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-end">
                      {/* Live availability toggle switch */}
                      <button
                        id={`toggle-avail-btn-${dish.id}`}
                        onClick={() => handleToggleAvailability(dish.id)}
                        className={`flex items-center gap-1.5 py-1.5 px-3 rounded-sm text-[9px] uppercase tracking-wider font-semibold transition-all border cursor-pointer ${
                          dish.available
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}
                        title="Habilitar/deshabilitar de la tienda instantáneamente"
                      >
                        {dish.available ? <Check size={11} /> : <X size={11} />}
                        <span>{dish.available ? 'En Tienda' : 'Agotado'}</span>
                      </button>

                      {/* Deletion Button */}
                      <button
                        id={`delete-dish-btn-${dish.id}`}
                        onClick={() => handleDeleteDish(dish.id)}
                        className="p-1.5 text-editorial-cream/40 hover:text-red-400 hover:bg-editorial-slate rounded transition-colors cursor-pointer"
                        title="Eliminar del menú"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------
          SUB_FLOW 3: BOOKINGS MANAGER
        ------------------------------------------------------------------ */}
        {activeSubTab === 'reservas' && (
          <div className="bg-editorial-slate/20 p-6 sm:p-8 rounded-sm text-left border border-editorial-border space-y-4 animate-fade-in" id="admin-reservas-box">
            <h3 className="font-serif text-lg text-editorial-cream pb-3 border-b border-editorial-border">Planilla de Reservas Activas</h3>
            
            {reservations.length > 0 ? (
              <div className="overflow-x-auto" id="reservations-table-wrapper">
                <table className="w-full text-left font-sans text-xs min-w-max" id="reservations-admin-table">
                  <thead>
                    <tr className="border-b border-editorial-border text-editorial-cream/55 text-[9px] uppercase tracking-wider font-semibold">
                      <th className="py-3 px-2">Código</th>
                      <th className="py-3 px-2">Comensal</th>
                      <th className="py-3 px-2">Fecha y Hora</th>
                      <th className="py-3 px-2">Pax</th>
                      <th className="py-3 px-2">Requerimientos</th>
                      <th className="py-3 px-2">Estado</th>
                      <th className="py-3 px-2 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-editorial-border-light text-editorial-cream/90">
                    {reservations.map((res) => (
                      <tr key={res.id} id={`admin-res-row-${res.id}`} className="hover:bg-editorial-slate/10">
                        <td className="py-3 px-2 text-editorial-cream/40 font-mono text-[10px] uppercase">#{res.id}</td>
                        <td className="py-3 px-2">
                          <span className="font-serif italic text-sm text-editorial-cream block">{res.name}</span>
                          <span className="text-[10px] text-editorial-cream/40 block mt-0.5">{res.phone}</span>
                          <span className="text-[10px] text-editorial-cream/40 block">{res.email}</span>
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap">
                          <strong className="block text-editorial-cream">{res.date}</strong>
                          <span className="text-[10px] text-editorial-gold block mt-0.5">⌚ {res.time}</span>
                        </td>
                        <td className="py-3 px-2 font-mono text-editorial-cream font-semibold text-center sm:text-left">{res.guests} com.</td>
                        <td className="py-3 px-2 max-w-xs truncate text-[11px] text-editorial-cream/60 italic" title={res.specialRequests || 'Ninguna'}>
                          {res.specialRequests || 'Ninguna'}
                        </td>
                        <td className="py-2 px-2">
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border ${
                            res.status === 'pendiente' ? 'bg-editorial-gold/10 border-editorial-gold/30 text-editorial-gold' :
                            res.status === 'confirmada' ? 'bg-emerald-505/10 border-emerald-500/30 text-emerald-400' :
                            'bg-red-505/10 border-red-500/30 text-red-400'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {res.status !== 'confirmada' && (
                              <button
                                id={`approve-res-btn-${res.id}`}
                                onClick={() => handleUpdateResStatus(res.id, 'confirmada')}
                                className="p-1 bg-emerald-600 hover:bg-emerald-505 text-editorial-cream rounded-sm transition-colors cursor-pointer"
                                title="Confirmar"
                              >
                                <Check size={11} />
                              </button>
                            )}
                            {res.status !== 'cancelada' && (
                              <button
                                id={`cancel-res-btn-${res.id}`}
                                onClick={() => handleUpdateResStatus(res.id, 'cancelada')}
                                className="p-1 bg-red-650 hover:bg-red-505 text-editorial-cream rounded-sm transition-colors cursor-pointer"
                                title="Declinar / Cancelar"
                              >
                                <X size={11} />
                              </button>
                            )}
                            <button
                              id={`delete-res-btn-${res.id}`}
                              onClick={() => handleDeleteReservation(res.id)}
                              className="p-1 text-editorial-cream/40 hover:text-red-400 transition-colors cursor-pointer ml-1"
                              title="Borrar registro"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-editorial-slate/50 border border-editorial-border text-editorial-cream/50 text-xs">
                No se registran solicitudes de reservas en el momento.
              </div>
            )}
          </div>
        )}

        {/* -----------------------------------------------------------------
          SUB_FLOW 4: SHOPPING ORDERS DELIVERY MANAGER
        ------------------------------------------------------------------ */}
        {activeSubTab === 'pedidos' && (
          <div className="bg-editorial-slate/20 p-6 sm:p-8 rounded-sm border border-editorial-border text-left space-y-4 animate-fade-in" id="admin-pedidos-box">
            <h3 className="font-serif text-lg text-editorial-cream pb-3 border-b border-editorial-border">Planilla de Pedidos de Domicilio</h3>
            
            {orders.length > 0 ? (
              <div className="space-y-6" id="orders-admin-feed">
                {orders.map((o) => (
                  <div 
                    key={o.id} 
                    id={`admin-order-card-${o.id}`}
                    className="bg-editorial-bg border border-editorial-border p-5 rounded-sm space-y-4 text-left"
                  >
                    {/* Upper tier details */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-editorial-border-light pb-3">
                      <div>
                        <span className="text-[9px] font-mono text-editorial-cream/40 uppercase tracking-widest">Orden #{o.id}</span>
                        <h4 className="font-serif italic text-base text-editorial-cream mt-1">{o.customerName}</h4>
                        <span className="text-[10px] text-editorial-cream/60 block mt-0.5">{o.customerAddress} • Tel: {o.customerPhone}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 text-right">
                        <span className="font-serif italic text-base text-editorial-gold">{formatPrice(o.total)}</span>
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-sm border ${
                          o.status === 'pendiente' ? 'bg-editorial-gold/10 border-editorial-gold/20 text-editorial-gold' :
                          o.status === 'preparando' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                          o.status === 'en_camino' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                          o.status === 'completado' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                          {o.status}
                        </span>
                      </div>
                    </div>

                    {/* Mid tier details showing items */}
                    <div className="bg-editorial-slate/40 p-4 rounded-sm text-xs space-y-1.5 text-editorial-cream/70 border border-editorial-border-light" id={`order-items-${o.id}`}>
                      {o.items.map((it, itemIdx) => (
                        <div key={itemIdx} className="flex justify-between font-sans">
                          <span>{it.quantity}x {it.name}</span>
                          <span className="font-serif italic text-editorial-cream">{formatPrice(it.price * it.quantity)}</span>
                        </div>
                      ))}
                      {o.notes && (
                        <p className="mt-3 text-[10px] italic text-editorial-cream/40 border-t border-editorial-border-light pt-2 leading-relaxed">
                          📌 Notas Especiales: &quot;{o.notes}&quot;
                        </p>
                      )}
                    </div>

                    {/* Status controllers */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <span className="text-[10px] text-editorial-cream/40 font-mono">PAGO: {o.paymentMethod.toUpperCase()}</span>
                      
                      <div className="flex items-center gap-2">
                        <select
                          id={`change-order-status-select-${o.id}`}
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as Order['status'])}
                          className="px-2.5 py-1.5 bg-editorial-slate border border-editorial-border text-editorial-cream rounded-sm text-[10px] uppercase tracking-wider font-semibold focus:outline-none"
                        >
                          <option value="pendiente" className="bg-editorial-dark text-editorial-cream">Pendiente</option>
                          <option value="preparando" className="bg-editorial-dark text-editorial-cream">En Cocina</option>
                          <option value="en_camino" className="bg-editorial-dark text-editorial-cream">En Domicilio</option>
                          <option value="completado" className="bg-editorial-dark text-editorial-cream">Completado</option>
                          <option value="cancelado" className="bg-editorial-dark text-editorial-cream">Cancelado</option>
                        </select>

                        <button
                          id={`delete-order-btn-${o.id}`}
                          onClick={() => handleDeleteOrder(o.id)}
                          className="p-1.5 text-editorial-cream/40 hover:text-red-400 rounded-sm transition-colors cursor-pointer"
                          title="Eliminar de bitácora"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-editorial-slate/50 border border-editorial-border text-editorial-cream/50 text-xs text-left sm:text-center">
                No se registran solicitudes de envío de compras online en el momento.
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
