// PRELOVEDU — Interaksi Halaman Utama (main.js)
import { renderHeader, renderBottomNav, showToast } from './components/navbar.js';
import { renderProductCard } from './components/product-card.js';
import { renderFavicon } from './components/logo.js';
import { getProducts, toggleFavorite, isFavorited } from './services/storage.js';
import { categoriesList, facultiesList } from './data/dummy-products.js';
import { icons } from './components/icons.js';

// State Filter Halaman Beranda
const state = {
  searchQuery: '',
  selectedCategory: 'all',
  selectedFaculty: 'Semua Fakultas',
  selectedCondition: 'all',
  sortBy: 'terbaru'
};

// Data Slide Hero Carousel
const heroSlides = [
  {
    tag: '🔥 Hot Deals Minggu Ini',
    title: 'Hemat Uang Kuliah! Buku & Outfit Kating Siap Pakai',
    subtitle: 'Dapatkan perlengkapan kuliah semester ini langsung dari kakak tingkat satu kampus dengan harga bersahabat.',
    img: 'assets/img/products/prd-001-1.jpg',
    link: 'pages/detail.html?id=prd-001'
  },
  {
    tag: '⚡ Siap Praktikum Kampus',
    title: 'Jas Lab Kimia FMIPA & Stetoskop Standar Kampus',
    subtitle: 'Jas lab katun tebal, kalkulator saintifik, dan peralatan praktikum semester 1 tanpa keluar biaya mahal.',
    img: 'assets/img/products/prd-002-1.jpg',
    link: 'pages/detail.html?id=prd-002'
  },
  {
    tag: '🧥 Outfit Kuliah Kece',
    title: 'Hoodie Vintage Sage & Jaket Parka Tahan Angin',
    subtitle: 'Outerwear nyaman kelas ber-AC dan motoran kampus. Preloved pilihan kualitas prima siap pakai.',
    img: 'assets/img/products/prd-003-1.jpg',
    link: 'pages/detail.html?id=prd-003'
  }
];

let currentSlideIdx = 0;
let carouselTimer = null;

function init() {
  // 1. Pasang Favicon SVG Otomatis
  const linkFavicon = document.createElement('link');
  linkFavicon.rel = 'icon';
  linkFavicon.type = 'image/svg+xml';
  linkFavicon.href = renderFavicon();
  document.head.appendChild(linkFavicon);

  // 2. Render Navigasi
  const headerMount = document.getElementById('header-mount');
  if (headerMount) headerMount.innerHTML = renderHeader('home', '');

  const bottomNavMount = document.getElementById('bottom-nav-mount');
  if (bottomNavMount) bottomNavMount.innerHTML = renderBottomNav('home', '');

  // 3. Render Kategori Chips
  renderCategories();

  // 4. Render Dropdown Fakultas
  renderFacultyDropdown();

  // 5. Render Banner Hero Hot Deals & Carousel Slider
  setupHeroInteractions();

  // 6. Render Grid Produk Pertama Kali
  applyFiltersAndRender();

  // 7. Pasang Event Listeners
  setupEventListeners();
}

// Jalankan init baik jika DOM sudah siap maupun saat masih loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/**
 * Smooth scroll ke bagian katalog produk dengan menghormati prefers-reduced-motion
 */
function scrollToKatalog() {
  const katalogSection = document.getElementById('katalog-section');
  if (!katalogSection) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  katalogSection.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start'
  });
}

/**
 * Render Chip Kategori Bulat
 */
function renderCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  container.innerHTML = categoriesList.map(cat => {
    const iconSvg = icons[cat.icon] ? icons[cat.icon](24, 2.5) : icons.tag(24, 2.5);
    const isActive = state.selectedCategory === cat.id ? 'active' : '';

    return `
      <button type="button" class="category-item ${isActive}" data-category-id="${cat.id}">
        <div class="category-circle">
          ${iconSvg}
        </div>
        <span class="category-label">${cat.label}</span>
      </button>
    `;
  }).join('');

  // Event click kategori: filter instan tanpa reload + smooth scroll ke katalog
  container.querySelectorAll('.category-item').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.category-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedCategory = btn.getAttribute('data-category-id');
      applyFiltersAndRender();
      scrollToKatalog();
    });
  });
}

