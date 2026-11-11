// PRELOVEDU — Reusable Navbar & Bottom Navigation (navbar.js)
// Sesuai Bagian 5.4, 5.5, 6: Desktop sticky header, mobile bottom nav 4 tab
// dengan tombol tengah Jual (+) menonjol dan lingkaran lilac pada tab aktif.

import { getWordmarkLogo } from './logo.js';
import { icons } from './icons.js';
import { getCurrentUser, getUnreadOffersCount } from '../services/storage.js';
import { logout } from '../services/auth.js';

document.addEventListener('click', (e) => { if (e.target.closest('[data-logout]')) { e.preventDefault(); logout(); } });

/**
 * Render Header Atas (Top Nav Bar)
 * @param {string} activePage - 'home' | 'favorit' | 'jual' | 'profil' | 'tawaran' | 'detail'
 * @param {string} basePath - prefix path (misal: '' untuk root, '../' untuk subfolder pages/)
 */
export function renderHeader(activePage = 'home', basePath = '') {
  const user = getCurrentUser();
  const unreadCount = getUnreadOffersCount();
  const needLogin = ['favorit', 'jual', 'tawaran', 'profil', 'admin'].includes(activePage);
  if (!user.id && needLogin) { location.replace(basePath + 'pages/login.html'); return ''; }
  if (activePage === 'admin' && user.role !== 'admin') { location.replace(basePath + 'index.html'); return ''; }
  const isAdmin = user.role === 'admin';
  const authBtn = user.id
    ? `<a href="#" data-logout class="nav-link-desktop d-none d-lg-inline" style="font-size:0.9rem;">Keluar</a>`
    : `<a href="${basePath}pages/login.html" class="btn-pill btn-pill-outline" style="min-height:42px;padding:0.5rem 1.1rem;">Masuk</a>`;

  return `
    <header class="top-nav-bar">
      <div class="app-container">
        <div class="top-nav-content">
          <!-- Logo Brand -->
          <a href="${basePath}index.html" class="d-inline-flex align-items-center" aria-label="Halaman Utama PRELOVEDU">
            ${getWordmarkLogo({ height: 28 })}
          </a>

          <!-- Menu Desktop -->
          <div class="d-none d-lg-flex align-items-center gap-4">
            <a href="${basePath}index.html" class="nav-link-desktop ${activePage === 'home' ? 'fw-bold' : ''}" style="font-size:0.95rem; font-weight:700;">Beranda</a>
            <a href="${basePath}pages/favorit.html" class="nav-link-desktop ${activePage === 'favorit' ? 'fw-bold' : ''}" style="font-size:0.95rem; font-weight:700;">Favorit</a>
            <a href="${basePath}pages/tawaran.html" class="nav-link-desktop ${activePage === 'tawaran' ? 'fw-bold' : ''}" style="font-size:0.95rem; font-weight:700;">Tawaran</a>
            <a href="${basePath}pages/profil.html" class="nav-link-desktop ${activePage === 'profil' ? 'fw-bold' : ''}" style="font-size:0.95rem; font-weight:700;">Profil Saya</a>
            ${isAdmin ? `<a href="${basePath}pages/admin.html" class="nav-link-desktop ${activePage === 'admin' ? 'fw-bold' : ''}" style="font-size:0.95rem; font-weight:700;">Admin</a>` : ''}
          </div>

          <!-- Tombol Aksi Kanan (Lonceng Notifikasi & Profil) -->
          <div class="d-flex align-items-center gap-3">
            <!-- Tombol Jual CTA di Desktop -->
            <a href="${basePath}pages/jual.html" class="btn-pill btn-pill-lime d-none d-md-inline-flex" style="min-height:42px; padding:0.5rem 1.25rem;">
              ${icons.plus(18, 3)}
              <span>Pasang Iklan</span>
            </a>

            <!-- Tombol Notifikasi Tawaran (Lonceng) -->
            <a href="${basePath}pages/tawaran.html" class="btn-circle btn-circle-white" aria-label="Notifikasi Tawaran" title="Daftar Tawaran">
              ${icons.bell(20, 2.5)}
              ${unreadCount > 0 ? '<span class="badge-dot"></span>' : ''}
            </a>

            ${authBtn}
            <!-- Avatar Pengguna -->
            ${user.id ? `<a href="${basePath}pages/profil.html" class="avatar-circle" title="Profil ${user.name}" aria-label="Profil ${user.name}">
              ${user.avatar || 'M'}
            </a>` : ''}
          </div>
        </div>
      </div>
    </header>
  `;
}

/**
 * Render Bottom Navigation (Mobile)
 * @param {string} activePage - 'home' | 'favorit' | 'jual' | 'profil'
 * @param {string} basePath - prefix path
 */
export function renderBottomNav(activePage = 'home', basePath = '') {
  return `
    <div class="bottom-nav-wrap">
      <nav class="bottom-nav-bar" aria-label="Navigasi Utama Mobile">
        <!-- 1. Beranda -->
        <a href="${basePath}index.html" class="nav-tab-item ${activePage === 'home' ? 'active' : ''}" aria-label="Beranda">
          ${icons.home(22, 2.5)}
          <span class="nav-tab-label">Beranda</span>
        </a>

        <!-- 2. Favorit -->
        <a href="${basePath}pages/favorit.html" class="nav-tab-item ${activePage === 'favorit' ? 'active' : ''}" aria-label="Favorit">
          ${icons.heart(22, 2.5)}
          <span class="nav-tab-label">Favorit</span>
        </a>

        <!-- 3. Jual (Tombol Tengah Menonjol) -->
        <a href="${basePath}pages/jual.html" class="nav-tab-sell" aria-label="Pasang Iklan Barang" title="Jual Barang">
          ${icons.plus(24, 3)}
        </a>

        <!-- 4. Profil -->
        <a href="${basePath}pages/profil.html" class="nav-tab-item ${activePage === 'profil' ? 'active' : ''}" aria-label="Profil Saya">
          ${icons.user(22, 2.5)}
          <span class="nav-tab-label">Profil</span>
        </a>
      </nav>
    </div>
  `;
}

/**
 * Helper Floating Toast Notification
 */
export function showToast(message, duration = 3000) {
  let container = document.getElementById('toast-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-root';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `
    <span>${message}</span>
    <button type="button" style="background:none; border:none; color:inherit; cursor:pointer;" aria-label="Tutup">
      ${icons.x(16, 2.5)}
    </button>
  `;

  toast.querySelector('button').addEventListener('click', () => toast.remove());
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}
