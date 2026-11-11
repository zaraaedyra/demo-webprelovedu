// PRELOVEDU — Modul Peta COD Interaktif Kampus (map.js)
// Menggunakan Leaflet.js + OpenStreetMap untuk Universitas Siliwangi (Kampus 1 & 2)
// Sesuai Panduan Visual: Pin --heart-red (#E5322D), Popup & Kontrol outline --ink (#2A2A2A)

import { campusSpots, getCampus, getSpot, isWithinCampus, matchPresetSpot } from '../data/campus-spots.js';

/**
 * Helper untuk membuat icon pin kustom Leaflet
 */
export function createPinIcon({ color = '#E5322D', isSelected = false, label = '' } = {}) {
  const width = isSelected ? 34 : 28;
  const height = isSelected ? 44 : 36;
  const strokeColor = '#2A2A2A';

  return L.divIcon({
    className: 'custom-map-pin-wrapper',
    html: `
      <div class="custom-map-pin ${isSelected ? 'is-selected' : ''}" style="width:${width}px; height:${height}px;">
        <svg viewBox="0 0 24 32" width="${width}" height="${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#2A2A2A" flood-opacity="0.35"/>
          </filter>
          <path d="M12 0C5.372 0 0 5.372 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.372 18.628 0 12 0Z" 
                fill="${color}" stroke="${strokeColor}" stroke-width="2.2" filter="url(#shadow)"/>
          <circle cx="12" cy="11.5" r="4.5" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="1.8"/>
        </svg>
        ${label ? `<span class="pin-badge-label">${label}</span>` : ''}
      </div>
    `,
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height + 4]
  });
}

/**
 * Inisialisasi Peta Pemilih Titik COD Interaktif (untuk halaman jual.html)
 * Mendukung pilih Kampus 1/2, pin spot preset, klik bebas dalam batas kampus,
 * dan menolak klik di luar batas kampus.
 *
 * @param {string|HTMLElement} container - ID atau elemen HTML kontainer peta
 * @param {Object} options
 * @param {string} [options.initialCampus='kampus-1'] - 'kampus-1' | 'kampus-2'
 * @param {string|null} [options.initialSpotId=null] - ID spot preset
 * @param {number|null} [options.initialLat=null] - Latitude awal
 * @param {number|null} [options.initialLng=null] - Longitude awal
 * @param {Function} [options.onChange] - Callback saat lokasi berubah: ({ campus, spotId, lat, lng, spotName }) => void
 * @param {Function} [options.onError] - Callback saat klik ditolak di luar batas: (message) => void
 */
