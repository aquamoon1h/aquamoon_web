/* ==========================================================================
   aquamoon — Motor de cálculo astrológico (Carta Natal)
   Sin dependencias de servidor: usa la librería astronomy-engine (cargada
   por <script> en carta-natal.html, expone el global `Astronomy`) para las
   posiciones de Sol/Luna/planetas, y fórmulas astronómicas estándar (Meeus,
   "Astronomical Algorithms") para Ascendente/Medio Cielo/casas, implementadas
   aquí directamente.

   IMPORTANTE — validado a mano antes de integrarlo (ver notas en el plan):
   - Astronomy.EclipticLongitude() es HELIOCÉNTRICA (vista desde el Sol) —
     NO sirve para astrología. Aquí se usa GeoVector + Ecliptic, que da la
     longitud eclíptica GEOCÉNTRICA aparente (la correcta).
   - Ascendente/Medio Cielo y Plácido se comprobaron con casos de control
     (oblicuidad 0, distintas latitudes) y con una carta real (planetas
     exteriores cayendo en los signos que históricamente les corresponden).
   - Nodo y Lilith son la versión MEDIA (estándar en la mayoría de software
     de astrología), no la verdadera.
   - Quirón es una aproximación por órbita kepleriana simple a partir de sus
     elementos orbitales publicados — no es una efeméride oficial. Puede
     desviarse varios grados; se ofrece desactivado por defecto en la UI.
   - Plácido puede no converger a una secuencia de casas válida en latitudes
     extremas (limitación conocida del propio método, no de este código):
     en ese caso se recurre automáticamente a Casas Iguales.
   ========================================================================== */

