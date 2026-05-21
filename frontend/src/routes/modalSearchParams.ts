export const MODAL_PARAM = 'modal';
export const PRODUCT_PARAM = 'product';

export const MODAL_VALUES = [
  'auth',
  'profile',
  'address',
  'checkout',
  'support',
  'cart',
] as const;

export type ModalValue = (typeof MODAL_VALUES)[number];

export function isModalValue(value: string | null): value is ModalValue {
  return MODAL_VALUES.includes(value as ModalValue);
}
