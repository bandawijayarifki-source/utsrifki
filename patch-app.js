const fs = require('fs');

let code = fs.readFileSync('js/app.js', 'utf8');

// 1. Expose appState to window
code = code.replace(
  `let appState = JSON.parse(localStorage.getItem('smart_fishery_db')) || DEFAULT_STATE;

function saveState() {
  localStorage.setItem('smart_fishery_db', JSON.stringify(appState));
}

// Reset state utility
window.resetDemoData = function() {
  if (confirm("Reset seluruh data ke pengaturan awal PRD?")) {
    localStorage.removeItem('smart_fishery_db');
    appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState();`,
  `let appState = JSON.parse(localStorage.getItem('smart_fishery_db')) || DEFAULT_STATE;
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
    saveState();`
);

// 2. recordLog ID calculation
code = code.replace(
  `  const newLog = {
    id: appState.activityLogs.length + 1,`,
  `  const newLogId = appState.activityLogs.reduce((max, l) => Math.max(max, l.id), 0) + 1;
  const newLog = {
    id: newLogId,`
);

// 3. navigateTo parameter & auth checks
const oldNavigateTo = `window.navigateTo = function(view, params = {}) {
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
  
  if (params.productId) appState.selectedProductId = params.productId;
  if (params.orderId) appState.selectedOrderId = params.orderId;

  appState.currentView = view;
  saveState();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
};`;

const newNavigateTo = `window.navigateTo = function(view, params = {}) {
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
};`;

code = code.replace(oldNavigateTo, newNavigateTo);

// 4. Valid status transitions & advanceOrderStatus & executeCancelOrder
const oldStatusSection = `// ==========================================================================
// 5. STATUS TRANSITIONS & CANCELLATION (PRD Section 7 & Design Prompt v2)
// ==========================================================================
window.advanceOrderStatus = function(orderId, newStatus) {
  const order = appState.orders.find(o => o.id === orderId);
  if (!order) return;

  const oldStatus = order.status;
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  let changedBy = "Penjual (Slamet Riyadi)";
  if (appState.currentRole === 'admin') changedBy = "Admin (Rifki Banda Wijaya)";
  if (appState.currentRole === 'buyer') changedBy = "Pembeli (Budi Santoso)";

  order.status = newStatus;
  order.history.push({
    old_status: oldStatus,
    new_status: newStatus,
    changed_by: changedBy,
    time: nowStr,
    note: \`Status diperbarui dari "\${oldStatus}" menjadi "\${newStatus}"\`
  });

  recordLog("UPDATE_ORDER_STATUS", \`Pesanan #\${order.order_number}\`, \`Status: \${newStatus}\`);
  saveState();
  showToast(\`Status pesanan #\${order.order_number} berhasil diubah ke: \${newStatus}\`, "success");
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

  const modalHtml = \`
    <div class="modal-backdrop show" id="cancelModalBackdrop">
      <div class="modal-dialog">
        <div class="modal-header">
          <h4 class="modal-title">Konfirmasi Pembatalan Pesanan</h4>
          <button class="modal-close-btn" onclick="closeModal('cancelModalBackdrop')">&times;</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.9rem; margin-bottom: 12px;">
            Apakah Anda yakin ingin membatalkan pesanan <strong>#\${order.order_number}</strong>?
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
          <button class="btn btn-danger" onclick="executeCancelOrder(\${orderId})">Batalkan Pesanan</button>
        </div>
      </div>
    </div>
  \`;
  document.getElementById('modal-container').innerHTML = modalHtml;
};

window.executeCancelOrder = function(orderId) {
  const reason = document.getElementById('cancelReasonInput').value.trim();
  if (!reason) {
    showToast("Alasan pembatalan wajib diisi!", "error");
    return;
  }

  const order = appState.orders.find(o => o.id === orderId);
  if (!order) return;

  const oldStatus = order.status;
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  let changedBy = "Pembeli (Budi Santoso)";
  if (appState.currentRole === 'seller') changedBy = "Penjual (Slamet Riyadi)";
  if (appState.currentRole === 'admin') changedBy = "Admin (Rifki Banda Wijaya)";

  // Single stock refund rule (PRD Section 7)
  order.items.forEach(item => {
    const prod = appState.products.find(p => p.id === item.product_id);
    if (prod) {
      prod.stock += item.quantity; // Restore stock
    }
  });

  order.status = "Dibatalkan";
  order.history.push({
    old_status: oldStatus,
    new_status: "Dibatalkan",
    changed_by: changedBy,
    time: nowStr,
    note: \`Pesanan dibatalkan. Alasan: \${reason}. Stok dikembalikan.\`
  });

  recordLog("CANCEL_ORDER", \`Pesanan #\${order.order_number}\`, \`Alasan: \${reason}\`);
  saveState();
  closeModal('cancelModalBackdrop');
  showToast(\`Pesanan #\${order.order_number} berhasil dibatalkan dan stok dikembalikan.\`, "info");
  render();
};`;