export function initCodPickerMap(container, options = {}) {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) {
    console.error(`[PRELOVEDU Map] Elemen kontainer peta tidak ditemukan: ${container}`);
    return null;
  }

  // State internal peta
  let currentCampusId = options.initialCampus || 'kampus-1';
  let activeCampus = getCampus(currentCampusId);

  // Nilai awal: gunakan initialSpotId atau initialLat/Lng atau spot pertama kampus
  const firstSpot = activeCampus.spots[0];
  let selectedSpotId = options.initialSpotId !== undefined ? options.initialSpotId : (options.initialLat ? null : firstSpot.id);
  let selectedLat = options.initialLat || (selectedSpotId ? getSpot(currentCampusId, selectedSpotId)?.lat : firstSpot.lat);
  let selectedLng = options.initialLng || (selectedSpotId ? getSpot(currentCampusId, selectedSpotId)?.lng : firstSpot.lng);
  let selectedSpotName = selectedSpotId 
    ? getSpot(currentCampusId, selectedSpotId)?.name 
    : (options.initialSpotName || 'Titik COD Kustom Kampus');

  // Inisialisasi Leaflet Map
  const map = L.map(el, {
    zoomControl: true,
    scrollWheelZoom: true,
    attributionControl: true
  }).setView([selectedLat, selectedLng], activeCampus.zoom || 17);

  // Tile layer OpenStreetMap standar
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> · PRELOVEDU'
  }).addTo(map);

  // Layer groups untuk marker dan perimeter kampus
  const boundaryLayerGroup = L.layerGroup().addTo(map);
  const presetMarkersGroup = L.layerGroup().addTo(map);
  let activeMarker = null;

  /**
   * Menggambar batas / perimeter kampus
   */
  function renderBoundary() {
    boundaryLayerGroup.clearLayers();
    if (!activeCampus.bounds) return;

    const { south, north, west, east } = activeCampus.bounds;
    const bounds = [[south, west], [north, east]];

    // Gambar zona aman kampus dengan styling Playful-Editorial
    const rect = L.rectangle(bounds, {
      color: '#2A2A2A',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#C9F26B',
      fillOpacity: 0.12,
      interactive: false
    });
    boundaryLayerGroup.addLayer(rect);
  }

  /**
   * Notifikasi perubahan nilai ke pemanggil
   */
  function notifyChange() {
    const payload = {
      campus: currentCampusId,
      campusName: activeCampus.name,
      spotId: selectedSpotId,
      lat: Number(selectedLat.toFixed(6)),
      lng: Number(selectedLng.toFixed(6)),
      spotName: selectedSpotName,
      isCustom: selectedSpotId === null
    };

    if (typeof options.onChange === 'function') {
      options.onChange(payload);
    }

    return payload;
  }

  /**
   * Render atau update pin aktif yang terpilih
   */
  function updateActiveMarker(openPopup = false) {
    if (activeMarker) {
      map.removeLayer(activeMarker);
      activeMarker = null;
    }

    const isPreset = selectedSpotId !== null;
    const pinColor = '#E5322D'; // --heart-red khas PRELOVEDU

    activeMarker = L.marker([selectedLat, selectedLng], {
      icon: createPinIcon({ color: pinColor, isSelected: true }),
      zIndexOffset: 1000
    }).addTo(map);

    const popupHtml = `
      <div class="cod-map-popup">
        <div class="popup-tag ${isPreset ? 'badge-safe' : 'badge-custom'}">
          ${isPreset ? '🛡️ Spot Aman Kampus' : '📍 Titik COD Kustom'}
        </div>
        <div class="popup-title">${selectedSpotName}</div>
        <div class="popup-sub">${activeCampus.name}</div>
        <div class="popup-coords">${selectedLat.toFixed(5)}, ${selectedLng.toFixed(5)}</div>
      </div>
    `;

    activeMarker.bindPopup(popupHtml, {
      className: 'prelovedu-leaflet-popup',
      offset: [0, -10]
    });

    if (openPopup) {
      activeMarker.openPopup();
    }
  }

  /**
   * Render semua preset spots kampus sebagai marker interaktif
   */
  function renderPresetMarkers() {
    presetMarkersGroup.clearLayers();

    activeCampus.spots.forEach(spot => {
      // Gunakan warna lilac pastel untuk preset yang belum aktif
      const isCurrentlySelected = selectedSpotId === spot.id;
      const marker = L.marker([spot.lat, spot.lng], {
        icon: createPinIcon({
          color: isCurrentlySelected ? '#E5322D' : '#E9C6EA',
          isSelected: isCurrentlySelected
        }),
        title: spot.name
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        selectPresetSpot(spot.id, true);
      });

      presetMarkersGroup.addLayer(marker);
    });
  }

  /**
   * Pilih salah satu preset spot
   */
  function selectPresetSpot(spotId, openPopup = true) {
    const spot = getSpot(currentCampusId, spotId);
    if (!spot) return;

    selectedSpotId = spot.id;
    selectedLat = spot.lat;
    selectedLng = spot.lng;
    selectedSpotName = spot.name;

    renderPresetMarkers();
    updateActiveMarker(openPopup);
    notifyChange();
  }

  /**
   * Tangani klik langsung pada peta untuk titik bebas
   */
  map.on('click', (e) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // VALIDASI: Tolak klik di luar batas kampus
    if (!isWithinCampus(currentCampusId, lat, lng)) {
      const errMsg = `Titik di luar batas ${activeCampus.name}! Pilih lokasi di dalam area kampus yang aman.`;
      
      // Tampilkan popup sementara penolakan di koordinat klik
      const rejectPopup = L.popup({
        className: 'prelovedu-leaflet-popup reject-popup',
        offset: [0, -4]
      })
      .setLatLng([lat, lng])
      .setContent(`
        <div class="cod-map-popup error">
          <div class="popup-tag badge-rejected">⚠️ Di Luar Batas Kampus</div>
          <div class="popup-title">Titik Tidak Diizinkan</div>
          <div class="popup-sub">Hanya boleh COD di dalam area ${activeCampus.name}.</div>
        </div>
      `)
      .openOn(map);

      setTimeout(() => {
        map.closePopup(rejectPopup);
      }, 2500);

      if (typeof options.onError === 'function') {
        options.onError(errMsg);
      }
      return;
    }

    // Jika koordinat sangat dekat dengan preset spot, sambungkan ke preset
    const matched = matchPresetSpot(currentCampusId, lat, lng);
    if (matched) {
      selectPresetSpot(matched.id, true);
      return;
    }

    // Titik bebas di dalam kampus yang valid
    selectedSpotId = null;
    selectedLat = lat;
    selectedLng = lng;
    selectedSpotName = 'Titik COD Kustom Kampus';

    renderPresetMarkers();
    updateActiveMarker(true);
    notifyChange();
  });

  /**
   * Mengganti kampus (Kampus 1 <-> Kampus 2)
   */
  function setCampus(campusId, preserveSpotId = null) {
    if (!campusSpots[campusId]) return;

    currentCampusId = campusId;
    activeCampus = getCampus(campusId);

    const defaultSpot = (preserveSpotId && getSpot(campusId, preserveSpotId)) 
      ? getSpot(campusId, preserveSpotId) 
      : activeCampus.spots[0];

    selectedSpotId = defaultSpot ? defaultSpot.id : null;
    selectedLat = defaultSpot ? defaultSpot.lat : activeCampus.center[0];
    selectedLng = defaultSpot ? defaultSpot.lng : activeCampus.center[1];
    selectedSpotName = defaultSpot ? defaultSpot.name : 'Titik COD Kustom Kampus';

    renderBoundary();
    renderPresetMarkers();
    updateActiveMarker(false);

    map.flyTo([selectedLat, selectedLng], activeCampus.zoom || 17, {
      duration: 0.8
    });

    notifyChange();
  }

  // Render awal
  renderBoundary();
  renderPresetMarkers();
  updateActiveMarker(false);
  notifyChange();

  // Helper agar render ukuran peta tidak glitch jika berada di tab/stepper
  setTimeout(() => {
    map.invalidateSize();
  }, 100);

  return {
    map,
    setCampus,
    selectPresetSpot,
    getValue: () => ({
      campus: currentCampusId,
      campusName: activeCampus.name,
      spotId: selectedSpotId,
      lat: Number(selectedLat.toFixed(6)),
      lng: Number(selectedLng.toFixed(6)),
      spotName: selectedSpotName,
      isCustom: selectedSpotId === null
    }),
    invalidateSize: () => map.invalidateSize(),
    destroy: () => map.remove()
  };
}

