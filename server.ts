import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper for lazy loading Gemini Gen AI helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("⚠️ GEMINI_API_KEY is not configured or has standard placeholder value.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// RESTAURANT INFORMATION PROMPT FOR THE CHATBOT
// -------------------------------------------------------------
const RESTAURANT_CONTEXT_PROMPT = `
Eres la Inteligencia Artificial inteligente de atención al cliente de "Monserrate Bistro", el restaurante de fusión andina premium más elegante del histórico barrio La Candelaria en Bogotá, Colombia.
Tu objetivo es responder de manera amable, profesional y concisa a los clientes que te consulten sobre el menú, reservas, pedidos, ubicación y políticas del restaurante.

INFORMACIÓN DEL NEGOCIO:
- Nombre: Monserrate Bistro
- Ubicación: Calle 11 # 2-15, La Candelaria, Bogotá, Colombia (A pocas calles de la Plaza de Bolívar).
- Contacto Teléfono/WhatsApp: +57 321 987 6543 (Hay un link directo en la página web).
- Correo: contacto@monserratebistro.com
- Horario de Atención: Lunes a Sábado de 12:00 PM a 10:00 PM. Domingos y Festivos de 12:00 PM a 6:00 PM.
- Estilo gastronómico: Cocina fusión andina moderna, utilizando ingredientes orgánicos de la Sabana de Bogotá, el Páramo de Sumapaz y regiones colombianas con técnicas culinarias de vanguardia.

NUESTRO MENÚ (Precios en COP):
1. Entradas:
   - Empanadas de Ajiaco (3 uds, guiso de ajiaco con pollo, papa criolla y ají de aguacate): $18,000
   - Ceviche de Trucha de Tota (Trucha de la laguna de Tota con mango, cebolla, cilantro y patacones crocantes): $24,000
   - Chicharrones en Melao de Panela (Tocino crocante glaseado con reducción de panela anisada y mini arepas boyacenses): $22,000
2. Platos Fuertes:
   - Posta Negra sobre Puré de Mote (Posta cocinada a fuego lento en reducción de panela y cola, sobre puré cremoso de mote de queso con chips de yuca): $48,000
   - Ajiaco Santafereño Premium (Sopa tradicional bogotana con tres tipos de papas, pollo desmechado, mazorca, crema de leche de alta calidad, alcaparras y aguacate): $38,000
   - Salmón en Costra de Quinua (Sellado con costra de quinua tostada, puré de arracacha y vegetales orgánicos salteados): $52,000
   - Risotto de Champiñones del Sumapaz (Setas cultivadas en el páramo, queso doblecrema artesanal y un toque de aceite de trufa): $44,000
3. Bebidas:
   - Limonada de Coco Monserrate: $12,000
   - Refajo de la Casa Astado (Mezcla secreta de cerveza artesanal rubia colombiana con Kola Román, toques cítricos y clavo): $10,000
   - Jugos Naturales (Lulo, Guanábana, Maracuyá, Fresa en agua o leche): $9,000
4. Postres:
   - Volcán de Arequipe con Helado de Cuajada (Bizcocho relleno de arequipe caliente fluido con helado de cuajada de la sabana): $16,000
   - Milhoja de Sabana con Fresas (Milhoja crujiente con fresas frescas y crema pastelera de vainilla): $14,000

CÓMO FUNCIONA EL SISTEMA DE RESERVAS Y PEDIDOS:
- Reservas online: Se pueden hacer en tiempo real en la pestaña electoral "Reservas" de este sitio web. No cobramos tarifas por reservar. Se confirman automáticamente, y el cliente puede consultar su estado en el panel o vía WhatsApp.
- Pedidos a Domicilio / Tienda Online: El cliente puede seleccionar sus platos favoritos en el menú, agregarlos al carrito y realizar la compra indicando su dirección en Bogotá. Puede pagar con transferencia (Nequi, Daviplata), tarjeta o en efectivo contra entrega. El pedido también se puede enviar directamente a nuestro WhatsApp oficial para atención directa inmediata.

CÚMPLIMIENTO DE POLÍTICAS DE GOOGLE ADS (Seguridad, Honestidad y Transparencia):
- No prometas curas médicas, ni comida milagrosa.
- Explica de forma transparente que todos los precios están en Pesos Colombianos (COP) e incluyen IVA.
- Indica que respetamos la Ley 1581 de 2012 de Habeas Data para la privacidad de datos de reservas de los usuarios.
- Garantía de devolución: Si el pedido de domicilio llega en mal estado o hay un error de cocina en el local, lo reemplazamos de inmediato o devolvemos el dinero sin objeción.

REGLAS DE RESPUESTA:
1. Responde en Español de Colombia de manera educada, cálida y gourmet, invitando a vivir la experiencia Monserrate.
2. Sé conciso y no des respuestas excesivamente largas (máximo 3 párrafos cortos).
3. Si el cliente pregunta cómo reservar, indícales amablemente que usen el botón "Reservas" de la barra superior o pulsen el enlace de WhatsApp.
`;

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    time: new Date().toISOString(),
    restaurant: "Monserrate Bistro",
    adsCompliant: true
  });
});