const newStatusSection = `// ==========================================================================
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

  const oldStatus = order.status;
  const allowed = VALID_STATUS_TRANSITIONS[oldStatus] || [];
  if (!allowed.includes(newStatus)) {
    showToast(\`Transisi status dari "\${oldStatus}" ke "\${newStatus}" tidak valid sesuai alur PRD!\`, "error");
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
    note: \`Status diperbarui dari "\${oldStatus}" menjadi "\${newStatus}"\`
  });

  recordLog("UPDATE_ORDER_STATUS", \`Pesanan #\${order.order_number}\`, \`Status: \${newStatus}\`);
  saveState();
  showToast(\`Status pesanan #\${order.order_number} berhasil diubah ke: \${newStatus}\`, "success");
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
    showToast(\`Pesanan berstatus \${order.status} tidak dapat dibatalkan!\`, "error");
    return;
  }

  const modalHtml = \`
    <div class="modal-backdrop show" id="cancelModalBackdrop">
      <div class="modal-dialog">
        <div class="modal-header">
          <h4 class="modal-title">Konfirmasi Pembatalan Pesanan</h4>
          <button class="modal-close-btn" onclick="closeModal('cancelModalBackdrop')">&times;</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.9rem; margin-bottom: 12px;">
            Apakah Anda yakin ingin membatalkan pesanan <strong>#\${order.order_number}</strong>?
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
          <button class="btn btn-danger" onclick="executeCancelOrder(\${orderId})">Batalkan Pesanan</button>
        </div>
      </div>
    </div>
  \`;
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
  order.items.forEach(item => {
    const prod = appState.products.find(p => p.id === item.product_id);
    if (prod) {
      prod.stock += item.quantity; // Restore stock
    }
  });

  order.status = "Dibatalkan";
  order.history.push({
    old_status: oldStatus,
    new_status: "Dibatalkan",
    changed_by: changedBy,
    time: nowStr,
    note: \`Pesanan dibatalkan. Alasan: \${reason}. Stok berhasil dikembalikan.\`
  });

  recordLog("CANCEL_ORDER", \`Pesanan #\${order.order_number}\`, \`Alasan: \${reason} (Stok dikembalikan)\`);
  saveState();
  closeModal('cancelModalBackdrop');
  showToast(\`Pesanan #\${order.order_number} berhasil dibatalkan dan stok dikembalikan.\`, "info");
  render();
};`;

code = code.replace(oldStatusSection, newStatusSection);

// 5. OpenAddProductModal & handleSaveProduct: Dynamic verification status check and validation
const oldProductCrud = `window.openAddProductModal = function() {
  // Unverified seller check
  if (appState.currentRole === 'seller_pending') {
    showToast("Akun Anda belum diverifikasi admin. Anda belum dapat menerbitkan produk baru!", "warning");
    return;
  }

  const modalHtml = \`
    <div class="modal-backdrop show" id="productModal">
      <div class="modal-dialog">
        <div class="modal-header">
          <h4 class="modal-title">Tambah Produk Hasil Perikanan</h4>
          <button class="modal-close-btn" onclick="closeModal('productModal')">&times;</button>
        </div>
        <form onsubmit="handleSaveProduct(event)">`;