/**
 * Inisialisasi Peta Tampilan Titik COD Penjual (untuk halaman detail.html)
 * Menampilkan pin titik COD pasti yang ditetapkan penjual beserta info kampus.
 *
 * @param {string|HTMLElement} container - ID atau elemen HTML kontainer peta
 * @param {Object} locationData - { campus, spotId, lat, lng, spotName }
 */
export function initCodDisplayMap(container, locationData = {}) {
  const el = typeof container === 'string' ? document.getElementById(container) : container;
  if (!el) {
    console.error(`[PRELOVEDU Map] Elemen kontainer peta tidak ditemukan: ${container}`);
    return null;
  }

  const campusId = locationData.campus || 'kampus-1';
  const campus = getCampus(campusId);

  // Jika lat/lng tidak valid, ambil fallback dari spotId atau spot pertama kampus
  let lat = Number(locationData.lat);
  let lng = Number(locationData.lng);

  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
    const preset = locationData.spotId ? getSpot(campusId, locationData.spotId) : campus.spots[0];
    lat = preset ? preset.lat : campus.center[0];
    lng = preset ? preset.lng : campus.center[1];
  }

  const spotName = locationData.spotName 
    || (locationData.spotId ? getSpot(campusId, locationData.spotId)?.name : null)
    || 'Titik COD Kampus';

  const isPreset = Boolean(locationData.spotId);

  const map = L.map(el, {
    zoomControl: true,
    scrollWheelZoom: false, // Tidak membajak scroll halaman detail di mobile
    attributionControl: true
  }).setView([lat, lng], 17);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap · PRELOVEDU'
  }).addTo(map);

  // Gambar zona kampus secara halus
  if (campus.bounds) {
    const { south, north, west, east } = campus.bounds;
    L.rectangle([[south, west], [north, east]], {
      color: '#2A2A2A',
      weight: 1.5,
      dashArray: '5, 5',
      fillColor: '#C9F26B',
      fillOpacity: 0.08,
      interactive: false
    }).addTo(map);
  }

  // Pin lokasi COD penjual berwarna --heart-red
  const marker = L.marker([lat, lng], {
    icon: createPinIcon({ color: '#E5322D', isSelected: true }),
    title: spotName
  }).addTo(map);

  const popupContent = `
    <div class="cod-map-popup">
      <div class="popup-tag ${isPreset ? 'badge-safe' : 'badge-custom'}">
        ${isPreset ? '🛡️ Spot Aman Kampus' : '📍 Titik COD Penjual'}
      </div>
      <div class="popup-title">${spotName}</div>
      <div class="popup-sub">${campus.name}</div>
      <div class="popup-coords">${lat.toFixed(5)}, ${lng.toFixed(5)}</div>
    </div>
  `;

  marker.bindPopup(popupContent, {
    className: 'prelovedu-leaflet-popup',
    offset: [0, -10]
  }).openPopup();

  setTimeout(() => {
    map.invalidateSize();
  }, 100);

  return {
    map,
    marker,
    invalidateSize: () => map.invalidateSize(),
    destroy: () => map.remove()
  };
}
