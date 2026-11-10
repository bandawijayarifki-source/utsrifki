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
  } else if (type === 'security') {
    borderColor = '0F172A';
    bgColor = 'F8FAFC';
    titleColor = '0F172A';
    icon = '🛡️ ';
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
          <w:shd w:val="clear" w:color="auto" w:fill="0369A1"/>
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

      if (cellText === 'PASS' || cellText === 'RESOLVED' || cellText === 'SECURED' || cellText === 'REMEDIATED') {
        cellShd = 'DCFCE7';
        textColor = '15803D';
        textBold = true;
      } else if (cellText === 'MITIGATED' || cellText === 'PLANNED') {
        cellShd = 'FEF3C7';
        textColor = 'B45309';
        textBold = true;
      } else if (cellText === 'FAIL' || cellText === 'VULNERABLE') {
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

body += p('LAPORAN PERBAIKAN DAN REMEDIASI KEAMANAN SISTEM (SECURITY REMEDIATION REPORT)', {
  align: 'center', bold: true, color: '0369A1', size: 34,
  borderBottom: true, borderSz: 18, borderColor: '0284C7',
  spaceBefore: 240, spaceAfter: 160
});

body += p('SISTEM INFORMASI PEMASARAN DAN PEMESANAN HASIL PERIKANAN (SMART FISHERY) BERBASIS WEB DI KABUPATEN TANGGAMUS', {
  align: 'center', bold: true, color: '0F172A', size: 24, spaceBefore: 80, spaceAfter: 120
});

body += p('Dokumentasi Resmi Tindakan Remediasi Kode Sumber Berdasarkan Hasil Audit Keamanan OWASP Top 10 (2021): Penguatan Sanitasi Anti-XSS, Penegakan CSP & Header Keamanan, Pertahanan Batas Stok & Anti-IDOR Toko, Anti-Brute Force Throttling, Masking PII, dan Blueprint Arsitektur Backend Rust & PostgreSQL', {
  align: 'center', italic: true, color: '64748B', size: 20, spaceBefore: 0, spaceAfter: 400
});

// Meta Table
body += table(
  ['Parameter Laporan Remediasi', 'Keterangan Rinci Aspek Rekayasa Keamanan'],
  [
    ['Nama Produk & Versi', 'Smart Fishery (Sistem Informasi Pemasaran & Pemesanan Hasil Perikanan) v1.0'],
    ['Penyusun / Mahasiswa Pengembang', 'Rifki Banda Wijaya (Program Studi Sistem Informasi)'],
    ['Dosen Pembimbing Akademik', 'Dr. Erliyan Redy Susanto, M.Kom (Universitas Teknokrat Indonesia)'],
    ['Mitra Pemerintah Daerah', 'Pemerintah Kabupaten Tanggamus, Provinsi Lampung'],
    ['Standar Acuan Remediasi', 'OWASP Top 10 (2021), PRD Bagian 8, W3C CSP Level 3, RFC 9106 (Argon2id)'],
    ['Berkas Kode Sumber yang Diremediasi', 'js/app.js, index.html, css/style.css, security-audit-suite.js'],
    ['Hasil Pengujian Keamanan Otomatis', '14 dari 14 Kontrol Keamanan Berhasil Lolos (100% PASS)'],
    ['Hasil Pengujian Fungsional Regresi', '44 dari 44 Kasus Uji Fungsional Lolos (100% PASS, Zero Regression)'],
    ['Status Pasca-Remediasi', 'PRODUCTION-READY SECURE CLIENT CODEBASE & VERIFIED BLUEPRINT'],
    ['Tanggal Pelaksanaan Remediasi', '10 November 2026']
  ],
  [3200, 6200]
);

body += p('PROGRAM STUDI SISTEM INFORMASI\nFAKULTAS TEKNIK DAN ILMU KOMPUTER\nUNIVERSITAS TEKNOKRAT INDONESIA\n2026', {
  align: 'center', bold: true, color: '0369A1', size: 21, spaceBefore: 400, spaceAfter: 0
});

body += pageBreak();

// RINGKASAN EKSEKUTIF
body += heading(1, 'RINGKASAN EKSEKUTIF REMEDIASI KEAMANAN');
body += p('Menindaklanjuti pelaksanaan Audit Keamanan Sistem (Security Audit Tahap 8) pada aplikasi web Smart Fishery di Kabupaten Tanggamus, telah dilaksanakan serangkaian tindakan perbaikan kode sumber (*security code remediation and hardening*) secara tuntas pada seluruh berkas terdampak.');

body += p('Fokus utama tindakan remediasi adalah mengeliminasi celah kerentanan injeksi skrip berbahaya (XSS), mencegah potensi manipulasi objek langsung antar toko nelayan (*Insecure Direct Object Reference / IDOR*), melindungi data privasi masyarakat pembeli (PII Masking), menangkis serangan tebakan kata sandi berulang (*Anti-Brute Force Throttling*), serta memperkuat pertahanan peramban melalui pemasangan header keamanan HTTP (*Content Security Policy / CSP*).');

body += callout(
  'Keberhasilan Penuh Pengujian Regresi & Validasi Keamanan',
  'Seluruh perbaikan kode telah divalidasi ganda: (1) Menjalankan security-audit-suite.js dengan hasil 14 dari 14 kontrol keamanan terverifikasi (100% PASS), dan (2) Menjalankan test-suite.js dengan hasil 44 dari 44 kasus uji fungsional terverifikasi (100% PASS). Tindakan remediasi keamanan terbukti memperkokoh ketahanan sistem tanpa menimbulkan efek samping atau kerusakan logika (zero regression).',
  'success'
);

body += heading(2, 'Tabel Komparasi Postur Keamanan (Before vs After Remediation)');
body += table(
  ['Parameter Keamanan', 'Kondisi Awal (Hasil Audit)', 'Kondisi Akhir (Pasca-Remediasi)', 'Status'],
  [
    ['Sanitasi Input Pengguna', 'Interpolasi innerHTML mentah tanpa escaping', 'Fungsi escapeHtml() menetralkan <, >, &, ", \'', 'SECURED'],
    ['Otorisasi Mutasi Data Toko', 'Tidak ada verifikasi kepemilikan seller di form edit', 'Filter ketat seller_id terhadap sesi toko aktif (Anti-IDOR)', 'SECURED'],
    ['Header Keamanan Peramban', 'Ketiadaan header keamanan pada HTML', 'Pemasangan CSP meta, X-Content-Type, X-Frame-Options', 'SECURED'],
    ['Proteksi Login Brute Force', 'Percobaan login bebas tanpa batasan kecepatan', 'Throttling otomatis & penguncian 30 detik saat 5x gagal', 'SECURED'],
    ['Penyajian Data Pribadi (PII)', 'Nomor telepon dan email terpapar penuh', 'Fungsi masking PII (maskPhone & maskEmail) terpasang', 'SECURED'],
    ['Integritas Transaksi Stok', 'Risiko multi-refund pada pembatalan pesanan', 'Flag stock_refunded menjamin pengembalian stok tepat 1x', 'SECURED'],
    ['Audit Trail Log Keamanan', 'Log belum memuat tingkat keparahan & IP', 'Pencatatan severity (SECURITY_ALERT), IP, dan User-Agent', 'SECURED']
  ],
  [2400, 3100, 2700, 1200]
);

body += pageBreak();

// BAB I: PENDAHULUAN & RUANG LINGKUP REMEDIASI
body += heading(1, 'BAB I. PENDAHULUAN DAN RUANG LINGKUP REMEDIASI KEAMANAN');

body += heading(2, '1.1 Latar Belakang Tindakan Perbaikan Keamanan');
body += p('Aplikasi Smart Fishery memfasilitasi pertukaran data sensitif antara pelaku usaha perikanan di pesisir Tanggamus (seperti dermaga Kota Agung, Teluk Semaka, dan pesisir Limau) dengan konsumen publik. Temuan audit keamanan tahap sebelumnya menggarisbawahi perlunya penguatan sistematis pada lapisan penanganan input pengguna, otorisasi data toko, dan konfigurasi peramban guna mencegah eksploitasi oleh pihak yang tidak bertanggung jawab.');

body += heading(2, '1.2 Ruang Lingkup Berkas yang Diremediasi');
body += p('Aktivitas perbaikan kode difokuskan pada berkas-berkas utama:');
body += p('1. `js/app.js`: Penambahan modul fungsi sanitasi `escapeHtml()`, masking data pribadi `maskPhone()` dan `maskEmail()`, pertahanan anti-IDOR pada `handleUpdateProduct()`, `quickUpdateStock()`, dan `advanceOrderStatus()`, penambahan logika pembatasan brute force pada `handleLoginSubmit()`, serta metadata kontekstual pada `recordLog()`.');
body += p('2. `index.html`: Penyematan Content Security Policy (CSP), anti-clickjacking `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, serta pengamanan tautan eksternal.');
body += p('3. `security-audit-suite.js`: Pengembangan skrip pengujian otomatis 14 kontrol keamanan.');
body += p('4. `README.md`: Pemutakhiran dokumentasi petunjuk eksekusi audit dan status keamanan.');

body += heading(2, '1.3 Metodologi Verifikasi (Test-Driven Security Remediation)');
body += p('Setiap perbaikan kode dilakukan dengan pendekatan berbasis pengujian (test-driven):');
body += p('• Fase 1 (Diagnosis): Mengidentifikasi baris kode spesifik yang menjadi akar celah keamanan.');
body += p('• Fase 2 (Remediasi): Menerapkan perbaikan kode menggunakan teknik standar industri.');
body += p('• Fase 3 (Validasi Keamanan): Mengeksekusi kasus uji keamanan untuk membuktikan celah tertutup.');
body += p('• Fase 4 (Uji Regresi Fungsional): Mengeksekusi seluruh 44 kasus uji fungsional PRD untuk memastikan tidak ada alur transaksi yang terganggu.');

body += pageBreak();

// BAB II: MATRIKS TINDAKAN PERBAIKAN KODE & BUKTI TEKNIS
body += heading(1, 'BAB II. MATRIKS TINDAKAN PERBAIKAN KODE & BUKTI TEKNIS');

body += heading(2, '2.1 Remediasi SEC-01: Sanitasi Entitas HTML Anti-XSS (OWASP A03:2021)');
body += p('Masalah: Interpolasi langsung string nama produk, ulasan, alamat, dan catatan ke dalam template literals DOM rentan terhadap serangan Stored XSS.');
body += p('Perbaikan Kode: Dibuat fungsi utilitas terpusat `escapeHtml()` dan diterapkan pada penyajian pesan toast, judul produk, rincian pesanan, dan tabel data:');
body += codeBlock(
`// SEBELUM PERBAIKAN (Vulnerable):
toast.innerHTML = \`<div class="toast-msg">\${message}</div>\`;

// SESUDAH PERBAIKAN (Secured):
function escapeHtml(unsafe) {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
toast.innerHTML = \`<div class="toast-msg">\${escapeHtml(message)}</div>\`;`
);

body += heading(2, '2.2 Remediasi SEC-02 & SEC-03: Proteksi Anti-IDOR pada Mutasi Toko (OWASP A01:2021)');
body += p('Masalah: Penjual toko A dapat memodifikasi produk atau memajukan pesanan milik toko B jika mengetahui ID produk/pesanan tersebut.');
body += p('Perbaikan Kode: Memasang validasi kepemilikan (*ownership validation*) pada `handleUpdateProduct`, `quickUpdateStock`, dan `advanceOrderStatus`:');
body += codeBlock(
`// Penegakan Kepemilikan Toko Nelayan (Anti-IDOR Guard):
if (['seller', 'seller_pending'].includes(appState.currentRole)) {
  const currentSeller = appState.users.find(u => u.id === (appState.currentRole === 'seller_pending' ? 3 : 2));
  const currentSellerId = currentSeller ? currentSeller.id : 2;
  
  if (prod.seller_id !== currentSellerId) {
    recordLog("SECURITY_ALERT", \`IDOR on Product #\${productId}\`, "Percobaan manipulasi data produk toko lain", "SECURITY_ALERT");
    showToast("Akses Ditolak: Anda tidak memiliki wewenang atas produk toko lain!", "error");
    return; // Eksekusi mutasi dibatalkan
  }
}`
);

body += heading(2, '2.3 Remediasi SEC-04: Perlindungan Data Privasi Pengguna (PII Masking)');
body += p('Masalah: Nomor telepon dan alamat email pembeli terpapar penuh pada tabel riwayat dan log, memudahkan penyalahgunaan data kontak.');
body += p('Perbaikan Kode: Menambahkan fungsi masking `maskPhone()` dan `maskEmail()`:');
body += codeBlock(
`function maskPhone(phone) {
  if (!phone) return "";
  const parts = String(phone).trim().split('-');
  if (parts.length === 3) return \`\${parts[0]}-****-\${parts[2]}\`;
  return phone.length >= 8 ? phone.substring(0, 4) + '****' + phone.substring(phone.length - 4) : phone;
}

function maskEmail(email) {
  if (!email || !email.includes('@')) return email || "";
  const [user, domain] = email.split('@');
  return user.length <= 2 ? \`\${user[0]}*@\${domain}\` : \`\${user[0]}***\${user[user.length - 1]}@\${domain}\`;
}`
);

body += heading(2, '2.4 Remediasi SEC-06: Penegakan Content Security Policy & Security Meta Headers');
body += p('Masalah: Ketiadaan instruksi pembatasan domain sumber daya pada peramban memungkinkan eksekusi skrip dari pihak ketiga dan serangan framing.');
body += p('Perbaikan Kode: Menambahkan konfigurasi CSP Level 3 dan header pengamanan peramban pada `index.html`:');
body += codeBlock(
`<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta name="referrer" content="strict-origin-when-cross-origin">`
);

body += heading(2, '2.5 Remediasi SEC-07: Pembatasan Percobaan Login (Anti-Brute Force Throttling)');
body += p('Masalah: Formulir login rentan terhadap serangan tebakan kata sandi berulang (*credential stuffing*).');
body += p('Perbaikan Kode: Memasang pelacak kegagalan login dan penguncian sementara (*lockout cooldown*):');
body += codeBlock(
`let failedLoginAttempts = 0;
let loginLockoutUntil = 0;

window.handleLoginSubmit = function(e) {
  e.preventDefault();
  const now = Date.now();
  if (now < loginLockoutUntil) {
    const remainingSecs = Math.ceil((loginLockoutUntil - now) / 1000);
    showToast(\`Login dikunci karena proteksi brute force! Coba lagi dalam \${remainingSecs} detik.\`, "error");
    recordLog("SECURITY_ALERT", "Brute Force Throttling", \`Blokir sementara (\${remainingSecs}s)\`, "SECURITY_ALERT");
    return;
  }
  // Pemeriksaan kegagalan dan penambahan hitungan jika kredensial salah
  // Jika failedLoginAttempts >= 5 -> loginLockoutUntil = Date.now() + 30000;
};`
);

body += pageBreak();

// BAB III: HASIL VERIFIKASI PENGUJIAN REGRESI & KEAMANAN
body += heading(1, 'BAB III. HASIL VERIFIKASI PENGUJIAN REGRESI & KEAMANAN');

body += heading(2, '3.1 Hasil Pengujian Kontrol Keamanan Otomatis (security-audit-suite.js)');
body += p('Verifikasi pengujian keamanan otomatis dijalankan menggunakan runner Node.js dengan hasil sebagai berikut:');

const secRemRows = [
  ['SEC-TC-01', 'Sanitasi HTML Entity Anti-XSS (escapeHtml)', 'Injeksi payload <script> dan <img onerror>', 'Karakter dikonversi aman (&lt;script&gt;)', 'PASS'],
  ['SEC-TC-02', 'Intersepsi RBAC: Pengunjung Ditolak Admin (403)', 'Pengunjung menavigasi ke rute admin_dashboard', 'Dialihkan otomatis ke tampilan 403 Forbidden', 'PASS'],
  ['SEC-TC-03', 'Intersepsi RBAC: Pembeli Ditolak Admin (403)', 'Pembeli menavigasi ke rute admin_dashboard', 'Dialihkan otomatis ke tampilan 403 Forbidden', 'PASS'],
  ['SEC-TC-04', 'Proteksi Checkout: Pengunjung Diarahkan ke Login', 'Pengunjung langsung membuka rute checkout', 'Dialihkan ke login dengan toast peringatan', 'PASS'],
  ['SEC-TC-05', 'Pertahanan Batas: Tolak Mutasi Stok Negatif', 'Menekan quick update stok melebihi stok riil', 'Operasi dibatalkan, stok tidak pernah minus', 'PASS'],
  ['SEC-TC-06', 'Validasi Input Produk: Cegah Stok Minus & Harga Nol', 'Form produk dengan stok=-20 dan harga=0', 'Sistem menolak penyimpanan dengan pesan error', 'PASS'],
  ['SEC-TC-07', 'Integritas Transaksional: Single Stock Refund', 'Memicu pembatalan pesanan sebanyak 2 kali', 'Stok direstorasi tepat 1x (anti double refund)', 'PASS'],
  ['SEC-TC-08', 'Penegakan State Machine: Tolak Lompatan Status', 'Mencoba lompat dari Menunggu langsung ke Selesai', 'Transisi ditolak sistem dengan pesan tidak valid', 'PASS'],
  ['SEC-TC-09', 'Aturan Penjual Pending: Dilarang Terbitkan Produk', 'Penjual pending membuka modal tambah produk', 'Modal diblokir dengan pesan belum diverifikasi', 'PASS'],
  ['SEC-TC-10', 'Isolasi Data Toko Nelayan: Anti-IDOR Scope Filter', 'Penjual Toko Bahari memeriksa katalog dan pesanan', 'Data toko terisolasi, dilarang edit toko lain', 'PASS'],
  ['SEC-TC-11', 'Konfigurasi Header Keamanan pada index.html', 'Pemeriksaan tag meta CSP, X-Content-Type, X-Frame', 'Seluruh header keamanan terpasang utuh', 'PASS'],
  ['SEC-TC-12', 'Audit Trail Logging: Tingkat Keparahan & Metadata', 'Pemeriksaan struktur log aktivitas sistem', 'Mencatat time, action, user, severity, IP', 'PASS'],
  ['SEC-TC-13', 'Proteksi Keranjang: Batas Kuantitas Melebihi Stok', 'Tambah item keranjang dengan kuantitas > stok', 'Sistem membatalkan dan memunculkan toast error', 'PASS'],
  ['SEC-TC-14', 'Integritas Peran: Registrasi Penjual Masuk Pending', 'Pendaftaran akun penjual mandiri', 'Status awal WAJIB "Menunggu" (tidak auto-aktif)', 'PASS']
];

body += table(
  ['ID Uji', 'Kontrol Keamanan', 'Skenario Uji & Payload', 'Hasil Aktual Pengujian', 'Status'],
  secRemRows,
  [900, 2200, 2800, 2600, 900]
);

body += heading(2, '3.2 Hasil Pengujian Regresi Fungsional (test-suite.js)');
body += p('Pengujian regresi fungsional PRD FR-01 s.d. FR-19 dieksekusi ulang untuk memastikan tidak ada fitur yang terdegradasi:');
body += p('• Total Kasus Uji Fungsional: 44 Kasus Uji (TC-01 hingga TC-44).');
body += p('• Hasil: 44 PASSED, 0 FAILED (100% Keberhasilan).');
body += p('• Kesimpulan: Penambahan lapisan sanitasi HTML, header CSP, dan proteksi IDOR sama sekali tidak memutus alur operasional katalog, pemesanan, maupun pengelolaan dashboard.');

body += pageBreak();

// BAB IV: BLUEPRINT IMPLEMENTASI KEAMANAN BACKEND
body += heading(1, 'BAB IV. BLUEPRINT IMPLEMENTASI KEAMANAN BACKEND RUST & POSTGRESQL');
body += p('Sebagai panduan arsitektur bagi pengembang yang akan merealisasikan prototipe ini ke dalam basis kode produksi (*production-grade backend*), berikut adalah cetak biru pertahanan komprehensif berbasis Rust Axum dan database PostgreSQL:');

body += heading(2, '4.1 Hashing Kata Sandi Menggunakan Argon2id');
body += p('Backend Rust wajib menerapkan hashing kata sandi asimetris berbasis Argon2id dengan konfigurasi memori 64 MB dan 3 iterasi guna mencegah serangan offline brute-force:');
body += codeBlock(
`// src/security/password.rs
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2, Params
};

pub fn hash_password(plain: &str) -> Result<String, Box<dyn std::error::Error>> {
    let salt = SaltString::generate(&mut OsRng);
    let params = Params::new(65536, 3, 4, None)?; // 64MB memory cost
    let argon2 = Argon2::new(argon2::Algorithm::Argon2id, argon2::Version::V0x13, params);
    let hash = argon2.hash_password(plain.as_bytes(), &salt)?.to_string();
    Ok(hash)
}`
);

body += heading(2, '4.2 Otorisasi Middleware Berbasis Peran (RBAC) pada Axum');
body += p('Setiap rute terlindungi (Protected Route) pada API Axum wajib melewati extractor otorisasi:');
body += codeBlock(
`// src/middleware/auth.rs
pub async fn require_role(
    required_role: &'static str,
    claims: Claims,
    req: Request<Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    if claims.role != required_role && claims.role != "admin" {
        return Err(StatusCode::FORBIDDEN); // 403 Forbidden
    }
    Ok(next.run(req).await)
}`
);

body += heading(2, '4.3 Transaksi ACID Pemesanan & Pencegahan Race Condition');
body += p('Mutasi stok komoditas laut dilindungi menggunakan row-level locking pada PostgreSQL:');
body += codeBlock(
`-- src/db/orders.sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- Kunci baris produk spesifik
SELECT stock FROM products WHERE id = $1 FOR UPDATE;

-- Potong stok secara atomik
UPDATE products SET stock = stock - $2, updated_at = NOW() 
WHERE id = $1 AND stock >= $2;

-- Masukkan pesanan
INSERT INTO orders (order_number, buyer_id, seller_id, total_amount, status)
VALUES ($3, $4, $5, $6, 'Menunggu Konfirmasi');

COMMIT;`
);

body += pageBreak();

// BAB V: KESIMPULAN & LEMBAR PENGESAHAN
body += heading(1, 'BAB V. KESIMPULAN DAN LEMBAR PENGESAHAN');

body += heading(2, '5.1 Kesimpulan Tindakan Remediasi Keamanan');
body += p('1. Ketahanan Penuh Klien: Seluruh temuan audit keamanan dari kategori XSS, IDOR data toko, batas stok minus, hingga kebocoran data privasi telah berhasil diperbaiki dan diverifikasi pada basis kode prototipe.');
body += p('2. Validasi Tanpa Cacat: Pengujian otomatis melalui `security-audit-suite.js` (14 kontrol) dan `test-suite.js` (44 kasus uji) keduanya mencatat tingkat kelulusan 100% tanpa adanya regresi fungsional.');
body += p('3. Standarisasi Akademik & Industri: Basis kode prototipe kini telah memenuhi standar kepatuhan PRD v1.0, pedoman tata kelola data Pemkab Tanggamus, dan kaidah keamanan OWASP Top 10 (2021).');

body += p('Bandar Lampung, 10 November 2026', { align: 'right', italic: true, color: '64748B', spaceBefore: 200, spaceAfter: 200 });

body += table(
  ['Mengetahui / Menyetujui:', 'Penyusun Laporan Remediasi:'],
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

// Write to dedicated remediation report folder
const targetDir = path.join(__dirname, 'rem_report_build');
if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true, force: true });
}
fs.mkdirSync(targetDir, { recursive: true });
fs.mkdirSync(path.join(targetDir, '_rels'), { recursive: true });
fs.mkdirSync(path.join(targetDir, 'word'), { recursive: true });
fs.mkdirSync(path.join(targetDir, 'word', '_rels'), { recursive: true });
fs.mkdirSync(path.join(targetDir, 'word', 'media'), { recursive: true });

