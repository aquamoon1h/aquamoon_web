# aquamoon — Web de astrología (autoindagación)

Prototipo funcional completo (HTML/CSS/JS estático). Pensado para revisarlo tal cual en el navegador y, después de tu aprobación de contenidos y precios, migrarlo a un stack con backend real para reservas/pagos.

## Cómo verlo
Abre `index.html` en el navegador (o sirve la carpeta con cualquier servidor estático). Todas las páginas funcionan entre sí con navegación real.

## Cómo cambiar el nombre de marca / colores más adelante
Un único punto de cambio:
- **Nombre y textos de marca:** `js/data.js` → objeto `SITE` (nombre, tagline, email, redes).
- **Colores y tipografías:** `css/style.css` → variables en `:root` (`--c-violet`, `--c-aquarius`, `--f-display`, etc.).
- **Consultas, precios, libros, productos, posts, FAQ:** todo vive en `js/data.js`. Cambiar un precio o texto no toca ningún HTML.

Las 6 páginas individuales de consulta (todas menos "Luna", que se hizo a mano como plantilla) están generadas automáticamente desde `data.js` con `generate-consultas.js` — si cambias la estructura de una consulta, puedes volver a ejecutar `node generate-consultas.js` para regenerarlas todas.

---

## A. Concepto creativo
El eje de todo el proyecto es: *"la astrología no viene a decirte quién eres, viene a ayudarte a mirarte"*. Cada texto, cada CTA y cada sección evita el lenguaje predictivo ("te va a pasar", "descubre tu destino") y usa lenguaje de observación ("podemos explorar", "qué parte de ti aparece"). El recorrido de consultas por niveles (Luminarias → Planetas personales → Júpiter/Saturno → Transgeneracionales → Nodos → Lectura completa) traduce visualmente la idea de que el autoconocimiento es progresivo, no un todo-o-nada.

## B. Dirección artística
Serif editorial (**Fraunces**, con cursiva) + sans (**Inter**). Elemento firma: círculos concéntricos finos tipo carta astral/astrolabio, sin relleno, usados en el hero, separadores y hovers — evita lunas/estrellas literales y conecta visualmente con "mapa simbólico" sin caer en estética de tarot.

## C. Paleta
`#FAF8F4` crema · `#F3EEF8` lavanda · `#ECF1F3` niebla azul (Acuario) · `#7C6A94` violeta (color primario) · `#6C86A0` azul grisáceo (Acuario) · `#33283F` ciruela oscura (contraste Escorpio, uso puntual, nunca como fondo dominante) · `#B9A26B` dorado apagado (mínimo, solo acentos).

## D. Tipografías
Fraunces (display, títulos, citas de filosofía) + Inter (cuerpo, UI, formularios).

## E. Arquitectura de navegación
Inicio · Consultas · Tienda · Sobre mí · Blog · FAQ · Contacto + CTA fijo "Reservar consulta" (visible en el header en desktop, y como barra inferior sticky en móvil tras pasar el hero).

## F. Recorrido del usuario
Descubrir (Home) → Comprender (filosofía + "qué podemos explorar") → Explorar (página de consulta individual) → Reservar (flujo de reserva). Los CTA de compra no aparecen hasta que la persona ya ha entendido el enfoque — el primer botón del hero lleva a "conocer el enfoque", no a "comprar".

## G. Estructura de Home
Hero → Frase filosofía → "La astrología como espejo" → Recorrido de consultas (niveles) → Cómo trabajo (3 pasos) → Sobre mí (resumen) → Consulta destacada (Lectura completa) → Tienda (preview) → Blog (preview) → FAQ breve → CTA final → Footer. (Orden ligeramente ajustado respecto al propuesto: adelanté "Cómo trabajo" antes de "Sobre mí" para que la persona entienda el método antes de conocer a la persona — mejora la conexión con el enfoque antes de personalizar.)

