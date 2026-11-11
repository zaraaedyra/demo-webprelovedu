// PRELOVEDU — Storage & State Service (storage.js)
// Lapisan data terpisah untuk memudahkan transisi dari LocalStorage ke Firebase Firestore (Fase 2)

import { dummyProducts } from '../data/dummy-products.js';
import { campusSpots } from '../data/campus-spots.js';

export const STORAGE_KEYS = {
  PRODUCTS: 'prelovedu_products',
  FAVORITES: 'prelovedu_favorites',
  OFFERS: 'prelovedu_offers',
  USER: 'prelovedu_user',
  NOTIFS: 'prelovedu_notifs'
};

// Simulasi user mahasiswa yang aktif (Bisa diubah lewat halaman profil/login)
export const DEFAULT_USER = {
  id: 'usr-maba-01',
  name: 'Zahra Putri',
  faculty: 'Informatika 2024',
  email: 'zahra@student.unsil.ac.id',
  isVerified: true,
  avatar: 'ZP',
  phone: '6281234567890'
};

/**
 * Inisialisasi data produk ke LocalStorage jika belum ada atau jika masih data lama (SVG)
 */
export function initStorage() {
  const currentProds = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!currentProds || currentProds.includes('.svg')) {
    const initialProducts = dummyProducts.map(p => ({
      ...p,
      status: p.id === 'prd-002' ? 'dalam_proses_cod' : (p.status || 'tersedia')
    }));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  }

  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    // Inisialisasi awal dengan 2 produk favorit contoh
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(['prd-001', 'prd-003']));
  }

  const currentOffers = localStorage.getItem(STORAGE_KEYS.OFFERS);
  if (!currentOffers || currentOffers.includes('.svg')) {
    // Tawaran contoh untuk simulasi alur Tawar lengkap (Terkirim & Masuk)
    const initialOffers = [
      {
        id: 'prd-002_usr-maba-01',
        productId: 'prd-002',
        productTitle: 'Jas Laboratorium Kimia FMIPA Bahan Katun Tebal Size L',
        productImage: 'assets/img/products/prd-002-1.jpg',
        sellerId: 'usr-anisa',
        sellerName: 'Anisa Rahmawati',
        sellerPhone: '628987654321',
        buyerId: 'usr-maba-01',
        buyerName: 'Zahra Putri',
        buyerPhone: '6281234567890',
        hargaListing: 45000,
        hargaTawar: 40000,
        catatan: 'Bisa COD di depan gedung rektorat kak?',
        status: 'diterima', // menunggu | ditawar_balik | diterima | ditolak | kedaluwarsa | dibatalkan
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        expiresAt: new Date(Date.now() + 3600000 * 44).toISOString()
      },
      {
        id: 'prd-003_usr-maba-01',
        productId: 'prd-003',
        productTitle: 'Hoodie Kampus Vintage Boxy Cut Sage Green Unisex',
        productImage: 'assets/img/products/prd-003-1.jpg',
        sellerId: 'usr-dimas',
        sellerName: 'Dimas Setiawan',
        sellerPhone: '6281399887766',
        buyerId: 'usr-maba-01',
        buyerName: 'Zahra Putri',
        buyerPhone: '6281234567890',
        hargaListing: 85000,
        hargaTawar: 70000,
        hargaBalik: 78000,
        catatan: 'Kalau 70rb boleh kak? Buat ganti hoodie kuliah.',
        status: 'ditawar_balik',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        expiresAt: new Date(Date.now() + 3600000 * 40).toISOString()
      },
      {
        id: 'prd-004_usr-maba-01',
        productId: 'prd-004',
        productTitle: 'Kalkulator Saintifik Casio fx-991EX ClassWiz Original',
        productImage: 'assets/img/products/prd-004-1.jpg',
        sellerId: 'usr-fauzan',
        sellerName: 'Fauzan Hidayat',
        sellerPhone: '6281122334455',
        buyerId: 'usr-maba-01',
        buyerName: 'Zahra Putri',
        buyerPhone: '6281234567890',
        hargaListing: 180000,
        hargaTawar: 160000,
        catatan: 'Bisa dicek solar cell-nya pas COD ya kak.',
        status: 'menunggu',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        expiresAt: new Date(Date.now() + 3600000 * 46).toISOString()
      },
      {
        id: 'prd-001_usr-budi',
        productId: 'prd-001',
        productTitle: 'Kalkulus Purcell Edisi 9 Jilid 1',
        productImage: 'assets/img/products/prd-001-1.jpg',
        sellerId: 'usr-maba-01',
        sellerName: 'Zahra Putri',
        sellerPhone: '6281234567890',
        buyerId: 'usr-budi',
        buyerName: 'Budi Santoso (Teknik Mesin 2024)',
        buyerPhone: '6287766554433',
        hargaListing: 65000,
        hargaTawar: 55000,
        catatan: 'Halo kak Zahra, apakah boleh 55rb? COD perpustakaan pusat besok siang.',
        status: 'menunggu',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        expiresAt: new Date(Date.now() + 3600000 * 45).toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(initialOffers));
  }

}