/**
 * Render Dropdown Fakultas/Jurusan
 */
function renderFacultyDropdown() {
  const select = document.getElementById('faculty-select');
  if (!select) return;

  select.innerHTML = facultiesList.map(fac => `
    <option value="${fac}">${fac}</option>
  `).join('');

  select.addEventListener('change', (e) => {
    state.selectedFaculty = e.target.value;
    applyFiltersAndRender();
  });
}

/**
 * Filter & Render Produk ke Grid
 */
function applyFiltersAndRender() {
  const grid = document.getElementById('products-grid');
  const resultCount = document.getElementById('products-count');
  if (!grid) return;

  const allProducts = getProducts();

  let filtered = allProducts.filter(item => {
    // 1. Search Query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      const matchSeller = (item.seller?.name || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSeller) return false;
    }

    // 2. Kategori
    if (state.selectedCategory !== 'all' && item.category !== state.selectedCategory) {
      return false;
    }

    // 3. Fakultas
    if (state.selectedFaculty !== 'Semua Fakultas' && item.faculty !== state.selectedFaculty) {
      return false;
    }

    // 4. Kondisi
    if (state.selectedCondition !== 'all') {
      if (state.selectedCondition === 'seperti_baru' && item.condition !== 'Seperti baru') return false;
      if (state.selectedCondition === 'baik' && item.condition !== 'Baik') return false;
      if (state.selectedCondition === 'layak_pakai' && item.condition !== 'Layak pakai') return false;
    }

    return true;
  });

  // Urutan (Sort)
  if (state.sortBy === 'termurah') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'termahal') {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    // Terbaru
    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  // Tampilkan Jumlah
  if (resultCount) {
    resultCount.textContent = `Menampilkan ${filtered.length} barang pilihan`;
  }

  // Render Grid atau Empty State
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1;">
        <div class="empty-state-card">
          <div class="empty-state-icon">
            ${icons.search(34, 2.5)}
          </div>
          <h4 style="font-family:var(--font-serif); font-size:1.35rem; margin-bottom:0.5rem;">Tidak Ada Barang Ditemukan</h4>
          <p style="color:var(--ink-muted); font-size:0.9rem; margin-bottom:1.25rem;">
            Belum ada barang di kategori ini. Coba lihat kategori lain atau tampilkan semua barang.
          </p>
          <button type="button" id="btn-reset-filter" class="btn-pill btn-pill-lime">
            Lihat Semua
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-reset-filter')?.addEventListener('click', () => {
      state.searchQuery = '';
      state.selectedCategory = 'all';
      state.selectedFaculty = 'Semua Fakultas';
      state.selectedCondition = 'all';
      const searchInput = document.getElementById('search-input');
      const facultySelect = document.getElementById('faculty-select');
      if (searchInput) searchInput.value = '';
      if (facultySelect) facultySelect.value = 'Semua Fakultas';
      document.querySelectorAll('.chip-filter[data-condition]').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-condition') === 'all');
      });
      renderCategories();
      applyFiltersAndRender();
      scrollToKatalog();
    });
    return;
  }

  grid.innerHTML = filtered.map(item => renderProductCard(item, { basePath: '' })).join('');

  // Pasang Listener Klik & Favorit di tiap kartu
  attachFavoriteListeners(grid);
  attachCardClickListeners(grid);

  // Pasang Listener Favorit di seluruh halaman (termasuk featured card)
  attachFavoriteListeners(document.body);
  syncFavoriteButtons();
}

/**
 * Sinkronisasi visual semua tombol hati favorit di halaman
 */
