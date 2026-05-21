import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MODAL_PARAM,
  PRODUCT_PARAM,
  type ModalValue,
} from '../routes/modalSearchParams';
import {
  closeAddressModal,
  closeCart,
  closeCheckout,
  closeProductDetail,
  closeSupport,
  openAddressModal,
  openCart,
  openCheckout,
  openProductDetail,
  openSupport,
  toggleAuth,
  toggleProfile,
} from '../store/uiSlice';
import { useAppDispatch } from '../store/hooks';

type ParamPatch = {
  modal?: ModalValue | null;
  product?: number | null;
};

/**
 * Открытие/закрытие модалок с записью в URL (?modal=auth, ?product=123).
 * После обновления страницы окно останется открытым.
 */
export function useUiNavigation() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const patchSearchParams = useCallback(
    (patch: ParamPatch) => {
      const params = new URLSearchParams(location.search);

      if ('modal' in patch) {
        if (patch.modal === null || patch.modal === undefined) {
          params.delete(MODAL_PARAM);
        } else {
          params.set(MODAL_PARAM, patch.modal);
        }
      }

      if ('product' in patch) {
        if (patch.product === null || patch.product === undefined) {
          params.delete(PRODUCT_PARAM);
        } else {
          params.set(PRODUCT_PARAM, String(patch.product));
        }
      }

      const search = params.toString();
      navigate(
        {
          pathname: location.pathname,
          search: search ? `?${search}` : '',
        },
        { replace: false }
      );
    },
    [location.pathname, location.search, navigate]
  );

  return {
    openAuth: () => {
      dispatch(toggleAuth(true));
      patchSearchParams({ modal: 'auth', product: null });
    },
    closeAuth: () => {
      dispatch(toggleAuth(false));
      patchSearchParams({ modal: null });
    },

    openProfile: () => {
      dispatch(toggleProfile(true));
      patchSearchParams({ modal: 'profile', product: null });
    },
    closeProfile: () => {
      dispatch(toggleProfile(false));
      patchSearchParams({ modal: null });
    },

    openAddressModal: () => {
      dispatch(openAddressModal());
      patchSearchParams({ modal: 'address', product: null });
    },
    closeAddressModal: () => {
      dispatch(closeAddressModal());
      patchSearchParams({ modal: null });
    },

    openCheckout: () => {
      dispatch(openCheckout());
      patchSearchParams({ modal: 'checkout', product: null });
    },
    closeCheckout: () => {
      dispatch(closeCheckout());
      patchSearchParams({ modal: null });
    },

    openSupport: () => {
      dispatch(openSupport());
      patchSearchParams({ modal: 'support', product: null });
    },
    closeSupport: () => {
      dispatch(closeSupport());
      patchSearchParams({ modal: null });
    },

    openCart: () => {
      dispatch(openCart());
      patchSearchParams({ modal: 'cart', product: null });
    },
    closeCart: () => {
      dispatch(closeCart());
      patchSearchParams({ modal: null });
    },

    openProductDetail: (productId: number) => {
      dispatch(openProductDetail(productId));
      patchSearchParams({ product: productId, modal: null });
    },
    closeProductDetail: () => {
      dispatch(closeProductDetail());
      patchSearchParams({ product: null });
    },
  };
}