const newProductCrud = `window.openAddProductModal = function() {
  const currentSeller = appState.users.find(u => u.id === (appState.currentRole === 'seller_pending' ? 3 : 2));
  const isPending = currentSeller ? currentSeller.verification_status !== 'Disetujui' : false;

  // Unverified seller check conforming to PRD Aturan Bisnis 1
  if (isPending) {
    showToast("Akun Anda belum diverifikasi admin. Anda belum dapat menerbitkan produk baru!", "warning");
    return;
  }

  const modalHtml = \`
    <div class="modal-backdrop show" id="productModal">
      <div class="modal-dialog">
        <div class="modal-header">
          <h4 class="modal-title">Tambah Produk Hasil Perikanan</h4>
          <button class="modal-close-btn" onclick="closeModal('productModal')">&times;</button>
        </div>
        <form onsubmit="handleSaveProduct(event)">`;

code = code.replace(oldProductCrud, newProductCrud);

// 6. handleSaveProduct validation and dynamic seller
const oldHandleSave = `window.handleSaveProduct = function(e) {
  e.preventDefault();
  const name = document.getElementById('prod-name').value.trim();
  const catId = parseInt(document.getElementById('prod-cat').value);
  const price = parseInt(document.getElementById('prod-price').value);
  const unit = document.getElementById('prod-unit').value;
  const stock = parseInt(document.getElementById('prod-stock').value);
  const desc = document.getElementById('prod-desc').value.trim();
  const img = document.getElementById('prod-img').value;

  if (stock < 0) {
    showToast("Stok tidak boleh bernilai negatif!", "error");
    return;
  }

  const category = appState.categories.find(c => c.id === catId);

  const newProd = {
    id: appState.products.length + 1,
    seller_id: 2,
    store_name: "Toko Bahari Kota Agung",
    store_location: "Kota Agung, Tanggamus",
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
  };`;

const newHandleSave = `window.handleSaveProduct = function(e) {
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
  };`;

code = code.replace(oldHandleSave, newHandleSave);

// 7. handleUpdateProduct bounds check
code = code.replace(
  `  if (stock < 0) {
    showToast("Stok tidak boleh bernilai negatif!", "error");
    return;
  }`,
  `  if (isNaN(stock) || stock < 0) {
    showToast("Stok tidak boleh bernilai negatif!", "error");
    return;
  }
  if (isNaN(price) || price < 1000) {
    showToast("Harga satuan minimal Rp 1.000!", "error");
    return;
  }`
);

// 8. quickUpdateStock logging
code = code.replace(
  `  prod.stock = newStock;
  saveState();`,
  `  prod.stock = newStock;
  recordLog("UPDATE_STOCK", \`Produk "\${prod.name}"\`, \`Stok diubah menjadi \${newStock} \${prod.unit} (\${delta > 0 ? '+' : ''}\${delta})\`);
  saveState();`
);

// 9. resetCatalogFilters clearing search input
code = code.replace(
  `window.resetCatalogFilters = function() {
  window.catalogFilterCat = "all";
  window.catalogSortBy = "default";
  render();
};`,
  `window.resetCatalogFilters = function() {
  window.catalogFilterCat = "all";
  window.catalogSortBy = "default";
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) searchInput.value = "";
  render();
};`
);

// 10. processCheckoutOrder order ID calculation
code = code.replace(
  `  const newOrder = {
    id: appState.orders.length + 1,`,
  `  const newOrderId = appState.orders.reduce((max, o) => Math.max(max, o.id), 0) + 1;
  const newOrder = {
    id: newOrderId,`
);

// 11. renderSellerDashboard dynamic isPending and seller orders/products
const oldSellerDash = `function renderSellerDashboard() {
  const isPending = appState.currentRole === 'seller_pending';
  const activeTab = window.sellerDashboardTab || 'products';

  // Seller store products
  const myProducts = appState.products.filter(p => p.seller_id === (isPending ? 3 : 2));
  // Seller store orders
  const myOrders = appState.orders.filter(o => o.seller_id === 2);`;

