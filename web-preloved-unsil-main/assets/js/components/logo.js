// PRELOVEDU — Komponen Logo SVG (logo.js)
// Sesuai spesifikasi Bagian 5.1: Wordmark PRELOVEDU dengan huruf "O" diganti 
// ikon heart daur ulang (3 panah melingkar berwarna merah siluet hati).

/**
 * Mengembalikan SVG Ikon Hati Daur Ulang (Recycled Heart Icon)
 * @param {string} color - Warna panah (default: #E5322D)
 * @param {number} size - Ukuran pixel
 */
export function getRecycledHeartSvg(color = '#E5322D', size = 26) {
  return `
    <svg class="recycled-heart-icon" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
      <!-- Panah 1: Sisi Kiri Lengkung ke Atas -->
      <path d="M 14 30 C 8 22 10 13 18 10 C 22 8 24 11 24 13" 
            stroke="${color}" stroke-width="4.5" stroke-linecap="round" fill="none" />
      <polygon points="12,28 16,35 7,33" fill="${color}" />

      <!-- Panah 2: Lengkung Kanan Atas -->
      <path d="M 24 13 C 25 10 29 8 32 9 C 39 12 41 21 35 29" 
            stroke="${color}" stroke-width="4.5" stroke-linecap="round" fill="none" />
      <polygon points="26,11 20,8 24,4" fill="${color}" />

      <!-- Panah 3: Lengkung Bawah ke Sudut Hati -->
      <path d="M 34 29 C 30 35 25 39 24 40 C 23 39 17 35 15 31" 
            stroke="${color}" stroke-width="4.5" stroke-linecap="round" fill="none" />
      <polygon points="36,28 36,36 30,32" fill="${color}" />
    </svg>
  `;
}

/**
 * Mengembalikan Full Wordmark PRELOVEDU
 * @param {Object} options - { textColor, heartColor, height }
 */
export function getWordmarkLogo({ textColor = '#2A2A2A', heartColor = '#E5322D', height = 32 } = {}) {
  const iconSize = Math.round(height * 0.95);
  return `
    <span class="prelovedu-wordmark" style="display:inline-flex; align-items:center; font-family:var(--font-serif); font-weight:800; font-size:${height * 0.85}px; letter-spacing:-0.03em; color:${textColor}; line-height:1; user-select:none;">
      <span>PREL</span>
      <span style="display:inline-flex; align-items:center; margin:0 -1px;">${getRecycledHeartSvg(heartColor, iconSize)}</span>
      <span>VEDU</span>
    </span>
  `;
}

/**
 * Mengembalikan Favicon / App Icon bulat
 */
export function renderFavicon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="20" fill="#2A2A2A"/><g transform="translate(8,8)">${getRecycledHeartSvg('#E5322D', 48)}</g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
