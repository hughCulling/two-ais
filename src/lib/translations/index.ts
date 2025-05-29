import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { ja } from './ja';
import { zh } from './zh';
import { ar } from './ar';
import { pt } from './pt';
import { hi } from './hi';
import { bn } from './bn';
import { ru } from './ru';
import { it } from './it';
import { ko } from './ko';
import { tr } from './tr';
import { nl } from './nl';
import { sv } from './sv';
import { pl } from './pl';
import { vi } from './vi';
import { th } from './th';
import { id } from './id';
import { cs } from './cs';
import { el } from './el';
import { hu } from './hu';
import { ro } from './ro';
import { da } from './da';
import { fi } from './fi';
import { no } from './no';
import { sk } from './sk';
import { bg } from './bg';
import { hr } from './hr';
import { lt } from './lt';
import { sl } from './sl';
import { et } from './et';
import { lv } from './lv';
import { sr } from './sr';
import { iw } from './iw';
import { uk } from './uk';
import { sw } from './sw';
import { mt } from './mt';
import { bs } from './bs';
import { ca } from './ca';
import { gu } from './gu';
import { hy } from './hy';
import { is as is_IS } from './is';
import { ka } from './ka';
import { kk } from './kk';
import { kn } from './kn';
import { mk } from './mk';
import { ml } from './ml';
import { mr } from './mr';
import { ms } from './ms';
import { my } from './my';
import { pa } from './pa';
import { so } from './so';
import { sq } from './sq';
import { ta } from './ta';
import { te } from './te';
import { tl } from './tl';
import { ur } from './ur';
import { am } from './am';
import { mn } from './mn';
import { fa } from './fa';

// Type for our translation structure
export type TranslationKeys = typeof en;

// All translations will follow the same structure as English
export const translations = {
    en,
    es,
    fr,
    de,
    ja,
    zh,
    ar,
    pt,
    hi,
    bn,
    ru,
    it,
    ko,
    tr,
    nl,
    sv,
    pl,
    vi,
    th,
    id,
    cs,
    el,
    hu,
    ro,
    da,
    fi,
    no,
    sk,
    bg,
    hr,
    lt,
    sl,
    et,
    lv,
    sr,
    iw,
    uk,
    sw,
    mt,
    bs,
    ca,
    gu,
    hy,
    is: is_IS,
    ka,
    kk,
    kn,
    mk,
    ml,
    mr,
    ms,
    my,
    pa,
    so,
    sq,
    ta,
    te,
    tl,
    ur,
    am,
    mn,
    fa,
    // Other languages will be added here as they're created
};

export type LanguageCode = keyof typeof translations;

export const getTranslation = (lang: LanguageCode): TranslationKeys => {
    return translations[lang] || translations.en;
};