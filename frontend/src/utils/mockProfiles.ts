import type { Address, CartItem, Order, OrderItem } from '../types';
import { normalizeStoredAddress } from './address';

const PROFILES_STORAGE_KEY = 'mockProfiles';

type StoredProfile = {
  phoneNumber: string;
  addresses: Address[];
  selectedAddressId: string | null;
  orders: Order[];
  createdAt: string;
  updatedAt: string;
};

type StoredProfiles = Record<string, StoredProfile>;

const storage = () => (typeof localStorage === 'undefined' ? null : localStorage);

export function getProfileKey(phoneNumber: string | null | undefined): string | null {
  const digits = phoneNumber?.replace(/\D/g, '') || '';
  return digits || null;
}

function readProfiles(): StoredProfiles {
  try {
    const raw = storage()?.getItem(PROFILES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as StoredProfiles
      : {};
  } catch {
    return {};
  }
}

function writeProfiles(profiles: StoredProfiles) {
  try {
    storage()?.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch {
    // localStorage can be unavailable in restricted browser modes.
  }
}

function readJSON(key: string): unknown {
  try {
    const raw = storage()?.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function migrateLegacyAddresses(): {
  addresses: Address[];
  selectedAddressId: string | null;
} {
  const legacyItems = readJSON('deliveryAddresses');
  const addresses = Array.isArray(legacyItems)
    ? legacyItems.map(normalizeStoredAddress).filter((item): item is Address => item !== null)
    : [];
  const selectedLegacy = normalizeStoredAddress(storage()?.getItem('lastSelectedAddress') || null);

  if (selectedLegacy && !addresses.some((address) => address.id === selectedLegacy.id)) {
    addresses.push(selectedLegacy);
  }

  const selectedAddressId = selectedLegacy
    ? addresses.find((address) => address.street === selectedLegacy.street && address.city === selectedLegacy.city)?.id || null
    : addresses[0]?.id || null;

  return { addresses, selectedAddressId };
}

function migrateLegacyOrders(phoneNumber: string): Order[] {
  const legacyOrders = readJSON('mockOrders');
  if (!Array.isArray(legacyOrders)) return [];

  return legacyOrders.map((order): Order | null => {
    if (!order || typeof order !== 'object') return null;
    const candidate = order as Partial<Order> & {
      address?: unknown;
      items?: Array<Partial<CartItem> & Partial<OrderItem>>;
    };
    const address = normalizeStoredAddress(candidate.address);
    if (!address || !Array.isArray(candidate.items)) return null;

    const items: OrderItem[] = candidate.items
      .map((item) => {
        const legacyProductId = (item as Partial<CartItem>).id;
        const productId = typeof item.productId === 'number' ? item.productId : legacyProductId;
        if (
          typeof productId !== 'number' ||
          typeof item.name !== 'string' ||
          typeof item.price !== 'number' ||
          typeof item.weight !== 'string' ||
          typeof item.image !== 'string' ||
          typeof item.quantity !== 'number'
        ) {
          return null;
        }

        return {
          productId,
          name: item.name,
          price: item.price,
          weight: item.weight,
          image: item.image,
          quantity: item.quantity,
        };
      })
      .filter((item): item is OrderItem => item !== null);

    if (items.length === 0) return null;

    return {
      id: typeof candidate.id === 'string' ? candidate.id : `order-${Date.now()}`,
      number: typeof candidate.number === 'string' ? candidate.number : `MF-${String(Date.now()).slice(-6)}`,
      createdAt: typeof candidate.createdAt === 'string' ? candidate.createdAt : new Date().toISOString(),
      address,
      items,
      total: typeof candidate.total === 'number'
        ? candidate.total
        : items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'created',
      userPhone: phoneNumber,
    };
  }).filter((order): order is Order => order !== null);
}

export function ensureProfile(phoneNumber: string): StoredProfile {
  const key = getProfileKey(phoneNumber);
  if (!key) {
    throw new Error('Cannot create a profile without a phone number');
  }

  const profiles = readProfiles();
  const existingProfile = profiles[key];
  if (existingProfile) return existingProfile;

  const now = new Date().toISOString();
  const shouldMigrateLegacyData = Object.keys(profiles).length === 0;
  const legacyAddresses = shouldMigrateLegacyData
    ? migrateLegacyAddresses()
    : { addresses: [], selectedAddressId: null };
  const profile: StoredProfile = {
    phoneNumber,
    addresses: legacyAddresses.addresses,
    selectedAddressId: legacyAddresses.selectedAddressId,
    orders: shouldMigrateLegacyData ? migrateLegacyOrders(phoneNumber) : [],
    createdAt: now,
    updatedAt: now,
  };

  profiles[key] = profile;
  writeProfiles(profiles);
  return profile;
}

export function profileExists(phoneNumber: string): boolean {
  const key = getProfileKey(phoneNumber);
  if (!key) return false;
  return Boolean(readProfiles()[key]);
}

export function getProfile(phoneNumber: string | null): StoredProfile | null {
  const key = getProfileKey(phoneNumber);
  if (!key || !phoneNumber) return null;

  const profiles = readProfiles();
  return profiles[key] || ensureProfile(phoneNumber);
}

export function saveProfileAddresses(
  phoneNumber: string | null,
  addresses: Address[],
  selectedAddressId: string | null
) {
  if (!phoneNumber) return;
  const key = getProfileKey(phoneNumber);
  if (!key) return;

  const profiles = readProfiles();
  const profile = profiles[key] || ensureProfile(phoneNumber);
  profiles[key] = {
    ...profile,
    addresses,
    selectedAddressId,
    updatedAt: new Date().toISOString(),
  };
  writeProfiles(profiles);
}

export function saveProfileOrders(phoneNumber: string | null, orders: Order[]) {
  if (!phoneNumber) return;
  const key = getProfileKey(phoneNumber);
  if (!key) return;

  const profiles = readProfiles();
  const profile = profiles[key] || ensureProfile(phoneNumber);
  profiles[key] = {
    ...profile,
    orders,
    updatedAt: new Date().toISOString(),
  };
  writeProfiles(profiles);
}
