/**
 * SMART FISHERY - JAVASCRIPT APPLICATION CORE
 * Sistem Informasi Pemasaran dan Pemesanan Hasil Perikanan Berbasis Web
 * Kabupaten Tanggamus & Universitas Teknokrat Indonesia
 * 
 * Implementasi PRD v1.0 & Prompt Desain UI/UX v2
 * Author: Rifki Banda Wijaya (2026)
 */

// ==========================================================================
// 1. DATA STORE INITIALIZATION (MOCK DATABASE & LOCALSTORAGE)
// ==========================================================================

const DEFAULT_STATE = {
  // Current active role for testing: 'visitor', 'buyer', 'seller', 'seller_pending', 'admin'
  currentRole: 'visitor',
  currentView: 'home',
  selectedProductId: null,
  selectedOrderId: null,

  // Users data
  users: [
    {
      id: 1,
      name: "Rifki Banda Wijaya",
      email: "admin@tanggamus.go.id",
      role: "admin",
      phone: "0811-7200-991",
      is_active: true,
      created_at: "2026-01-10 08:00:00"
    },
    {
      id: 2,
      name: "Slamet Riyadi",
      email: "bahari@tanggamus.id",
      role: "penjual",
      store_name: "Toko Bahari Kota Agung",
      store_address: "Dermaga 2 Pelabuhan Perikanan Kota Agung, Tanggamus",
      store_desc: "Penyedia hasil laut segar harian tangkapan nelayan Teluk Semaka dan Kota Agung. Ikan tongkol, tenggiri, udang, dan kerapu kualitas prima.",
      phone: "0852-6987-1122",
      verification_status: "Disetujui",
      is_active: true,
      created_at: "2026-02-15 10:20:00"
    },
    {
      id: 3,
      name: "Hasanudin",
      email: "nelayan.semaka@gmail.com",
      role: "penjual",
      store_name: "Kelompok Nelayan Teluk Semaka",
      store_address: "Pesisir Way Kerap, Kec. Semaka, Tanggamus",
      store_desc: "Koperasi nelayan tradisional jaring insang dan pancing ulur perairan Semaka.",
      phone: "0821-8844-3321",
      verification_status: "Menunggu", // Unverified seller
      is_active: true,
      created_at: "2026-11-09 11:00:00"
    },
    {
      id: 4,
      name: "Budi Santoso",
      email: "budi.santoso@gmail.com",
      role: "pembeli",
      phone: "0812-7788-9900",
      address: "Jl. Merdeka No. 12, Pekon Gisting Bawah, Kec. Gisting, Kab. Tanggamus",
      is_active: true,
      created_at: "2026-03-01 14:40:00"
    }
  ],

  // Categories
  categories: [
    { id: 1, slug: 'ikan', name: "Ikan Laut Segar", desc: "Tongkol, Kerapu, Kakap, Tenggiri dan ikan karang lainnya", icon: "assets/cat-ikan.svg", count: 4, is_active: true },
    { id: 2, slug: 'udang', name: "Udang & Lobster", desc: "Udang Vaname, Windu, dan Lobster Laut Teluk Semaka", icon: "assets/cat-udang.svg", count: 3, is_active: true },
    { id: 3, slug: 'cumi', name: "Cumi-cumi & Gurita", desc: "Cumi sero, sotong segar, dan gurita karang", icon: "assets/cat-cumi.svg", count: 2, is_active: true },
    { id: 4, slug: 'kepiting', name: "Kepiting & Rajungan", desc: "Kepiting bakau muara dan rajungan laut segar", icon: "assets/cat-kepiting.svg", count: 2, is_active: true },
    { id: 5, slug: 'olahan', name: "Hasil Olahan Laut", desc: "Tenggiri giling murni, ikan asin, dan kerupuk ikan", icon: "assets/cat-olahan.svg", count: 2, is_active: true }
  ],

  // Products catalog
  products: [
    {
      id: 1,
      seller_id: 2,
      store_name: "Toko Bahari Kota Agung",
      store_location: "Kota Agung, Tanggamus",
      category_id: 1,
      category_slug: "ikan",
      name: "Ikan Tongkol Segar Tangkapan Pagi",
      description: "Ikan tongkol segar hasil tangkapan nelayan perahu jukung Teluk Semaka dini hari. Daging padat, mata jernih, insang merah segar. Sangat cocok untuk dibakar, bumbu balado, atau gulai khas Lampung.",
      price: 32000,
      unit: "kg",
      stock: 45,
      image_url: "assets/prod-tongkol.svg",
      is_active: true,
      is_featured: true,
      created_at: "2026-11-09 06:00:00"
    },
    {
      id: 2,
      seller_id: 2,
      store_name: "Toko Bahari Kota Agung",
      store_location: "Kota Agung, Tanggamus",
      category_id: 2,
      category_slug: "udang",
      name: "Udang Vaname Super Pesisir Semaka",
      description: "Udang Vaname segar ukuran 30-40 ekor per kilogram. Kulit bening keras, tekstur kenyal manis alami tanpa campuran bahan kimia pengawet.",
      price: 85000,
      unit: "kg",
      stock: 20,
      image_url: "assets/prod-udang.svg",
      is_active: true,
      is_featured: true,
      created_at: "2026-11-09 07:15:00"
    },
    {
      id: 3,
      seller_id: 2,
      store_name: "Toko Bahari Kota Agung",
      store_location: "Kota Agung, Tanggamus",
      category_id: 1,
      category_slug: "ikan",
      name: "Ikan Kerapu Cantik Karang Limau",
      description: "Kerapu karang premium dengan corak bintik khas. Daging sangat lembut dan gurih, pilihan utama untuk masakan tim atau sup ikan segar hotel/restoran.",
      price: 110000,
      unit: "kg",
      stock: 8,
      image_url: "assets/prod-kerapu.svg",
      is_active: true,
      is_featured: true,
      created_at: "2026-11-08 12:30:00"
    },
    {
      id: 4,
      seller_id: 2,
      store_name: "Toko Bahari Kota Agung",
      store_location: "Kota Agung, Tanggamus",
      category_id: 3,
      category_slug: "cumi",
      name: "Cumi-cumi Sero Segar Cukuh Balak",
      description: "Cumi sero dengan kantong tinta utuh dan kulit keperakan kemerahan berkilau. Daging kenyal alami, langsung dibekukan dengan es segera setelah naik jaring.",
      price: 65000,
      unit: "kg",
      stock: 15,
      image_url: "assets/prod-cumi.svg",
      is_active: true,
      is_featured: true,
      created_at: "2026-11-09 05:45:00"
    },
    {
      id: 5,
      seller_id: 2,
      store_name: "Toko Bahari Kota Agung",
      store_location: "Kota Agung, Tanggamus",
      category_id: 4,
      category_slug: "kepiting",
      name: "Kepiting Bakau Super Teluk Semaka",
      description: "Kepiting bakau hidup pilihan, capit besar berisi padat. Ditangkap dari kawasan bakau muara sungai Tanggamus. Diikat tali alami aman.",
      price: 95000,
      unit: "kg",
      stock: 12,
      image_url: "assets/prod-kepiting.svg",
      is_active: true,
      is_featured: false,
      created_at: "2026-11-07 14:00:00"
    },
    {
      id: 6,
      seller_id: 2,
      store_name: "Toko Bahari Kota Agung",
      store_location: "Kota Agung, Tanggamus",
      category_id: 5,
      category_slug: "olahan",
      name: "Tenggiri Giling Murni Super Bahan Pempek",
      description: "Daging ikan tenggiri murni 100% tanpa tulang, kulit, dan tanpa campuran air/tepung. Digiling higienis, sangat kenyal untuk bahan baku pempek, siomay, dan tekwan.",
      price: 120000,
      unit: "kg",
      stock: 25,
      image_url: "assets/prod-tenggiri.svg",
      is_active: true,
      is_featured: false,
      created_at: "2026-11-09 08:30:00"
    },
    {
      id: 7,
      seller_id: 2,
      store_name: "Toko Bahari Kota Agung",
      store_location: "Kota Agung, Tanggamus",
      category_id: 1,
      category_slug: "ikan",
      name: "Ikan Kakap Merah Tanggamus (Stok Habis)",
      description: "Ikan kakap merah tangkapan perairan dalam dekat Teluk Semaka.",
      price: 78000,
      unit: "kg",
      stock: 0, // Demonstrates zero stock behavior & badge
      image_url: "assets/prod-tongkol.svg",
      is_active: true,
      is_featured: false,
      created_at: "2026-11-06 09:00:00"
    }
  ],

  // Cart: [{ productId: 1, quantity: 2 }]
  cart: [
    { productId: 1, quantity: 2 },
    { productId: 2, quantity: 1 }
  ],

  // Orders
  orders: [
    {
      id: 1,
      order_number: "SF-20261110-001",
      buyer_id: 4,
      buyer_name: "Budi Santoso",
      buyer_phone: "0812-7788-9900",
      seller_id: 2,
      store_name: "Toko Bahari Kota Agung",
      status: "Menunggu Konfirmasi",
      total_amount: 149000,
      delivery_address: "Jl. Merdeka No. 12, Pekon Gisting Bawah, Kec. Gisting, Kab. Tanggamus",
      notes: "Tolong ikan tongkolnya dibersihkan sisik dan isi perutnya sekalian ya pak.",
      created_at: "2026-11-10 09:15:20",
      items: [
        { product_id: 1, name: "Ikan Tongkol Segar Tangkapan Pagi", unit_price: 32000, unit: "kg", quantity: 2, subtotal: 64000 },
        { product_id: 2, name: "Udang Vaname Super Pesisir Semaka", unit_price: 85000, unit: "kg", quantity: 1, subtotal: 85000 }
      ],
      history: [
        { old_status: null, new_status: "Menunggu Konfirmasi", changed_by: "Sistem (Pembeli Buat Pesanan)", time: "2026-11-10 09:15:20", note: "Pesanan baru dibuat melalui sistem Smart Fishery." }
      ]
    },
    {
      id: 2,
      order_number: "SF-20261109-082",
      buyer_id: 4,
      buyer_name: "Budi Santoso",
      buyer_phone: "0812-7788-9900",
      seller_id: 2,
      store_name: "Toko Bahari Kota Agung",
      status: "Diproses",
      total_amount: 190000,
      delivery_address: "Komplek Perkantoran Pemkab Tanggamus, Jl. Jend. Sudirman, Kota Agung",
      notes: "Kirim pakai box sterofoam dan es batu penuh.",
      created_at: "2026-11-09 13:20:10",
      items: [
        { product_id: 5, name: "Kepiting Bakau Super Teluk Semaka", unit_price: 95000, unit: "kg", quantity: 2, subtotal: 190000 }
      ],
      history: [
        { old_status: null, new_status: "Menunggu Konfirmasi", changed_by: "Sistem", time: "2026-11-09 13:20:10", note: "Pesanan berhasil masuk." },
        { old_status: "Menunggu Konfirmasi", new_status: "Dikonfirmasi", changed_by: "Penjual (Slamet Riyadi)", time: "2026-11-09 13:45:00", note: "Pesanan diterima, kepiting hidup siap dipacking." },
        { old_status: "Dikonfirmasi", new_status: "Diproses", changed_by: "Penjual (Slamet Riyadi)", time: "2026-11-09 14:10:00", note: "Sedang proses pengikatan dan packing es box." }
      ]
    },
    {
      id: 3,
      order_number: "SF-20261108-041",
      buyer_id: 4,
      buyer_name: "Budi Santoso",
      buyer_phone: "0812-7788-9900",
      seller_id: 2,
      store_name: "Toko Bahari Kota Agung",
      status: "Selesai",
      total_amount: 240000,
      delivery_address: "Jl. Raya Talang Padang No. 45, Tanggamus",
      notes: "COD di tempat toko kelontong Bu Rahayu.",
      created_at: "2026-11-08 08:30:00",
      items: [
        { product_id: 6, name: "Tenggiri Giling Murni Super Bahan Pempek", unit_price: 120000, unit: "kg", quantity: 2, subtotal: 240000 }
      ],
      history: [
        { old_status: null, new_status: "Menunggu Konfirmasi", changed_by: "Sistem", time: "2026-11-08 08:30:00", note: "Pesanan masuk." },
        { old_status: "Menunggu Konfirmasi", new_status: "Dikonfirmasi", changed_by: "Penjual", time: "2026-11-08 08:45:00", note: "Stok tenggiri giling tersedia segar." },
        { old_status: "Dikonfirmasi", new_status: "Diproses", changed_by: "Penjual", time: "2026-11-08 09:15:00", note: "Ikan segar digiling dan divakum." },
        { old_status: "Diproses", new_status: "Dikirim", changed_by: "Penjual", time: "2026-11-08 10:00:00", note: "Pesanan dibawa kurir toko menuju Talang Padang." },
        { old_status: "Dikirim", new_status: "Selesai", changed_by: "Pembeli (Budi Santoso)", time: "2026-11-08 11:25:00", note: "Barang sudah diterima dalam kondisi sangat beku & segar, pembayaran diselesaikan." }
      ]
    }
  ],

  // Activity logs for audit trail (PRD FR-17 & Section 10)
  activityLogs: [
    { id: 1, time: "2026-11-10 09:15:20", user: "Budi Santoso (Pembeli)", action: "CREATE_ORDER", entity: "Pesanan #SF-20261110-001", note: "Total Nilai Rp 149.000" },
    { id: 2, time: "2026-11-09 14:10:00", user: "Slamet Riyadi (Penjual)", action: "UPDATE_STATUS", entity: "Pesanan #SF-20261109-082", note: "Status diubah menjadi Diproses" },
    { id: 3, time: "2026-11-09 11:00:00", user: "Hasanudin (Penjual)", action: "REGISTER_SELLER", entity: "Toko Nelayan Teluk Semaka", note: "Mendaftar toko baru, status verifikasi: Menunggu" },
    { id: 4, time: "2026-11-08 11:25:00", user: "Budi Santoso (Pembeli)", action: "COMPLETE_ORDER", entity: "Pesanan #SF-20261108-041", note: "Pesanan ditandai selesai" }
  ]
};

// Load state from localStorage or use default
let appState = JSON.parse(localStorage.getItem('smart_fishery_db')) || DEFAULT_STATE;
if (typeof window !== 'undefined') { window.appState = appState; }

function saveState() {
  localStorage.setItem('smart_fishery_db', JSON.stringify(appState));
  if (typeof window !== 'undefined') { window.appState = appState; }
}

// Reset state utility
window.resetDemoData = function() {
  if (confirm("Reset seluruh data ke pengaturan awal PRD?")) {
    localStorage.removeItem('smart_fishery_db');
    appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    if (typeof window !== 'undefined') { window.appState = appState; }
    saveState();
    showToast("Data demo berhasil di-reset!", "info");
    render();
  }
};

// ==========================================================================
// 2. CURRENCY, FORMATTING & SECURITY SANITIZATION HELPERS
// ==========================================================================

