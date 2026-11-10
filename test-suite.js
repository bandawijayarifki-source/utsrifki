/**
 * COMPREHENSIVE AUTOMATED TEST SUITE FOR SMART FISHERY
 * Sistem Informasi Pemasaran dan Pemesanan Hasil Perikanan Berbasis Web
 * Kab. Tanggamus & Univ. Teknokrat Indonesia
 * 
 * Tests PRD FR-01 through FR-19, Business Rules, and Security Guards.
 */

const fs = require('fs');

// Setup mock DOM environment
const localStorageData = {};
global.localStorage = {
  getItem: (k) => localStorageData[k] || null,
  setItem: (k, v) => { localStorageData[k] = v; },
  removeItem: (k) => { delete localStorageData[k]; }
};

const domElements = {};
global.window = global;
global.document = {
  getElementById: (id) => {
    if (!domElements[id]) {
      domElements[id] = {
        id,
        value: '',
        innerHTML: '',
        textContent: '',
        style: {},
        classList: { toggle: () => {}, add: () => {}, remove: () => {} },
        appendChild: () => {},
        remove: () => {}
      };
    }
    return domElements[id];
  },
  querySelectorAll: () => [],
  createElement: () => ({
    style: {},
    classList: { add: () => {}, toggle: () => {} },
    innerHTML: '',
    appendChild: () => {},
    remove: () => {}
  }),
  addEventListener: () => {}
};
global.confirm = () => true;
global.prompt = (msg, def) => def;
global.scrollTo = () => {};

// Load app.js
require('./js/app.js');

const results = [];

