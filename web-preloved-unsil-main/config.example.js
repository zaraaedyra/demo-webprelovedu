// PRELOVEDU — Konfigurasi Lingkungan (Template)
// Salin file ini menjadi `config.js` saat mengintegrasikan Firebase di Fase 2

export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "prelovedu-kampus.firebaseapp.com",
  projectId: "prelovedu-kampus",
  storageBucket: "prelovedu-kampus.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};

// Opsi Cloudinary unsigned upload jika Firebase Storage memerlukan Blaze
export const cloudinaryConfig = {
  cloudName: "YOUR_CLOUDINARY_CLOUD_NAME",
  uploadPreset: "prelovedu_unsigned"
};
