\[LOGO PEMERINTAH KABUPATEN TANGGAMUS\] \[LOGO UNIVERSITAS TEKNOKRAT
INDONESIA\]

PRODUCT REQUIREMENT DOCUMENT

SMART FISHERY

Sistem Informasi Pemasaran dan Pemesanan Hasil Perikanan Berbasis Web di
Kabupaten Tanggamus

Disusun oleh: Rifki Banda Wijaya Program Studi Sistem Informasi
Universitas Teknokrat Indonesia 2026

Dokumen kebutuhan produk untuk acuan desain, pengembangan, pengujian,
dan validasi teknologi Rust dan PostgreSQL.

# Riwayat dan Informasi Dokumen

| Elemen \| Keterangan \|

| --- \| --- \|

| Nama produk \| Smart Fishery \|

| Versi dokumen \| 1.0 \|

| Tanggal \| 10 November 2026 \|

| Pemilik konsep \| Pemerintah Daerah Kabupaten Tanggamus (konsep
  akademik/prototipe) \|

| Penyusun \| Rifki Banda Wijaya \|

| Jenis produk \| Aplikasi web responsif \|

| Status \| Draft PRD untuk pengembangan proyek UTS \|

| Teknologi backend \| Rust \|

| Database \| PostgreSQL \|

# 1. Ringkasan Produk

Smart Fishery adalah aplikasi web yang dirancang untuk mempertemukan
penjual hasil perikanan (nelayan atau pelaku usaha) dengan pembeli di
Kabupaten Tanggamus. Aplikasi menyediakan katalog produk, informasi
harga dan stok, pencarian, keranjang, pemesanan, pengelolaan pesanan,
serta dashboard admin. Sistem ditujukan untuk membantu proses pemasaran
dan pemesanan hasil laut secara digital dan lebih terorganisasi.

Smart Fishery pada tahap MVP berfungsi sebagai platform katalog dan
pemesanan. Pembayaran online terintegrasi, logistik otomatis, dan
integrasi sensor/IoT tidak termasuk ruang lingkup versi awal.

# 2. Latar Belakang dan Permasalahan

Pemasaran hasil perikanan dapat menghadapi kendala berupa jangkauan
promosi yang terbatas, informasi produk dan harga yang tersebar,
kesulitan mengetahui ketersediaan stok, serta pemesanan yang masih
dilakukan melalui komunikasi terpisah. Penjual membutuhkan media untuk
memperbarui produk dan stok, sedangkan pembeli membutuhkan katalog yang
mudah dicari dan informasi pesanan yang dapat dipantau.

Smart Fishery menawarkan satu platform yang mengelola informasi penjual,
produk, stok, dan pesanan dalam satu sistem. Pernyataan permasalahan ini
merupakan asumsi kebutuhan awal proyek dan perlu dikonfirmasi melalui
wawancara atau observasi calon pengguna sebelum implementasi final.

# 3. Tujuan dan Indikator Keberhasilan

| Tujuan \| Indikator keberhasilan MVP \|

| --- \| --- \|

| Memudahkan pemasaran produk \| Penjual dapat membuat, mengubah,
  menonaktifkan, dan melihat produk miliknya. \|

| Memudahkan pencarian produk \| Pembeli dapat menelusuri katalog,
  mencari nama produk, dan memfilter kategori. \|

| Mendukung pemesanan \| Pembeli dapat membuat pesanan dan melihat
  detail serta statusnya. \|

| Membantu pengelolaan stok \| Stok berkurang/terkunci sesuai aturan
  pesanan dan tidak boleh menjadi negatif. \|

| Mendukung pengawasan \| Admin dapat mengelola akun, kategori, produk,
  dan melihat rekap pesanan. \|

| Meningkatkan keterlacakan \| Perubahan status pesanan tercatat beserta
  waktu dan pelakunya. \|

# 4. Target Pengguna dan Hak Akses

| Aktor \| Kebutuhan utama \| Hak akses utama \|

| --- \| --- \| --- \|

| Pengunjung \| Melihat informasi umum dan katalog. \| Melihat beranda,
  katalog, detail produk; belum dapat memesan. \|

