/** Popular cities are available instantly without a geocoder request. */
export const BASE_CITIES = [
  { label: 'Москва', coords: [55.75, 37.61] as [number, number] },
  { label: 'Санкт-Петербург', coords: [59.93, 30.33] as [number, number] },
  { label: 'Казань', coords: [55.79, 49.12] as [number, number] },
  { label: 'Екатеринбург', coords: [56.83, 60.6] as [number, number] },
  { label: 'Краснодар', coords: [45.03, 38.97] as [number, number] },
] as const;

export const OSM_TILE_URL =
  import.meta.env.VITE_OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const NOMINATIM_BASE_URL =
  import.meta.env.VITE_NOMINATIM_BASE_URL || 'https://nominatim.openstreetmap.org';
const NOMINATIM_MIN_INTERVAL_MS = 1100;

export type CityPick = {
  label: string;
  coords: [number, number];
  placeId?: string;
  subtitle?: string;
};

export type AddressPick = {
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
  hamlet?: string;
  locality?: string;
  county?: string;
  state?: string;
  road?: string;
  pedestrian?: string;
  residential?: string;
  footway?: string;
  path?: string;
  neighbourhood?: string;
  suburb?: string;
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

const responseCache = new Map<string, unknown>();
let requestQueue = Promise.resolve();
let nextRequestAt = 0;

function createAbortError() {
  return new DOMException('Request aborted', 'AbortError');
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) return Promise.reject(createAbortError());

  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms);

    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer);
        reject(createAbortError());
      },
      { once: true }
    );
  });
}

async function fetchNominatim<T>(
  path: string,
  params: Record<string, string>,
  signal?: AbortSignal
): Promise<T> {
  const url = new URL(path, NOMINATIM_BASE_URL);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const cacheKey = url.toString();

  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey) as T;
  }

  const request = requestQueue.then(async () => {
    if (signal?.aborted) throw createAbortError();

    const delay = Math.max(0, nextRequestAt - Date.now());
    if (delay) await wait(delay, signal);

    nextRequestAt = Date.now() + NOMINATIM_MIN_INTERVAL_MS;
    const response = await fetch(cacheKey, { headers: NOMINATIM_HEADERS, signal });
    if (!response.ok) {
      throw new Error(`Nominatim request failed: ${response.status}`);
    }

    const data = (await response.json()) as T;
    responseCache.set(cacheKey, data);
    return data;
  });

  requestQueue = request.then(
    () => undefined,
    () => undefined
  );

  return request;
}

export function filterBaseCities(query: string): CityPick[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('ru-RU');
  if (!normalizedQuery) return [...BASE_CITIES];

  return BASE_CITIES.filter((city) =>
    city.label.toLocaleLowerCase('ru-RU').includes(normalizedQuery)
  );
}

export function formatCitySubtitle(place: NominatimPlace): string {
  const { address } = place;
  if (!address) {
    return place.display_name.split(',').slice(1, 3).join(', ').trim();
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
      address.hamlet ||
      address.locality ||
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
    address.hamlet ||
    address.locality ||
    null
  );
}

export function formatStreetAddress(
  address: NominatimAddress = {},
  displayName = ''
): string {
  const street =
    address.road ||
    address.pedestrian ||
    address.residential ||
    address.footway ||
    address.path ||
    address.neighbourhood ||
    address.suburb ||
    '';
  const house = address.house_number || '';

  if (street) return `${street}${house ? `, ${house}` : ''}`;
  return displayName.split(',').slice(0, 2).join(',').trim();
}

function isSettlementPlace(place: NominatimPlace): boolean {
  const type = place.type || place.addresstype || '';
  return SETTLEMENT_TYPES.has(type);
}

/** Public Nominatim policy allows explicit user-triggered search, not client-side autocomplete. */
export async function searchCities(
  query: string,
  signal?: AbortSignal
): Promise<CityPick[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const data = await fetchNominatim<NominatimPlace[]>(
    '/search',
    {
      q: trimmed,
      format: 'jsonv2',
      addressdetails: '1',
      limit: '10',
      'accept-language': 'ru',
      dedupe: '1',
      featureType: 'settlement',
    },
    signal
  );
  const settlements = data.filter(isSettlementPlace);
  const pool = settlements.length > 0 ? settlements : data;
  const seen = new Set<string>();
  const results: CityPick[] = [];

  for (const place of pool) {
    const label = pickCityNameFromPlace(place);
    const key = label.toLocaleLowerCase('ru-RU');
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

export async function searchAddresses(
  city: string,
  street: string,
  signal?: AbortSignal
): Promise<AddressPick[]> {
  const trimmedCity = city.trim();
  const trimmedStreet = street.trim();
  if (!trimmedCity || trimmedStreet.length < 3) return [];

  const data = await fetchNominatim<NominatimPlace[]>(
    '/search',
    {
      city: trimmedCity,
      street: trimmedStreet,
      format: 'jsonv2',
      addressdetails: '1',
      limit: '6',
      'accept-language': 'ru',
      dedupe: '1',
      layer: 'address',
    },
    signal
  );

  return data.map((place) => ({
    label: formatStreetAddress(place.address, place.display_name),
    coords: [Number(place.lat), Number(place.lon)],
    placeId: String(place.place_id),
    subtitle: place.display_name,
  }));
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<NominatimPlace | null> {
  return fetchNominatim<NominatimPlace | null>(
    '/reverse',
    {
      format: 'jsonv2',
      lat: String(lat),
      lon: String(lon),
      'accept-language': 'ru',
      addressdetails: '1',
      layer: 'address',
      zoom: '18',
    },
    signal
  );
}
