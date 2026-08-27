import type { CountryCode, CountryOption, MarketTarget } from '../types';

export function buildMarketTargets(
  targetCountries: CountryCode[],
  countries: CountryOption[],
): MarketTarget[] {
  return targetCountries.flatMap((countryCode) => {
    const country = countries.find((entry) => entry.code === countryCode);
    if (!country) return [];
    const languages = [country.primaryLanguage];
    if (country.englishSupported && country.primaryLanguage.code !== 'en') {
      languages.push({
        code: 'en',
        label: 'English',
        dataForSeoName: 'English',
      });
    }
    return [
      {
        countryCode: country.code,
        countryName: country.name,
        locationName: country.locationName,
        primaryLanguageCode: country.primaryLanguage.code,
        languages,
      },
    ];
  });
}