/**
 * Pastikan produk memiliki informasi titik COD valid
 */
export function ensureProductCodLocation(product) {
  if (!product) return null;
  if (product.codLocation && product.codLocation.lat && product.codLocation.lng) {
    return product;
  }

  // Fallback preset berdasarkan fakultas / ID
  const isKampus2 = product.faculty === 'Pertanian' || product.faculty === 'FISIP' || (product.id && product.id.endsWith('3'));
  const campusId = isKampus2 ? 'kampus-2' : 'kampus-1';
  const campus = campusSpots[campusId] || campusSpots['kampus-1'];
  const spots = campus.spots;
  const hash = (product.id || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const spot = spots[Math.abs(hash) % spots.length];

  return {
    ...product,
    status: product.status || 'tersedia',
    codLocation: {
      campus: campusId,
      campusName: campus.name,
      spotId: spot.id,
      lat: spot.lat,
      lng: spot.lng,
      spotName: spot.name
    }
  };
}

/**
 * Mendapatkan seluruh daftar produk
 */
export function getProducts() {
  initStorage();
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || dummyProducts;
    return raw.map(ensureProductCodLocation);
  } catch (e) {
    return dummyProducts.map(ensureProductCodLocation);
  }
}

/**
 * Mendapatkan produk berdasarkan ID
 */
export function getProductById(id) {
  const products = getProducts();
  const prod = products.find(p => p.id === id) || null;
  return prod ? ensureProductCodLocation(prod) : null;
}

/**
 * Menyimpan seluruh daftar produk ke LocalStorage
 */
export function saveProducts(products) {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  window.dispatchEvent(new CustomEvent('productsUpdated', { detail: products }));
}

/**
 * Menambahkan produk baru ke LocalStorage (digunakan oleh jual.html)
 */
export function addProduct(productData) {
  const products = getProducts();
  const id = productData.id || `prd-${Date.now()}`;
  const now = new Date().toISOString();

  const newProduct = {
    ...productData,
    id,
    createdAt: productData.createdAt || now
  };

  const validatedProduct = ensureProductCodLocation(newProduct);
  products.unshift(validatedProduct);
  saveProducts(products);

  return validatedProduct;
}

/**
 * Mendapatkan daftar ID produk yang difavoritkan
 */
export function getFavorites() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
  } catch (e) {
    return [];
  }
}

/**
 * Cek apakah produk difavoritkan
 */
export function isFavorited(productId) {
  const favs = getFavorites();
  return favs.includes(productId);
}

/**
 * Menambahkan atau menghapus favorit (Toggle)
 */
export function toggleFavorite(productId) {
  const favs = getFavorites();
  const index = favs.indexOf(productId);
  let status = false;

  if (index > -1) {
    favs.splice(index, 1);
    status = false;
  } else {
    favs.push(productId);
    status = true;
  }

  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
  window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { productId, isFavorited: status } }));
  return status;
}

/**
 * Mendapatkan data pengguna yang sedang aktif
 */
export function getCurrentUser() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || { id: null, name: 'Tamu', avatar: '?', role: 'tamu' };
  } catch (e) {
    return { id: null, name: 'Tamu', avatar: '?', role: 'tamu' };
  }
}

/**
 * Update data profil pengguna
 */
export function updateCurrentUser(patch) {
  const user = { ...getCurrentUser(), ...patch };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('userUpdated', { detail: user }));
  return user;
}

