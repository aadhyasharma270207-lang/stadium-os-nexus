/**
 * public/js/state.js
 * 
 * Application state manager and multi-language translation dictionaries.
 * Decouples state mutations and locale conversions from UI painting loops.
 */

// ----------------------------------------------------
// Global Translation Dictionary
// ----------------------------------------------------
const TRANSLATIONS = {
  es: {
    "hero-title-main": "Navega MetLife Stadium Como un Profesional",
    "hero-desc-main": "Tu compañero inteligente para los partidos de la Copa Mundial de la FIFA 2026. Obtén rutas alternativas con IA, telemetría de densidad de multitudes en vivo, tiempos de espera de comida y traducción de anuncios.",
    "hero-cta-seat": "Buscar Tu Asiento",
    "hero-cta-ai": "Preguntar al Asistente IA",
    "title-services": "Servicios del Estadio",
    "card-title-seat": "Buscador de Asiento y Puerta",
    "card-desc-seat": "Ubica las mejores rutas a tu puesto y evita entradas congestionadas.",
    "card-title-chat": "Soporte IA para Fanáticos",
    "card-desc-chat": "Pregunta sobre baños, puertas, seguridad y puestos de comida.",
    "card-title-parking": "Estacionamiento Inteligente",
    "card-desc-parking": "Ver capacidad de lotes en vivo, tarifas, puntos de carga EV y transporte.",
    "card-title-schedule": "Calendario y En Vivo",
    "card-desc-schedule": "Ver horas de partidos, alineaciones de equipos y cuartos de final en tiempo real.",
    "card-title-food": "Comida y Espera",
    "card-desc-food": "Descubre locales, opciones veganas y filtra por el menor tiempo de espera.",
    "card-title-emergency": "Emergencia y Ayuda",
    "card-desc-emergency": "Salas médicas instantáneas, escaleras de evacuación y contactos de seguridad.",
    "title-seat-finder": "Buscador de Asientos y Navegación",
    "control-panel-header": "Localizar Asiento",
    "control-panel-desc": "Ingresa el código de tu boleto (ej. B12) o haz clic en las tribunas para ver rutas.",
    "lbl-seat-input": "Código de Asiento / Boleto:",
    "btn-search-seat": "Buscar Asiento",
    "lbl-inspect-stands": "Inspeccionar Tribunas:",
    "inspect-feedback-box": "Haz clic en cualquier tribuna o puerta para ver detalles de espera y capacidad.",
    "title-chat-panel": "Soporte Fanático (Desarrollado por Gemini AI)",
    "lbl-quick-questions": "Preguntas Frecuentes:",
    "btn-chat-send": "Enviar 🚀",
    "title-parking-panel": "Estacionamiento y Tránsito Inteligente",
    "title-food-panel": "Puestos de Comida y Tiempos de Espera",
    "title-schedule-panel": "Calendario de Partidos FIFA World Cup 2026",
    "lbl-schedule-search": "Filtrar calendario por equipo:",
    "title-translator-panel": "Traductor de Anuncios en Vivo",
    "title-a11y-services": "Servicios de Accesibilidad e Inclusión",
    "title-emergency-section": "Centro de Seguridad SOS y Emergencias",
    "lbl-status-connected": "Conectado a los Sensores de Telemetría del Estadio",
    "btn-announce-translation": "🔊 Leer en Voz Alta",
    "btn-translate-announcement": "Traducir Anuncio",
    "lbl-quick-translate": "Seleccionar anuncio para traducir:",
    "seat-error-feedback": "Por favor, introduce un código de asiento válido (ej. B12).",
    "route-details-title": "Detalles de Navegación del Asiento",
    "route-steps-title": "Instrucciones de Ruta:",
    "route-alt-title": "🔄 Recomendación de Ruta Alternativa de IA:",
    "title-crowd-telemetry": "Telemetría de Multitudes y Puertas en Vivo",
    "desc-crowd-telemetry": "Datos en tiempo real de sensores en entradas, colas de seguridad y salidas de emergencia.",
    "subtitle-gate-status": "🚪 Tráfico en Puertas de Entrada",
    "subtitle-ai-routing": "🤖 Recomendaciones de Rutas y Evacuación de IA",
    "lbl-alt-exit-rec": "🔄 Salida alternativa recomendada:",
    "desc-alt-exit-rec": "Debido al alto tráfico en la Puerta B (Tribuna Este), se recomienda salir por la Puerta C o D para evitar esperas.",
    "lbl-est-walk-exits": "🚶 Tiempos de Caminata Estimados a las Salidas:",
    "title-lost-found": "Registro de Objetos Perdidos",
    "desc-lost-found-summary": "La oficina principal está en la Puerta A (Concurrencia Norte). Los objetos se guardan de forma segura por 30 días."
  },
  fr: {
    "hero-title-main": "Naviguez dans le MetLife Stadium comme un pro",
    "hero-desc-main": "Votre compagnon intelligent pour les matchs de la Coupe du Monde de la FIFA 2026. Obtenez des itinéraires alternatifs via l'IA, la densité de foule en direct, les temps d'attente aux stands et des traductions.",
    "hero-cta-seat": "Trouver Votre Siège",
    "hero-cta-ai": "Demander à l'IA",
    "title-services": "Services du Stade",
    "card-title-seat": "Trouver Siège et Porte",
    "card-desc-seat": "Repérez les meilleurs trajets vers votre siège et évitez les portes encombrées.",
    "card-title-chat": "Assistance IA aux Supporters",
    "card-desc-chat": "Posez vos questions sur les sanitaires, les accès, la sécurité et la restauration.",
    "card-title-parking": "Parking Intelligent",
    "card-desc-parking": "Suivez en direct la capacité des parkings, les tarifs, les bornes de recharge et navettes.",
    "card-title-schedule": "Calendrier et Direct",
    "card-desc-schedule": "Consultez les horaires, les compositions et le statut des quarts de finale en direct.",
    "card-title-food": "Restauration et Attente",
    "card-desc-food": "Découvrez les stands, les plats végétaliens et triez selon l'attente la plus courte.",
    "card-title-emergency": "Urgences et Secours",
    "card-desc-emergency": "Accès immédiat aux infirmeries, issues d'évacuation et contacts de sécurité.",
    "title-seat-finder": "Recherche de Siège & Plan du Stade",
    "control-panel-header": "Localiser un Siège",
    "control-panel-desc": "Entrez le code de votre billet (ex. B12) ou cliquez sur le plan pour calculer les trajets.",
    "lbl-seat-input": "Numéro de Siège / Billet :",
    "btn-search-seat": "Rechercher",
    "lbl-inspect-stands": "Inspecter les Tribunes :",
    "inspect-feedback-box": "Cliquez sur une tribune ou une porte pour afficher l'affluence et le temps d'attente.",
    "title-chat-panel": "Support Supporter (Alimenté par Gemini AI)",
    "lbl-quick-questions": "Questions Fréquentes :",
    "btn-chat-send": "Envoyer 🚀",
    "title-parking-panel": "Stationnement & Transports Connectés",
    "title-food-panel": "Stands de Restauration & Attente",
    "title-schedule-panel": "Calendrier des Matchs de la Coupe du Monde 2026",
    "lbl-schedule-search": "Filtrer les matchs par équipe :",
    "title-translator-panel": "Traducteur d'Annonces en Direct",
    "title-a11y-services": "Accessibilité & Services d'Inclusion",
    "title-emergency-section": "Centre de Sécurité SOS et Urgences",
    "lbl-status-connected": "Connecté aux capteurs de télémétrie du stade",
    "btn-announce-translation": "🔊 Lire à haute voix",
    "btn-translate-announcement": "Traduire l'annonce",
    "lbl-quick-translate": "Sélectionner une annonce à traduire :",
    "seat-error-feedback": "Veuillez entrer un code de siège valide (ex. B12).",
    "route-details-title": "Détails de navigation du siège",
    "route-steps-title": "Directives de trajet :",
    "route-alt-title": "🔄 Itinéraire alternatif suggéré par l'IA :",
    "title-crowd-telemetry": "Télémétrie de la Foule & des Portes en Direct",
    "desc-crowd-telemetry": "Flux de capteurs en temps réel aux entrées, files d'attente de sécurité et sorties de secours.",
    "subtitle-gate-status": "🚪 Trafic des Portes d'Entrée",
    "subtitle-ai-routing": "🤖 Conseils d'Itinéraire & d'Évacuation par l'IA",
    "lbl-alt-exit-rec": "🔄 Sortie alternative recommandée :",
    "desc-alt-exit-rec": "En raison d'un trafic important à la Porte B (Tribune Est), il est conseillé de sortir par la Porte C ou D pour éviter l'attente.",
    "lbl-est-walk-exits": "🚶 Temps de marche estimés vers les sorties :",
    "title-lost-found": "Registre des Objets Trouvés",
    "desc-lost-found-summary": "Le bureau principal est à la Porte A (Concourse Nord). Objets conservés en sécurité pendant 30 jours."
  },
  ar: {
    "hero-title-main": "تصفح استاد ميتلايف كالمحترفين",
    "hero-desc-main": "دليلك الذكي لمباريات كأس العالم 2026. احصل على طرق بديلة مدعومة بالذكاء الاصطناعي، وتحديثات الازدحام المباشر، وتوقيتات انتظار الأطعمة وتراجم الإعلانات.",
    "hero-cta-seat": "البحث عن مقعدك",
    "hero-cta-ai": "اسأل مساعد الذكاء الاصطناعي",
    "title-services": "خدمات الاستاد",
    "card-title-seat": "مكتشف المقاعد والبوابات",
    "card-desc-seat": "حدد أفضل الطرق لمقعدك وتجنب البوابات المزدحمة.",
    "card-title-chat": "دعم المشجعين بالذكاء الاصطناعي",
    "card-desc-chat": "اسأل عن دورات المياه، البوابات، مراكز الأمن، ومنافذ الطعام.",
    "card-title-parking": "مواقف السيارات الذكية",
    "card-desc-parking": "شاهد سعة المواقف المباشرة، الأسعار، نقاط شحن السيارات الكهربائية والحافلات.",
    "card-title-schedule": "المباريات والنتائج المباشرة",
    "card-desc-schedule": "تحقق من مواعيد المباريات، تشكيلات الفرق وحالة ربع النهائي المباشرة.",
    "card-title-food": "الطعام وأوقات الانتظار",
    "card-desc-food": "اكتشف منافذ الأطعمة، الخيارات النباتية، ورتب حسب أقصر وقت انتظار.",
    "card-title-emergency": "الطوارئ والمساعدة",
    "card-desc-emergency": "الغرف الطبية الفورية، سلالم الإخلاء، وجهات الاتصال الأمنية.",
    "title-seat-finder": "مكتشف المقاعد وتصفح الاستاد",
    "control-panel-header": "تحديد موقع المقعد",
    "control-panel-desc": "أدخل رمز تذكرتك (مثال B12) أو انقر على المدرجات لعرض المسارات.",
    "lbl-seat-input": "رمز المقعد / التذكرة:",
    "btn-search-seat": "بحث عن المقعد",
    "lbl-inspect-stands": "فحص مدرجات الاستاد:",
    "inspect-feedback-box": "انقر على أي مدرج أو بوابة لعرض تفاصيل الازدحام والانتظار.",
    "title-chat-panel": "دعم المشجعين (مدعوم بذكاء Gemini الاصطناعي)",
    "lbl-quick-questions": "الأسئلة الشائعة:",
    "btn-chat-send": "إرسال 🚀",
    "title-parking-panel": "مواقف السيارات والنقل الذكي",
    "title-food-panel": "منافذ الطعام وأوقات الانتظار المباشرة",
    "title-schedule-panel": "جدول مباريات كأس العالم FIFA 2026",
    "lbl-schedule-search": "تصفية الجدول حسب الفريق:",
    "title-translator-panel": "مترجم الإعلانات المباشرة",
    "title-a11y-services": "خدمات سهولة الوصول والدمج",
    "title-emergency-section": "مركز طوارئ SOS والسلامة",
    "lbl-status-connected": "متصل بحساسات القياس عن بعد في الاستاد",
    "btn-announce-translation": "🔊 القراءة الصوتية",
    "btn-translate-announcement": "ترجمة الإعلان",
    "lbl-quick-translate": "اختر إعلاناً لترجمته:",
    "seat-error-feedback": "يرجى إدخال رمز مقعد صحيح (مثال: B12).",
    "route-details-title": "تفاصيل الملاحة للمقعد",
    "route-steps-title": "تعليمات المسار:",
    "route-alt-title": "🔄 اقتراح مسار بديل بالذكاء الاصطناعي:",
    "title-crowd-telemetry": "قياسات حشود الاستاد وحالة البوابات المباشرة",
    "desc-crowd-telemetry": "بيانات الحساسات المباشرة للمداخل، طوابير التفتيش ومخارج الطوارئ.",
    "subtitle-gate-status": "🚪 حركة المرور عند بوابات الدخول",
    "subtitle-ai-routing": "🤖 توجيهات الذكاء الاصطناعي للمسارات والإخلاء",
    "lbl-alt-exit-rec": "🔄 مخرج بديل موصى به:",
    "desc-alt-exit-rec": "نظراً للازدحام الشديد عند البوابة B (المدرج الشرقي)، ننصح المشجعين بالخروج عبر البوابة C أو D لتوفير الوقت.",
    "lbl-est-walk-exits": "🚶 أوقات السير التقريبية لأقرب مخارج طوارئ:",
    "title-lost-found": "سجل المفقودات والموجودات",
    "desc-lost-found-summary": "المكتب الرئيسي يقع عند البوابة A (الممر الشمالي). تحتفظ بالأشياء بشكل آمن لمدة 30 يوماً."
  }
};