// Security Sanitization: HTML Entity Escaping against XSS (OWASP A03:2021)
function escapeHtml(unsafe) {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// PII Masking Utilities (OWASP A02:2021 Cryptographic & Privacy Protection)
function maskPhone(phone) {
  if (!phone) return "";
  const str = String(phone).trim();
  const parts = str.split('-');
  if (parts.length === 3) {
    return `${parts[0]}-****-${parts[2]}`;
  }
  if (str.length >= 8) {
    return str.substring(0, 4) + '****' + str.substring(str.length - 4);
  }
  return str;
}

function maskEmail(email) {
  if (!email || !email.includes('@')) return email || "";
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user[0]}*@${domain}`;
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}

function formatRupiah(num) {
  return "Rp " + Number(num).toLocaleString('id-ID');
}

function getStatusBadge(status) {
  let badgeClass = "";
  let iconSvg = "";
  
  switch(status) {
    case "Menunggu Konfirmasi":
      badgeClass = "badge-menunggu-konfirmasi";
      iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
      break;
    case "Dikonfirmasi":
      badgeClass = "badge-dikonfirmasi";
      iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
      break;
    case "Diproses":
      badgeClass = "badge-diproses";
      iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
      break;
    case "Dikirim":
      badgeClass = "badge-dikirim";
      iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`;
      break;
    case "Selesai":
      badgeClass = "badge-selesai";
      iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
      break;
    case "Dibatalkan":
      badgeClass = "badge-dibatalkan";
      iconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
      break;
    default:
      badgeClass = "badge-menunggu-konfirmasi";
      iconSvg = "";
  }
  return `<span class="status-badge ${badgeClass}">${iconSvg} ${status}</span>`;
}

// Log Activity Helper
function recordLog(action, entity, note = "", severity = "INFO") {
  let userName = "Pengunjung";
  if (appState.currentRole === 'buyer') userName = "Budi Santoso (Pembeli)";
  else if (appState.currentRole === 'seller') userName = "Slamet Riyadi (Penjual)";
  else if (appState.currentRole === 'seller_pending') userName = "Hasanudin (Penjual)";
  else if (appState.currentRole === 'admin') userName = "Rifki Banda Wijaya (Admin)";

  const newLogId = appState.activityLogs.reduce((max, l) => Math.max(max, l.id), 0) + 1;
  const newLog = {
    id: newLogId,
    time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: userName,
    action: action,
    entity: entity,
    note: note,
    severity: severity,
    ip_origin: "127.0.0.1 (Local Client)",
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 60) : "Node.js Environment"
  };
  appState.activityLogs.unshift(newLog);
  saveState();
}

// Toast Alert with XSS HTML Entity Escaping (OWASP A03)
function showToast(message, type = "info") {
  if (typeof window !== 'undefined' && typeof window.showToastHook === 'function') {
    window.showToastHook(message, type);
  }
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "error") icon = "❌";
  if (type === "warning") icon = "⚠️";

  toast.innerHTML = `
    <span style="font-size: 1.2rem;">${icon}</span>
    <div style="font-size: 0.85rem; font-weight: 600; color: #0f172a;">${escapeHtml(message)}</div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// 3. ROLE SWITCHER & NAVIGATION ROUTER
// ==========================================================================
window.switchRole = function(role) {
  appState.currentRole = role;
  
  // Default routing based on role selection
  if (role === 'admin') {
    appState.currentView = 'admin_dashboard';
  } else if (role === 'seller' || role === 'seller_pending') {
    appState.currentView = 'seller_dashboard';
  } else if (role === 'buyer') {
    appState.currentView = 'buyer_dashboard';
  } else {
    // Visitor stays or goes to home
    if (['admin_dashboard', 'seller_dashboard', 'buyer_dashboard'].includes(appState.currentView)) {
      appState.currentView = 'home';
    }
  }
  
  saveState();
  showToast(`Beralih ke peran: ${getRoleDisplayName(role)}`, 'info');
  render();
};

function getRoleDisplayName(role) {
  switch(role) {
    case 'visitor': return 'Pengunjung (Guest)';
    case 'buyer': return 'Pembeli (Budi Santoso)';
    case 'seller': return 'Penjual Terverifikasi (Toko Bahari)';
    case 'seller_pending': return 'Penjual Pending (Nelayan Semaka)';
    case 'admin': return 'Admin Pemda Tanggamus (Rifki Banda)';
    default: return role;
  }
}

window.navigateTo = function(view, params = {}) {
  // Authorization boundary checks conforming to PRD FR-02 & Section 5
  if (view.startsWith('admin_') && appState.currentRole !== 'admin') {
    appState.currentView = '403';
    saveState();
    render();
    return;
  }
  if (view.startsWith('seller_') && !['seller', 'seller_pending'].includes(appState.currentRole)) {
    appState.currentView = '403';
    saveState();
    render();
    return;
  }
  if (view.startsWith('buyer_') && appState.currentRole !== 'buyer') {
    appState.currentView = '403';
    saveState();
    render();
    return;
  }
  if (view === 'checkout') {
    if (appState.currentRole === 'visitor') {
      showToast("Silakan login sebagai Pembeli terlebih dahulu untuk checkout pesanan!", "warning");
      navigateTo('login');
      return;
    }
    if (appState.currentRole !== 'buyer') {
      appState.currentView = '403';
      saveState();
      render();
      return;
    }
    if (appState.cart.length === 0) {
      showToast("Keranjang belanja Anda masih kosong!", "warning");
      navigateTo('catalog');
      return;
    }
  }
  
  if (params.productId) appState.selectedProductId = params.productId;
  if (params.orderId) appState.selectedOrderId = params.orderId;
  if (params.category !== undefined) {
    window.catalogFilterCat = params.category;
  }

  appState.currentView = view;
  saveState();
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  render();
};

// ==========================================================================
// 4. CART & ORDER ACTIONS
// ==========================================================================
window.addToCart = function(productId, qty = 1) {
  // PRD FR-05 & Target Pengguna: Visitor cannot order, must login first
  if (appState.currentRole === 'visitor') {
    showToast("Silakan login sebagai Pembeli terlebih dahulu untuk menambah ke keranjang!", "warning");
    navigateTo('login');
    return;
  }

  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  if (product.stock <= 0) {
    showToast("Stok produk ini sedang habis!", "error");
    return;
  }

  const existing = appState.cart.find(item => item.productId === productId);
  const currentQtyInCart = existing ? existing.quantity : 0;
  
  if (currentQtyInCart + qty > product.stock) {
    showToast(`Stok tidak mencukupi! Tersedia hanya ${product.stock} ${product.unit}.`, "error");
    return;
  }

  if (existing) {
    existing.quantity += qty;
  } else {
    appState.cart.push({ productId, quantity: qty });
  }

  saveState();
  showToast(`"${product.name}" ditambahkan ke keranjang!`, "success");
  render();
};

window.updateCartQty = function(productId, newQty) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  if (newQty <= 0) {
    window.removeFromCart(productId);
    return;
  }

  if (newQty > product.stock) {
    showToast(`Stok maksimal tersedia hanya ${product.stock} ${product.unit}!`, "error");
    return;
  }

  const item = appState.cart.find(i => i.productId === productId);
  if (item) {
    item.quantity = newQty;
    saveState();
    render();
  }
};

window.removeFromCart = function(productId) {
  appState.cart = appState.cart.filter(item => item.productId !== productId);
  saveState();
  showToast("Produk dihapus dari keranjang.", "info");
  render();
};

window.processCheckoutOrder = function(e) {
  e.preventDefault();
  
  const address = document.getElementById('checkout-address').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const notes = document.getElementById('checkout-notes').value.trim();

  if (!address || !phone) {
    showToast("Alamat pengiriman dan nomor kontak wajib diisi!", "error");
    return;
  }

  if (appState.cart.length === 0) {
    showToast("Keranjang belanja kosong!", "error");
    return;
  }

  // Stock check validation before creating order (PRD FR-11 & Aturan Bisnis)
  for (const item of appState.cart) {
    const prod = appState.products.find(p => p.id === item.productId);
    if (!prod || prod.stock < item.quantity) {
      showToast(`Stok untuk produk "${prod ? prod.name : 'Unknown'}" tidak mencukupi! Pesanan dibatalkan.`, "error");
      return;
    }
  }

  // Group items by seller or take primary seller
  const firstProd = appState.products.find(p => p.id === appState.cart[0].productId);
  const sellerId = firstProd ? firstProd.seller_id : 2;
  const storeName = firstProd ? firstProd.store_name : "Toko Bahari Kota Agung";

  const orderItems = [];
  let totalAmount = 0;

  // Deduct stock transactionally and create order item snapshots
  appState.cart.forEach(item => {
    const prod = appState.products.find(p => p.id === item.productId);
    if (prod) {
      prod.stock -= item.quantity; // Deduct stock
      const subtotal = prod.price * item.quantity;
      totalAmount += subtotal;
      orderItems.push({
        product_id: prod.id,
        name: prod.name,
        unit_price: prod.price,
        unit: prod.unit,
        quantity: item.quantity,
        subtotal: subtotal
      });
    }
  });

  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const orderNum = `SF-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}${new Date().getDate().toString().padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrderId = appState.orders.reduce((max, o) => Math.max(max, o.id), 0) + 1;
  const newOrder = {
    id: newOrderId,
    order_number: orderNum,
    buyer_id: 4,
    buyer_name: "Budi Santoso",
    buyer_phone: phone,
    seller_id: sellerId,
    store_name: storeName,
    status: "Menunggu Konfirmasi", // Initial status
    total_amount: totalAmount,
    delivery_address: address,
    notes: notes,
    stock_refunded: false,
    created_at: nowStr,
    items: orderItems,
    history: [
      {
        old_status: null,
        new_status: "Menunggu Konfirmasi",
        changed_by: "Sistem (Pembeli Buat Pesanan)",
        time: nowStr,
        note: "Pesanan berhasil dibuat oleh pembeli."
      }
    ]
  };

  appState.orders.unshift(newOrder);
  appState.cart = []; // Empty cart
  recordLog("CREATE_ORDER", `Pesanan #${orderNum}`, `Total Pesanan: ${formatRupiah(totalAmount)}`);
  saveState();

  // Show Success Modal
  appState.selectedOrderId = newOrder.id;
  appState.currentView = 'checkout_success';
  render();
};

// ==========================================================================
// 5. STATUS TRANSITIONS & CANCELLATION (PRD Section 7 & Design Prompt v2)
// ==========================================================================
const VALID_STATUS_TRANSITIONS = {
  "Menunggu Konfirmasi": ["Dikonfirmasi", "Dibatalkan"],
  "Dikonfirmasi": ["Diproses", "Dibatalkan"],
  "Diproses": ["Dikirim"],
  "Dikirim": ["Selesai"],
  "Selesai": [],
  "Dibatalkan": []
};

window.advanceOrderStatus = function(orderId, newStatus) {
  const order = appState.orders.find(o => o.id === orderId);
  if (!order) return;

  // IDOR & Authorization check: seller only advances status for orders of own store (OWASP A01)
  if (['seller', 'seller_pending'].includes(appState.currentRole)) {
    const currentSeller = appState.users.find(u => u.id === (appState.currentRole === 'seller_pending' ? 3 : 2));
    const currentSellerId = currentSeller ? currentSeller.id : 2;
    if (order.seller_id !== currentSellerId) {
      recordLog("SECURITY_ALERT", `IDOR on Order #${orderId}`, "Percobaan mengubah status pesanan toko lain", "SECURITY_ALERT");
      showToast("Akses Ditolak: Anda hanya dapat memperbarui pesanan milik toko Anda sendiri!", "error");
      return;
    }
  }

  const oldStatus = order.status;
  const allowed = VALID_STATUS_TRANSITIONS[oldStatus] || [];
  if (!allowed.includes(newStatus)) {
    showToast(`Transisi status dari "${oldStatus}" ke "${newStatus}" tidak valid sesuai alur PRD!`, "error");
    return;
  }

  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  let changedBy = "Penjual (Slamet Riyadi)";
  if (appState.currentRole === 'admin') changedBy = "Admin (Rifki Banda Wijaya)";
  if (appState.currentRole === 'buyer') changedBy = "Pembeli (Budi Santoso)";
  if (appState.currentRole === 'seller_pending') changedBy = "Penjual (Hasanudin)";

  order.status = newStatus;
  order.history.push({
    old_status: oldStatus,
    new_status: newStatus,
    changed_by: changedBy,
    time: nowStr,
    note: `Status diperbarui dari "${oldStatus}" menjadi "${newStatus}"`
  });

  recordLog("UPDATE_ORDER_STATUS", `Pesanan #${order.order_number}`, `Status: ${newStatus}`);
  saveState();
  showToast(`Status pesanan #${order.order_number} berhasil diubah ke: ${newStatus}`, "success");
  render();
};

window.openCancelOrderModal = function(orderId) {
  const order = appState.orders.find(o => o.id === orderId);
  if (!order) return;

  // Rule: Pembatalan hanya jika status mengizinkan (Menunggu Konfirmasi)
  if (appState.currentRole === 'buyer' && order.status !== "Menunggu Konfirmasi") {
    showToast("Pesanan yang sudah diproses atau dikirim tidak dapat dibatalkan langsung!", "error");
    return;
  }

  if (order.status === "Dibatalkan" || order.status === "Selesai") {
    showToast(`Pesanan berstatus ${order.status} tidak dapat dibatalkan!`, "error");
    return;
  }

  const modalHtml = `
    <div class="modal-backdrop show" id="cancelModalBackdrop">
      <div class="modal-dialog">
        <div class="modal-header">
          <h4 class="modal-title">Konfirmasi Pembatalan Pesanan</h4>
          <button class="modal-close-btn" onclick="closeModal('cancelModalBackdrop')">&times;</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.9rem; margin-bottom: 12px;">
            Apakah Anda yakin ingin membatalkan pesanan <strong>#${order.order_number}</strong>?
          </p>
          <div class="mvp-notice-banner warning" style="margin-bottom: 14px;">
            <div class="notice-icon">⚠️</div>
            <div class="notice-text">
              <h5>Pengembalian Stok Otomatis</h5>
              <p>Stok produk sebanyak item pesanan akan dikembalikan ke katalog secara otomatis.</p>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Alasan Pembatalan <span style="color:red">*</span></label>
            <textarea id="cancelReasonInput" class="form-control" rows="3" placeholder="Tuliskan alasan pembatalan..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeModal('cancelModalBackdrop')">Kembali</button>
          <button class="btn btn-danger" onclick="executeCancelOrder(${orderId})">Batalkan Pesanan</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modal-container').innerHTML = modalHtml;
};

window.executeCancelOrder = function(orderId) {
  const reasonInput = document.getElementById('cancelReasonInput');
  const reason = reasonInput ? reasonInput.value.trim() : "";
  if (!reason) {
    showToast("Alasan pembatalan wajib diisi!", "error");
    return;
  }

  const order = appState.orders.find(o => o.id === orderId);
  if (!order) return;

  // PRD Section 7: Enforce single stock refund & check status
  if (order.status === "Dibatalkan") {
    showToast("Pesanan ini sudah dibatalkan sebelumnya!", "error");
    closeModal('cancelModalBackdrop');
    return;
  }
  if (order.status === "Selesai") {
    showToast("Pesanan yang sudah selesai tidak dapat dibatalkan!", "error");
    closeModal('cancelModalBackdrop');
    return;
  }

  const oldStatus = order.status;
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  let changedBy = "Pembeli (Budi Santoso)";
  if (appState.currentRole === 'seller' || appState.currentRole === 'seller_pending') changedBy = "Penjual";
  if (appState.currentRole === 'admin') changedBy = "Admin (Rifki Banda Wijaya)";

  // Single stock refund rule (PRD Section 7): Kembalikan stok satu kali saja
  if (!order.stock_refunded) {
    order.items.forEach(item => {
      const prod = appState.products.find(p => p.id === item.product_id);
      if (prod) {
        prod.stock += item.quantity; // Restore stock
      }
    });
    order.stock_refunded = true;
  }

  order.status = "Dibatalkan";
  order.history.push({
    old_status: oldStatus,
    new_status: "Dibatalkan",
    changed_by: changedBy,
    time: nowStr,
    note: `Pesanan dibatalkan. Alasan: ${reason}. Stok berhasil dikembalikan.`
  });

  recordLog("CANCEL_ORDER", `Pesanan #${order.order_number}`, `Alasan: ${reason} (Stok dikembalikan)`);
  saveState();
  closeModal('cancelModalBackdrop');
  showToast(`Pesanan #${order.order_number} berhasil dibatalkan dan stok dikembalikan.`, "info");
  render();
};

