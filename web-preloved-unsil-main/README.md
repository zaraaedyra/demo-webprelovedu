# PRELOVEDU ♻️
> **Platform Marketplace & Katalog Preloved Khusus Mahasiswa Intra-Kampus**

PRELOVEDU menghubungkan mahasiswa baru (maba) dengan kakak tingkat (kating) yang ingin menjual buku kuliah bekas, jas lab, jaket himpunan, kalkulator, dan perlengkapan kuliah dengan harga ramah kantong. Cakupan awal: **Universitas Siliwangi (Unsil) Tasikmalaya**, Kampus 1 dan Kampus 2.

Visual: **Playful-Editorial** (lime segar, lilac pastel, charcoal pekat bergaris tebal), mobile-first dan responsif di desktop.

---

## 📌 Batasan Lingkup Proyek (PENTING)
1. **Bukan toko online biasa:** tanpa payment gateway, rekening bersama, keranjang, saldo/dompet digital, atau ongkos kirim.
2. **Tawar sebagai gerbang kontak:** transaksi disepakati mandiri lewat WhatsApp dan COD di kampus, setelah pembeli mengajukan tawaran dan disetujui penjual.
3. **Privasi kontak:** nomor WhatsApp tidak tampil di halaman publik; hanya terbuka untuk pembeli setelah tawarannya diterima.

---

## 👥 Peran Pengguna & Hak Akses

Satu akun mahasiswa bisa menjadi pembeli sekaligus penjual. **Admin Kampus** adalah peran terpisah.

| Kemampuan | Pembeli | Penjual | Admin Kampus |
|---|:---:|:---:|:---:|
| Menjelajah katalog, filter kategori/kampus | ✅ | ✅ | ✅ |
| Menyimpan favorit (`favorit.html`) | ✅ | ✅ | – |
| Mengajukan tawaran harga (`detail.html`, `tawaran.html`) | ✅ | – | – |
| Memilih titik COD di peta | ✅ (menyepakati) | ✅ (menetapkan) | – |
| Melihat WhatsApp penjual | ✅ setelah tawaran diterima | – | – |
| Pasang iklan via stepper (`jual.html`) | – | ✅ | – |
| Menerima/menolak tawaran masuk | – | ✅ | – |
| Ubah status barang | – | ✅ | – |
| Verifikasi KTM → status *Verified Student* | – | – | ✅ |
| Moderasi katalog (edit kategori, hapus postingan) | – | – | ✅ |
| Kelola laporan (suspend/ban akun) | – | – | ✅ |
| Lihat ringkasan & analitik platform | – | – | ✅ |

### Pembeli (Mahasiswa)
- Menjelajah katalog dan memfilter berdasarkan kategori/kampus.
- Menyimpan produk ke favorit.
- Mengajukan tawaran harga pada produk.
- Menyepakati titik janjian COD di peta kampus.
- Membuka akses WhatsApp penjual setelah tawaran disetujui.

### Penjual (Mahasiswa)
- Memasang iklan lewat form bertahap (stepper) di `jual.html`.
- Memilih Kampus 1 / Kampus 2 dan menandai titik COD di peta.
- Menerima atau menolak tawaran masuk (`tawaran.html`).
- Memperbarui status barang: **Tersedia → Dalam Proses COD → Terjual**.

### Admin Kampus (`admin.html`)
- **Verifikasi KTM:** memeriksa foto KTM maba/kating lalu memberi status *Verified Student*.
- **Moderasi katalog:** meninjau, mengedit kategori, atau menghapus postingan terlarang, spam, atau tidak sesuai standar.
- **Manajemen laporan:** menindaklanjuti dugaan penipuan, akun palsu, atau nomor WhatsApp tidak aktif (sanksi suspend/ban).
- **Ringkasan & analitik:** total iklan aktif, tawaran yang berhasil, dan titik COD terfavorit.

### Alur Status
- **Barang:** `tersedia` → `dalam_proses_cod` → `terjual`
- **Tawaran:** `menunggu` → `diterima` | `ditolak` | `tawar_balik` (satu kali) → `diterima` | `ditolak`

---

## 🗺️ Peta COD Interaktif Kampus

Peta memakai **Leaflet.js + OpenStreetMap**, dikustomisasi untuk Unsil Tasikmalaya.

> ⚠️ Koordinat di bawah adalah preset awal. **Verifikasi tiap titik di OpenStreetMap** (klik kanan pada peta → *Show address*/salin koordinat) sebelum dipakai di versi final.

### Kampus 1 Unsil — Jl. Siliwangi No.24, Kahuripan, Tawang, Tasikmalaya
Pusat peta: `-7.3439, 108.2238`