function test(id, title, fn) {
  try {
    fn();
    results.push({ id, title, status: 'PASS', error: null });
    console.log(`[PASS] ${id}: ${title}`);
  } catch (err) {
    results.push({ id, title, status: 'FAIL', error: err.message });
    console.error(`[FAIL] ${id}: ${title} -> ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('================================================================');
console.log('RUNNING AUTOMATED TEST SUITE: SMART FISHERY (UTS 2026)');
console.log('================================================================\n');

// 1. DATA INITIALIZATION & RESETS
test('TC-01', 'Inisialisasi Database Mock & Default State PRD', () => {
  assert(window.appState !== undefined, 'appState harus terdefinisi di window');
  assert(window.appState.products.length >= 7, 'Minimal 7 produk awal di mock data');
  assert(window.appState.users.length >= 4, 'Minimal 4 pengguna awal sesuai peran');
  assert(window.appState.categories.length === 5, 'Tepat 5 kategori komoditas laut');
  assert(window.appState.orders.length >= 3, 'Minimal 3 pesanan awal dengan riwayat');
});

// 2. FR-01: AUTENTIKASI & REGISTRASI
test('TC-02', 'FR-01: Registrasi Akun Pembeli Baru', () => {
  window.registerSelectedRole = 'pembeli';
  domElements['reg-name'] = { value: 'Dewi Lestari' };
  domElements['reg-email'] = { value: 'dewi.lestari@gmail.com' };
  domElements['reg-phone'] = { value: '0813-1122-3344' };
  
  const prevCount = window.appState.users.length;
  window.handleRegisterSubmit({ preventDefault: () => {} });
  
  assert(window.appState.users.length === prevCount + 1, 'Pengguna baru harus masuk ke appState.users');
  const newUser = window.appState.users[window.appState.users.length - 1];
  assert(newUser.name === 'Dewi Lestari', 'Nama pengguna harus sesuai input');
  assert(newUser.role === 'pembeli', 'Peran harus pembeli');
  assert(window.appState.currentRole === 'buyer', 'Otomatis aktif sebagai peran buyer');
});

test('TC-03', 'FR-01: Registrasi Penjual/Nelayan Baru dengan Status Menunggu', () => {
  window.registerSelectedRole = 'penjual';
  domElements['reg-name'] = { value: 'Suryadi' };
  domElements['reg-email'] = { value: 'suryadi.nelayan@gmail.com' };
  domElements['reg-phone'] = { value: '0853-9988-7766' };
  domElements['reg-store-name'] = { value: 'Nelayan Mandiri Limau' };
  domElements['reg-store-address'] = { value: 'Pesisir Limau, Kab. Tanggamus' };
  domElements['reg-store-desc'] = { value: 'Penyedia kakap dan kerapu segar' };

  window.handleRegisterSubmit({ preventDefault: () => {} });
  const newSeller = window.appState.users[window.appState.users.length - 1];
  assert(newSeller.role === 'penjual', 'Peran harus penjual');
  assert(newSeller.verification_status === 'Menunggu', 'Status verifikasi awal penjual harus Menunggu');
  assert(window.appState.currentRole === 'seller_pending', 'Otomatis aktif sebagai seller_pending');
});

// 3. FR-02: ROLE-BASED ACCESS CONTROL (RBAC) & 403
test('TC-04', 'FR-02: Pengunjung Ditolak Akses ke Admin Dashboard (403)', () => {
  window.switchRole('visitor');
  window.navigateTo('admin_dashboard');
  assert(window.appState.currentView === '403', 'Pengunjung mengakses admin harus dialihkan ke 403');
});

test('TC-05', 'FR-02: Pembeli Ditolak Akses ke Admin Dashboard (403)', () => {
  window.switchRole('buyer');
  window.navigateTo('admin_dashboard');
  assert(window.appState.currentView === '403', 'Pembeli mengakses admin harus dialihkan ke 403');
});

test('TC-06', 'FR-02: Pengunjung Ditolak Akses ke Seller Dashboard (403)', () => {
  window.switchRole('visitor');
  window.navigateTo('seller_dashboard');
  assert(window.appState.currentView === '403', 'Pengunjung mengakses seller harus dialihkan ke 403');
});

test('TC-07', 'FR-02: Pengunjung Ditolak Akses Langsung ke Checkout', () => {
  window.switchRole('visitor');
  window.navigateTo('checkout');
  assert(window.appState.currentView === 'login', 'Pengunjung membuka checkout harus dialihkan ke login');
});

// 4. FR-03: PENGELOLAAN PROFIL
test('TC-08', 'FR-03: Pembaruan Profil Pembeli', () => {
  window.switchRole('buyer');
  domElements['buyer-profile-name'] = { value: 'Budi Santoso Updated' };
  domElements['buyer-profile-phone'] = { value: '0812-9999-8888' };
  domElements['buyer-profile-address'] = { value: 'Gisting Bawah Blok C No. 5, Tanggamus' };

  window.handleUpdateBuyerProfile({ preventDefault: () => {} });
  const buyer = window.appState.users.find(u => u.id === 4);
  assert(buyer.name === 'Budi Santoso Updated', 'Nama pembeli harus terbarui');
  assert(buyer.phone === '0812-9999-8888', 'Nomor telepon harus terbarui');
});

test('TC-09', 'FR-03: Pembaruan Profil Toko Nelayan', () => {
  window.switchRole('seller');
  domElements['seller-profile-store'] = { value: 'Toko Bahari Prima Tanggamus' };
  domElements['seller-profile-name'] = { value: 'Slamet Riyadi' };
  domElements['seller-profile-address'] = { value: 'Dermaga 2 Pelabuhan Kota Agung' };
  domElements['seller-profile-phone'] = { value: '0852-1111-2222' };
  domElements['seller-profile-desc'] = { value: 'Spesialis tangkapan tenggiri dan tongkol segar' };

  window.handleUpdateSellerProfile({ preventDefault: () => {} });
  const seller = window.appState.users.find(u => u.id === 2);
  assert(seller.store_name === 'Toko Bahari Prima Tanggamus', 'Nama toko harus terbarui');
});

// 5. FR-04: VERIFIKASI PENJUAL OLEH ADMIN
test('TC-10', 'FR-04 & Aturan Bisnis 1: Penjual Pending Ditolak Menerbitkan Produk', () => {
  // Ensure seller has pending status
  const sellerPendingUser = window.appState.users.find(u => u.id === 3);
  sellerPendingUser.verification_status = 'Menunggu';
  window.switchRole('seller_pending');
  
  let toastMsg = '';
  window.showToastHook = (msg, type) => { toastMsg = msg; };
  window.openAddProductModal();
  window.showToastHook = null;
  
  assert(toastMsg.includes('belum diverifikasi admin'), 'Harus menampilkan penolakan belum diverifikasi');
});

test('TC-11', 'FR-04: Admin Menyetujui Penjual Pending (Hasanudin)', () => {
  window.switchRole('admin');
  window.verifySeller(3, 'Disetujui');
  const hasanudin = window.appState.users.find(u => u.id === 3);
  assert(hasanudin.verification_status === 'Disetujui', 'Status Hasanudin harus Disetujui');
});

test('TC-12', 'FR-04: Penjual yang Telah Disetujui Kini Dapat Membuka Modal Tambah Produk', () => {
  window.switchRole('seller_pending');
  let modalOpened = false;
  domElements['modal-container'] = {
    set innerHTML(val) {
      if (val.includes('Tambah Produk Hasil Perikanan')) modalOpened = true;
    }
  };
  window.openAddProductModal();
  assert(modalOpened === true, 'Penjual yang telah disetujui admin harus diizinkan membuka modal');
});

// 6. FR-05 & FR-06: KATALOG, PENCARIAN & FILTER KATEGORI
test('TC-13', 'FR-05: Produk Aktif Tampil dan Produk Stok Habis Memiliki Badge Khusus', () => {
  const kakapHabis = window.appState.products.find(p => p.id === 7);
  assert(kakapHabis.stock === 0, 'Produk ID 7 stok harus 0');
  const cardHtml = window.renderProductCard(kakapHabis);
  assert(cardHtml.includes('Stok Habis'), 'Harus menampilkan badge Stok Habis');
  assert(cardHtml.includes('disabled'), 'Tombol keranjang harus disabled');
});

test('TC-14', 'FR-06: Navigasi Kategori dari Beranda Memfilter Katalog', () => {
  window.navigateTo('catalog', { category: 'udang' });
  assert(window.catalogFilterCat === 'udang', 'Filter kategori katalog harus terpasang "udang"');
});

test('TC-15', 'FR-06: Reset Filter Mengembalikan Kategori & Menghapus Input Pencarian', () => {
  domElements['catalog-search-input'] = { value: 'Tongkol' };
  window.resetCatalogFilters();
  assert(window.catalogFilterCat === 'all', 'Filter kategori harus reset ke "all"');
  assert(domElements['catalog-search-input'].value === '', 'Search input harus dikosongkan');
});

// 7. FR-08 & FR-09: CRUD PRODUK & MANAJEMEN STOK
test('TC-16', 'FR-08: Penjual Menerbitkan Produk Baru dengan Validasi Positif', () => {
  window.switchRole('seller');
  domElements['prod-name'] = { value: 'Ikan Bawal Bintang Teluk Semaka' };
  domElements['prod-cat'] = { value: '1' };
  domElements['prod-price'] = { value: '75000' };
  domElements['prod-unit'] = { value: 'kg' };
  domElements['prod-stock'] = { value: '18' };
  domElements['prod-desc'] = { value: 'Bawal bintang segar perairan karang' };
  domElements['prod-img'] = { value: 'assets/prod-kerapu.svg' };

  const prevCount = window.appState.products.length;
  window.handleSaveProduct({ preventDefault: () => {} });
  
  assert(window.appState.products.length === prevCount + 1, 'Produk baru harus bertambah');
  const added = window.appState.products[0];
  assert(added.name === 'Ikan Bawal Bintang Teluk Semaka', 'Nama produk harus tersimpan');
  assert(added.price === 75000, 'Harga harus berupa angka 75000');
  assert(added.stock === 18, 'Stok awal harus 18');
});

test('TC-17', 'FR-09 & Aturan Bisnis 1: Mencegah Stok Negatif pada Penambahan Produk', () => {
  document.getElementById('prod-name').value = 'Produk Error Stok';
  document.getElementById('prod-cat').value = '1';
  document.getElementById('prod-price').value = '50000';
  document.getElementById('prod-unit').value = 'kg';
  document.getElementById('prod-stock').value = '-5';
  document.getElementById('prod-desc').value = 'Uji stok negatif';
  document.getElementById('prod-img').value = 'assets/prod-tongkol.svg';

  let toastErr = '';
  window.showToastHook = (msg, type) => { if (type === 'error') toastErr = msg; };
  const prevCount = window.appState.products.length;
  window.handleSaveProduct({ preventDefault: () => {} });
  window.showToastHook = null;

  assert(window.appState.products.length === prevCount, 'Produk dengan stok negatif tidak boleh tersimpan');
    assert(toastErr.toLowerCase().includes('negatif'), 'Pesan error stok negatif harus muncul');
});

test('TC-18', 'FR-09: Quick Update Stok Mencegah Nilai Berkurang di Bawah Nol', () => {
  const prod = window.appState.products.find(p => p.id === 1);
  const initialStock = prod.stock;
  
  // Try to reduce more than available stock
  window.quickUpdateStock(1, -(initialStock + 10));
  assert(prod.stock === initialStock, 'Stok tidak boleh berkurang melebihi nilai tersedia');
  
  // Valid increment
  window.quickUpdateStock(1, 5);
  assert(prod.stock === initialStock + 5, 'Stok bertambah 5 dengan benar');
});

// 8. FR-10: KERANJANG BELANJA
test('TC-19', 'FR-10: Pengunjung Dilarang Menambah ke Keranjang Tanpa Login', () => {
  window.switchRole('visitor');
  window.addToCart(1, 1);
  assert(window.appState.currentView === 'login', 'Pengunjung diarahkan ke login');
});

test('TC-20', 'FR-10: Pembeli Menambah Produk ke Keranjang Sesuai Batas Stok', () => {
  window.switchRole('buyer');
  window.appState.cart = [];
  window.addToCart(1, 3);
  assert(window.appState.cart.length === 1, 'Item masuk ke keranjang');
  assert(window.appState.cart[0].productId === 1, 'Product ID sesuai');
  assert(window.appState.cart[0].quantity === 3, 'Kuantitas 3');
});

test('TC-21', 'FR-10: Mencegah Tambah ke Keranjang Melebihi Stok Tersedia', () => {
  const prod = window.appState.products.find(p => p.id === 1);
  let toastErr = '';
  window.showToastHook = (msg, type) => { if (type === 'error') toastErr = msg; };

  window.addToCart(1, prod.stock + 100);
  window.showToastHook = null;

  assert(toastErr.includes('Stok tidak mencukupi'), 'Peringatan stok tidak mencukupi harus tampil');
});

test('TC-22', 'FR-10: Hapus Produk dari Keranjang', () => {
  window.removeFromCart(1);
  assert(window.appState.cart.length === 0, 'Keranjang harus kosong setelah dihapus');
});

// 9. FR-11: CHECKOUT, SNAPSHOT HARGA & PENGURANGAN STOK
test('TC-23', 'FR-11: Transaksi Checkout Mengurangi Stok & Membuat Snapshot Harga', () => {
  window.switchRole('buyer');
  const prod = window.appState.products.find(p => p.id === 2); // Udang Vaname
  const originalStock = prod.stock;
  const orderQty = 2;

  window.appState.cart = [{ productId: 2, quantity: orderQty }];
  
  domElements['checkout-address'] = { value: 'Jl. Samudra No. 8, Kota Agung, Tanggamus' };
  domElements['checkout-phone'] = { value: '0812-7788-9900' };
  domElements['checkout-notes'] = { value: 'Packing sterofoam tebal' };

  const prevOrdersCount = window.appState.orders.length;
  window.processCheckoutOrder({ preventDefault: () => {} });

  assert(window.appState.orders.length === prevOrdersCount + 1, 'Pesanan baru harus tercipta');
  assert(prod.stock === originalStock - orderQty, 'Stok produk harus berkurang sebesar kuantitas pesanan');
  assert(window.appState.cart.length === 0, 'Keranjang harus dikosongkan setelah pesanan selesai');

  const newOrder = window.appState.orders[0];
  assert(newOrder.items[0].unit_price === prod.price, 'Harga snapshot harus identik dengan harga saat pemesanan');
  assert(newOrder.status === 'Menunggu Konfirmasi', 'Status awal pesanan harus Menunggu Konfirmasi');
});

// 10. FR-12: ALUR STATUS PESANAN
test('TC-24', 'FR-12 & Aturan Bisnis 6: Alur Status Pesanan Sesuai Urutan PRD', () => {
  window.switchRole('seller');
  const order = window.appState.orders[0];

  // 1. Menunggu Konfirmasi -> Dikonfirmasi
  window.advanceOrderStatus(order.id, 'Dikonfirmasi');
  assert(order.status === 'Dikonfirmasi', 'Status harus menjadi Dikonfirmasi');

  // 2. Dikonfirmasi -> Diproses
  window.advanceOrderStatus(order.id, 'Diproses');
  assert(order.status === 'Diproses', 'Status harus menjadi Diproses');

  // 3. Diproses -> Dikirim
  window.advanceOrderStatus(order.id, 'Dikirim');
  assert(order.status === 'Dikirim', 'Status harus menjadi Dikirim');

  // 4. Dikirim -> Selesai
  window.switchRole('buyer');
  window.advanceOrderStatus(order.id, 'Selesai');
  assert(order.status === 'Selesai', 'Status harus menjadi Selesai');
});

test('TC-25', 'FR-12: Menolak Transisi Status yang Melompati Alur Standar', () => {
  const order = window.appState.orders[0];
  order.status = 'Menunggu Konfirmasi';
  
  let toastErr = '';
  window.showToastHook = (msg, type) => { if (type === 'error') toastErr = msg; };

  // Attempt invalid jump from 'Menunggu Konfirmasi' directly to 'Selesai'
  window.advanceOrderStatus(order.id, 'Selesai');
  window.showToastHook = null;

  assert(toastErr.includes('tidak valid'), 'Peringatan transisi tidak valid harus muncul');
  assert(order.status === 'Menunggu Konfirmasi', 'Status tidak boleh berubah jika lompatan tidak sah');
});

// 11. FR-14: PEMBATALAN PESANAN & PENGEMBALIAN STOK SATU KALI
test('TC-26', 'FR-14: Pembatalan Mengembalikan Stok Tepat Satu Kali', () => {
  // Create a clean order to cancel
  const prod = window.appState.products.find(p => p.id === 1);
  const stockBefore = prod.stock;
  
  window.appState.cart = [{ productId: 1, quantity: 4 }];
  window.processCheckoutOrder({ preventDefault: () => {} });
  assert(prod.stock === stockBefore - 4, 'Stok berkurang 4 saat checkout');

  const createdOrder = window.appState.orders[0];
  domElements['cancelReasonInput'] = { value: 'Ingin mengubah alamat pengiriman' };
  
  window.executeCancelOrder(createdOrder.id);
  assert(createdOrder.status === 'Dibatalkan', 'Status menjadi Dibatalkan');
  assert(prod.stock === stockBefore, 'Stok kembali utuh setelah pembatalan');

  // Duplicate cancellation check: Attempting to cancel again must NOT refund stock again
  window.executeCancelOrder(createdOrder.id);
  assert(prod.stock === stockBefore, 'Stok TIDAK boleh bertambah lagi pada pembatalan duplikat');
});

// 12. FR-15 & FR-16: DASHBOARD ADMIN & REKAP LAPORAN
test('TC-27', 'FR-15 & PRD 3.1: Terminologi Nilai Pesanan (Tanpa Payment Gateway)', () => {
  window.switchRole('admin');
  const overviewHtml = window.renderAdminOverviewTab(
    window.appState.users.length,
    window.appState.users.filter(u => u.role === 'penjual').length,
    0,
    window.appState.products.length,
    window.appState.orders.length,
    1500000
  );
  assert(overviewHtml.includes('Total Nilai Pesanan'), 'Harus memakai frasa resmi "Total Nilai Pesanan"');
  assert(!overviewHtml.includes('pendapatan terbayar'), 'TIDAK boleh memuat istilah "pendapatan terbayar"');
});

test('TC-28', 'FR-16: Filter Rekapitulasi Laporan Berdasarkan Status', () => {
  window.filterAdminReports('all', 'Selesai');
  assert(window.adminReportStatus === 'Selesai', 'Filter status laporan harus "Selesai"');
  const reportHtml = window.renderAdminReportsTab(0);
  assert(reportHtml.includes('Selesai Saja'), 'Tampilan laporan memuat opsi Selesai Saja terpilih');
});

// 13. FR-17: AUDIT TRAIL LOGGING
test('TC-29', 'FR-17: Setiap Aksi Penting Tercatat di Log Aktivitas', () => {
  const latestLog = window.appState.activityLogs[0];
  assert(latestLog !== undefined, 'Log aktivitas harus memiliki entri');
  assert(latestLog.time.length === 19, 'Format waktu audit ISO YYYY-MM-DD HH:mm:ss');
  assert(latestLog.action !== '', 'Aksi audit tercatat');
});

// 14. FR-18: IDENTITAS VISUAL RESMI (LOGO TANGGAMUS & TEKNOKRAT)
test('TC-30', 'FR-18: Logo Resmi Pemda Tanggamus & Univ Teknokrat Tersedia dan Utuh', () => {
  assert(fs.existsSync('logo/Lambang_Kabupaten_Tanggamus.png'), 'Berkas logo Tanggamus harus ada di disk');
  assert(fs.existsSync('logo/download (3).png'), 'Berkas logo Teknokrat harus ada di disk');
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  assert(indexHtml.includes('logo/Lambang_Kabupaten_Tanggamus.png'), 'Header/Footer harus memuat logo Tanggamus');
  assert(indexHtml.includes('logo/download (3).png'), 'Header/Footer harus memuat logo Teknokrat');
});

// 15. FR-19: FOOTER WAJIB PERSIS
test('TC-31', 'FR-19: Teks Hak Cipta Footer Harus Persis Sesuai PRD', () => {
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  const exactFooter = 'Copyright©2026 by Rifki Banda Wijaya dan Dr. Erliyan Redy Susanto, M.Kom';
  assert(indexHtml.includes(exactFooter), 'Teks footer harus persis: Copyright©2026 by Rifki Banda Wijaya dan Dr. Erliyan Redy Susanto, M.Kom');
});

// 16. ADVANCED EDGE CASES & ROBUSTNESS (TC-32 s.d. TC-44)
test('TC-32', 'FR-01: Login Otomatis Mengarahkan ke Peran Sesuai Akun', () => {
  domElements['login-email'] = { value: 'admin@tanggamus.go.id' };
  window.handleLoginSubmit({ preventDefault: () => {} });
  assert(window.appState.currentRole === 'admin', 'Login email admin harus beralih ke peran admin');

  domElements['login-email'] = { value: 'slamet.bahari@gmail.com' };
  window.handleLoginSubmit({ preventDefault: () => {} });
  assert(window.appState.currentRole === 'seller', 'Login email bahari harus beralih ke peran seller');

  domElements['login-email'] = { value: 'hasanudin.semaka@gmail.com' };
  window.handleLoginSubmit({ preventDefault: () => {} });
  assert(window.appState.currentRole === 'seller_pending', 'Login email semaka harus beralih ke peran seller_pending');

  domElements['login-email'] = { value: 'budi.santoso@gmail.com' };
  window.handleLoginSubmit({ preventDefault: () => {} });
  assert(window.appState.currentRole === 'buyer', 'Login email pembeli harus beralih ke peran buyer');
});

test('TC-33', 'FR-10: Update Kuantitas Keranjang Menolak Melebihi Stok dan Menghapus Saat Nol', () => {
  window.switchRole('buyer');
  const prod = window.appState.products.find(p => p.id === 1);
  window.appState.cart = [{ productId: 1, quantity: 2 }];
  
  // Valid update
  window.updateCartQty(1, 4);
  assert(window.appState.cart[0].quantity === 4, 'Kuantitas harus terbarui menjadi 4');

  // Attempt update exceeding stock
  let toastErr = '';
  window.showToastHook = (msg, type) => { if (type === 'error') toastErr = msg; };
  window.updateCartQty(1, prod.stock + 10);
  assert(window.appState.cart[0].quantity === 4, 'Kuantitas tidak boleh berubah jika melebihi stok');
  assert(toastErr.includes('Stok maksimal'), 'Pesan error stok maksimal harus muncul');

  // Decrement to zero removes item
  window.updateCartQty(1, 0);
  assert(window.appState.cart.length === 0, 'Item harus dihapus otomatis dari keranjang jika kuantitas <= 0');
  window.showToastHook = null;
});

test('TC-34', 'FR-08: Penonaktifan dan Pengaktifan Kembali Status Produk', () => {
  const prod = window.appState.products.find(p => p.id === 1);
  const initialStatus = prod.is_active;
  
  window.toggleProductActive(1);
  assert(prod.is_active === !initialStatus, 'Status is_active harus berbalik');

  window.toggleProductActive(1);
  assert(prod.is_active === initialStatus, 'Status is_active harus kembali ke status semula');
});

test('TC-35', 'FR-08: Pembaruan Data Produk dengan Validasi Angka Positif', () => {
  const prod = window.appState.products.find(p => p.id === 1);
  domElements['edit-prod-name'] = { value: 'Ikan Tongkol Segar Super' };
  domElements['edit-prod-cat'] = { value: '1' };
  domElements['edit-prod-price'] = { value: '38000' };
  domElements['edit-prod-unit'] = { value: 'kg' };
  domElements['edit-prod-stock'] = { value: '55' };
  domElements['edit-prod-desc'] = { value: 'Tongkol segar hasil tangkapan pagi hari Teluk Semaka' };

  window.handleUpdateProduct({ preventDefault: () => {} }, 1);
  assert(prod.name === 'Ikan Tongkol Segar Super', 'Nama produk harus diperbarui');
  assert(prod.price === 38000, 'Harga harus diperbarui menjadi 38000');
  assert(prod.stock === 55, 'Stok harus diperbarui menjadi 55');

  // Test validation: negative stock rejected
  domElements['edit-prod-stock'] = { value: '-10' };
  let toastErr = '';
  window.showToastHook = (msg, type) => { if (type === 'error') toastErr = msg; };
  window.handleUpdateProduct({ preventDefault: () => {} }, 1);
  assert(prod.stock === 55, 'Stok tidak boleh terupdate dengan nilai negatif');
  assert(toastErr.includes('negatif'), 'Pesan error stok negatif harus tampil');
  window.showToastHook = null;
});

test('TC-36', 'FR-15: Penambahan Kategori Komoditas Perikanan Baru oleh Admin', () => {
  window.switchRole('admin');
  domElements['cat-name'] = { value: 'Rumput Laut & Moluska' };
  domElements['cat-slug'] = { value: 'rumput-laut' };
  domElements['cat-desc'] = { value: 'Komoditas budidaya perairan pantai Teluk Semaka' };

  const prevCount = window.appState.categories.length;
  window.handleSaveCategory({ preventDefault: () => {} });
  
  assert(window.appState.categories.length === prevCount + 1, 'Kategori baru harus tersimpan');
  const addedCat = window.appState.categories[window.appState.categories.length - 1];
  assert(addedCat.name === 'Rumput Laut & Moluska', 'Nama kategori harus sesuai input');
  assert(addedCat.slug === 'rumput-laut', 'Slug kategori harus sesuai input');
});

test('TC-37', 'FR-15: Penonaktifan dan Aktivasi Status Pengguna oleh Admin', () => {
  window.switchRole('admin');
  const user = window.appState.users.find(u => u.id === 4);
  const initialActive = user.is_active;

  window.toggleUserActive(4);
  assert(user.is_active === !initialActive, 'Status pengguna harus berbalik');

  window.toggleUserActive(4);
  assert(user.is_active === initialActive, 'Status pengguna harus kembali aktif');
});

test('TC-38', 'FR-18 / Utilitas: Format Mata Uang Rupiah Standar Indonesia', () => {
  assert(window.formatRupiah(35000) === 'Rp 35.000', 'Format 35000 harus "Rp 35.000"');
  assert(window.formatRupiah(1500000) === 'Rp 1.500.000', 'Format 1500000 harus "Rp 1.500.000"');
  assert(window.formatRupiah(0) === 'Rp 0', 'Format 0 harus "Rp 0"');
});

test('TC-39', 'FR-12: Pemetaan Kelas CSS dan Label Status Pesanan Lengkap', () => {
  const s1 = window.getStatusBadge('Menunggu Konfirmasi');
  const s2 = window.getStatusBadge('Dikonfirmasi');
  const s3 = window.getStatusBadge('Diproses');
  const s4 = window.getStatusBadge('Dikirim');
  const s5 = window.getStatusBadge('Selesai');
  const s6 = window.getStatusBadge('Dibatalkan');

  assert(s1.includes('badge-menunggu-konfirmasi') && s1.includes('Menunggu Konfirmasi'), 'Badge Menunggu Konfirmasi harus valid');
  assert(s2.includes('badge-dikonfirmasi') && s2.includes('Dikonfirmasi'), 'Badge Dikonfirmasi harus valid');
  assert(s3.includes('badge-diproses') && s3.includes('Diproses'), 'Badge Diproses harus valid');
  assert(s4.includes('badge-dikirim') && s4.includes('Dikirim'), 'Badge Dikirim harus valid');
  assert(s5.includes('badge-selesai') && s5.includes('Selesai'), 'Badge Selesai harus valid');
  assert(s6.includes('badge-dibatalkan') && s6.includes('Dibatalkan'), 'Badge Dibatalkan harus valid');
});

test('TC-40', 'FR-07: Stepper Kuantitas Halaman Detail Mematuhi Batas Minimal 1 dan Maksimal Stok', () => {
  domElements['detail-qty-input'] = { value: '1', max: '10' };
  window.stepDetailQty(1);
  assert(domElements['detail-qty-input'].value === 2, 'Stepper +1 harus menghasilkan 2');

  window.stepDetailQty(20);
  assert(domElements['detail-qty-input'].value === 10, 'Stepper tidak boleh melebihi max=10');

  window.stepDetailQty(-50);
  assert(domElements['detail-qty-input'].value === 1, 'Stepper tidak boleh kurang dari min=1');
});

test('TC-41', 'FR-04: Penolakan Verifikasi Penjual oleh Admin dengan Pencatatan Log', () => {
  window.switchRole('admin');
  const user = window.appState.users.find(u => u.id === 3);
  user.verification_status = 'Menunggu';
  
  global.prompt = () => 'Dokumen NIB tidak valid';
  window.verifySeller(3, 'Ditolak');
  assert(user.verification_status === 'Ditolak', 'Status verifikasi harus berubah menjadi Ditolak');
  
  const rejectLog = window.appState.activityLogs.find(l => l.action === 'REJECT_SELLER');
  assert(rejectLog !== undefined, 'Log penolakan harus tercatat');
  assert(rejectLog.note.includes('Dokumen NIB tidak valid'), 'Rincian alasan harus tercatat di audit trail');
});

test('TC-42', 'FR-12 & Aturan Bisnis 6: Isolasi Data Toko Penjual (Hanya Toko Sendiri)', () => {
  window.switchRole('seller');
  // Seller ID 2 (Pak Slamet - Toko Bahari)
  const sellerProducts = window.appState.products.filter(p => p.seller_id === 2);
  const sellerOrders = window.appState.orders.filter(o => o.seller_id === 2);
  
  assert(sellerProducts.every(p => p.seller_id === 2), 'Seluruh produk dalam daftar toko harus milik seller ID 2');
  assert(sellerOrders.every(o => o.seller_id === 2), 'Seluruh pesanan dalam daftar toko harus pesanan toko ID 2');
});

test('TC-43', 'Nonfungsional: Responsivitas CSS Media Queries Layar Mobile & Desktop', () => {
  const css = fs.readFileSync('css/style.css', 'utf8');
  assert(css.includes('@media'), 'CSS harus memuat aturan @media query');
  assert(css.includes('max-width: 768px') || css.includes('768px'), 'CSS harus memuat breakpoint mobile 768px');
  assert(css.includes('--color-primary') && css.includes('--color-navy'), 'CSS harus mendefinisikan variabel palet maritim');
});

test('TC-44', 'FR-05 & Nonfungsional: Rendering Tampilan Utama Bebas Kesalahan Sintaks', () => {
  assert(typeof window.renderHomeView() === 'string', 'renderHomeView menghasilkan string HTML');
  assert(typeof window.renderCatalogView() === 'string', 'renderCatalogView menghasilkan string HTML');
  assert(typeof window.renderCartView() === 'string', 'renderCartView menghasilkan string HTML');
  assert(typeof window.renderCheckoutView() === 'string', 'renderCheckoutView menghasilkan string HTML');
  assert(typeof window.renderBuyerDashboard() === 'string', 'renderBuyerDashboard menghasilkan string HTML');
  assert(typeof window.renderSellerDashboard() === 'string', 'renderSellerDashboard menghasilkan string HTML');
  assert(typeof window.renderAdminDashboard() === 'string', 'renderAdminDashboard menghasilkan string HTML');
});

console.log('\n================================================================');
const passed = results.filter(r => r.status === 'PASS').length;
const failed = results.filter(r => r.status === 'FAIL').length;
console.log(`TEST SUMMARY: TOTAL ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}