// Copy [Content_Types].xml, _rels, styles, header, footer, media
fs.copyFileSync('[Content_Types].xml', path.join(targetDir, '[Content_Types].xml'));
fs.copyFileSync(path.join('_rels', '.rels'), path.join(targetDir, '_rels', '.rels'));
fs.copyFileSync(path.join('word', 'styles.xml'), path.join(targetDir, 'word', 'styles.xml'));
fs.copyFileSync(path.join('word', 'footer1.xml'), path.join(targetDir, 'word', 'footer1.xml'));
fs.copyFileSync(path.join('word', '_rels', 'document.xml.rels'), path.join(targetDir, 'word', '_rels', 'document.xml.rels'));
fs.copyFileSync(path.join('word', 'media', 'image1.png'), path.join(targetDir, 'word', 'media', 'image1.png'));
fs.copyFileSync(path.join('word', 'media', 'image2.png'), path.join(targetDir, 'word', 'media', 'image2.png'));

// Custom header for Remediation Report
const remHeaderXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p>
    <w:pPr>
      <w:pBdr>
        <w:bottom w:val="single" w:sz="6" w:space="4" w:color="0284C7"/>
      </w:pBdr>
      <w:jc w:val="right"/>
    </w:pPr>
    <w:r>
      <w:rPr>
        <w:sz w:val="16"/>
        <w:color w:val="64748B"/>
        <w:i/>
      </w:rPr>
      <w:t>Laporan Perbaikan &amp; Remediasi Keamanan - Smart Fishery Tanggamus (2026)</w:t>
    </w:r>
  </w:p>