| # | Spot Aman | Koordinat |
|---|---|---|
| 1 | Rektorat & Plaza Utama Unsil | `-7.3438, 108.2236` |
| 2 | Perpustakaan Pusat Unsil | `-7.3442, 108.2241` |
| 3 | Gedung Kuliah Bersama / Dekanat | `-7.3435, 108.2245` |
| 4 | Masjid Al-Muhajirin Unsil | `-7.3445, 108.2230` |
| 5 | Gerbang Utama Jl. Siliwangi | `-7.3430, 108.2233` |

### Kampus 2 Unsil — Mugarsari, Tamansari, Tasikmalaya
Pusat peta: `-7.3756, 108.2285`

| # | Spot Aman | Koordinat |
|---|---|---|
| 1 | Halaman Utama Kampus 2 Mugarsari | `-7.3755, 108.2283` |
| 2 | Area Kantin & Gazebo Mahasiswa Kampus 2 | `-7.3759, 108.2288` |
| 3 | Pos Keamanan & Gerbang Masuk Mugarsari | `-7.3750, 108.2280` |

### Alur Interaksi
- **Pasang iklan (`jual.html`):** penjual memilih Kampus 1 atau 2, lalu memilih preset spot aman atau mengeklik peta untuk koordinat pasti. Klik di luar batas kampus ditolak.
- **Detail produk (`detail.html`):** pembeli melihat peta dengan pin titik COD yang ditetapkan penjual sebelum mengajukan tawaran.
- Data lokasi disimpan sebagai `{ campus, spotId | null, lat, lng }`.

---

## 🧭 UI/UX Kategori Populer & Auto-Scroll (`index.html`)

**5 kategori utama:** Semua · Buku · Perabot Kost · Pakaian · Perangkat Elektronik

- Klik ikon kategori → halaman **smooth scroll** ke bagian "Katalog Produk / Rekomendasi Terbaik".
- Filter aktif **seketika** tanpa reload halaman; "Semua" menghapus filter.
- Kategori aktif diberi penanda visual (pill lilac). Hormati `prefers-reduced-motion` (scroll tanpa animasi bila diminta pengguna).
- Jika hasil kosong, tampilkan empty state ramah beserta tombol "Lihat Semua".

---

## 🗂️ Struktur Direktori

```text
prelovedu/
├── index.html                  # Halaman Utama (Beranda, Kategori Populer, & Landing Page)
├── pages/                      # Halaman-halaman pendukung
│   ├── detail.html             # Detail Produk, Visual Peta COD & Form Tawar
│   ├── favorit.html            # Daftar Produk Tersimpan
│   ├── jual.html               # Stepper Pasang Iklan Barang & Pemilih Spot Peta Kampus
│   ├── tawaran.html            # Manajemen Tawaran Masuk & Terkirim
│   ├── profil.html             # Profil Pengguna & Status Verifikasi KTM
│   ├── login.html              # Masuk / Daftar Akun Mahasiswa
│   └── admin.html              # Dashboard Moderasi Admin (Verifikasi KTM & Katalog)
├── assets/
│   ├── css/
│   │   ├── tokens.css          # Variabel warna, tipografi, radius & shadow
│   │   ├── base.css            # Reset CSS, utilitas dasar, font loading
│   │   ├── components.css      # Komponen UI (navbar, kartu, tombol, badge, modal, peta)
│   │   └── pages.css           # Gaya khusus halaman & layout responsif
│   ├── js/
│   │   ├── data/
│   │   │   ├── dummy-products.js # Data produk contoh realistis mahasiswa
│   │   │   └── campus-spots.js   # Preset koordinat titik COD Kampus 1 & Kampus 2 Unsil
│   │   ├── services/
│   │   │   └── storage.js      # Manajemen state lokal (localStorage)
│   │   ├── components/
│   │   │   ├── logo.js         # Wordmark PRELOVEDU + SVG Heart Daur Ulang
│   │   │   ├── icons.js        # Koleksi ikon SVG Lucide
│   │   │   ├── product-card.js # Generator kartu produk seragam
│   │   │   └── map.js          # Modul peta interaktif Leaflet.js (Unsil Kampus 1 & 2)
│   │   └── main.js             # Interaksi halaman utama, filter kategori & smooth scroll
│   └── img/                    # Aset gambar & ilustrasi
├── firebase.json               # Konfigurasi hosting Firebase
├── firestore.rules             # Aturan keamanan database Firestore
├── config.example.js           # Contoh konfigurasi Firebase & Cloudinary
├── .gitignore                  # Berkas yang diabaikan Git
└── README.md                   # Dokumentasi lengkap proyek PRELOVEDU
```

---

## 🚀 Cara Menjalankan di Komputer Lokal

Proyek memakai **ES Modules** tanpa bundler (tanpa Webpack/Vite); cukup web server statis.

