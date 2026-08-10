/**
 * Open Location Number Platform — Multilingual Translations Dictionary.
 * 
 * Languages supported:
 *   - English ('en')
 *   - Hindi - हिंदी ('hi')
 *   - Spanish - Español ('es')
 *   - French - Français ('fr')
 *   - Arabic - العربية ('ar')
 *   - Bengali - বাংলা ('bn')
 */

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇦🇪', dir: 'rtl' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇧🇩', dir: 'ltr' }
];

export const TRANSLATIONS = {
  en: {
    // Navigation (Original Finalized Names)
    nav_brand: "Open Location Number",
    nav_badge: "Dash Number",
    nav_home: "Home",
    nav_why: "Why OLN",
    nav_technology: "Technology",
    nav_docs: "Docs",
    nav_address_maker: "Address Maker",
    nav_support: "Support",
    nav_contact: "Contact",
    nav_try: "Try Product",

    // Hero Section
    hero_title: "Pure-Numeric Geocoding for Every Metre on Earth",
    hero_subtitle: "Like a postal code made only of numbers. Spoken over phone, texted by SMS in any language with built-in Damm check digit mistake protection.",
    hero_gps_button: "📍 Use My GPS Location",
    hero_encode_button: "Encode Dash Number",
    hero_search_placeholder: "Search place name, PIN code, or landmark...",

    // Engine Tabs
    tab_encode: "1. ENCODE ENGINE",
    tab_decode: "2. DECODE ENGINE",
    tab_validate: "3. DAMM CHECKSUM",
    tab_shorten: "4. LOCALITY SHORTEN",
    tab_recover: "5. RECOVER FULL CODE",

    // Encode Tab
    encode_title: "1. Encode Engine",
    encode_sub: "LAT/LON → DASH CODE",
    encode_active_location: "ACTIVE TARGET LOCATION",
    encode_lat_label: "Latitude (°N/S)",
    encode_lon_label: "Longitude (°E/W)",
    encode_precision_label: "Grid Precision Depth",
    encode_btn: "Encode Dash Number",
    encode_dash_num_label: "Active Dash Number",

    // Decode Tab
    decode_title: "2. Decode Engine & Bounding Box",
    decode_sub: "DASH CODE → BOUNDING BOX POLYGON",
    decode_input_label: "Dash Code to Decode",
    decode_btn: "Decode to Bounding Box Polygon",
    decode_result_title: "DECODED RESULT",
    decode_center_label: "Decoded Center Coordinates",
    decode_sw_label: "South-West Boundary",
    decode_ne_label: "North-East Boundary",

    // Validate Tab
    validate_title: "3. Damm Checksum Validation",
    validate_sub: "Tests position-14 check digit over 13 backbone digits",
    validate_input_label: "Dash Code to Validate",
    validate_btn: "Run Damm Quasigroup Checksum Test",
    validate_valid_msg: "VALID DASH NUMBER",
    validate_invalid_msg: "INVALID CODE",

    // Shorten Tab
    shorten_title: "4. Shorten Code Engine",
    shorten_sub: "Removes leading digits matching reference locality",
    shorten_input_label: "Full Code to Shorten",
    shorten_ref_lat: "Reference Lat",
    shorten_ref_lon: "Reference Lon",
    shorten_btn: "Compute Locality Short Code",
    shorten_output_label: "Locality Short Code Display:",

    // Recover Tab
    recover_title: "5. Recover Full Code Engine",
    recover_sub: "Reconstructs full canonical code from short form",
    recover_input_label: "Short Code",
    recover_ref_lat: "Reference Lat",
    recover_ref_lon: "Reference Lon",
    recover_btn: "Recover Full Canonical Code",
    recover_output_label: "Recovered Full Code:",

    // Common Actions & Labels
    copy: "Copy",
    copied: "Copied!",
    share: "Share",
    shared: "Link Copied!",
    search: "Search",
    location: "Location",
    error: "Error"
  },

  hi: {
    // Navigation
    nav_brand: "ओपन लोकेशन नंबर",
    nav_badge: "डैश नंबर",
    nav_home: "मुख्य पृष्ठ",
    nav_why: "ओएलएन क्यों",
    nav_technology: "तकनीकी (Technology)",
    nav_docs: "दस्तावेज़ (Docs)",
    nav_address_maker: "पता निर्माता",
    nav_support: "सहायता",
    nav_contact: "संपर्क करें",
    nav_try: "उत्पाद आज़माएं",

    // Hero Section
    hero_title: "पृथ्वी के हर मीटर के लिए शुद्ध-संख्यात्मक जियोकोडिंग",
    hero_subtitle: "केवल अंकों से बना एक पिन कोड। किसी भी भाषा में फ़ोन या एसएमएस पर बोलें और भेजें, डम चेक डिजिट त्रुटि सुरक्षा के साथ।",
    hero_gps_button: "📍 मेरा जीपीएस लोकेशन उपयोग करें",
    hero_encode_button: "डैश नंबर कोड करें",
    hero_search_placeholder: "स्थान का नाम, पिन कोड या लैंडमार्क खोजें...",

    // Engine Tabs
    tab_encode: "1. एन्कोडिंग इंजन",
    tab_decode: "2. डिकोडिंग इंजन",
    tab_validate: "3. डम चेकसम",
    tab_shorten: "4. स्थान छोटा कोड",
    tab_recover: "5. पूरा कोड पुनर्प्राप्त करें",

    // Encode Tab
    encode_title: "1. एन्कोडिंग इंजन",
    encode_sub: "अक्षांश/देशांतर → डैश कोड",
    encode_active_location: "सक्रिय लक्ष्य स्थान",
    encode_lat_label: "अक्षांश (°N/S)",
    encode_lon_label: "देशांतर (°E/W)",
    encode_precision_label: "ग्रिड सटीकता गहराई",
    encode_btn: "डैश नंबर जेनरेट करें",
    encode_dash_num_label: "सक्रिय डैश नंबर",

    // Common Actions
    copy: "कॉपी करें",
    copied: "कॉपी हो गया!",
    share: "शेयर करें",
    shared: "लिंक कॉपी हो गया!",
    search: "खोजें",
    location: "स्थान",
    error: "त्रुटि"
  },

  es: {
    // Navigation
    nav_brand: "Open Location Number",
    nav_badge: "Dash Number",
    nav_home: "Inicio",
    nav_why: "Por qué OLN",
    nav_technology: "Tecnología",
    nav_docs: "Documentación",
    nav_address_maker: "Generador Direcciones",
    nav_support: "Soporte",
    nav_contact: "Contacto",
    nav_try: "Probar Producto",

    // Hero Section
    hero_title: "Geocodificación Puramente Numérica para Cada Metro de la Tierra",
    hero_subtitle: "Como un código postal hecho solo de números. Dígalo por teléfono o envíelo por SMS en cualquier idioma con protección contra errores Damm.",
    hero_gps_button: "📍 Usar Mi Ubicación GPS",
    hero_encode_button: "Codificar Número Dash",
    hero_search_placeholder: "Buscar ciudad, código postal o lugar...",

    // Common Actions
    copy: "Copiar",
    copied: "¡Copiado!",
    share: "Compartir",
    shared: "¡Enlace Copiado!",
    search: "Buscar",
    location: "Ubicación",
    error: "Error"
  },

  fr: {
    // Navigation
    nav_brand: "Open Location Number",
    nav_badge: "Dash Number",
    nav_home: "Accueil",
    nav_why: "Pourquoi OLN",
    nav_technology: "Technologie",
    nav_docs: "Docs",
    nav_address_maker: "Générateur d'Adresses",
    nav_support: "Support",
    nav_contact: "Contact",
    nav_try: "Essayer Produit",

    // Hero Section
    hero_title: "Géocodage Purement Numérique pour Chaque Mètre de la Terre",
    hero_subtitle: "Comme un code postal composé uniquement de chiffres. Transmettez-le par téléphone ou SMS dans n'importe quelle langue grâce au contrôle d'erreur Damm.",
    hero_gps_button: "📍 Utiliser Ma Position GPS",
    hero_encode_button: "Encoder le Dash Number",
    hero_search_placeholder: "Rechercher une ville, un code postal...",

    // Common Actions
    copy: "Copier",
    copied: "Copié !",
    share: "Partager",
    shared: "Lien copié !",
    search: "Rechercher",
    location: "Position",
    error: "Erreur"
  },

  ar: {
    // Navigation
    nav_brand: "رقم الموقع المفتوح",
    nav_badge: "رقم Dash",
    nav_home: "الرئيسية",
    nav_why: "لماذا OLN",
    nav_technology: "التقنية (Technology)",
    nav_docs: "الوثائق (Docs)",
    nav_address_maker: "منشئ العناوين",
    nav_support: "الدعم",
    nav_contact: "اتصل بنا",
    nav_try: "تجربة المنتج",

    // Hero Section
    hero_title: "ترميز جغرافي رقمي خالص لكل متر على كوكب الأرض",
    hero_subtitle: "مثل الرمز البريدي المكون من أرقام فقط. اقرأه عبر الهاتف أو أرسله عبر SMS بأي لغة مع حماية تلقائية من الأخطاء باستخدام خوارزمية Damm.",
    hero_gps_button: "📍 استخدام موقعي عبر الـ GPS",
    hero_encode_button: "ترميز رقم Dash",
    hero_search_placeholder: "ابحث عن اسم مكان، رمز بريدي، أو معالم...",

    // Common Actions
    copy: "نسخ",
    copied: "تم النسخ!",
    share: "مشاركة",
    shared: "تم نسخ الرابط!",
    search: "بحث",
    location: "الموقع",
    error: "خطأ"
  },

  bn: {
    // Navigation
    nav_brand: "ওপেন লোকেশন নম্বর",
    nav_badge: "ড্যাশ নম্বর",
    nav_home: "হোম",
    nav_why: "কেন ওএলএন",
    nav_technology: "প্রযুক্তি (Technology)",
    nav_docs: "ডকুমেন্টস (Docs)",
    nav_address_maker: "ঠিকানা নির্মাতা",
    nav_support: "সহায়তা",
    nav_contact: "যোগাযোগ",
    nav_try: "প্রোডাক্ট চেষ্টা করুন",

    // Hero Section
    hero_title: "পৃথিবীর প্রতি মিটারের জন্য সম্পূর্ণ সংখ্যাসূচক জিওকোডিং",
    hero_subtitle: "শুধু সংখ্যা দিয়ে তৈরি একটি পিন কোড। ফোনের মাধ্যমে বলুন বা যেকোনো ভাষায় এসএমেস পাঠাও ড্যাম চেক ডিজিট সুরক্ষা সহ।",
    hero_gps_button: "📍 আমার জিপিএস অবস্থান ব্যবহার করুন",
    hero_encode_button: "ড্যাশ নম্বর এনকোড করুন",
    hero_search_placeholder: "স্থানের নাম, পিন কোড বা ল্যান্ডমার্ক খুঁজুন...",

    // Common Actions
    copy: "কপি করুন",
    copied: "কপি হয়েছে!",
    share: "শেয়ার করুন",
    shared: "লিঙ্ক কপি হয়েছে!",
    search: "খুঁজুন",
    location: "অবস্থান",
    error: "ত্রুটি"
  }
};