const newSellerDash = `function renderSellerDashboard() {
  const currentSellerUser = appState.users.find(u => u.id === (appState.currentRole === 'seller_pending' ? 3 : 2));
  const isPending = currentSellerUser ? currentSellerUser.verification_status !== 'Disetujui' : false;
  const activeTab = window.sellerDashboardTab || 'products';

  const currentSellerId = currentSellerUser ? currentSellerUser.id : 2;
  // Seller store products
  const myProducts = appState.products.filter(p => p.seller_id === currentSellerId);
  // Seller store orders
  const myOrders = appState.orders.filter(o => o.seller_id === currentSellerId);`;

code = code.replace(oldSellerDash, newSellerDash);

// 12. Register form inputs & submission
const oldRegisterView = `<form onsubmit="handleRegisterSubmit(event)">
          <div class="form-group">
            <label class="form-label">Nama Lengkap <span style="color:red">*</span></label>
            <input type="text" class="form-control" required placeholder="Contoh: Ahmad Yani">
          </div>

          <div class="form-group">
            <label class="form-label">Alamat Email <span style="color:red">*</span></label>
            <input type="email" class="form-control" required placeholder="nama@email.com">
          </div>

          <div class="form-group">
            <label class="form-label">Nomor WhatsApp / HP Aktif <span style="color:red">*</span></label>
            <input type="tel" class="form-control" required placeholder="08xxxxxxxxxx">
          </div>

          <!-- Specific Fields for Seller -->
          \${isSellerRole ? \`
            <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-navy); margin-bottom: 12px;">Data Toko / Usaha Nelayan</h4>
              
              <div class="form-group">
                <label class="form-label">Nama Toko / Kelompok Nelayan <span style="color:red">*</span></label>
                <input type="text" class="form-control" required placeholder="Contoh: Toko Nelayan Pesisir Limau">
              </div>

              <div class="form-group">
                <label class="form-label">Alamat Pangkalan / Dermaga di Tanggamus <span style="color:red">*</span></label>
                <textarea class="form-control" rows="2" required placeholder="Contoh: Dermaga TPI Kota Agung RT 02 / RW 01"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Deskripsi Usaha & Komoditas Utama <span style="color:red">*</span></label>
                <textarea class="form-control" rows="2" required placeholder="Jenis tangkapan, alat tangkap ramah lingkungan, dll"></textarea>
              </div>

              <div class="mvp-notice-banner warning" style="margin-bottom: 0;">
                <div class="notice-icon">⚠️</div>
                <div class="notice-text">
                  <h5>Penting: Status Verifikasi Admin</h5>
                  <p>Setelah mendaftar, akun toko Anda akan berstatus <strong>"Menunggu Verifikasi Admin"</strong>. Anda baru dapat menerbitkan produk di katalog setelah disetujui oleh Admin Pemkab Tanggamus.</p>
                </div>
              </div>
            </div>
          \` : ''}

          <div class="form-group">
            <label class="form-label">Kata Sandi <span style="color:red">*</span></label>
            <input type="password" class="form-control" required placeholder="Minimal 8 karakter">
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
            Daftar Sekarang
          </button>
        </form>`;

const newRegisterView = `<form onsubmit="handleRegisterSubmit(event)">
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
          \${isSellerRole ? \`
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
          \` : ''}

          <div class="form-group">
            <label class="form-label">Kata Sandi <span style="color:red">*</span></label>
            <input type="password" id="reg-password" class="form-control" required placeholder="Minimal 8 karakter">
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
            Daftar Sekarang
          </button>
        </form>`;

code = code.replace(oldRegisterView, newRegisterView);

const oldHandleRegister = `window.handleRegisterSubmit = function(e) {
  e.preventDefault();
  if (window.registerSelectedRole === 'penjual') {
    showToast("Registrasi berhasil! Akun toko Anda berstatus Menunggu Verifikasi Admin.", "success");
    switchRole('seller_pending');
  } else {
    showToast("Registrasi berhasil! Selamat datang di Smart Fishery.", "success");
    switchRole('buyer');
  }
};`;

