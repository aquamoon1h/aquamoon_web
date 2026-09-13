/* ==========================================================================
   aquamoon — Fuente única de contenido
   Cambia aquí el nombre de marca, precios, consultas, libros, productos...
   sin tocar el HTML ni el resto del código.
   ========================================================================== */

const SITE = {
  brandName: "aquamoon",
  tagline: "Psicoastrología kármica + terapia transpersonal",
  philosophy: "Uso la astrología como herramienta de autoindagación, no como una sentencia sobre tu vida.",
  email: "aquamoon1h@gmail.com",
  whatsapp: "https://wa.me/34601110915",
  instagram: "https://www.instagram.com/aquamoon1h/",
  bookingBase: "consultas.html", // enlace base de "Reservar consulta"
  location: "Consultas online (Google Meet) — para cualquier país hispanohablante",
};

/* Ciudades para el autocompletado de "Lugar de nacimiento" (reserva y carta natal).
   Cada entrada trae latitud/longitud y la zona horaria IANA (necesaria para calcular
   el huso horario histórico correcto, con sus cambios de hora de verano incluidos,
   usando Intl.DateTimeFormat — ver js/astro-calc.js). Lista orientativa (España
   completa + Latinoamérica + algunas capitales internacionales), ampliable. */
const CIUDADES = [
  { name: "Madrid, España", lat: 40.4168, lon: -3.7038, tz: "Europe/Madrid" },
  { name: "Barcelona, España", lat: 41.3851, lon: 2.1734, tz: "Europe/Madrid" },
  { name: "Valencia, España", lat: 39.4699, lon: -0.3763, tz: "Europe/Madrid" },
  { name: "Sevilla, España", lat: 37.3891, lon: -5.9845, tz: "Europe/Madrid" },
  { name: "Zaragoza, España", lat: 41.6488, lon: -0.8891, tz: "Europe/Madrid" },
  { name: "Málaga, España", lat: 36.7213, lon: -4.4214, tz: "Europe/Madrid" },
  { name: "Murcia, España", lat: 37.9922, lon: -1.1307, tz: "Europe/Madrid" },
  { name: "Palma de Mallorca, España", lat: 39.5696, lon: 2.6502, tz: "Europe/Madrid" },
  { name: "Las Palmas de Gran Canaria, España", lat: 28.1235, lon: -15.4363, tz: "Atlantic/Canary" },
  { name: "Santa Cruz de Tenerife, España", lat: 28.4636, lon: -16.2518, tz: "Atlantic/Canary" },
  { name: "Bilbao, España", lat: 43.2630, lon: -2.9350, tz: "Europe/Madrid" },
  { name: "Alicante, España", lat: 38.3452, lon: -0.4810, tz: "Europe/Madrid" },
  { name: "Córdoba, España", lat: 37.8882, lon: -4.7794, tz: "Europe/Madrid" },
  { name: "Valladolid, España", lat: 41.6523, lon: -4.7245, tz: "Europe/Madrid" },
  { name: "Vigo, España", lat: 42.2406, lon: -8.7207, tz: "Europe/Madrid" },
  { name: "Gijón, España", lat: 43.5322, lon: -5.6611, tz: "Europe/Madrid" },
  { name: "A Coruña, España", lat: 43.3623, lon: -8.4115, tz: "Europe/Madrid" },
  { name: "Granada, España", lat: 37.1773, lon: -3.5986, tz: "Europe/Madrid" },
  { name: "San Sebastián, España", lat: 43.3183, lon: -1.9812, tz: "Europe/Madrid" },
  { name: "Pamplona, España", lat: 42.8125, lon: -1.6458, tz: "Europe/Madrid" },
  { name: "Santander, España", lat: 43.4623, lon: -3.8099, tz: "Europe/Madrid" },
  { name: "Toledo, España", lat: 39.8628, lon: -4.0273, tz: "Europe/Madrid" },
  { name: "Salamanca, España", lat: 40.9701, lon: -5.6635, tz: "Europe/Madrid" },
  { name: "Cádiz, España", lat: 36.5297, lon: -6.2926, tz: "Europe/Madrid" },
  { name: "Almería, España", lat: 36.8340, lon: -2.4637, tz: "Europe/Madrid" },
  { name: "Oviedo, España", lat: 43.3603, lon: -5.8448, tz: "Europe/Madrid" },
  { name: "Logroño, España", lat: 42.4627, lon: -2.4449, tz: "Europe/Madrid" },
  { name: "Badajoz, España", lat: 38.8794, lon: -6.9707, tz: "Europe/Madrid" },
  { name: "Cáceres, España", lat: 39.4753, lon: -6.3724, tz: "Europe/Madrid" },
  { name: "Albacete, España", lat: 38.9943, lon: -1.8585, tz: "Europe/Madrid" },
  { name: "Castellón de la Plana, España", lat: 39.9864, lon: -0.0513, tz: "Europe/Madrid" },
  { name: "Burgos, España", lat: 42.3439, lon: -3.6969, tz: "Europe/Madrid" },
  { name: "León, España", lat: 42.5987, lon: -5.5671, tz: "Europe/Madrid" },
  { name: "Girona, España", lat: 41.9794, lon: 2.8214, tz: "Europe/Madrid" },
  { name: "Tarragona, España", lat: 41.1189, lon: 1.2445, tz: "Europe/Madrid" },
  { name: "Lleida, España", lat: 41.6176, lon: 0.6200, tz: "Europe/Madrid" },
  { name: "Huesca, España", lat: 42.1401, lon: -0.4089, tz: "Europe/Madrid" },
  { name: "Teruel, España", lat: 40.3456, lon: -1.1065, tz: "Europe/Madrid" },
  { name: "Guadalajara, España", lat: 40.6333, lon: -3.1669, tz: "Europe/Madrid" },
  { name: "Cuenca, España", lat: 40.0704, lon: -2.1374, tz: "Europe/Madrid" },
  { name: "Ciudad Real, España", lat: 38.9848, lon: -3.9274, tz: "Europe/Madrid" },
  { name: "Jaén, España", lat: 37.7796, lon: -3.7849, tz: "Europe/Madrid" },
  { name: "Huelva, España", lat: 37.2614, lon: -6.9447, tz: "Europe/Madrid" },
  { name: "Ourense, España", lat: 42.3358, lon: -7.8639, tz: "Europe/Madrid" },
  { name: "Lugo, España", lat: 43.0121, lon: -7.5559, tz: "Europe/Madrid" },
  { name: "Pontevedra, España", lat: 42.4310, lon: -8.6444, tz: "Europe/Madrid" },
  { name: "Segovia, España", lat: 40.9429, lon: -4.1088, tz: "Europe/Madrid" },
  { name: "Ávila, España", lat: 40.6565, lon: -4.6818, tz: "Europe/Madrid" },
  { name: "Zamora, España", lat: 41.5033, lon: -5.7446, tz: "Europe/Madrid" },
  { name: "Palencia, España", lat: 42.0096, lon: -4.5288, tz: "Europe/Madrid" },
  { name: "Soria, España", lat: 41.7636, lon: -2.4649, tz: "Europe/Madrid" },
  { name: "Ceuta, España", lat: 35.8894, lon: -5.3213, tz: "Africa/Ceuta" },
  { name: "Melilla, España", lat: 35.2923, lon: -2.9381, tz: "Africa/Ceuta" },
  { name: "Ciudad de México, México", lat: 19.4326, lon: -99.1332, tz: "America/Mexico_City" },
  { name: "Guadalajara, México", lat: 20.6597, lon: -103.3496, tz: "America/Mexico_City" },
  { name: "Monterrey, México", lat: 25.6866, lon: -100.3161, tz: "America/Monterrey" },
  { name: "Puebla, México", lat: 19.0414, lon: -98.2063, tz: "America/Mexico_City" },
  { name: "Tijuana, México", lat: 32.5149, lon: -117.0382, tz: "America/Tijuana" },
  { name: "Mérida, México", lat: 20.9674, lon: -89.5926, tz: "America/Merida" },
  { name: "Cancún, México", lat: 21.1619, lon: -86.8515, tz: "America/Cancun" },
  { name: "León, México", lat: 21.1250, lon: -101.6860, tz: "America/Mexico_City" },
  { name: "Querétaro, México", lat: 20.5888, lon: -100.3899, tz: "America/Mexico_City" },
  { name: "San Luis Potosí, México", lat: 22.1565, lon: -100.9855, tz: "America/Mexico_City" },
  { name: "Buenos Aires, Argentina", lat: -34.6037, lon: -58.3816, tz: "America/Argentina/Buenos_Aires" },
  { name: "Córdoba, Argentina", lat: -31.4201, lon: -64.1888, tz: "America/Argentina/Cordoba" },
  { name: "Rosario, Argentina", lat: -32.9468, lon: -60.6393, tz: "America/Argentina/Cordoba" },
  { name: "Mendoza, Argentina", lat: -32.8895, lon: -68.8458, tz: "America/Argentina/Mendoza" },
  { name: "La Plata, Argentina", lat: -34.9215, lon: -57.9545, tz: "America/Argentina/Buenos_Aires" },
  { name: "Salta, Argentina", lat: -24.7859, lon: -65.4117, tz: "America/Argentina/Salta" },
  { name: "Tucumán, Argentina", lat: -26.8083, lon: -65.2176, tz: "America/Argentina/Tucuman" },
  { name: "Bogotá, Colombia", lat: 4.7110, lon: -74.0721, tz: "America/Bogota" },
  { name: "Medellín, Colombia", lat: 6.2442, lon: -75.5812, tz: "America/Bogota" },
  { name: "Cali, Colombia", lat: 3.4516, lon: -76.5320, tz: "America/Bogota" },
  { name: "Cartagena, Colombia", lat: 10.3910, lon: -75.4794, tz: "America/Bogota" },
  { name: "Barranquilla, Colombia", lat: 10.9639, lon: -74.7964, tz: "America/Bogota" },
  { name: "Bucaramanga, Colombia", lat: 7.1193, lon: -73.1227, tz: "America/Bogota" },
  { name: "Lima, Perú", lat: -12.0464, lon: -77.0428, tz: "America/Lima" },
  { name: "Arequipa, Perú", lat: -16.4090, lon: -71.5375, tz: "America/Lima" },
  { name: "Cusco, Perú", lat: -13.5319, lon: -71.9675, tz: "America/Lima" },
  { name: "Trujillo, Perú", lat: -8.1116, lon: -79.0290, tz: "America/Lima" },
  { name: "Santiago, Chile", lat: -33.4489, lon: -70.6693, tz: "America/Santiago" },
  { name: "Valparaíso, Chile", lat: -33.0472, lon: -71.6127, tz: "America/Santiago" },
  { name: "Concepción, Chile", lat: -36.8201, lon: -73.0444, tz: "America/Santiago" },
  { name: "Antofagasta, Chile", lat: -23.6509, lon: -70.3975, tz: "America/Santiago" },
  { name: "Caracas, Venezuela", lat: 10.4806, lon: -66.9036, tz: "America/Caracas" },
  { name: "Maracaibo, Venezuela", lat: 10.6427, lon: -71.6125, tz: "America/Caracas" },
  { name: "Valencia, Venezuela", lat: 10.1620, lon: -68.0077, tz: "America/Caracas" },
  { name: "Quito, Ecuador", lat: -0.1807, lon: -78.4678, tz: "America/Guayaquil" },
  { name: "Guayaquil, Ecuador", lat: -2.1894, lon: -79.8891, tz: "America/Guayaquil" },
  { name: "Cuenca, Ecuador", lat: -2.9001, lon: -79.0059, tz: "America/Guayaquil" },
  { name: "La Paz, Bolivia", lat: -16.5000, lon: -68.1500, tz: "America/La_Paz" },
  { name: "Santa Cruz de la Sierra, Bolivia", lat: -17.7833, lon: -63.1821, tz: "America/La_Paz" },
  { name: "Cochabamba, Bolivia", lat: -17.3895, lon: -66.1568, tz: "America/La_Paz" },
  { name: "Asunción, Paraguay", lat: -25.2637, lon: -57.5759, tz: "America/Asuncion" },
  { name: "Montevideo, Uruguay", lat: -34.9011, lon: -56.1645, tz: "America/Montevideo" },
  { name: "San José, Costa Rica", lat: 9.9281, lon: -84.0907, tz: "America/Costa_Rica" },
  { name: "Panamá, Panamá", lat: 8.9824, lon: -79.5199, tz: "America/Panama" },
  { name: "San Salvador, El Salvador", lat: 13.6929, lon: -89.2182, tz: "America/El_Salvador" },
  { name: "Tegucigalpa, Honduras", lat: 14.0723, lon: -87.1921, tz: "America/Tegucigalpa" },
  { name: "Managua, Nicaragua", lat: 12.1150, lon: -86.2362, tz: "America/Managua" },
  { name: "Guatemala, Guatemala", lat: 14.6349, lon: -90.5069, tz: "America/Guatemala" },
  { name: "Santo Domingo, República Dominicana", lat: 18.4861, lon: -69.9312, tz: "America/Santo_Domingo" },
  { name: "San Juan, Puerto Rico", lat: 18.4655, lon: -66.1057, tz: "America/Puerto_Rico" },
  { name: "La Habana, Cuba", lat: 23.1136, lon: -82.3666, tz: "America/Havana" },
  { name: "São Paulo, Brasil", lat: -23.5505, lon: -46.6333, tz: "America/Sao_Paulo" },
  { name: "Río de Janeiro, Brasil", lat: -22.9068, lon: -43.1729, tz: "America/Sao_Paulo" },
  { name: "Nueva York, Estados Unidos", lat: 40.7128, lon: -74.0060, tz: "America/New_York" },
  { name: "Los Ángeles, Estados Unidos", lat: 34.0522, lon: -118.2437, tz: "America/Los_Angeles" },
  { name: "Miami, Estados Unidos", lat: 25.7617, lon: -80.1918, tz: "America/New_York" },
  { name: "Chicago, Estados Unidos", lat: 41.8781, lon: -87.6298, tz: "America/Chicago" },
  { name: "Houston, Estados Unidos", lat: 29.7604, lon: -95.3698, tz: "America/Chicago" },
  { name: "Londres, Reino Unido", lat: 51.5074, lon: -0.1278, tz: "Europe/London" },
  { name: "París, Francia", lat: 48.8566, lon: 2.3522, tz: "Europe/Paris" },
  { name: "Berlín, Alemania", lat: 52.5200, lon: 13.4050, tz: "Europe/Berlin" },
  { name: "Roma, Italia", lat: 41.9028, lon: 12.4964, tz: "Europe/Rome" },
  { name: "Lisboa, Portugal", lat: 38.7223, lon: -9.1393, tz: "Europe/Lisbon" },
  { name: "Ámsterdam, Países Bajos", lat: 52.3676, lon: 4.9041, tz: "Europe/Amsterdam" },
  { name: "Bruselas, Bélgica", lat: 50.8503, lon: 4.3517, tz: "Europe/Brussels" },
  { name: "Zúrich, Suiza", lat: 47.3769, lon: 8.5417, tz: "Europe/Zurich" },
  { name: "Dublín, Irlanda", lat: 53.3498, lon: -6.2603, tz: "Europe/Dublin" },
  { name: "Andorra la Vella, Andorra", lat: 42.5063, lon: 1.5218, tz: "Europe/Andorra" },
];