| Pembeli \| Mencari dan memesan hasil perikanan. \| Registrasi/login,
  mengelola profil, keranjang, membuat pesanan, melihat riwayat dan
  status pesanan. \|

| Penjual \| Memasarkan produk dan memproses pesanan. \| Mengelola
  profil toko, produk, harga, stok, melihat pesanan yang masuk,
  memperbarui status pesanan. \|

| Admin \| Mengelola dan mengawasi platform. \| Mengelola pengguna,
  verifikasi penjual, kategori, moderasi produk, melihat seluruh pesanan
  dan laporan. \|

# 5. Ruang Lingkup Produk

## 5.1 Termasuk dalam MVP

Beranda berisi pengenalan layanan, kategori, dan produk pilihan.

Registrasi, login, logout, dan pengelolaan profil berdasarkan peran.

Katalog, pencarian, filter kategori, dan halaman detail produk.

Dashboard penjual untuk CRUD produk, harga, foto, dan stok.

Keranjang dan pembuatan pesanan.

Dashboard penjual untuk melihat dan memperbarui status pesanan.

Riwayat pesanan dan pelacakan status oleh pembeli.

Dashboard admin untuk pengguna, verifikasi penjual, kategori, produk,
pesanan, dan ringkasan statistik.

Tampilan responsif untuk desktop dan perangkat seluler.

Penyimpanan kata sandi secara hash, validasi input, dan pembatasan hak
akses.

## 5.2 Tidak Termasuk dalam MVP

Payment gateway dan pencairan dana otomatis.

Pelacakan kurir secara real-time dan integrasi jasa ekspedisi.

Aplikasi native Android/iOS.

Chat real-time antara pembeli dan penjual.

Rekomendasi produk berbasis machine learning.

Integrasi perangkat IoT untuk pemantauan suhu atau kualitas ikan.

# 6. Kebutuhan Fungsional

| ID \| Fitur \| Persyaratan \|

| --- \| --- \| --- \|

| FR-01 \| Autentikasi \| Sistem harus menyediakan registrasi, login,
  dan logout. \|

| FR-02 \| Peran pengguna \| Sistem harus membedakan hak akses admin,
  penjual, dan pembeli. \|

| FR-03 \| Profil \| Pengguna dapat melihat dan memperbarui data profil
  yang diizinkan. \|

| FR-04 \| Verifikasi penjual \| Admin dapat menyetujui atau menolak
  pendaftaran penjual. \|

| FR-05 \| Katalog \| Pengunjung dan pengguna dapat melihat produk
  aktif. \|

| FR-06 \| Pencarian/filter \| Pembeli dapat mencari produk dan
  memfilter berdasarkan kategori. \|

| FR-07 \| Detail produk \| Sistem menampilkan nama, foto, deskripsi,
  harga, satuan, stok, dan identitas toko. \|

| FR-08 \| Kelola produk \| Penjual dapat menambah, melihat, mengubah,
  dan menonaktifkan produk miliknya. \|

| FR-09 \| Kelola stok \| Penjual dapat memperbarui stok; sistem
  mencegah stok bernilai negatif. \|

| FR-10 \| Keranjang \| Pembeli dapat menambah, mengubah jumlah, dan
  menghapus item keranjang. \|

| FR-11 \| Buat pesanan \| Pembeli dapat membuat pesanan dari item
  keranjang yang stoknya mencukupi. \|

| FR-12 \| Kelola pesanan \| Penjual dapat melihat pesanan untuk tokonya
  dan memperbarui status sesuai alur. \|

| FR-13 \| Riwayat pesanan \| Pembeli dapat melihat pesanan miliknya
  beserta detail dan status. \|

| FR-14 \| Pembatalan \| Pembatalan hanya dapat dilakukan sesuai aturan
  status yang ditentukan. \|

| FR-15 \| Dashboard admin \| Admin dapat melihat ringkasan jumlah
  pengguna, produk, dan pesanan. \|

| FR-16 \| Laporan \| Admin dapat melihat dan memfilter rekap pesanan
  berdasarkan periode/status. \|

| FR-17 \| Audit aktivitas \| Sistem mencatat waktu pembuatan dan
  perubahan penting pada data. \|

