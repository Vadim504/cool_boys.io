import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hydrateUiFromSearchParams } from '../store/uiSlice';
import { useAppDispatch } from '../store/hooks';
import { MODAL_PARAM, PRODUCT_PARAM } from '../routes/modalSearchParams';

/**
 * Синхронизирует Redux с query-параметрами URL.
 * Работает при первой загрузке, F5 и кнопках «Назад» / «Вперёд».
 */
const ModalUrlSync = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    dispatch(
      hydrateUiFromSearchParams({
        modal: searchParams.get(MODAL_PARAM),
        product: searchParams.get(PRODUCT_PARAM),
      })
    );
  }, [dispatch, searchParams]);

  return null;
};

export default ModalUrlSync;