/* Estructura de precios — ver README.md para la justificación completa.
   duration en minutos. price en EUR. */
const CONSULTAS = [
  {
    slug: "sol-luna-ascendente",
    nivel: 1,
    tag: "Nivel 1 · Luminarias",
    nombre: "Sol, Luna y Ascendente",
    resumen: "Una primera fotografía de quién eres: tu identidad consciente, tu mundo emocional y cómo te muestras al llegar a un lugar nuevo.",
    exploramos: [
      "Tu Sol: qué te da identidad y vitalidad",
      "Tu Luna: cómo sientes y qué necesitas para sentirte segura/o",
      "Tu Ascendente: cómo llegas al mundo y cómo te perciben"
    ],
    paraQuien: "Ideal si nunca has trabajado con tu carta y quieres una puerta de entrada clara, sin abrumarte.",
    duration: 60,
    price: 55,
    modalidad: "Online — Google Meet",
    recibe: ["Grabación de la sesión", "PDF resumen con las claves de tu Sol, Luna y Ascendente"],
    symbol: "☉ ☽ ↑"
  },
  {
    slug: "luna",
    nivel: 1,
    tag: "Nivel 1 · Luminarias",
    nombre: "Consulta de Luna",
    resumen: "Un espacio para observar tu mundo emocional: qué necesitas para sentirte en calma y qué patrones aprendiste sobre el cuidado y el afecto.",
    exploramos: [
      "Tu forma de sentir y de procesar las emociones",
      "Qué necesitas para sentirte segura/o",
      "Patrones emocionales heredados o aprendidos"
    ],
    paraQuien: "Para quien quiere entender su mundo interno, su sensibilidad o sus patrones de apego.",
    duration: 60,
    price: 55,
    modalidad: "Online — Google Meet",
    recibe: ["Grabación de la sesión", "PDF con la posición de tu Luna y sus aspectos principales"],
    symbol: "☽"
  },
  {
    slug: "planetas-personales",
    nivel: 2,
    tag: "Nivel 2 · Planetas personales",
    nombre: "Mercurio, Venus y Marte",
    resumen: "Cómo piensas y te comunicas, cómo amas y qué valoras, cómo actúas y defiendes lo que quieres.",
    exploramos: [
      "Mercurio: tu forma de pensar y comunicarte",
      "Venus: cómo amas, qué te atrae y qué valoras",
      "Marte: cómo actúas, tu energía y tu forma de poner límites"
    ],
    paraQuien: "Para profundizar después de conocer tus luminarias, o si quieres empezar directamente por aquí.",
    duration: 60,
    price: 65,
    modalidad: "Online — Google Meet",
    recibe: ["Grabación de la sesión", "PDF con Mercurio, Venus y Marte en tu carta"],
    symbol: "☿ ♀ ♂"
  },
  {
    slug: "jupiter-saturno",
    nivel: 3,
    tag: "Nivel 3 · Expansión y estructura",
    nombre: "Júpiter y Saturno",
    resumen: "Dónde te expandes y creces con más facilidad, y dónde encuentras tus propios límites, tus miedos y tus aprendizajes más sólidos.",
    exploramos: [
      "Júpiter: expansión, crecimiento y sentido",
      "Saturno: estructura, responsabilidad y aprendizaje",
      "La relación entre ambos en tu carta"
    ],
    paraQuien: "Para quien atraviesa procesos de cambio, decisiones importantes o etapas de mucha exigencia interna.",
    duration: 60,
    price: 65,
    modalidad: "Online — Google Meet",
    recibe: ["Grabación de la sesión", "PDF con Júpiter y Saturno en tu carta"],
    symbol: "♃ ♄"
  },
  {
    slug: "planetas-transgeneracionales",
    nivel: 4,
    tag: "Nivel 4 · Transgeneracionales",
    nombre: "Plutón, Urano y Neptuno",
    resumen: "Los procesos de transformación profunda, ruptura y disolución que no son solo tuyos, sino también de tu generación.",
    exploramos: [
      "Plutón: transformación, poder personal y procesos profundos",
      "Urano: cambio, individuación y ruptura de patrones",
      "Neptuno: sensibilidad, disolución de límites y espiritualidad"
    ],
    paraQuien: "Para quien quiere mirar procesos de transformación profunda o patrones que sienten más grandes que ellos mismos.",
    duration: 60,
    price: 70,
    modalidad: "Online — Google Meet",
    recibe: ["Grabación de la sesión", "PDF con tus planetas transgeneracionales"],
    symbol: "♇ ♅ ♆"
  },
  {
    slug: "nodos-karmicos",
    nivel: 5,
    tag: "Nivel 5 · Mirada kármica",
    nombre: "Nodos Lunares y Parte de Fortuna",
    resumen: "Una lectura evolutiva: qué patrones repites, hacia dónde te invita a crecer tu camino y dónde puedes encontrar más bienestar.",
    exploramos: [
      "Nodo Sur: patrones conocidos y zona de confort",
      "Nodo Norte: dirección de crecimiento",
      "Parte de Fortuna: dónde puedes encontrar más bienestar"
    ],
    paraQuien: "Para quien ya conoce lo básico de su carta y quiere una mirada más evolutiva y kármica.",
    duration: 60,
    price: 65,
    modalidad: "Online — Google Meet",
    recibe: ["Grabación de la sesión", "PDF con tus Nodos y Parte de Fortuna"],
    symbol: "☊ ☋ ⊗"
  },
  {
    slug: "lectura-completa",
    nivel: 6,
    tag: "Nivel 6 · Integración completa",
    nombre: "Lectura de Carta Natal Completa",
    resumen: "Una integración de toda tu carta: luminarias, planetas personales, sociales, transgeneracionales, nodos y casas. El recorrido completo en una sola sesión ampliada.",
    exploramos: [
      "Visión general de tu carta y sus ejes principales",
      "Cómo se relacionan tus distintas energías entre sí",
      "Patrones centrales, potenciales y preguntas para seguir explorando"
    ],
    paraQuien: "Para quien quiere una fotografía completa desde el principio, o ya ha hecho consultas por niveles y quiere integrarlo todo.",
    duration: 90,
    price: 110,
    modalidad: "Online — Google Meet",
    recibe: ["Grabación de la sesión", "PDF completo de tu carta natal", "Gráfico de tu carta natal"],
    destacada: true,
    symbol: "☉ ☽ ♃"
  }
];