| FR-18 \| Identitas aplikasi \| Aplikasi menampilkan logo resmi Pemda
  Kabupaten Tanggamus dan logo Universitas Teknokrat Indonesia pada area
  identitas/footer sesuai desain. \|

| FR-19 \| Footer \| Footer aplikasi menampilkan teks persis:
  Copyright©2026 by Rifki Banda Wijaya dan Dr. Erliyan Redy Susanto,
  M.Kom. \|

# 7. Aturan Bisnis dan Alur Status

Hanya penjual yang telah diverifikasi admin yang dapat menerbitkan
produk.

Setiap produk wajib memiliki nama, kategori, harga, satuan, stok,
deskripsi singkat, dan minimal satu foto (foto dapat diwajibkan pada
tahap implementasi).

Harga disimpan sebagai angka desimal/tipe numerik, bukan teks berformat
mata uang.

Pembeli hanya dapat memesan jika stok mencukupi dan produk berstatus
aktif.

Pembuatan pesanan dan pengurangan stok harus dilakukan secara
transaksional agar stok tidak terjual melebihi jumlah tersedia.

Penjual hanya dapat melihat dan mengelola pesanan yang berisi produk
tokonya.

Admin memiliki akses pengawasan, tetapi aktivitas penting tetap dicatat.

Status MVP: Menunggu Konfirmasi → Dikonfirmasi → Diproses → Dikirim →
Selesai. Pesanan dapat menjadi Dibatalkan jika memenuhi aturan
pembatalan.

Jika pesanan dibatalkan setelah stok dikurangi, sistem harus
mengembalikan stok satu kali saja.

| Status \| Makna \| Pihak yang memperbarui \|

| --- \| --- \| --- \|

| Menunggu Konfirmasi \| Pesanan dibuat dan menunggu respons penjual. \|
  Sistem \|

| Dikonfirmasi \| Penjual menerima pesanan. \| Penjual \|

| Diproses \| Produk sedang disiapkan. \| Penjual \|

| Dikirim \| Pesanan diserahkan untuk pengiriman. \| Penjual \|

| Selesai \| Pembeli menerima pesanan atau pesanan ditandai selesai
  sesuai aturan. \| Penjual/Admin atau Pembeli sesuai keputusan desain
  \|

| Dibatalkan \| Pesanan dibatalkan sesuai aturan. \|
  Pembeli/Penjual/Admin sesuai kondisi \|

# 8. Kebutuhan Nonfungsional

| Aspek \| Persyaratan \|

| --- \| --- \|

| Keamanan \| Hash kata sandi dengan algoritma password hashing yang
  sesuai; validasi server-side; query terparameterisasi; otorisasi pada
  setiap endpoint; rahasia disimpan di environment variables. \|

| Kinerja \| Halaman katalog dan dashboard ditargetkan merespons dalam ≤
  3 detik pada kondisi uji normal dan jaringan memadai. \|

| Ketersediaan \| Aplikasi dapat diakses melalui browser modern selama
  layanan hosting dan database tersedia. \|

| Responsif \| Tampilan dapat digunakan pada lebar layar ponsel, tablet,
  dan desktop. \|

| Integritas data \| Relasi memakai foreign key; harga/stok divalidasi;
  perubahan pesanan dan stok memakai transaksi database. \|

| Kemudahan penggunaan \| Navigasi konsisten, label jelas, pesan
  validasi mudah dipahami. \|

| Pemeliharaan \| Kode backend modular, konfigurasi terpisah, migration
  database tersedia, dan log error tidak membocorkan data sensitif. \|

| Privasi \| Data pribadi hanya dikumpulkan sesuai kebutuhan; akses
  dibatasi berdasarkan peran. \|

# 9. Kebutuhan Antarmuka dan Identitas Visual

## 9.1 Halaman yang direncanakan

| Halaman \| Konten utama \|

| --- \| --- \|

| Beranda \| Identitas Smart Fishery, navigasi, pencarian, kategori,
  produk unggulan, informasi layanan. \|

| Katalog \| Daftar produk, pencarian, filter kategori, harga, stok, dan
  tautan detail. \|

| Detail produk \| Foto, nama, deskripsi, harga/satuan, stok, informasi
  penjual, tombol tambah keranjang. \|

