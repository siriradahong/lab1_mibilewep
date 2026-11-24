// สร้างตารางและใส่ข้อมูลตัวอย่าง (ข้อมูลสมมติสำหรับการเรียน ไม่ใช่ราคาจริง)
import { db } from './database.js';

db.exec(`
  DROP TABLE IF EXISTS products;
  CREATE TABLE products (
    id          INTEGER PRIMARY KEY,
    name        TEXT    NOT NULL,
    brand       TEXT    NOT NULL,
    cpu         TEXT    NOT NULL,
    ram_gb      INTEGER NOT NULL,
    storage_gb  INTEGER NOT NULL,
    price       INTEGER NOT NULL,
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
  );
`);

const products = [
  ['Aster Book 14',     'Aster',  'Core i5',       16,  512, 21990],
  ['Aster Book 16 Pro', 'Aster',  'Core i7',       32, 1024, 38990],
  ['Kirin Air 13',      'Kirin',  'Ryzen 5',        8,  256, 15990],
  ['Kirin Play 15',     'Kirin',  'Ryzen 7',       16,  512, 29990],
  ['Nimbus Slim 14',    'Nimbus', 'Core Ultra 5',  16,  512, 26990],
  ['Nimbus Creator 16', 'Nimbus', 'Core Ultra 7',  32, 1024, 45990],
  ['Orca Student 15',   'Orca',   'Core i3',        8,  256, 13490],
  ['Orca Gamer 15',     'Orca',   'Ryzen 7',       16, 1024, 32990],
];

const insert = db.prepare(
  'INSERT INTO products (name, brand, cpu, ram_gb, storage_gb, price) VALUES (?, ?, ?, ?, ?, ?)'
);
for (const p of products) insert.run(...p);

console.log(`ใส่ข้อมูลสินค้า ${products.length} รายการลงใน data/notebooks.db แล้ว`);
