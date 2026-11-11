# RENCANA MVP - Web Preloved Mahasiswa

## 1. Ide Singkat
Web marketplace barang preloved khusus mahasiswa. Fokus awal: barang kebutuhan kuliah (buku, laptop, perlengkapan matkul) dan kebutuhan kost (peralatan masak, lemari, dll). Penjual dan pembeli HARUS diverifikasi KTM (Kartu Tanda Mahasiswa) agar aman dan terpercaya.

## 2. Fitur Yang Harus Ada (MVP)
- Login / daftar pakai email kampus
- Verifikasi KTM: upload foto KTM + nomor NIM, admin approve
- Katalog barang dengan foto, deskripsi, harga, dan penjual
- Detail barang: lihat foto, harga, penjual (sudah terverifikasi)
- Tombol chat penjual lewat WhatsApp (link wa.me)
- Posting barang baru (form lengkap dengan upload foto)
- Profil user + status verifikasi KTM

## 3. Yang TIDAK Masuk di MVP
- Payment gateway (awalnya COD / transfer manual)
- Rating / review (bisa ditambah nanti)
- Rekomendasi barang
- Admin dashboard fancy (cukup list verifikasi KTM)
- Mobile app (cukup website)

## 4. Teknologi Yang Digunakan (Satu Stack Saja)
Semua pakai HTML, CSS, dan JavaScript murni — tidak perlu Node.js/Express.

- Frontend: HTML + CSS + JavaScript (pakai Bootstrap agar tampilannya rapi tanpa ribet)
- Backend & Database: Firebase (Google)
  - Firebase Authentication: login/register email
  - Cloud Firestore: simpan data barang, profil, verifikasi KTM
  - Cloud Storage for Firebase / Penyimpan Media Alternatif: simpan foto KTM dan foto barang (butuh Blaze atau layanan lain)
- Hosting: Firebase Hosting (gratis)

Keunggulan: cukup satu bahasa pemrograman (JavaScript), hosting & database sudah jadi, tidak perlu setup server.

## 5. Langkah Kerja Bertahap
1. Setup proyek & Firebase (buat project, enable Auth + Firestore)
2. Buat halaman login + register
3. Buat halaman katalog barang (memakai data contoh yang diisi manual di Firestore karena fitur posting barang baru dibuat di langkah 7)
4. Buat halaman detail barang
5. Buat halaman profil user
6. Tambahkan tombol WhatsApp (wa.me) di detail barang untuk chat penjual
7. Buat halaman posting barang (membutuhkan upload foto)
8. Buat halaman verifikasi KTM (membutuhkan upload foto KTM, admin approve)
9. Deploy ke Firebase Hosting

## 6. Target Waktu (Relaks, sesuai pace kamu)
- Minggu 1-2: Setup + login/register
- Minggu 3-4: Katalog + detail barang + profil + tombol WhatsApp
- Minggu 5-6: Fitur yang butuh upload foto (posting barang & verifikasi KTM)
- Minggu 7: Polish & testing & deploy

Total: 1.5-2 bulan. Tidak usah terburu-buru.

## 7. Catatan Keamanan
- Foto KTM disimpan sementara dengan akses khusus admin dan DIHAPUS setelah diverifikasi; yang disimpan permanen hanya status terverifikasi.
- API key Firebase boleh ada di kode frontend, tapi JANGAN pernah upload file .env atau konfigurasi rahasia yang ada di lokal ke GitHub.
- Atur Firestore Security Rules supaya user hanya bisa membaca/menulis data miliknya sendiri kecuali data barang publik.
- NIM dan data KTM hanya boleh diproses untuk verifikasi, jangan disebar luaskan.

## 8. Batas Paket Gratis Firebase (Spark Plan)
Paket gratis Firebase tanpa kartu kredit adalah **Spark Plan** (Blaze Plan memerlukan kartu kredit/metode pembayaran).

Catatan penting: Sejak 3 Februari 2026, Cloud Storage for Firebase wajib menggunakan paket Blaze. Oleh karena itu, fitur upload foto membutuhkan paket Blaze atau menggunakan layanan penyimpanan media alternatif.

Batas gratis Spark Plan yang masih berlaku:
- **Cloud Firestore**: 1 GiB penyimpanan, 50.000 baca/hari, 20.000 tulis/hari
- **Firebase Hosting**: 10 GB/bulan
- **Firebase Authentication**: Gratis untuk login email/password

*Catatan: Seluruh batas dan kebijakan paket perlu diverifikasi di situs resmi Firebase.*

## 9. Yang Perlu Diverifikasi Saat Setup
- [ ] Firebase project sudah dibuat dan konfigurasi sudah diambil (API key, dsb.)
- [ ] Firebase Authentication (Email/Password) sudah di-enable
- [ ] Cloud Firestore sudah di-enable dan dibuat database
- [ ] Opsi penyimpanan foto disiapkan (Blaze atau alternatif)
- [ ] Security Rules untuk Firestore sudah ditetapkan (bukan default test mode)
- [ ] Firebase Hosting sudah di-setup (firebase init hosting)
- [ ] File konfigurasi Firebase (firebase-config.js atau sejenisnya) tidak diunggah ke GitHub

## 10. Catatan Penting
- Awali dari kampus sendiri: coba teman dekat jadi user pertama
- Jangan langsung minta ribuan user; buktikan dulu fitur verifikasi KTM bekerja
- Gunakan Bootstrap atau template HTML siap pakai agar cepat
- Cari tutorial di YouTube: "Firebase web app tutorial pemula" banyak banget
- Tanya ke grup diskusi kampus atau dosen kalau stuck