window.closeModal = function(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.remove();
};

// ==========================================================================
// 6. SELLER PRODUCT & STOCK CRUD ACTIONS
// ==========================================================================
window.openAddProductModal = function() {
  const currentSeller = appState.users.find(u => u.id === (appState.currentRole === 'seller_pending' ? 3 : 2));
  const isPending = currentSeller ? currentSeller.verification_status !== 'Disetujui' : false;

  // Unverified seller check conforming to PRD Aturan Bisnis 1
  if (isPending) {
    showToast("Akun Anda belum diverifikasi admin. Anda belum dapat menerbitkan produk baru!", "warning");
    return;
  }

  const modalHtml = `
    <div class="modal-backdrop show" id="productModal">
      <div class="modal-dialog">
        <div class="modal-header">
          <h4 class="modal-title">Tambah Produk Hasil Perikanan</h4>
          <button class="modal-close-btn" onclick="closeModal('productModal')">&times;</button>
        </div>
        <form onsubmit="handleSaveProduct(event)">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Nama Produk <span style="color:red">*</span></label>
              <input type="text" id="prod-name" class="form-control" placeholder="Contoh: Ikan Tongkol Segar Kota Agung" required>
            </div>
            <div class="form-group">
              <label class="form-label">Kategori <span style="color:red">*</span></label>
              <select id="prod-cat" class="form-control" required>
                ${appState.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Harga Satuan (Rp) <span style="color:red">*</span></label>
                <input type="number" id="prod-price" class="form-control" placeholder="35000" min="1000" required>
              </div>
              <div class="form-group">
                <label class="form-label">Satuan Jual <span style="color:red">*</span></label>
                <select id="prod-unit" class="form-control" required>
                  <option value="kg">kg (Kilogram)</option>
                  <option value="ekor">ekor</option>
                  <option value="paket">paket</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Stok Awal <span style="color:red">*</span> (Tidak boleh negatif)</label>
              <input type="number" id="prod-stock" class="form-control" placeholder="25" min="0" required>
            </div>
            <div class="form-group">
              <label class="form-label">Deskripsi & Kondisi Ikan <span style="color:red">*</span></label>
              <textarea id="prod-desc" class="form-control" rows="3" placeholder="Deskripsikan kesegaran, daerah tangkapan, ukuran, dan penyimpanan..." required></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Pilih Foto Produk Awal</label>
              <select id="prod-img" class="form-control">
                <option value="assets/prod-tongkol.svg">Ikan Tongkol Segar (Foto 1)</option>
                <option value="assets/prod-udang.svg">Udang Vaname (Foto 2)</option>
                <option value="assets/prod-kerapu.svg">Ikan Kerapu Cantik (Foto 3)</option>
                <option value="assets/prod-cumi.svg">Cumi-cumi Sero (Foto 4)</option>
                <option value="assets/prod-kepiting.svg">Kepiting Bakau (Foto 5)</option>
                <option value="assets/prod-tenggiri.svg">Tenggiri Giling (Foto 6)</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeModal('productModal')">Batal</button>
            <button type="submit" class="btn btn-primary">Terbitkan Produk</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.getElementById('modal-container').innerHTML = modalHtml;
};

window.handleSaveProduct = function(e) {
  e.preventDefault();
  const name = document.getElementById('prod-name').value.trim();
  const catId = parseInt(document.getElementById('prod-cat').value);
  const price = parseInt(document.getElementById('prod-price').value);
  const unit = document.getElementById('prod-unit').value;
  const stock = parseInt(document.getElementById('prod-stock').value);
  const desc = document.getElementById('prod-desc').value.trim();
  const img = document.getElementById('prod-img').value;

  if (isNaN(stock) || stock < 0) {
    showToast("Stok produk harus berupa angka bulat dan tidak boleh bernilai negatif!", "error");
    return;
  }
  if (isNaN(price) || price < 1000) {
    showToast("Harga satuan minimal Rp 1.000!", "error");
    return;
  }

  const category = appState.categories.find(c => c.id === catId);
  const currentSeller = appState.users.find(u => u.id === (appState.currentRole === 'seller_pending' ? 3 : 2));
  const sellerId = currentSeller ? currentSeller.id : 2;
  const storeName = currentSeller ? currentSeller.store_name : "Toko Bahari Kota Agung";
  const storeLocation = currentSeller ? (currentSeller.store_address || "Kota Agung, Tanggamus") : "Kota Agung, Tanggamus";

  const newProdId = appState.products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const newProd = {
    id: newProdId,
    seller_id: sellerId,
    store_name: storeName,
    store_location: storeLocation,
    category_id: catId,
    category_slug: category ? category.slug : "ikan",
    name: name,
    description: desc,
    price: price,
    unit: unit,
    stock: stock,
    image_url: img,
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  appState.products.unshift(newProd);
  recordLog("ADD_PRODUCT", `Produk "${name}"`, `Stok: ${stock} ${unit}, Harga: ${formatRupiah(price)}`);
  saveState();
  closeModal('productModal');
  showToast(`Produk "${name}" berhasil diterbitkan!`, "success");
  render();
};

window.openEditProductModal = function(productId) {
  const prod = appState.products.find(p => p.id === productId);
  if (!prod) return;

  const modalHtml = `
    <div class="modal-backdrop show" id="editProductModal">
      <div class="modal-dialog">
        <div class="modal-header">
          <h4 class="modal-title">Edit Produk: ${prod.name}</h4>
          <button class="modal-close-btn" onclick="closeModal('editProductModal')">&times;</button>
        </div>
        <form onsubmit="handleUpdateProduct(event, ${prod.id})">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Nama Produk <span style="color:red">*</span></label>
              <input type="text" id="edit-prod-name" class="form-control" value="${prod.name}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Kategori <span style="color:red">*</span></label>
              <select id="edit-prod-cat" class="form-control" required>
                ${appState.categories.map(c => `<option value="${c.id}" ${c.id === prod.category_id ? 'selected' : ''}>${c.name}</option>`).join('')}
              </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label class="form-label">Harga Satuan (Rp) <span style="color:red">*</span></label>
                <input type="number" id="edit-prod-price" class="form-control" value="${prod.price}" min="1000" required>
              </div>
              <div class="form-group">
                <label class="form-label">Satuan Jual <span style="color:red">*</span></label>
                <select id="edit-prod-unit" class="form-control" required>
                  <option value="kg" ${prod.unit === 'kg' ? 'selected' : ''}>kg (Kilogram)</option>
                  <option value="ekor" ${prod.unit === 'ekor' ? 'selected' : ''}>ekor</option>
                  <option value="paket" ${prod.unit === 'paket' ? 'selected' : ''}>paket</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Stok Tersedia <span style="color:red">*</span> (Tidak boleh negatif)</label>
              <input type="number" id="edit-prod-stock" class="form-control" value="${prod.stock}" min="0" required>
            </div>
            <div class="form-group">
              <label class="form-label">Deskripsi & Kondisi Ikan <span style="color:red">*</span></label>
              <textarea id="edit-prod-desc" class="form-control" rows="3" required>${prod.description}</textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeModal('editProductModal')">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.getElementById('modal-container').innerHTML = modalHtml;
};

window.handleUpdateProduct = function(e, productId) {
  e.preventDefault();
  const prod = appState.products.find(p => p.id === productId);
  if (!prod) return;

  // IDOR & Authorization check: seller only edits own products (OWASP A01)
  if (['seller', 'seller_pending'].includes(appState.currentRole)) {
    const currentSeller = appState.users.find(u => u.id === (appState.currentRole === 'seller_pending' ? 3 : 2));
    const currentSellerId = currentSeller ? currentSeller.id : 2;
    if (prod.seller_id !== currentSellerId) {
      recordLog("SECURITY_ALERT", `IDOR on Product #${productId}`, "Percobaan manipulasi produk toko lain", "SECURITY_ALERT");
      showToast("Akses Ditolak: Anda tidak dapat mengubah data produk toko lain!", "error");
      return;
    }
  }

  const name = document.getElementById('edit-prod-name').value.trim();
  const catId = parseInt(document.getElementById('edit-prod-cat').value);
  const price = parseInt(document.getElementById('edit-prod-price').value);
  const unit = document.getElementById('edit-prod-unit').value;
  const stock = parseInt(document.getElementById('edit-prod-stock').value);
  const desc = document.getElementById('edit-prod-desc').value.trim();

  if (isNaN(stock) || stock < 0) {
    showToast("Stok tidak boleh bernilai negatif!", "error");
    return;
  }
  if (isNaN(price) || price < 1000) {
    showToast("Harga satuan minimal Rp 1.000!", "error");
    return;
  }

  const category = appState.categories.find(c => c.id === catId);

  prod.name = name;
  prod.category_id = catId;
  prod.category_slug = category ? category.slug : prod.category_slug;
  prod.price = price;
  prod.unit = unit;
  prod.stock = stock;
  prod.description = desc;

  recordLog("UPDATE_PRODUCT", `Produk "${name}"`, `Perubahan data produk (Harga: ${formatRupiah(price)}, Stok: ${stock} ${unit})`);
  saveState();
  closeModal('editProductModal');
  showToast(`Produk "${name}" berhasil diperbarui!`, "success");
  render();
};

window.toggleProductActive = function(productId) {
  const prod = appState.products.find(p => p.id === productId);
  if (!prod) return;

  prod.is_active = !prod.is_active;
  recordLog("TOGGLE_PRODUCT_STATUS", prod.name, `Status diubah menjadi: ${prod.is_active ? 'Aktif' : 'Nonaktif'}`);
  saveState();
  showToast(`Status produk "${prod.name}" diubah menjadi ${prod.is_active ? 'Aktif' : 'Nonaktif'}`, "info");
  render();
};

window.quickUpdateStock = function(productId, delta) {
  const prod = appState.products.find(p => p.id === productId);
  if (!prod) return;

  // IDOR & Scope check: seller only updates stock of own products (OWASP A01)
  if (['seller', 'seller_pending'].includes(appState.currentRole)) {
    const currentSeller = appState.users.find(u => u.id === (appState.currentRole === 'seller_pending' ? 3 : 2));
    const currentSellerId = currentSeller ? currentSeller.id : 2;
    if (prod.seller_id !== currentSellerId) {
      recordLog("SECURITY_ALERT", `IDOR on Stock #${productId}`, "Percobaan manipulasi stok produk toko lain", "SECURITY_ALERT");
      showToast("Akses Ditolak: Anda hanya memiliki hak mengubah stok produk toko sendiri!", "error");
      return;
    }
  }

  const newStock = prod.stock + delta;
  if (newStock < 0) {
    showToast("Stok tidak boleh bernilai negatif!", "error");
    return;
  }

  prod.stock = newStock;
  recordLog("UPDATE_STOCK", `Produk "${prod.name}"`, `Stok diubah menjadi ${newStock} ${prod.unit} (${delta > 0 ? '+' : ''}${delta})`);
  saveState();
  showToast(`Stok "${prod.name}" diperbarui: ${prod.stock} ${prod.unit}`, "success");
  render();
};

// ==========================================================================
// 7. ADMIN VERIFICATION & USER MANAGEMENT
// ==========================================================================
window.verifySeller = function(userId, status) {
  const user = appState.users.find(u => u.id === userId);
  if (!user) return;

  if (status === "Ditolak") {
    const reason = prompt("Masukkan alasan penolakan verifikasi toko:", "Dokumen SKU / KTP domisili Tanggamus tidak terbaca jelas.");
    if (reason === null) return;
    user.verification_status = "Ditolak";
    recordLog("REJECT_SELLER", user.store_name, `Alasan: ${reason}`);
    showToast(`Pendaftaran toko "${user.store_name}" ditolak.`, "warning");
  } else {
    user.verification_status = "Disetujui";
    recordLog("APPROVE_SELLER", user.store_name, "Toko berhasil diverifikasi");
    showToast(`Toko "${user.store_name}" telah disetujui dan diverifikasi!`, "success");
  }

  saveState();
  render();
};

window.toggleUserActive = function(userId) {
  const user = appState.users.find(u => u.id === userId);
  if (!user) return;

  user.is_active = !user.is_active;
  recordLog("TOGGLE_USER_ACTIVE", user.name, `Status: ${user.is_active ? 'Aktif' : 'Dinonaktifkan'}`);
  saveState();
  showToast(`Akun "${user.name}" sekarang ${user.is_active ? 'Aktif' : 'Dinonaktifkan'}`, "info");
  render();
};


// Profile & Category Handlers
window.handleUpdateBuyerProfile = function(e) {
  e.preventDefault();
  const name = document.getElementById('buyer-profile-name').value.trim();
  const phone = document.getElementById('buyer-profile-phone').value.trim();
  const address = document.getElementById('buyer-profile-address').value.trim();

  const buyer = appState.users.find(u => u.id === 4);
  if (buyer) {
    buyer.name = name;
    buyer.phone = phone;
    buyer.address = address;
    recordLog("UPDATE_PROFILE", name, "Pembaruan profil pembeli");
    saveState();
    showToast("Data profil pembeli berhasil diperbarui!", "success");
    render();
  }
};

window.handleUpdateSellerProfile = function(e) {
  e.preventDefault();
  const currentSeller = appState.users.find(u => u.id === (appState.currentRole === 'seller_pending' ? 3 : 2));
  if (currentSeller) {
    const storeName = document.getElementById('seller-profile-store').value.trim();
    const ownerName = document.getElementById('seller-profile-name').value.trim();
    const address = document.getElementById('seller-profile-address').value.trim();
    const phone = document.getElementById('seller-profile-phone').value.trim();
    const desc = document.getElementById('seller-profile-desc').value.trim();

    currentSeller.store_name = storeName;
    currentSeller.name = ownerName;
    currentSeller.store_address = address;
    currentSeller.phone = phone;
    currentSeller.store_desc = desc;

    recordLog("UPDATE_STORE_PROFILE", storeName, "Pembaruan profil toko nelayan");
    saveState();
    showToast("Data profil toko nelayan berhasil disimpan!", "success");
    render();
  }
};