/**
 * Mendapatkan semua tawaran
 */
export function getOffers() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS)) || [];
  } catch (e) {
    return [];
  }
}

/**
 * Simpan daftar tawaran
 */
export function saveOffers(offers) {
  localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
  window.dispatchEvent(new CustomEvent('offersUpdated', { detail: offers }));
}

/**
 * Memperbarui status barang (tersedia | dalam_proses_cod | terjual)
 */
export function updateProductStatus(productId, newStatus) {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === productId);
  if (idx !== -1) {
    products[idx].status = newStatus;
    products[idx].updatedAt = new Date().toISOString();
    saveProducts(products);
    return products[idx];
  }
  return null;
}

/**
 * Menambahkan tawaran baru berstatus "menunggu"
 */
export function addOffer(offerData) {
  const offers = getOffers();
  const buyerId = offerData.buyerId || 'usr-maba-01';
  const filtered = offers.filter(o => !(o.productId === offerData.productId && o.buyerId === buyerId));
  const newOffer = {
    id: offerData.id || `${offerData.productId}_${buyerId}`,
    productId: offerData.productId,
    productTitle: offerData.productTitle,
    productImage: offerData.productImage || 'assets/img/products/prd-001-1.jpg',
    sellerId: offerData.sellerId || 'usr-seller',
    sellerName: offerData.sellerName || 'Penjual',
    sellerPhone: offerData.sellerPhone || '628123456789',
    buyerId: buyerId,
    buyerName: offerData.buyerName || 'Zahra Putri',
    buyerPhone: offerData.buyerPhone || '6281234567890',
    hargaListing: offerData.hargaListing,
    hargaTawar: offerData.hargaTawar,
    catatan: offerData.catatan || '',
    status: 'menunggu',
    createdAt: offerData.createdAt || new Date().toISOString(),
    expiresAt: offerData.expiresAt || new Date(Date.now() + 3600000 * 48).toISOString()
  };

  filtered.unshift(newOffer);
  saveOffers(filtered);
  return newOffer;
}

/**
 * Update satu tawaran berdasarkan ID
 */
export function updateOffer(offerId, patch) {
  const offers = getOffers();
  const idx = offers.findIndex(o => o.id === offerId);
  if (idx !== -1) {
    offers[idx] = { ...offers[idx], ...patch, updatedAt: new Date().toISOString() };
    saveOffers(offers);

    if (patch.status === 'diterima') {
      updateProductStatus(offers[idx].productId, 'dalam_proses_cod');
    }

    return offers[idx];
  }
  return null;
}

/**
 * Hitung tawaran aktif / belum selesai untuk titik merah notifikasi
 */
export function getUnreadOffersCount() {
  const offers = getOffers();
  return offers.filter(o => o.status === 'menunggu' || o.status === 'ditawar_balik' || o.status === 'diterima').length;
}


/* ===== Notifikasi admin & konfirmasi COD dua pihak (demo) ===== */
export function getNotifs() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFS)) || []; } catch (e) { return []; }
}
export function saveNotifs(list) {
  localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('notifsUpdated', { detail: list }));
}
export function addNotif(n) {
  const list = getNotifs();
  list.unshift({ id: 'ntf-' + Date.now(), read: false, createdAt: new Date().toISOString(), ...n });
  saveNotifs(list);
}
// role: 'buyer' | 'seller'. Jika dua-duanya sudah konfirmasi: tawaran selesai, barang terjual, admin dapat notif.
export function confirmCod(offerId, role) {
  const offers = getOffers();
  const o = offers.find(x => x.id === offerId);
  if (!o || o.status !== 'diterima') return null;
  if (role === 'buyer') o.codBuyer = true; else o.codSeller = true;
  if (o.codBuyer && o.codSeller) {
    o.status = 'selesai';
    saveOffers(offers);
    updateProductStatus(o.productId, 'terjual');
    addNotif({
      type: 'transaksi_selesai',
      productId: o.productId,
      text: `Transaksi "${o.productTitle}" selesai. Penjual ${o.sellerName} dan pembeli ${o.buyerName} sudah konfirmasi COD.`
    });
  } else {
    saveOffers(offers);
  }
  return o;
}
