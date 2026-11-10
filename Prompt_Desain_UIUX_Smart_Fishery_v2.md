# PROMPT DESAIN UI/UX SMART FISHERY (Versi 2, disesuaikan dengan PRD v1.0)

Buat desain UI/UX website yang modern, profesional, responsif, dan mudah digunakan untuk aplikasi **SMART FISHERY**, yaitu Sistem Informasi Pemasaran dan Pemesanan Hasil Perikanan Berbasis Web di Kabupaten Tanggamus.

Aplikasi ini menghubungkan penjual hasil perikanan (nelayan atau pelaku usaha) dengan pembeli melalui katalog produk, informasi harga dan stok, keranjang, pemesanan, serta pengelolaan pesanan. Desain ini menjadi acuan pengembangan dengan backend Rust (Axum) dan database PostgreSQL.

---

## 1. Konsep Desain

- Nama aplikasi: Smart Fishery
- Lokasi: Kabupaten Tanggamus, Lampung, Indonesia
- Jenis aplikasi: aplikasi web responsif (katalog dan pemesanan hasil perikanan, versi MVP)
- Bahasa antarmuka: Bahasa Indonesia
- Gaya: modern, minimalis, profesional, bersih, user-friendly
- Warna utama: biru laut, biru tua, putih, dengan aksen hijau
- Tipografi modern dan mudah dibaca, ikon konsisten, memakai foto hasil perikanan
- Responsif untuk desktop, tablet, dan smartphone
- Satu sistem desain yang konsisten di semua halaman (warna, tombol, kartu, tabel, form, badge)

## 2. Batasan Ruang Lingkup (MVP) - WAJIB DIPATUHI

Desain TIDAK boleh memuat fitur berikut karena di luar MVP:
- Payment gateway, metode pembayaran online, atau pencairan dana otomatis
- Pelacakan kurir real-time atau integrasi ekspedisi
- Chat real-time pembeli-penjual
- Rekomendasi berbasis machine learning
- Integrasi IoT/sensor
- Aplikasi native Android/iOS

Karena tidak ada pembayaran online, gunakan istilah **"Total Pesanan"** atau **"Estimasi Total"**, bukan "Total Pembayaran". Gunakan **"Total Nilai Pesanan"** untuk statistik penjual/admin, bukan "pendapatan terbayar".

## 3. Identitas Aplikasi (Wajib)

Tampilkan di header/area identitas:
1. Logo resmi Pemerintah Kabupaten Tanggamus
2. Logo resmi Universitas Teknokrat Indonesia
3. Nama aplikasi SMART FISHERY
4. Deskripsi: "Sistem Informasi Pemasaran dan Pemesanan Hasil Perikanan Kabupaten Tanggamus"

Ketentuan logo: sediakan area/placeholder berlabel untuk file logo resmi. Jangan membuat logo palsu, jangan direka ulang, dipotong, atau diubah warna dan proporsinya. Kedua logo tampil proporsional dan sejajar.

## 4. Footer Wajib (Semua Halaman)

Seluruh halaman (publik, pembeli, penjual, admin, login/registrasi) harus memiliki footer yang memuat:
- Logo Pemerintah Kabupaten Tanggamus dan logo Universitas Teknokrat Indonesia
- Teks berikut, PERSIS seperti tertulis (termasuk simbol © yang menempel pada "Copyright" dan tanpa perubahan huruf besar/kecil atau tanda baca):

```
Copyright©2026 by Rifki Banda Wijaya dan Dr. Erliyan Redy Susanto, M.Kom
```

Teks harus terlihat jelas, kontras baik, tidak terpotong, dan konsisten di semua halaman. Pada dashboard bersidebar, footer tetap terlihat di area konten utama.

## 5. Peran Pengguna dan Hak Akses

- **Pengunjung**: melihat beranda, katalog, dan detail produk; belum bisa memesan (tombol memesan mengarahkan ke login).
- **Pembeli**: registrasi/login, profil, keranjang, membuat pesanan, riwayat dan status pesanan miliknya sendiri.
- **Penjual**: profil toko, kelola produk/harga/stok, melihat dan memperbarui status pesanan yang berisi produk tokonya saja.
- **Admin**: kelola pengguna, verifikasi penjual, kategori, moderasi produk, seluruh pesanan, laporan, dan statistik.