## H. Estructura de Consultas
Página listado (`consultas.html`) con las 7 tarjetas + explicación del proceso de reserva → páginas individuales (`consulta-*.html`) con la estructura completa que pediste (qué es / qué representa / qué exploramos / preguntas / para quién / cómo funciona / qué recibes / duración / precio / reservar).

## I. Estructura de Tienda
Dos bloques: Libros (afiliación Amazon, con filtro por categoría y aviso de afiliación visible) y Productos propios (con carrito preparado a nivel de interfaz — el checkout real requiere backend, ver sección K/L).

## J. Recomendación tecnológica
Comparativa breve:

| Opción | Ventajas | Inconvenientes | Coste aprox. | Mantenimiento |
|---|---|---|---|---|
| **Webflow / Framer** | Visual, rápido de lanzar, hosting incluido | Menos control fino, ecommerce/reservas limitados sin apps de terceros | ~20–40 €/mes | Bajo, pero dependes de la plataforma |
| **WordPress + WooCommerce** | Ecosistema enorme de plugins (reservas, afiliación, SEO) | Requiere mantenimiento de plugins/seguridad, puede ir lento si no se cuida | ~10–25 €/mes hosting + plugins puntuales | Medio |
| **Next.js (React) + CMS headless (Sanity/Contentful) + Stripe** | Muy rápido, control total, excelente SEO técnico, escala bien a cursos/membresía futuros | Requiere developer para cambios estructurales (no solo de contenido) | ~0–20 €/mes hosting (Vercel) + CMS gratis en plan básico | Medio-alto sin ayuda técnica |
| **Estático (este prototipo) + Airtable/Notion como "CMS"** | Rapidísimo, barato, cero mantenimiento de servidor | Reservas/pagos necesitan integrarse con servicios externos (no hay backend propio) | Prácticamente 0 | Bajo |

**Recomendación:** para esta fase (proyecto personal, empezando, sin equipo técnico permanente), **Next.js + Stripe + un CMS headless sencillo (o el propio `data.js` mientras el catálogo sea pequeño)**, desplegado en Vercel. Es rápido, gratuito para empezar, con muy buen SEO, y no te ata a una plataforma cerrada tipo Webflow. Cuando el proyecto crezca (cursos, membresía), este stack escala sin rehacer nada. La alternativa más sencilla de mantener sin developer sería WordPress + WooCommerce + plugin de reservas (Amelia/Bookly) — más rápido de operar tú misma, algo más pesado técnicamente.

Este prototipo entregado ya sigue la misma filosofía de "contenido separado del diseño" (`data.js`), por lo que migrar a Next.js más adelante es, sobre todo, trasladar ese archivo a un CMS y reutilizar el sistema de diseño (`style.css`) tal cual.

## K. Sistema de reservas
Flujo implementado en `reserva.html` (elegir consulta → fecha → hora → formulario previo → resumen/pago → confirmación). Actualmente la disponibilidad de fechas/horas es de ejemplo (front-end). Para producción:
- **Google Calendar API** para leer/bloquear disponibilidad real.
- **Google Meet** generado automáticamente al crear el evento (a través de Calendar API con `conferenceData`).
- Servicio de email transaccional (p. ej. Resend, Postmark o el propio Gmail API) para: confirmación, recordatorio 24h antes, cancelación, reprogramación.

## L. Sistema de pagos
El botón "Confirmar y pagar" está preparado como punto de integración único. Recomendado: **Stripe Checkout** (soporta tarjeta, Bizum vía proveedores locales, y factura automática), por su sencillez de integración y buen soporte en español/UE.

## M. Estrategia SEO
Implementado en esta versión: metatítulos y meta descriptions únicos por página, URLs limpias, jerarquía H1 única por página con H2/H3 estructurados, `schema.org` (Service en consultas, FAQPage en FAQ), Open Graph básico, `robots.txt` y `sitemap.xml`. Palabras clave objetivo integradas de forma natural (no forzada): consulta de astrología, carta natal, astrología kármica, psicoastrología, astróloga online — repartidas por Home, Consultas y Blog, sin limitarse a una ubicación geográfica.

