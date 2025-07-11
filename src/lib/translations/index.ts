// src/lib/translations/index.ts
// Dynamically load translation files by language code

export type TranslationKeys = typeof import('./en').default;

export async function getTranslationAsync(langCode: string): Promise<TranslationKeys> {
  switch (langCode) {
    case 'am': return (await import('./am')).default;
    case 'ar': return (await import('./ar')).default;
    case 'bg': return (await import('./bg')).default;
    case 'bn': return (await import('./bn')).default;
    case 'bs': return (await import('./bs')).default;
    case 'ca': return (await import('./ca')).default;
    case 'cs': return (await import('./cs')).default;
    case 'da': return (await import('./da')).default;
    case 'de': return (await import('./de')).default;
    case 'el': return (await import('./el')).default;
    case 'en': return (await import('./en')).default;
    case 'es': return (await import('./es')).default;
    case 'et': return (await import('./et')).default;
    case 'fa': return (await import('./fa')).default;
    case 'fi': return (await import('./fi')).default;
    case 'fr': return (await import('./fr')).default;
    case 'gu': return (await import('./gu')).default;
    case 'hi': return (await import('./hi')).default;
    case 'hr': return (await import('./hr')).default;
    case 'hu': return (await import('./hu')).default;
    case 'hy': return (await import('./hy')).default;
    case 'id': return (await import('./id')).default;
    case 'is': return (await import('./is')).default;
    case 'it': return (await import('./it')).default;
    case 'iw': return (await import('./iw')).default;
    case 'ja': return (await import('./ja')).default;
    case 'ka': return (await import('./ka')).default;
    case 'kk': return (await import('./kk')).default;
    case 'kn': return (await import('./kn')).default;
    case 'ko': return (await import('./ko')).default;
    case 'lt': return (await import('./lt')).default;
    case 'lv': return (await import('./lv')).default;
    case 'mk': return (await import('./mk')).default;
    case 'ml': return (await import('./ml')).default;
    case 'mn': return (await import('./mn')).default;
    case 'mr': return (await import('./mr')).default;
    case 'ms': return (await import('./ms')).default;
    case 'mt': return (await import('./mt')).default;
    case 'my': return (await import('./my')).default;
    case 'nl': return (await import('./nl')).default;
    case 'no': return (await import('./no')).default;
    case 'pa': return (await import('./pa')).default;
    case 'pl': return (await import('./pl')).default;
    case 'pt': return (await import('./pt')).default;
    case 'ro': return (await import('./ro')).default;
    case 'ru': return (await import('./ru')).default;
    case 'sk': return (await import('./sk')).default;
    case 'sl': return (await import('./sl')).default;
    case 'so': return (await import('./so')).default;
    case 'sq': return (await import('./sq')).default;
    case 'sr': return (await import('./sr')).default;
    case 'sv': return (await import('./sv')).default;
    case 'sw': return (await import('./sw')).default;
    case 'ta': return (await import('./ta')).default;
    case 'te': return (await import('./te')).default;
    case 'th': return (await import('./th')).default;
    case 'tl': return (await import('./tl')).default;
    case 'tr': return (await import('./tr')).default;
    case 'uk': return (await import('./uk')).default;
    case 'ur': return (await import('./ur')).default;
    case 'vi': return (await import('./vi')).default;
    case 'zh': return (await import('./zh')).default;
    default: return (await import('./en')).default;
  }
}