### Opsi A — VS Code Live Server (termudah)
1. Buka folder proyek di **VS Code** (jika memakai WSL, buka lewat *Connect to WSL*).
2. Klik kanan `index.html` → **Open with Live Server**.
3. Situs terbuka di `http://127.0.0.1:5500`.

### Opsi B — Terminal / Python
```bash
python3 -m http.server 8000
```
Lalu buka `http://localhost:8000`.

---

## 🎨 Identitas Visual & Desain
- **Palet warna:**
  - `--lime` (`#C9F26B`): aksen berani, tombol aksi utama, banner hero.
  - `--lilac` (`#E9C6EA`): latar kartu unggulan, pill aktif, aksen navigasi.
  - `--ink` (`#2A2A2A`): garis outline tebal 2.5px, teks utama, bottom nav bar.
  - `--paper` (`#F1F1EF`): latar halaman yang ramah di mata.
  - `--heart-red` (`#E5322D`): hati daur ulang pada logo dan tombol favorit.
- **Tipografi:** serif *Fraunces* untuk judul/harga, sans-serif *Plus Jakarta Sans* untuk teks bacaan.
- **Peta:** pin memakai warna `--heart-red`, kontrol dan popup mengikuti gaya outline `--ink`.

---

## 🔐 Keamanan & Privasi (Wajib untuk Fase Firebase)
- Peran **admin** ditentukan di sisi server (custom claim / aturan Firestore), **bukan** flag yang bisa diubah dari browser.
- Nomor WhatsApp disimpan terpisah dari data publik dan hanya dapat dibaca pembeli yang tawarannya berstatus `diterima`. Menyembunyikan lewat UI saja **tidak cukup**.
- Foto KTM adalah data pribadi: akses hanya admin, dan dihapus/dikaburkan setelah verifikasi selesai. Alternatif lebih ringan: verifikasi lewat email `.ac.id`.
- Jangan commit `config.js` berisi kredensial; hanya `config.example.js` yang masuk repo.

---

## ⚙️ Persiapan Integrasi Firebase (Fase Selanjutnya)
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Buat proyek baru gratis (paket Spark).
3. Aktifkan **Authentication** (Email/Password).
4. Aktifkan **Cloud Firestore** dan terapkan aturan `firestore.rules`.
5. Salin `config.example.js` menjadi `config.js` dan isi kredensial proyek.

Koleksi yang direncanakan: `users`, `products`, `offers`, `favorites`, `reports`. Akses data lewat `services/storage.js` agar peralihan dari localStorage ke Firestore tidak mengubah halaman.

---

## 🛣️ Peta Jalan Pengembangan
| Fase | Isi | Prioritas |
|---|---|---|
| 1 | Beranda, katalog, kategori 5 + auto-scroll, detail produk (data dummy) | Wajib |
| 2 | Peta COD (`map.js`, `campus-spots.js`) di `jual.html` dan `detail.html` | Wajib |
| 3 | Alur tawar-menawar (`tawaran.html`), favorit, status barang | Wajib |
| 4 | Login, profil, integrasi Firebase Auth + Firestore | Wajib |
| 5 | `admin.html`: verifikasi KTM, moderasi, laporan | Bila waktu cukup |
| 6 | Analitik admin, deploy Firebase Hosting | Bila waktu cukup |

---

## 🤖 Aturan Git untuk Agent AI (WAJIB DIIKUTI)

Setup awal (sekali saja, di folder proyek):
```bash
git init && git branch -M main
git add . && git commit -m "chore: initial commit"
git remote add origin https://github.com/USERNAME/prelovedu.git   # repo private
git push -u origin main
```

Aturan kerja:
1. Sebelum tiap tugas: jalankan `git status`. Jika ada perubahan belum di-commit, commit dulu: `chore: checkpoint sebelum <tugas>`.
2. Kerjakan di branch baru: `git checkout -b fase-N-nama-singkat`.
3. Commit kecil dan sering, format `feat|fix|style: deskripsi singkat`. Satu commit = satu perubahan logis.
4. Setelah pengguna bilang OK: merge ke `main`, lalu `git push`. Beri tag di akhir fase: `git tag fase-N-selesai`.
5. **Undo** (pilih yang paling aman):
   - Belum di-commit → `git restore <file>` atau `git restore .`
   - Sudah di-commit → `git revert <hash>` (jangan hapus riwayat)
   - Lihat riwayat → `git log --oneline -10`
6. Jika pengguna menulis "undo": batalkan **hanya** perubahan terakhir, lalu tampilkan `git status`.
7. **DILARANG tanpa izin eksplisit pengguna:** `git reset --hard`, `git push --force`, `git clean -fd`, `rm -rf`, menghapus branch. Jika perlu, jelaskan risikonya dan tunggu jawaban.
8. Jangan pernah commit `config.js`, kunci API, atau file `.env` (pastikan ada di `.gitignore`).