// ----------------------------------------------------
// Frontend State Store
// ----------------------------------------------------
const State = {
  // Application settings states
  language: "en",
  fontScale: 1.0,
  highContrast: false,
  
  // App views state
  activeTab: "hero",
  selectedStand: null,
  selectedGate: null,
  sosTriggered: false,

  // Sensors Cache
  stadiumTelemetry: null,

  /**
   * Initializes state elements. Matches local storage variables if saved.
   */
  init() {
    this.language = localStorage.getItem("nexus_lang") || "en";
    this.fontScale = parseFloat(localStorage.getItem("nexus_font_scale")) || 1.0;
    this.highContrast = localStorage.getItem("nexus_contrast") === "true";
  },

  /**
   * Toggles High Contrast mode.
   * @returns {boolean} New contrast state.
   */
  toggleContrast() {
    this.highContrast = !this.highContrast;
    localStorage.setItem("nexus_contrast", this.highContrast);
    return this.highContrast;
  },

  /**
   * Increases accessibility base font size.
   * @returns {number} New font scale.
   */
  increaseFont() {
    if (this.fontScale < 1.45) {
      this.fontScale = parseFloat((this.fontScale + 0.15).toFixed(2));
      localStorage.setItem("nexus_font_scale", this.fontScale);
    }
    return this.fontScale;
  },

  /**
   * Decreases accessibility base font size.
   * @returns {number} New font scale.
   */
  decreaseFont() {
    if (this.fontScale > 0.75) {
      this.fontScale = parseFloat((this.fontScale - 0.15).toFixed(2));
      localStorage.setItem("nexus_font_scale", this.fontScale);
    }
    return this.fontScale;
  },

  /**
   * Resets accessibility font size.
   * @returns {number} Reset scale.
   */
  resetFont() {
    this.fontScale = 1.0;
    localStorage.setItem("nexus_font_scale", 1.0);
    return this.fontScale;
  },

  /**
   * Updates interface language.
   * @param {string} langCode - 'en', 'es', 'fr', 'ar'.
   */
  setLanguage(langCode) {
    this.language = langCode;
    localStorage.setItem("nexus_lang", langCode);
  },

  /**
   * Calculates navigation path to Seat B12 and alternates based on active telemetry.
   * @param {string} code - The seat lookup query.
   * @returns {Object|null} Direction instructions or null if unmatched.
   */
  calculateSeatRoute(code) {
    const cleanCode = code.toUpperCase().replace(/\s/g, "");
    
    // We explicitly match Seat B12 as defined in specs
    if (cleanCode === "B12" || cleanCode === "SEATB12") {
      const gateBAlertActive = this.stadiumTelemetry?.alerts?.some(
        a => a.location.includes("Gate B") && a.severity === "High"
      );

      return {
        stand: "East Stand",
        gate: "Gate B",
        walkTime: "4 mins",
        steps: [
          "Enter MetLife Stadium via Gate B (East Stand).",
          "Follow the concourse path straight towards Section 102.",
          "Ascend Section 102 steps to Row B and locate Seat 12."
        ],
        alternate: gateBAlertActive ? {
          gate: "Gate C",
          walkTime: "7 mins",
          desc: "Gate B (East Stand) is currently experiencing critical security bottlenecks (85% capacity). We recommend entering through **Gate C (South Stand)**. Walk the inner lower ring walkway around to Section 102. This avoids a 15-minute wait queue."
        } : null
      };
    }
    
    return null;
  },

  /**
   * Resolves nearest safety stations and walking times based on active stand inspection.
   * @param {string} standName - 'North', 'East', 'South', 'West'.
   * @returns {Object} Primary safety points.
   */
  getSafetyPointsForStand(standName) {
    const safety = this.stadiumTelemetry?.safety;
    if (!safety) {
      return { medical: "First-Aid Center (Gate A)", security: "Security Center" };
    }

    if (standName === "North" || standName === "West") {
      return {
        medical: safety.locations.medical[0].name + " (" + safety.locations.medical[0].nearestGate + ")",
        security: safety.locations.security[0].name + " (" + safety.locations.security[0].nearestGate + ")"
      };
    } else {
      return {
        medical: safety.locations.medical[1].name + " (" + safety.locations.medical[1].nearestGate + ")",
        security: safety.locations.security[1].name + " (" + safety.locations.security[1].nearestGate + ")"
      };
    }
  }
};