| Login/Registrasi \| Form akun, validasi, dan pemilihan/perolehan peran
  sesuai kebijakan. \|

| Keranjang/Checkout \| Daftar item, jumlah, ringkasan pesanan,
  alamat/kontak dan konfirmasi. \|

| Dashboard pembeli \| Riwayat pesanan, detail pesanan, status, dan
  profil. \|

| Dashboard penjual \| Ringkasan toko, CRUD produk, stok, daftar
  pesanan, dan pembaruan status. \|

| Dashboard admin \| Statistik, manajemen pengguna, verifikasi penjual,
  kategori, produk, dan laporan. \|

## 9.2 Logo dan footer wajib

Aplikasi wajib menampilkan dua identitas visual: (1) logo resmi
Pemerintah Kabupaten Tanggamus sebagai identitas pemerintah daerah dan
(2) logo resmi Universitas Teknokrat Indonesia sebagai identitas
institusi pendidikan. Logo ditempatkan secara proporsional pada area
header/identitas aplikasi dan/atau footer sesuai rancangan UI. File logo
final harus menggunakan aset resmi dengan resolusi memadai, tidak direka
ulang, tidak dipotong, dan tidak diubah warna atau proporsinya.

Footer wajib tampil pada halaman aplikasi dan memuat teks berikut secara
persis:

Copyright©2026 by Rifki Banda Wijaya dan Dr. Erliyan Redy Susanto, M.Kom

Catatan implementasi: dokumen PRD ini menetapkan kewajiban penggunaan
logo dan teks footer. Pada tahap desain dan coding, gambar logo resmi
harus dimasukkan sebagai file aset aplikasi. Placeholder logo pada
sampul dokumen ini bukan pengganti file logo final.

# 10. Rancangan Data dan Entitas Database

| Entitas/Tabel \| Atribut inti (rancangan) \| Keterangan \|

| --- \| --- \| --- \|

| users \| id, name, email, password_hash, phone, role, is_active,
  created_at \| Akun admin, penjual, pembeli. \|

| seller_profiles \| id, user_id, store_name, address, description,
  verification_status \| Profil toko/penjual. \|

| categories \| id, name, description, is_active \| Kategori ikan dan
  hasil laut. \|

| products \| id, seller_id, category_id, name, description, price,
  unit, stock, image_url, is_active \| Data produk. \|

| orders \| id, buyer_id, order_number, status, total_amount,
  delivery_address, notes, created_at \| Header pesanan. \|

| order_items \| id, order_id, product_id, seller_id, quantity,
  unit_price, subtotal \| Rincian item; harga disimpan sebagai snapshot
  saat pemesanan. \|

| order_status_history \| id, order_id, old_status, new_status,
  changed_by, note, created_at \| Riwayat perubahan status. \|

| activity_logs \| id, user_id, action, entity_type, entity_id,
  created_at \| Jejak aktivitas penting. \|

Catatan: rancangan ini merupakan model awal. Struktur final, tipe data,
indeks, constraint, dan relasi akan disempurnakan ketika implementasi
dan pengujian dilakukan.

# 11. Validasi Kesesuaian Teknologi Rust dan PostgreSQL

Validasi dilakukan dengan mencocokkan kebutuhan produk dengan kemampuan
teknologi yang dipilih. Hasil validasi awal menunjukkan bahwa Rust dan
PostgreSQL sesuai untuk kebutuhan backend dan pengelolaan data Smart
Fishery.

| Kebutuhan PRD \| Teknologi/komponen \| Hasil validasi \|

| --- \| --- \| --- \|

| API untuk login, katalog, pesanan, dan dashboard \| Rust dengan
  framework web Axum \| Sesuai. Rust dapat membangun layanan HTTP; Axum
  dapat digunakan untuk routing dan handler API. \|

| Akses database secara asynchronous \| SQLx untuk Rust \| Sesuai. SQLx
  menyediakan dukungan driver PostgreSQL dan runtime async seperti
  Tokio. \|

| Penyimpanan akun, produk, kategori, pesanan \| PostgreSQL \| Sesuai.
  Database relasional mendukung tabel, relasi, constraint, dan
  transaksi. \|