window.openAddCategoryModal = function() {
  const modalHtml = `
    <div class="modal-backdrop show" id="categoryModal">
      <div class="modal-dialog">
        <div class="modal-header">
          <h4 class="modal-title">Tambah Kategori Hasil Perikanan</h4>
          <button class="modal-close-btn" onclick="closeModal('categoryModal')">&times;</button>
        </div>
        <form onsubmit="handleSaveCategory(event)">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Nama Kategori <span style="color:red">*</span></label>
              <input type="text" id="cat-name" class="form-control" placeholder="Contoh: Rumput Laut & Alga" required>
            </div>
            <div class="form-group">
              <label class="form-label">Slug URL <span style="color:red">*</span></label>
              <input type="text" id="cat-slug" class="form-control" placeholder="rumput-laut" required>
            </div>
            <div class="form-group">
              <label class="form-label">Deskripsi Komoditas <span style="color:red">*</span></label>
              <textarea id="cat-desc" class="form-control" rows="2" placeholder="Penjelasan komoditas perikanan tangkap/budidaya..." required></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeModal('categoryModal')">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Kategori</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.getElementById('modal-container').innerHTML = modalHtml;
};

window.handleSaveCategory = function(e) {
  e.preventDefault();
  const name = document.getElementById('cat-name').value.trim();
  const slug = document.getElementById('cat-slug').value.trim().toLowerCase();
  const desc = document.getElementById('cat-desc').value.trim();

  const newId = appState.categories.reduce((max, c) => Math.max(max, c.id), 0) + 1;
  const newCat = {
    id: newId,
    slug: slug,
    name: name,
    desc: desc,
    icon: "assets/cat-ikan.svg",
    count: 0,
    is_active: true
  };

  appState.categories.push(newCat);
  recordLog("ADD_CATEGORY", name, `Penambahan kategori baru: ${slug}`);
  saveState();
  closeModal('categoryModal');
  showToast(`Kategori "${name}" berhasil ditambahkan!`, "success");
  render();
};

window.filterAdminReports = function(period, status) {
  if (period !== undefined) window.adminReportPeriod = period;
  if (status !== undefined) window.adminReportStatus = status;
  render();
};

// ==========================================================================
// 8. RENDERER DISPATCHER
// ==========================================================================
function render() {
  const appContainer = document.getElementById('app-root');
  if (!appContainer) return;

  // Update simulator buttons state
  document.querySelectorAll('.btn-role').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === appState.currentRole);
  });

  // Calculate cart count
  const cartCount = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.getElementById('global-cart-badge');
  if (cartBadge) {
    cartBadge.textContent = cartCount;
    cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
  }

  // Update header navigation active states
  document.querySelectorAll('.header-nav .nav-link').forEach(link => {
    const text = link.textContent.trim().toLowerCase();
    if (text === 'beranda') link.classList.toggle('active', appState.currentView === 'home');
    if (text.includes('katalog')) link.classList.toggle('active', appState.currentView === 'catalog');
  });

  // Update header user widget
  const userWidget = document.getElementById('header-user-widget');
  if (userWidget) {
    if (appState.currentRole === 'visitor') {
      userWidget.innerHTML = `
        <button class="btn btn-primary btn-sm" onclick="navigateTo('login')">
          Masuk / Daftar
        </button>
      `;
    } else if (appState.currentRole === 'buyer') {
      userWidget.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn btn-outline btn-sm" onclick="navigateTo('buyer_dashboard')">Pesanan Saya</button>
          <div class="user-profile-menu" onclick="navigateTo('buyer_dashboard')" title="Buka Dashboard Pembeli">
            <div class="user-avatar" style="background: var(--color-primary);">BS</div>
            <div class="user-info-text">
              <span class="user-name">Budi Santoso</span>
              <span class="user-role-badge">Pembeli</span>
            </div>
          </div>
        </div>
      `;
    } else if (appState.currentRole === 'seller') {
      userWidget.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn btn-primary btn-sm" onclick="navigateTo('seller_dashboard')">Panel Nelayan</button>
          <div class="user-profile-menu" onclick="navigateTo('seller_dashboard')" title="Buka Dashboard Penjual">
            <div class="user-avatar" style="background: var(--color-accent);">SR</div>
            <div class="user-info-text">
              <span class="user-name">Toko Bahari</span>
              <span class="user-role-badge">Penjual</span>
            </div>
          </div>
        </div>
      `;
    } else if (appState.currentRole === 'seller_pending') {
      userWidget.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn btn-outline btn-sm" onclick="navigateTo('seller_dashboard')">Panel Nelayan</button>
          <div class="user-profile-menu" onclick="navigateTo('seller_dashboard')" title="Status: Menunggu Verifikasi">
            <div class="user-avatar" style="background: var(--color-warning);">HS</div>
            <div class="user-info-text">
              <span class="user-name">Kelompok Semaka</span>
              <span class="user-role-badge" style="color: var(--color-warning);">Pending</span>
            </div>
          </div>
        </div>
      `;
    } else if (appState.currentRole === 'admin') {
      userWidget.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn btn-danger btn-sm" onclick="navigateTo('admin_dashboard')">Panel Admin</button>
          <div class="user-profile-menu" onclick="navigateTo('admin_dashboard')" title="Buka Dashboard Admin">
            <div class="user-avatar" style="background: #7c3aed;">RB</div>
            <div class="user-info-text">
              <span class="user-name">Rifki Banda</span>
              <span class="user-role-badge" style="color: #7c3aed;">Admin Pemda</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Render view
  let viewHtml = "";
  switch(appState.currentView) {
    case 'home':
      viewHtml = renderHomeView();
      break;
    case 'catalog':
      viewHtml = renderCatalogView();
      break;
    case 'product_detail':
      viewHtml = renderProductDetailView();
      break;
    case 'cart':
      viewHtml = renderCartView();
      break;
    case 'checkout':
      viewHtml = renderCheckoutView();
      break;
    case 'checkout_success':
      viewHtml = renderCheckoutSuccessView();
      break;
    case 'buyer_dashboard':
      viewHtml = renderBuyerDashboard();
      break;
    case 'seller_dashboard':
      viewHtml = renderSellerDashboard();
      break;
    case 'admin_dashboard':
      viewHtml = renderAdminDashboard();
      break;
    case 'login':
      viewHtml = renderLoginView();
      break;
    case 'register':
      viewHtml = renderRegisterView();
      break;
    case '403':
      viewHtml = render403View();
      break;
    default:
      viewHtml = renderHomeView();
  }

  appContainer.innerHTML = viewHtml;
}

// ==========================================================================
// 9. VIEW TEMPLATES
// ==========================================================================

// --- VIEW: HOME (BERANDA) ---
function renderHomeView() {
  const featured = appState.products.filter(p => p.is_active).slice(0, 4);

  return `
    <!-- Hero Section with Tanggamus Maritime Theme -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span>⚓ Pesisir Teluk Semaka & Kota Agung</span>
          </div>
          <h1 class="hero-title">
            Hasil Laut Segar Tanggamus, <span>Langsung dari Nelayan</span>
          </h1>
          <p class="hero-description">
            Platform resmi pemasaran dan pemesanan hasil perikanan Kabupaten Tanggamus. Dapatkan tangkapan segar berkualitas prima langsung dari nelayan terverifikasi dengan stok dan harga transparan.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="navigateTo('catalog')">
              Jelajahi Katalog Ikan
            </button>
            <button class="btn btn-outline btn-lg" style="color: #ffffff; border-color: rgba(255,255,255,0.4);" onclick="navigateTo('catalog', { category: 'ikan' })">
              Tangkapan Hari Ini
            </button>
          </div>

          <div class="hero-stats">
            <div class="hero-stat-item">
              <h4>5+</h4>
              <p>Pangkalan Nelayan</p>
            </div>
            <div class="hero-stat-item">
              <h4>100%</h4>
              <p>Segar & Alami</p>
            </div>
            <div class="hero-stat-item">
              <h4>0%</h4>
              <p>Biaya Perantara</p>
            </div>
            <div class="hero-stat-item">
              <h4>12+</h4>
              <p>Kecamatan Terlayani</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container" style="padding-top: 48px;">
      <!-- Category Grid -->
      <div class="section-heading">
        <div>
          <h2 class="section-title">Kategori Hasil Laut</h2>
          <p class="section-subtitle">Pilih aneka hasil perikanan tangkap dan budidaya Tanggamus</p>
        </div>
        <a href="javascript:void(0)" onclick="navigateTo('catalog')" class="btn btn-outline btn-sm">Lihat Semua Kategori &rarr;</a>
      </div>

      <div class="category-grid">
        ${appState.categories.map(c => `
          <div class="category-card" onclick="navigateTo('catalog', { category: '${c.slug}' })">
            <img src="${c.icon}" alt="${c.name}" class="category-icon">
            <div class="category-name">${c.name}</div>
            <div class="category-count">${c.desc.substring(0, 32)}...</div>
          </div>
        `).join('')}
      </div>

      <!-- Featured Products Grid -->
      <div class="section-heading">
        <div>
          <h2 class="section-title">Produk Unggulan Hari Ini</h2>
          <p class="section-subtitle">Tangkapan segar terbaik yang siap dipesan sekarang</p>
        </div>
        <button class="btn btn-outline btn-sm" onclick="navigateTo('catalog')">Buka Katalog Lengkap</button>
      </div>

      <div class="products-grid">
        ${featured.map(prod => renderProductCard(prod)).join('')}
      </div>

      <!-- How it Works Section -->
      <div class="how-it-works-box">
        <h2 class="section-title" style="margin-bottom: 8px;">Cara Mudah Pemesanan di Smart Fishery</h2>
        <p class="section-subtitle">Sistem katalog transparan mempertemukan penjual dan pembeli secara langsung</p>
        
        <div class="steps-grid">
          <div class="step-item">
            <div class="step-num">1</div>
            <h4>Cari & Pilih Hasil Laut</h4>
            <p>Jelajahi katalog aneka ikan, udang, cumi, dan kepiting segar dengan kepastian stok harian.</p>
          </div>
          <div class="step-item">
            <div class="step-num">2</div>
            <h4>Buat Pesanan Langsung</h4>
            <p>Tentukan jumlah pesanan sesuai kebutuhan Anda tanpa perantara berbelit.</p>
          </div>
          <div class="step-item">
            <div class="step-num">3</div>
            <h4>Pantau Status Transparan</h4>
            <p>Lacak pemrosesan pesanan dari konfirmasi nelayan hingga pengiriman ke alamat Anda.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- PRODUCT CARD HELPER ---
function renderProductCard(prod) {
  const isOutOfStock = prod.stock <= 0;
  return `
    <div class="product-card">
      <div class="product-thumb-wrap">
        <img src="${prod.image_url}" alt="${prod.name}">
        <div class="product-badge-overlay">
          ${isOutOfStock 
            ? `<span class="status-badge badge-dibatalkan">Stok Habis</span>` 
            : `<span class="status-badge badge-selesai">Tersedia ${prod.stock} ${prod.unit}</span>`}
        </div>
      </div>
      <div class="product-info-body">
        <div class="product-store-meta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>${prod.store_name}</span>
        </div>
        <a href="javascript:void(0)" onclick="navigateTo('product_detail', { productId: ${prod.id} })" class="product-name-link">
          ${prod.name}
        </a>
        <div class="product-price-row">
          <div>
            <div class="product-price-val">${formatRupiah(prod.price)}</div>
            <div class="product-unit-val">per ${prod.unit}</div>
          </div>
          <div class="product-stock-tag ${isOutOfStock ? 'stock-empty' : 'stock-available'}">
            ${isOutOfStock ? 'Stok Habis' : 'Stok: ' + prod.stock + ' ' + prod.unit}
          </div>
        </div>
      </div>
      <div class="product-card-footer">
        <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="navigateTo('product_detail', { productId: ${prod.id} })">
          Lihat Detail
        </button>
        <button class="btn btn-primary btn-sm" ${isOutOfStock ? 'disabled' : ''} onclick="addToCart(${prod.id}, 1)">
          + Keranjang
        </button>
      </div>
    </div>
  `;
}

// --- VIEW: CATALOG (KATALOG PRODUK) ---
function renderCatalogView() {
  const searchQuery = (document.getElementById('catalog-search-input') ? document.getElementById('catalog-search-input').value : "").toLowerCase();
  const selectedCat = window.catalogFilterCat || "all";
  const sortBy = window.catalogSortBy || "default";

  let filtered = appState.products.filter(p => p.is_active);

  if (selectedCat !== "all") {
    filtered = filtered.filter(p => p.category_slug === selectedCat);
  }

  if (searchQuery) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery));
  }

  if (sortBy === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "stock_desc") {
    filtered.sort((a, b) => b.stock - a.stock);
  }

  return `
    <div class="container">
      <div class="catalog-layout">
        <!-- Sidebar Filter -->
        <aside class="filter-sidebar">
          <div class="filter-group">
            <div class="filter-title">Kategori Hasil Laut</div>
            <div class="filter-options">
              <label class="filter-label">
                <input type="radio" name="catFilter" value="all" ${selectedCat === 'all' ? 'checked' : ''} onchange="filterCatalogCategory('all')">
                Semua Kategori (${appState.products.length})
              </label>
              ${appState.categories.map(c => `
                <label class="filter-label">
                  <input type="radio" name="catFilter" value="${c.slug}" ${selectedCat === c.slug ? 'checked' : ''} onchange="filterCatalogCategory('${c.slug}')">
                  ${c.name}
                </label>
              `).join('')}
            </div>
          </div>

          <div class="filter-group">
            <div class="filter-title">Lokasi Pesisir Tanggamus</div>
            <div class="filter-options">
              <label class="filter-label"><input type="checkbox" checked disabled> TPI Kota Agung</label>
              <label class="filter-label"><input type="checkbox" checked disabled> Teluk Semaka</label>
              <label class="filter-label"><input type="checkbox" checked disabled> Limau & Cukuh Balak</label>
            </div>
          </div>

          <button class="btn btn-outline btn-sm" style="width: 100%; margin-top: 10px;" onclick="resetCatalogFilters()">
            Reset Filter
          </button>
        </aside>

        <!-- Main Catalog Products Area -->
        <main>
          <div class="catalog-header-bar">
            <div class="catalog-count-text">
              Menampilkan <strong>${filtered.length}</strong> produk hasil perikanan
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">Urutkan:</span>
              <select class="catalog-sort-select" onchange="sortCatalog(this.value)">
                <option value="default" ${sortBy === 'default' ? 'selected' : ''}>Terbaru</option>
                <option value="price_asc" ${sortBy === 'price_asc' ? 'selected' : ''}>Harga Terendah</option>
                <option value="price_desc" ${sortBy === 'price_desc' ? 'selected' : ''}>Harga Tertinggi</option>
                <option value="stock_desc" ${sortBy === 'stock_desc' ? 'selected' : ''}>Stok Terbanyak</option>
              </select>
            </div>
          </div>

          ${filtered.length === 0 ? `
            <div class="empty-state">
              <div class="empty-icon">🐟</div>
              <h3>Produk Tidak Ditemukan</h3>
              <p>Tidak ada produk perikanan yang sesuai dengan kata kunci atau filter yang Anda pilih.</p>
              <button class="btn btn-primary btn-sm" onclick="resetCatalogFilters()">Tampilkan Semua Produk</button>
            </div>
          ` : `
            <div class="products-grid">
              ${filtered.map(p => renderProductCard(p)).join('')}
            </div>
          `}
        </main>
      </div>
    </div>
  `;
}

window.filterCatalogCategory = function(catSlug) {
  window.catalogFilterCat = catSlug;
  render();
};
window.sortCatalog = function(sortBy) {
  window.catalogSortBy = sortBy;
  render();
};
window.resetCatalogFilters = function() {
  window.catalogFilterCat = "all";
  window.catalogSortBy = "default";
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) searchInput.value = "";
  render();
};

// --- VIEW: PRODUCT DETAIL (DETAIL PRODUK) ---
function renderProductDetailView() {
  const prod = appState.products.find(p => p.id === appState.selectedProductId) || appState.products[0];
  const isOutOfStock = prod.stock <= 0;

  return `
    <div class="container">
      <div style="padding: 16px 0; font-size: 0.85rem; color: var(--text-muted);">
        <a href="javascript:void(0)" onclick="navigateTo('home')">Beranda</a> &rsaquo; 
        <a href="javascript:void(0)" onclick="navigateTo('catalog')">Katalog</a> &rsaquo; 
        <span style="color: var(--color-navy); font-weight: 600;">${prod.name}</span>
      </div>

      <div class="product-detail-wrapper">
        <div class="product-detail-grid">
          <!-- Left: Media -->
          <div class="detail-media-box">
            <img src="${prod.image_url}" alt="${prod.name}">
          </div>

          <!-- Right: Details & Order CTA -->
          <div class="detail-info-box">
            <div style="margin-bottom: 8px;">
              <span class="status-badge badge-dikonfirmasi">${prod.category_slug.toUpperCase()}</span>
            </div>
            <h1 class="detail-title">${prod.name}</h1>
            
            <div class="detail-price-box">
              <div class="detail-price-number">${formatRupiah(prod.price)}</div>
              <div class="detail-unit-text">/ ${prod.unit}</div>
            </div>

            <!-- Store Details Card -->
            <div class="detail-store-card">
              <div class="store-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div class="store-details">
                <h4>
                  ${prod.store_name}
                  <span class="badge-verified">✓ Terverifikasi Pemkab</span>
                </h4>
                <p>📍 ${prod.store_location} | Teluk Semaka, Tanggamus</p>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-navy); margin-bottom: 6px;">Deskripsi Produk</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">${prod.description}</p>
            </div>

            <div style="margin-bottom: 16px;">
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-navy);">Ketersediaan Stok: </span>
              <strong style="color: ${isOutOfStock ? 'var(--color-danger)' : 'var(--color-accent-dark)'};">
                ${isOutOfStock ? 'Stok Habis' : prod.stock + ' ' + prod.unit + ' Siap Dipesan'}
              </strong>
            </div>

            <!-- Quantity & Actions -->
            <div class="qty-control-box">
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-navy);">Jumlah:</span>
              <div class="qty-stepper">
                <button class="qty-btn" onclick="stepDetailQty(-1)" ${isOutOfStock ? 'disabled' : ''}>-</button>
                <input type="number" id="detail-qty-input" class="qty-input" value="1" min="1" max="${prod.stock}" ${isOutOfStock ? 'disabled' : ''}>
                <button class="qty-btn" onclick="stepDetailQty(1)" ${isOutOfStock ? 'disabled' : ''}>+</button>
              </div>
              <span style="font-size: 0.85rem; color: var(--text-muted);">${prod.unit}</span>
            </div>

            <div id="qty-error-msg" class="form-text-error" style="display: none; margin-bottom: 12px;"></div>

            <div class="detail-cta-row">
              <button class="btn btn-primary btn-lg" style="flex: 1;" ${isOutOfStock ? 'disabled' : ''} onclick="handleDetailAddToCart(${prod.id})">
                + Tambah ke Keranjang
              </button>
              <button class="btn btn-outline btn-lg" onclick="navigateTo('catalog')">
                Kembali ke Katalog
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.stepDetailQty = function(delta) {
  const input = document.getElementById('detail-qty-input');
  if (!input) return;
  let val = parseInt(input.value) || 1;
  const max = parseInt(input.max) || 999;
  val = Math.max(1, Math.min(max, val + delta));
  input.value = val;
};

