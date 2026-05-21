import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hydrateUiFromSearchParams } from '../store/uiSlice';
import { useAppDispatch } from '../store/hooks';

/**
 * Синхронизирует Redux с query-параметрами URL.
 * Работает при первой загрузке, F5 и кнопках «Назад» / «Вперёд».
 */
const ModalUrlSync = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    dispatch(hydrateUiFromSearchParams(searchParams));
  }, [dispatch, searchParams]);

  return null;
};

export default ModalUrlSync;
