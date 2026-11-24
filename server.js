// เซิร์ฟเวอร์เดียวที่ให้บริการทั้งสามแบบ
import express from 'express';
import os from 'node:os';
import { getProducts, updatePrice } from './db/database.js';
import { renderPage, escapeHtml } from './lib/render.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

// SSG และ CSR: เซิร์ฟเวอร์ส่งไฟล์คงที่จากโฟลเดอร์ public เท่านั้น
app.use(express.static('public'));

// SSR: อ่านฐานข้อมูลและสร้าง HTML ใหม่ทุกครั้งที่มีคำขอ
app.get('/ssr', (req, res) => {
  res.send(renderPage({
    mode: 'SSR',
    where: 'เซิร์ฟเวอร์ (server.js) ทุกครั้งที่มีคำขอเข้ามา',
    products: getProducts(),
  }));
});

// API สำหรับ CSR: ส่งข้อมูลเป็น JSON ให้เบราว์เซอร์สร้าง HTML เอง
app.get('/api/products', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json(getProducts());
});

// หน้าแก้ราคา ใช้ทดลองว่าแต่ละแบบเห็นการเปลี่ยนแปลงเมื่อใด
app.get('/admin', (req, res) => {
  const rows = getProducts().map((p) => `
    <tr>
      <th scope="row">${escapeHtml(p.name)}</th>
      <td>
        <form method="post" action="/admin/price" class="price-form">
          <input type="hidden" name="id" value="${p.id}">
          <label class="visually-hidden" for="price-${p.id}">ราคาใหม่ของ ${escapeHtml(p.name)}</label>
          <input id="price-${p.id}" name="price" type="number" inputmode="numeric" min="0" step="10" value="${p.price}" required>
          <button type="submit">บันทึกราคา</button>
        </form>
      </td>
    </tr>`).join('');
  const notice = req.query.updated ? '<p class="notice" role="status">บันทึกราคาแล้ว</p>' : '';
  res.send(`<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>แก้ราคาสินค้า</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body class="mode-admin">
  <header class="site"><a href="/" class="home">ร้านโน้ตบุ๊ก</a><p class="badge">แก้ราคา</p></header>
  <main>
    <h1>แก้ราคาสินค้าในฐานข้อมูล</h1>
    ${notice}
    <div class="table-wrap">
      <table>
        <caption>ราคาจะเปลี่ยนในฐานข้อมูลทันที แต่แต่ละหน้าเห็นการเปลี่ยนแปลงไม่พร้อมกัน</caption>
        <thead><tr><th scope="col">รุ่น</th><th scope="col">ราคา (บาท)</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </main>
</body>
</html>`);
});

app.post('/admin/price', (req, res) => {
  const id = Number(req.body.id);
  const price = Number(req.body.price);
  if (!Number.isInteger(id) || !Number.isFinite(price) || price < 0) {
    return res.status(400).send('ข้อมูลไม่ถูกต้อง: ต้องระบุรหัสสินค้าและราคาที่ไม่ติดลบ');
  }
  updatePrice(id, Math.round(price));
  res.redirect(303, '/admin?updated=1');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`เปิดบนเครื่องนี้:  http://localhost:${PORT}`);
  for (const nets of Object.values(os.networkInterfaces())) {
    for (const n of nets ?? []) {
      if (n.family === 'IPv4' && !n.internal) console.log(`เปิดจากโทรศัพท์ (Wi-Fi เดียวกัน): http://${n.address}:${PORT}`);
    }
  }
});
