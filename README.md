# SMART FISHERY - PROTOTIPE WEB HTML (UTS 2026)

**Sistem Informasi Pemasaran dan Pemesanan Hasil Perikanan Berbasis Web di Kabupaten Tanggamus**

- **Disusun oleh:** Rifki Banda Wijaya (Program Studi Sistem Informasi, Universitas Teknokrat Indonesia)
- **Dosen Pembimbing:** Dr. Erliyan Redy Susanto, M.Kom
- **Institusi Terkait:** Pemerintah Daerah Kabupaten Tanggamus & Universitas Teknokrat Indonesia
- **Acuan Dokumen:**
  1. *Product Requirement Document (PRD) Smart Fishery v1.0* (`PRD_Smart_Fishery_Rifki_Banda_Wijaya.md`)
  2. *Prompt Desain UI/UX Smart Fishery v2* (`Prompt_Desain_UIUX_Smart_Fishery_v2.md`)

---

## 🚀 Cara Menjalankan Prototipe (Sangat Mudah / Tidak Perlu Setup Rumit)

Prototipe ini dibuat murni menggunakan **HTML5, CSS3, dan Vanilla JavaScript Modern** yang sepenuhnya *standalone* dan dapat dibuka langsung di browser:

1. Buka folder proyek di File Explorer komputer Anda: `c:\Users\ASUS\Downloads\anty\`
2. Klik ganda (**double-click**) pada file **`index.html`**.
3. File akan langsung terbuka di browser favorit Anda (Google Chrome, Microsoft Edge, Firefox, Safari) dengan seluruh fitur, navigasi, dan interaksi yang berjalan 100% tanpa perlu Node.js, Web Server, atau koneksi internet eksternal!

---

## 🎯 Fitur Simulator Peran (Demo Quick-Switch Bar)

Pada bagian paling atas halaman, terdapat bilah bar **"Simulator Peran PRD (UTS 2026)"** untuk mempermudah dosen penguji atau reviewer menguji seluruh hak akses sesuai PRD FR-02:

| Tombol Peran | Akun Pengguna | Hak Akses & Fitur yang Diuji |
| :--- | :--- | :--- |
| **👁️ Pengunjung** | Tamu / Guest | Melihat beranda, katalog, dan detail produk. Tombol pesan/keranjang akan mengarahkan ke halaman login. |
| **🛒 Pembeli** | Budi Santoso | Keranjang belanja, checkout alamat Tanggamus, riwayat pesanan, pembatalan pesanan (stok dikembalikan), dan pelacakan riwayat status. |
| **⚓ Penjual Terverifikasi** | Toko Bahari Kota Agung (Slamet Riyadi) | Dashboard dengan sidebar: CRUD produk, kelola stok (+/- cepat tanpa minus), kelola pesanan masuk tokonya, dan memajukan status pesanan. |
| **⏳ Penjual Baru (Pending)** | Kelompok Nelayan Semaka (Hasanudin) | Menguji aturan PRD: **Banner peringatan belum diverifikasi admin** tampil mencolok dan tombol terbitkan produk **dinonaktifkan**. |
| **🏛️ Admin Pemda** | Rifki Banda Wijaya | Dashboard admin dengan sidebar: verifikasi pendaftaran penjual (Setujui/Tolak), kelola akun pengguna, moderasi produk, seluruh pesanan, laporan rekap, dan audit log. |
| **🔄 Reset Data** | — | Mengembalikan data demonstrasi ke pengaturan awal (default state). |

---

## 📋 Checklist Kepatuhan PRD & Desain UI/UX v2

### 1. Identitas Visual Resmi (PRD FR-18 & Prompt Seksi 3)
- [x] **Logo Resmi Pemda Kabupaten Tanggamus** (sesuai Perda No. 2 Tahun 1997) di header dan footer.
- [x] **Logo Resmi Universitas Teknokrat Indonesia** di header dan footer.
- [x] Tampil sejajar, proporsional, dan dilengkapi label identitas institusi.

### 2. Footer Wajib (PRD FR-19 & Prompt Seksi 4)
- [x] Footer tampil di **seluruh halaman aplikasi** (termasuk dashboard bersidebar).
- [x] Memuat teks berikut **secara persis**:
  ```
  Copyright©2026 by Rifki Banda Wijaya dan Dr. Erliyan Redy Susanto, M.Kom
  ```

### 3. Batasan Ruang Lingkup MVP (PRD Seksi 5 & Prompt Seksi 2)
- [x] **TIDAK ada payment gateway online** (tidak ada pilihan kartu kredit, virtual account, e-wallet).
- [x] Menggunakan istilah resmi **"Total Pesanan"** atau **"Estimasi Total"** (bukan "Total Pembayaran").
- [x] Menggunakan istilah **"Total Nilai Pesanan"** pada statistik dashboard (bukan "pendapatan terbayar").
- [x] Banner edukasi di keranjang & checkout: Pembayaran & pengiriman disepakati langsung secara COD/transfer manual saat nelayan mengonfirmasi pesanan.

### 4. Enam Status Pesanan & Jejak Audit (PRD Seksi 7 & Prompt Seksi 10)
Alur status dan badge dengan ikon & warna standar:
1. `Menunggu Konfirmasi` (Kuning/Oranye) — Dibuat oleh sistem saat pembeli checkout.
2. `Dikonfirmasi` (Biru) — Diperbarui oleh penjual saat menerima pesanan.
3. `Diproses` (Ungu/Biru Tua) — Diperbarui oleh penjual saat ikan disiapkan/dipacking es.
4. `Dikirim` (Teal) — Diperbarui oleh penjual saat kurir lokal berangkat.
5. `Selesai` (Hijau) — Ditandai oleh pembeli/penjual saat hasil laut diterima segar.
6. `Dibatalkan` (Merah) — Pembeli dapat membatalkan jika status masih *Menunggu Konfirmasi* (stok otomatis dikembalikan).

### 5. Aturan Bisnis & Validasi Data (PRD FR-08, FR-09, FR-11)
- [x] **Validasi Stok Positif:** Stok tidak boleh bernilai negatif; sistem mencegah pengurangan stok di bawah 0.
- [x] **Pembelian Terikat Stok:** Pembeli tidak dapat memesan kuantitas melebihi stok yang tersedia.
- [x] **Snapshot Harga:** Harga pesanan disimpan sebagai nilai snapshot saat pemesanan dibuat.
- [x] **Pengembalian Stok:** Pembatalan pesanan mengembalikan kuantitas stok produk sebanyak 1 kali.
- [x] **Halaman 403:** Perlindungan rute berdasarkan peran (contoh: pengunjung mencoba membuka panel admin akan diarahkan ke halaman 403 Akses Ditolak).

---

## 📁 Struktur Berkas Prototipe

```
anty/
│
├── index.html                                 # Halaman master utama & router tampilan
├── README.md                                  # Dokumentasi lengkap panduan pengujian
├── PRD_Smart_Fishery_Rifki_Banda_Wijaya.md    # Dokumen PRD v1.0
├── Prompt_Desain_UIUX_Smart_Fishery_v2.md     # Dokumen Prompt Desain UI/UX v2
│
├── css/
│   └── style.css                              # Desain tema biru laut, tata letak responsif, tabel, kartu, badge, modal, toast
│
├── js/
│   └── app.js                                 # State database lokal (localStorage), logika alur pesanan, CRUD produk, verifikasi, log
│
├── logo/                                      # Berkas logo asli yang dimasukkan pengguna
│   ├── Lambang_Kabupaten_Tanggamus.png        # Logo resmi Pemerintah Kabupaten Tanggamus
│   └── download (3).png                       # Logo resmi Universitas Teknokrat Indonesia
│
└── assets/                                    # Aset ilustrasi vektor & ikon kategori perikanan
    ├── hero-bg.svg                            # Ilustrasi pesisir Teluk Semaka & Gunung Tanggamus
    ├── cat-ikan.svg                           # Ikon Kategori Ikan Laut Segar
    ├── cat-udang.svg                          # Ikon Kategori Udang & Lobster
    ├── cat-cumi.svg                           # Ikon Kategori Cumi-cumi & Gurita
    ├── cat-kepiting.svg                       # Ikon Kategori Kepiting & Rajungan
    ├── cat-olahan.svg                         # Ikon Kategori Hasil Olahan Laut
    ├── prod-tongkol.svg                       # Ilustrasi produk Ikan Tongkol Segar
    ├── prod-udang.svg                         # Ilustrasi produk Udang Vaname Super
    ├── prod-kerapu.svg                        # Ilustrasi produk Ikan Kerapu Cantik
    ├── prod-cumi.svg                          # Ilustrasi produk Cumi-cumi Sero
    ├── prod-kepiting.svg                      # Ilustrasi produk Kepiting Bakau
    └── prod-tenggiri.svg                      # Ilustrasi produk Tenggiri Giling Murni