window.handleDetailAddToCart = function(productId) {
  const input = document.getElementById('detail-qty-input');
  const qty = parseInt(input.value) || 1;
  addToCart(productId, qty);
};

// --- VIEW: CART (KERANJANG BELANJA) ---
function renderCartView() {
  if (appState.currentRole === 'visitor') {
    return `
      <div class="container" style="padding: 60px 20px;">
        <div class="empty-state">
          <div class="empty-icon">🔒</div>
          <h3>Silakan Masuk Terlebih Dahulu</h3>
          <p>Anda perlu login sebagai Pembeli untuk melihat dan mengelola keranjang belanja.</p>
          <button class="btn btn-primary" onclick="navigateTo('login')">Masuk Sekarang</button>
        </div>
      </div>
    `;
  }

  const cartDetails = appState.cart.map(item => {
    const prod = appState.products.find(p => p.id === item.productId);
    return {
      ...item,
      product: prod,
      subtotal: prod ? prod.price * item.quantity : 0
    };
  }).filter(item => item.product !== undefined);

  const totalEstimate = cartDetails.reduce((sum, i) => sum + i.subtotal, 0);

  return `
    <div class="container">
      <div style="padding: 24px 0 12px;">
        <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--color-navy);">Keranjang Belanja</h1>
        <p style="font-size: 0.875rem; color: var(--text-muted);">Periksa daftar pesanan hasil perikanan Anda sebelum checkout</p>
      </div>

      ${cartDetails.length === 0 ? `
        <div class="empty-state" style="margin-bottom: 50px;">
          <div class="empty-icon">🛒</div>
          <h3>Keranjang Belanja Anda Masih Kosong</h3>
          <p>Belum ada produk hasil laut yang dimasukkan ke keranjang.</p>
          <button class="btn btn-primary" onclick="navigateTo('catalog')">Mulai Belanja Ikan</button>
        </div>
      ` : `
        <div class="cart-layout">
          <!-- Items List -->
          <div class="card">
            <div class="table-responsive">
              <table class="cart-items-table">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Harga Satuan</th>
                    <th>Jumlah</th>
                    <th>Subtotal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  ${cartDetails.map(item => `
                    <tr>
                      <td>
                        <div class="cart-item-info">
                          <div class="cart-item-img">
                            <img src="${item.product.image_url}" alt="${item.product.name}">
                          </div>
                          <div>
                            <div style="font-weight: 700; color: var(--color-navy); font-size: 0.95rem;">${item.product.name}</div>
                            <div style="font-size: 0.775rem; color: var(--text-muted);">Toko: ${item.product.store_name}</div>
                          </div>
                        </div>
                      </td>
                      <td style="font-weight: 600;">${formatRupiah(item.product.price)} / ${item.product.unit}</td>
                      <td>
                        <div class="qty-stepper" style="border-radius: var(--radius-sm);">
                          <button class="qty-btn" style="width: 28px; height: 28px;" onclick="updateCartQty(${item.productId}, ${item.quantity - 1})">-</button>
                          <span style="padding: 0 10px; font-weight: 700; font-size: 0.85rem;">${item.quantity}</span>
                          <button class="qty-btn" style="width: 28px; height: 28px;" onclick="updateCartQty(${item.productId}, ${item.quantity + 1})">+</button>
                        </div>
                      </td>
                      <td style="font-weight: 800; color: var(--color-primary-dark);">${formatRupiah(item.subtotal)}</td>
                      <td>
                        <button class="btn btn-danger-outline btn-sm" onclick="removeFromCart(${item.productId})">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Summary Box (Strict MVP Terminology: "Estimasi Total") -->
          <div class="cart-summary-box">
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--color-navy); margin-bottom: 16px;">Ringkasan Pesanan</h3>
            
            <div class="summary-row">
              <span style="color: var(--text-muted);">Total Item</span>
              <span style="font-weight: 600;">${cartDetails.reduce((s, i) => s + i.quantity, 0)} item</span>
            </div>

            <div class="summary-row summary-total">
              <span>Estimasi Total:</span>
              <span style="color: var(--color-primary-dark);">${formatRupiah(totalEstimate)}</span>
            </div>

            <div class="mvp-notice-banner warning" style="margin-top: 16px; margin-bottom: 20px;">
              <div class="notice-icon">ℹ️</div>
              <div class="notice-text">
                <h5>Ketentuan MVP Smart Fishery</h5>
                <p>Tidak ada pembayaran online gateway. Biaya pesanan & metode pengiriman disepakati langsung dengan nelayan/penjual saat konfirmasi.</p>
              </div>
            </div>

            <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="navigateTo('checkout')">
              Lanjut ke Checkout &rarr;
            </button>
          </div>
        </div>
      `}
    </div>
  `;
}

// --- VIEW: CHECKOUT (MVP RULES: NO PAYMENT GATEWAY) ---
function renderCheckoutView() {
  const cartDetails = appState.cart.map(item => {
    const prod = appState.products.find(p => p.id === item.productId);
    return {
      ...item,
      product: prod,
      subtotal: prod ? prod.price * item.quantity : 0
    };
  }).filter(item => item.product !== undefined);

  const totalEstimate = cartDetails.reduce((sum, i) => sum + i.subtotal, 0);

  return `
    <div class="container">
      <div style="padding: 24px 0 12px;">
        <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--color-navy);">Formulir Pemesanan</h1>
        <p style="font-size: 0.875rem; color: var(--text-muted);">Lengkapi data alamat di Kabupaten Tanggamus untuk pembuatan pesanan</p>
      </div>

      <div class="cart-layout">
        <!-- Form Delivery -->
        <div class="card" style="padding: 24px;">
          <form onsubmit="processCheckoutOrder(event)">
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--color-navy); margin-bottom: 16px;">
              Data Pengiriman & Kontak
            </h3>

            <div class="form-group">
              <label class="form-label">Nama Pemesan</label>
              <input type="text" class="form-control" value="Budi Santoso" readonly style="background: #f1f5f9;">
            </div>

            <div class="form-group">
              <label class="form-label">Nomor WhatsApp / Telepon Aktif <span style="color:red">*</span></label>
              <input type="tel" id="checkout-phone" class="form-control" value="0812-7788-9900" placeholder="08xxxxxxxxxx" required>
            </div>

            <div class="form-group">
              <label class="form-label">Alamat Lengkap Pengiriman di Tanggamus <span style="color:red">*</span></label>
              <textarea id="checkout-address" class="form-control" rows="3" required placeholder="Contoh: Jl. Merdeka No. 12, Pekon Gisting Bawah, Kec. Gisting, Tanggamus">Jl. Merdeka No. 12, Pekon Gisting Bawah, Kec. Gisting, Kab. Tanggamus</textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Catatan Khusus untuk Nelayan / Penjual</label>
              <textarea id="checkout-notes" class="form-control" rows="2" placeholder="Contoh: Tolong ikan disiangi dan diberi es batu ekstra..."></textarea>
            </div>

            <div class="mvp-notice-banner warning">
              <div class="notice-icon">⚠️</div>
              <div class="notice-text">
                <h5>Kebijakan Pembayaran & Logistik MVP</h5>
                <p>Sistem ini tidak memproses pembayaran digital otomatis. Anda akan dihubungi oleh penjual untuk konfirmasi kesiapan stok, jam pengambilan/pengantaran, serta pembayaran langsung (COD atau transfer manual).</p>
              </div>
            </div>

            <div style="display: flex; gap: 12px; margin-top: 24px;">
              <button type="button" class="btn btn-outline" onclick="navigateTo('cart')">Kembali ke Keranjang</button>
              <button type="submit" class="btn btn-primary" style="flex: 1;">Buat Pesanan Sekarang</button>
            </div>
          </form>
        </div>

        <!-- Order Snapshot Box -->
        <div class="cart-summary-box">
          <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--color-navy); margin-bottom: 14px;">Ringkasan Item</h3>
          
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
            ${cartDetails.map(item => `
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                <div>
                  <div style="font-weight: 700; color: var(--color-navy);">${item.product.name}</div>
                  <div style="color: var(--text-muted); font-size: 0.75rem;">${item.quantity} ${item.product.unit} × ${formatRupiah(item.product.price)}</div>
                </div>
                <div style="font-weight: 700;">${formatRupiah(item.subtotal)}</div>
              </div>
            `).join('')}
          </div>

          <div class="summary-row summary-total">
            <span>Estimasi Total Pesanan:</span>
            <span style="color: var(--color-primary-dark);">${formatRupiah(totalEstimate)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- VIEW: CHECKOUT SUCCESS ---
function renderCheckoutSuccessView() {
  const order = appState.orders.find(o => o.id === appState.selectedOrderId) || appState.orders[0];

  return `
    <div class="container" style="padding: 60px 20px; max-width: 640px;">
      <div class="card" style="padding: 40px 30px; text-align: center;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: #dcfce7; color: #15803d; font-size: 2.2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
          ✓
        </div>
        <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--color-navy); margin-bottom: 8px;">Pesanan Berhasil Dibuat!</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 24px;">
          Pesanan Anda telah diteruskan ke toko nelayan terkait dan sedang menunggu konfirmasi.
        </p>

        <div style="background: var(--bg-surface); border-radius: var(--radius-md); padding: 18px; margin-bottom: 24px; text-align: left;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
            <span style="color: var(--text-muted);">Nomor Pesanan:</span>
            <strong style="color: var(--color-primary-dark);">${order.order_number}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
            <span style="color: var(--text-muted);">Status Saat Ini:</span>
            <span>${getStatusBadge(order.status)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem;">
            <span style="color: var(--text-muted);">Estimasi Total Pesanan:</span>
            <strong style="font-size: 1rem; color: var(--color-navy);">${formatRupiah(order.total_amount)}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
            <span style="color: var(--text-muted);">Toko Nelayan:</span>
            <span>${order.store_name}</span>
          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center;">
          <button class="btn btn-outline" onclick="navigateTo('catalog')">Belanja Lagi</button>
          <button class="btn btn-primary" onclick="navigateTo('buyer_dashboard')">Lihat Riwayat Pesanan Saya</button>
        </div>
      </div>
    </div>
  `;
}

// --- VIEW: BUYER DASHBOARD (DASHBOARD PEMBELI) ---
function renderBuyerDashboard() {
  const myOrders = appState.orders.filter(o => o.buyer_id === 4);
  const waitingOrders = myOrders.filter(o => o.status === "Menunggu Konfirmasi").length;
  const processingOrders = myOrders.filter(o => ["Dikonfirmasi", "Diproses", "Dikirim"].includes(o.status)).length;
  const finishedOrders = myOrders.filter(o => o.status === "Selesai").length;

  return `
    <div class="container" style="padding: 28px 20px;">
      <div style="margin-bottom: 24px;">
        <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--color-navy);">Dashboard Pembeli</h1>
        <p style="font-size: 0.875rem; color: var(--text-muted);">Kelola pesanan, riwayat pembelian, dan status hasil laut pesanan Anda</p>
      </div>

      <!-- Stat Cards -->
      <div class="stats-cards-grid">
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #fef3c7; color: #b45309;">⏳</div>
          <div class="stat-info">
            <h5>Menunggu Konfirmasi</h5>
            <div class="stat-val">${waitingOrders}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #ede9fe; color: #6d28d9;">📦</div>
          <div class="stat-info">
            <h5>Dalam Proses / Kirim</h5>
            <div class="stat-val">${processingOrders}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #d1fae5; color: #065f46;">✅</div>
          <div class="stat-info">
            <h5>Pesanan Selesai</h5>
            <div class="stat-val">${finishedOrders}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background: #e0f2fe; color: #0369a1;">📋</div>
          <div class="stat-info">
            <h5>Total Pesanan</h5>
            <div class="stat-val">${myOrders.length}</div>
          </div>
        </div>
      </div>

      <!-- Order History Table -->
      <div class="card" style="margin-bottom: 32px;">
        <div class="card-header">
          <h3 class="card-title">Riwayat & Status Pesanan Saya</h3>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${myOrders.length} transaksi</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>No. Pesanan</th>
                <th>Tanggal</th>
                <th>Toko Nelayan</th>
                <th>Item Produk</th>
                <th>Total Pesanan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${myOrders.map(order => `
                <tr>
                  <td><strong>${order.order_number}</strong></td>
                  <td style="color: var(--text-muted); font-size: 0.8rem;">${order.created_at}</td>
                  <td>${order.store_name}</td>
                  <td>
                    ${order.items.map(i => `${i.name} (${i.quantity} ${i.unit})`).join('<br>')}
                  </td>
                  <td style="font-weight: 700; color: var(--color-navy);">${formatRupiah(order.total_amount)}</td>
                  <td>${getStatusBadge(order.status)}</td>
                  <td>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                      <button class="btn btn-outline btn-sm" onclick="viewOrderDetailModal(${order.id})">
                        Detail & Pelacakan
                      </button>
                      ${order.status === "Menunggu Konfirmasi" ? `
                        <button class="btn btn-danger-outline btn-sm" onclick="openCancelOrderModal(${order.id})">
                          Batalkan
                        </button>
                      ` : ''}
                      ${order.status === "Dikirim" ? `
                        <button class="btn btn-accent btn-sm" onclick="advanceOrderStatus(${order.id}, 'Selesai')">
                          Konfirmasi Terima
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Buyer Profile Section -->
      <div class="card" style="max-width: 600px;">
        <div class="card-header">
          <h3 class="card-title">Profil Saya & Alamat Utama</h3>
        </div>
        <div class="card-body">
          <form onsubmit="handleUpdateBuyerProfile(event)">
            <div class="form-group">
              <label class="form-label">Nama Lengkap</label>
              <input type="text" id="buyer-profile-name" class="form-control" value="${(appState.users.find(u => u.id === 4) || {}).name || 'Budi Santoso'}">
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" value="${(appState.users.find(u => u.id === 4) || {}).email || 'budi.santoso@gmail.com'}" readonly style="background: #f1f5f9;">
            </div>
            <div class="form-group">
              <label class="form-label">No. Telepon / WhatsApp</label>
              <input type="text" id="buyer-profile-phone" class="form-control" value="${(appState.users.find(u => u.id === 4) || {}).phone || '0812-7788-9900'}">
            </div>
            <div class="form-group">
              <label class="form-label">Alamat Utama di Tanggamus</label>
              <textarea id="buyer-profile-address" class="form-control" rows="2">${(appState.users.find(u => u.id === 4) || {}).address || 'Jl. Merdeka No. 12, Pekon Gisting Bawah, Kec. Gisting, Kab. Tanggamus'}</textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Simpan Perubahan</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

// --- ORDER DETAIL MODAL WITH AUDIT TIMELINE ---
window.viewOrderDetailModal = function(orderId) {
  const order = appState.orders.find(o => o.id === orderId);
  if (!order) return;

  const modalHtml = `
    <div class="modal-backdrop show" id="orderDetailModal">
      <div class="modal-dialog" style="max-width: 680px;">
        <div class="modal-header">
          <div>
            <h4 class="modal-title">Rincian Pesanan #${order.order_number}</h4>
            <span style="font-size: 0.775rem; color: var(--text-muted);">Dibuat pada: ${order.created_at}</span>
          </div>
          <button class="modal-close-btn" onclick="closeModal('orderDetailModal')">&times;</button>
        </div>
        <div class="modal-body">
          <!-- Status Banner -->
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface); padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 18px;">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Status Pesanan:</span>
              <div style="margin-top: 4px;">${getStatusBadge(order.status)}</div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">Total Nilai Pesanan:</span>
              <div style="font-weight: 800; font-size: 1.15rem; color: var(--color-primary-dark);">${formatRupiah(order.total_amount)}</div>
            </div>
          </div>

          <!-- Items Breakdown -->
          <h5 style="font-size: 0.9rem; font-weight: 700; color: var(--color-navy); margin-bottom: 10px;">Item Produk</h5>
          <div class="table-responsive" style="margin-bottom: 20px;">
            <table class="data-table" style="font-size: 0.8rem;">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Harga Snapshot</th>
                  <th>Kuantitas</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(i => `
                  <tr>
                    <td><strong>${i.name}</strong></td>
                    <td>${formatRupiah(i.unit_price)} / ${i.unit}</td>
                    <td>${i.quantity} ${i.unit}</td>
                    <td style="font-weight: 700;">${formatRupiah(i.subtotal)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Shipping & Notes -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; font-size: 0.85rem;">
            <div style="background: #f8fafc; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <strong style="color: var(--color-navy); display: block; margin-bottom: 4px;">Alamat Pengiriman</strong>
              <p style="color: var(--text-muted);">${order.delivery_address}</p>
              <p style="margin-top: 4px;"><strong>Kontak:</strong> ${order.buyer_phone}</p>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <strong style="color: var(--color-navy); display: block; margin-bottom: 4px;">Catatan Pemesan</strong>
              <p style="color: var(--text-muted);">${order.notes || "Tidak ada catatan tambahan."}</p>
            </div>
          </div>

          <!-- Audit Timeline (FR-17 & PRD 7. Alur Status) -->
          <h5 style="font-size: 0.9rem; font-weight: 700; color: var(--color-navy); margin-bottom: 10px;">
            Timeline Riwayat Perubahan Status (Audit Trail)
          </h5>
          <div class="timeline">
            ${order.history.map(h => `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="timeline-title">
                    <span>${getStatusBadge(h.new_status)}</span>
                    <span style="font-size: 0.775rem; color: var(--text-muted);">${h.time}</span>
                  </div>
                  <div class="timeline-meta">
                    <strong>Pelaku:</strong> ${h.changed_by}
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                    ${h.note || ""}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary btn-sm" onclick="closeModal('orderDetailModal')">Tutup</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modal-container').innerHTML = modalHtml;
};

// --- VIEW: SELLER DASHBOARD (DASHBOARD PENJUAL DENGAN SIDEBAR) ---
function renderSellerDashboard() {
  const currentSellerUser = appState.users.find(u => u.id === (appState.currentRole === 'seller_pending' ? 3 : 2));
  const isPending = currentSellerUser ? currentSellerUser.verification_status !== 'Disetujui' : false;
  const activeTab = window.sellerDashboardTab || 'products';

  const currentSellerId = currentSellerUser ? currentSellerUser.id : 2;
  // Seller store products
  const myProducts = appState.products.filter(p => p.seller_id === currentSellerId);
  // Seller store orders
  const myOrders = appState.orders.filter(o => o.seller_id === currentSellerId);
  const newOrders = myOrders.filter(o => o.status === "Menunggu Konfirmasi").length;
  const totalSalesVolume = myOrders.reduce((sum, o) => sum + o.total_amount, 0);

  return `
    <div class="dashboard-container">
      <!-- Seller Sidebar -->
      <aside class="dashboard-sidebar">
        <div class="sidebar-brand-box">
          <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
            🐟
          </div>
          <div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #ffffff;">Panel Nelayan</div>
            <div style="font-size: 0.7rem; color: #38bdf8;">
              ${isPending ? 'Kelompok Semaka (Pending)' : 'Toko Bahari (Terverifikasi)'}
            </div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a class="sidebar-link ${activeTab === 'overview' ? 'active' : ''}" onclick="switchSellerTab('overview')">
            <span class="sidebar-icon">📊</span> Ringkasan Toko
          </a>
          <a class="sidebar-link ${activeTab === 'products' ? 'active' : ''}" onclick="switchSellerTab('products')">
            <span class="sidebar-icon">📦</span> Kelola Produk
          </a>
          <a class="sidebar-link ${activeTab === 'stock' ? 'active' : ''}" onclick="switchSellerTab('stock')">
            <span class="sidebar-icon">⚖️</span> Manajemen Stok
          </a>
          <a class="sidebar-link ${activeTab === 'orders' ? 'active' : ''}" onclick="switchSellerTab('orders')">
            <span class="sidebar-icon">🛒</span> Pesanan Masuk
            ${newOrders > 0 ? `<span style="background: var(--color-danger); color: #fff; font-size: 0.7rem; padding: 1px 6px; border-radius: 99px; margin-left: auto;">${newOrders}</span>` : ''}
          </a>
          <a class="sidebar-link ${activeTab === 'store_profile' ? 'active' : ''}" onclick="switchSellerTab('store_profile')">
            <span class="sidebar-icon">🏪</span> Profil Toko
          </a>
          <a class="sidebar-link" onclick="navigateTo('home')">
            <span class="sidebar-icon">🌐</span> Halaman Publik
          </a>
        </nav>

        <div class="sidebar-user-footer">
          <div style="font-size: 0.75rem; color: #cbd5e1; font-weight: 600;">Login Sebagai:</div>
          <div style="font-size: 0.85rem; color: #ffffff; font-weight: 700;">
            ${isPending ? 'Hasanudin (Belum Verifikasi)' : 'Slamet Riyadi'}
          </div>
          <div style="margin-top: 6px;">
            ${isPending ? '<span class="badge-pending">⏳ Menunggu Verifikasi</span>' : '<span class="badge-verified">✓ Toko Disetujui</span>'}
          </div>
        </div>
      </aside>

      <!-- Main Seller Content -->
      <main class="dashboard-main">
        <header class="dashboard-topbar">
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--color-navy);">
              ${activeTab === 'overview' ? 'Ringkasan Toko' : 
                activeTab === 'products' ? 'Manajemen Produk Perikanan' :
                activeTab === 'stock' ? 'Kelola Stok Cepat' :
                activeTab === 'orders' ? 'Daftar Pesanan Masuk Toko' : 'Profil Toko Nelayan'}
            </h2>
            <div style="font-size: 0.775rem; color: var(--text-muted);">Kabupaten Tanggamus, Lampung</div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary btn-sm" onclick="openAddProductModal()" ${isPending ? 'disabled title="Akun belum diverifikasi"' : ''}>
              + Tambah Produk Baru
            </button>
          </div>
        </header>

        <div class="dashboard-content">
          <!-- Pending verification banner (STRICT PRD REQUIREMENT 7 & 8) -->
          ${isPending ? `
            <div class="mvp-notice-banner warning" style="margin-bottom: 24px;">
              <div class="notice-icon">⚠️</div>
              <div class="notice-text">
                <h5 style="font-size: 1rem;">Akun Nelayan Sedang Menunggu Verifikasi Admin Pemkab Tanggamus</h5>
                <p>Sesuai aturan PRD (Aturan Bisnis 1), <strong>hanya penjual yang telah diverifikasi admin yang dapat menerbitkan produk</strong>. Produk toko Anda belum akan tayang di katalog publik hingga admin menyetujui pendaftaran Anda.</p>
                <div style="margin-top: 8px;">
                  <button class="btn btn-sm btn-outline" onclick="switchRole('admin')">Ganti ke Peran Admin untuk Verifikasi Akun Ini &rarr;</button>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- TAB CONTENT -->
          ${activeTab === 'overview' ? renderSellerOverviewTab(myProducts, myOrders, newOrders, totalSalesVolume) : ''}
          ${activeTab === 'products' ? renderSellerProductsTab(myProducts, isPending) : ''}
          ${activeTab === 'stock' ? renderSellerStockTab(myProducts) : ''}
          ${activeTab === 'orders' ? renderSellerOrdersTab(myOrders) : ''}
          ${activeTab === 'store_profile' ? renderSellerProfileTab(isPending) : ''}
        </div>
      </main>
    </div>
  `;
}

window.switchSellerTab = function(tab) {
  window.sellerDashboardTab = tab;
  render();
};

function renderSellerOverviewTab(products, orders, newOrders, totalSales) {
  return `
    <div class="stats-cards-grid">
      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: #e0f2fe; color: #0284c7;">📦</div>
        <div class="stat-info">
          <h5>Total Produk Toko</h5>
          <div class="stat-val">${products.length}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: #fef3c7; color: #b45309;">🔔</div>
        <div class="stat-info">
          <h5>Pesanan Baru</h5>
          <div class="stat-val">${newOrders}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: #ede9fe; color: #6d28d9;">📋</div>
        <div class="stat-info">
          <h5>Total Pesanan</h5>
          <div class="stat-val">${orders.length}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: #d1fae5; color: #065f46;">💰</div>
        <div class="stat-info">
          <h5>Total Nilai Pesanan</h5>
          <div class="stat-val" style="font-size: 1.25rem;">${formatRupiah(totalSales)}</div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Aktivitas Pesanan Masuk Terbaru</h3>
        <button class="btn btn-outline btn-sm" onclick="switchSellerTab('orders')">Lihat Semua</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>No. Pesanan</th>
              <th>Pembeli</th>
              <th>Item Pesanan</th>
              <th>Total Nilai</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${orders.slice(0, 3).map(o => `
              <tr>
                <td><strong>${o.order_number}</strong></td>
                <td>${o.buyer_name}</td>
                <td>${o.items.map(i => `${i.name} (${i.quantity})`).join(', ')}</td>
                <td style="font-weight: 700;">${formatRupiah(o.total_amount)}</td>
                <td>${getStatusBadge(o.status)}</td>
                <td>
                  <button class="btn btn-outline btn-sm" onclick="viewOrderDetailModal(${o.id})">Rincian</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderSellerProductsTab(products, isPending) {
  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Katalog Produk Toko Anda</h3>
        <button class="btn btn-primary btn-sm" onclick="openAddProductModal()" ${isPending ? 'disabled' : ''}>
          + Tambah Produk Baru
        </button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Foto & Nama</th>
              <th>Kategori</th>
              <th>Harga (Numerik)</th>
              <th>Stok Tersedia</th>
              <th>Status Produk</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${products.length === 0 ? `
              <tr><td colspan="6" style="text-align:center; padding: 30px;">Belum ada produk yang diterbitkan.</td></tr>
            ` : products.map(p => `
              <tr>
                <td>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${p.image_url}" style="width: 44px; height: 44px; object-fit: cover; border-radius: var(--radius-sm);">
                    <div>
                      <div style="font-weight: 700; color: var(--color-navy);">${p.name}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${p.description.substring(0, 40)}...</div>
                    </div>
                  </div>
                </td>
                <td><span class="status-badge badge-dikonfirmasi">${p.category_slug}</span></td>
                <td style="font-weight: 700;">${formatRupiah(p.price)} / ${p.unit}</td>
                <td>
                  <strong style="color: ${p.stock <= 0 ? 'red' : 'green'};">${p.stock} ${p.unit}</strong>
                </td>
                <td>
                  <span class="status-badge ${p.is_active ? 'badge-selesai' : 'badge-dibatalkan'}">
                    ${p.is_active ? 'Aktif Tayang' : 'Nonaktif'}
                  </span>
                </td>
                <td>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn btn-primary btn-sm" onclick="openEditProductModal(${p.id})">
                      Edit
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="toggleProductActive(${p.id})">
                      ${p.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="navigateTo('product_detail', { productId: ${p.id} })">
                      Pratinjau
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderSellerStockTab(products) {
  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Manajemen Pembaruan Stok Cepat</h3>
        <span style="font-size: 0.8rem; color: var(--text-muted);">Sistem mencegah stok bernilai negatif secara otomatis (FR-09)</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th>Satuan</th>
              <th>Stok Saat Ini</th>
              <th>Pembaruan Cepat (+ / -)</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.unit}</td>
                <td>
                  <span style="font-size: 1.1rem; font-weight: 800; color: ${p.stock <= 0 ? 'var(--color-danger)' : 'var(--color-navy)'};">
                    ${p.stock} ${p.unit}
                  </span>
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <button class="btn btn-outline btn-sm" onclick="quickUpdateStock(${p.id}, -5)">-5</button>
                    <button class="btn btn-outline btn-sm" onclick="quickUpdateStock(${p.id}, -1)">-1</button>
                    <button class="btn btn-primary btn-sm" onclick="quickUpdateStock(${p.id}, 1)">+1</button>
                    <button class="btn btn-primary btn-sm" onclick="quickUpdateStock(${p.id}, 5)">+5</button>
                    <button class="btn btn-primary btn-sm" onclick="quickUpdateStock(${p.id}, 10)">+10</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderSellerOrdersTab(orders) {
  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Daftar Pesanan Masuk (Toko Anda Saja)</h3>
        <span style="font-size: 0.8rem; color: var(--text-muted);">Alur Status: Menunggu → Dikonfirmasi → Diproses → Dikirim → Selesai</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>No. Pesanan</th>
              <th>Pembeli & Kontak</th>
              <th>Alamat Tanggamus</th>
              <th>Item Pesanan</th>
              <th>Total Nilai</th>
              <th>Status</th>
              <th>Tindakan Alur Status</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td><strong>${o.order_number}</strong></td>
                <td>
                  <div style="font-weight: 700;">${o.buyer_name}</div>
                  <div style="font-size: 0.775rem; color: var(--text-muted);">${o.buyer_phone}</div>
                </td>
                <td style="font-size: 0.8rem; max-width: 180px;">${o.delivery_address}</td>
                <td>${o.items.map(i => `${i.name} (${i.quantity} ${i.unit})`).join('<br>')}</td>
                <td style="font-weight: 800; color: var(--color-primary-dark);">${formatRupiah(o.total_amount)}</td>
                <td>${getStatusBadge(o.status)}</td>
                <td>
                  <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${o.status === "Menunggu Konfirmasi" ? `
                      <button class="btn btn-primary btn-sm" onclick="advanceOrderStatus(${o.id}, 'Dikonfirmasi')">
                        Terima & Konfirmasi
                      </button>
                      <button class="btn btn-danger-outline btn-sm" onclick="openCancelOrderModal(${o.id})">
                        Tolak Pesanan
                      </button>
                    ` : ''}

                    ${o.status === "Dikonfirmasi" ? `
                      <button class="btn btn-primary btn-sm" onclick="advanceOrderStatus(${o.id}, 'Diproses')">
                        Mulai Proses (Packing)
                      </button>
                    ` : ''}

                    ${o.status === "Diproses" ? `
                      <button class="btn btn-accent btn-sm" onclick="advanceOrderStatus(${o.id}, 'Dikirim')">
                        Kirim ke Pembeli
                      </button>
                    ` : ''}

                    ${o.status === "Dikirim" ? `
                      <button class="btn btn-primary btn-sm" onclick="advanceOrderStatus(${o.id}, 'Selesai')">
                        Tandai Selesai
                      </button>
                    ` : ''}

                    <button class="btn btn-outline btn-sm" onclick="viewOrderDetailModal(${o.id})">
                      Rincian & Timeline
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderSellerProfileTab(isPending) {
  return `
    <div class="card" style="max-width: 680px;">
      <div class="card-header">
        <h3 class="card-title">Profil Toko Nelayan</h3>
      </div>
      <div class="card-body">
        <form onsubmit="handleUpdateSellerProfile(event)">
          <div class="form-group">
            <label class="form-label">Nama Toko / Usaha Perikanan</label>
            <input type="text" id="seller-profile-store" class="form-control" value="${currentSellerUser ? currentSellerUser.store_name : (isPending ? 'Kelompok Nelayan Teluk Semaka' : 'Toko Bahari Kota Agung')}">
          </div>
          <div class="form-group">
            <label class="form-label">Nama Pemilik / Penanggung Jawab</label>
            <input type="text" id="seller-profile-name" class="form-control" value="${currentSellerUser ? currentSellerUser.name : (isPending ? 'Hasanudin' : 'Slamet Riyadi')}">
          </div>
          <div class="form-group">
            <label class="form-label">Alamat Dermaga / Pangkalan Pendaratan Ikan</label>
            <textarea id="seller-profile-address" class="form-control" rows="2">${currentSellerUser ? currentSellerUser.store_address : (isPending ? 'Pesisir Way Kerap, Kec. Semaka, Tanggamus' : 'Dermaga 2 Pelabuhan Perikanan Kota Agung, Tanggamus')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Nomor WhatsApp / Kontak Toko</label>
            <input type="text" id="seller-profile-phone" class="form-control" value="${currentSellerUser ? currentSellerUser.phone : (isPending ? '0821-8844-3321' : '0852-6987-1122')}">
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi Profil Usaha</label>
            <textarea id="seller-profile-desc" class="form-control" rows="3">${currentSellerUser ? (currentSellerUser.store_desc || 'Penyedia hasil perikanan laut segar harian tangkapan nelayan lokal Tanggamus.') : 'Penyedia hasil perikanan laut segar harian tangkapan nelayan lokal Tanggamus.'}</textarea>
          </div>
          <button type="submit" class="btn btn-primary">Simpan Profil Toko</button>
        </form>
      </div>
    </div>
  `;
}

// --- VIEW: ADMIN DASHBOARD (DASHBOARD ADMIN PEMDA DENGAN SIDEBAR) ---
function renderAdminDashboard() {
  const activeTab = window.adminDashboardTab || 'overview';

  const totalUsers = appState.users.length;
  const totalSellers = appState.users.filter(u => u.role === 'penjual').length;
  const pendingSellers = appState.users.filter(u => u.role === 'penjual' && u.verification_status === 'Menunggu').length;
  const totalProducts = appState.products.length;
  const totalOrders = appState.orders.length;
  const totalPlatformSales = appState.orders.reduce((sum, o) => sum + o.total_amount, 0);

  return `
    <div class="dashboard-container">
      <!-- Admin Sidebar -->
      <aside class="dashboard-sidebar">
        <div class="sidebar-brand-box">
          <div class="logo-box" style="width: 38px; height: 38px; background: #fff;">
            <img src="logo/Lambang_Kabupaten_Tanggamus.png" alt="Pemda Tanggamus">
          </div>
          <div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #ffffff;">Admin Pemda</div>
            <div style="font-size: 0.7rem; color: #bae6fd;">Kabupaten Tanggamus</div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a class="sidebar-link ${activeTab === 'overview' ? 'active' : ''}" onclick="switchAdminTab('overview')">
            <span class="sidebar-icon">🏛️</span> Ringkasan Eksekutif
          </a>
          <a class="sidebar-link ${activeTab === 'verification' ? 'active' : ''}" onclick="switchAdminTab('verification')">
            <span class="sidebar-icon">🛡️</span> Verifikasi Penjual
            ${pendingSellers > 0 ? `<span style="background: var(--color-warning); color: #000; font-size: 0.7rem; padding: 1px 6px; border-radius: 99px; font-weight:700; margin-left: auto;">${pendingSellers}</span>` : ''}
          </a>
          <a class="sidebar-link ${activeTab === 'users' ? 'active' : ''}" onclick="switchAdminTab('users')">
            <span class="sidebar-icon">👥</span> Kelola Pengguna
          </a>
          <a class="sidebar-link ${activeTab === 'categories' ? 'active' : ''}" onclick="switchAdminTab('categories')">
            <span class="sidebar-icon">🏷️</span> Kelola Kategori
          </a>
          <a class="sidebar-link ${activeTab === 'products' ? 'active' : ''}" onclick="switchAdminTab('products')">
            <span class="sidebar-icon">🐟</span> Moderasi Produk
          </a>
          <a class="sidebar-link ${activeTab === 'orders' ? 'active' : ''}" onclick="switchAdminTab('orders')">
            <span class="sidebar-icon">🛒</span> Seluruh Pesanan
          </a>
          <a class="sidebar-link ${activeTab === 'reports' ? 'active' : ''}" onclick="switchAdminTab('reports')">
            <span class="sidebar-icon">📈</span> Laporan Rekap Pesanan
          </a>
          <a class="sidebar-link ${activeTab === 'logs' ? 'active' : ''}" onclick="switchAdminTab('logs')">
            <span class="sidebar-icon">📜</span> Log Aktivitas
          </a>
          <a class="sidebar-link" onclick="navigateTo('home')">
            <span class="sidebar-icon">🌐</span> Portal Publik
          </a>
        </nav>

        <div class="sidebar-user-footer">
          <div style="font-size: 0.75rem; color: #94a3b8;">Administrator:</div>
          <div style="font-size: 0.85rem; color: #ffffff; font-weight: 700;">Rifki Banda Wijaya</div>
          <div style="font-size: 0.7rem; color: #38bdf8;">Dinas Kelautan & Perikanan</div>
        </div>
      </aside>

      <!-- Main Admin Content Area -->
      <main class="dashboard-main">
        <header class="dashboard-topbar">
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--color-navy);">
              ${activeTab === 'overview' ? 'Ringkasan Eksekutif Smart Fishery' :
                activeTab === 'verification' ? 'Verifikasi Pendaftaran Penjual / Nelayan' :
                activeTab === 'users' ? 'Manajemen Pengguna & Hak Akses' :
                activeTab === 'categories' ? 'Manajemen Kategori Hasil Laut' :
                activeTab === 'products' ? 'Moderasi Produk Seluruh Toko' :
                activeTab === 'orders' ? 'Pengawasan Seluruh Transaksi Pesanan' :
                activeTab === 'reports' ? 'Laporan Rekapitulasi Pesanan' : 'Audit Trail & Log Aktivitas Sistem'}
            </h2>
            <div style="font-size: 0.775rem; color: var(--text-muted);">Pemerintah Kabupaten Tanggamus & Universitas Teknokrat Indonesia</div>
          </div>
        </header>

        <div class="dashboard-content">
          ${activeTab === 'overview' ? renderAdminOverviewTab(totalUsers, totalSellers, pendingSellers, totalProducts, totalOrders, totalPlatformSales) : ''}
          ${activeTab === 'verification' ? renderAdminVerificationTab() : ''}
          ${activeTab === 'users' ? renderAdminUsersTab() : ''}
          ${activeTab === 'categories' ? renderAdminCategoriesTab() : ''}
          ${activeTab === 'products' ? renderAdminProductsTab() : ''}
          ${activeTab === 'orders' ? renderAdminOrdersTab() : ''}
          ${activeTab === 'reports' ? renderAdminReportsTab(totalPlatformSales) : ''}
          ${activeTab === 'logs' ? renderAdminLogsTab() : ''}
        </div>
      </main>
    </div>
  `;
}

window.switchAdminTab = function(tab) {
  window.adminDashboardTab = tab;
  render();
};

function renderAdminOverviewTab(users, sellers, pending, products, orders, sales) {
  return `
    <div class="stats-cards-grid">
      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: #e0f2fe; color: #0284c7;">👥</div>
        <div class="stat-info">
          <h5>Total Pengguna</h5>
          <div class="stat-val">${users}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: #fef3c7; color: #b45309;">⚓</div>
        <div class="stat-info">
          <h5>Penjual Nelayan</h5>
          <div class="stat-val">${sellers} <span style="font-size: 0.75rem; color: ${pending > 0 ? 'red' : 'green'};">(${pending} pending)</span></div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: #d1fae5; color: #065f46;">🐟</div>
        <div class="stat-info">
          <h5>Produk Aktif</h5>
          <div class="stat-val">${products}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: #ede9fe; color: #6d28d9;">💰</div>
        <div class="stat-info">
          <h5>Total Nilai Pesanan</h5>
          <div class="stat-val" style="font-size: 1.2rem;">${formatRupiah(sales)}</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Card -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Antrean Verifikasi Penjual</h3>
          <button class="btn btn-outline btn-sm" onclick="switchAdminTab('verification')">Buka</button>
        </div>
        <div class="card-body">
          ${pending > 0 ? `
            <div style="display: flex; align-items: center; justify-content: space-between; background: #fffbeb; padding: 12px; border-radius: var(--radius-md); border: 1px solid #fde68a;">
              <div>
                <strong>1 Penjual Menunggu Persetujuan</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Kelompok Nelayan Teluk Semaka (Hasanudin)</p>
              </div>
              <button class="btn btn-primary btn-sm" onclick="switchAdminTab('verification')">Tinjau</button>
            </div>
          ` : `
            <p style="color: var(--text-muted); font-size: 0.9rem;">Semua pendaftaran penjual telah diverifikasi.</p>
          `}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Ringkasan Validasi Teknologi PRD</h3>
        </div>
        <div class="card-body" style="font-size: 0.85rem;">
          <ul style="padding-left: 20px; color: var(--text-muted); display: flex; flex-direction: column; gap: 6px;">
            <li>Backend: <strong>Rust + Axum Web Framework</strong></li>
            <li>Database: <strong>PostgreSQL dengan SQLx Async</strong></li>
            <li>Deployment: <strong>Vercel Rust Functions & Cloud DB</strong></li>
            <li>Identitas: <strong>Pemda Kab. Tanggamus & Univ. Teknokrat Indonesia</strong></li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

function renderAdminVerificationTab() {
  const sellers = appState.users.filter(u => u.role === 'penjual');

  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Daftar Pengajuan & Verifikasi Toko Nelayan (FR-04)</h3>
        <span style="font-size: 0.8rem; color: var(--text-muted);">Hanya penjual terverifikasi yang dapat menerbitkan produk di katalog</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Toko</th>
              <th>Nama Pemilik</th>
              <th>Lokasi Pesisir Tanggamus</th>
              <th>Kontak</th>
              <th>Status Verifikasi</th>
              <th>Tindakan Admin</th>
            </tr>
          </thead>
          <tbody>
            ${sellers.map(s => `
              <tr>
                <td>#${s.id}</td>
                <td><strong>${s.store_name}</strong></td>
                <td>${s.name}</td>
                <td style="font-size: 0.8rem;">${s.store_address}</td>
                <td>${s.phone}</td>
                <td>
                  ${s.verification_status === 'Disetujui' ? '<span class="badge-verified">✓ Disetujui</span>' :
                    s.verification_status === 'Ditolak' ? '<span class="badge-rejected">✗ Ditolak</span>' :
                    '<span class="badge-pending">⏳ Menunggu Verifikasi</span>'}
                </td>
                <td>
                  <div style="display: flex; gap: 6px;">
                    ${s.verification_status !== 'Disetujui' ? `
                      <button class="btn btn-primary btn-sm" onclick="verifySeller(${s.id}, 'Disetujui')">
                        Setujui
                      </button>
                    ` : ''}
                    ${s.verification_status !== 'Ditolak' ? `
                      <button class="btn btn-danger-outline btn-sm" onclick="verifySeller(${s.id}, 'Ditolak')">
                        Tolak
                      </button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminUsersTab() {
  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Manajemen Akun Pengguna</h3>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${appState.users.length} akun terdaftar</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Pengguna</th>
              <th>Email</th>
              <th>Peran (Role)</th>
              <th>Telepon</th>
              <th>Status Akun</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${appState.users.map(u => `
              <tr>
                <td>#${u.id}</td>
                <td><strong>${u.name}</strong></td>
                <td>${u.email}</td>
                <td>
                  <span class="status-badge ${u.role === 'admin' ? 'badge-diproses' : u.role === 'penjual' ? 'badge-dikonfirmasi' : 'badge-selesai'}">
                    ${u.role.toUpperCase()}
                  </span>
                </td>
                <td>${u.phone}</td>
                <td>
                  <span class="status-badge ${u.is_active ? 'badge-selesai' : 'badge-dibatalkan'}">
                    ${u.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td>
                  ${u.role !== 'admin' ? `
                    <button class="btn btn-outline btn-sm" onclick="toggleUserActive(${u.id})">
                      ${u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  ` : '<span style="font-size: 0.75rem; color: var(--text-muted);">Superadmin</span>'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminCategoriesTab() {
  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Kelola Kategori Hasil Perikanan</h3>
        <button class="btn btn-primary btn-sm" onclick="openAddCategoryModal()">+ Tambah Kategori</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ikon & Nama Kategori</th>
              <th>Deskripsi Komoditas</th>
              <th>Slug</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${appState.categories.map(c => `
              <tr>
                <td>#${c.id}</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="${c.icon}" style="width: 28px; height: 28px;">
                    <strong>${c.name}</strong>
                  </div>
                </td>
                <td>${c.desc}</td>
                <td><code>${c.slug}</code></td>
                <td><span class="badge-verified">Aktif</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminProductsTab() {
  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Moderasi Produk Seluruh Toko</h3>
        <span style="font-size: 0.8rem; color: var(--text-muted);">Admin berhak menonaktifkan produk jika melanggar ketentuan perikanan</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Produk</th>
              <th>Toko Penjual</th>
              <th>Harga & Satuan</th>
              <th>Stok</th>
              <th>Status</th>
              <th>Moderasi</th>
            </tr>
          </thead>
          <tbody>
            ${appState.products.map(p => `
              <tr>
                <td>#${p.id}</td>
                <td><strong>${p.name}</strong></td>
                <td>${p.store_name}</td>
                <td>${formatRupiah(p.price)} / ${p.unit}</td>
                <td>${p.stock} ${p.unit}</td>
                <td>
                  <span class="status-badge ${p.is_active ? 'badge-selesai' : 'badge-dibatalkan'}">
                    ${p.is_active ? 'Aktif' : 'Dinonaktifkan'}
                  </span>
                </td>
                <td>
                  <button class="btn btn-outline btn-sm" onclick="toggleProductActive(${p.id})">
                    ${p.is_active ? 'Takedown/Nonaktifkan' : 'Pulihkan'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminOrdersTab() {
  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Seluruh Transaksi Pesanan Platform</h3>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${appState.orders.length} pesanan total</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>No. Pesanan</th>
              <th>Waktu</th>
              <th>Pembeli</th>
              <th>Toko Nelayan</th>
              <th>Total Nilai</th>
              <th>Status Pesanan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${appState.orders.map(o => `
              <tr>
                <td><strong>${o.order_number}</strong></td>
                <td style="font-size: 0.8rem; color: var(--text-muted);">${o.created_at}</td>
                <td>${o.buyer_name}</td>
                <td>${o.store_name}</td>
                <td style="font-weight: 800;">${formatRupiah(o.total_amount)}</td>
                <td>${getStatusBadge(o.status)}</td>
                <td>
                  <button class="btn btn-outline btn-sm" onclick="viewOrderDetailModal(${o.id})">
                    Detail & Audit Log
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminReportsTab(totalSales) {
  const selectedPeriod = window.adminReportPeriod || "all";
  const selectedStatus = window.adminReportStatus || "all";

  let filteredOrders = [...appState.orders];
  if (selectedStatus !== "all") {
    filteredOrders = filteredOrders.filter(o => o.status === selectedStatus);
  }

  const filteredTotal = filteredOrders.reduce((sum, o) => sum + o.total_amount, 0);

  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Laporan Rekapitulasi Pesanan (FR-16)</h3>
        <button class="btn btn-outline btn-sm" onclick="window.print()">🖨️ Cetak / Ekspor Laporan</button>
      </div>
      <div class="card-body">
        <div style="display: flex; gap: 14px; margin-bottom: 20px; flex-wrap: wrap;">
          <div>
            <label class="form-label" style="font-size: 0.775rem;">Filter Periode</label>
            <select class="form-control" style="font-size: 0.8rem;" onchange="filterAdminReports(this.value, undefined)">
              <option value="all" ${selectedPeriod === 'all' ? 'selected' : ''}>Seluruh Periode 2026</option>
              <option value="current" ${selectedPeriod === 'current' ? 'selected' : ''}>Bulan November 2026 (Bulan Berjalan)</option>
            </select>
          </div>
          <div>
            <label class="form-label" style="font-size: 0.775rem;">Status Pesanan</label>
            <select class="form-control" style="font-size: 0.8rem;" onchange="filterAdminReports(undefined, this.value)">
              <option value="all" ${selectedStatus === 'all' ? 'selected' : ''}>Semua Status (${appState.orders.length})</option>
              <option value="Menunggu Konfirmasi" ${selectedStatus === 'Menunggu Konfirmasi' ? 'selected' : ''}>Menunggu Konfirmasi</option>
              <option value="Dikonfirmasi" ${selectedStatus === 'Dikonfirmasi' ? 'selected' : ''}>Dikonfirmasi</option>
              <option value="Diproses" ${selectedStatus === 'Diproses' ? 'selected' : ''}>Diproses</option>
              <option value="Dikirim" ${selectedStatus === 'Dikirim' ? 'selected' : ''}>Dikirim</option>
              <option value="Selesai" ${selectedStatus === 'Selesai' ? 'selected' : ''}>Selesai Saja</option>
              <option value="Dibatalkan" ${selectedStatus === 'Dibatalkan' ? 'selected' : ''}>Dibatalkan Saja</option>
            </select>
          </div>
        </div>

        <div style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
            <span>Total Nilai Pesanan Terdata (Sesuai Filter):</span>
            <strong style="color: var(--color-primary-dark); font-size: 1.25rem;">${formatRupiah(filteredTotal)}</strong>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Menampilkan ${filteredOrders.length} dari total ${appState.orders.length} pesanan</div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>No. Pesanan</th>
                <th>Tanggal</th>
                <th>Toko</th>
                <th>Pembeli</th>
                <th>Status</th>
                <th>Nilai Pesanan</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.length === 0 ? `
                <tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--text-muted);">Tidak ada pesanan yang sesuai dengan kriteria filter.</td></tr>
              ` : filteredOrders.map(o => `
                <tr>
                  <td>${o.order_number}</td>
                  <td>${o.created_at}</td>
                  <td>${o.store_name}</td>
                  <td>${o.buyer_name}</td>
                  <td>${getStatusBadge(o.status)}</td>
                  <td style="font-weight: 700;">${formatRupiah(o.total_amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderAdminLogsTab() {
  return `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Log Aktivitas & Jejak Audit (FR-17)</h3>
        <span style="font-size: 0.8rem; color: var(--text-muted);">Pencatatan waktu, pelaku, dan aksi perubahan data penting</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Waktu Audit</th>
              <th>Pelaku (User)</th>
              <th>Aksi (Action)</th>
              <th>Entitas Terkait</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            ${appState.activityLogs.map(l => `
              <tr>
                <td>#${l.id}</td>
                <td style="font-size: 0.8rem; color: var(--text-muted);">${l.time}</td>
                <td><strong>${l.user}</strong></td>
                <td><code>${l.action}</code></td>
                <td>${l.entity}</td>
                <td style="font-size: 0.8rem; color: var(--text-muted);">${l.note}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --- VIEW: LOGIN ---
function renderLoginView() {
  return `
    <div class="container" style="padding: 60px 20px; max-width: 480px;">
      <div class="card" style="padding: 32px 28px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-navy);">Masuk ke Smart Fishery</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Pilih akun demo atau masukkan email Anda</p>
        </div>

        <form onsubmit="handleLoginSubmit(event)">
          <div class="form-group">
            <label class="form-label">Alamat Email</label>
            <input type="email" id="login-email" class="form-control" value="budi.santoso@gmail.com" required>
          </div>

          <div class="form-group">
            <label class="form-label">Kata Sandi</label>
            <div style="position: relative;">
              <input type="password" id="login-password" class="form-control" value="password123" required>
              <button type="button" onclick="togglePasswordVisibility('login-password')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-muted);">👁️</button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
            Masuk
          </button>
        </form>

        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-color); text-align: center;">
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">Belum memiliki akun?</p>
          <button class="btn btn-outline btn-sm" onclick="navigateTo('register')">Daftar Akun Baru (Pembeli / Nelayan)</button>
        </div>
      </div>
    </div>
  `;
}

window.togglePasswordVisibility = function(id) {
  const el = document.getElementById(id);
  if (el) el.type = el.type === 'password' ? 'text' : 'password';
};

let failedLoginAttempts = 0;
let loginLockoutUntil = 0;

window.handleLoginSubmit = function(e) {
  e.preventDefault();
  const now = Date.now();
  if (now < loginLockoutUntil) {
    const remainingSecs = Math.ceil((loginLockoutUntil - now) / 1000);
    showToast(`Formulir login terkunci sementara karena proteksi brute force! Coba lagi dalam ${remainingSecs} detik.`, "error");
    recordLog("SECURITY_ALERT", "Brute Force Throttling", `Login diblokir sementara (Cooldown ${remainingSecs}s)`, "SECURITY_ALERT");
    return;
  }

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";

  // Password length boundary check (OWASP A07)
  if (password.length > 0 && password.length < 6) {
    failedLoginAttempts++;
    if (failedLoginAttempts >= 5) {
      loginLockoutUntil = Date.now() + 30000;
      showToast("Terlalu banyak percobaan gagal! Login dikunci 30 detik demi keamanan akun.", "error");
      recordLog("SECURITY_ALERT", email, "Brute force threshold reached: 30s lockout activated", "SECURITY_ALERT");
      return;
    }
    showToast("Kata sandi minimal 6 karakter!", "error");
    return;
  }

  // Find registered user in database
  const foundUser = appState.users.find(u => u.email && u.email.toLowerCase() === email);
  if (foundUser) {
    failedLoginAttempts = 0;
    if (foundUser.role === 'admin') {
      switchRole('admin');
    } else if (foundUser.role === 'penjual') {
      if (foundUser.verification_status === 'Disetujui') {
        switchRole('seller');
      } else {
        switchRole('seller_pending');
      }
    } else {
      switchRole('buyer');
    }
    showToast(`Berhasil masuk! Selamat datang, ${foundUser.name}.`, "success");
    return;
  }

  // Fallback keyword routing for rapid demo testing
  failedLoginAttempts = 0;
  if (email.includes('admin')) {
    switchRole('admin');
  } else if (email.includes('bahari')) {
    switchRole('seller');
  } else if (email.includes('semaka')) {
    switchRole('seller_pending');
  } else {
    switchRole('buyer');
  }
};

// --- VIEW: REGISTER (FR-01 & Prompt v2: Pembeli & Penjual) ---
function renderRegisterView() {
  const isSellerRole = window.registerSelectedRole === 'penjual';

  return `
    <div class="container" style="padding: 60px 20px; max-width: 560px;">
      <div class="card" style="padding: 32px 28px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-navy);">Registrasi Akun Smart Fishery</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Pilih peran Anda dalam sistem pemasaran hasil laut Tanggamus</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px;">
          <button class="btn ${!isSellerRole ? 'btn-primary' : 'btn-outline'}" onclick="setRegisterRole('pembeli')">
            🛒 Daftar Sebagai Pembeli
          </button>
          <button class="btn ${isSellerRole ? 'btn-primary' : 'btn-outline'}" onclick="setRegisterRole('penjual')">
            ⚓ Daftar Sebagai Penjual / Nelayan
          </button>
        </div>

        <form onsubmit="handleRegisterSubmit(event)">
          <div class="form-group">
            <label class="form-label">Nama Lengkap <span style="color:red">*</span></label>
            <input type="text" id="reg-name" class="form-control" required placeholder="Contoh: Ahmad Yani">
          </div>

          <div class="form-group">
            <label class="form-label">Alamat Email <span style="color:red">*</span></label>
            <input type="email" id="reg-email" class="form-control" required placeholder="nama@email.com">
          </div>

          <div class="form-group">
            <label class="form-label">Nomor WhatsApp / HP Aktif <span style="color:red">*</span></label>
            <input type="tel" id="reg-phone" class="form-control" required placeholder="08xxxxxxxxxx">
          </div>

          <!-- Specific Fields for Seller -->
          ${isSellerRole ? `
            <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-navy); margin-bottom: 12px;">Data Toko / Usaha Nelayan</h4>
              
              <div class="form-group">
                <label class="form-label">Nama Toko / Kelompok Nelayan <span style="color:red">*</span></label>
                <input type="text" id="reg-store-name" class="form-control" required placeholder="Contoh: Toko Nelayan Pesisir Limau">
              </div>

              <div class="form-group">
                <label class="form-label">Alamat Pangkalan / Dermaga di Tanggamus <span style="color:red">*</span></label>
                <textarea id="reg-store-address" class="form-control" rows="2" required placeholder="Contoh: Dermaga TPI Kota Agung RT 02 / RW 01"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Deskripsi Usaha & Komoditas Utama <span style="color:red">*</span></label>
                <textarea id="reg-store-desc" class="form-control" rows="2" required placeholder="Jenis tangkapan, alat tangkap ramah lingkungan, dll"></textarea>
              </div>

              <div class="mvp-notice-banner warning" style="margin-bottom: 0;">
                <div class="notice-icon">⚠️</div>
                <div class="notice-text">
                  <h5>Penting: Status Verifikasi Admin</h5>
                  <p>Setelah mendaftar, akun toko Anda akan berstatus <strong>"Menunggu Verifikasi Admin"</strong>. Anda baru dapat menerbitkan produk di katalog setelah disetujui oleh Admin Pemkab Tanggamus.</p>
                </div>
              </div>
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label">Kata Sandi <span style="color:red">*</span></label>
            <input type="password" id="reg-password" class="form-control" required placeholder="Minimal 8 karakter">
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
            Daftar Sekarang
          </button>
        </form>
      </div>
    </div>
  `;
}

window.setRegisterRole = function(role) {
  window.registerSelectedRole = role;
  render();
};

window.handleRegisterSubmit = function(e) {
  e.preventDefault();
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const phoneInput = document.getElementById('reg-phone');
  
  const name = nameInput ? nameInput.value.trim() : "Pengguna Baru";
  const email = emailInput ? emailInput.value.trim() : "user@fishery.id";
  const phone = phoneInput ? phoneInput.value.trim() : "0812-0000-0000";
  const isSellerRole = window.registerSelectedRole === 'penjual';

  const newUserId = appState.users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

  if (isSellerRole) {
    const storeNameInput = document.getElementById('reg-store-name');
    const storeAddressInput = document.getElementById('reg-store-address');
    const storeDescInput = document.getElementById('reg-store-desc');

    const storeName = storeNameInput ? storeNameInput.value.trim() : "Toko Nelayan Baru";
    const storeAddress = storeAddressInput ? storeAddressInput.value.trim() : "Pesisir Tanggamus";
    const storeDesc = storeDescInput ? storeDescInput.value.trim() : "Hasil laut segar";

    const newUser = {
      id: newUserId,
      name: name,
      email: email,
      role: 'penjual',
      store_name: storeName,
      store_address: storeAddress,
      store_desc: storeDesc,
      phone: phone,
      verification_status: 'Menunggu',
      is_active: true,
      created_at: nowStr
    };
    appState.users.push(newUser);
    recordLog("REGISTER_SELLER", storeName, `Penjual baru mendaftar (Status: Menunggu Verifikasi)`);
    saveState();
    showToast("Registrasi berhasil! Akun toko Anda berstatus Menunggu Verifikasi Admin.", "success");
    switchRole('seller_pending');
  } else {
    const newUser = {
      id: newUserId,
      name: name,
      email: email,
      role: 'pembeli',
      phone: phone,
      address: "Kabupaten Tanggamus, Lampung",
      is_active: true,
      created_at: nowStr
    };
    appState.users.push(newUser);
    recordLog("REGISTER_BUYER", name, `Pembeli baru mendaftar`);
    saveState();
    showToast("Registrasi berhasil! Selamat datang di Smart Fishery.", "success");
    switchRole('buyer');
  }
};

// --- VIEW: 403 ACCESS DENIED ---
function render403View() {
  return `
    <div class="container">
      <div class="error-view-wrapper">
        <div class="error-code danger">403</div>
        <h2 class="error-title">Akses Ditolak (Forbidden)</h2>
        <p class="error-desc">
          Peran Anda saat ini (${getRoleDisplayName(appState.currentRole)}) tidak memiliki izin hak akses untuk membuka halaman ini sesuai aturan hak akses PRD (FR-02).
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button class="btn btn-outline" onclick="navigateTo('home')">Kembali ke Beranda</button>
          <button class="btn btn-primary" onclick="switchRole('admin')">Beralih ke Peran Admin</button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// 10. APP BOOTSTRAP
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  render();
});

// Global Window Exports for Testing & Debugging
if (typeof window !== 'undefined') {
  window.showToast = showToast;
  window.renderProductCard = renderProductCard;
  window.renderAdminOverviewTab = renderAdminOverviewTab;
  window.renderAdminReportsTab = renderAdminReportsTab;
  window.renderHomeView = renderHomeView;
  window.renderCatalogView = renderCatalogView;
  window.renderProductDetailView = renderProductDetailView;
  window.renderCartView = renderCartView;
  window.renderCheckoutView = renderCheckoutView;
  window.renderBuyerDashboard = renderBuyerDashboard;
  window.renderSellerDashboard = renderSellerDashboard;
  window.renderAdminDashboard = renderAdminDashboard;
  window.formatRupiah = formatRupiah;
  window.getStatusBadge = getStatusBadge;
  window.escapeHtml = escapeHtml;
  window.maskPhone = maskPhone;
  window.maskEmail = maskEmail;
}
