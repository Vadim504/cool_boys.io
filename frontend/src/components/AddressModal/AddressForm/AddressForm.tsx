import { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  filterBaseCities,
  reverseGeocode,
  searchCities,
  pickCityNameFromAddress,
  type CityPick,
} from '../../../utils/geocoding';
import './AddressForm.css';

type FormStep = 'city' | 'street';

type FormValues = {
  city: string;
  street: string;
  apt: string;
  floor: string;
  entrance: string;
  intercom: string;
  comment: string;
};

type AddressFormProps = {
  onBackToList: () => void;
  onSaveNewAddress: (newAddressString: string) => void;
};

const SEARCH_DEBOUNCE_MS = 450;
const MIN_SEARCH_LENGTH = 2;

const AddressForm = ({ onBackToList, onSaveNewAddress }: AddressFormProps) => {
  const [formStep, setFormStep] = useState<FormStep>('city');
  const [formValues, setFormValues] = useState<FormValues>({
    city: '',
    street: '',
    apt: '',
    floor: '',
    entrance: '',
    intercom: '',
    comment: '',
  });
  const [formError, setFormError] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityPick[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const formStepRef = useRef<FormStep>(formStep);
  formStepRef.current = formStep;

  const flyToCity = useCallback((coords: [number, number], zoom = 13) => {
    if (!mapInstance.current) return;
    mapInstance.current.flyTo(coords, zoom);
    setTimeout(() => mapInstance.current?.invalidateSize(), 300);
  }, []);

  const placeMarker = useCallback((lat: number, lng: number) => {
    if (!mapInstance.current) return;
    const latLng = L.latLng(lat, lng);
    if (markerRef.current) {
      markerRef.current.setLatLng(latLng);
    } else {
      markerRef.current = L.marker(latLng).addTo(mapInstance.current);
    }
  }, []);

  const applyCitySelection = useCallback(
    (city: CityPick) => {
      setFormValues((prev) => ({ ...prev, city: city.label }));
      setCityQuery('');
      setSearchResults([]);
      setSearchError('');
      setFormError('');
      setFormStep('street');
      flyToCity(city.coords, 13);
      placeMarker(city.coords[0], city.coords[1]);
    },
    [flyToCity, placeMarker]
  );

  const handleMapClick = useCallback(
    async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      placeMarker(lat, lng);

      try {
        const data = await reverseGeocode(lat, lng);
        if (!data?.address) return;

        if (formStepRef.current === 'city') {
          const cityName = pickCityNameFromAddress(data.address);
          if (cityName) {
            setFormValues((prev) => ({ ...prev, city: cityName }));
            setCityQuery(cityName);
            setFormStep('street');
            setFormError('');
          }
          return;
        }

        const street = data.address.road || data.address.pedestrian || '';
        const house = data.address.house_number || '';
        setFormValues((prev) => ({
          ...prev,
          street: `${street}${house ? `, ${house}` : ''}`,
        }));
        setFormError('');
      } catch (err) {
        console.error(err);
      }
    },
    [placeMarker]
  );

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([55.75, 37.61], 11);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(
        mapInstance.current
      );
      mapInstance.current.on('click', handleMapClick);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.off('click', handleMapClick);
        mapInstance.current.remove();
        mapInstance.current = null;
        markerRef.current = null;
      }
    };
  }, [handleMapClick]);

  useEffect(() => {
    const query = cityQuery.trim();

    if (query.length < MIN_SEARCH_LENGTH) {
      setSearchResults([]);
      setSearchError('');
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError('');

      try {
        const results = await searchCities(query, controller.signal);
        setSearchResults(results);
      } catch (err) {
        if (controller.signal.aborted) return;
        setSearchResults([]);
        setSearchError('Не удалось загрузить города. Попробуйте ещё раз.');
        console.error(err);
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [cityQuery]);

  const filteredBaseCities = filterBaseCities(cityQuery);
  const showBaseCities = filteredBaseCities.length > 0;
  const showSearchResults = cityQuery.trim().length >= MIN_SEARCH_LENGTH;

  const handleFinalSave = () => {
    if (!formValues.street.trim()) {
      setFormError('Введите улицу и дом');
      return;
    }

    let finalAddr = `${formValues.city}, ${formValues.street.trim()}`;
    if (formValues.apt) finalAddr += `, кв. ${formValues.apt}`;

    onSaveNewAddress(finalAddr);
    onBackToList();
  };

  return (
    <div className="address-modal-container">
      <div className="map-section">
        <div className="map-overlay-controls">
          <button
            type="button"
            className="control-btn-round control-btn"
            onClick={formStep === 'city' ? onBackToList : () => setFormStep('city')}
          >
            ←
          </button>
        </div>
        <div ref={mapRef} id="leaflet-map" />
        {formStep === 'city' && (
          <p className="map-hint">Можно выбрать город из списка или ткнуть по карте</p>
        )}
      </div>

      <div className="form-section">
        <div className="form-header">
          <h2>Добавить адрес</h2>
        </div>

        {formStep === 'city' ? (
          <div className="inputs-scroll-area city-step">
            <input
              type="text"
              className="address-input city-search-input"
              placeholder="Поиск города..."
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              autoComplete="off"
            />

            {isSearching && <p className="city-search-status">Ищем города…</p>}
            {searchError && <p className="city-search-status city-search-status--error">{searchError}</p>}

            <div className="city-selection-list">
              {showBaseCities && (
                <div className="city-list-group">
                  <p className="city-list-label">Популярные</p>
                  {filteredBaseCities.map((city) => (
                    <button
                      key={city.label}
                      type="button"
                      className="city-item"
                      onClick={() => applyCitySelection(city)}
                    >
                      {city.label}
                    </button>
                  ))}
                </div>
              )}

              {showSearchResults && (
                <div className="city-list-group">
                  <p className="city-list-label">Результаты поиска</p>
                  {!isSearching && searchResults.length === 0 && !searchError && (
                    <p className="city-search-empty">Ничего не найдено. Попробуйте другое название.</p>
                  )}
                  {searchResults.map((city) => (
                    <button
                      key={city.placeId ?? `${city.label}-${city.coords.join()}`}
                      type="button"
                      className="city-item city-item--search"
                      onClick={() => applyCitySelection(city)}
                    >
                      <span className="city-item-name">{city.label}</span>
                      {city.subtitle && (
                        <span className="city-item-subtitle">{city.subtitle}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="inputs-scroll-area">
              <input type="text" className="address-input" value={formValues.city} readOnly />
              <input
                type="text"
                className="address-input"
                placeholder="Улица и дом"
                value={formValues.street}
                onChange={(e) => {
                  setFormValues({ ...formValues, street: e.target.value });
                  if (formError) setFormError('');
                }}
              />
              {formError && <div className="address-form-error">{formError}</div>}
              <p className="street-map-hint">Укажите адрес вручную или нажмите на карту слева</p>

              <div className="input-grid">
                <input
                  type="text"
                  className="address-input"
                  placeholder="Квартира"
                  onChange={(e) => setFormValues({ ...formValues, apt: e.target.value })}
                />
                <input
                  type="text"
                  className="address-input"
                  placeholder="Этаж"
                  onChange={(e) => setFormValues({ ...formValues, floor: e.target.value })}
                />
                <input
                  type="text"
                  className="address-input"
                  placeholder="Подъезд"
                  onChange={(e) => setFormValues({ ...formValues, entrance: e.target.value })}
                />
                <input
                  type="text"
                  className="address-input"
                  placeholder="Домофон"
                  onChange={(e) => setFormValues({ ...formValues, intercom: e.target.value })}
                />
              </div>

              <input
                type="text"
                className="address-input"
                placeholder="Комментарий"
                onChange={(e) => setFormValues({ ...formValues, comment: e.target.value })}
              />
            </div>

            <button
              type="button"
              className="btn btn--primary btn--lg btn--block confirm-button"
              onClick={handleFinalSave}
            >
              Да, всё верно
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