```

---

## 🛠️ Langkah Uji Skenario Pengujian (Demonstrasi UTS)

1. **Skenario 1 - Pengunjung Menjelajah & Mencoba Memesan:**
   - Pilih peran `Pengunjung`.
   - Buka menu *Katalog Produk*, coba filter kategori *Udang & Lobster* atau cari kata kunci "Tongkol".
   - Buka *Lihat Detail*, klik *Tambah ke Keranjang*. Sistem akan menampilkan toast peringatan dan mengarahkan ke form Login.

2. **Skenario 2 - Pembeli Membuat Pesanan:**
   - Klik peran `Pembeli` di bar atas.
   - Buka *Katalog*, pilih *Ikan Tongkol Segar Tangkapan Pagi*, tentukan jumlah (misal 3 kg), lalu klik *Tambah ke Keranjang*.
   - Buka ikon Keranjang di pojok kanan atas, klik *Lanjut ke Checkout*.
   - Lengkapi alamat Tanggamus (contoh: Kec. Gisting), lalu klik *Buat Pesanan*.
   - Notifikasi sukses muncul dengan Nomor Pesanan baru (contoh: `SF-20261110-XXXX`). Stok ikan tongkol di katalog langsung berkurang secara otomatis!

3. **Skenario 3 - Penjual Memproses Pesanan & Mengubah Status:**
   - Klik peran `Penjual Terverifikasi (Toko Bahari)`.
   - Di sidebar, pilih menu *Pesanan Masuk*. Pesanan baru yang dibuat Pembeli tampil dengan status `Menunggu Konfirmasi`.
   - Klik tombol **Terima & Konfirmasi** &rarr; status berubah menjadi `Dikonfirmasi`.
   - Klik **Mulai Proses (Packing)** &rarr; status berubah menjadi `Diproses`.
   - Klik **Kirim ke Pembeli** &rarr; status berubah menjadi `Dikirim`.
   - Buka *Rincian & Timeline*, terlihat riwayat waktu, nama pelaku, dan perubahan status secara lengkap.

4. **Skenario 4 - Pembeli Menerima Pesanan & Pembatalan:**
   - Kembali ke peran `Pembeli`, buka *Pesanan Saya*.
   - Pada pesanan berstatus *Dikirim*, klik **Konfirmasi Terima** &rarr; status berubah menjadi `Selesai`.
   - Pada pesanan lain yang masih *Menunggu Konfirmasi*, klik tombol **Batalkan**. Masukkan alasan pembatalan. Pesanan menjadi `Dibatalkan` dan stok produk otomatis dikembalikan ke katalog!

5. **Skenario 5 - Penjual Belum Terverifikasi & Verifikasi Admin:**
   - Klik peran `Penjual Baru (Menunggu Verifikasi)`.
   - Perhatikan banner peringatan: *Akun Nelayan Sedang Menunggu Verifikasi Admin*. Tombol *Tambah Produk Baru* dalam keadaan dinonaktifkan (disabled).
   - Klik peran `Admin Pemda (Rifki Banda)`, buka menu *Verifikasi Penjual*.
   - Klik tombol **Setujui** pada *Kelompok Nelayan Teluk Semaka*. Toko tersebut kini berstatus terverifikasi!
   - Buka menu *Log Aktivitas* untuk melihat jejak audit seluruh transaksi dan perubahan.

---

## 🧪 Hasil Testing, Debugging & Perbaikan Vibe Coding (Tahap 6 & 7)

Aplikasi telah melalui serangkaian pengujian otomatis mendalam menggunakan `test-suite.js` (44 Test Cases, 100% PASS) dan seluruh hasil temuan telah diperbaiki secara tuntas pada kode sumber utama:

| ID Cacat / Bug | Komponen | Perbaikan Vibe Coding yang Diterapkan | Status |
| :--- | :--- | :--- | :---: |
| **BUG-01** | Logo Resmi (FR-18) | Menghubungkan logo asli `Lambang_Kabupaten_Tanggamus.png` dan `download (3).png` ke header, favicon, dan footer. | **RESOLVED** |
| **BUG-02** | CRUD Edit Produk (FR-08) | Menambahkan fungsi `openEditProductModal()` dan `handleUpdateProduct()` dengan pre-fill data lama dan validasi form. | **RESOLVED** |
| **BUG-03** | Batas Kuantitas (FR-07/10) | Memasang pembatasan `max="${product.stock}"` dan `Math.min(max, val)` pada stepper kuantitas detail produk dan keranjang. | **RESOLVED** |
| **BUG-04** | Single Stock Refund (FR-14) | Menerapkan proteksi `stock_refunded` agar pembatalan pesanan hanya merestorasi stok tepat satu kali. | **RESOLVED** |
| **BUG-05** | Stok Negatif (FR-09) | Menambahkan boundary check `if (newStock < 0)` pada tombol shortcut `-5` stok agar tidak pernah minus. | **RESOLVED** |
| **BUG-06** | RBAC Checkout (FR-02) | Menambahkan auth guard pada `navigateTo()` untuk mengalihkan pengunjung tanpa login ke halaman login. | **RESOLVED** |
| **BUG-07** | State Machine (FR-12) | Menegakkan matriks transisi 6 status pesanan legal agar status tidak dapat melompat secara ilegal. | **RESOLVED** |
| **BUG-08** | Penjual Pending (FR-04) | Pengecekan dinamis `verification_status === 'Disetujui'` sebelum mengizinkan pembukaan modal tambah produk. | **RESOLVED** |
| **BUG-09** | Terminologi Finansial (PRD 3.1) | Mengubah istilah menjadi "Total Nilai Pesanan" (tanpa payment gateway) pada seluruh statistik. | **RESOLVED** |
| **BUG-10** | ID Audit Log (FR-17) | Mengubah kalkulasi ID log menjadi auto-increment berbasis `Math.max(...l.id) + 1`. | **RESOLVED** |
| **BUG-11** | Reset Filter (FR-06) | Mengosongkan nilai input DOM `#catalog-search-input` saat pengguna menekan tombol "Reset Filter". | **RESOLVED** |
| **BUG-12** | Global Window Exports | Mengekspos fungsi render dan state ke objek window untuk unit testing otomatis headless. | **RESOLVED** |