const LIBROS = [
  {
    categoria: "Astrología para principiantes",
    titulo: "Astrología para el alma",
    autor: "Jan Spiller",
    nivel: "Iniciación",
    paraQuien: "Para quien empieza y quiere entender los Nodos Lunares de forma accesible.",
    descripcion: "Un clásico accesible para acercarse a la astrología evolutiva sin conocimientos previos.",
    amazonUrl: "#",
    afiliado: true
  },
  {
    categoria: "Carta natal",
    titulo: "Cómo interpretar una carta astral",
    autor: "AA. VV.",
    nivel: "Intermedio",
    paraQuien: "Para quien ya conoce los símbolos y quiere aprender a integrarlos.",
    descripcion: "Guía práctica para leer casas, signos y aspectos de forma integrada.",
    amazonUrl: "#",
    afiliado: true
  },
  {
    categoria: "Psicoastrología",
    titulo: "Astrología, psicología y los cuatro elementos",
    autor: "Stephen Arroyo",
    nivel: "Intermedio",
    paraQuien: "Para quien quiere entender la astrología desde una mirada psicológica.",
    descripcion: "Un puente entre la psicología humanista y el simbolismo astrológico.",
    amazonUrl: "#",
    afiliado: true
  },
  {
    categoria: "Astrología kármica",
    titulo: "Astrología kármica y los Nodos Lunares",
    autor: "Martin Schulman",
    nivel: "Avanzado",
    paraQuien: "Para quien quiere profundizar en la mirada evolutiva de la carta.",
    descripcion: "Referencia clásica sobre los Nodos Lunares desde una perspectiva kármica.",
    amazonUrl: "#",
    afiliado: true
  },
  {
    categoria: "Autoconocimiento",
    titulo: "El mapa del alma",
    autor: "AA. VV.",
    nivel: "Iniciación",
    paraQuien: "Para complementar el trabajo astrológico con introspección escrita.",
    descripcion: "Un recorrido de autoconocimiento a través de preguntas y ejercicios.",
    amazonUrl: "#",
    afiliado: true
  },
  {
    categoria: "Espiritualidad",
    titulo: "El poder del ahora",
    autor: "Eckhart Tolle",
    nivel: "Iniciación",
    paraQuien: "Para quien quiere complementar la astrología con presencia y observación interna.",
    descripcion: "Un acompañante habitual en procesos de autoindagación y presencia.",
    amazonUrl: "#",
    afiliado: true
  }
];