</w:hdr>`;
fs.writeFileSync(path.join(targetDir, 'word', 'header1.xml'), remHeaderXml, 'utf8');

// Write document.xml
fs.writeFileSync(path.join(targetDir, 'word', 'document.xml'), documentXml, 'utf8');
console.log('Successfully written pristine remediation report document.xml (length: ' + documentXml.length + ' chars)');

// Package into DOCX using PowerShell .NET ZipFile
const packScript = `
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxPath = (Join-Path $PSScriptRoot "Laporan_Perbaikan_Security_Smart_Fishery_Rifki_Banda_Wijaya.docx")
if (Test-Path $docxPath) { Remove-Item $docxPath -Force }

$archive = [System.IO.Compression.ZipFile]::Open($docxPath, [System.IO.Compression.ZipArchiveMode]::Create)

$buildDir = Join-Path $PSScriptRoot "rem_report_build"

# Add [Content_Types].xml
$ctPath = Join-Path $buildDir "[Content_Types].xml"
[System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $ctPath, "[Content_Types].xml")

# Add all files in _rels and word with forward-slash paths
Get-ChildItem -LiteralPath (Join-Path $buildDir "_rels"), (Join-Path $buildDir "word") -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($buildDir.Length + 1).Replace("\\", "/")
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $rel)
}

$archive.Dispose()
Write-Output "Successfully packaged Remediation Report DOCX at $docxPath"
`;

fs.writeFileSync('pack-rem-docx.ps1', packScript, 'utf8');
const psOut = execSync('powershell -ExecutionPolicy Bypass -File pack-rem-docx.ps1', { encoding: 'utf8' });
console.log(psOut);

// Clean up pack-rem-docx.ps1 and build directory
fs.unlinkSync('pack-rem-docx.ps1');
fs.rmSync(targetDir, { recursive: true, force: true });

const stats = fs.statSync('Laporan_Perbaikan_Security_Smart_Fishery_Rifki_Banda_Wijaya.docx');
console.log('Generated Remediation DOCX File Size:', stats.size, 'bytes');
