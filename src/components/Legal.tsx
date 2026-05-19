import React from 'react';
import { RestaurantConfig } from '../types';

interface LegalProps {
  mode: 'privacy' | 'terms';
  config: RestaurantConfig;
}

export default function Legal({ mode, config }: LegalProps) {
  if (mode === 'privacy') {
    return (
      <div className="text-editorial-cream/80 text-xs font-sans space-y-4 leading-relaxed max-h-96 overflow-y-auto pr-2 scrollbar-thin text-left">
        <h3 className="font-serif italic text-base text-editorial-gold mb-4 border-b border-editorial-border-light pb-2">
          POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES (HABEAS DATA)
        </h3>
        <p className="font-semibold text-editorial-gold">Responsable de Datos: {config.name} S.A.S.</p>
        <p>
          En cumplimiento de la <strong>Ley 1581 de 2012 de la República de Colombia</strong> y su Decreto Reglamentario 1377 de 2013, 
          <strong> {config.name}</strong> informa a los usuarios y clientes sobre las políticas adoptadas para el tratamiento, recolección 
          y protección de datos personales de manera voluntaria en nuestro sitio web oficial.
        </p>

        <h4 className="font-serif italic text-sm text-editorial-cream mt-4">1. Finalidad del Tratamiento de Datos</h4>
        <p>
          Los datos que usted suministra (Nombre, Email, Teléfono/Celular, Direcciones de entrega o notas de reserva) serán tratados única y 
          exclusivamente para:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-[11px] text-editorial-cream/60">
          <li>Gestionar y confirmar de forma gratuita las reservas de mesas en el restaurante físico localizado en Bogotá.</li>
          <li>Despachar y coordinar los domicilios de platos de comida solicitados en nuestra Tienda Online.</li>
          <li>Enviar confirmaciones e informaciones sobre el estado de sus pedidos mediante canales digitales como WhatsApp o Correo.</li>
          <li>Atender quejas, sugerencias o dudas nutricionales a través del chatbot de Inteligencia Artificial integrado.</li>
        </ul>

        <h4 className="font-serif italic text-sm text-editorial-cream mt-4">2. Derechos de los Titulares del Dato</h4>
        <p>
          De acuerdo con el Artículo 8 de la Ley 1581 de 2012, usted, como titular de los datos recolectados, goza de los siguientes derechos fundamentales:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-[11px] text-editorial-cream/60">
          <li>Conocer, actualizar y rectificar sus datos personales frente a {config.name} S.A.S. en cualquier momento.</li>
          <li>Solicitar la prueba de la autorización otorgada por el canal web.</li>
          <li>Ser informado respecto del uso específico que se le ha dado a sus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la Ley de Datos.</li>
          <li>Revocar la autorización o solicitar la eliminación definitiva del dato cuando considere que no se respetan las garantías.</li>
        </ul>

        <h4 className="font-serif italic text-sm text-editorial-cream mt-4">3. Canales para el Ejercicio de sus Derechos</h4>
        <p>
          Si desea consultar, actualizar, rectificar o eliminar su historial de reservas o compras personales en nuestra base de datos local, 
          puede escribir directamente a nuestro correo oficial de auditoría: <strong>{config.email}</strong> o comunicarse llamando al 
          fijo <strong>{config.phone}</strong>. Nuestro Oficial de Privacidad le responderá en un plazo máximo de cinco (5) días hábiles.
        </p>
        
        <p className="text-[10px] text-editorial-cream/40 italic mt-6">
          Última actualización legal de políticas: Mayo de 2026. Conforme a las circulares de la SIC y Google Ads.
        </p>
      </div>
    );
  }

  // Terms and conditions view
  return (
    <div className="text-editorial-cream/80 text-xs font-sans space-y-4 leading-relaxed max-h-96 overflow-y-auto pr-2 scrollbar-thin text-left">
      <h3 className="font-serif italic text-base text-editorial-gold mb-4 border-b border-editorial-border-light pb-2">
        TÉRMINOS, CONDICIONES & GARANTÍAS DE SERVICIO
      </h3>
      <p>
        Bienvenido al portal oficial de <strong>{config.name}</strong>. Al utilizar nuestras funciones de reservas online de mesas, 
        catálogo de cartas digitales o tienda de pedidos para domicilio, usted acepta plenamente los términos descritos a continuación:
      </p>

      <h4 className="font-serif italic text-sm text-editorial-cream mt-4">1. Gratuidad del Sistema de Reservaciones</h4>
      <p>
        El sistema de reservas online es un servicio complementario y 100% gratuito. {config.name} <strong>nunca le exigirá</strong> que 
        realice pagos anticipados, ni proporcione su número de tarjeta de crédito para reservar una mesa estándar en nuestro local en Bogotá. 
        Evite páginas fraudulentas. Las reservas se mantienen activas durante un lapso de gracia de 20 minutos respecto al horario estipulado.
      </p>

      <h4 className="font-serif italic text-sm text-editorial-cream mt-4">2. Transparencia de Precios y Pagos de Tienda</h4>
      <p>
        Todos los precios indicados en nuestro menú se expresan en <strong>Pesos Colombianos (COP)</strong> e incluyen todos los impuestos locales, 
        como el Impuesto Nacional al Consumo (Ipoconsumo) o IVA, según corresponda. El costo del servicio de domicilio es gratuito dentro de 
        la zona de cobertura establecida en Bogotá, sin cobros sorpresa o tarifas de servicio engañosas en el checkout.
      </p>

      <h4 className="font-serif italic text-sm text-[#C5A059] mt-4">3. Políticas de Reembolsos y Devolución del Dinero</h4>
      <p>
        En cumplimiento con el Estatuto de Protección al Consumidor en Colombia (Ley 1480 de 2011), ofrecemos una política garantizada 
        de devolución:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-[11px] text-editorial-cream/60">
        <li>Si su comida solicitada a domicilio llega en mal estado o incompleta, nos comprometemos a reemplazarla en menos de 45 minutos.</li>
        <li>Si decide cancelar su pedido de domicilio, puede hacerlo sin penalidad alguna en los primeros 10 minutos posteriores al envío, llamando directamente a nuestro número corporativo.</li>
        <li>En caso de fallos graves en la comida o insatisfacción profunda sustentada, se procesará un reembolso directo total de su transferencia en un lapso máximo de 48 horas laborales.</li>
      </ul>

      <h4 className="font-serif italic text-sm text-editorial-cream mt-4">4. Limitación de Responsabilidad</h4>
      <p>
        {config.name} S.A.S. se reserva el derecho de rechazar reservas de mesas en lapsos de alta congestión o fuerza mayor técnica. 
        No nos responsabilizamos de su conexión de internet para completar el proceso de reservas. 
      </p>

      <p className="text-[10px] text-editorial-cream/40 italic mt-6">
        Estas condiciones garantizan una navegación transparente y segura para los visitantes procedentes de Google Ads.
      </p>
    </div>
  );
}