| Menjaga stok dan total pesanan tetap konsisten \| Transaksi
  PostgreSQL, constraint, dan locking yang tepat \| Sesuai. Perubahan
  pesanan dan stok dapat dijalankan dalam transaksi agar operasi terkait
  berhasil/gagal bersama. \|

| Validasi struktur database \| SQL migrations + foreign key +
  CHECK/UNIQUE \| Sesuai. Migration dapat mengelola perubahan skema
  secara terkontrol. \|

| Keamanan koneksi database \| TLS, environment variables,
  least-privilege database user \| Sesuai dengan konfigurasi deployment
  yang benar; kredensial tidak boleh ditanam di source code. \|

| Deployment backend Rust \| Vercel Rust Runtime \| Memungkinkan.
  Dokumentasi Vercel menyatakan runtime Rust tersedia dalam Beta;
  implementasi harus mengikuti model serverless functions dan diuji
  dengan batas runtime/connection. \|

Rekomendasi arsitektur: gunakan Rust + Axum untuk API, Tokio sebagai
asynchronous runtime, SQLx dengan fitur PostgreSQL untuk akses database,
dan PostgreSQL sebagai penyimpanan relasional. Frontend dapat
menggunakan HTML, CSS, JavaScript, dan Bootstrap atau framework frontend
yang dipilih pada tahap desain.

Catatan penting deployment: karena soal UTS menentukan Vercel, backend
perlu dirancang mengikuti Rust Functions Vercel, bukan mengasumsikan
server Axum selalu berjalan sebagai proses server jangka panjang.
Gunakan connection pooling yang sesuai dengan lingkungan serverless dan
layanan PostgreSQL yang dapat diakses dari deployment. Uji cold start,
batas waktu eksekusi, koneksi, dan variabel lingkungan sebelum
menyatakan deployment berhasil.

# 12. Rencana API Awal

| Method \| Endpoint \| Fungsi \|

| --- \| --- \| --- \|

| POST \| /api/auth/register \| Registrasi akun. \|

| POST \| /api/auth/login \| Login pengguna. \|

| GET \| /api/products \| Daftar dan pencarian produk aktif. \|

| GET \| /api/products/{id} \| Detail produk. \|

| POST \| /api/seller/products \| Membuat produk (penjual). \|

| PUT \| /api/seller/products/{id} \| Mengubah produk milik penjual. \|

| DELETE \| /api/seller/products/{id} \| Menonaktifkan/menghapus produk
  sesuai aturan. \|

| POST \| /api/orders \| Membuat pesanan. \|

| GET \| /api/orders/me \| Riwayat pesanan pembeli. \|

| PATCH \| /api/seller/orders/{id}/status \| Memperbarui status pesanan.
  \|

| GET \| /api/admin/dashboard \| Ringkasan dashboard admin. \|

| GET \| /api/admin/reports/orders \| Rekap pesanan admin. \|

Endpoint merupakan rancangan awal dan dapat disesuaikan dengan struktur
implementasi.

# 13. Kriteria Penerimaan (Acceptance Criteria)

Pengguna dapat mendaftar dan login; kata sandi tidak disimpan dalam
bentuk teks biasa.

Pengguna dengan peran pembeli tidak dapat membuka endpoint khusus admin
atau penjual.

Penjual yang belum diverifikasi tidak dapat menerbitkan produk.

Produk aktif tampil di katalog dan dapat dicari berdasarkan
nama/kategori.

Penjual hanya dapat mengubah produk yang menjadi miliknya.

Pembeli dapat membuat pesanan hanya jika stok mencukupi.

Dua pesanan bersamaan tidak boleh menyebabkan stok menjadi negatif.

Pembeli hanya dapat melihat pesanan miliknya; penjual hanya dapat
mengelola pesanan yang terkait tokonya.

Perubahan status pesanan tercatat dalam riwayat.

Logo Pemda Kabupaten Tanggamus dan logo Universitas Teknokrat Indonesia
tampil sesuai rancangan.

Footer menampilkan teks Copyright©2026 by Rifki Banda Wijaya dan
Dr. Erliyan Redy Susanto, M.Kom secara persis.

