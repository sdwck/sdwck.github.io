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

export const gatherUserFactStarters = (): string[] => {
    const starters: string[] = [];

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) starters.push('Good morning,');
    else if (hour >= 12 && hour < 18) starters.push('Good afternoon,');
    else if (hour >= 18 && hour < 23) starters.push('Good evening,');
    else starters.push('Good night,');

    return starters;
}

export const gatherUserFacts = async (): Promise<string[]> => {
    const facts: string[] = ["friend"];

    try {
        const response = await fetch('https://ipwhois.app/json/');
        const data = await response.json();
        if (data.success) {
            if (data.country_code && demonyms[data.country_code]) {
                facts.push(demonyms[data.country_code]);
            } else if (data.country_code) {
                const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(data.country_code);
                if (countryName) facts.push(`from ${countryName}`);
            }
            if (data.city) {
                facts.push(data.city);
            }
        }
    } catch (e) { }

    const device = rdd.deviceDetect(navigator.userAgent);
    if (device.browserName) facts.push(`${device.browserName} user`);
    if (device.osName) facts.push(`${device.osName} user`);

    if (document.referrer) {
        const hostname = new URL(document.referrer).hostname.toLowerCase();
        let ref = null;
        if (hostname.includes('google')) ref = 'Google';
        else if (hostname.includes('github')) ref = 'GitHub';
        else if (hostname.includes('t.me') || hostname.includes('telegram')) ref = 'Telegram';
        else if (hostname.includes('youtube')) ref = 'YouTube';
        else if (hostname.includes('twitter') || hostname.includes('x.com')) ref = 'Twitter';
        else if (hostname.includes('facebook')) ref = 'Facebook';
        else if (hostname.includes('instagram')) ref = 'Instagram';
        else if (hostname.includes('reddit')) ref = 'Reddit';
        else if (hostname.includes('linkedin')) ref = 'LinkedIn';
        else if (hostname.includes('vk.com')) ref = 'VK';
        else if (hostname.includes('discord')) ref = 'Discord';
        else if (hostname.includes('stackoverflow')) ref = 'Stack Overflow';
        else if (hostname.includes('medium')) ref = 'Medium';
        else if (hostname.includes('yandex')) ref = 'Yandex';
        else if (hostname.includes('bing')) ref = 'Bing';
        else if (hostname.includes('duckduckgo')) ref = 'DuckDuckGo';
        else if (hostname.includes('pinterest')) ref = 'Pinterest';
        else if (hostname.includes('quora')) ref = 'Quora';
        else if (hostname.includes('tiktok')) ref = 'TikTok';

        if (ref) facts.push(`user from ${ref}`)
    }

    return facts;
};