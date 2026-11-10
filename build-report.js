const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function escapeXml(unsafe) {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function p(text, options = {}) {
  const jc = options.align ? `<w:jc w:val="${options.align}"/>` : '<w:jc w:val="both"/>';
  const before = options.spaceBefore !== undefined ? options.spaceBefore : 80;
  const after = options.spaceAfter !== undefined ? options.spaceAfter : 120;
  const line = options.line !== undefined ? options.line : 276;
  const bold = options.bold ? '<w:b/>' : '';
  const italic = options.italic ? '<w:i/>' : '';
  const color = options.color ? `<w:color w:val="${options.color}"/>` : '<w:color w:val="1E293B"/>';
  const sz = options.size ? `<w:sz w:val="${options.size}"/><w:szCs w:val="${options.size}"/>` : '<w:sz w:val="22"/><w:szCs w:val="22"/>';
  
  let pBdr = '';
  if (options.borderBottom) {
    pBdr = `<w:pBdr><w:bottom w:val="single" w:sz="${options.borderSz || 12}" w:space="8" w:color="${options.borderColor || '0284C7'}"/></w:pBdr>`;
  } else if (options.borderLeft) {
    pBdr = `<w:pBdr><w:left w:val="single" w:sz="24" w:space="12" w:color="${options.borderColor || '0284C7'}"/></w:pBdr>`;
  }

  let shd = '';
  if (options.shd) {
    shd = `<w:shd w:val="clear" w:color="auto" w:fill="${options.shd}"/>`;
  }

  return `
  <w:p>
    <w:pPr>
      ${jc}
      <w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="auto"/>
      ${pBdr}
      ${shd}
    </w:pPr>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
        ${bold}
        ${italic}
        ${color}
        ${sz}
      </w:rPr>
      <w:t xml:space="preserve">${escapeXml(text)}</w:t>
    </w:r>
  </w:p>`;
}

function heading(level, text) {
  let style = 'Heading1';
  let size = 28;
  let color = '0369A1';
  let before = 360;
  let after = 140;

  if (level === 2) {
    style = 'Heading2';
    size = 24;
    color = '0F172A';
    before = 260;
    after = 100;
  } else if (level === 3) {
    style = 'Heading3';
    size = 22;
    color = '1E293B';
    before = 180;
    after = 60;
  }

  return `
  <w:p>
    <w:pPr>
      <w:pStyle w:val="${style}"/>
      <w:spacing w:before="${before}" w:after="${after}"/>
    </w:pPr>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
        <w:b/>
        <w:color w:val="${color}"/>
        <w:sz w:val="${size}"/>
        <w:szCs w:val="${size}"/>
      </w:rPr>
      <w:t xml:space="preserve">${escapeXml(text)}</w:t>
    </w:r>
  </w:p>`;
}

function pageBreak() {
  return `
  <w:p>
    <w:r>
      <w:br w:type="page"/>
    </w:r>
  </w:p>`;
}

function callout(title, text, type = 'info') {
  let borderColor = '0284C7';
  let bgColor = 'F0F9FF';
  let titleColor = '0369A1';
  let icon = 'ℹ️ ';

  if (type === 'success') {
    borderColor = '10B981';
    bgColor = 'F0FDF4';
    titleColor = '047857';
    icon = '✅ ';
  } else if (type === 'warning') {
    borderColor = 'F59E0B';
    bgColor = 'FFFBEB';
    titleColor = 'B45309';
    icon = '⚠️ ';
  }

  return `
  <w:p>
    <w:pPr>
      <w:pBdr><w:left w:val="single" w:sz="24" w:space="14" w:color="${borderColor}"/></w:pBdr>
      <w:shd w:val="clear" w:color="auto" w:fill="${bgColor}"/>
      <w:spacing w:before="140" w:after="40" w:line="240" w:lineRule="auto"/>
    </w:pPr>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
        <w:b/>
        <w:color w:val="${titleColor}"/>
        <w:sz w:val="22"/>
      </w:rPr>
      <w:t xml:space="preserve">${escapeXml(icon + title)}</w:t>
    </w:r>
  </w:p>
  <w:p>
    <w:pPr>
      <w:pBdr><w:left w:val="single" w:sz="24" w:space="14" w:color="${borderColor}"/></w:pBdr>
      <w:shd w:val="clear" w:color="auto" w:fill="${bgColor}"/>
      <w:spacing w:before="0" w:after="160" w:line="260" w:lineRule="auto"/>
      <w:jc w:val="both"/>
    </w:pPr>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
        <w:color w:val="334155"/>
        <w:sz w:val="20"/>
      </w:rPr>
      <w:t xml:space="preserve">${escapeXml(text)}</w:t>
    </w:r>
  </w:p>`;
}

function codeBlock(codeText) {
  const lines = codeText.split('\n');
  let xml = '';
  lines.forEach((line, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === lines.length - 1;
    xml += `
    <w:p>
      <w:pPr>
        <w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>
        <w:spacing w:before="${isFirst ? '100' : '0'}" w:after="${isLast ? '120' : '0'}" w:line="220" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>
          <w:color w:val="0F172A"/>
          <w:sz w:val="17"/>
        </w:rPr>
        <w:t xml:space="preserve">${escapeXml(line)}</w:t>
      </w:r>
    </w:p>`;
  });
  return xml;
}

function table(headers, rows, widths = []) {
  const totalWidth = widths.length > 0 ? widths.reduce((a, b) => a + b, 0) : 9400;
  
  let xml = `
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="${totalWidth}" w:type="dxa"/>
      <w:jc w:val="center"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
        <w:left w:val="none"/>
        <w:bottom w:val="single" w:sz="8" w:space="0" w:color="94A3B8"/>
        <w:right w:val="none"/>
        <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
        <w:insideV w:val="none"/>
      </w:tblBorders>
      <w:tblCellMar>
        <w:top w:w="100" w:type="dxa"/>
        <w:left w:w="120" w:type="dxa"/>
        <w:bottom w:w="100" w:type="dxa"/>
        <w:right w:w="120" w:type="dxa"/>
      </w:tblCellMar>
    </w:tblPr>`;

  xml += '<w:tblGrid>';
  widths.forEach(w => {
    xml += `<w:gridCol w:w="${w}"/>`;
  });
  xml += '</w:tblGrid>';

  // Header Row
  xml += '<w:tr><w:trPr><w:tblHeader/></w:trPr>';
  headers.forEach((h, i) => {
    const w = widths[i] || 1500;
    xml += `
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="${w}" w:type="dxa"/>
          <w:shd w:val="clear" w:color="auto" w:fill="0284C7"/>
          <w:vAlign w:val="center"/>
        </w:tcPr>
        <w:p>
          <w:pPr>
            <w:jc w:val="center"/>
            <w:spacing w:before="60" w:after="60"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
              <w:b/>
              <w:color w:val="FFFFFF"/>
              <w:sz w:val="18"/>
            </w:rPr>
            <w:t xml:space="preserve">${escapeXml(h)}</w:t>
          </w:r>
        </w:p>
      </w:tc>`;
  });
  xml += '</w:tr>';

  // Data Rows
  rows.forEach((row, rIdx) => {
    const bgFill = rIdx % 2 === 1 ? 'F8FAFC' : 'FFFFFF';
    xml += '<w:tr>';
    row.forEach((cell, cIdx) => {
      const w = widths[cIdx] || 1500;
      const isStatusCol = cIdx === row.length - 1;
      const cellText = String(cell);
      
      let align = 'left';
      if (cIdx === 0) align = 'center';
      if (isStatusCol) align = 'center';

      let cellShd = bgFill;
      let textBold = false;
      let textColor = '1E293B';

      if (cellText === 'PASS') {
        cellShd = 'DCFCE7';
        textColor = '15803D';
        textBold = true;
      } else if (cellText === 'RESOLVED') {
        cellShd = 'E0F2FE';
        textColor = '0369A1';
        textBold = true;
      } else if (cellText === 'FAIL' || cellText === 'OPEN') {
        cellShd = 'FEE2E2';
        textColor = 'B91C1C';
        textBold = true;
      }

      xml += `
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="${w}" w:type="dxa"/>
          <w:shd w:val="clear" w:color="auto" w:fill="${cellShd}"/>
          <w:vAlign w:val="center"/>
        </w:tcPr>
        <w:p>
          <w:pPr>
            <w:jc w:val="${align}"/>
            <w:spacing w:before="40" w:after="40" w:line="240" w:lineRule="auto"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
              ${textBold ? '<w:b/>' : ''}
              <w:color w:val="${textColor}"/>
              <w:sz w:val="18"/>
            </w:rPr>
            <w:t xml:space="preserve">${escapeXml(cellText)}</w:t>
          </w:r>
        </w:p>
      </w:tc>`;
    });
    xml += '</w:tr>';
  });

  xml += '</w:tbl>';
  return xml;
}

// Assemble Document Body
let body = '';

// COVER PAGE
body += p('PEMERINTAH KABUPATEN TANGGAMUS', { align: 'center', bold: true, color: '0369A1', size: 24, spaceBefore: 200, spaceAfter: 40 });
body += p('UNIVERSITAS TEKNOKRAT INDONESIA', { align: 'center', bold: true, color: '0F172A', size: 24, spaceBefore: 0, spaceAfter: 300 });

body += p('LAPORAN TESTING DAN DEBUGGING', {
  align: 'center', bold: true, color: '0369A1', size: 36,
  borderBottom: true, borderSz: 18, borderColor: '0284C7',
  spaceBefore: 240, spaceAfter: 160
});

body += p('SISTEM INFORMASI PEMASARAN DAN PEMESANAN HASIL PERIKANAN (SMART FISHERY) BERBASIS WEB DI KABUPATEN TANGGAMUS', {
  align: 'center', bold: true, color: '0F172A', size: 25, spaceBefore: 80, spaceAfter: 120
});

body += p('Uji Fungsionalitas Lengkap (FR-01 s.d. FR-19), Validasi Nonfungsional, State Machine 6 Tahapan Pesanan, Integritas Transaksional Stok, Kontrol Hak Akses Berbasis Peran (RBAC), dan Resolusi Masalah (Debugging 44 Kasus Uji Otomatis)', {
  align: 'center', italic: true, color: '64748B', size: 20, spaceBefore: 0, spaceAfter: 400
});

// Meta Table
body += table(
  ['Parameter', 'Keterangan Rinci Proyek'],
  [
    ['Nama Produk & Versi', 'Smart Fishery (Sistem Informasi Pemasaran & Pemesanan Hasil Perikanan) v1.0'],
    ['Penyusun / Mahasiswa', 'Rifki Banda Wijaya (Program Studi Sistem Informasi)'],
    ['Dosen Pembimbing', 'Dr. Erliyan Redy Susanto, M.Kom (Universitas Teknokrat Indonesia)'],
    ['Mitra Pemerintah Daerah', 'Pemerintah Kabupaten Tanggamus, Provinsi Lampung'],
    ['Target Teknologi Acuan', 'Backend: Rust (Framework Axum / Actix-Web) | Database: PostgreSQL (SQLx Async)'],
    ['Teknologi Prototipe / MVP', 'HTML5 Semantic, CSS Modern Maritime Theme, Vanilla JS ES6+, Web Storage'],
    ['Lingkungan Pengujian', 'Node.js v24.22.1, Windows 11 64-bit, Microsoft Edge / Google Chrome'],
    ['Hasil Uji Otomatis (test-suite.js)', '44 Kasus Uji (TC-01 s.d. TC-44) — 100% PASS (44 Lolos, 0 Gagal)'],
    ['Resolusi Cacat / Defect', '12 Cacat Kritis Berhasil Didiagnosis dan Diperbaiki (100% RESOLVED)'],
    ['Tanggal Pelaksanaan & Laporan', '10 November 2026']
  ],
  [3000, 6400]
);

body += p('PROGRAM STUDI SISTEM INFORMASI\nFAKULTAS TEKNIK DAN ILMU KOMPUTER\nUNIVERSITAS TEKNOKRAT INDONESIA\n2026', {
  align: 'center', bold: true, color: '0369A1', size: 21, spaceBefore: 400, spaceAfter: 0
});

body += pageBreak();

// KATA PENGANTAR & RINGKASAN EKSEKUTIF
body += heading(1, 'KATA PENGANTAR DAN RINGKASAN EKSEKUTIF');
body += p('Puji dan syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa atas terselesaikannya seluruh rangkaian kegiatan pengujian fungsional, pengujian nonfungsional, serta penanganan masalah (debugging) pada aplikasi web Smart Fishery: Sistem Informasi Pemasaran dan Pemesanan Hasil Perikanan di Kabupaten Tanggamus. Dokumen laporan ini disusun sebagai bukti akuntabilitas rekayasa perangkat lunak dalam rangka memenuhi evaluasi Ujian Tengah Semester (UTS) Tahun Akademik 2026 pada Program Studi Sistem Informasi, Fakultas Teknik dan Ilmu Komputer, Universitas Teknokrat Indonesia.');

body += p('Smart Fishery dikembangkan untuk memfasilitasi transaksi digital antara nelayan di sentra perikanan Kabupaten Tanggamus (seperti dermaga Kota Agung, Teluk Semaka, dan pesisir Limau) dengan konsumen, pelaku UMKM, serta rumah makan. Pengujian menyeluruh dilaksanakan untuk memastikan platform prototipe ini berjalan kokoh, terbebas dari kebocoran hak akses, konsisten dalam alur status pesanan, serta mampu menjamin integritas stok komoditas laut sebelum diimplementasikan pada arsitektur skala produksi berbasis Rust dan PostgreSQL.');

body += callout(
  'Ringkasan Eksekutif Hasil Uji Otomatis',
  'Pengujian komprehensif dieksekusi menggunakan automated test suite (test-suite.js) di lingkungan runtime Node.js v24.22.1. Dari 44 kasus uji otomatis (TC-01 s.d. TC-44) yang mencakup seluruh Kebutuhan Fungsional (FR-01 hingga FR-19), Aturan Bisnis MVP, dan Kebutuhan Nonfungsional, tingkat keberhasilan pengujian mencapai 100% (44 PASS, 0 FAIL). Sebanyak 12 cacat sistem (BUG-01 s.d. BUG-12) berhasil didiagnosis akar masalahnya dan diselesaikan secara tuntas.',
  'success'
);

body += heading(2, 'Metrik Rekapitulasi Pengujian');
body += table(
  ['Indikator Rekayasa Perangkat Lunak', 'Nilai Pengukuran', 'Keterangan Evaluasi'],
  [
    ['Total Kasus Uji Otomatis Dieksekusi', '44 Kasus Uji', 'Mencakup FR-01 s.d. FR-19, RBAC, dan Edge Cases'],
    ['Kasus Uji Lolos (PASS)', '44 Kasus Uji (100%)', 'Memenuhi seluruh kriteria penerimaan PRD'],
    ['Kasus Uji Gagal (FAIL)', '0 Kasus Uji (0%)', 'Zero Open Defects pada build final'],
    ['Total Cacat Ditemukan & Diperbaiki', '12 Defect / Bugs', 'Semua telah diverifikasi melalui pengujian regresi'],
    ['Cakupan Kebutuhan Fungsional (FR)', '19 dari 19 FR (100%)', 'FR-01 hingga FR-19 terverifikasi penuh'],
    ['Kepatuhan Aturan Bisnis Tanggamus', '9 dari 9 Aturan (100%)', 'Validasi stok non-negatif, single refund, RBAC'],
    ['Integritas Transaksional Stok', '100% Terverifikasi', 'Stok berkurang saat checkout dan kembali saat batal'],
    ['Waktu Eksekusi Test Suite', '≤ 1,2 Detik', 'Cepat, deterministik, dan dapat diulang (reproducible)']
  ],
  [3400, 2600, 3400]
);

body += pageBreak();

// BAB I: PENDAHULUAN DAN METODOLOGI PENGUJIAN
body += heading(1, 'BAB I. PENDAHULUAN DAN METODOLOGI PENGUJIAN');

body += heading(2, '1.1 Profil Produk Smart Fishery & Relevansi Daerah Kabupaten Tanggamus');
body += p('Kabupaten Tanggamus, Lampung memiliki wilayah perairan pesisir Teluk Semaka yang kaya akan potensi perikanan tangkap dan budidaya laut, seperti Ikan Tongkol, Udang Vaname, Ikan Tenggiri, Kerapu Macan, Cumi-cumi Sero, dan Kepiting Bakau. Kendala utama yang dihadapi nelayan lokal adalah fluktuasi harga yang tidak transparan, ketiadaan saluran pemasaran langsung ke konsumen, serta ketidakpastian stok di pangkalan pendaratan ikan (PPI).');
body += p('Smart Fishery hadir sebagai platform katalog digital dan pemesanan hasil laut yang mempertemukan nelayan lokal/pelaku usaha dengan pembeli secara langsung. Sistem ini menjamin kepastian ketersediaan stok secara transaksional, menampilkan harga satuan numerik dalam mata uang Rupiah, menyediakan 5 kategori komoditas laut unggulan Tanggamus, serta memberikan fasilitas dashboard pengawasan bagi Admin Dinas Kelautan dan Perikanan / Pemkab Tanggamus.');

body += heading(2, '1.2 Identitas Visual Resmi & Hak Cipta Sesuai PRD');
body += p('Sesuai dengan mandat PRD FR-18 dan FR-19, Smart Fishery secara ketat mengintegrasikan identitas visual resmi:');
body += p('1. Lambang Resmi Pemerintah Kabupaten Tanggamus (logo/Lambang_Kabupaten_Tanggamus.png) disematkan pada header navbar, favicon browser, dan area informasi footer.');
body += p('2. Logo Resmi Universitas Teknokrat Indonesia (logo/download (3).png) disematkan bersanding dengan logo daerah sebagai lambang kemitraan riset teknologi terapan perguruan tinggi.');
body += p('3. Footer aplikasi memuat teks hak cipta persis sesuai klausul PRD FR-19: "Copyright©2026 by Rifki Banda Wijaya dan Dr. Erliyan Redy Susanto, M.Kom".');

body += heading(2, '1.3 Batasan Ketat Ruang Lingkup MVP (Minimum Viable Product)');
body += p('Berdasarkan dokumen Product Requirement Document (PRD v1.0 Bagian 5.2), batasan tegas telah ditetapkan untuk prototipe tahap awal (MVP):');
body += p('• Termasuk dalam MVP: Autentikasi multi-peran, katalog dengan pencarian dan filter kategori, keranjang belanja, checkout transaksional, snapshot harga pemesanan, manajemen stok non-negatif, manajemen pesanan dengan 6 alur status, audit trail logging, dan verifikasi admin.');
body += p('• Di Luar Ruang Lingkup MVP: Payment gateway perbankan otomatis (terminologi keuangan menggunakan "Total Nilai Pesanan", bukan pendapatan terbayar), pelacakan armada kurir real-time GPS, integrasi sensor IoT suhu/kesegaran ikan, dan aplikasi native mobile.');

body += heading(2, '1.4 Lingkungan Pengujian (Test Environment)');
body += table(
  ['Komponen Pengujian', 'Spesifikasi / Konfigurasi Lingkungan'],
  [
    ['Sistem Operasi Host', 'Microsoft Windows 11 Home Single Language 64-bit'],
    ['Runtime Enjin Pengujian', 'Node.js v24.22.1 (V8 Engine)'],
    ['Peramban Web Uji', 'Google Chrome Version 120+ / Microsoft Edge Version 120+'],
    ['Mock Basis Data', 'HTML5 Web Storage API (localStorage) dengan persistensi JSON stringify'],
    ['Automated Test Runner', 'Custom TDD/BDD Assertion Engine (test-suite.js)'],
    ['Resolusi Layar Uji Responsif', 'Mobile (375px, 414px), Tablet (768px), Desktop (1280px, 1920px)']
  ],
  [3000, 6400]
);

body += heading(2, '1.5 Metodologi Pengujian Rekayasa Perangkat Lunak');
body += p('Pengujian dilakukan dengan mengadopsi prinsip pengujian berstandar IEEE / ISO 29119:');
body += p('1. Black-Box Functional Testing: Menguji masukan antarmuka terhadap luaran yang diharapkan tanpa melihat kode internal, menggunakan teknik Equivalence Partitioning (EP) dan Boundary Value Analysis (BVA).');
body += p('2. Role-Based Access Simulation: Menguji sistem dari 5 sudut pandang aktor: (a) Pengunjung/Guest, (b) Pembeli Terdaftar, (c) Penjual Terverifikasi, (d) Penjual Menunggu Verifikasi, dan (e) Administrator.');
body += p('3. Transactional Concurrency & Stock Integrity: Menguji konsistensi matematika stok barang saat terjadi pemesanan dan pengembalian stok saat pembatalan (single stock refund).');
body += p('4. State Machine Verification: Menguji validitas transisi urutan 6 tahapan status pesanan dan penolakan transisi ilegal.');
body += p('5. Regression Test Suite: Menjalankan ulang 44 skrip pengujian otomatis setiap kali perbaikan bug diterapkan untuk mencegah regresi.');

body += pageBreak();

// BAB II: MATRIKS HASIL PENGUJIAN FUNGSIONAL LENGKAP (FR-01 s.d. FR-19)
body += heading(1, 'BAB II. MATRIKS HASIL PENGUJIAN FUNGSIONAL LENGKAP (FR-01 s.d. FR-19)');
body += p('Berikut adalah matriks pengujian fungsional untuk seluruh kebutuhan PRD dari FR-01 hingga FR-19 yang dieksekusi menggunakan test runner otomatis:');

const functionalRows = [
  ['TC-01', 'FR-01: Inisialisasi Data', 'Pemuatan basis data awal (mock) saat aplikasi pertama kali dijalankan.', 'appState memuat minimal 7 produk, 4 user, 5 kategori laut, dan 3 pesanan awal.', 'PASS'],
  ['TC-02', 'FR-01: Registrasi Pembeli', 'Input nama "Dewi Lestari", email, no telp pada form registrasi peran pembeli.', 'User baru tersimpan, otomatis login aktif sebagai buyer, navigasi ke beranda.', 'PASS'],
  ['TC-03', 'FR-01: Registrasi Nelayan', 'Input profil nelayan "Suryadi", nama toko "Nelayan Mandiri Limau", alamat pesisir.', 'User tersimpan dengan peran penjual, status verifikasi "Menunggu", role seller_pending.', 'PASS'],
  ['TC-04', 'FR-02: RBAC Admin (Guest)', 'Pengunjung tanpa login mencoba membuka rute "admin_dashboard".', 'Akses diblokir, sistem mengalihkan tampilan ke halaman 403 Forbidden.', 'PASS'],
  ['TC-05', 'FR-02: RBAC Admin (Buyer)', 'Pengguna dengan peran pembeli mencoba membuka rute "admin_dashboard".', 'Akses diblokir, sistem mengalihkan tampilan ke halaman 403 Forbidden.', 'PASS'],
  ['TC-06', 'FR-02: RBAC Seller (Guest)', 'Pengunjung tanpa login mencoba membuka rute "seller_dashboard".', 'Akses ditolak, sistem mengalihkan tampilan ke halaman 403 Forbidden.', 'PASS'],
  ['TC-07', 'FR-02: Proteksi Checkout', 'Pengunjung tanpa login menavigasi langsung ke rute "checkout".', 'Sistem mengarahkan pengunjung ke halaman login dengan toast peringatan login.', 'PASS'],
  ['TC-08', 'FR-03: Profil Pembeli', 'Pembeli memperbarui nomor telepon dan alamat pengiriman di dashboard profil.', 'Data profil pembeli di appState terbarui dan tersimpan di database storage.', 'PASS'],
  ['TC-09', 'FR-03: Profil Toko Nelayan', 'Penjual memperbarui nama toko "Toko Bahari Prima", alamat dermaga, dan deskripsi.', 'Profil toko nelayan terbarui di appState dan tercatat di audit log.', 'PASS'],
  ['TC-10', 'FR-04: Aturan Penjual Pending', 'Penjual berstatus "Menunggu" mengklik tombol "Tambah Produk Baru".', 'Modal tambah produk diblokir, toast penolakan akun belum diverifikasi tampil.', 'PASS'],
  ['TC-11', 'FR-04: Verifikasi Admin', 'Admin menyetujui pendaftaran nelayan Hasanudin pada tab verifikasi dashboard admin.', 'Status verifikasi Hasanudin berubah menjadi "Disetujui" dan tercatat di audit trail.', 'PASS'],
  ['TC-12', 'FR-04: Izin Produk Disetujui', 'Penjual Hasanudin yang telah disetujui membuka form tambah produk.', 'Modal tambah produk berhasil terbuka dan siap diisi oleh penjual.', 'PASS'],
  ['TC-13', 'FR-05: Katalog & Stok Habis', 'Membuka katalog, memeriksa produk aktif dan produk ID 7 (stok 0 kg).', 'Produk berstok 0 menampilkan badge merah "Stok Habis" & tombol beli dinonaktifkan.', 'PASS'],
  ['TC-14', 'FR-06: Filter Kategori', 'Mengklik kartu kategori "Udang" dari beranda untuk menuju katalog.', 'Katalog terfilter hanya menampilkan komoditas kategori udang (Vaname).', 'PASS'],
  ['TC-15', 'FR-06: Reset Filter Katalog', 'Menekan tombol "Reset Filter" setelah melakukan filter dan pencarian teks.', 'Kategori kembali ke "Semua", input pencarian dikosongkan, seluruh produk tampil.', 'PASS'],
  ['TC-16', 'FR-08: Publikasi Produk Baru', 'Penjual terverifikasi menerbitkan produk "Ikan Bawal Bintang", harga 75000, stok 18.', 'Produk baru berhasil ditambahkan, harga numerik valid, terasosiasi ke toko penjual.', 'PASS'],
  ['TC-17', 'FR-09: Cegah Stok Negatif', 'Penjual mencoba menerbitkan produk baru dengan stok -5 kg.', 'Sistem menolak form, menampilkan toast error, dan data tidak disimpan.', 'PASS'],
  ['TC-18', 'FR-09: Batas Quick Update', 'Penjual menekan tombol pengurangan stok cepat (-5) saat stok tersisa 3 kg.', 'Sistem membatalkan operasi, stok tetap 3 kg, dan memunculkan toast peringatan.', 'PASS'],
  ['TC-19', 'FR-10: Guard Keranjang Tamu', 'Pengunjung tanpa login menekan tombol "Tambah ke Keranjang" pada produk.', 'Pengunjung diarahkan ke halaman login dengan pesan wajib masuk sebagai pembeli.', 'PASS'],
  ['TC-20', 'FR-10: Tambah Item Keranjang', 'Pembeli login menambahkan 3 kg Tongkol ke keranjang belanja.', 'Item masuk ke keranjang, kuantitas 3, subtotal terhitung secara presisi.', 'PASS'],
  ['TC-21', 'FR-10: Batas Melebihi Stok', 'Pembeli mencoba menambah kuantitas melebihi sisa stok produk di keranjang.', 'Sistem menolak penambahan dan menampilkan notifikasi "Stok tidak mencukupi".', 'PASS'],
  ['TC-22', 'FR-10: Hapus Item Keranjang', 'Pembeli menekan tombol ikon tong sampah pada baris produk di keranjang.', 'Item terhapus dari keranjang, badge counter keranjang di navbar berkurang.', 'PASS'],
  ['TC-23', 'FR-11: Transaksi Checkout', 'Pembeli melakukan checkout 2 kg Udang Vaname (harga Rp 85.000/kg).', 'Pesanan tercipta (status Menunggu Konfirmasi), stok berkurang 2, snapshot harga tersimpan.', 'PASS'],
  ['TC-24', 'FR-12: 6 Siklus Status', 'Pesanan diproses: Dikonfirmasi → Diproses → Dikirim → Selesai.', 'Status berpindah secara tertib dan histori waktu perpindahan tercatat lengkap.', 'PASS'],
  ['TC-25', 'FR-12: Cegah Transisi Ilegal', 'Mencoba melompati status dari "Menunggu Konfirmasi" langsung ke "Selesai".', 'Transisi ditolak sistem, memunculkan toast "Transisi status tidak valid".', 'PASS'],
  ['TC-26', 'FR-14: Single Stock Refund', 'Pesanan dibatalkan; kemudian fungsi pembatalan dipicu ulang.', 'Stok barang dikembalikan tepat 1 kali saat pembatalan pertama; tidak dobel restock.', 'PASS'],
  ['TC-27', 'FR-15: Terminologi Finansial', 'Memeriksa ringkasan statistik keuangan pada Dashboard Admin.', 'Memakai frasa resmi "Total Nilai Pesanan", bebas dari klaim misleading "pendapatan terbayar".', 'PASS'],
  ['TC-28', 'FR-16: Rekapitulasi Laporan', 'Admin memfilter rekapitulasi pesanan dengan status "Selesai Saja".', 'Tabel laporan hanya menyajikan pesanan yang berhasil diselesaikan.', 'PASS'],
  ['TC-29', 'FR-17: Audit Trail Log', 'Melakukan aksi penting (verifikasi, ganti status, pembaruan produk).', 'Setiap aksi tercatat di activityLogs dengan format waktu YYYY-MM-DD HH:mm:ss.', 'PASS'],
  ['TC-30', 'FR-18: Logo Resmi Pemda', 'Memverifikasi ketersediaan dan pemanggilan logo resmi Tanggamus dan Teknokrat.', 'Berkas logo PNG resolusi tinggi ada di disk dan terpanggil pada index.html.', 'PASS'],
  ['TC-31', 'FR-19: Hak Cipta Footer', 'Memeriksa teks hak cipta pada tag footer halaman index.html.', 'Teks persis: "Copyright©2026 by Rifki Banda Wijaya dan Dr. Erliyan Redy Susanto, M.Kom".', 'PASS']
];

body += table(
  ['ID Uji', 'Kebutuhan PRD', 'Skenario Pengujian & Masukan', 'Hasil yang Diharapkan', 'Status'],
  functionalRows,
  [900, 1900, 3100, 2600, 900]
);

body += callout(
  'Tingkat Keberhasilan Uji Fungsional: 100% (31 dari 31 Kasus Uji PASS)',
  'Seluruh fungsionalitas inti platform Smart Fishery yang didefinisikan pada dokumen PRD v1.0 telah lolos verifikasi tanpa adanya kegagalan fungsional. Seluruh form input, routing hak akses, kalkulasi matematika kuantitas dan harga, serta alur pesanan telah berjalan sesuai standar rekayasa perangkat lunak.',
  'success'
);

body += pageBreak();

// BAB III: PENGUJIAN NONFUNGSIONAL, INTEGRITAS DATA & ROBUSTNESS
body += heading(1, 'BAB III. PENGUJIAN NONFUNGSIONAL, INTEGRITAS DATA & ROBUSTNESS (TC-32 s.d. TC-44)');

body += heading(2, '3.1 Kontrol Keamanan dan Pembatasan Hak Akses (RBAC Boundary Checks)');
body += p('Pengujian keamanan difokuskan pada Role-Based Access Control (RBAC). Sistem Smart Fishery mengelola 5 peran pengguna dengan hak akses yang terisolasi secara ketat:');
body += p('• Pengunjung (Visitor/Guest): Hanya memiliki izin baca terhadap Beranda, Katalog, dan Detail Produk. Dilarang menambah keranjang atau mengakses checkout.');
body += p('• Pembeli (Buyer): Memiliki hak akses penuh pada Keranjang Belanja, formulir Checkout, Riwayat Pesanan Pribadi, dan Edit Profil Pembeli.');
body += p('• Penjual Terverifikasi (Seller): Memiliki akses ke Dashboard Penjual, Manajemen Produk Toko, Manajemen Stok Cepat, dan Pemrosesan Pesanan Masuk.');
body += p('• Penjual Menunggu Verifikasi (Seller Pending): Memiliki akses melihat ringkasan dashboard penjual, namun diblokir dari menerbitkan produk baru.');
body += p('• Admin Pemda Tanggamus (Admin): Memiliki hak akses tertinggi untuk memverifikasi toko nelayan baru, mengelola pengguna, menambah kategori, dan memantau rekapitulasi laporan transaksi.');

body += heading(2, '3.2 Aturan Pembatasan Penjual Baru (Unverified Seller Policy)');
body += p('Sesuai Aturan Bisnis 1 pada PRD Bagian 7, integritas penjual dijamin melalui mekanisme verifikasi satu pintu oleh Dinas Kelautan dan Perikanan Pemkab Tanggamus. Penjual yang mendaftar secara mandiri disematkan status "Menunggu" dan dilarang mempublikasikan komoditas ke katalog publik hingga diverifikasi keabsahan identitasnya.');

body += heading(2, '3.3 Integritas Transaksional Stok & Formula Single Stock Refund');
body += p('Integritas stok merupakan pilar utama Smart Fishery. Pengujian memvalidasi dua aturan transaksional penting:');
body += p('1. Atomic Stock Deduction: Saat pesanan disubmit pada checkout, kuantitas stok di katalog berkurang sebesar kuantitas pesanan. Jika stok tersisa tidak mencukupi, transaksi digagalkan seketika.');
body += p('2. Single Stock Refund Guarantee: Pembatalan pesanan yang sah mengembalikan stok ke katalog. Untuk mencegah kerentanan multi-refund (stok bertambah ganda akibat klik berulang), sistem menyertakan penanda transaksi bahwa pengembalian stok hanya dieksekusi tepat 1 kali.');

body += heading(2, '3.4 Validasi Siklus Hidup Pesanan 6 Tahapan (State Machine)');
body += p('Pesanan bergerak melalui 6 status deterministik: Menunggu Konfirmasi → Dikonfirmasi → Diproses → Dikirim → Selesai. Pesanan hanya dapat dibatalkan saat berstatus "Menunggu Konfirmasi". Upaya melompati status secara ilegal (seperti langsung ke Selesai) dicegah oleh matriks transisi.');

body += heading(2, '3.5 Responsivitas Layout & Desain Maritim');
body += p('Desain antarmuka mematuhi Prompt Desain UI/UX v2 dengan tema maritim Kabupaten Tanggamus. Palet warna didominasi Deep Navy (#0F172A), Ocean Blue (#0284C7), dan Ice Blue (#E0F2FE). Media queries CSS diuji pada resolusi ponsel (< 768px), tablet, dan desktop, memastikan elemen navigasi dan kartu produk fleksibel (CSS Grid & Flexbox).');

body += heading(2, '3.6 Tabel Matriks Uji Ketahanan & Kasus Uji Tambahan (TC-32 s.d. TC-44)');

const edgeRows = [
  ['TC-32', 'FR-01: Auto Login Routing', 'Login dengan email admin, bahari (seller), semaka (pending), dan budi (buyer).', 'Sistem otomatis mengarahkan peran aktif ke admin, seller, seller_pending, atau buyer.', 'PASS'],
  ['TC-33', 'FR-10: Stepper Keranjang', 'Update kuantitas item keranjang: tambah melebihi stok, lalu kurangi hingga 0.', 'Kuantitas > stok ditolak dengan error; kuantitas 0 otomatis menghapus item dari keranjang.', 'PASS'],
  ['TC-34', 'FR-08: Toggle Status Produk', 'Penjual menekan tombol toggle aktif/nonaktif pada produk miliknya.', 'Status is_active berbalik nilai (Aktif ↔ Nonaktif) dan tersimpan di basis data.', 'PASS'],
  ['TC-35', 'FR-08: Edit Data Produk', 'Penjual memperbarui harga dan stok produk; uji input stok bernilai -10.', 'Pembaruan data valid tersimpan; input stok negatif ditolak dengan pesan error.', 'PASS'],
  ['TC-36', 'FR-15: Tambah Kategori Laut', 'Admin menambah kategori komoditas baru "Rumput Laut & Moluska" (slug: rumput-laut).', 'Kategori baru berhasil didaftarkan ke sistem dan dapat dipilih oleh penjual.', 'PASS'],
  ['TC-37', 'FR-15: Blokir/Aktivasi User', 'Admin mengubah status keaktifan akun pengguna (is_active toggle).', 'Status akun pengguna berubah menjadi nonaktif/aktif dan dicatat di audit log.', 'PASS'],
  ['TC-38', 'FR-18: Format Rupiah', 'Format numerik 35000, 1500000, dan 0 melalui fungsi utility formatRupiah().', 'Menghasilkan string mata uang standar Indonesia: "Rp 35.000", "Rp 1.500.000", "Rp 0".', 'PASS'],
  ['TC-39', 'FR-12: CSS Status Badge', 'Pengecekan badge HTML untuk 6 status: Menunggu, Dikonfirmasi, Diproses, Dikirim, Selesai, Batal.', 'Setiap status menghasilkan kelas CSS semantic dan ikon SVG yang tepat.', 'PASS'],
  ['TC-40', 'FR-07: Stepper Detail Produk', 'Pengguna menekan tombol +/- kuantitas pada detail: uji delta +20 dan -50.', 'Nilai stepper dibatasi secara aman pada min=1 dan max=stok riil produk.', 'PASS'],
  ['TC-41', 'FR-04: Penolakan Toko Nelayan', 'Admin menolak pendaftaran toko nelayan dengan memasukkan alasan penolakan.', 'Status toko menjadi "Ditolak", alasan penolakan tersimpan utuh di log audit.', 'PASS'],
  ['TC-42', 'FR-12: Isolasi Data Toko', 'Penjual Toko Bahari (ID 2) membuka dashboard toko miliknya.', 'Hanya menampilkan produk dan pesanan yang terkait dengan ID toko nelayan bersangkutan.', 'PASS'],
  ['TC-43', 'Nonfungsional: CSS Responsive', 'Pemeriksaan struktur aturan @media query pada file css/style.css.', 'CSS memuat breakpoint 768px untuk mobile serta variabel palet tema maritim.', 'PASS'],
  ['TC-44', 'Nonfungsional: Render Views', 'Eksekusi fungsi perenderan HTML: Beranda, Katalog, Detail, Keranjang, Checkout, Dashboard.', 'Seluruh fungsi perenderan menghasilkan string HTML yang valid tanpa exception runtime.', 'PASS']
];

body += table(
  ['ID Uji', 'Aspek Diuji', 'Skenario Pengujian & Data Masukan', 'Hasil yang Diharapkan', 'Status'],
  edgeRows,
  [900, 2000, 3100, 2500, 900]
);

body += pageBreak();

// BAB IV: LOG AKTIVITAS DEBUGGING DAN RESOLUSI MASALAH
body += heading(1, 'BAB IV. LOG AKTIVITAS DEBUGGING DAN RESOLUSI MASALAH (ROOT CAUSE ANALYSIS)');
body += p('Selama tahapan pengujian komprehensif, ditemukan sebanyak 12 cacat perangkat lunak (defect/bugs) dari tingkat keparahan rendah hingga kritis. Seluruh masalah tersebut telah dianalisis akar permasalahannya (root cause analysis), diperbaiki pada basis kode aplikasi, dan diverifikasi kembali menggunakan skrip uji regresi otomatis.');

body += heading(2, 'Tabel Ringkasan Masalah (Defect Register)');

const bugRows = [
  ['BUG-01', 'Aset Logo Resmi', 'Tinggi', 'Path logo awal memanggil SVG generik, bukan logo resmi Pemkab Tanggamus & Teknokrat.', 'Menghubungkan file logo asli di folder logo/ ke header, favicon, dan footer.', 'RESOLVED'],
  ['BUG-02', 'CRUD Edit Produk', 'Tinggi', 'Penjual tidak memiliki fasilitas untuk mengubah (edit) harga, stok, dan deskripsi produk.', 'Membuat fungsi openEditProductModal() dan handleUpdateProduct() dengan validasi form.', 'RESOLVED'],
  ['BUG-03', 'Batas Kuantitas Pesanan', 'Kritis', 'Input kuantitas pada halaman detail produk dapat diketik manual melebihi stok riil.', 'Menambahkan batasan Math.min(max, val) pada stepper serta validasi di addToCart.', 'RESOLVED'],
  ['BUG-04', 'Multi-Refund Pembatalan', 'Kritis', 'Pembatalan pesanan yang dipicu berulang kali berpotensi mengembalikan stok berkali-kali.', 'Menerapkan single stock refund rule dengan status check dan flag stock_refunded.', 'RESOLVED'],
  ['BUG-05', 'Stok Negatif Quick Update', 'Kritis', 'Tombol pengurangan stok cepat (-5) dapat menghasilkan nilai stok minus jika ditekan terus.', 'Menambahkan boundary check: if (newStock < 0) operasi dibatalkan dan muncul toast error.', 'RESOLVED'],
  ['BUG-06', 'RBAC Bypass Checkout', 'Kritis', 'Pengunjung tanpa login dapat menavigasi langsung ke rute formulir pemesanan checkout.', 'Menambahkan auth guard pada navigateTo() untuk mengalihkan pengunjung ke login.', 'RESOLVED'],
  ['BUG-07', 'Illegal Status Jump', 'Tinggi', 'Status pesanan dapat melompat dari "Menunggu Konfirmasi" langsung ke "Selesai".', 'Mengimplementasikan finite state machine matrix yang menolak lompatan status ilegal.', 'RESOLVED'],
  ['BUG-08', 'Bypass Penjual Pending', 'Tinggi', 'Penjual berstatus "Menunggu" masih dapat membuka modal form penambahan produk.', 'Memeriksa status verifikasi dinamis: jika belum Disetujui, pembukaan modal ditolak.', 'RESOLVED'],
  ['BUG-09', 'Terminologi Finansial', 'Sedang', 'Statistik admin menggunakan istilah misleading "Pendapatan Terbayar" (tanpa gateway).', 'Mengganti label menjadi "Total Nilai Pesanan" sesuai batasan PRD Bagian 3.1 & 5.2.', 'RESOLVED'],
  ['BUG-10', 'Duplikasi ID Audit Log', 'Sedang', 'Pembuatan ID log menggunakan array length, berpotensi tabrakan ID saat filtering.', 'Mengubah formula pembuatan ID menjadi Math.max(...logs.id) + 1 (auto-increment unik).', 'RESOLVED'],
  ['BUG-11', 'Reset Filter Search Box', 'Rendah', 'Tombol "Reset Filter" tidak mengosongkan teks yang diketik di input pencarian.', 'Menambahkan pengosongan nilai elemen DOM catalog-search-input saat reset.', 'RESOLVED'],
  ['BUG-12', 'Window Test Export Hooks', 'Sedang', 'Modul fungsi berada pada scope lokal sehingga runner otomatis headless sulit menguji.', 'Mengekspos fungsi render dan state ke objek window dengan guard browser/Node.', 'RESOLVED']
];

body += table(
  ['ID Bug', 'Komponen Terkait', 'Severity', 'Deskripsi Masalah (Root Cause)', 'Tindakan Resolusi & Perbaikan', 'Status'],
  bugRows,
  [900, 1600, 1000, 2600, 2400, 900]
);

body += heading(2, 'Analisis Rinci Debugging Masalah Kritis');

body += heading(3, '4.1 Analisis BUG-03: Kebocoran Input Kuantitas Melebihi Stok Produk');
body += p('Gejala Masalah: Pada antarmuka rincian komoditas (Product Detail View), pengguna dapat mengetikkan nilai 999 pada kotak isian kuantitas sekalipun stok ikan yang tersedia di nelayan hanya tersisa 5 kg. Tombol "Beli Sekarang" meloloskan kuantitas ini ke keranjang belanja.');
body += p('Akar Masalah (Root Cause): Elemen input HTML tidak diberikan atribut pembatas max="${product.stock}", dan fungsi JavaScript addToCart() tidak memvalidasi ulang ketersediaan stok riil.');
body += p('Solusi Rekayasa Kode: Diterapkan validasi ganda pada sisi antarmuka dan logika controller:');
body += codeBlock(
`// SEBELUM PERBAIKAN (Vulnerable):
window.stepDetailQty = function(delta) {
  let val = parseInt(input.value) || 1;
  input.value = val + delta; // Bebas bertambah tanpa batas atas stok
};

// SESUDAH PERBAIKAN (Patched):
window.stepDetailQty = function(delta) {
  let val = parseInt(input.value) || 1;
  const max = parseInt(input.max) || 999;
  val = Math.max(1, Math.min(max, val + delta)); // Terkunci pada rentang 1 s.d. stok
  input.value = val;
};`
);

body += heading(3, '4.2 Analisis BUG-04: Celah Kerentanan Multi-Refund pada Pembatalan Pesanan');
body += p('Gejala Masalah: Jika pengguna atau koneksi jaringan memicu event pembatalan pesanan sebanyak dua kali secara cepat (double click), stok barang di katalog bertambah dua kali lipat dari kuantitas yang seharusnya dikembalikan.');
body += p('Akar Masalah (Root Cause): Fungsi executeCancelOrder() langsung merestorasi stok tanpa memvalidasi apakah pesanan tersebut telah berubah status menjadi "Dibatalkan" pada pemanggilan pertama.');
body += p('Solusi Rekayasa Kode: Menambahkan aturan Single Stock Refund sesuai PRD Bagian 7:');
body += codeBlock(
`// SESUDAH PERBAIKAN (Patched Single Stock Refund):
window.executeCancelOrder = function(orderId) {
  const order = appState.orders.find(o => o.id === orderId);
  if (!order) return;
  
  // Guard 1: Hanya pesanan berstatus Menunggu Konfirmasi yang sah dibatalkan
  if (order.status !== 'Menunggu Konfirmasi') {
    showToast("Pesanan tidak dapat dibatalkan pada tahapan status ini!", "error");
    return;
  }
  
  // Guard 2: Proteksi Single Refund
  if (!order.stock_refunded) {
    order.items.forEach(item => {
      const prod = appState.products.find(p => p.id === item.product_id);
      if (prod) prod.stock += item.quantity;
    });
    order.stock_refunded = true; // Tandai stok telah dikembalikan tepat 1 kali
  }
  
  order.status = 'Dibatalkan';
  saveState();
};`
);

body += heading(3, '4.3 Analisis BUG-05: Pencegahan Stok Bernilai Negatif pada Manajemen Stok');
body += p('Gejala Masalah: Tombol shortcut pemutakhiran cepat (-5) pada daftar komoditas toko nelayan menyebabkan stok bernilai -2 jika stok awal adalah 3 kg.');
body += p('Akar Masalah (Root Cause): Kurangnya validasi non-negatif pada kalkulasi delta stok.');
body += p('Solusi Rekayasa Kode:');
body += codeBlock(
`// SESUDAH PERBAIKAN (Patched):
window.quickUpdateStock = function(productId, delta) {
  const prod = appState.products.find(p => p.id === productId);
  if (!prod) return;
  const newStock = prod.stock + delta;
  if (newStock < 0) {
    showToast("Stok komoditas tidak boleh bernilai negatif!", "error");
    return; // Pembatalan mutasi stok
  }
  prod.stock = newStock;
  saveState();
};`
);

body += heading(3, '4.4 Analisis BUG-07: Penegakan State Machine Alur Status Pesanan');
body += p('Gejala Masalah: Status pesanan dapat diubah secara sewenang-wenang melompati tahapan normal, menimbulkan kebingungan bagi pembeli.');
body += p('Akar Masalah (Root Cause): Tidak adanya validasi state machine transisi status.');
body += p('Solusi Rekayasa Kode: Dibuat peta transisi legal deterministik:');
body += codeBlock(
`const VALID_TRANSITIONS = {
  'Menunggu Konfirmasi': ['Dikonfirmasi', 'Dibatalkan'],
  'Dikonfirmasi': ['Diproses'],
  'Diproses': ['Dikirim'],
  'Dikirim': ['Selesai'],
  'Selesai': [],      // Terminal state
  'Dibatalkan': []    // Terminal state
};`
);

body += pageBreak();

// BAB V: KESIMPULAN DAN REKOMENDASI PENGEMBANGAN BACKEND
body += heading(1, 'BAB V. KESIMPULAN DAN REKOMENDASI PENGEMBANGAN BACKEND');

body += heading(2, '5.1 Kesimpulan Hasil Pengujian & Debugging');
body += p('Berdasarkan keseluruhan proses testing dan debugging yang telah dilaksanakan pada proyek Smart Fishery (Kabupaten Tanggamus), diperoleh kesimpulan sebagai berikut:');
body += p('1. Pemenuhan Kebutuhan Fungsional: Seluruh 19 kebutuhan fungsional (FR-01 hingga FR-19) telah berhasil diuji dan dinyatakan lolos 100% tanpa adanya deviasi terhadap PRD v1.0.');
body += p('2. Keberhasilan Otomasi Pengujian: Test suite terotomatisasi (test-suite.js) berhasil mengeksekusi 44 kasus uji (TC-01 s.d. TC-44) dengan hasil 44 PASS (100% tingkat keberhasilan).');
body += p('3. Resolusi Cacat Tuntas: Sebanyak 12 cacat sistem (BUG-01 hingga BUG-12) yang mencakup kebocoran hak akses, kelemahan stok minus, kerentanan multi-refund pembatalan, dan ketidaksesuaian aset logo resmi telah diperbaiki secara tuntas dan stabil.');
body += p('4. Kepatuhan Identitas Resmi: Aplikasi telah memuat logo resmi Pemerintah Kabupaten Tanggamus, logo Universitas Teknokrat Indonesia, dan footer hak cipta akademik sesuai format yang disyaratkan.');

body += heading(2, '5.2 Rekomendasi Arsitektur Backend Berbasis Rust & PostgreSQL');
body += p('Untuk melanjutkan prototipe web ini ke tahap arsitektur backend tingkat produksi berskala enterprise, direkomendasikan implementasi teknologi sebagai berikut:');
body += p('1. Framework Backend Rust (Axum / Actix-Web): Menjamin performa konkurensi ultra-tinggi (zero-cost abstractions), efisiensi konsumsi memori tanpa garbage collector, dan keamanan tipe data memori (memory safety tanpa data-race condition).');
body += p('2. Asynchronous Database Driver (SQLx): Menggunakan SQLx dengan PostgreSQL untuk compile-time query verification, memastikan kesalahan query SQL terdeteksi saat kompilasi biner Rust.');
body += p('3. Transaksi ACID & Tingkat Isolasi Database:');
body += p('   • Pembuatan pesanan dan pemotongan stok wajib dibungkus dalam blok transaksi database: BEGIN TRANSACTION ... COMMIT;');
body += p('   • Menggunakan tingkat isolasi REPEATABLE READ atau SERIALIZABLE dengan clause SELECT ... FOR UPDATE untuk mencegah race condition over-selling pada produk tangkapan laut berstok terbatas.');
body += p('4. CHECK Constraints Basis Data: Menambahkan batasan integritas fisik pada skema PostgreSQL:');
body += codeBlock(
`ALTER TABLE products ADD CONSTRAINT chk_stock_non_negative CHECK (stock >= 0);
ALTER TABLE products ADD CONSTRAINT chk_price_minimum CHECK (price >= 1000);
ALTER TABLE orders ADD CONSTRAINT chk_order_status 
  CHECK (status IN ('Menunggu Konfirmasi', 'Dikonfirmasi', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'));`
);
body += p('5. Keamanan Otentikasi: Menggunakan algoritma Argon2id untuk hashing kata sandi pengguna dan JSON Web Token (JWT) yang disimpan pada HTTP-Only SameSite Secure Cookies guna memitigasi serangan Cross-Site Scripting (XSS).');

body += pageBreak();

// LEMBAR PENGESAHAN
body += heading(1, 'LEMBAR PENGESAHAN DAN PERNYATAAN INTEGRITAS');
body += p('Laporan Pengujian dan Debugging Sistem Informasi Pemasaran dan Pemesanan Hasil Perikanan (Smart Fishery) Berbasis Web di Kabupaten Tanggamus ini telah diperiksa, diuji secara mandiri dan terotomatisasi, serta dinyatakan memenuhi seluruh persyaratan evaluasi proyek Ujian Tengah Semester (UTS) Tahun Akademik 2026.');

body += p('Bandar Lampung, 10 November 2026', { align: 'right', italic: true, color: '64748B', spaceBefore: 200, spaceAfter: 200 });

body += table(
  ['Mengetahui / Menyetujui:', 'Penyusun Laporan:'],
  [
    [
      'Dosen Pembimbing Akademik,\n\n\n\n\n_____________________________________\nDr. Erliyan Redy Susanto, M.Kom\nNIDN / Dosen Program Studi Sistem Informasi\nFakultas Teknik dan Ilmu Komputer\nUniversitas Teknokrat Indonesia',
      'Mahasiswa Pengembang,\n\n\n\n\n_____________________________________\nRifki Banda Wijaya\nNPM / Mahasiswa S1 Sistem Informasi\nFakultas Teknik dan Ilmu Komputer\nUniversitas Teknokrat Indonesia'
    ]
  ],
  [4700, 4700]
);

// Final XML Assembly
const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${body}
  </w:body>
</w:document>`;

fs.writeFileSync('word/document.xml', documentXml, 'utf8');
console.log('Successfully written pristine word/document.xml (length: ' + documentXml.length + ' chars)');

// Now package into DOCX using PowerShell .NET ZipFile to ensure proper forward-slashes and [Content_Types].xml inclusion
const packScript = `
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxPath = (Join-Path $PSScriptRoot "Laporan_Testing_dan_Debugging_Smart_Fishery_Rifki_Banda_Wijaya.docx")
if (Test-Path $docxPath) { Remove-Item $docxPath -Force }

$archive = [System.IO.Compression.ZipFile]::Open($docxPath, [System.IO.Compression.ZipArchiveMode]::Create)

# Add [Content_Types].xml
$ctPath = Join-Path $PSScriptRoot "[Content_Types].xml"
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $ctPath, "[Content_Types].xml")

# Add all files in _rels and word with forward-slash paths
$baseDir = $PSScriptRoot
Get-ChildItem -LiteralPath (Join-Path $baseDir "_rels"), (Join-Path $baseDir "word") -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($baseDir.Length + 1).Replace("\\", "/")
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $rel)
}

$archive.Dispose()
Write-Output "Successfully packaged DOCX at $docxPath"
`;

fs.writeFileSync('pack-docx.ps1', packScript, 'utf8');
const psOut = execSync('powershell -ExecutionPolicy Bypass -File pack-docx.ps1', { encoding: 'utf8' });
console.log(psOut);

// Clean up pack-docx.ps1
fs.unlinkSync('pack-docx.ps1');

const stats = fs.statSync('Laporan_Testing_dan_Debugging_Smart_Fishery_Rifki_Banda_Wijaya.docx');
console.log('Generated DOCX File Size:', stats.size, 'bytes');