const AstroCalc = (function () {

  // ---------- Utilidades básicas ----------
  function deg2rad(d) { return d * Math.PI / 180; }
  function rad2deg(r) { return r * 180 / Math.PI; }
  function norm360(d) { d = d % 360; return d < 0 ? d + 360 : d; }

  function julianDay(date) { return date.getTime() / 86400000 + 2440587.5; }
  function julianCenturies(jd) { return (jd - 2451545.0) / 36525; }

  const SIGNS = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];
  const SIGN_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

  function signOf(lonDeg) {
    const idx = Math.floor(norm360(lonDeg) / 30) % 12;
    return { index: idx, name: SIGNS[idx], symbol: SIGN_SYMBOLS[idx], degree: norm360(lonDeg) % 30 };
  }

  // ---------- Hora local -> instante UTC ----------
  // tipoHora: "HL" (hora local de reloj, usa la zona horaria IANA de la ciudad,
  //           correcta históricamente incluidos los cambios de DST),
  //           "UT" (la hora introducida ya es tiempo universal), o
  //           "LMT" (tiempo local medio: corrección pura por longitud geográfica,
  //           sin DST ni political timezone).
  function getTzOffsetMinutes(date, tz) {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    const parts = dtf.formatToParts(date).reduce((a, p) => { a[p.type] = p.value; return a; }, {});
    const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second || 0);
    return (asUTC - date.getTime()) / 60000;
  }
  function zonedLocalToUtc(y, mo, d, hh, mm, tz) {
    let guess = Date.UTC(y, mo - 1, d, hh, mm);
    for (let i = 0; i < 3; i++) {
      const offsetMin = getTzOffsetMinutes(new Date(guess), tz);
      guess = Date.UTC(y, mo - 1, d, hh, mm) - offsetMin * 60000;
    }
    return new Date(guess);
  }

  /**
   * @param {object} birth { year, month, day, hour, minute, tipoHora, tz, lonDeg }
   *   hour/minute pueden ser null si la hora es desconocida (se usará mediodía).
   * @returns {Date} instante UTC correspondiente
   */
  function birthToUtc(birth) {
    const hh = birth.hour == null ? 12 : birth.hour;
    const mm = birth.minute == null ? 0 : birth.minute;
    if (birth.tipoHora === "UT") {
      return new Date(Date.UTC(birth.year, birth.month - 1, birth.day, hh, mm));
    }
    if (birth.tipoHora === "LMT") {
      const utcGuess = Date.UTC(birth.year, birth.month - 1, birth.day, hh, mm);
      const offsetMin = (birth.lonDeg / 15) * 60; // este positivo => por delante de UTC
      return new Date(utcGuess - offsetMin * 60000);
    }
    // HL por defecto
    return zonedLocalToUtc(birth.year, birth.month, birth.day, hh, mm, birth.tz);
  }

  // ---------- Longitud eclíptica geocéntrica aparente ----------
  function geoEclipticLon(body, date) {
    const vec = Astronomy.GeoVector(body, date, true);
    const ecl = Astronomy.Ecliptic(vec);
    return norm360(ecl.elon);
  }

  const PLANET_BODIES = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
  const PLANET_SYMBOLS = { Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂", Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇" };
  const PLANET_LABELS = { Sun: "Sol", Moon: "Luna", Mercury: "Mercurio", Venus: "Venus", Mars: "Marte", Jupiter: "Júpiter", Saturn: "Saturno", Uranus: "Urano", Neptune: "Neptuno", Pluto: "Plutón" };

  function planetLongitudes(date) {
    const out = {};
    for (const b of PLANET_BODIES) out[b] = geoEclipticLon(Astronomy.Body[b], date);
    return out;
  }

  // ---------- Nodo medio / Lilith media (fórmulas polinómicas estándar) ----------
  function meanNodeLon(T) {
    const lon = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T ** 3) / 467441 - (T ** 4) / 60616000;
    return norm360(lon);
  }
  function meanLilithLon(T) {
    const lon = 83.3532465 + 4069.0137287 * T - 0.0103200 * T * T - (T ** 3) / 80053 + (T ** 4) / 18999000;
    return norm360(lon);
  }

  // ---------- Quirón (aproximación kepleriana — ver aviso arriba) ----------
  // Elementos orbitales osculadores aproximados (época J2000.0).
  const CHIRON_ELEMENTS = {
    a: 13.7022, e: 0.38276, i: 6.9366, Om: 209.294, w: 339.402, M0: 149.749, epochJD: 2451545.0
  };
  function solveKepler(M, e) {
    let E = M;
    for (let i = 0; i < 30; i++) {
      const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-10) break;
    }
    return E;
  }
  function chironGeoLon(date) {
    const el = CHIRON_ELEMENTS;
    const jd = julianDay(date);
    const days = jd - el.epochJD;
    const n = 360 / (Math.pow(el.a, 1.5) * 365.25); // grados/día
    const M = deg2rad(norm360(el.M0 + n * days));
    const E = solveKepler(M, el.e);
    const nu = 2 * Math.atan2(Math.sqrt(1 + el.e) * Math.sin(E / 2), Math.sqrt(1 - el.e) * Math.cos(E / 2));
    const r = el.a * (1 - el.e * Math.cos(E));
    const xOrb = r * Math.cos(nu), yOrb = r * Math.sin(nu);
    const w = deg2rad(el.w), Om = deg2rad(el.Om), i = deg2rad(el.i);
    const x = (Math.cos(Om) * Math.cos(w) - Math.sin(Om) * Math.sin(w) * Math.cos(i)) * xOrb
      + (-Math.cos(Om) * Math.sin(w) - Math.sin(Om) * Math.cos(w) * Math.cos(i)) * yOrb;
    const y = (Math.sin(Om) * Math.cos(w) + Math.cos(Om) * Math.sin(w) * Math.cos(i)) * xOrb
      + (-Math.sin(Om) * Math.sin(w) + Math.cos(Om) * Math.cos(w) * Math.cos(i)) * yOrb;
    const z = (Math.sin(w) * Math.sin(i)) * xOrb + (Math.cos(w) * Math.sin(i)) * yOrb;
    // Chiron heliocéntrico (eclíptico J2000) -> geocéntrico restando la Tierra
    const earth = Astronomy.HelioVector(Astronomy.Body.Earth, date);
    // earth está en coordenadas ecuatoriales J2000; lo pasamos a eclípticas J2000 con oblicuidad fija de época
    const eps2000 = deg2rad(23.4392911);
    const ex = earth.x, ey = earth.y * Math.cos(eps2000) + earth.z * Math.sin(eps2000), ez = -earth.y * Math.sin(eps2000) + earth.z * Math.cos(eps2000);
    const gx = x - ex, gy = y - ey, gz = z - ez;
    return norm360(rad2deg(Math.atan2(gy, gx)));
  }

  // ---------- Tiempo sidéreo / oblicuidad (via astronomy-engine, más preciso) ----------
  // OJO: Astronomy.e_tilt() exige un AstroTime "de verdad" (no acepta Date directamente
  // y, si se le pasa uno, puede devolver silenciosamente un valor cacheado erróneo) —
  // por eso aquí siempre se convierte antes con Astronomy.MakeTime().
  function trueObliquity(date) { return Astronomy.e_tilt(Astronomy.MakeTime(date)).tobl; }
  function gastDeg(date) { return norm360(Astronomy.SiderealTime(date) * 15); }

  // ---------- Ascendente / Medio Cielo ----------
  function midheaven(ramcDeg, epsDeg) {
    const ramc = deg2rad(ramcDeg), eps = deg2rad(epsDeg);
    return norm360(rad2deg(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps))));
  }
  function ascendant(ramcDeg, epsDeg, latDeg) {
    const ramc = deg2rad(ramcDeg), eps = deg2rad(epsDeg), lat = deg2rad(latDeg);
    const y = Math.cos(ramc);
    const x = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps));
    return norm360(rad2deg(Math.atan2(y, x)));
  }

  // ---------- Sistemas de casas ----------
  function wholeSignCusps(ascDeg) {
    const start = Math.floor(norm360(ascDeg) / 30) * 30;
    return Array.from({ length: 12 }, (_, i) => norm360(start + i * 30));
  }
  function equalHouseCusps(ascDeg) {
    return Array.from({ length: 12 }, (_, i) => norm360(ascDeg + i * 30));
  }

  function declinationOf(lonDeg, epsDeg) {
    return rad2deg(Math.asin(Math.sin(deg2rad(epsDeg)) * Math.sin(deg2rad(lonDeg))));
  }
  function lonFromRA(raDeg, epsDeg) { return midheaven(raDeg, epsDeg); } // misma fórmula, es su propia inversa

  function placidusIntermediateCusp(ramcDeg, epsDeg, latDeg, quadrant, fraction, startGuessLon) {
    const lat = deg2rad(latDeg);
    let lon = startGuessLon;
    for (let i = 0; i < 30; i++) {
      const dec = deg2rad(declinationOf(lon, epsDeg));
      const clamped = Math.max(-1, Math.min(1, Math.tan(lat) * Math.tan(dec)));
      const AD = rad2deg(Math.asin(clamped));
      let alphaTarget;
      if (quadrant === "diurnal") {
        const SDA = 90 + AD;
        alphaTarget = norm360(ramcDeg + 90 - fraction * SDA);
      } else {
        const SNA = 90 - AD;
        alphaTarget = norm360(ramcDeg + 90 + fraction * SNA);
      }
      const newLon = lonFromRA(alphaTarget, epsDeg);
      if (Math.abs(norm360(newLon - lon + 180) - 180) < 1e-8) { lon = newLon; break; }
      lon = newLon;
    }
    return norm360(lon);
  }

  function cuspsAreValid(cusps) {
    for (let i = 0; i < 12; i++) {
      const step = norm360(cusps[(i + 1) % 12] - cusps[i]);
      if (!(step > 0 && step < 180)) return false;
    }
    return true;
  }

  function placidusCusps(ramcDeg, epsDeg, latDeg, ascDeg, mcDeg) {
    const cusps = new Array(12);
    cusps[9] = mcDeg;
    cusps[0] = ascDeg;
    cusps[3] = norm360(mcDeg + 180);
    cusps[6] = norm360(ascDeg + 180);
    cusps[10] = placidusIntermediateCusp(ramcDeg, epsDeg, latDeg, "diurnal", 2 / 3, norm360(mcDeg + 20));   // H11, más cerca del MC
    cusps[11] = placidusIntermediateCusp(ramcDeg, epsDeg, latDeg, "diurnal", 1 / 3, norm360(mcDeg + 40));   // H12, más cerca del ASC
    cusps[1] = placidusIntermediateCusp(ramcDeg, epsDeg, latDeg, "nocturnal", 1 / 3, norm360(ascDeg + 20)); // H2, más cerca del ASC
    cusps[2] = placidusIntermediateCusp(ramcDeg, epsDeg, latDeg, "nocturnal", 2 / 3, norm360(ascDeg + 40)); // H3, más cerca del IC
    cusps[4] = norm360(cusps[10] + 180);
    cusps[5] = norm360(cusps[11] + 180);
    cusps[7] = norm360(cusps[1] + 180);
    cusps[8] = norm360(cusps[2] + 180);
    return cusps;
  }

  /**
   * @param {string} system "placidus" | "equal" | "whole"
   * @returns {{cusps: number[], usedFallback: boolean}}
   */
  function houseCusps(system, ramcDeg, epsDeg, latDeg, ascDeg, mcDeg) {
    if (system === "whole") return { cusps: wholeSignCusps(ascDeg), usedFallback: false };
    if (system === "equal") return { cusps: equalHouseCusps(ascDeg), usedFallback: false };
    // placidus
    const cusps = placidusCusps(ramcDeg, epsDeg, latDeg, ascDeg, mcDeg);
    if (cuspsAreValid(cusps)) return { cusps, usedFallback: false };
    return { cusps: equalHouseCusps(ascDeg), usedFallback: true };
  }

  function houseOfPoint(lonDeg, cusps) {
    const lon = norm360(lonDeg);
    for (let i = 0; i < 12; i++) {
      const start = cusps[i], end = cusps[(i + 1) % 12];
      const span = norm360(end - start);
      const rel = norm360(lon - start);
      if (rel < span || span === 0) return i + 1;
    }
    return 12;
  }

  // ---------- Parte de Fortuna ----------
  // Carta diurna: Sol sobre el horizonte (entre Ascendente y Descendente, por encima); si no, nocturna.
  function partOfFortune(sunLon, moonLon, ascLon, isDayChart) {
    return isDayChart ? norm360(ascLon + moonLon - sunLon) : norm360(ascLon + sunLon - moonLon);
  }
  function isDayChart(sunLon, houseCuspsArr) {
    const h = houseOfPoint(sunLon, houseCuspsArr);
    return h >= 7 && h <= 12; // por encima del horizonte = casas 7 a 12
  }

  // ---------- Aspectos ----------
  const ASPECTS = [
    { name: "Conjunción", angle: 0, symbol: "☌" },
    { name: "Sextil", angle: 60, symbol: "⚹" },
    { name: "Cuadratura", angle: 90, symbol: "□" },
    { name: "Trígono", angle: 120, symbol: "△" },
    { name: "Oposición", angle: 180, symbol: "☍" },
    { name: "Quincuncio", angle: 150, symbol: "⚻" },
    { name: "Semisextil", angle: 30, symbol: "⚺" },
  ];

  /**
   * @param {{key:string, label:string, lon:number}[]} points
   * @param {Object} orbs { Conjunción: 8, Sextil: 4, ... } grados de orbe por tipo de aspecto
   * @param {string[]} activeAspects nombres de ASPECTS a considerar
   */
  function calcAspects(points, orbs, activeAspects) {
    const results = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const diff = Math.abs(norm360(points[i].lon - points[j].lon));
        const angle = diff > 180 ? 360 - diff : diff;
        for (const asp of ASPECTS) {
          if (!activeAspects.includes(asp.name)) continue;
          const orb = orbs[asp.name] != null ? orbs[asp.name] : 6;
          const delta = Math.abs(angle - asp.angle);
          if (delta <= orb) {
            results.push({ a: points[i].key, b: points[j].key, aLabel: points[i].label, bLabel: points[j].label, aspect: asp.name, symbol: asp.symbol, angle: asp.angle, orb: +delta.toFixed(2) });
          }
        }
      }
    }
    return results;
  }

  // ---------- API pública ----------
  return {
    norm360, deg2rad, rad2deg,
    signOf, SIGNS, SIGN_SYMBOLS,
    birthToUtc,
    planetLongitudes, PLANET_BODIES, PLANET_SYMBOLS, PLANET_LABELS,
    meanNodeLon, meanLilithLon, chironGeoLon,
    trueObliquity, gastDeg,
    midheaven, ascendant,
    houseCusps, houseOfPoint,
    partOfFortune, isDayChart,
    ASPECTS, calcAspects,
    julianDay, julianCenturies,
  };
})();

// Permite testear este archivo con Node (no afecta al navegador: `module` no existe ahí).
if (typeof module !== "undefined" && module.exports) module.exports = AstroCalc;