const newHandleRegister = `window.handleRegisterSubmit = function(e) {
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
    recordLog("REGISTER_SELLER", storeName, \`Penjual baru mendaftar (Status: Menunggu Verifikasi)\`);
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
    recordLog("REGISTER_BUYER", name, \`Pembeli baru mendaftar\`);
    saveState();
    showToast("Registrasi berhasil! Selamat datang di Smart Fishery.", "success");
    switchRole('buyer');
  }
};`;

code = code.replace(oldHandleRegister, newHandleRegister);

// 13. Add Category Modal & Handler, Profile Handlers, Admin Reports Filter
const extraFunctions = `
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
  const modalHtml = \`
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
  \`;
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
  recordLog("ADD_CATEGORY", name, \`Penambahan kategori baru: \${slug}\`);
  saveState();
  closeModal('categoryModal');
  showToast(\`Kategori "\${name}" berhasil ditambahkan!\`, "success");
  render();
};

window.filterAdminReports = function(period, status) {
  if (period !== undefined) window.adminReportPeriod = period;
  if (status !== undefined) window.adminReportStatus = status;
  render();
};
`;

code = code.replace(
  '// ==========================================================================\n// 8. RENDERER DISPATCHER',
  extraFunctions + '\n// ==========================================================================\n// 8. RENDERER DISPATCHER'
);

// 14. Buyer profile form wiring
code = code.replace(
  `<form onsubmit="event.preventDefault(); showToast('Data profil berhasil diperbarui!', 'success');">
            <div class="form-group">
              <label class="form-label">Nama Lengkap</label>
              <input type="text" class="form-control" value="Budi Santoso">
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" value="budi.santoso@gmail.com" readonly style="background: #f1f5f9;">
            </div>
            <div class="form-group">
              <label class="form-label">No. Telepon / WhatsApp</label>
              <input type="text" class="form-control" value="0812-7788-9900">
            </div>
            <div class="form-group">
              <label class="form-label">Alamat Utama di Tanggamus</label>
              <textarea class="form-control" rows="2">Jl. Merdeka No. 12, Pekon Gisting Bawah, Kec. Gisting, Kab. Tanggamus</textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Simpan Perubahan</button>
          </form>`,
  `<form onsubmit="handleUpdateBuyerProfile(event)">
            <div class="form-group">
              <label class="form-label">Nama Lengkap</label>
              <input type="text" id="buyer-profile-name" class="form-control" value="\${(appState.users.find(u => u.id === 4) || {}).name || 'Budi Santoso'}">
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" value="\${(appState.users.find(u => u.id === 4) || {}).email || 'budi.santoso@gmail.com'}" readonly style="background: #f1f5f9;">
            </div>
            <div class="form-group">
              <label class="form-label">No. Telepon / WhatsApp</label>
              <input type="text" id="buyer-profile-phone" class="form-control" value="\${(appState.users.find(u => u.id === 4) || {}).phone || '0812-7788-9900'}">
            </div>
            <div class="form-group">
              <label class="form-label">Alamat Utama di Tanggamus</label>
              <textarea id="buyer-profile-address" class="form-control" rows="2">\${(appState.users.find(u => u.id === 4) || {}).address || 'Jl. Merdeka No. 12, Pekon Gisting Bawah, Kec. Gisting, Kab. Tanggamus'}</textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-sm">Simpan Perubahan</button>
          </form>`
);

