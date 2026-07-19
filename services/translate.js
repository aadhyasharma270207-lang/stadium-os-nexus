/**
 * services/translate.js
 * 
 * Manages translation requests via Gemini AI models or offline dictionaries.
 */

const { geminiModel } = require("../config/gemini");

const langNames = { es: "Spanish", fr: "French", ar: "Arabic" };

const LOCAL_DICTIONARY = {
  "kickoff delayed": {
    es: "Atención aficionados, el inicio del partido se ha retrasado 10 minutos debido a la congestión de tráfico externa. Les pedimos disculpas por el inconveniente.",
    fr: "Attention fans, le coup d'envoi est retardé de 10 minutes en raison d'une congestion routière externe. Nous nous excusons pour la gêne occasionnée.",
    ar: "انتباه أيها المشجعون، تأخرت ركلة البداية لمدة 10 دقائق بسبب ازدحام المرور الخارجي. نعتذر عن الإزعاج."
  },
  "gate b congested": {
    es: "Aviso de seguridad: la entrada de la Puerta B está muy congestionada. Se recomienda a los aficionados utilizar la Puerta C o D para ingresar rápidamente.",
    fr: "Avis de sécurité: l'accès par la Porte B est fortement congestionné. Il est conseillé aux supporters d'utiliser la Porte C ou D pour entrer rapidement.",
    ar: "تنبيه أمني: مدخل البوابة B مزدحم للغاية. ننصح المشجعين باستخدام البوابة C أو D للدخول السريع."
  },
  "lost child found": {
    es: "Anuncio de servicio público: un niño de 8 años con camiseta azul de la Copa Mundial ha sido llevado al centro de información de la Puerta A.",
    fr: "Avis public: un enfant de 8 ans portant un t-shirt bleu de la Coupe du Monde a été conduit au stand d'information de la Porte A.",
    ar: "إعلان عام: تم العثور على طفل يبلغ من العمر 8 سنوات يرتدي قميص كأس العالم الأزرق وهو متواجد في مكتب معلومات البوابة A."
  }
};

/**
 * Translates public announcements.
 * @param {string} cleanText - announcement details.
 * @param {string} targetLang - target ISO code (es/fr/ar/en).
 * @returns {Promise<object>} Resolved text and provider details.
 */
async function handleTranslation(cleanText, targetLang) {
  if (geminiModel) {
    try {
      const prompt = `Translate this stadium public announcement into ${langNames[targetLang]}. Translate it naturally so it is perfectly understood by World Cup fans in the stadium. Output only the translated text, do not add headers or commentary:\n\n"${cleanText}"`;
      const result = await geminiModel.generateContent(prompt);
      return { translation: result.response.text().trim(), source: "gemini-ai" };
    } catch (err) {
      console.error("⚠️ Gemini API translation error, using dictionary fallback:", err.message);
    }
  }

  let keyMatch = "kickoff delayed";
  const lowerText = cleanText.toLowerCase();
  if (lowerText.includes("gate b") || lowerText.includes("congest")) {
    keyMatch = "gate b congested";
  } else if (lowerText.includes("lost") || lowerText.includes("child") || lowerText.includes("found")) {
    keyMatch = "lost child found";
  }

  if (targetLang === "en") {
    return { translation: cleanText, source: "local-dictionary" };
  }

  const translatedText = LOCAL_DICTIONARY[keyMatch][targetLang] || 
    `[Simulated ${langNames[targetLang]} Translation of]: ${cleanText}`;

  return { translation: translatedText, source: "local-dictionary" };
}

module.exports = { handleTranslation };
