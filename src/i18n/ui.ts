export const locales = ['en', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeMeta: Record<Locale, { label: string; short: string; ogLocale: string; dateLocale: string }> = {
  en: { label: 'English', short: 'EN', ogLocale: 'en_US', dateLocale: 'en-GB' },
  de: { label: 'Deutsch', short: 'DE', ogLocale: 'de_DE', dateLocale: 'de-DE' },
};

/** Translated URL segments. The default locale has no prefix: /country/japan/ vs /de/land/japan/. */
export const segments: Record<Locale, { country: string; countries: string; garment: string; garments: string }> = {
  en: { country: 'country', countries: 'countries', garment: 'garment', garments: 'garments' },
  de: { country: 'land', countries: 'laender', garment: 'kleidungsstueck', garments: 'kleidungsstuecke' },
};

/** Continent keys in display order. `anchor` is the heading id on the /countries/ page. */
export const continents = {
  africa: { en: 'Africa', de: 'Afrika', anchor: { en: 'africa', de: 'afrika' } },
  asia: { en: 'Asia', de: 'Asien', anchor: { en: 'asia', de: 'asien' } },
  europe: { en: 'Europe', de: 'Europa', anchor: { en: 'europe', de: 'europa' } },
  'north-america': { en: 'North America', de: 'Nordamerika', anchor: { en: 'north-america', de: 'nordamerika' } },
  'south-america': { en: 'South America', de: 'Südamerika', anchor: { en: 'south-america', de: 'suedamerika' } },
} as const satisfies Record<string, Record<Locale, string> & { anchor: Record<Locale, string> }>;

export type ContinentKey = keyof typeof continents;
export const continentKeys = Object.keys(continents) as [ContinentKey, ...ContinentKey[]];

const strings = {
  siteName: { en: 'Traditional Clothing Hub', de: 'Traditional Clothing Hub' },
  siteTagline: {
    en: 'Traditional clothing from around the world, explained country by country.',
    de: 'Traditionelle Kleidung aus aller Welt, Land für Land erklärt.',
  },
  skipToContent: { en: 'Skip to content', de: 'Zum Inhalt springen' },
  home: { en: 'Home', de: 'Startseite' },
  countries: { en: 'Countries', de: 'Länder' },
  garments: { en: 'Garments', de: 'Kleidungsstücke' },
  about: { en: 'About', de: 'Über uns' },
  contact: { en: 'Contact', de: 'Kontakt' },
  privacy: { en: 'Privacy policy', de: 'Datenschutz' },
  sources: { en: 'Image sources', de: 'Bildquellen' },
  mainNav: { en: 'Main', de: 'Hauptnavigation' },
  footerNav: { en: 'Footer', de: 'Fußzeile' },
  breadcrumb: { en: 'Breadcrumb', de: 'Brotkrumennavigation' },
  language: { en: 'Language', de: 'Sprache' },
  switchLanguage: { en: 'Diese Seite auf Deutsch', de: 'This page in English' },
  heroTitle: {
    en: 'Discover traditional clothing from around the world',
    de: 'Entdecke traditionelle Kleidung aus aller Welt',
  },
  heroLead: {
    en: 'What people wear for weddings, festivals and everyday life, and the history behind each garment.',
    de: 'Was Menschen zu Hochzeiten, Festen und im Alltag tragen, und welche Geschichte hinter jedem Kleidungsstück steckt.',
  },
  searchLabel: { en: 'Country or garment', de: 'Land oder Kleidungsstück' },
  searchPlaceholder: { en: 'Try “Japan” or “kimono”…', de: 'Zum Beispiel „Japan“ oder „Kimono“…' },
  searchSubmit: { en: 'Search', de: 'Suchen' },
  browseByContinent: { en: 'Browse by continent', de: 'Nach Kontinent stöbern' },
  featuredCountries: { en: 'Countries', de: 'Länder' },
  featuredCountriesLead: {
    en: 'Start with a country to see its main garments, wedding attire and festival dress.',
    de: 'Beginne mit einem Land und sieh dir die wichtigsten Kleidungsstücke, Hochzeitskleidung und Festtagstrachten an.',
  },
  featuredGarments: { en: 'Garments', de: 'Kleidungsstücke' },
  featuredGarmentsLead: {
    en: 'Or start with a garment and learn where it comes from and how it is worn.',
    de: 'Oder beginne mit einem Kleidungsstück und erfahre, woher es stammt und wie es getragen wird.',
  },
  viewAll: { en: 'View all', de: 'Alle ansehen' },
  howWeWork: { en: 'How we research', de: 'So recherchieren wir' },
  howWeWorkBody: {
    en: 'Every page is written from published sources, and every image is credited with its author and licence. Images come from museum open-access collections and free photo libraries, and we host them ourselves.',
    de: 'Jede Seite beruht auf veröffentlichten Quellen, und jedes Bild wird mit Urheber und Lizenz genannt. Die Bilder stammen aus frei zugänglichen Museumssammlungen und freien Fotoarchiven und liegen auf unserem eigenen Server.',
  },
  readAbout: { en: 'About the project', de: 'Über das Projekt' },
  readSources: { en: 'See all image credits', de: 'Alle Bildnachweise ansehen' },
  atAGlance: { en: 'At a glance', de: 'Auf einen Blick' },
  onThisPage: { en: 'On this page', de: 'Auf dieser Seite' },
  continent: { en: 'Continent', de: 'Kontinent' },
  keyGarments: { en: 'Key garments', de: 'Wichtige Kleidungsstücke' },
  origin: { en: 'Associated with', de: 'Verbunden mit' },
  garmentsFrom: { en: 'Garments from {name}', de: 'Kleidungsstücke aus {name}' },
  moreCountries: { en: 'More countries to explore', de: 'Weitere Länder entdecken' },
  moreGarments: { en: 'More garments to explore', de: 'Weitere Kleidungsstücke entdecken' },
  lastUpdated: { en: 'Last updated', de: 'Zuletzt aktualisiert' },
  countriesTitle: { en: 'Traditional clothing by country', de: 'Traditionelle Kleidung nach Ländern' },
  countriesLead: {
    en: 'Every country we cover so far, grouped by continent. We add new countries regularly.',
    de: 'Alle Länder, die wir bisher behandeln, nach Kontinenten sortiert. Wir ergänzen regelmäßig neue Länder.',
  },
  countriesDescription: {
    en: 'Browse traditional clothing by country, grouped by continent: Japan, India, Nigeria, Mexico and more.',
    de: 'Traditionelle Kleidung nach Ländern, sortiert nach Kontinenten: Japan, Indien, Nigeria, Mexiko und mehr.',
  },
  garmentsTitle: { en: 'Traditional garments A–Z', de: 'Traditionelle Kleidungsstücke von A bis Z' },
  garmentsLead: {
    en: 'An alphabetical index of the traditional garments on this site.',
    de: 'Ein alphabetisches Verzeichnis aller traditionellen Kleidungsstücke auf dieser Website.',
  },
  garmentsDescription: {
    en: 'An A–Z index of traditional garments, from agbada and dirndl to kimono and sari, with history and how each is worn.',
    de: 'Traditionelle Kleidungsstücke von A bis Z, von Agbada und Dirndl bis Kimono und Sari, mit Geschichte und Trageweise.',
  },
  jumpTo: { en: 'Jump to', de: 'Springen zu' },
  womensClothing: { en: "Women's clothing", de: 'Frauenkleidung' },
  mensClothing: { en: "Men's clothing", de: 'Männerkleidung' },
  genderNavLabel: { en: 'Jump to traditional clothing sections', de: 'Zu den Abschnitten für traditionelle Kleidung springen' },
  jumpToLetter: { en: 'Jump to letter', de: 'Zum Buchstaben springen' },
  countryCount: { en: '{n} countries', de: '{n} Länder' },
  countryCountOne: { en: '1 country', de: '1 Land' },
  imageCredit: { en: 'Image', de: 'Bild' },
  license: { en: 'Licence', de: 'Lizenz' },
  source: { en: 'Source', de: 'Quelle' },
  author: { en: 'Author', de: 'Urheber' },
  downloaded: { en: 'Downloaded', de: 'Heruntergeladen' },
  usedOn: { en: 'Used on', de: 'Verwendet auf' },
  unknownAuthor: { en: 'Unknown artist', de: 'Unbekannt' },
  notFoundTitle: { en: 'Page not found', de: 'Seite nicht gefunden' },
  notFoundBody: {
    en: 'The page you are looking for does not exist or has moved.',
    de: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
  },
  backHome: { en: 'Back to the home page', de: 'Zurück zur Startseite' },
  copyright: { en: '© {year} Traditional Clothing Hub', de: '© {year} Traditional Clothing Hub' },
  footerExplore: { en: 'Explore', de: 'Entdecken' },
  footerAbout: { en: 'Traditional Clothing Hub', de: 'Traditional Clothing Hub' },
  footerLegal: { en: 'Legal', de: 'Rechtliches' },
} satisfies Record<string, Record<Locale, string>>;

export type UiKey = keyof typeof strings;

export function t(lang: Locale, key: UiKey, vars: Record<string, string | number> = {}): string {
  return strings[key][lang].replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`));
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
