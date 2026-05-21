/** Популярные города — быстрый выбор без запроса к API */
export const BASE_CITIES = [
  { label: 'Москва и рядом', coords: [55.75, 37.61] as [number, number] },
  { label: 'Санкт-Петербург', coords: [59.93, 30.33] as [number, number] },
  { label: 'Казань', coords: [55.79, 49.12] as [number, number] },
  { label: 'Екатеринбург', coords: [56.83, 60.6] as [number, number] },
  { label: 'Краснодар', coords: [45.03, 38.97] as [number, number] },
] as const;

export type CityPick = {
  label: string;
  coords: [number, number];
  placeId?: string;
  subtitle?: string;
};

export type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  road?: string;
  pedestrian?: string;
  house_number?: string;
};

export type NominatimPlace = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
  addresstype?: string;
  address?: NominatimAddress;
};

const NOMINATIM_HEADERS: HeadersInit = {
  Accept: 'application/json',
  'Accept-Language': 'ru',
};

const SETTLEMENT_TYPES = new Set([
  'city',
  'town',
  'village',
  'municipality',
  'hamlet',
  'suburb',
  'locality',
  'administrative',
]);

export function filterBaseCities(query: string): CityPick[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...BASE_CITIES];
  return BASE_CITIES.filter((city) => city.label.toLowerCase().includes(q));
}

export function formatCitySubtitle(place: NominatimPlace): string {
  const { address } = place;
  if (!address) {
    const parts = place.display_name.split(',').slice(1, 3);
    return parts.join(', ').trim();
  }
  const region = address.state || address.county || '';
  const country = place.display_name.split(',').pop()?.trim() || '';
  return [region, country].filter(Boolean).join(', ');
}

export function pickCityNameFromPlace(place: NominatimPlace): string {
  const { address } = place;
  if (address) {
    return (
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      place.display_name.split(',')[0]?.trim() ||
      place.display_name
    );
  }
  return place.display_name.split(',')[0]?.trim() || place.display_name;
}

export function pickCityNameFromAddress(address: NominatimAddress): string | null {
  return (
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    null
  );
}

function isSettlementPlace(place: NominatimPlace): boolean {
  const type = place.type || place.addresstype || '';
  return SETTLEMENT_TYPES.has(type);
}

/** Поиск городов и населённых пунктов по названию (OpenStreetMap Nominatim) */
export async function searchCities(
  query: string,
  signal?: AbortSignal
): Promise<CityPick[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', trimmed);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', '10');
  url.searchParams.set('accept-language', 'ru');
  url.searchParams.set('dedupe', '1');

  const response = await fetch(url.toString(), { headers: NOMINATIM_HEADERS, signal });
  if (!response.ok) {
    throw new Error('Не удалось найти город');
  }

  const data = (await response.json()) as NominatimPlace[];
  const settlements = data.filter(isSettlementPlace);
  const pool = settlements.length > 0 ? settlements : data;

  const seen = new Set<string>();
  const results: CityPick[] = [];

  for (const place of pool) {
    const label = pickCityNameFromPlace(place);
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    results.push({
      label,
      coords: [Number(place.lat), Number(place.lon)],
      placeId: String(place.place_id),
      subtitle: formatCitySubtitle(place),
    });

    if (results.length >= 8) break;
  }

  return results;
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<NominatimPlace | null> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('accept-language', 'ru');

  const response = await fetch(url.toString(), { headers: NOMINATIM_HEADERS, signal });
  if (!response.ok) return null;
  return (await response.json()) as NominatimPlace;
}