Desain harus memperlihatkan pembatasan akses ini (menu dan data hanya sesuai peran). Sediakan halaman "Akses Ditolak" (403).

## 6. Halaman Publik dan Pembeli

### A. Beranda
- Header: logo, nama Smart Fishery, menu (Beranda, Katalog Produk, Login/Daftar), kolom pencarian
- Hero section dengan foto hasil laut dan tulisan promosi
- Kategori: Ikan, Udang, Cumi-cumi, Kepiting, Hasil Laut Lainnya
- Produk unggulan
- Informasi layanan (cara kerja: cari, pesan, pantau status)
- Footer wajib

### B. Katalog Produk
- Grid card produk aktif: foto, nama, harga per satuan, stok, nama toko, tombol "Lihat Detail"
- Pencarian nama produk dan filter kategori
- Pengurutan (harga dan terbaru) boleh ada sebagai pelengkap
- Keadaan khusus: hasil pencarian kosong, produk stok habis (badge "Stok Habis", tombol pesan nonaktif)

### C. Detail Produk
- Foto besar, nama, deskripsi, harga dan satuan (kg/ekor/paket), stok
- Identitas toko: nama toko dan lokasi/alamat
- Input jumlah (tidak boleh melebihi stok, pesan validasi jelas)
- Tombol "Tambah ke Keranjang"; pengunjung yang belum login diarahkan ke login
- Pesan error "Stok tidak mencukupi" bila jumlah melebihi stok

### D. Login dan Registrasi
- Form login (email, kata sandi) dengan pesan validasi
- Form registrasi dengan pilihan peran Pembeli atau Penjual
- Untuk Penjual: tambahan nama toko, alamat, deskripsi; setelah daftar tampil status **"Menunggu Verifikasi Admin"** dan penjelasan bahwa produk belum bisa diterbitkan sebelum disetujui
- Kata sandi tidak ditampilkan (ikon tampilkan/sembunyikan)

### E. Keranjang
- Daftar item: foto, nama, toko, harga satuan, ubah jumlah, subtotal, hapus item
- Total Pesanan dan tombol "Lanjut Checkout"
- Peringatan bila stok item berubah/tidak mencukupi

### F. Checkout
- Data pembeli, alamat pengiriman, nomor telepon/kontak, catatan pesanan
- Ringkasan pesanan (harga disimpan sebagai harga saat pemesanan)
- "Total Pesanan" dan tombol "Buat Pesanan"
- Tidak ada pemilihan metode pembayaran online; beri catatan bahwa pembayaran dan pengiriman disepakati langsung dengan penjual
- Halaman/notifikasi sukses pesanan dengan nomor pesanan

## 7. Dashboard Pembeli

Navigasi sederhana (sidebar atau tab) dengan halaman:
- Ringkasan: jumlah pesanan menunggu konfirmasi, diproses, selesai
- Riwayat Pesanan (tabel + filter status)
- Detail Pesanan: item, harga, total, alamat, dan **timeline riwayat perubahan status** (status, waktu, pelaku)
- Tombol "Batalkan Pesanan" hanya tampil bila status mengizinkan (misalnya Menunggu Konfirmasi), disertai dialog konfirmasi dan kolom alasan
- Profil pengguna dan pengaturan akun (ubah data profil yang diizinkan, ubah kata sandi)

## 8. Dashboard Penjual (Sidebar)

- **Dashboard Utama**: total produk, total pesanan, pesanan baru, total nilai pesanan, grafik sederhana, aktivitas pesanan terbaru
- **Manajemen Produk**: tabel produk; form tambah/edit dengan field wajib: nama, kategori, harga (angka), satuan, stok (tidak boleh negatif), deskripsi singkat, minimal satu foto; aksi nonaktifkan/aktifkan produk dengan dialog konfirmasi. Penjual belum terverifikasi melihat banner "Akun belum diverifikasi, produk belum dapat diterbitkan" dan tombol terbitkan dinonaktifkan.
- **Manajemen Stok**: ubah stok cepat dengan validasi tidak boleh negatif
- **Manajemen Pesanan**: daftar pesanan yang berisi produk toko ini saja; detail pesanan (pembeli, item, jumlah, total, alamat); tombol perbarui status mengikuti alur; timeline riwayat status; pembatalan sesuai aturan dengan alasan
- **Profil Toko**: nama toko, nama pemilik, alamat, telepon, deskripsi, logo/foto toko

