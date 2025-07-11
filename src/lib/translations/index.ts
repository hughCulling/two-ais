// src/lib/translations/index.ts
// Dynamically load translation files by language code

export type TranslationKeys = typeof import('./en').en;

export async function getTranslationAsync(langCode: string): Promise<TranslationKeys> {
  switch (langCode) {
    case 'am': return (await import('./am')).am;
    case 'ar': return (await import('./ar')).ar;
    case 'bg': return (await import('./bg')).bg;
    case 'bn': return (await import('./bn')).bn;
    case 'bs': return (await import('./bs')).bs;
    case 'ca': return (await import('./ca')).ca;
    case 'cs': return (await import('./cs')).cs;
    case 'da': return (await import('./da')).da;
    case 'de': return (await import('./de')).de;
    case 'el': return (await import('./el')).el;
    case 'en': return (await import('./en')).en;
    case 'es': return (await import('./es')).es;
    case 'et': return (await import('./et')).et;
    case 'fa': return (await import('./fa')).fa;
    case 'fi': return (await import('./fi')).fi;
    case 'fr': return (await import('./fr')).fr;
    case 'gu': return (await import('./gu')).gu;
    case 'hi': return (await import('./hi')).hi;
    case 'hr': return (await import('./hr')).hr;
    case 'hu': return (await import('./hu')).hu;
    case 'hy': return (await import('./hy')).hy;
    case 'id': return (await import('./id')).id;
    case 'is': return (await import('./is')).is;
    case 'it': return (await import('./it')).it;
    case 'iw': return (await import('./iw')).iw;
    case 'ja': return (await import('./ja')).ja;
    case 'ka': return (await import('./ka')).ka;
    case 'kk': return (await import('./kk')).kk;
    case 'kn': return (await import('./kn')).kn;
    case 'ko': return (await import('./ko')).ko;
    case 'lt': return (await import('./lt')).lt;
    case 'lv': return (await import('./lv')).lv;
    case 'mk': return (await import('./mk')).mk;
    case 'ml': return (await import('./ml')).ml;
    case 'mn': return (await import('./mn')).mn;
    case 'mr': return (await import('./mr')).mr;
    case 'ms': return (await import('./ms')).ms;
    case 'mt': return (await import('./mt')).mt;
    case 'my': return (await import('./my')).my;
    case 'nl': return (await import('./nl')).nl;
    case 'no': return (await import('./no')).no;
    case 'pa': return (await import('./pa')).pa;
    case 'pl': return (await import('./pl')).pl;
    case 'pt': return (await import('./pt')).pt;
    case 'ro': return (await import('./ro')).ro;
    case 'ru': return (await import('./ru')).ru;
    case 'sk': return (await import('./sk')).sk;
    case 'sl': return (await import('./sl')).sl;
    case 'so': return (await import('./so')).so;
    case 'sq': return (await import('./sq')).sq;
    case 'sr': return (await import('./sr')).sr;
    case 'sv': return (await import('./sv')).sv;
    case 'sw': return (await import('./sw')).sw;
    case 'ta': return (await import('./ta')).ta;
    case 'te': return (await import('./te')).te;
    case 'th': return (await import('./th')).th;
    case 'tl': return (await import('./tl')).tl;
    case 'tr': return (await import('./tr')).tr;
    case 'uk': return (await import('./uk')).uk;
    case 'ur': return (await import('./ur')).ur;
    case 'vi': return (await import('./vi')).vi;
    case 'zh': return (await import('./zh')).zh;
    default: return (await import('./en')).en;
  }
}