const PRODUCTOS = [
  {
    tipo: "Journal",
    titulo: "Journal de autoindagación astrológica",
    descripcion: "Un cuaderno guiado para acompañar tu proceso entre consultas: preguntas, observaciones y espacio para tus propios patrones.",
    precio: 24,
    disponible: true,
    imagen: ""
  },
  {
    tipo: "Carta natal",
    titulo: "Carta natal ilustrada (PDF)",
    descripcion: "Tu gráfico de carta natal en formato descargable, listo para imprimir o guardar.",
    precio: 15,
    disponible: true,
    imagen: ""
  },
  {
    tipo: "Lámina",
    titulo: "Lámina de símbolos planetarios",
    descripcion: "Lámina decorativa minimalista con los símbolos planetarios, ideal para tu espacio de trabajo interior.",
    precio: 18,
    disponible: false,
    imagen: ""
  }
];

const POSTS = [
  {
    slug: "que-es-una-carta-natal",
    categoria: "Carta Natal",
    titulo: "¿Qué es una carta natal (y qué no es)?",
    resumen: "Una carta natal no predice tu vida. Es una fotografía simbólica del cielo en el momento en que naciste, y un punto de partida para observarte.",
    fecha: "2026-05-12",
    contenido: `
      <p>Una carta natal es, en términos simples, una fotografía del cielo en el momento exacto y el lugar en el que naciste. Marca dónde estaban el Sol, la Luna y el resto de planetas, y en qué signo y casa se encontraba cada uno.</p>
      <p>Hasta aquí, es un dato astronómico. Lo que la astrología añade es una capa simbólica: cada planeta, signo y casa se asocia a una serie de temas — la identidad, las emociones, la comunicación, los vínculos — que juntos empiezan a dibujar un mapa de posibles patrones internos.</p>
      <p>Es importante distinguir entre el mapa y el territorio. Tu carta natal no es tu vida, del mismo modo que un mapa no es el paisaje que representa. Es una herramienta de orientación, no una descripción cerrada de quién eres o de lo que te va a ocurrir.</p>
      <p>En consulta, la carta natal se convierte en un punto de partida para hacer preguntas: ¿reconozco esto en mí? ¿de qué forma se manifiesta? ¿qué parte quiero seguir observando? Ese diálogo, más que la carta en sí, es lo que suele resultar útil.</p>
    `
  },
  {
    slug: "sol-luna-ascendente-que-representan",
    categoria: "Planetas",
    titulo: "Sol, Luna y Ascendente: qué representa cada uno",
    resumen: "Tres puntos que a menudo se confunden entre sí, y que juntos empiezan a dibujar quién eres.",
    fecha: "2026-05-05",
    contenido: `
      <p>Sol, Luna y Ascendente son los tres puntos más consultados de una carta natal, y también los que más se confunden entre sí. Verlos por separado ayuda a entender qué aporta cada uno.</p>
      <p>El Sol suele asociarse con la identidad consciente: aquello con lo que te identificas cuando piensas "así soy yo". La Luna, en cambio, habla de un plano más automático — cómo sientes, qué te calma, qué necesitas para sentirte segura o seguro. El Ascendente describe cómo llegas a los espacios nuevos, la primera impresión que sueles dar y, en muchos casos, un estilo de actuar casi instintivo.</p>
      <p>Ninguno de los tres "es más importante" que los otros; se trata de capas distintas de una misma persona. Por eso una consulta que empieza por aquí suele dar una primera fotografía amplia, útil como punto de partida antes de profundizar en otras áreas de la carta.</p>
    `
  },
  {
    slug: "luna-en-carta-natal",
    categoria: "Planetas",
    titulo: "¿Qué significa tener la Luna en una carta natal?",
    resumen: "La Luna no habla de lo que piensas, sino de lo que sientes y de lo que necesitas para sentirte en casa.",
    fecha: "2026-04-28",
    contenido: `
      <p>Si el Sol se asocia con la identidad consciente, la Luna se asocia con algo más difícil de verbalizar: la forma en que sientes antes incluso de pensar en ello. Reacciones automáticas, necesidades de seguridad, memoria afectiva.</p>
      <p>El signo en el que se encuentra tu Luna suele describir un estilo emocional: qué te reconforta, qué te sobrepasa, cómo procesas lo que sientes. La casa donde se ubica añade en qué área de la vida ese estilo emocional se hace más visible.</p>
      <p>Trabajar con la Luna en consulta no consiste en etiquetar tu forma de sentir como "buena" o "mala", sino en reconocerla — muchas veces por primera vez con este nivel de detalle — y observar qué patrones, aprendidos quizá desde la infancia, siguen activos hoy.</p>
    `
  },
  {
    slug: "astrologia-karmica-que-es",
    categoria: "Astrología Kármica",
    titulo: "Astrología kármica: qué es (y qué no es)",
    resumen: "No habla de vidas pasadas como verdad literal, sino de patrones que se repiten y piden ser mirados.",
    fecha: "2026-04-20",
    contenido: `
      <p>La astrología kármica suele generar confusión porque su nombre remite directamente a la idea de "vidas pasadas". En la práctica, y en la forma en que yo la trabajo, no es necesario tomar esa idea de forma literal para que resulte útil.</p>
      <p>Lo central de esta mirada son los Nodos Lunares: el Nodo Sur, asociado a patrones ya conocidos y a una zona de confort, y el Nodo Norte, asociado a una dirección de crecimiento. Se puede leer simplemente como una tensión entre lo habitual y lo que todavía se está aprendiendo a habitar.</p>
      <p>Da igual si prefieres una lectura simbólica o una lectura más literal del concepto de karma: lo que importa en consulta es qué patrones reconoces al mirarlo, y qué te gustaría hacer con esa información.</p>
    `
  },
  {
    slug: "carta-natal-determina-destino",
    categoria: "Autoconocimiento",
    titulo: "¿La carta natal determina tu destino?",
    resumen: "Una de las preguntas más frecuentes, y la que mejor resume la filosofía de este espacio.",
    fecha: "2026-04-10",
    contenido: `
      <p>Es probablemente la pregunta que más me hacen, y también la que mejor resume cómo trabajo. Mi respuesta corta es: no lo entiendo así.</p>
      <p>Prefiero pensar la carta natal como un conjunto de tendencias y energías disponibles, no como un guion cerrado. Dos personas con una misma posición planetaria pueden vivirla de formas muy distintas, según su historia, sus decisiones y el trabajo que hagan sobre sí mismas.</p>
      <p>Por eso, en consulta, no hablamos de lo que "va a pasar", sino de lo que ya está presente y puede observarse: patrones, potenciales, conflictos internos. Lo que hagas con esa información — y hacia dónde decidas moverte — sigue siendo, siempre, una elección tuya.</p>
    `
  }
];

