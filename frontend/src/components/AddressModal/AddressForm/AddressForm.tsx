import { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  filterBaseCities,
  formatStreetAddress,
  OSM_TILE_URL,
  pickCityNameFromAddress,
  reverseGeocode,
  searchAddresses,
  searchCities,
  type AddressPick,
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

const MIN_CITY_SEARCH_LENGTH = 2;
const MIN_ADDRESS_SEARCH_LENGTH = 3;

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
  const [citySearchResults, setCitySearchResults] = useState<CityPick[]>([]);
  const [hasCitySearch, setHasCitySearch] = useState(false);
  const [isCitySearching, setIsCitySearching] = useState(false);
  const [citySearchError, setCitySearchError] = useState('');
  const [addressSearchResults, setAddressSearchResults] = useState<AddressPick[]>([]);
  const [hasAddressSearch, setHasAddressSearch] = useState(false);
  const [isAddressSearching, setIsAddressSearching] = useState(false);
  const [addressSearchError, setAddressSearchError] = useState('');
  const [mapStatus, setMapStatus] = useState('');

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);
  const formStepRef = useRef<FormStep>(formStep);
  const citySearchControllerRef = useRef<AbortController | null>(null);
  const addressSearchControllerRef = useRef<AbortController | null>(null);
  const reverseControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    formStepRef.current = formStep;
  }, [formStep]);

  const focusLocation = useCallback((coords: [number, number], zoom = 13) => {
    if (!mapInstance.current) return;
    mapInstance.current.setView(coords, zoom);
    window.setTimeout(() => mapInstance.current?.invalidateSize(), 0);
  }, []);

  const placeMarker = useCallback((lat: number, lng: number) => {
    if (!mapInstance.current) return;
    const latLng = L.latLng(lat, lng);

    if (markerRef.current) {
      markerRef.current.setLatLng(latLng);
      return;
    }

    markerRef.current = L.circleMarker(latLng, {
      radius: 8,
      color: '#ffffff',
      fillColor: '#2563eb',
      fillOpacity: 1,
      weight: 3,
    }).addTo(mapInstance.current);
  }, []);

  const applyCitySelection = useCallback(
    (city: CityPick) => {
      setFormValues((prev) => ({ ...prev, city: city.label, street: '' }));
      setCityQuery('');
      setCitySearchResults([]);
      setHasCitySearch(false);
      setCitySearchError('');
      setAddressSearchResults([]);
      setHasAddressSearch(false);
      setFormError('');
      setMapStatus('');
      setFormStep('street');
      focusLocation(city.coords, 13);
      placeMarker(city.coords[0], city.coords[1]);
    },
    [focusLocation, placeMarker]
  );

  const applyAddressSelection = useCallback(
    (address: AddressPick) => {
      setFormValues((prev) => ({ ...prev, street: address.label }));
      setAddressSearchResults([]);
      setHasAddressSearch(false);
      setAddressSearchError('');
      setFormError('');
      setMapStatus(address.subtitle || address.label);
      focusLocation(address.coords, 17);
      placeMarker(address.coords[0], address.coords[1]);
    },
    [focusLocation, placeMarker]
  );

  const handleMapClick = useCallback(
    async (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      reverseControllerRef.current?.abort();
      const controller = new AbortController();
      reverseControllerRef.current = controller;
      placeMarker(lat, lng);
      setMapStatus('Определяем адрес...');

      try {
        const data = await reverseGeocode(lat, lng, controller.signal);
        if (!data?.address) {
          setMapStatus('Не удалось определить адрес. Укажите его вручную.');
          return;
        }

        setMapStatus(data.display_name);

        if (formStepRef.current === 'city') {
          const cityName = pickCityNameFromAddress(data.address);
          if (!cityName) {
            setMapStatus('Не удалось определить город. Выберите его из списка.');
            return;
          }

          setFormValues((prev) => ({ ...prev, city: cityName, street: '' }));
          setCityQuery('');
          setCitySearchResults([]);
          setHasCitySearch(false);
          setFormStep('street');
          setFormError('');
          return;
        }

        const street = formatStreetAddress(data.address, data.display_name);
        if (street) {
          setFormValues((prev) => ({ ...prev, street }));
          setAddressSearchResults([]);
          setHasAddressSearch(false);
          setFormError('');
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setMapStatus('Не удалось определить адрес. Укажите его вручную.');
        console.error(error);
      }
    },
    [placeMarker]
  );

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView(
        [55.75, 37.61],
        11
      );
      L.tileLayer(OSM_TILE_URL, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);
      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
      mapInstance.current.on('click', handleMapClick);
    }

    return () => {
      citySearchControllerRef.current?.abort();
      addressSearchControllerRef.current?.abort();
      reverseControllerRef.current?.abort();

      if (mapInstance.current) {
        mapInstance.current.off('click', handleMapClick);
        mapInstance.current.remove();
        mapInstance.current = null;
        markerRef.current = null;
      }
    };
  }, [handleMapClick]);

  const handleCitySearch = async () => {
    const query = cityQuery.trim();
    if (query.length < MIN_CITY_SEARCH_LENGTH) {
      setCitySearchResults([]);
      setHasCitySearch(false);
      setCitySearchError('Введите минимум 2 символа');
      return;
    }

    citySearchControllerRef.current?.abort();
    const controller = new AbortController();
    citySearchControllerRef.current = controller;
    setIsCitySearching(true);
    setCitySearchError('');
    setHasCitySearch(true);

    try {
      setCitySearchResults(await searchCities(query, controller.signal));
    } catch (error) {
      if (controller.signal.aborted) return;
      setCitySearchResults([]);
      setCitySearchError('Не удалось загрузить города. Попробуйте еще раз.');
      console.error(error);
    } finally {
      if (!controller.signal.aborted) setIsCitySearching(false);
    }
  };

  const handleAddressSearch = async () => {
    const street = formValues.street.trim();
    if (street.length < MIN_ADDRESS_SEARCH_LENGTH) {
      setAddressSearchResults([]);
      setHasAddressSearch(false);
      setAddressSearchError('Введите улицу или адрес дома');
      return;
    }

    addressSearchControllerRef.current?.abort();
    const controller = new AbortController();
    addressSearchControllerRef.current = controller;
    setIsAddressSearching(true);
    setAddressSearchError('');
    setHasAddressSearch(true);

    try {
      setAddressSearchResults(
        await searchAddresses(formValues.city, street, controller.signal)
      );
    } catch (error) {
      if (controller.signal.aborted) return;
      setAddressSearchResults([]);
      setAddressSearchError('Не удалось найти адрес. Попробуйте еще раз.');
      console.error(error);
    } finally {
      if (!controller.signal.aborted) setIsAddressSearching(false);
    }
  };

  const filteredBaseCities = filterBaseCities(cityQuery);

  const handleFinalSave = () => {
    if (!formValues.street.trim()) {
      setFormError('Введите улицу и дом');
      return;
    }

    let finalAddress = `${formValues.city}, ${formValues.street.trim()}`;
    if (formValues.apt) finalAddress += `, кв. ${formValues.apt}`;

    onSaveNewAddress(finalAddress);
    onBackToList();
  };

  return (
    <div className="address-modal-container">
      <div className="map-section">
        <div className="map-overlay-controls">
          <button
            type="button"
            className="control-btn-round control-btn"
            aria-label="Назад"
            onClick={formStep === 'city' ? onBackToList : () => setFormStep('city')}
          >
            ←
          </button>
        </div>
        <div ref={mapRef} id="leaflet-map" />
        <p className="map-hint">
          {mapStatus ||
            (formStep === 'city'
              ? 'Выберите город из списка или нажмите на карту'
              : 'Нажмите на карту, чтобы уточнить адрес')}
        </p>
      </div>

      <div className="form-section">
        <div className="form-header">
          <h2>Добавить адрес</h2>
        </div>

        {formStep === 'city' ? (
          <div className="inputs-scroll-area city-step">
            <div className="address-search-row">
              <input
                type="search"
                className="address-input city-search-input"
                placeholder="Поиск города..."
                value={cityQuery}
                onChange={(event) => {
                  setCityQuery(event.target.value);
                  setCitySearchError('');
                  setHasCitySearch(false);
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter') return;
                  event.preventDefault();
                  void handleCitySearch();
                }}
                autoComplete="off"
              />
              <button
                type="button"
                className="btn btn--primary btn--md address-search-button"
                onClick={() => void handleCitySearch()}
                disabled={isCitySearching}
              >
                Найти
              </button>
            </div>

            {isCitySearching && <p className="city-search-status">Ищем город...</p>}
            {citySearchError && (
              <p className="city-search-status city-search-status--error">
                {citySearchError}
              </p>
            )}

            <div className="city-selection-list">
              {filteredBaseCities.length > 0 && (
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

              {hasCitySearch && (
                <div className="city-list-group">
                  <p className="city-list-label">Результаты поиска</p>
                  {!isCitySearching &&
                    citySearchResults.length === 0 &&
                    !citySearchError && (
                      <p className="city-search-empty">
                        Ничего не найдено. Попробуйте другое название.
                      </p>
                    )}
                  {citySearchResults.map((city) => (
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
              <div className="address-search-row">
                <input
                  type="search"
                  className="address-input"
                  placeholder="Улица и дом"
                  value={formValues.street}
                  onChange={(event) => {
                    setFormValues({ ...formValues, street: event.target.value });
                    setAddressSearchError('');
                    setHasAddressSearch(false);
                    if (formError) setFormError('');
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter') return;
                    event.preventDefault();
                    void handleAddressSearch();
                  }}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="btn btn--primary btn--md address-search-button"
                  onClick={() => void handleAddressSearch()}
                  disabled={isAddressSearching}
                >
                  Найти
                </button>
              </div>

              {isAddressSearching && <p className="city-search-status">Ищем адрес...</p>}
              {addressSearchError && (
                <p className="city-search-status city-search-status--error">
                  {addressSearchError}
                </p>
              )}
              {hasAddressSearch && addressSearchResults.length === 0 && !isAddressSearching && (
                <p className="city-search-empty">
                  Ничего не найдено. Проверьте город, улицу и номер дома.
                </p>
              )}
              {addressSearchResults.length > 0 && (
                <div className="address-results">
                  {addressSearchResults.map((address) => (
                    <button
                      key={address.placeId ?? `${address.label}-${address.coords.join()}`}
                      type="button"
                      className="city-item city-item--search"
                      onClick={() => applyAddressSelection(address)}
                    >
                      <span className="city-item-name">{address.label}</span>
                      {address.subtitle && (
                        <span className="city-item-subtitle">{address.subtitle}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {formError && <div className="address-form-error">{formError}</div>}
              <p className="street-map-hint">
                Введите улицу и дом, затем нажмите «Найти», или укажите точку на карте
              </p>

              <div className="input-grid">
                <input
                  type="text"
                  className="address-input"
                  placeholder="Квартира"
                  onChange={(event) => setFormValues({ ...formValues, apt: event.target.value })}
                />
                <input
                  type="text"
                  className="address-input"
                  placeholder="Этаж"
                  onChange={(event) => setFormValues({ ...formValues, floor: event.target.value })}
                />
                <input
                  type="text"
                  className="address-input"
                  placeholder="Подъезд"
                  onChange={(event) =>
                    setFormValues({ ...formValues, entrance: event.target.value })
                  }
                />
                <input
                  type="text"
                  className="address-input"
                  placeholder="Домофон"
                  onChange={(event) =>
                    setFormValues({ ...formValues, intercom: event.target.value })
                  }
                />
              </div>

              <input
                type="text"
                className="address-input"
                placeholder="Комментарий"
                onChange={(event) =>
                  setFormValues({ ...formValues, comment: event.target.value })
                }
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