// 15. Seller profile form wiring
code = code.replace(
  `<form onsubmit="event.preventDefault(); showToast('Data toko berhasil disimpan!', 'success');">
          <div class="form-group">
            <label class="form-label">Nama Toko / Usaha Perikanan</label>
            <input type="text" class="form-control" value="\${isPending ? 'Kelompok Nelayan Teluk Semaka' : 'Toko Bahari Kota Agung'}">
          </div>
          <div class="form-group">
            <label class="form-label">Nama Pemilik / Penanggung Jawab</label>
            <input type="text" class="form-control" value="\${isPending ? 'Hasanudin' : 'Slamet Riyadi'}">
          </div>
          <div class="form-group">
            <label class="form-label">Alamat Dermaga / Pangkalan Pendaratan Ikan</label>
            <textarea class="form-control" rows="2">\${isPending ? 'Pesisir Way Kerap, Kec. Semaka, Tanggamus' : 'Dermaga 2 Pelabuhan Perikanan Kota Agung, Tanggamus'}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Nomor WhatsApp / Kontak Toko</label>
            <input type="text" class="form-control" value="\${isPending ? '0821-8844-3321' : '0852-6987-1122'}">
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi Profil Usaha</label>
            <textarea class="form-control" rows="3">Penyedia hasil perikanan laut segar harian tangkapan nelayan lokal Tanggamus.</textarea>
          </div>
          <button type="submit" class="btn btn-primary">Simpan Profil Toko</button>
        </form>`,
  `<form onsubmit="handleUpdateSellerProfile(event)">
          <div class="form-group">
            <label class="form-label">Nama Toko / Usaha Perikanan</label>
            <input type="text" id="seller-profile-store" class="form-control" value="\${currentSellerUser ? currentSellerUser.store_name : (isPending ? 'Kelompok Nelayan Teluk Semaka' : 'Toko Bahari Kota Agung')}">
          </div>
          <div class="form-group">
            <label class="form-label">Nama Pemilik / Penanggung Jawab</label>
            <input type="text" id="seller-profile-name" class="form-control" value="\${currentSellerUser ? currentSellerUser.name : (isPending ? 'Hasanudin' : 'Slamet Riyadi')}">
          </div>
          <div class="form-group">
            <label class="form-label">Alamat Dermaga / Pangkalan Pendaratan Ikan</label>
            <textarea id="seller-profile-address" class="form-control" rows="2">\${currentSellerUser ? currentSellerUser.store_address : (isPending ? 'Pesisir Way Kerap, Kec. Semaka, Tanggamus' : 'Dermaga 2 Pelabuhan Perikanan Kota Agung, Tanggamus')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Nomor WhatsApp / Kontak Toko</label>
            <input type="text" id="seller-profile-phone" class="form-control" value="\${currentSellerUser ? currentSellerUser.phone : (isPending ? '0821-8844-3321' : '0852-6987-1122')}">
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi Profil Usaha</label>
            <textarea id="seller-profile-desc" class="form-control" rows="3">\${currentSellerUser ? (currentSellerUser.store_desc || 'Penyedia hasil perikanan laut segar harian tangkapan nelayan lokal Tanggamus.') : 'Penyedia hasil perikanan laut segar harian tangkapan nelayan lokal Tanggamus.'}</textarea>
          </div>
          <button type="submit" class="btn btn-primary">Simpan Profil Toko</button>
        </form>`
);

// 16. Admin Category add button wiring
code = code.replace(
  `<button class="btn btn-primary btn-sm" onclick="showToast('Fitur penambahan kategori disimulasikan sesuai PRD', 'info')">+ Tambah Kategori</button>`,
  `<button class="btn btn-primary btn-sm" onclick="openAddCategoryModal()">+ Tambah Kategori</button>`
);