Tampilan utama dapat digunakan pada desktop dan ponsel.

# 14. Risiko, Asumsi, dan Ketergantungan

| Jenis \| Uraian \| Mitigasi \|

| --- \| --- \| --- \|

| Asumsi \| Terdapat penjual/nelayan dan pembeli yang bersedia
  menggunakan platform. \| Validasi kebutuhan melalui wawancara singkat
  atau survei. \|

| Asumsi \| Produk dijual dengan satuan yang dapat ditentukan penjual.
  \| Sediakan pilihan satuan yang konsisten, misalnya kg, ekor, atau
  paket. \|

| Risiko \| Stok produk segar berubah cepat. \| Sediakan pembaruan stok
  dan status aktif/nonaktif produk. \|

| Risiko \| Penyalahgunaan akun atau akses lintas peran. \| Terapkan
  autentikasi, otorisasi server-side, dan pengujian keamanan. \|

| Risiko \| Koneksi database terbatas pada deployment serverless. \|
  Gunakan pool/layanan koneksi yang sesuai dan uji beban koneksi. \|

| Ketergantungan \| Aset logo resmi Pemda dan UTI. \| Gunakan file logo
  resmi dari sumber institusi dan konfirmasi izin/pedoman penggunaannya.
  \|

| Ketergantungan \| Layanan hosting dan PostgreSQL yang kompatibel. \|
  Uji konfigurasi environment, jaringan, TLS, dan migration pada
  staging. \|

# 15. Rencana Pengembangan Bertahap

| Tahap \| Aktivitas \| Output \|

| --- \| --- \| --- \|

| 1. Analisis \| Finalisasi kebutuhan, aktor, alur, dan PRD. \| PRD
  disetujui sebagai acuan. \|

| 2. Desain \| Wireframe dan UI tiap peran. \| Desain beranda, katalog,
  detail, login, dashboard. \|

| 3. Backend & database \| Membangun API Rust dan skema PostgreSQL. \|
  API dan database berjalan. \|

| 4. Frontend \| Membangun halaman dan menghubungkan API. \| Aplikasi
  web terintegrasi. \|

| 5. Testing \| Uji fungsional, integrasi, validasi, dan keamanan awal.
  \| Laporan testing dan daftar bug. \|

| 6. Perbaikan \| Memperbaiki temuan testing dan audit keamanan. \|
  Versi aplikasi yang diperbaiki. \|

| 7. Deployment \| Deploy ke Vercel dan konfigurasi PostgreSQL. \| URL
  aplikasi dan dokumentasi deployment. \|

# 16. Kesimpulan Validasi PRD

Berdasarkan pencocokan kebutuhan fungsional dan nonfungsional, PRD Smart
Fishery dapat diimplementasikan menggunakan Rust sebagai backend dan
PostgreSQL sebagai database. SQLx dapat digunakan sebagai penghubung
asynchronous antara Rust dan PostgreSQL. Kebutuhan katalog, akun, stok,
pemesanan, status pesanan, serta laporan sesuai dengan pendekatan
aplikasi web berbasis API dan database relasional.

Validasi ini merupakan validasi kelayakan teknologi pada tingkat
rancangan, bukan bukti bahwa aplikasi telah selesai dibuat atau diuji.
Pembuktian teknis akan dilakukan pada tahap coding, testing, debugging,
audit keamanan, dan deployment.

# 17. Referensi Teknologi dan Identitas

Vercel. Using the Rust Runtime with Vercel Functions.
https://vercel.com/docs/functions/runtimes/rust

SQLx. Dokumentasi crate SQLx dan dukungan PostgreSQL.
https://docs.rs/sqlx/latest/sqlx/

SQLx. Database support matrix.
https://docs.rs/sqlx/latest/sqlx/database/index.html

Pemerintah Kabupaten Tanggamus. Logo resmi Kabupaten Tanggamus sesuai
Perda Nomor 2 Tahun 1997.
https://tanggamus.go.id/index.php/13-news/1534-logo-resmi-kabupaten-tanggamus-sesuai-peraturan-daerah-2-th-1997

Universitas Teknokrat Indonesia. Website resmi. https://teknokrat.ac.id/