function syncFavoriteButtons() {
  document.querySelectorAll('.btn-favorite').forEach(btn => {
    const id = btn.getAttribute('data-fav-id');
    if (!id) return;
    const fav = isFavorited(id);
    btn.classList.toggle('favorited', fav);
    btn.innerHTML = icons.heart(19, 2.5, fav);
  });
}

/**
 * Listener Navigasi Seluruh Area Kartu Produk
 */
function attachCardClickListeners(container) {
  container.querySelectorAll('.product-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-favorite') || e.target.closest('a')) return;
      const productId = card.getAttribute('data-product-id');
      if (productId) {
        window.location.href = `pages/detail.html?id=${productId}`;
      }
    });
  });
}

/**
 * Listener Tombol Favorit
 */
function attachFavoriteListeners(container) {
  container.querySelectorAll('.btn-favorite').forEach(btn => {
    if (btn.hasAttribute('data-fav-bound')) return;
    btn.setAttribute('data-fav-bound', 'true');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = btn.getAttribute('data-fav-id');
      const nowFavorited = toggleFavorite(productId);

      syncFavoriteButtons();

      if (nowFavorited) {
        showToast('❤️ Disimpan ke Favorit Anda');
      } else {
        showToast('Barang dihapus dari Favorit');
      }
    });
  });
}

/**
 * Event Listeners Input Pencarian & Filter
 */
function setupEventListeners() {
  // Listener sinkronisasi antar-tab & event lokal
  window.addEventListener('favoritesUpdated', () => {
    syncFavoriteButtons();
  });
  window.addEventListener('storage', (e) => {
    if (e.key === 'prelovedu_favorites') {
      syncFavoriteButtons();
    } else if (e.key === 'prelovedu_products') {
      applyFiltersAndRender();
    }
  });
  window.addEventListener('productsUpdated', () => {
    applyFiltersAndRender();
  });
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.searchQuery = e.target.value;
        applyFiltersAndRender();
      }, 150);
    });
  }

  // Filter Chips Kondisi
  document.querySelectorAll('.chip-filter[data-condition]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip-filter[data-condition]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.selectedCondition = chip.getAttribute('data-condition');
      applyFiltersAndRender();
    });
  });

  // Sort Dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Link "Lihat semua" di kategori & anchor ke katalog
  document.querySelectorAll('a[href="#katalog-section"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (link.classList.contains('section-link')) {
        state.selectedCategory = 'all';
        document.querySelectorAll('.category-item').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-category-id') === 'all');
        });
        applyFiltersAndRender();
      }
      scrollToKatalog();
    });
  });
}

/**
 * Interaksi Carousel Hero Banner yang Berfungsi Nyata (Slide & Dots)
 */
function setupHeroInteractions() {
  const dots = document.querySelectorAll('.carousel-dot');
  if (!dots.length) return;

  function switchSlide(idx) {
    currentSlideIdx = (idx + heroSlides.length) % heroSlides.length;
    const slide = heroSlides[currentSlideIdx];

    // Update dots
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlideIdx));

    // Update banner content
    const tagEl = document.querySelector('.hero-pill-tag');
    const titleEl = document.querySelector('.hero-title');
    const subEl = document.querySelector('.hero-subtitle');
    const imgEl = document.getElementById('hero-img');
    const ctaEl = document.querySelector('.hero-text-col .btn-pill');

    if (tagEl) tagEl.innerHTML = slide.tag;
    if (titleEl) titleEl.textContent = slide.title;
    if (subEl) subEl.textContent = slide.subtitle;
    if (imgEl) {
      imgEl.style.opacity = '0.3';
      imgEl.src = slide.img;
      setTimeout(() => { imgEl.style.opacity = '1'; }, 100);
    }
    if (ctaEl && slide.link) {
      ctaEl.setAttribute('href', slide.link);
    }
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(carouselTimer);
      switchSlide(index);
      startAutoCarousel();
    });
  });

  function startAutoCarousel() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(() => {
      switchSlide(currentSlideIdx + 1);
    }, 6000);
  }

  startAutoCarousel();
}