const FAQS = [
  { q: "¿Necesito saber astrología para hacer una consulta?", a: "No. La mayoría de personas que vienen a consulta no tienen conocimientos previos. Todo se explica durante la sesión con un lenguaje cercano, sin dar por hecho que conoces los términos." },
  { q: "¿Necesito conocer mi hora exacta de nacimiento?", a: "" },
  { q: "¿Las consultas son predictivas?", a: "No. No trabajo diciendo qué va a pasar en tu vida. Trabajo desde la comprensión de patrones, potenciales y dinámicas internas, no desde la predicción." },
  { q: "¿La astrología determina nuestro futuro?", a: "No lo entiendo así. La carta natal es un mapa simbólico de tendencias y energías, no una sentencia fija. Lo que hagas con esa información depende de ti." },
  { q: "¿Puedo empezar solamente con una consulta de Luna?", a: "Sí. De hecho es una de las formas más habituales de empezar. No es necesario hacer una lectura completa para beneficiarte de una consulta." },
  { q: "¿Qué diferencia hay entre una consulta individual y una carta natal completa?", a: "Una consulta individual profundiza en una parte concreta de ti (por ejemplo, tu Luna). La carta completa integra todas las áreas en una sesión más amplia." },
  { q: "¿Cómo se realiza la consulta?", a: "Todas las consultas son online, a través de Google Meet. Solo necesitas conexión a internet y un espacio tranquilo." },
  { q: "¿Dónde recibo el enlace de Google Meet?", a: "Se envía automáticamente por email tras confirmar tu reserva, junto con la fecha, hora y las instrucciones previas." },
  { q: "¿Puedo cancelar o cambiar mi cita?", a: "Sí, puedes cancelar o reprogramar con al menos 48 horas de antelación desde el enlace que recibirás en tu email de confirmación." },
  { q: "¿Qué recibo después de la sesión?", a: "Según la consulta, recibirás la grabación de la sesión, un PDF resumen y, en algunos casos, el gráfico de tu carta natal." },
  { q: "¿Puedo regalar una consulta?", a: "Sí. Escríbeme por email o WhatsApp y preparamos un bono regalo con la consulta que elijas." },
  { q: "¿Las consultas sirven para temas de pareja?", a: "Se pueden explorar dinámicas relacionales desde tu propia carta (por ejemplo, tu Venus o tu Marte), aunque actualmente no ofrezco lecturas de sinastría de pareja como servicio independiente." },
  { q: "¿La astrología sustituye a la terapia psicológica?", a: "No. La astrología y el acompañamiento transpersonal son herramientas de autoconocimiento y no sustituyen la atención psicológica, médica o psiquiátrica cuando esta es necesaria. Si estás atravesando un momento de crisis o necesitas apoyo clínico, te animo a buscar acompañamiento profesional especializado." }
];