## N. Estrategia de contenidos
El blog cubre intención informativa (qué es una carta natal, qué representa cada planeta) que alimenta el funnel hacia las consultas del mismo tema — cada artículo cierra con un CTA a la consulta relacionada. Categorías ya preparadas: Astrología, Autoconocimiento, Astrología Kármica, Terapia Transpersonal, Planetas, Casas, Signos, Nodos, Carta Natal.

## O. Propuesta de precios iniciales — justificación
Planteamiento: precios **accesibles pero profesionales**, ni low-cost ni premium, coherentes con una profesional que empieza pero ya tiene formación específica (psicoastrología kármica + terapia transpersonal).

| Consulta | Duración | Precio propuesto |
|---|---|---|
| Sol, Luna y Ascendente | 60 min | 55 € |
| Consulta de Luna | 60 min | 55 € |
| Mercurio, Venus y Marte | 60 min | 65 € |
| Júpiter y Saturno | 60 min | 65 € |
| Transgeneracionales (Plutón, Urano, Neptuno) | 60 min | 70 € |
| Nodos + Parte de Fortuna | 60 min | 65 € |
| Lectura de Carta Natal Completa | 90 min | 110 € |

Razonamiento: en el mercado hispanohablante de astrología online, una consulta de 60 min con una profesional formada suele moverse entre 45–90 €; posicionar la entrada (Luminarias) en 55 € comunica profesionalidad sin ser una barrera para quien prueba por primera vez. Los niveles siguientes suben ligeramente (65–70 €) reflejando mayor profundidad simbólica, no solo más tiempo. La Lectura Completa a 110 € por 90 min mantiene un precio por minuto coherente con el resto (no es una tarifa "premium" desproporcionada) y funciona como ancla de valor del catálogo. **Estos precios son un punto de partida editable en un segundo (`js/data.js`) — te recomiendo validarlos con tus primeras clientas y ajustarlos cada 3-6 meses según demanda.**

## P. Preguntas para ti (antes de pasar a producción real)
1. ¿Confirmas los precios propuestos o quieres ajustarlos antes de que los use como definitivos en las metadescripciones/schema?
2. ¿Tienes ya cuenta de Google Workspace (para Calendar/Meet API) o prefieres empezar con Calendly/similar como intermediario más simple?
3. ¿Prefieres Stripe u otro proveedor de pago (Redsys, PayPal) para el mercado español/LATAM?
4. ¿Ya tienes fotografías/imágenes propias, o seguimos con las formas geométricas abstractas actuales hasta que las tengas?
5. ¿Quieres que prepare ya los 12 artículos de blog listados en tu brief con contenido completo, o prefieres ir aprobándolos de uno en uno?
6. ¿Confirmas "aquamoon" como nombre visible por ahora, o prefieres ya un placeholder distinto mientras decides el naming definitivo?

---

## Notas de accesibilidad y responsive ya implementadas
- Foco visible en todos los elementos interactivos, `skip-link`, contraste AA en textos sobre fondos claros y oscuros.
- `prefers-reduced-motion` respetado (desactiva animaciones si el sistema lo pide).
- Menú y formularios usables por teclado; navegación móvil con botón accesible (`aria-expanded`).
- Mobile-first: grids colapsan a una columna, sticky CTA solo en móvil, tipografía fluida con `clamp()`.

## Pendiente para producción (no implementado, solo preparado)
- Integración real de Google Calendar/Meet, Stripe, y envío de emails transaccionales.
- Revisión legal profesional de las 5 páginas en `/legal` (son plantillas de partida, marcadas `noindex`).
- Imágenes/fotografía propia (se usaron formas geométricas SVG como placeholder respetando la dirección de arte).
