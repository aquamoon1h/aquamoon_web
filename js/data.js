/* ==========================================================================
   aquamoon — Fuente única de contenido
   Cambia aquí el nombre de marca, precios, consultas, libros, productos...
   sin tocar el HTML ni el resto del código.
   ========================================================================== */

const SITE = {
  brandName: "aquamoon",
  tagline: "Psicoastrología kármica + terapia transpersonal",
  philosophy: "Uso la astrología como herramienta de autoindagación, no como una sentencia sobre tu vida.",
  email: "hola@aquamoon-astrologia.com",
  whatsapp: "https://wa.me/34600000000",
  instagram: "https://instagram.com/aquamoon.astrologia",
  bookingBase: "consultas.html", // enlace base de "Reservar consulta"
  location: "Consultas online (Google Meet) — para cualquier país hispanohablante",
};

/* Ciudades para el autocompletado de "Lugar de nacimiento" (paso previo de reserva).
   Lista orientativa (España + Latinoamérica + algunas capitales internacionales) —
   ampliable añadiendo más entradas "Ciudad, País". */
const CIUDADES = [
  "Madrid, España","Barcelona, España","Valencia, España","Sevilla, España","Zaragoza, España",
  "Málaga, España","Murcia, España","Palma de Mallorca, España","Las Palmas de Gran Canaria, España",
  "Santa Cruz de Tenerife, España","Bilbao, España","Alicante, España","Córdoba, España","Valladolid, España",
  "Vigo, España","Gijón, España","A Coruña, España","Granada, España","San Sebastián, España","Pamplona, España",
  "Santander, España","Toledo, España","Salamanca, España","Cádiz, España","Almería, España",
  "Ciudad de México, México","Guadalajara, México","Monterrey, México","Puebla, México","Tijuana, México",
  "Mérida, México","Cancún, México","Buenos Aires, Argentina","Córdoba, Argentina","Rosario, Argentina",
  "Mendoza, Argentina","La Plata, Argentina","Bogotá, Colombia","Medellín, Colombia","Cali, Colombia",
  "Cartagena, Colombia","Barranquilla, Colombia","Lima, Perú","Arequipa, Perú","Cusco, Perú",
  "Santiago, Chile","Valparaíso, Chile","Concepción, Chile","Caracas, Venezuela","Maracaibo, Venezuela",
  "Valencia, Venezuela","Quito, Ecuador","Guayaquil, Ecuador","Cuenca, Ecuador","La Paz, Bolivia",
  "Santa Cruz de la Sierra, Bolivia","Asunción, Paraguay","Montevideo, Uruguay","San José, Costa Rica",
  "Panamá, Panamá","San Salvador, El Salvador","Tegucigalpa, Honduras","Managua, Nicaragua",
  "Guatemala, Guatemala","Santo Domingo, República Dominicana","San Juan, Puerto Rico","La Habana, Cuba",
  "Nueva York, Estados Unidos","Los Ángeles, Estados Unidos","Miami, Estados Unidos","Chicago, Estados Unidos",
  "Houston, Estados Unidos","Londres, Reino Unido","París, Francia","Berlín, Alemania","Roma, Italia",
  "Lisboa, Portugal","Ámsterdam, Países Bajos","Bruselas, Bélgica","Zúrich, Suiza","Dublín, Irlanda",
  "Andorra la Vella, Andorra"
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
