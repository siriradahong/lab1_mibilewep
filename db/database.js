// ฐานข้อมูลชุดเดียวที่ทั้งสามแบบใช้ร่วมกัน (SQLite ที่ติดมากับ Node.js)
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'notebooks.db');
export const db = new DatabaseSync(dbPath);

export function getProducts() {
  return db.prepare(
    'SELECT id, name, brand, cpu, ram_gb, storage_gb, price, updated_at FROM products ORDER BY price'
  ).all();
}

export function updatePrice(id, price) {
  // ใช้ prepared statement เสมอ ไม่ต่อสตริง SQL เอง (บทที่ 2)
  return db.prepare(
    "UPDATE products SET price = ?, updated_at = datetime('now', 'localtime') WHERE id = ?"
  ).run(price, id);
}
