// PRELOVEDU — Data Preset Titik COD Kampus Unsil (campus-spots.js)
// Sesuai Bagian "Peta COD Interaktif Kampus" pada README.md

export const campusSpots = {
  'kampus-1': {
    id: 'kampus-1',
    name: 'Kampus 1 Unsil',
    shortName: 'Kampus 1',
    address: 'Jl. Siliwangi No.24, Kahuripan, Tawang, Tasikmalaya',
    center: [-7.3439, 108.2238],
    zoom: 17,
    bounds: {
      south: -7.3465,
      north: -7.3415,
      west: 108.2210,
      east: 108.2265
    },
    spots: [
      {
        id: 'k1-1',
        name: 'Rektorat & Plaza Utama Unsil',
        lat: -7.3438,
        lng: 108.2236,
        description: 'Area lobi rektorat dan plaza tengah yang terbuka, ramai, dan terpantau satpam.'
      },
      {
        id: 'k1-2',
        name: 'Perpustakaan Pusat Unsil',
        lat: -7.3442,
        lng: 108.2241,
        description: 'Lantai dasar lobi perpustakaan ber-AC, nyaman untuk cek kondisi buku dan barang.'
      },
      {
        id: 'k1-3',
        name: 'Gedung Kuliah Bersama / Dekanat',
        lat: -7.3435,
        lng: 108.2245,
        description: 'Koridor lantai 1 dekat tangga utama, strategis di antara fakultas teknik dan ekonomi.'
      },
      {
        id: 'k1-4',
        name: 'Masjid Al-Muhajirin Unsil',
        lat: -7.3445,
        lng: 108.2230,
        description: 'Serambi luar masjid dekat tempat wudu pria/wanita, tenang dan aman saat jam jeda salat.'
      },
      {
        id: 'k1-5',
        name: 'Gerbang Utama Jl. Siliwangi',
        lat: -7.3430,
        lng: 108.2233,
        description: 'Dekat pos satpam gerbang depan, pas untuk COD kilat tanpa perlu parkir jauh.'
      }
    ]
  },
  'kampus-2': {
    id: 'kampus-2',
    name: 'Kampus 2 Unsil',
    shortName: 'Kampus 2',
    address: 'Mugarsari, Tamansari, Tasikmalaya',
    center: [-7.3756, 108.2285],
    zoom: 17,
    bounds: {
      south: -7.3780,
      north: -7.3735,
      west: 108.2260,
      east: 108.2310
    },
    spots: [
      {
        id: 'k2-1',
        name: 'Halaman Utama Kampus 2 Mugarsari',
        lat: -7.3755,
        lng: 108.2283,
        description: 'Drop-off point depan gedung perkuliahan Mugarsari dengan penerangan luas.'
      },
      {
        id: 'k2-2',
        name: 'Area Kantin & Gazebo Mahasiswa Kampus 2',
        lat: -7.3759,
        lng: 108.2288,
        description: 'Meja santai kantin dan gazebo teduh, pas untuk transaksi sambil nongkrong.'
      },
      {
        id: 'k2-3',
        name: 'Pos Keamanan & Gerbang Masuk Mugarsari',
        lat: -7.3750,
        lng: 108.2280,
        description: 'Pos jaga satpam depan pintu gerbang utama Mugarsari yang selalu dijaga 24 jam.'
      }
    ]
  }
};

export const campusList = Object.values(campusSpots);

/**
 * Mendapatkan data kampus berdasarkan ID
 */
export function getCampus(campusId) {
  return campusSpots[campusId] || campusSpots['kampus-1'];
}

/**
 * Mendapatkan spot tertentu dari kampus
 */
export function getSpot(campusId, spotId) {
  const campus = campusSpots[campusId];
  if (!campus) return null;
  return campus.spots.find(s => s.id === spotId) || null;
}

/**
 * Validasi apakah koordinat berada dalam batas kampus yang dipilih
 */
export function isWithinCampus(campusId, lat, lng) {
  const campus = campusSpots[campusId];
  if (!campus || !campus.bounds) return false;
  const { south, north, west, east } = campus.bounds;
  return lat >= south && lat <= north && lng >= west && lng <= east;
}

/**
 * Mencari apakah koordinat pas dengan salah satu preset spot (toleransi ~15 meter)
 */
export function matchPresetSpot(campusId, lat, lng, tolerance = 0.00015) {
  const campus = campusSpots[campusId];
  if (!campus) return null;
  return campus.spots.find(s => {
    return Math.abs(s.lat - lat) <= tolerance && Math.abs(s.lng - lng) <= tolerance;
  }) || null;
}
