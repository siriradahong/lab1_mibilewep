// SSG: อ่านฐานข้อมูลครั้งเดียวตอน build แล้วเขียนเป็นไฟล์ HTML คงที่
import { writeFileSync } from 'node:fs';
import { getProducts } from '../db/database.js';
import { renderPage } from '../lib/render.js';

const html = renderPage({
  mode: 'SSG',
  where: 'เครื่องของผู้พัฒนา ตอนรันคำสั่ง npm run build:ssg (ไฟล์นี้ไม่เปลี่ยนจนกว่าจะ build ใหม่)',
  products: getProducts(),
});

writeFileSync(new URL('../public/ssg/index.html', import.meta.url), html);
console.log('สร้าง public/ssg/index.html แล้ว');
