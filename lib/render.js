// แม่แบบ HTML ที่ใช้ร่วมกันระหว่าง SSG (ตอน build) และ SSR (ตอนมีคำขอ)

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

const baht = new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 });

export function renderProductList(products) {
  return products.map((p) => `
      <li class="product">
        <h2>${escapeHtml(p.name)}</h2>
        <p class="spec">${escapeHtml(p.cpu)} / RAM ${p.ram_gb} GB / ${p.storage_gb} GB</p>
        <p class="price">${baht.format(p.price)}</p>
        <p class="updated">แก้ไขล่าสุดในฐานข้อมูล: ${escapeHtml(p.updated_at)}</p>
      </li>`).join('');
}

/**
 * mode: 'SSG' | 'SSR'
 * where: คำอธิบายว่า HTML ถูกสร้างที่ไหน
 */
export function renderPage({ mode, where, products }) {
  const generatedAt = new Date().toLocaleString('th-TH');
  return `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ร้านโน้ตบุ๊ก (${mode})</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body class="mode-${mode.toLowerCase()}">
  <header class="site">
    <a href="/" class="home">ร้านโน้ตบุ๊ก</a>
    <p class="badge">${mode}</p>
  </header>
  <main>
    <section class="origin" aria-label="ที่มาของ HTML">
      <p><strong>HTML หน้านี้สร้างที่:</strong> ${escapeHtml(where)}</p>
      <p><strong>สร้างเมื่อ:</strong> ${generatedAt}</p>
    </section>
    <ul class="products">${renderProductList(products)}
    </ul>
  </main>
  <footer class="site"><p id="secure-status">กำลังตรวจ Secure Context…</p></footer>
  <script src="/secure-check.js"></script>
</body>
</html>`;
}