## 9. Dashboard Admin (Sidebar)

- **Dashboard Utama**: total pengguna, penjual, pembeli, produk, pesanan; grafik statistik; aktivitas terbaru
- **Manajemen Pengguna**: tabel semua pengguna (admin, penjual, pembeli), detail, aktifkan/nonaktifkan akun (dengan konfirmasi)
- **Verifikasi Penjual**: daftar pendaftaran, detail toko, status verifikasi (Menunggu, Disetujui, Ditolak), tombol Setujui dan Tolak (dengan konfirmasi dan alasan)
- **Manajemen Kategori**: tambah, edit, nonaktifkan/hapus kategori
- **Manajemen Produk**: daftar seluruh produk, detail, info penjual, status, moderasi (nonaktifkan produk)
- **Manajemen Pesanan**: seluruh pesanan, detail, pembeli dan penjual, status, riwayat perubahan status
- **Laporan Rekap Pesanan**: filter periode dan status, tabel rekap, ringkasan jumlah
- **Log Aktivitas**: daftar aktivitas penting (waktu, pengguna, aksi, entitas)

## 10. Alur dan Badge Status Pesanan

Alur: Menunggu Konfirmasi → Dikonfirmasi → Diproses → Dikirim → Selesai. Pesanan dapat menjadi Dibatalkan sesuai aturan.

Buat badge berwarna berbeda dan mudah dikenali (tidak hanya mengandalkan warna, sertakan teks/ikon):
1. Menunggu Konfirmasi (kuning/oranye)
2. Dikonfirmasi (biru)
3. Diproses (ungu/biru tua)
4. Dikirim (teal)
5. Selesai (hijau)
6. Dibatalkan (merah)

Tampilkan juga siapa yang boleh mengubah tiap status: Menunggu Konfirmasi dibuat sistem; Dikonfirmasi, Diproses, Dikirim oleh penjual; Selesai oleh penjual/admin/pembeli sesuai keputusan desain; Dibatalkan oleh pembeli/penjual/admin sesuai kondisi.

## 11. Komponen dan Keadaan Antarmuka

- Tabel modern untuk halaman manajemen data (pencarian, filter, paginasi)
- Card untuk produk
- Form tambah/edit dengan validasi inline yang jelas
- Dialog konfirmasi sebelum menghapus/menonaktifkan/menolak/membatalkan
- Notifikasi sukses dan gagal (toast/alert)
- Keadaan kosong (empty state), memuat (loading), dan error
- Halaman 404 dan 403
- Ukuran tombol dan jarak nyaman untuk layar sentuh; kontras warna memadai

## 12. Navigasi dan Konsistensi

- Sidebar pada dashboard Admin dan Penjual; navigasi sederhana pada area Pembeli
- Alur navigasi jelas antarhalaman (beranda → katalog → detail → keranjang → checkout → riwayat pesanan)
- Jangan hanya membuat satu halaman; buat seluruh halaman di atas dalam satu sistem desain
- Tampilan mobile: menu hamburger, sidebar menjadi drawer, tabel dapat digulir atau berubah menjadi kartu

## 13. Hasil Akhir

Hasilkan desain UI/UX lengkap Smart Fishery untuk seluruh halaman dan peran di atas, siap dijadikan acuan pengembangan dengan Rust (Axum) dan PostgreSQL. Prioritaskan tampilan yang realistis, profesional, mudah digunakan, dan sesuai kebutuhan masyarakat, penjual hasil perikanan, serta admin Pemerintah Kabupaten Tanggamus.

Checklist akhir yang harus terpenuhi:
- [ ] Logo Pemda Kabupaten Tanggamus dan logo Universitas Teknokrat Indonesia tampil (header dan footer)
- [ ] Footer di semua halaman: Copyright©2026 by Rifki Banda Wijaya dan Dr. Erliyan Redy Susanto, M.Kom
- [ ] Tidak ada fitur di luar MVP (pembayaran online, chat, IoT, dll.)
- [ ] Enam status pesanan dan riwayat perubahan status tampil
- [ ] Hak akses per peran tercermin di menu dan data
- [ ] Verifikasi penjual dan pembatasan penerbitan produk tampil
- [ ] Validasi stok dan pesan error tampil
- [ ] Responsif desktop, tablet, ponsel
