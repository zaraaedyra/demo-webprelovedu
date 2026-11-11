# Design System - Web Preloved Unsil

Sistem desain ini dirancang dengan prinsip **bersih, ramah mahasiswa, mobile-first, serta dominan warna biru dan putih** untuk memberikan kesan tepercaya, segar, dan mudah digunakan di perangkat seluler.

---

## 1. Skema Warna (Color Palette)

| Elemen | Kode Warna | Keterangan |
| :--- | :--- | :--- |
| **Primary Blue** | `#0D6EFD` / `#0A58CA` | Warna utama (header, tombol utama, harga, aksen fokus) |
| **Light Blue Background**| `#F4F8FA` / `#E7F1FF` | Latar belakang halaman & badge aktif |
| **White (Surface)** | `#FFFFFF` | Latar belakang kartu, modal, & form input |
| **Text Dark** | `#1E293B` | Warna teks utama agar kontras & mudah dibaca |
| **Text Muted** | `#64748B` | Warna teks sekunder (kategori, waktu, info penjual) |
| **Accent Green (KTM)** | `#198754` / `#059669` | Badge "KTM Terverifikasi" untuk rasa aman |

---

## 2. Tipografi (Typography)

- **Font Family**: System UI / Inter (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
- **Ukuran Teks Mobile-First**:
  - Judul Halaman / Brand: `1.25rem` - `1.5rem` (Semi-bold)
  - Judul Barang: `0.95rem` - `1rem` (Medium / Semi-bold)
  - Harga Barang: `1.1rem` (Bold, Warna Primary Blue)
  - Label / Badge / Info Penjual: `0.75rem` - `0.85rem` (Regular)

---

## 3. Gaya Tombol (Button Style)

- **Tombol Utama (Primary)**:
  - Background: Primary Blue (`#0D6EFD`)
  - Warna Teks: Putih (`#FFFFFF`)
  - Border Radius: `8px` (`rounded-3`)
  - Padding: Interaktif dan cukup luas untuk jari di layar sentuh (min-height `42px`)
- **Tombol Kategori (Pill Buttons)**:
  - Radius membulat penuh (`rounded-pill`)
  - State Aktif: Background Biru + Teks Putih
  - State Non-Aktif: Outline Biru / Background Light Gray + Teks Muted

---

## 4. Gaya Kartu Barang (Item Card Style)

- **Latar Belakang**: Putih (`#FFFFFF`) dengan border halus (`#E2E8F0`) dan bayangan lembut (`box-shadow: 0 2px 8px rgba(0,0,0,0.06)`).
- **Gambar Barang**: Aspect ratio 4:3 / 1:1, `object-fit: cover`, membulat di sudut atas (`border-top-left-radius`, `border-top-right-radius`).
- **Badge Kategori**: Melayang di pojok atas gambar atau di atas judul barang.
- **Badge Verifikasi KTM**: Ikon centang hijau dengan teks "KTM Terverifikasi" untuk memberi kepercayaan antar mahasiswa.
- **Efek Hover/Sentuh**: Elevasi sedikit naik (`transform: translateY(-3px)`) saat di-hover/ditekan.

---

## 5. Tata Letak (Layout & Responsivitas)

- **Mobile First**: Grid 2 kolom di layar ponsel (`col-6`), 3 kolom di tablet (`col-md-4`), dan 4 kolom di desktop (`col-lg-3`).
- **Pencarian & Filter**: Selalu mudah dijangkau di bagian atas halaman.
