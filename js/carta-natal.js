/* ==========================================================================
   aquamoon — Carta Natal: asistente, rueda SVG y exportación a PDF
   Usa AstroCalc (js/astro-calc.js) para todo el cálculo astronómico.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const mountCheck = document.getElementById("pointsCheckGrid");
  if (!mountCheck) return; // no estamos en carta-natal.html

  // ---------- Definición de puntos disponibles ----------
  const POINTS = [
    ...AstroCalc.PLANET_BODIES.map(b => ({ key: b, label: AstroCalc.PLANET_LABELS[b], symbol: AstroCalc.PLANET_SYMBOLS[b], kind: "planet" })),
    { key: "Node", label: "Nodo Lunar Medio", symbol: "☊", kind: "point" },
    { key: "Lilith", label: "Lilith Media", symbol: "⚸", kind: "point" },
    { key: "Chiron", label: "Quirón (aproximado)", symbol: "⚷", kind: "point", defaultOff: true },
    { key: "ASC", label: "Ascendente", symbol: "ASC", kind: "angle" },
    { key: "MC", label: "Medio Cielo", symbol: "MC", kind: "angle" },
    { key: "Fortune", label: "Parte de Fortuna", symbol: "⊕", kind: "point" },
  ];
  const DEFAULT_ORBS = { "Conjunción": 8, "Oposición": 8, "Trígono": 7, "Cuadratura": 7, "Sextil": 4, "Quincuncio": 3, "Semisextil": 2 };

  const state = {
    step: 1,
    birth: null,       // { name, lat, lon, tz, utcDate, isManualPlace, tipoHora, horaDesconocida, horaFallback }
    result: null,      // resultado calculado (posiciones, casas, aspectos...)
  };

  // ---------- Wizard (mismo patrón que reserva.html) ----------
  const stepsBar = document.getElementById("stepsBar");
  const labels = ["Datos", "Opciones", "Resultado"];
  function renderStepsBar() {
    stepsBar.innerHTML = labels.map((l, i) => {
      const n = i + 1;
      const cls = n === state.step ? "active" : (n < state.step ? "done" : "");
      return `<span class="step-pill ${cls}">${n}. ${l}</span>`;
    }).join("");
  }
  function showStep(n) {
    document.querySelectorAll(".booking-step").forEach(el => {
      el.classList.toggle("active", Number(el.dataset.step) === n);
    });
    document.getElementById("navButtons").style.display = "flex";
    document.getElementById("btnBack").style.visibility = (n === 1) ? "hidden" : "visible";
    document.getElementById("btnNext").style.display = (n === 3) ? "none" : "inline-flex";
    renderStepsBar();
    window.scrollTo({ top: document.querySelector(".page-hero").offsetTop, behavior: "smooth" });
  }

  // ---------- Paso 1: ciudad / manual / hora desconocida ----------
  document.getElementById("ciudadesList").innerHTML = CIUDADES.map(c => `<option value="${c.name}">`).join("");

  const btnManualPlace = document.getElementById("btnManualPlace");
  const manualPlace = document.getElementById("manualPlace");
  btnManualPlace.addEventListener("click", () => {
    manualPlace.classList.toggle("open");
    btnManualPlace.textContent = manualPlace.classList.contains("open")
      ? "Usar el buscador de ciudades en su lugar"
      : "No encuentro mi ciudad — introducir coordenadas manualmente";
  });

  const horaDesconocida = document.getElementById("cnHoraDesconocida");
  const horaDesconocidaOpts = document.getElementById("horaDesconocidaOpts");
  const cnHora = document.getElementById("cnHora");
  horaDesconocida.addEventListener("change", () => {
    horaDesconocidaOpts.classList.toggle("open", horaDesconocida.checked);
    cnHora.disabled = horaDesconocida.checked;
  });

  // ---------- Paso 2: checkboxes de puntos ----------
  const pointsGrid = document.getElementById("pointsCheckGrid");
  pointsGrid.innerHTML = POINTS.map(p => `
    <label class="check-item">
      <input type="checkbox" data-point="${p.key}" ${p.defaultOff ? "" : "checked"}>
      <span>${p.symbol} ${p.label}</span>
    </label>
  `).join("");

  const aspectsList = document.getElementById("aspectsCheckList");
  aspectsList.innerHTML = AstroCalc.ASPECTS.map(a => `
    <div class="aspect-row">
      <label style="display:flex; align-items:center; gap:0.5em; flex:1;">
        <input type="checkbox" data-aspect="${a.name}" checked>
        <span>${a.symbol} ${a.name}</span>
      </label>
      <label style="display:flex; align-items:center; gap:0.4em;">
        orbe
        <input type="number" data-orb="${a.name}" value="${DEFAULT_ORBS[a.name] || 5}" min="0" max="15" step="0.5">°
      </label>
    </div>
  `).join("");

  document.querySelectorAll("[data-check-group]").forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.dataset.checkGroup;
      const all = btn.dataset.checkAction === "all";
      const selector = group === "points" ? "[data-point]" : "[data-aspect]";
      document.querySelectorAll(selector).forEach(cb => { cb.checked = all; });
    });
  });

  // ---------- Validación y avance de pasos ----------
  function collectBirthInput() {
    const fechaStr = document.getElementById("cnFecha").value;
    if (!fechaStr) return { error: "Indica tu fecha de nacimiento." };
    const [y, mo, d] = fechaStr.split("-").map(Number);

    const horaDesc = horaDesconocida.checked;
    let hour = null, minute = null;
    if (!horaDesc) {
      const horaStr = cnHora.value;
      if (horaStr) { const [hh, mm] = horaStr.split(":").map(Number); hour = hh; minute = mm; }
    }

    const lugarTexto = document.getElementById("cnLugar").value.trim();
    const ciudad = CIUDADES.find(c => c.name.toLowerCase() === lugarTexto.toLowerCase());
    let lat, lon, tz, isManualPlace = false;
    if (ciudad) {
      lat = ciudad.lat; lon = ciudad.lon; tz = ciudad.tz;
    } else {
      const latIn = document.getElementById("cnLat").value;
      const lonIn = document.getElementById("cnLon").value;
      if (latIn === "" || lonIn === "") {
        return { error: "Elige una ciudad de la lista o introduce latitud/longitud manualmente." };
      }
      lat = parseFloat(latIn); lon = parseFloat(lonIn); isManualPlace = true;
      const offIn = document.getElementById("cnUtcOffset").value;
      tz = null; // sin zona IANA en modo manual
      state._manualUtcOffset = offIn === "" ? 0 : parseFloat(offIn);
    }

    const tipoHora = document.querySelector('input[name="tipoHora"]:checked').value;
    const horaFallback = document.querySelector('input[name="horaFallback"]:checked').value;

    return {
      name: document.getElementById("cnNombre").value.trim(),
      year: y, month: mo, day: d, hour, minute,
      lat, lon, tz, isManualPlace,
      tipoHora, horaDesconocida: horaDesc, horaFallback,
      lugarTexto: ciudad ? ciudad.name : (lugarTexto || `lat ${lat}, lon ${lon}`),
    };
  }

  document.getElementById("btnNext").addEventListener("click", () => {
    if (state.step === 1) {
      const birth = collectBirthInput();
      if (birth.error) { alert(birth.error); return; }
      state.birth = birth;
    }
    if (state.step === 2) {
      const anyPoint = document.querySelectorAll("[data-point]:checked").length > 0;
      if (!anyPoint) { alert("Selecciona al menos un planeta o punto para calcular la carta."); return; }
      computeChart();
    }
    state.step = Math.min(state.step + 1, 3);
    showStep(state.step);
  });
  document.getElementById("btnBack").addEventListener("click", () => {
    state.step = Math.max(state.step - 1, 1);
    showStep(state.step);
  });
  document.getElementById("btnEditAgain").addEventListener("click", () => {
    state.step = 1;
    showStep(1);
  });

  // ---------- Cálculo de la carta ----------
  function computeChart() {
    const b = state.birth;

    // Hora efectiva a usar cuando "no sé la hora exacta"
    let hourEff = b.hour, minuteEff = b.minute;
    if (b.horaDesconocida) { hourEff = 12; minuteEff = 0; }

    let utcDate;
    if (b.tipoHora === "HL" && !b.isManualPlace) {
      utcDate = AstroCalc.birthToUtc({ year: b.year, month: b.month, day: b.day, hour: hourEff, minute: minuteEff, tipoHora: "HL", tz: b.tz });
    } else if (b.tipoHora === "HL" && b.isManualPlace) {
      // sin zona IANA: aplicamos directamente el offset manual introducido (sin DST histórico)
      const guess = Date.UTC(b.year, b.month - 1, b.day, hourEff == null ? 12 : hourEff, minuteEff || 0);
      utcDate = new Date(guess - (state._manualUtcOffset || 0) * 3600000);
    } else {
      utcDate = AstroCalc.birthToUtc({ year: b.year, month: b.month, day: b.day, hour: hourEff, minute: minuteEff, tipoHora: b.tipoHora, lonDeg: b.lon });
    }

    const eps = AstroCalc.trueObliquity(utcDate);
    const gast = AstroCalc.gastDeg(utcDate);
    const ramc = AstroCalc.norm360(gast + b.lon);
    const planets = AstroCalc.planetLongitudes(utcDate);
    const T = AstroCalc.julianCenturies(AstroCalc.julianDay(utcDate));

    let asc, mc, housesInfo, usesSyntheticAsc = false;
    if (b.horaDesconocida && b.horaFallback !== "mediodia") {
      asc = b.horaFallback === "asc0aries" ? 0 : planets.Sun;
      mc = AstroCalc.norm360(asc + 270); // referencia visual solo para el resumen; sin significado horario real
      housesInfo = { cusps: AstroCalc.houseCusps("whole", ramc, eps, b.lat, asc, mc).cusps, usedFallback: false };
      usesSyntheticAsc = true;
    } else {
      asc = AstroCalc.ascendant(ramc, eps, b.lat);
      mc = AstroCalc.midheaven(ramc, eps);
      const houseSystem = document.getElementById("optHouseSystem").value;
      housesInfo = AstroCalc.houseCusps(houseSystem, ramc, eps, b.lat, asc, mc);
    }

    const node = AstroCalc.meanNodeLon(T);
    const lilith = AstroCalc.meanLilithLon(T);
    const chiron = AstroCalc.chironGeoLon(utcDate);
    const dayChart = AstroCalc.isDayChart(planets.Sun, housesInfo.cusps);
    const fortune = AstroCalc.partOfFortune(planets.Sun, planets.Moon, asc, dayChart);

    const lonOf = { ...planets, Node: node, Lilith: lilith, Chiron: chiron, ASC: asc, MC: mc, Fortune: fortune };

    const selectedKeys = Array.from(document.querySelectorAll("[data-point]:checked")).map(cb => cb.dataset.point);
    const activePoints = POINTS.filter(p => selectedKeys.includes(p.key)).map(p => ({
      key: p.key, label: p.label, symbol: p.symbol, kind: p.kind,
      lon: lonOf[p.key],
      sign: AstroCalc.signOf(lonOf[p.key]),
      house: (b.horaDesconocida && b.horaFallback === "mediodia") ? null : AstroCalc.houseOfPoint(lonOf[p.key], housesInfo.cusps),
    }));

    const activeAspectNames = Array.from(document.querySelectorAll("[data-aspect]:checked")).map(cb => cb.dataset.aspect);
    const orbs = {};
    document.querySelectorAll("[data-orb]").forEach(inp => { orbs[inp.dataset.orb] = parseFloat(inp.value) || 0; });
    const aspectPoints = activePoints.filter(p => p.kind !== undefined).map(p => ({ key: p.key, label: p.label, lon: p.lon }));
    const aspects = AstroCalc.calcAspects(aspectPoints, orbs, activeAspectNames);

    state.result = {
      utcDate, asc, mc, houses: housesInfo.cusps, usedFallback: housesInfo.usedFallback,
      usesSyntheticAsc, activePoints, aspects, dayChart,
      showWheel: document.getElementById("optShowWheel").checked,
      showPositions: document.getElementById("optShowPositions").checked,
      showAspects: document.getElementById("optShowAspects").checked,
    };
    renderResult();
  }

  // ---------- Render del resultado ----------
  function fmtSign(lon) {
    const s = AstroCalc.signOf(lon);
    return `${s.symbol} ${s.name} ${s.degree.toFixed(1)}°`;
  }

  function renderResult() {
    const r = state.result, b = state.birth;

    const fallbackNote = document.getElementById("fallbackNote");
    if (r.usedFallback) {
      fallbackNote.style.display = "block";
      fallbackNote.textContent = "El sistema Plácido no da una división de casas válida en esta latitud/hora — se han calculado con Casas Iguales en su lugar.";
    } else if (r.usesSyntheticAsc) {
      fallbackNote.style.display = "block";
      fallbackNote.textContent = "Como la hora de nacimiento es desconocida, el Ascendente y las casas usan el método elegido en el paso 1, no un cálculo horario real.";
    } else {
      fallbackNote.style.display = "none";
    }

    const horaTxt = b.horaDesconocida ? "hora desconocida" : (b.hour != null ? `${String(b.hour).padStart(2, "0")}:${String(b.minute).padStart(2, "0")} (${b.tipoHora})` : "—");
    document.getElementById("birthSummary").innerHTML = `
      ${b.name ? `<strong>${b.name}</strong><br>` : ""}
      ${b.day}/${b.month}/${b.year} — ${horaTxt}<br>
      ${b.lugarTexto} (lat ${b.lat.toFixed(2)}, lon ${b.lon.toFixed(2)})
    `;

    const wheelWrap = document.getElementById("wheelWrap");
    document.getElementById("positionsWrap").style.display = r.showPositions ? "block" : "none";
    document.getElementById("aspectsWrap").style.display = r.showAspects ? "block" : "none";
    wheelWrap.style.display = r.showWheel ? "flex" : "none";
    if (r.showWheel) wheelWrap.innerHTML = buildWheelSvg(r, 460);

    if (r.showPositions) {
      const rows = r.activePoints.map(p => `
        <tr>
          <td>${p.symbol} ${p.label}</td>
          <td>${fmtSign(p.lon)}</td>
          <td>${p.house || "—"}</td>
        </tr>`).join("");
      document.getElementById("positionsTable").innerHTML = `
        <thead><tr><th>Punto</th><th>Signo</th><th>Casa</th></tr></thead>
        <tbody>${rows}</tbody>`;
    }

    if (r.showAspects) {
      const rows = r.aspects.length ? r.aspects.map(a => `
        <tr><td>${a.aLabel}</td><td>${a.symbol} ${a.aspect}</td><td>${a.bLabel}</td><td>${a.orb}°</td></tr>
      `).join("") : `<tr><td colspan="4">No se ha encontrado ningún aspecto con los orbes elegidos.</td></tr>`;
      document.getElementById("aspectsTable").innerHTML = `
        <thead><tr><th>Punto</th><th>Aspecto</th><th>Punto</th><th>Orbe</th></tr></thead>
        <tbody>${rows}</tbody>`;
    }
  }

  // ---------- Rueda astral en SVG ----------
  const ASPECT_COLOR = {
    "Conjunción": "var(--c-violet-dk)", "Oposición": "var(--c-error)", "Cuadratura": "var(--c-error)",
    "Trígono": "var(--c-aquarius)", "Sextil": "var(--c-aquarius)", "Quincuncio": "var(--c-gold-mute)", "Semisextil": "var(--c-gold-mute)",
  };

  function buildWheelSvg(r, size) {
    const cx = size / 2, cy = size / 2;
    const rOuter = size * 0.48, rSignRing = size * 0.40, rHouseRing = size * 0.33, rPlanetRing = size * 0.26, rAspect = size * 0.24;
    const ascLon = r.asc;

    function toXY(lonDeg, radius) {
      const theta = AstroCalc.deg2rad(180 - AstroCalc.norm360(lonDeg - ascLon));
      return [cx + radius * Math.cos(theta), cy - radius * Math.sin(theta)];
    }

    let svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" font-family="'Segoe UI Symbol', Inter, sans-serif">`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="none" stroke="var(--c-violet)" stroke-width="1"/>`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${rSignRing}" fill="none" stroke="var(--c-line)" stroke-width="1"/>`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${rHouseRing}" fill="none" stroke="var(--c-line)" stroke-width="1"/>`;

    // Signos del zodiaco
    for (let i = 0; i < 12; i++) {
      const startLon = i * 30;
      const [x1, y1] = toXY(startLon, rSignRing);
      const [x2, y2] = toXY(startLon, rOuter);
      svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--c-line)" stroke-width="1"/>`;
      const [sx, sy] = toXY(startLon + 15, (rOuter + rSignRing) / 2);
      svg += `<text x="${sx.toFixed(1)}" y="${sy.toFixed(1)}" font-size="15" fill="var(--c-violet-dk)" text-anchor="middle" dominant-baseline="middle">${AstroCalc.SIGN_SYMBOLS[i]}</text>`;
    }

    // Casas
    r.houses.forEach((cuspLon, i) => {
      const [x1, y1] = toXY(cuspLon, rHouseRing);
      const [x2, y2] = toXY(cuspLon, 0);
      const isAngle = (i === 0 || i === 3 || i === 6 || i === 9);
      svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${isAngle ? 'var(--c-violet-dk)' : 'var(--c-line)'}" stroke-width="${isAngle ? 1.6 : 1}"/>`;
      const [tx, ty] = toXY(AstroCalc.norm360(cuspLon + 6), rHouseRing * 0.88);
      svg += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" font-size="9" fill="var(--c-ink-soft)" text-anchor="middle">${i + 1}</text>`;
    });

    // Líneas de aspecto
    const lonByKey = {}; r.activePoints.forEach(p => { lonByKey[p.key] = p.lon; });
    r.aspects.forEach(a => {
      if (lonByKey[a.a] == null || lonByKey[a.b] == null) return;
      const [x1, y1] = toXY(lonByKey[a.a], rAspect);
      const [x2, y2] = toXY(lonByKey[a.b], rAspect);
      const color = ASPECT_COLOR[a.aspect] || "var(--c-ink-soft)";
      svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="1" opacity="0.55"/>`;
    });

    // Planetas/puntos (con separación simple si dos caen muy cerca)
    const sorted = [...r.activePoints].sort((a, b2) => a.lon - b2.lon);
    const placed = [];
    sorted.forEach(p => {
      let radius = rPlanetRing;
      for (const prev of placed) {
        const diff = Math.abs(AstroCalc.norm360(p.lon - prev.lon + 180) - 180);
        if (diff < 6) radius -= 16;
      }
      placed.push({ lon: p.lon, radius });
      const [x, y] = toXY(p.lon, radius);
      svg += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="14" fill="var(--c-ink)" text-anchor="middle" dominant-baseline="middle">${p.symbol}</text>`;
    });

    svg += `</svg>`;
    return svg;
  }

  // ---------- Exportación a PDF ----------
  function rasterizeSvg(svgString, scale) {
    return new Promise((resolve) => {
      // Sustituye las variables CSS por colores fijos, ya que el motor de imagen
      // que renderiza el SVG fuera del documento no resuelve var(--...).
      const cssVars = {
        "--c-violet": "#7C6A94", "--c-violet-dk": "#5B4B72", "--c-line": "#E4DEEB",
        "--c-ink": "#2E2739", "--c-ink-soft": "#5B5468", "--c-aquarius": "#6C86A0",
        "--c-error": "#A6564B", "--c-gold-mute": "#B9A26B",
      };
      let resolved = svgString;
      Object.entries(cssVars).forEach(([k, v]) => { resolved = resolved.split(`var(${k})`).join(v); });

      const match = resolved.match(/width="(\d+)" height="(\d+)"/);
      const w = match ? parseInt(match[1], 10) : 460, h = match ? parseInt(match[2], 10) : 460;
      const img = new Image();
      const svgBlob = new Blob([resolved], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = w * scale; canvas.height = h * scale;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve({ dataUrl: canvas.toDataURL("image/png"), w, h });
      };
      img.src = url;
    });
  }

  document.getElementById("btnDownloadPdf").addEventListener("click", async () => {
    const btn = document.getElementById("btnDownloadPdf");
    btn.disabled = true; const originalText = btn.textContent; btn.textContent = "Generando PDF...";
    try {
      await generatePdf();
    } catch (err) {
      console.error(err);
      alert("No se ha podido generar el PDF. Prueba de nuevo o contacta si el problema continúa.");
    } finally {
      btn.disabled = false; btn.textContent = originalText;
    }
  });

  async function generatePdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const r = state.result, b = state.birth;
    const pageW = doc.internal.pageSize.getWidth();

    // --- Portada ---
    doc.setFillColor(51, 40, 63); // --c-scorpio
    doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), "F");
    doc.setTextColor(250, 248, 244); // --c-bg (crema)
    doc.setFont("times", "italic");
    doc.setFontSize(26);
    doc.text("aquamoon", pageW / 2, 60, { align: "center" });
    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text("Carta Natal", pageW / 2, 72, { align: "center" });

    doc.setFontSize(11);
    let y = 110;
    const lines = [
      b.name || "",
      `${String(b.day).padStart(2, "0")}/${String(b.month).padStart(2, "0")}/${b.year}`,
      b.horaDesconocida ? "Hora de nacimiento desconocida" : `${String(b.hour).padStart(2, "0")}:${String(b.minute).padStart(2, "0")} (${b.tipoHora})`,
      b.lugarTexto,
    ].filter(Boolean);
    lines.forEach(line => { doc.text(line, pageW / 2, y, { align: "center" }); y += 8; });

    // --- Página 2: rueda ---
    doc.addPage();
    doc.setTextColor(46, 39, 57);
    doc.setFont("times", "italic"); doc.setFontSize(16);
    doc.text("Tu rueda astral", pageW / 2, 20, { align: "center" });
    if (r.showWheel) {
      const svgString = buildWheelSvg(r, 460);
      const { dataUrl } = await rasterizeSvg(svgString, 3);
      const imgSize = 160;
      doc.addImage(dataUrl, "PNG", (pageW - imgSize) / 2, 30, imgSize, imgSize);
    }

    // --- Tabla de posiciones ---
    if (r.showPositions) {
      doc.addPage();
      doc.setFont("times", "italic"); doc.setFontSize(16);
      doc.text("Posiciones planetarias", 14, 20);
      doc.autoTable({
        startY: 28,
        head: [["Punto", "Signo", "Casa"]],
        body: r.activePoints.map(p => [`${p.symbol} ${p.label}`, fmtSign(p.lon), p.house || "—"]),
        headStyles: { fillColor: [91, 75, 114] }, // --c-violet-dk
        styles: { font: "helvetica", fontSize: 10 },
      });
    }

    // --- Tabla de aspectos ---
    if (r.showAspects) {
      const startY = r.showPositions ? doc.lastAutoTable.finalY + 15 : 28;
      if (!r.showPositions) { doc.addPage(); doc.setFont("times", "italic"); doc.setFontSize(16); doc.text("Aspectos", 14, 20); }
      else { doc.setFont("times", "italic"); doc.setFontSize(16); doc.text("Aspectos", 14, startY - 8); }
      doc.autoTable({
        startY,
        head: [["Punto", "Aspecto", "Punto", "Orbe"]],
        body: r.aspects.length ? r.aspects.map(a => [a.aLabel, `${a.symbol} ${a.aspect}`, a.bLabel, `${a.orb}°`]) : [["—", "Sin aspectos con los orbes elegidos", "—", "—"]],
        headStyles: { fillColor: [91, 75, 114] },
        styles: { font: "helvetica", fontSize: 9 },
      });
    }

    const filenameBase = (b.name || "carta-natal").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    doc.save(`${filenameBase || "carta-natal"}.pdf`);
  }

  showStep(1);
});