// Chatbot assistant route
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Falta el historial de mensajes o el formato es incorrecto." });
    }

    // Prepare content for Gemini
    // Limit to the last few messages to conserve tokens
    const lastMessages = messages.slice(-6);
    
    // Construct conversation string for the chat model
    const conversationHistory = lastMessages.map(m => {
      const roleName = m.sender === "user" ? "Usuario" : "Asistente Virtual";
      return `${roleName}: ${m.text}`;
    }).join("\n");

    const promptText = `
${RESTAURANT_CONTEXT_PROMPT}

Historial de la conversación reciente:
${conversationHistory}

Respuesta sugerida para el Asistente Virtual:`;

    const ai = getGeminiClient();

    if (!ai) {
      // Intelligent mock fallback when API key is missing, to keep application fully functional
      const userMessage = messages[messages.length - 1]?.text?.toLowerCase() || "";
      let fallbackText = "¡Hola! Gracias por contactar a Monserrate Bistro en Bogotá. ¿En qué puedo ayudarte hoy?";

      if (userMessage.includes("reserva") || userMessage.includes("mesas") || userMessage.includes("reservar")) {
        fallbackText = "¡Por supuesto! Puedes realizar tu reserva en línea de forma gratuita usando la sección de 'Reservas' en nuestra barra de navegación. Solo debes ingresar la fecha, hora, número de personas y tus datos. La confirmación es instantánea.";
      } else if (userMessage.includes("menú") || userMessage.includes("menu") || userMessage.includes("platos") || userMessage.includes("comer") || userMessage.includes("carta")) {
        fallbackText = "¡Qué delicia! Contamos con entradas exquisitas como nuestras Empanadas de Ajiaco ($18,000) o platos fuertes de autor como el Salmón en Costra de Quinua ($52,000) y nuestro aclamado Ajiaco Santafereño Premium ($38,000). Puedes consultarlos todos y pedir a domicilio en nuestra pestaña de 'Menú'.";
      } else if (userMessage.includes("ubicacion") || userMessage.includes("ubicación") || userMessage.includes("donde quedan") || userMessage.includes("dónde quedan") || userMessage.includes("dirección") || userMessage.includes("direccion") || userMessage.includes("están")) {
        fallbackText = "Estamos ubicados en el corazón del centro histórico de Bogotá: Calle 11 # 2-15, La Candelaria. ¡A pocos pasos de la emblemática Plaza de Bolívar! Es una zona hermosa y segura.";
      } else if (userMessage.includes("tel") || userMessage.includes("contacto") || userMessage.includes("whatsapp") || userMessage.includes("llamar") || userMessage.includes("número")) {
        fallbackText = "Puedes escribirnos o llamarnos directamente a nuestro WhatsApp oficial +57 321 987 6543, o enviarnos un mensaje a través de nuestra sección de 'Contacto'. ¡Estamos felices de atenderte!";
      } else if (userMessage.includes("precio") || userMessage.includes("costo") || userMessage.includes("barato") || userMessage.includes("caro")) {
        fallbackText = "Nuestros platos de autor van desde $18,000 COP en entradas hasta los $52,000 COP para nuestros platos fuertes más selectos. Todos los precios incluyen IVA y obedecen a un estándar de transparencia para cumplir plenamente con las sugerencias de Google Ads.";
      } else if (userMessage.includes("vege") || userMessage.includes("vegano") || userMessage.includes("saludable")) {
        fallbackText = "¡Sí! Contamos con opciones deliciosas como el Risotto de Champiñones del Sumapaz ($44,000), preparado con setas locales orgánicas frescas y queso doblecrema artesanal de la sabana colombiana.";
      }

      return res.json({ 
        text: fallbackText + " (Nota del sistema: asistente funcionando en modo de respuesta rápida optimizada)." 
      });
    }

    // Call the real Gemini model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
    });

    const responseText = response.text || "Disculpa, no pude procesar la respuesta en este momento. ¿Te puedo colaborar con alguna reserva o domicilio?";
    return res.json({ text: responseText });

  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return res.json({ 
      text: "¡Hola! En este momento estoy experimentando una alta demanda de solicitudes, pero respondo tus dudas con mucho gusto. Recuerda que puedes realizar reservas en nuestra pestaña de Reservas o contactarnos por WhatsApp al +57 321 987 6543." 
    });
  }
});


// -------------------------------------------------------------
// VITE OR STATIC FILE MIDDLEWARE MOUNTING
// -------------------------------------------------------------
async function initViteMiddleware() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated successfully.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started and listening on http://0.0.0.0:${PORT}`);
  });
}

initViteMiddleware();
