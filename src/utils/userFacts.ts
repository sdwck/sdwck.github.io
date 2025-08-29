import * as rdd from "react-device-detect";

const demonyms: Record<string, string> = {
    US: 'American', RU: 'Russian', UA: 'Ukrainian', BY: 'Belarusian',
    KZ: 'Kazakhstani', DE: 'German', FR: 'French', GB: 'British',
    PL: 'Polish', LV: 'Latvian', LT: 'Lithuanian', EE: 'Estonian',
    SG: 'Singaporean', JP: 'Japanese', CN: 'Chinese', IN: 'Indian',
    MD: 'Moldovan', IT: 'Italian', ES: 'Spanish', PT: 'Portuguese',
    NL: 'Dutch', BE: 'Belgian', CZ: 'Czech', SK: 'Slovak', HU: 'Hungarian',
    RO: 'Romanian', BG: 'Bulgarian', HR: 'Croatian', SI: 'Slovenian',
    FI: 'Finnish', SE: 'Swedish', NO: 'Norwegian', DK: 'Danish',
    AU: 'Australian', NZ: 'New Zealander', CA: 'Canadian', MX: 'Mexican',
    BR: 'Brazilian', AR: 'Argentinian', CL: 'Chilean', CO: 'Colombian',
    VE: 'Venezuelan', PE: 'Peruvian', EC: 'Ecuadorian', UY: 'Uruguayan',
    ZA: 'South African', EG: 'Egyptian', NG: 'Nigerian', KE: 'Kenyan',
    GH: 'Ghanaian', TZ: 'Tanzanian', SN: 'Senegalese', CI: 'Ivorian',
    MA: 'Moroccan', DZ: 'Algerian', TN: 'Tunisian', LY: 'Libyan',
    AE: 'Emirati', SA: 'Saudi', TR: 'Turkish', IR: 'Iranian', IQ: 'Iraqi',
    IL: 'Israeli', PS: 'Palestinian', SY: 'Syrian', JO: 'Jordanian',
    LB: 'Lebanese', QA: 'Qatari', KW: 'Kuwaiti', BH: 'Bahraini',
    OM: 'Omani', YE: 'Yemeni', AF: 'Afghan', PK: 'Pakistani', BD: 'Bangladeshi',
    LK: 'Sri Lankan', NP: 'Nepalese', MM: 'Burmese', TH: 'Thai',
    VN: 'Vietnamese', MY: 'Malaysian', ID: 'Indonesian', PH: 'Filipino',
    KR: 'Korean', TW: 'Taiwanese', HK: 'Hongkonger', MO: 'Macanese'
};

export const gatherUserFacts = async (): Promise<string[]> => {
    const facts: string[] = [];

    try {
        const response = await fetch('http://ip-api.com/json/?fields=status,countryCode,city');
        const data = await response.json();
        if (data.status === 'success') {
            if (data.countryCode && demonyms[data.countryCode]) {
                facts.push(demonyms[data.countryCode]);
            } else if (data.countryCode) {
                const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(data.countryCode);
                if (countryName) facts.push(`from ${countryName}`);
            }
            if (data.city) {
                facts.push(data.city);
            }
        }
    } catch (e) { }

    try {
        const langCode = navigator.language.split('-')[0];
        const langName = new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode);
        if (langName) facts.push(langName);
    } catch (e) { }

    const device = rdd.deviceDetect(navigator.userAgent);
    if (device.browserName) facts.push(device.browserName);
    if (device.osName) facts.push(device.osName);

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) facts.push('morning');
    else if (hour >= 12 && hour < 18) facts.push('day');
    else if (hour >= 18 && hour < 23) facts.push('evening');
    else facts.push('nightly');

    if (document.referrer) {
        const hostname = new URL(document.referrer).hostname;
        if (hostname.includes('google')) facts.push('Google');
        else if (hostname.includes('github')) facts.push('GitHub');
        else if (hostname.includes('t.me')) facts.push('Telegram');
    }

    return facts;
};