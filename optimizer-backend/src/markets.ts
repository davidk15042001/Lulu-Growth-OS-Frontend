import type { CountryCode, LanguageCode, MarketLanguage, MarketTarget, SiteConnection } from './types.js';

type CountryPreset = {
  code: CountryCode;
  name: string;
  locationName: string;
  primaryLanguage: MarketLanguage;
  englishSupported: boolean;
};

const englishLanguage: MarketLanguage = {
  code: 'en',
  label: 'English',
  dataForSeoName: 'English',
};

const countryPresets: CountryPreset[] = [
  {
    code: 'US',
    name: 'United States',
    locationName: 'United States',
    primaryLanguage: englishLanguage,
    englishSupported: true,
  },
  {
    code: 'DE',
    name: 'Germany',
    locationName: 'Germany',
    primaryLanguage: {
      code: 'de',
      label: 'German',
      dataForSeoName: 'German',
    },
    englishSupported: true,
  },
  {
    code: 'CN',
    name: 'China',
    locationName: 'China',
    primaryLanguage: {
      code: 'zh-CN',
      label: 'Chinese',
      dataForSeoName: 'Chinese',
    },
    englishSupported: true,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    locationName: 'United Kingdom',
    primaryLanguage: englishLanguage,
    englishSupported: true,
  },
  {
    code: 'NL',
    name: 'Netherlands',
    locationName: 'Netherlands',
    primaryLanguage: {
      code: 'nl',
      label: 'Dutch',
      dataForSeoName: 'Dutch',
    },
    englishSupported: true,
  },
  {
    code: 'SE',
    name: 'Sweden',
    locationName: 'Sweden',
    primaryLanguage: {
      code: 'sv',
      label: 'Swedish',
      dataForSeoName: 'Swedish',
    },
    englishSupported: true,
  },
  {
    code: 'DK',
    name: 'Denmark',
    locationName: 'Denmark',
    primaryLanguage: {
      code: 'da',
      label: 'Danish',
      dataForSeoName: 'Danish',
    },
    englishSupported: true,
  },
  {
    code: 'NO',
    name: 'Norway',
    locationName: 'Norway',
    primaryLanguage: {
      code: 'no',
      label: 'Norwegian',
      dataForSeoName: 'Norwegian',
    },
    englishSupported: true,
  },
  {
    code: 'CH',
    name: 'Switzerland',
    locationName: 'Switzerland',
    primaryLanguage: {
      code: 'de',
      label: 'German',
      dataForSeoName: 'German',
    },
    englishSupported: true,
  },
  {
    code: 'CA',
    name: 'Canada',
    locationName: 'Canada',
    primaryLanguage: englishLanguage,
    englishSupported: true,
  },
  {
    code: 'AU',
    name: 'Australia',
    locationName: 'Australia',
    primaryLanguage: englishLanguage,
    englishSupported: true,
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    locationName: 'United Arab Emirates',
    primaryLanguage: {
      code: 'ar',
      label: 'Arabic',
      dataForSeoName: 'Arabic',
    },
    englishSupported: true,
  },
  {
    code: 'IN',
    name: 'India',
    locationName: 'India',
    primaryLanguage: {
      code: 'hi',
      label: 'Hindi',
      dataForSeoName: 'Hindi',
    },
    englishSupported: true,
  },
  {
    code: 'PK',
    name: 'Pakistan',
    locationName: 'Pakistan',
    primaryLanguage: {
      code: 'ur',
      label: 'Urdu',
      dataForSeoName: 'Urdu',
    },
    englishSupported: true,
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    locationName: 'Bangladesh',
    primaryLanguage: {
      code: 'bn',
      label: 'Bengali',
      dataForSeoName: 'Bengali',
    },
    englishSupported: true,
  },
];

const presetByCode = new Map(countryPresets.map((preset) => [preset.code, preset]));

function uniqueLanguages(languages: MarketLanguage[]) {
  const seen = new Set<LanguageCode>();
  return languages.filter((language) => {
    if (seen.has(language.code)) return false;
    seen.add(language.code);
    return true;
  });
}

export const DEFAULT_COUNTRY_CODES = countryPresets.map((preset) => preset.code);

export function listCountryPresets() {
  return countryPresets.map((preset) => ({
    code: preset.code,
    name: preset.name,
    locationName: preset.locationName,
    primaryLanguage: preset.primaryLanguage,
    englishSupported: preset.englishSupported,
  }));
}

export function buildDefaultMarketTargets(countryCodes: CountryCode[] = DEFAULT_COUNTRY_CODES): MarketTarget[] {
  return countryCodes.flatMap((code) => {
    const preset = presetByCode.get(code);
    if (!preset) return [];
    const languages = uniqueLanguages([
      preset.primaryLanguage,
      ...(preset.englishSupported ? [englishLanguage] : []),
    ]);
    return [{
      countryCode: preset.code,
      countryName: preset.name,
      locationName: preset.locationName,
      primaryLanguageCode: preset.primaryLanguage.code,
      languages,
    }];
  });
}

export function normalizeMarketTargets(site: Pick<SiteConnection, 'targetCountries' | 'marketTargets'>) {
  if (site.marketTargets.length > 0) return site.marketTargets;
  return buildDefaultMarketTargets(site.targetCountries);
}

export function flattenMarketTargets(site: Pick<SiteConnection, 'targetCountries' | 'marketTargets'>) {
  return normalizeMarketTargets(site).flatMap((target) =>
    target.languages.map((language) => ({
      marketKey: `${target.countryCode}:${language.code}`,
      marketLabel: `${target.countryName} (${language.label})`,
      countryCode: target.countryCode,
      countryName: target.countryName,
      locationName: target.locationName,
      languageCode: language.code,
      languageLabel: language.label,
      dataForSeoLanguage: language.dataForSeoName,
      primary: language.code === target.primaryLanguageCode,
    })),
  );
}
