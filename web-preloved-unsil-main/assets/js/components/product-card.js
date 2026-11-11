// PRELOVEDU — Komponen Kartu Produk (product-card.js)
// Sesuai panduan visual Bagian 5.4 & 5.5: Outline tebal, sudut rounded 26px, 
// foto di blok lilac dengan bayangan elips, harga besar serif, tombol favorit.

import { icons } from './icons.js';
import { isFavorited } from '../services/storage.js';

/**
 * Format angka ke format Rupiah standar PRELOVEDU (contoh: Rp 45.000)
 */
export function formatRupiah(number) {
  return 'Rp ' + Number(number).toLocaleString('id-ID');
}

/**
 * Render Lencana Status Barang
 */
export function renderStatusBadge(status = 'tersedia') {
  if (status === 'terjual') {
    return `<span class="badge-pill badge-status badge-status-sold" style="background:#374151; color:#ffffff; border-color:var(--ink);">✓ Terjual</span>`;
  }
  if (status === 'dalam_proses_cod') {
    return `<span class="badge-pill badge-pill-lilac badge-status">🤝 Dalam Proses COD</span>`;
  }
  return `<span class="badge-pill badge-pill-lime badge-status">Tersedia</span>`;
}

/**
 * Render Kartu Produk Mandiri
 * @param {Object} product - Data objek produk
 * @param {Object} options - Opsi tambahan
 */
export function renderProductCard(product, { basePath = '' } = {}) {
  const favorited = isFavorited(product.id);
  const detailUrl = `${basePath}pages/detail.html?id=${product.id}`;
  const imgUrl = `${basePath}${product.images && product.images[0] ? product.images[0] : 'assets/img/products/prd-001-1.jpg'}`;
  const status = product.status || 'tersedia';

  // Warna latar thumbnail divariasi agar estetik (lilac, lime lembut, atau warm gray)
  const bgClasses = ['bg-lilac', 'bg-lime', 'bg-gray'];
  const bgChoice = bgClasses[Math.abs(product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % bgClasses.length];

  return `
    <article class="product-card ${status === 'terjual' ? 'is-sold' : ''}" data-product-id="${product.id}">
      <!-- Thumbnail Box dengan Bayangan Elips & Tombol Aksi Cepat -->
      <div class="product-thumb-box ${bgChoice}">
        ${renderStatusBadge(status)}

        <button type="button" 
                class="btn-circle btn-circle-white btn-favorite ${favorited ? 'favorited' : ''}" 
                data-fav-id="${product.id}"
                aria-label="Simpan ${product.title} ke favorit"
                title="Simpan ke favorit">
          ${icons.heart(19, 2.5, favorited)}
        </button>

        <span class="badge-pill badge-pill-lime badge-condition">
          ${product.conditionBadge || product.condition}
        </span>

        <a href="${detailUrl}" class="d-flex align-items-center justify-content-center w-100 h-100" tabindex="-1">
          <img src="${imgUrl}" alt="${product.title}" loading="lazy" />
          <div class="product-thumb-shadow"></div>
        </a>
      </div>

      <!-- Informasi Produk -->
      <div class="product-card-body">
        <div>
          <div class="product-faculty-tag">${product.faculty || 'Umum'} · ${product.categoryLabel}</div>
          <h3 class="product-title">
            <a href="${detailUrl}">${product.title}</a>
          </h3>
          <div class="product-seller-info">
            <span style="color:var(--ink);">${icons.shieldCheck(14, 2.5)}</span>
            <span>${product.seller?.name || 'Mahasiswa'} (${product.seller?.faculty?.split(' ')[0] || 'Kampus'})</span>
          </div>
        </div>

        <div class="product-card-footer">
          <div>
            <div class="product-price-val">${formatRupiah(product.price)}</div>
          </div>
          <a href="${detailUrl}" class="btn-circle btn-circle-ink" aria-label="Lihat detail ${product.title}" title="Lihat detail barang">
            ${icons.arrowRight(18, 2.5)}
          </a>
        </div>
      </div>
    </article>
  `;
}