// 17. Admin Reports Tab with dynamic filtering
const oldReportsTab = `function renderAdminReportsTab(totalSales) {
  return \`
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Laporan Rekapitulasi Pesanan (FR-16)</h3>
        <button class="btn btn-outline btn-sm" onclick="window.print()">🖨️ Cetak / Ekspor Laporan</button>
      </div>
      <div class="card-body">
        <div style="display: flex; gap: 14px; margin-bottom: 20px; flex-wrap: wrap;">
          <div>
            <label class="form-label" style="font-size: 0.775rem;">Filter Periode</label>
            <select class="form-control" style="font-size: 0.8rem;">
              <option>Bulan November 2026 (Bulan Berjalan)</option>
              <option>Seluruh Periode 2026</option>
            </select>
          </div>
          <div>
            <label class="form-label" style="font-size: 0.775rem;">Status</label>
            <select class="form-control" style="font-size: 0.8rem;">
              <option>Semua Status</option>
              <option>Selesai Saja</option>
            </select>
          </div>
        </div>

        <div style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
            <span>Total Nilai Pesanan Terdata:</span>
            <strong style="color: var(--color-primary-dark); font-size: 1.25rem;">\${formatRupiah(totalSales)}</strong>
          </div>
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
              \${appState.orders.map(o => \`
                <tr>
                  <td>\${o.order_number}</td>
                  <td>\${o.created_at}</td>
                  <td>\${o.store_name}</td>
                  <td>\${o.buyer_name}</td>
                  <td>\${getStatusBadge(o.status)}</td>
                  <td style="font-weight: 700;">\${formatRupiah(o.total_amount)}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  \`;
}`;

const newReportsTab = `function renderAdminReportsTab(totalSales) {
  const selectedPeriod = window.adminReportPeriod || "all";
  const selectedStatus = window.adminReportStatus || "all";

  let filteredOrders = [...appState.orders];
  if (selectedStatus !== "all") {
    filteredOrders = filteredOrders.filter(o => o.status === selectedStatus);
  }

  const filteredTotal = filteredOrders.reduce((sum, o) => sum + o.total_amount, 0);

  return \`
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
              <option value="all" \${selectedPeriod === 'all' ? 'selected' : ''}>Seluruh Periode 2026</option>
              <option value="current" \${selectedPeriod === 'current' ? 'selected' : ''}>Bulan November 2026 (Bulan Berjalan)</option>
            </select>
          </div>
          <div>
            <label class="form-label" style="font-size: 0.775rem;">Status Pesanan</label>
            <select class="form-control" style="font-size: 0.8rem;" onchange="filterAdminReports(undefined, this.value)">
              <option value="all" \${selectedStatus === 'all' ? 'selected' : ''}>Semua Status (\${appState.orders.length})</option>
              <option value="Menunggu Konfirmasi" \${selectedStatus === 'Menunggu Konfirmasi' ? 'selected' : ''}>Menunggu Konfirmasi</option>
              <option value="Dikonfirmasi" \${selectedStatus === 'Dikonfirmasi' ? 'selected' : ''}>Dikonfirmasi</option>
              <option value="Diproses" \${selectedStatus === 'Diproses' ? 'selected' : ''}>Diproses</option>
              <option value="Dikirim" \${selectedStatus === 'Dikirim' ? 'selected' : ''}>Dikirim</option>
              <option value="Selesai" \${selectedStatus === 'Selesai' ? 'selected' : ''}>Selesai Saja</option>
              <option value="Dibatalkan" \${selectedStatus === 'Dibatalkan' ? 'selected' : ''}>Dibatalkan Saja</option>
            </select>
          </div>
        </div>

        <div style="background: var(--bg-surface); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.95rem;">
            <span>Total Nilai Pesanan Terdata (Sesuai Filter):</span>
            <strong style="color: var(--color-primary-dark); font-size: 1.25rem;">\${formatRupiah(filteredTotal)}</strong>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Menampilkan \${filteredOrders.length} dari total \${appState.orders.length} pesanan</div>
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
              \${filteredOrders.length === 0 ? \`
                <tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--text-muted);">Tidak ada pesanan yang sesuai dengan kriteria filter.</td></tr>
              \` : filteredOrders.map(o => \`
                <tr>
                  <td>\${o.order_number}</td>
                  <td>\${o.created_at}</td>
                  <td>\${o.store_name}</td>
                  <td>\${o.buyer_name}</td>
                  <td>\${getStatusBadge(o.status)}</td>
                  <td style="font-weight: 700;">\${formatRupiah(o.total_amount)}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  \`;
}`;

code = code.replace(oldReportsTab, newReportsTab);

fs.writeFileSync('js/app.js', code, 'utf8');
console.log('Successfully patched js/app.js!');
