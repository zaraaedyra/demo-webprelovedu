// PRELOVEDU — Auth (mode demo, localStorage). Ganti isi fungsi ini dengan Firebase Auth saat siap.
export const DOMAIN = '@student.unsil.ac.id';
const USERS = 'prelovedu_users', USER = 'prelovedu_user';
const load = () => { try { return JSON.parse(localStorage.getItem(USERS)) || []; } catch { return []; } };
const save = (a) => localStorage.setItem(USERS, JSON.stringify(a));
const initials = (n) => n.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');

export function seedUsers() {
  const base = [
    { id: 'usr-admin', name: 'Admin Kampus', email: 'admin@unsil.ac.id', password: 'admin123', role: 'admin', verified: true, suspended: false, avatar: 'AK', phone: '' },
    { id: 'usr-maba-01', name: 'Zahra Putri', email: 'zahra@student.unsil.ac.id', password: 'demo1234', role: 'mahasiswa', verified: true, suspended: false, avatar: 'ZP', phone: '6281234567890', faculty: 'Informatika 2024' },
    { id: 'usr-budi', name: 'Budi Santoso', email: 'budi@student.unsil.ac.id', password: 'demo1234', role: 'mahasiswa', verified: true, suspended: false, avatar: 'BS', phone: '6287766554433', faculty: 'Teknik Mesin 2024' }
  ];
  const cur = load(), add = base.filter(b => !cur.some(u => u.id === b.id));
  if (add.length) save([...cur, ...add]);
}
export const isUnsilEmail = (e) => { e = e.trim().toLowerCase(); return e.endsWith(DOMAIN) && e.length > DOMAIN.length; };
export const getUsers = () => { seedUsers(); return load(); };
export const saveUsers = save;

export function register({ name, email, phone, password, ktmImage }) {
  seedUsers(); email = email.trim().toLowerCase();
  if (!isUnsilEmail(email)) throw new Error('Gunakan email kampus berakhiran ' + DOMAIN);
  if (password.length < 6) throw new Error('Kata sandi minimal 6 karakter');
  const users = load();
  if (users.some(u => u.email === email)) throw new Error('Email ini sudah terdaftar. Silakan masuk.');
  const code = String(Math.floor(100000 + Math.random() * 900000));
  users.push({ id: 'usr-' + Date.now(), name: name.trim(), email, phone: phone.replace(/\D/g, '').replace(/^0/, '62'), password, role: 'mahasiswa', verified: false, suspended: false, avatar: initials(name), code, ktmImage });
  save(users);
  return code; // mode demo: kode ditampilkan di layar. Firebase: dikirim ke inbox lewat sendEmailVerification()
}
export function verify(email, code) {
  const users = load(), u = users.find(x => x.email === email.trim().toLowerCase());
  if (!u || u.code !== code.trim()) throw new Error('Kode salah. Periksa lagi.');
  u.verified = true; delete u.code; save(users); return startSession(u);
}
export function login(email, password) {
  seedUsers(); const u = load().find(x => x.email === email.trim().toLowerCase());
  if (!u || u.password !== password) throw new Error('Email atau kata sandi salah.');
  if (u.suspended) throw new Error('Akun ini dinonaktifkan oleh admin.');
  if (!u.verified) { const e = new Error('Email belum diverifikasi.'); e.needVerify = true; throw e; }
  return startSession(u);
}
function startSession(u) {
  const s = { id: u.id, name: u.name, email: u.email, phone: u.phone, avatar: u.avatar, faculty: u.faculty || 'Mahasiswa Unsil', role: u.role, isVerified: true };
  localStorage.setItem(USER, JSON.stringify(s)); return s;
}
export const getSession = () => { try { return JSON.parse(localStorage.getItem(USER)); } catch { return null; } };
export const logout = () => { localStorage.removeItem(USER); location.href = location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html'; };
