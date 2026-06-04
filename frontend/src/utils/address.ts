import type { Address } from '../types';

type AddressInput = Omit<Address, 'id'> & { id?: string };

const trim = (value = '') => value.trim();

const cleanOptional = (value = '') => {
  const trimmed = value.trim();
  return trimmed || undefined;
};

const HOUSE_NUMBER_PATTERN =
  /(?:^|[,\s])(?:д\.?\s*)?\d+[a-zа-яё/-]*(?:\s*(?:к|корпус|корп|стр|строение|литера|лит)\.?\s*[\wа-яё/-]+)*$/i;

export function createAddress(input: AddressInput): Address {
  return {
    id: input.id || `addr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    city: trim(input.city),
    street: trim(input.street),
    apartment: cleanOptional(input.apartment),
    floor: cleanOptional(input.floor),
    entrance: cleanOptional(input.entrance),
    intercom: cleanOptional(input.intercom),
    comment: cleanOptional(input.comment),
  };
}

export function hasHouseNumber(value: string): boolean {
  return HOUSE_NUMBER_PATTERN.test(value.trim());
}

export function formatAddressLine(address: Address | null | undefined): string {
  if (!address) return '';

  const parts = [address.city, address.street].filter(Boolean);
  let line = parts.join(', ');
  if (address.apartment) line += `, кв. ${address.apartment}`;
  return line;
}

export function formatAddressDetails(address: Address): string {
  return [
    address.entrance ? `подъезд ${address.entrance}` : '',
    address.floor ? `этаж ${address.floor}` : '',
    address.intercom ? `домофон ${address.intercom}` : '',
    address.comment,
  ]
    .filter(Boolean)
    .join(', ');
}

export function normalizeStoredAddress(value: unknown): Address | null {
  if (!value) return null;

  if (typeof value === 'object') {
    const candidate = value as Partial<Address>;
    if (typeof candidate.city === 'string' && typeof candidate.street === 'string') {
      return createAddress({
        id: typeof candidate.id === 'string' ? candidate.id : undefined,
        city: candidate.city,
        street: candidate.street,
        apartment: candidate.apartment,
        floor: candidate.floor,
        entrance: candidate.entrance,
        intercom: candidate.intercom,
        comment: candidate.comment,
      });
    }
  }

  if (typeof value !== 'string') return null;

  const parts = value.split(',').map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) return null;

  const apartmentPart = parts.find((part) => /^кв\./i.test(part));
  const city = parts.length > 1 ? parts[0] : '';
  const streetParts = parts.length > 1 ? parts.slice(1) : parts;
  const street = streetParts.filter((part) => !/^кв\./i.test(part)).join(', ');

  if (!street) return null;

  return createAddress({
    city,
    street,
    apartment: apartmentPart?.replace(/^кв\.\s*/i, ''),
  });
}

export function isSameAddress(left: Address, right: Address): boolean {
  return formatAddressLine(left).toLocaleLowerCase('ru-RU') ===
    formatAddressLine(right).toLocaleLowerCase('ru-RU');
}