### Menjalankan Automated Test Suite:
```powershell
node test-suite.js
```
*Hasil Uji: TOTAL 44 | PASSED: 44 | FAILED: 0 (Tingkat Keberhasilan 100%)*

### Dokumen Laporan Resmi DOCX:
Dokumen laporan lengkap tersedia pada file:  
**`Laporan_Testing_dan_Debugging_Smart_Fishery_Rifki_Banda_Wijaya.docx`**

---

## 🛡️ Hasil Audit Keamanan Sistem (Tahap 8)

Audit keamanan berbasis standar **OWASP Top 10 (2021)**, STRIDE Threat Modeling, dan PRD Kebutuhan Keamanan Bagian 8 telah dilaksanakan:

- **Automated Security Audit Suite:** [`security-audit-suite.js`](file:///c:/Users/ASUS/Downloads/anty/security-audit-suite.js) (14 Kontrol Keamanan, 100% PASS).
- **Pengerasan Frontend (Security Hardening):** Fungsi sanitasi `escapeHtml()` anti-XSS, HTTP security headers (`X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Referrer-Policy`), pertahanan batas bawah stok non-negatif, dan proteksi alur transisi pesanan.
- **Rekomendasi Arsitektur Backend:** Spesifikasi hashing password *Argon2id*, otentikasi stateless *JWT HttpOnly SameSite=Strict*, middleware otorisasi RBAC Rust Axum, dan row-level locking PostgreSQL (`SELECT ... FOR UPDATE`).
- **Dokumen Laporan Audit Security DOCX:**  
  [`Laporan_Audit_Security_Smart_Fishery_Rifki_Banda_Wijaya.docx`](file:///c:/Users/ASUS/Downloads/anty/Laporan_Audit_Security_Smart_Fishery_Rifki_Banda_Wijaya.docx)

### Menjalankan Security Audit Test Suite:
```powershell
node security-audit-suite.js
```
*Hasil Audit: TOTAL 14 | PASSED: 14 | FAILED: 0 (100% Passed)*

---

## 🔒 Perbaikan Kode Berdasarkan Audit Security (Tahap 9)

Seluruh kerentanan dan kelemahan keamanan yang teridentifikasi dalam laporan audit keamanan (Tahap 8) telah diperbaiki dan dilakukan pengerasan (*security hardening*) secara komprehensif pada berkas [`js/app.js`](file:///c:/Users/ASUS/Downloads/anty/js/app.js) dan [`index.html`](file:///c:/Users/ASUS/Downloads/anty/index.html):

| ID Temuan | Kategori OWASP | Deskripsi Kerentanan | Tindakan Remediasi / Perbaikan Kode | Status |
| :--- | :--- | :--- | :--- | :---: |
| **SEC-01** | OWASP A03: Injection | Resiko DOM-based & Stored XSS pada rendering data dinamis. | Menerapkan fungsi `escapeHtml()` pada seluruh interpolasi template literals dan sanitasi pesan toast UI. | **REMEDIATED** |
| **SEC-02** | OWASP A01: Broken Access Control | Potensi IDOR (Insecure Direct Object Reference) pada mutasi produk/stok. | Menambahkan validasi kepemilikan toko (`prod.seller_id === currentSellerId`) pada `handleUpdateProduct()` & `quickUpdateStock()`. | **REMEDIATED** |
| **SEC-03** | OWASP A01: Broken Access Control | Potensi manipulasi status pesanan lintas toko penjual lain. | Menerapkan validasi guard kepemilikan pesanan pada `advanceOrderStatus()` dan `showOrderDetailsModal()`. | **REMEDIATED** |
| **SEC-04** | OWASP A02: Cryptographic Failures | Ekspos data sensitif (PII) nomor telepon & email pengguna. | Menambahkan fungsi utilitas `maskPhone()` dan `maskEmail()` untuk menyamarkan PII pada antarmuka publik dan struk. | **REMEDIATED** |
| **SEC-05** | OWASP A04: Insecure Design | Duplikasi pengembalian stok pada pembatalan pesanan berulang. | Menerapkan validasi atomik `stock_refunded === true` dan pembatasan mutasi stok non-negatif. | **REMEDIATED** |
| **SEC-06** | OWASP A05: Security Misconfiguration | Tidak adanya Content Security Policy (CSP) dan HTTP Security Headers. | Memasang tag `<meta http-equiv="Content-Security-Policy">` Level 3, `X-Content-Type-Options`, `X-XSS-Protection`, dan `X-Frame-Options`. | **REMEDIATED** |
| **SEC-07** | OWASP A07: Auth & Identification | Kerentanan serangan Brute-Force pada form login otentikasi. | Menerapkan rate-limiting sisi klien: pelacakan percobaan gagal, lockout 30 detik setelah 5 kegagalan berturut-turut, dan validasi panjang password. | **REMEDIATED** |
| **SEC-08** | OWASP A08: Software & Data Integrity | Manipulasi status pesanan melompati tahapan state machine PRD. | Penegakan matriks transisi state machine pada `advanceOrderStatus()` dan tombol pembatalan. | **REMEDIATED** |
| **SEC-09** | OWASP A09: Security Logging & Monitoring | Kurangnya metadata keparahan (*severity*) dan asal permintaan pada audit log. | Memperluas fungsi `recordLog()` dengan parameter `severity` (`INFO`, `WARN`, `SECURITY_ALERT`), `ip_origin`, dan `user_agent`. | **REMEDIATED** |

### Hasil Verifikasi Pasca-Remediasi:
- **Functional & Regression Test Suite:** 44/44 PASS (`node test-suite.js`)
- **Security Audit Test Suite:** 14/14 PASS (`node security-audit-suite.js`)
- **Regresi Sistem:** 0 regresi terdeteksi, integritas state 100% terjaga.

### Dokumen Laporan Resmi Perbaikan Security DOCX:
Dokumen laporan perbaikan keamanan lengkap dan formal telah disusun sesuai format akademik/profesional:  
📁 [**`Laporan_Perbaikan_Security_Smart_Fishery_Rifki_Banda_Wijaya.docx`**](file:///c:/Users/ASUS/Downloads/anty/Laporan_Perbaikan_Security_Smart_Fishery_Rifki_Banda_Wijaya.docx)

---

Dokumen prototipe ini dibuat untuk memenuhi standar penilaian UTS mata kuliah Sistem Informasi tahun 2026 dengan acuan arsitektur backend Rust dan PostgreSQL.

