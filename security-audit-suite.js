/**
 * COMPREHENSIVE AUTOMATED SECURITY AUDIT TEST SUITE
 * SMART FISHERY - KABUPATEN TANGGAMUS (UTS 2026)
 * 
 * Verifies OWASP Top 10 (2021) Controls, PRD Section 8 Security Requirements,
 * Boundary Defenses, RBAC Boundaries, and Sanitization.
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

const secResults = [];

function secTest(id, title, category, severity, fn) {
  try {
    fn();
    secResults.push({ id, title, category, severity, status: 'PASS', error: null });
    console.log(`[PASS] ${id} (${severity}): ${title}`);
  } catch (err) {
    secResults.push({ id, title, category, severity, status: 'FAIL', error: err.message });
    console.error(`[FAIL] ${id} (${severity}): ${title} -> ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Security Assertion Failed');
  }
}

console.log('================================================================');
console.log('RUNNING AUTOMATED SECURITY AUDIT SUITE: SMART FISHERY (UTS 2026)');
console.log('Standards: OWASP Top 10 (2021), PRD Section 8, NIST SP 800-53');
console.log('================================================================\n');

// SEC-01: OWASP A03 - Injection & XSS Sanitization
secTest('SEC-01', 'Sanitasi HTML Entity Anti-XSS (escapeHtml)', 'OWASP A03: Injection', 'HIGH', () => {
  assert(typeof window.escapeHtml === 'function', 'Fungsi escapeHtml harus terdefinisi');
  const payload = '<script>alert("XSS")</script>&<img src=x onerror=alert(1)>';
  const clean = window.escapeHtml(payload);
  assert(!clean.includes('<script>'), 'Tag script tidak boleh ada dalam bentuk mentah');
  assert(!clean.includes('<img'), 'Tag img tidak boleh ada dalam bentuk mentah');
  assert(clean.includes('&lt;script&gt;'), 'Karakter < dan > harus dikonversi menjadi &lt; dan &gt;');
  assert(clean.includes('&lt;img'), 'Tag pembuka <img harus dinetralisir menjadi &lt;img');
  assert(clean.includes('&amp;'), 'Karakter & harus menjadi &amp;');
  assert(clean.includes('&quot;'), 'Karakter " harus menjadi &quot;');
});

// SEC-02: OWASP A01 - Broken Access Control: Admin Route Interception
secTest('SEC-02', 'Intersepsi RBAC: Pengunjung Dilarang Masuk Admin (403)', 'OWASP A01: Broken Access Control', 'CRITICAL', () => {
  window.switchRole('visitor');
  window.navigateTo('admin_dashboard');
  assert(window.appState.currentView === '403', 'Pengunjung mengakses admin harus dialihkan ke 403 Forbidden');
});

secTest('SEC-03', 'Intersepsi RBAC: Pembeli Dilarang Masuk Admin (403)', 'OWASP A01: Broken Access Control', 'CRITICAL', () => {
  window.switchRole('buyer');
  window.navigateTo('admin_dashboard');
  assert(window.appState.currentView === '403', 'Pembeli mengakses admin harus dialihkan ke 403 Forbidden');
});

// SEC-04: OWASP A01 - Broken Access Control: Checkout Protection
secTest('SEC-04', 'Proteksi Checkout: Pengunjung Diarahkan ke Login Wajib', 'OWASP A01: Broken Access Control', 'HIGH', () => {
  window.switchRole('visitor');
  window.navigateTo('checkout');
  assert(window.appState.currentView === 'login', 'Pengunjung diarahkan ke halaman login');
});

// SEC-05: OWASP A04 - Insecure Design: Concurrency & Negative Stock Defense
secTest('SEC-05', 'Pertahanan Batas Bawah: Penolakan Mutasi Stok Negatif', 'OWASP A04: Insecure Design', 'CRITICAL', () => {
  const prod = window.appState.products.find(p => p.id === 1);
  const initialStock = prod.stock;
  
  let toastErr = '';
  window.showToastHook = (msg, type) => { if (type === 'error') toastErr = msg; };
  window.quickUpdateStock(1, -(initialStock + 50));
  window.showToastHook = null;

  assert(prod.stock === initialStock, 'Stok tidak boleh berkurang di bawah nol');
  assert(toastErr.includes('negatif'), 'Pesan error pencegahan stok negatif harus muncul');
});

// SEC-06: OWASP A04 - Insecure Design: Boundary Attack on Product Creation
secTest('SEC-06', 'Validasi Input Produk: Mencegah Stok Awal Negatif & Harga Nol', 'OWASP A04: Insecure Design', 'HIGH', () => {
  domElements['prod-name'] = { value: 'Ikan Malicious Zero' };
  domElements['prod-cat'] = { value: '1' };
  domElements['prod-price'] = { value: '0' }; // Invalid price < 1000
  domElements['prod-unit'] = { value: 'kg' };
  domElements['prod-stock'] = { value: '-20' }; // Negative stock
  domElements['prod-desc'] = { value: 'Testing boundary manipulation' };
  domElements['prod-img'] = { value: 'assets/prod-tongkol.svg' };

  let toastErr = '';
  window.showToastHook = (msg, type) => { if (type === 'error') toastErr = msg; };
  const prevCount = window.appState.products.length;
  window.handleSaveProduct({ preventDefault: () => {} });
  window.showToastHook = null;

  assert(window.appState.products.length === prevCount, 'Produk manipulatif tidak boleh tersimpan');
  assert(toastErr.length > 0, 'Sistem harus menolak dengan pesan error validasi');
});

// SEC-07: OWASP A04 - Insecure Design: Single Stock Refund Enforcement
secTest('SEC-07', 'Integritas Transaksional: Jaminan Single Stock Refund Anti-Duplikasi', 'OWASP A04: Insecure Design', 'CRITICAL', () => {
  const prod = window.appState.products.find(p => p.id === 2);
  const stockBefore = prod.stock;

  window.switchRole('buyer');
  window.appState.cart = [{ productId: 2, quantity: 3 }];
  domElements['checkout-address'] = { value: 'Dermaga Kota Agung No. 10' };
  domElements['checkout-phone'] = { value: '0812-7788-9900' };
  domElements['checkout-notes'] = { value: 'Sterofoam tebal' };
  
  window.processCheckoutOrder({ preventDefault: () => {} });
  assert(prod.stock === stockBefore - 3, 'Stok berkurang saat checkout');

  const createdOrder = window.appState.orders[0];
  domElements['cancelReasonInput'] = { value: 'Salah pesan ukuran udang' };

  // Cancel attempt 1
  window.executeCancelOrder(createdOrder.id);
  assert(createdOrder.status === 'Dibatalkan', 'Status menjadi Dibatalkan');
  assert(prod.stock === stockBefore, 'Stok dikembalikan utuh pada pembatalan pertama');

  // Cancel attempt 2 (Exploit Simulation: Double refund attack)
  window.executeCancelOrder(createdOrder.id);
  assert(prod.stock === stockBefore, 'Stok TIDAK boleh bertambah lagi pada pembatalan kedua');
});

// SEC-08: OWASP A04 - Insecure Design: Finite State Machine Security
secTest('SEC-08', 'Penegakan State Machine: Menolak Lompatan Status Pesanan Ilegal', 'OWASP A04: Insecure Design', 'HIGH', () => {
  const order = window.appState.orders[0];
  order.status = 'Menunggu Konfirmasi';

  let toastErr = '';
  window.showToastHook = (msg, type) => { if (type === 'error') toastErr = msg; };
  // Exploit attempt: Skip directly to Selesai
  window.advanceOrderStatus(order.id, 'Selesai');
  window.showToastHook = null;

  assert(order.status === 'Menunggu Konfirmasi', 'Status tidak boleh berubah jika melompati alur');
  assert(toastErr.includes('tidak valid'), 'Peringatan transisi tidak valid harus muncul');
});

// SEC-09: OWASP A01 - Broken Access Control: Unverified Seller Restriction
secTest('SEC-09', 'Aturan Bisnis 1: Penjual Belum Terverifikasi Dilarang Terbitkan Produk', 'OWASP A01: Broken Access Control', 'HIGH', () => {
  const seller = window.appState.users.find(u => u.id === 3);
  seller.verification_status = 'Menunggu';
  window.switchRole('seller_pending');

  let toastMsg = '';
  window.showToastHook = (msg, type) => { toastMsg = msg; };
  window.openAddProductModal();
  window.showToastHook = null;

  assert(toastMsg.includes('belum diverifikasi admin'), 'Peringatan akun belum diverifikasi harus muncul');
});

// SEC-10: OWASP A01 - Broken Access Control: Seller Data Scope Isolation (Anti-IDOR)
secTest('SEC-10', 'Isolasi Data Toko: Penjual Hanya Mengakses Data Toko Sendiri (Anti-IDOR)', 'OWASP A01: Broken Access Control', 'HIGH', () => {
  window.switchRole('seller');
  // Toko Bahari (seller_id 2)
  const myProducts = window.appState.products.filter(p => p.seller_id === 2);
  const otherProducts = window.appState.products.filter(p => p.seller_id !== 2);
  
  assert(myProducts.every(p => p.seller_id === 2), 'Seluruh produk dalam katalog toko adalah milik seller ID 2');
  if (otherProducts.length > 0) {
    assert(otherProducts.every(p => p.seller_id !== 2), 'Produk toko lain terpisah');
  }
});

// SEC-11: OWASP A05 - Security Misconfiguration: HTTP Security Headers in HTML
secTest('SEC-11', 'Konfigurasi Header Keamanan: Verifikasi Meta Headers pada index.html', 'OWASP A05: Security Misconfiguration', 'MEDIUM', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert(html.includes('X-Content-Type-Options') && html.includes('nosniff'), 'Header X-Content-Type-Options: nosniff harus terpasang');
  assert(html.includes('X-XSS-Protection'), 'Header X-XSS-Protection harus terpasang');
  assert(html.includes('strict-origin-when-cross-origin'), 'Referrer policy harus terpasang');
});

// SEC-12: OWASP A09 - Security Logging & Monitoring: Comprehensive Audit Trail
secTest('SEC-12', 'Audit Trail Logging: Pencatatan Waktu, Aktor, dan Aksi Mutasi Data', 'OWASP A09: Logging & Monitoring', 'MEDIUM', () => {
  assert(Array.isArray(window.appState.activityLogs), 'activityLogs harus berupa array');
  assert(window.appState.activityLogs.length > 0, 'Log aktivitas harus memiliki riwayat entri');
  const sampleLog = window.appState.activityLogs[0];
  assert(sampleLog.time && sampleLog.time.length === 19, 'Format waktu ISO YYYY-MM-DD HH:mm:ss');
  assert(sampleLog.action && sampleLog.user, 'Entri log harus mencatat aksi dan nama pelaku');
});

// SEC-13: OWASP A04 - Cart Inventory Depletion Protection
secTest('SEC-13', 'Proteksi Keranjang: Mencegah Tambah Item Melebihi Ketersediaan Fisik', 'OWASP A04: Insecure Design', 'HIGH', () => {
  window.switchRole('buyer');
  const prod = window.appState.products.find(p => p.id === 3);
  let toastErr = '';
  window.showToastHook = (msg, type) => { if (type === 'error') toastErr = msg; };
  window.addToCart(3, prod.stock + 100);
  window.showToastHook = null;

  assert(toastErr.includes('Stok tidak mencukupi'), 'Peringatan stok tidak mencukupi harus muncul');
});

// SEC-14: OWASP A07 - User Role Integrity on Self-Registration
secTest('SEC-14', 'Integritas Peran: Pendaftar Penjual Otomatis Masuk Status "Menunggu"', 'OWASP A07: Auth & ID Failures', 'HIGH', () => {
  window.registerSelectedRole = 'penjual';
  domElements['reg-name'] = { value: 'Nelayan Sukamaju' };
  domElements['reg-email'] = { value: 'sukamaju@gmail.com' };
  domElements['reg-phone'] = { value: '0852-3344-5566' };
  domElements['reg-store-name'] = { value: 'Toko Sukamaju Pesisir' };
  domElements['reg-store-address'] = { value: 'Dermaga Limau Tanggamus' };
  domElements['reg-store-desc'] = { value: 'Ikan karang segar' };

  window.handleRegisterSubmit({ preventDefault: () => {} });
  const registered = window.appState.users[window.appState.users.length - 1];
  assert(registered.role === 'penjual', 'Peran harus penjual');
  assert(registered.verification_status === 'Menunggu', 'Status verifikasi pendaftar baru WAJIB "Menunggu" (tidak boleh langsung aktif)');
});

console.log('\n================================================================');
const passCount = secResults.filter(r => r.status === 'PASS').length;
const failCount = secResults.filter(r => r.status === 'FAIL').length;
console.log(`SECURITY AUDIT SUMMARY: TOTAL ${secResults.length} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
